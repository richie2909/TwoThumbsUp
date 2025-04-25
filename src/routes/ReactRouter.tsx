import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Upload from '../pages/Upload.jsx'; // Corrected file extension
import NotFound from '../pages/NotFound';
import About from '../pages/About'; // Corrected file extension
import Admin from '../pages/Admin'; // Added admin route
import ProtectedRoute from '../pages/ProtectedRoute' //added protected route
import Search from '../pages/Search.js';
import CookiePolicy from '../components/Cookie.js';
import PrivacyPolicy from '../components/Policy.js';
import TermsOfService from '../components/Terms.js';
import BlogPostDetail from '../components/BlogPostDetail';

export const ReactRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/terms' element={<TermsOfService/>}></Route>
        <Route path='/privacy' element={<PrivacyPolicy/>}></Route>
        <Route path='/cookie' element={<CookiePolicy/> }></Route>
        <Route path="/about" element={<About />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path='/search' element={ <Search />}></Route>
        <Route path="/blog/:id" element={<BlogPostDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};