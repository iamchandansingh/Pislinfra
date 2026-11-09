import React, { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import { BlogProvider } from './context/BlogContext'

// Lazy Load Secondary Pages for Ultra-Fast 0ms Loading
const NotFound = lazy(() => import('./pages/NotFound'))
const CoverageMap = lazy(() => import('./components/coverage/CoverageMap'))

// About Pages
const Overview = lazy(() => import('./pages/about/Overview'))
const Leadership = lazy(() => import('./pages/about/Leadership'))
const EHS = lazy(() => import('./pages/about/EHS'))
const Awards = lazy(() => import('./pages/about/Awards'))
const CSR = lazy(() => import('./pages/about/CSR'))
const PoliciesGovernance = lazy(() => import('./pages/about/PoliciesGovernance'))

// Project Pages
const OngoingProjects = lazy(() => import('./pages/projects/OngoingProjects'))
const CompletedProjects = lazy(() => import('./pages/projects/CompletedProjects'))
const CaseStudy = lazy(() => import('./pages/projects/CaseStudy'))
const CaseStudyDetail = lazy(() => import('./pages/projects/CaseStudyDetail'))
const ProjectDetail = lazy(() => import('./pages/projects/ProjectDetail'))

// Services Pages
const ServicesPage = lazy(() => import('./pages/solutions/page'))
const Industrial = lazy(() => import('./pages/solutions/Industrial'))
const Infrastructure = lazy(() => import('./pages/solutions/Infrastructure'))
const Logistic = lazy(() => import('./pages/solutions/Logistic'))
const Warehouse = lazy(() => import('./pages/solutions/Warehouse'))

// Corporate & Content Pages
const Blog = lazy(() => import('./pages/Blog'))
const BlogDetail = lazy(() => import('./pages/BlogDetail'))
const Careers = lazy(() => import('./pages/Careers'))
const ContactUs = lazy(() => import('./pages/ContactUs'))
const AnnualReports = lazy(() => import('./pages/AnnualReports'))
const Sitemap = lazy(() => import('./pages/Sitemap'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))

// Ultra-fast lightweight page loading indicator
export const PageLoader = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', width: '100%' }}>
    <div style={{ width: '40px', height: '40px', border: '3px solid #f3f3f3', borderTop: '3px solid #ff904e', borderRadius: '50%', animation: 'pislSpin 0.7s linear infinite' }} />
    <style>{`@keyframes pislSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

// Resilient Route Error Boundary (auto-retries stale chunks upon new deployments)
class RouteErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('Route error caught by boundary:', error, errorInfo);
    const msg = error?.message || '';
    if (msg.includes('dynamically imported module') || msg.includes('Loading chunk') || msg.includes('Failed to fetch')) {
      const refreshed = sessionStorage.getItem('pisl_chunk_retry');
      if (!refreshed) {
        sessionStorage.setItem('pisl_chunk_retry', '1');
        window.location.reload();
      }
    }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: 'center', padding: '80px 20px', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '12px' }}>Loading Pislinfra...</h2>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>Updating page resources from local cache.</p>
          <button 
            onClick={() => { sessionStorage.removeItem('pisl_chunk_retry'); window.location.reload(); }}
            style={{ padding: '10px 24px', background: '#ff904e', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <BlogProvider>
      <RouteErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="coverage" element={<CoverageMap />} />
              <Route path="about" element={<Overview />} />
              <Route path="about/leadership" element={<Leadership />} />
              <Route path="about/ehs" element={<EHS />} />
              <Route path="about/awards" element={<Awards />} />
              <Route path="about/csr" element={<CSR />} />
              {/* Policies & Governance; slug is managed in Strapi (static about/* routes above take precedence) */}
              <Route path="about/:slug" element={<PoliciesGovernance />} />
              <Route path="projects" element={<OngoingProjects />} />
              <Route path="projects/ongoing" element={<OngoingProjects />} />
              <Route path="projects/completed" element={<CompletedProjects />} />
              <Route path="projects/case-study" element={<CaseStudy />} />
              <Route path="projects/case-study/:slug" element={<CaseStudyDetail />} />
              <Route path="solutions" element={<ServicesPage />} />
              <Route path="solutions/industrial" element={<Industrial />} />
              <Route path="solutions/infrastructure" element={<Infrastructure />} />
              <Route path="solutions/logistic" element={<Logistic />} />
              <Route path="solutions/warehouse" element={<Warehouse />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/ndustrial-construction-modern-infrastructure-growth" element={<Navigate to="/blog/industrial-construction-modern-infrastructure-growth" replace />} />
              <Route path="blog/:slug" element={<BlogDetail />} />
              <Route path="careers" element={<Careers />} />
              <Route path="contact-us" element={<ContactUs />} />
              <Route path="annual-reports" element={<AnnualReports />} />
              <Route path="sitemap" element={<Sitemap />} />
              <Route path="project/:type/:id" element={<ProjectDetail />} />
              <Route path="privacy-policy" element={<PrivacyPolicy />} />
              <Route path="company-policy" element={<PoliciesGovernance />} />
              <Route path="policies-governance" element={<Navigate to="/company-policy" replace />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </RouteErrorBoundary>
    </BlogProvider>
  )
}

export default App