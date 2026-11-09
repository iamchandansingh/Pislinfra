import { spawn } from 'child_process';
import http from 'http';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9222;

console.log('🚀 Launching Chrome Headless...');
const chromeProc = spawn(CHROME_PATH, [
  '--headless=new',
  `--remote-debugging-port=${PORT}`,
  '--no-first-run',
  '--no-default-browser-check',
  '--user-data-dir=/tmp/chrome-debug-profile',
  'about:blank'
], { stdio: 'ignore' });

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getWsUrl() {
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json`);
      if (res.ok) {
        const list = await res.json();
        if (list && list.length > 0 && list[0].webSocketDebuggerUrl) {
          return list[0].webSocketDebuggerUrl;
        }
      }
    } catch (e) {}
    await sleep(200);
  }
  throw new Error('Chrome remote debug port failed to respond');
}

async function run() {
  try {
    const wsUrl = await getWsUrl();
    console.log('✅ Connected to Chrome CDP:', wsUrl);

    const ws = new WebSocket(wsUrl);

    let id = 1;
    const send = (method, params = {}) => {
      const msgId = id++;
      ws.send(JSON.stringify({ id: msgId, method, params }));
      return msgId;
    };

    await new Promise(resolve => ws.onopen = resolve);

    console.log('🛰️ Enabling Runtime, Console, Page, Network...');
    send('Runtime.enable');
    send('Console.enable');
    send('Page.enable');
    send('Network.enable');

    const consoleLogs = [];
    const errors = [];
    const networkRequests = [];

    let evalId = -1;
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === evalId) {
        console.log('\n🔥 ROOT CONTENT IN BROWSER:', msg.result?.result?.value);
      }
      if (msg.method === 'Network.requestWillBeSent') {
        console.log(`[REQUEST]: ${msg.params.request.method} ${msg.params.request.url} (Type: ${msg.params.type})`);
      }
      if (msg.method === 'Runtime.consoleAPICalled') {
        const args = (msg.params.args || []).map(a => a.value || a.description || JSON.stringify(a)).join(' ');
        console.log(`[BROWSER CONSOLE ${msg.params.type.toUpperCase()}]:`, args);
        consoleLogs.push({ type: msg.params.type, text: args });
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        const text = msg.params.exceptionDetails?.exception?.description || msg.params.exceptionDetails?.text;
        console.error(`❌ [BROWSER EXCEPTION]:`, text);
        errors.push(text);
      }
      if (msg.method === 'Network.responseReceived') {
        const { url, status, statusText } = msg.params.response;
        console.log(`[RESPONSE]: ${status} ${statusText} -> ${url}`);
        networkRequests.push({ url, status });
      }
      if (msg.method === 'Network.loadingFailed') {
        console.error(`[NETWORK FAILED]: ${msg.params.errorText} -> ${msg.params.requestId}`);
      }
    };

    console.log('🌐 Navigating to https://pislinfra.com/about/leadership/ ...');
    send('Page.navigate', { url: 'https://pislinfra.com/about/leadership/' });

    // Wait 8 seconds to capture everything
    await sleep(8000);

    // Evaluate root innerHTML
    evalId = send('Runtime.evaluate', {
      expression: 'JSON.stringify({ root: document.getElementById("root")?.innerHTML?.substring(0, 500), main: document.querySelector("main")?.innerHTML?.substring(0, 1000) })'
    });

    await sleep(2000);

    console.log('\n--- DIAGNOSTIC SUMMARY ---');
    console.log('Total Console logs:', consoleLogs.length);
    console.log('Total Exceptions:', errors.length);
    console.log('Total Network requests:', networkRequests.length);

    ws.close();
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    chromeProc.kill();
  }
}

run();
