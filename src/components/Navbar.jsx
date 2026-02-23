import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogIn,
  Menu,
  X,
  LogOut,
  CheckCircle,
  XCircle,
  ChevronDown,
  User,
  LayoutDashboard,
} from "lucide-react";
import Login from "../pages/Auth/Login";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../assets/Logo.png";
import axios from "axios";

const Navbar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState({
    isOpen: false,
    type: "login",
  });
  const [userDropdown, setUserDropdown] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check if we are on the home page
  const isHome = location.pathname === "/";

  // Scroll listener to toggle glass effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openLogin = () => setAuthModal({ isOpen: true, type: "login" });
  const closeAuth = () => setAuthModal({ isOpen: false, type: "login" });
  const toggleUserDropdown = () => setUserDropdown(!userDropdown);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setMobileDropdown(null);
  };

  const toggleMobileDropdown = (dropdownName) => {
    setMobileDropdown(mobileDropdown === dropdownName ? null : dropdownName);
  };

  const storedUser = localStorage.getItem("userProfile");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;

  const userName = parsedUser?.name || "";
  const adminId = parsedUser?.adminId || null;
  const isLoggedIn = !!localStorage.getItem("jwt");

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("jwt");
      await axios.post(
        "https://api.regeve.in/admin/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showToast("Logged out successfully!", "success");
    } catch (error) {
      console.error("Logout error:", error);
      showToast("Logout failed on server, but logging out locally.", "error");
    } finally {
      localStorage.removeItem("jwt");
      localStorage.removeItem("userProfile");
      setUserDropdown(false);
      navigate("/");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Gallery", path: "/eventgallery" },
    {
      name: "Services",
      dropdown: true,
      items: [
        { name: "Event Registration", path: "/service/registration" },
        { name: "Lucky Draw System", path: "/service/luckydraw-system-page" },
        { name: "Food Management", path: "/service/food-management" },
        { name: "Event Dashboard", path: "/service/dashboard-system-page" },
        { name: "Election Management", path: "/electionManagementplatform" },
      ],
    },
  ];

  const isActive = (path) => location.pathname === path;

  // --- Animation Variants ---
  const navbarVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    },
  };

  const dropdownVariants = {
    closed: { 
      opacity: 0, 
      y: -8, 
      scale: 0.98,
      display: "none",
      transition: { duration: 0.1 }
    },
    open: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      display: "block",
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 30,
        delayChildren: 0.1,
        staggerChildren: 0.05
      }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 },
  };

  const mobileMenuVariants = {
    closed: { opacity: 0, height: 0 },
    open: { opacity: 1, height: "auto", transition: { duration: 0.3, ease: "easeInOut" } },
  };

  return (
    <>
      <motion.nav
        initial="hidden"
        animate="visible"
        variants={navbarVariants}
        // LOGIC UPDATE: 
        // If (Scrolled OR Menu Open OR Not Homepage) -> Dark Background
        // Else -> Transparent
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || isMenuOpen || !isHome
            ? "bg-black/80 backdrop-blur-md shadow-lg border-b border-white/10"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo Area */}
            <motion.div
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => navigate("/")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative">
                {/* Glow effect for logo */}
                <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
                
                {/* LOGO UPDATE: Added brightness-0 invert to force full white */}
                <img 
                  src={Logo} 
                  alt="Regeve Logo" 
                  className="w-16 h-auto relative z-10 brightness-0 invert" 
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white tracking-tighter transition-colors duration-300">
                  REGEVE
                </span>
                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold -mt-1">
                  Event Solutions
                </span>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <div
                  key={item.name}
                  className="relative px-1"
                  onMouseEnter={() => item.dropdown && setOpenDropdown(item.name)}
                  onMouseLeave={() => item.dropdown && setOpenDropdown(null)}
                >
                  {item.dropdown ? (
                    <div className="relative">
                      <button
                        className={`flex items-center space-x-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                          openDropdown === item.name
                            ? "bg-white/10 text-white"
                            : "text-gray-300 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <span>{item.name}</span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-300 ${
                            openDropdown === item.name ? "rotate-180 text-white" : "text-gray-400"
                          }`}
                        />
                      </button>

                      {/* Desktop Dropdown */}
                      <AnimatePresence>
                        {openDropdown === item.name && (
                          <motion.div
                            variants={dropdownVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            className="absolute top-full left-0 pt-4 w-64 z-50"
                          >
                            <div className="bg-black/90 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl p-2 space-y-1">
                              {item.items.map((sub) => (
                                <motion.button
                                  key={sub.name}
                                  variants={itemVariants}
                                  onClick={() => {
                                    navigate(sub.path);
                                    setOpenDropdown(null);
                                  }}
                                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200 group flex items-center justify-between cursor-pointer"
                                >
                                  <span>{sub.name}</span>
                                  <span className="opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-200 text-white">
                                    →
                                  </span>
                                </motion.button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <button
                      onClick={() => navigate(item.path)}
                      className={`relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                        isActive(item.path)
                          ? "text-white bg-white/10 shadow-sm border border-white/10"
                          : "text-gray-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {item.name}
                    </button>
                  )}
                </div>
              ))}

              {isLoggedIn && (
                <button
                  onClick={() => navigate(`/${adminId}/admindashboard`)}
                  className={`ml-2 flex items-center space-x-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                    isActive(`/${adminId}/admindashboard`)
                      ? "text-white bg-white/20 border border-white/20"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
              )}
            </div>

            {/* Right Side - Auth */}
            <div className="hidden lg:flex items-center space-x-6">
              <div className="h-6 w-px bg-white/20 mx-2"></div>
              {isLoggedIn ? (
                <div 
                  className="relative" 
                  onMouseEnter={() => setUserDropdown(true)}
                  onMouseLeave={() => setUserDropdown(false)}
                >
                  <motion.button
                    onClick={toggleUserDropdown}
                    className="flex items-center space-x-2 p-1 pl-2 pr-4 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all duration-300 group cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gray-700 to-gray-900 flex items-center justify-center border border-white/20 text-white font-bold text-sm">
                      {userName ? userName.charAt(0).toUpperCase() : <User size={16} />}
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="text-xs text-gray-400 font-medium">Hello,</span>
                        <span className="text-sm font-bold text-white leading-none">{userName || "Admin"}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 group-hover:text-white transition-transform duration-300 ${userDropdown ? "rotate-180" : ""}`} />
                  </motion.button>

                  <AnimatePresence>
                    {userDropdown && (
                      <motion.div
                        variants={dropdownVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="absolute right-0 top-full pt-4 w-60 z-50"
                      >
                         <div className="bg-black/90 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                            <div className="p-4 bg-white/5 border-b border-white/10">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Signed in as</p>
                                <p className="font-bold text-white truncate">{userName || "Administrator"}</p>
                            </div>
                            <div className="p-2">
                                <button
                                  onClick={handleLogout}
                                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium cursor-pointer"
                                >
                                    <LogOut size={18} />
                                    <span>Sign out</span>
                                </button>
                            </div>
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={openLogin}
                  className="group relative px-6 py-2.5 bg-transparent border border-white/30 text-white rounded-full font-medium hover:bg-white hover:text-black transition-all duration-300 overflow-hidden cursor-pointer"
                >
                  <div className="relative flex items-center space-x-2">
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </div>
                </motion.button>
              )}
            </div>

            {/* Mobile Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleMenu}
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="lg:hidden bg-black/95 backdrop-blur-xl border-t border-white/10 overflow-hidden"
            >
              <div className="px-4 pt-4 pb-8 space-y-2">
                {navItems.map((item) =>
                  item.dropdown ? (
                    <div key={item.name} className="bg-white/5 rounded-2xl overflow-hidden border border-white/5">
                      <button
                        onClick={() => toggleMobileDropdown(item.name)}
                        className="w-full flex items-center justify-between px-5 py-4 text-white font-semibold cursor-pointer"
                      >
                        {item.name}
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${mobileDropdown === item.name ? "rotate-180 text-white" : "text-gray-400"}`} />
                      </button>
                      <AnimatePresence>
                        {mobileDropdown === item.name && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-black/50 border-t border-white/5"
                          >
                            {item.items.map((sub) => (
                              <button
                                key={sub.name}
                                onClick={() => {
                                  navigate(sub.path);
                                  toggleMenu();
                                }}
                                className="w-full text-left px-8 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                              >
                                {sub.name}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <button
                      key={item.name}
                      onClick={() => {
                        navigate(item.path);
                        toggleMenu();
                      }}
                      className={`block w-full text-left px-5 py-4 rounded-2xl font-semibold transition-all cursor-pointer ${
                        isActive(item.path)
                          ? "bg-white/10 text-white border border-white/10"
                          : "text-gray-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {item.name}
                    </button>
                  )
                )}

                {isLoggedIn && (
                   <button
                   onClick={() => {
                     navigate(`/${adminId}/admindashboard`);
                     toggleMenu();
                   }}
                   className={`block w-full text-left px-5 py-4 rounded-2xl font-semibold transition-all cursor-pointer ${
                     isActive(`/${adminId}/admindashboard`)
                       ? "bg-purple-500/20 text-purple-300"
                       : "text-gray-300 hover:bg-white/5"
                   }`}
                 >
                   Dashboard
                 </button>
                )}

                <div className="pt-4 mt-4 border-t border-white/10">
                  {isLoggedIn ? (
                    <div className="space-y-3">
                        <div className="flex items-center space-x-3 px-5 py-2">
                             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-900 border border-white/10 flex items-center justify-center text-white font-bold shadow-md">
                                {userName ? userName.charAt(0).toUpperCase() : <User />}
                             </div>
                             <div>
                                 <p className="text-sm font-medium text-gray-400">Signed in as</p>
                                 <p className="font-bold text-white">{userName || "Admin"}</p>
                             </div>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center justify-center space-x-2 px-5 py-4 bg-red-500/10 text-red-400 font-medium rounded-2xl hover:bg-red-500/20 transition-colors cursor-pointer"
                        >
                          <LogOut size={20} />
                          <span>Logout</span>
                        </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        openLogin();
                        toggleMenu();
                      }}
                      className="w-full flex items-center justify-center space-x-2 px-5 py-4 bg-white text-black font-medium rounded-2xl active:scale-95 transition-all cursor-pointer"
                    >
                      <LogIn size={20} />
                      <span>Login</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[60]"
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
          >
            <div
              className={`flex items-center space-x-3 px-6 py-3 rounded-full shadow-2xl backdrop-blur-xl border ${
                toast.type === "success"
                  ? "bg-black/80 border-green-500/50 text-green-400"
                  : "bg-black/80 border-red-500/50 text-red-400"
              }`}
            >
              {toast.type === "success" ? <CheckCircle size={20} /> : <XCircle size={20} />}
              <span className="font-medium text-sm">{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modals */}
      <AnimatePresence>
        {authModal.isOpen && authModal.type === "login" && (
          <Login
            onClose={closeAuth}
            onLoginSuccess={() => {
              closeAuth();
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;