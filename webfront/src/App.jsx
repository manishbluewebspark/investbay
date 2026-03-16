import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import GeneralDashboard from "./admin/pages/GeneralDashboard";
import Layout from "./admin/components/Layout";
import ResearchAnalyst from "./admin/pages/ResearchAnalyst";
import AnalystView from "./admin/pages/AnalystView";
import ForgotPassword from "./admin/pages/ForgotPassword";
import VerifyPassword from "./admin/pages/VerifyPassword";
import UpdatePassword from "./admin/pages/UpdatePassword";
import PanelSignals from "./admin/pages/ra/PanelSignals";
import Plan from "./admin/pages/ra/Plan";
import AddPlans from "./admin/pages/ra/AddPlans";
import PlanDetails from "./admin/pages/ra/PlanDetails";
import SignalDetails from "./admin/pages/ra/SignalDetails";
import Courses from "./admin/pages/ra/Courses";
import CourseDetails from "./admin/pages/ra/CourseDetails";
import EditPlans from "./admin/pages/ra/EditPlans";

import UserLogin from "./pages/UserLogin";
import UserVerify from "./pages/UserVerify";
import LoginProfileForm from "./pages/LoginProfileForm";
import SetPassword from "./admin/pages/SetPassword";
import ProfilePage from "./pages/ProfilePage";
import MentorProfile from "./pages/MentorProfile";
import SubscriptionDetails from "./pages/SubscriptionDetails";
import AllCourses from "./pages/AllCourses";
import CourseDataDetails from "./pages/CourseDataDetails";
import AfterBeforeSubscription from "./admin/pages/AfterBeforeSubscription";
import Profile from "./admin/components/profile/Profile";
import AdminFeed from "./admin/pages/ra/AdminFeed";
import Earnings from "./admin/pages/ra/Earnings";
import CourseEarningView from "./admin/pages/ra/CourseEarningView";
import PlanEarningView from "./admin/pages/ra/PlanEarningView";
import FeedView from "./admin/pages/ra/FeedView";
import Users from "./admin/pages/Users";
import AdminLoginLogs from "./admin/pages/AdminLoginLogs";
import SinglePostView from "./admin/pages/SinglePostView";
import PlanPage from "./pages/Planpage";
import AdminNews from "./admin/pages/ra/AdminNews";
import News from "./pages/News";
import NewsDetail from "./pages/ NewsDetail";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/admin" replace />;
}


function PrivateRouteUser({ children }) {
  const token = localStorage.getItem("user");
  return token ? children : <Navigate to="/" replace />;
}



function App() {
  return (
    <Router>
      <ScrollToTop />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
      <Routes>
        {/* ===== Public Website Routes ===== */}
        <Route
          path="/*"
          element={
            <>
              <Header />
              <main className="min-h-screen pt-16">
                <Routes>
                  {/* <Route path="/" element={<Home />} /> */}
                  <Route path="/" element={<News />} />

                  
                  <Route path="/feed" element={<Signals />} />
                  
                  
                  <Route path="/signals" element={<Feed />} />
                  <Route path="/subscriptions" element={<Subscription />} />
                  <Route path="/subscription/:id" element={<PrivateRouteUser><SubscriptionDetails  /></PrivateRouteUser>} />
                  <Route path="/mentors" element={<AllMentors />} />
                  <Route path="/mentor/:id" element={<PrivateRouteUser><MentorProfile /></PrivateRouteUser>} />
                  <Route path="/plans/:id" element={<PrivateRouteUser><PlanPage /></PrivateRouteUser>} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/courses" element={<AllCourses />} />
                  <Route path="/courses/:id" element={<PrivateRouteUser><CourseDataDetails /></PrivateRouteUser>} />
                  <Route path="/feed-view/:feed_id" element={<PrivateRouteUser><SinglePostView /></PrivateRouteUser>} />
                  <Route path="/afterbeforesubscription/:id" element={<PrivateRouteUser><AfterBeforeSubscription /></PrivateRouteUser>} />
                   <Route path="/news/:id" element={<NewsDetail />} />
                  
                </Routes>
              </main>
              <Footer />
            </>
          }
        />

        {/* ===== Admin Panel Routes (All start with /admin/*) ===== */}
        <Route path="/admin" element={<Login />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/admin/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/verify-password" element={<VerifyPassword />} />
        <Route path="/admin/update-password" element={<UpdatePassword />} />
         <Route path="/set-password" element={<SetPassword />} />

        <Route path="/verify-otp" element={<UserVerify />} />
        <Route path="/login-profile-form" element={<LoginProfileForm />} />
        
        <Route path="/admin/profile" element={<PrivateRoute><Layout><Profile /></Layout></PrivateRoute>} />
        <Route path="/admin/logs" element={<PrivateRoute><Layout><AdminLoginLogs /></Layout></PrivateRoute>} />
        <Route path="/admin/dashboard" element={<PrivateRoute><Layout><GeneralDashboard /></Layout></PrivateRoute>} />
        <Route path="/admin/research-analyst" element={<PrivateRoute><Layout><ResearchAnalyst /></Layout></PrivateRoute>} />
        <Route path="/admin/research-analyst/:id" element={<PrivateRoute><Layout><AnalystView /></Layout></PrivateRoute>} />
         <Route path="/admin/users" element={<PrivateRoute><Layout><Users /></Layout></PrivateRoute>} />
        <Route path="/admin/signals" element={<PrivateRoute><Layout><PanelSignals /></Layout></PrivateRoute>} />
        <Route path="/admin/plan" element={<PrivateRoute><Layout><Plan /></Layout></PrivateRoute>} />
        <Route path="/admin/plan/add" element={<PrivateRoute><Layout><AddPlans /></Layout></PrivateRoute>} />
        <Route path="/admin/plan/details/:id" element={<PrivateRoute><Layout><PlanDetails /></Layout></PrivateRoute>} />
        <Route path="/admin/signals/details/:id" element={<PrivateRoute><Layout><SignalDetails /></Layout></PrivateRoute>} />
        <Route path="/admin/courses" element={<PrivateRoute><Layout><Courses /></Layout></PrivateRoute>} />
        <Route path="/admin/courses/details/:id" element={<PrivateRoute><Layout><CourseDetails /></Layout></PrivateRoute>} />
        <Route path="/admin/plan/edit/:id" element={<PrivateRoute><Layout><EditPlans /></Layout></PrivateRoute>} />
        <Route path="/admin/earnings" element={<PrivateRoute><Layout><Earnings /></Layout></PrivateRoute>} />
        <Route path="/admin/earnings/course-view" element={<PrivateRoute><Layout><CourseEarningView /></Layout></PrivateRoute>} />
        <Route path="/admin/earnings/plan-view" element={<PrivateRoute><Layout><PlanEarningView /></Layout></PrivateRoute>} />
        <Route path="/admin/adminfeed" element={<PrivateRoute><Layout><AdminFeed /></Layout></PrivateRoute>} />
        <Route path="/admin/adminfeed/view/:id" element={<PrivateRoute><Layout><FeedView /></Layout></PrivateRoute>} />
        <Route path="/admin/News" element={<PrivateRoute><Layout><AdminNews /></Layout></PrivateRoute>} />
        





      </Routes>
    </Router>
  );
}

export default App;
