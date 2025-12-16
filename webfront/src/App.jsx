import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Signals from "./pages/Signals";
import Feed from "./pages/Feed";
import Subscription from "./pages/Subscription";
import AllMentors from "./pages/AllMentors";
import ScrollToTop from "./components/ScrollToTop";

// ===== Admin Imports =====
import Login from "./admin/pages/Login";
import Dashboard from "./admin/pages/Dashboard";
import Layout from "./admin/components/Layout";
import ResearchAnalyst from "./admin/pages/ResearchAnalyst";
import AnalystView from "./admin/pages/AnalystView";
import ForgotPassword from "./admin/pages/ForgotPassword";
import VerifyPassword from "./admin/pages/VerifyPassword";
import UpdatePassword from "./admin/pages/UpdatePassword";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/admin" replace />;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* ===== Public Website Routes ===== */}
        <Route
          path="/*"
          element={
            <>
              <Header />
              <main className="min-h-screen pt-16">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/signals" element={<Signals />} />
                  <Route path="/feed" element={<Feed />} />
                  <Route path="/subscriptions" element={<Subscription />} />
                  <Route path="/mentors" element={<AllMentors />} />
                </Routes>
              </main>
              <Footer />
            </>
          }
        />

        {/* ===== Admin Panel Routes (All start with /admin/*) ===== */}
        <Route path="/admin" element={<Login />} />
        <Route path="/admin/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/verify-password" element={<VerifyPassword />} />
        <Route path="/admin/update-password" element={<UpdatePassword />} />

        <Route path="/admin/dashboard"element={ <PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
        <Route path="/admin/research-analyst"element={ <PrivateRoute><Layout><ResearchAnalyst /></Layout></PrivateRoute>} />
        <Route path="/admin/research-analyst/:id"element={ <PrivateRoute><Layout><AnalystView /></Layout></PrivateRoute>} />

      </Routes>
    </Router>
  );
}

export default App;
