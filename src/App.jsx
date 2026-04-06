import { Routes, Route, useLocation } from "react-router-dom";

import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Event/Dashboard";
import EventForm from "./pages/Event/EventForm";
import LuckyDraw from "../src/pages/LuckyDraw/LuckyDraw";
import EventRegistration from "./components/services/EventRegistration";
import LuckydrawServices from "./components/services/LuckydrawServices";
import FoodManagement from "./components/services/FoodManagement";
import DashboardSystemPage from "./components/services/DashboardSystemPage";
import ScrollToTop from "./components/ScrollToTop";
import UserDetail from "./pages/Event/UserDetail";
import BlogPage from "./components/BlogPage";
import HelpCenter from "./components/HelpCenter";
import PrivacyPolicy from "./components/PrivacyPolicy";
import RegisterForm from "./pages/Auth/RegisterForm";
import MemberDashBoard from "./pages/Scan/MemberDashBoard";
import QRCodeForm from "./components/QRCodeFom/QRCodeForm";
import GiftStatusPage from "./pages/Event/GiftStatusPage";

// 🔐 ELECTION
import ElectionHome from "./pages/Election/ElectionHome";
import CandidateDashboard from "./pages/Election/CandidateDashboard";
import ParticipantDashboard from "./pages/Election/ParticipantDashboard";
import ElectionManagementPlatform from "./pages/Election/ElectionManagementPlatform";
import ElectionForm from "./pages/Election/ElectionForm";
import VotingPage from "./pages/Election/VotingPage";

// 👤 ADMIN
import AdminDashboard from "./pages/AdminDashboard";
import AdminProtectedRoute from "./routes/AdminProtectedRoute";

//Luckydraw
import LuckyDrawParticipantDashboard from "./pages/LuckyDraw/LuckyDrawParticipantDashboard";
import RegistrationFormLuckydraw from "./pages/LuckyDraw/RegistrationFormLuckydraw";
import EventGallery from "./pages/EventGallery";
import LuckyDrawHome from "./pages/LuckyDraw/LuckyDrawHome";
import LuckyDrawDashboard from "./pages/LuckyDraw/LuckyDrawDashboard";
import ParticipantDetailsPage from "./pages/LuckyDraw/ParticipantDetailsPage";

// Bedding
import BiddingDashboard from "./pages/Bidding/BiddingDashboardHome";
import BiddingForm from "./pages/Bidding/BiddingForm";
import Participants from "./pages/Bidding/ParticipantsDashboard";
import AdminBiddingDashboard from "./pages/Bidding/AdminBiddingDashboard";
import ParticipantBiddingPage from "./pages/Bidding/ParticipantBiddingPage";
import EventManagementHomePage from "./pages/Event/EventManagementHomePage";
import EventLuckydraw from "./pages/Event/EventLuckydraw";
//event booking
import EventBookingHome from "./pages/EventBooking/EventBookingHome";
import EventBookingDashboard from "./pages/EventBooking/EventBookingDashboard";
import EventBookingTicketPage from "./pages/EventBooking/EventBookingTicketPage";
import EventTicketBookingForm from "./pages/EventBooking/EventTicketBookingForm";
import ParticipantTicketPage from "./pages/EventBooking/ParticipantTicketPage";
import EventQrCodeScanner from "./pages/EventBooking/EventQrCodeScanner";
export default function App() {
  const location = useLocation();

  // 🚫 Hide Navbar & Footer on specific pages
  const hideLayout =
    location.pathname === "/event-form" ||
    location.pathname === "/giftstatus" ||
    location.pathname === "/eventform-qr" ||
    location.pathname === "/scanDashboard" ||
    location.pathname === "/regeve-admin" ||
    location.pathname === "/participationDashboard" ||
    location.pathname.includes("/luckydraw-dashboard") ||
    location.pathname.includes("/luckydraw-form") ||
    location.pathname.includes("/luckydraw") ||
    // ✅ FIXED — Candidate Dashboard
    location.pathname.includes("/candidate-dashboard/") ||
    // ✅ Participant Dashboard (FIXED)
    location.pathname.includes("/participant-dashboard/") ||
    // election pages
    location.pathname.includes("/electionhome") ||
    location.pathname.startsWith("/electionForm") ||
    // admin dashboard
    location.pathname.endsWith("/admindashboard") ||
    location.pathname.includes("/votingpage/") ||
    location.pathname.includes("/LuckyDrawHome") ||
    location.pathname.includes("/participant-page/") ||
    // bidding dashbord
    location.pathname.includes("/bidding-dashboard") ||
    location.pathname.includes("/bid-partcipant-form/") ||
    location.pathname.includes("/admin-bidding-dashboard/") ||
    location.pathname.includes("/bidding-participants/") ||
    location.pathname.includes("/participant-bidding") ||
    //event-management
    location.pathname.includes("/event-home") ||
    location.pathname.includes("/dashboard/") ||
    location.pathname.includes("/event-form/") ||
    location.pathname.includes("/event-luckydraw") ||
    location.pathname.includes("/giftstatus") ||
    location.pathname.includes("/member-details/") ||
    location.pathname.includes("/scanDashboard/") ||
    //event booking
    location.pathname.includes("/event-booking") ||
    location.pathname.includes("/eventbooking-dashboard") ||
    location.pathname.includes("/events") ||
    location.pathname.includes("/checkout") ||
    location.pathname.includes("/participant-ticketpage") ||
    location.pathname.includes("/event-qrscanner");

  return (
    <div className="max-w-full overflow-x-hidden">
      <ScrollToTop />

      {!hideLayout && <Navbar />}

      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/eventgallery" element={<EventGallery />} />
        {/* ================= SERVICES ================= */}

        <Route path="/event-form" element={<EventForm />} />
        <Route
          path="/:adminId/luckydraw/:luckydrawDocumentId"
          element={<LuckyDraw />}
        />
        <Route path="/service/registration" element={<EventRegistration />} />
        <Route
          path="/service/luckydraw-system-page"
          element={<LuckydrawServices />}
        />
        <Route path="/service/food-management" element={<FoodManagement />} />
        <Route
          path="/service/dashboard-system-page"
          element={<DashboardSystemPage />}
        />
        {/* ================= AUTH ================= */}
        <Route path="/regeve-admin" element={<RegisterForm />} />
        {/* ================= MEMBER / QR ================= */}

        <Route path="/scanDashboard" element={<MemberDashBoard />} />
        <Route path="/eventform-qr" element={<QRCodeForm />} />

        {/* ================= ADMIN PROTECTED ================= */}
        <Route
          path="/:adminId/electionhome"
          element={
            <AdminProtectedRoute>
              <ElectionHome />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/:adminId/luckydraw-dashboard/:luckydrawDocumentId"
          element={<LuckyDrawDashboard />}
        />
        <Route
          path="/:adminId/luckydraw-participant-dashboard/:luckydrawDocumentId"
          element={<LuckyDrawParticipantDashboard />}
        />
        <Route
          path="/:adminId/participant-page/:luckydrawDocumentId"
          element={<ParticipantDetailsPage />}
        />
        <Route
          path="/:adminId/luckydraw-form/:luckydrawDocumentId"
          element={<RegistrationFormLuckydraw />}
        />
        <Route
          path="/:adminId/candidate-dashboard/:electionDocumentId"
          element={
            <AdminProtectedRoute>
              <CandidateDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/:adminId/participant-dashboard/:electionDocumentId"
          element={<ParticipantDashboard />}
        />
        <Route
          path="/electionManagementplatform"
          element={<ElectionManagementPlatform />}
        />
        <Route
          path="/electionForm/:adminId/:electionDocumentId/:electionName"
          element={<ElectionForm />}
        />
        <Route
          path="/:adminId/votingpage/:electionDocumentId"
          element={<VotingPage />}
        />
        <Route path="/:adminId/LuckyDrawHome" element={<LuckyDrawHome />} />

        {/* ================= ADMIN DASHBOARD ================= */}
        <Route path="/:adminId/admindashboard" element={<AdminDashboard />} />

        {/* ================= FALLBACK ================= */}
        <Route path="/" element={<Home />} />
        {/* Bidding */}
        <Route
          path="/:adminId/bid-partcipant-form/:documentId"
          element={<BiddingForm />}
        />
        <Route
          path="/:adminId/bidding-dashboard"
          element={<BiddingDashboard />}
        />
        <Route
          path="/:adminId/bidding-dashboard/:documentId"
          element={<BiddingDashboard />}
        />
        <Route
          path="/:adminId/bidding-participants/:documentId"
          element={<Participants />}
        />

        <Route
          path="/:adminId/participant-bidding/:documentId"
          element={<ParticipantBiddingPage />}
        />

        <Route
          path="/:adminId/admin-bidding-dashboard/:documentId"
          element={<AdminBiddingDashboard />}
        />
        {/* ================= EVENT MANAGEMENT ================= */}

        <Route
          path="/:adminId/event-home"
          element={<EventManagementHomePage />}
        />
        <Route path="/:adminId/dashboard/:documentId" element={<Dashboard />} />
        <Route
          path="/:adminId/event-form/:documentId"
          element={<EventForm />}
        />
        <Route
          path="/:adminId/event-luckydraw/:documentId"
          element={<EventLuckydraw />}
        />
        <Route
          path="/:adminId/giftstatus/:documentId"
          element={<GiftStatusPage />}
        />
        <Route
          path="/:adminId/member-details/:documentId/:member_id"
          element={<UserDetail />}
        />
        <Route
          path="/scanDashboard/:documentId"
          element={<MemberDashBoard />}
        />

        {/* ================= EVENT BOOKING ================= */}

        <Route path="/:adminId/event-booking" element={<EventBookingHome />} />
        <Route
          path="/:adminId/eventbooking-dashboard/:documentId"
          element={<EventBookingDashboard />}
        />
        <Route
          path="/:adminId/events/:documentId"
          element={<EventBookingTicketPage />}
        />
        <Route
          path="/:adminId/checkout/:documentId"
          element={<EventTicketBookingForm />}
        />
        <Route
          path="/:adminId/participant-ticketpage/:participationId"
          element={<ParticipantTicketPage />}
        />
        <Route path="/event-qrscanner" element={<EventQrCodeScanner />} />
      </Routes>

      {!hideLayout && <Footer />}
    </div>
  );
}
