import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import CoverageMap from './components/coverage/CoverageMap'

// About Pages
import Overview from './pages/about/Overview'
import Leadership from './pages/about/Leadership'
import EHS from './pages/about/EHS'
import Awards from './pages/about/Awards'
import CSR from './pages/about/CSR'

// Project Pages
import OngoingProjects from './pages/projects/OngoingProjects'
import CompletedProjects from './pages/projects/CompletedProjects'
import CaseStudy from './pages/projects/CaseStudy'

// Services Pages
import ServicesPage from './pages/solutions/page'
import Industrial from './pages/solutions/Industrial'
import Infrastructure from './pages/solutions/Infrastructure'
import Logistic from './pages/solutions/Logistic'
import Warehouse from './pages/solutions/Warehouse'

import Blog from './pages/Blog'
import BlogDetail from './pages/BlogDetail'
import Careers from './pages/Careers'
import ContactUs from './pages/ContactUs'
import AnnualReports from './pages/AnnualReports'
import Sitemap from './pages/Sitemap'
import ProjectDetail from './pages/projects/ProjectDetail'
import CaseStudyDetail from './pages/projects/CaseStudyDetail'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="coverage" element={<CoverageMap />} />
        <Route path="about" element={<Overview />} />
        <Route path="about/leadership" element={<Leadership />} />
        <Route path="about/ehs" element={<EHS />} />
        <Route path="about/awards" element={<Awards />} />
        <Route path="about/csr" element={<CSR />} />
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
        <Route path="blog/:slug" element={<BlogDetail />} />
        <Route path="careers" element={<Careers />} />
        <Route path="contact-us" element={<ContactUs />} />
        <Route path="annual-reports" element={<AnnualReports />} />
        <Route path="sitemap" element={<Sitemap />} />
        <Route path="project/:type/:id" element={<ProjectDetail />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App