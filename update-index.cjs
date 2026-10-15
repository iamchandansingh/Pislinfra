const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const headEndIndex = html.indexOf('</head>');

const tags = `
    <!-- Google Search Console Verification -->
    <meta name="google-site-verification" content="0kmwm4yffOPmuFL3UMn5FRxTOAQ0qXnhGUEtkhXI1oE" />

    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-KVFS7TKKZC"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-KVFS7TKKZC');
    </script>
`;

if (!html.includes('google-site-verification="0kmwm4yffOPmuFL3UMn5FRxTOAQ0qXnhGUEtkhXI1oE"')) {
    html = html.replace('</head>', tags + '\n  </head>');
    fs.writeFileSync('index.html', html, 'utf8');
    console.log("Tags added to index.html");
} else {
    console.log("Tags already exist in index.html");
}
