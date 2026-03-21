import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Process from './components/Process';
import Collection from './components/Collection';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import Toast from './components/Toast';
import Checkout from './pages/Checkout'; 
import OrderSuccess from './pages/OrderSuccess';
import MyOrders from './pages/MyOrders'; 
import ReceivedRituals from './pages/ReceivedRituals'; 
import FullMenu from './pages/FullMenu'; 
import ProductDetail from './pages/ProductDetail'; 
import AdminDashboard from './pages/AdminDashboard'; 
import AdminUsers from './pages/AdminUsers'; 
import AdminOrders from './pages/AdminOrders'; 
import AddRitual from './pages/AddRitual'; 
import RitualList from './pages/RitualList'; 
import AdminGiftTrack from './pages/AdminGiftTrack'; // NEW: Import for Gift Tracking
import Membership from './pages/Membership';
import Profile from "./pages/Account"; 
import SendGift from "./pages/SendGift"; 
import ProtectedRoute from './components/ProtectedRoute';
import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';

/**
 * ScrollToTop Component
 * Ensures the page scroll resets to the top on every route change.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

/**
 * AppContent Component
 * Handles layout logic and route definitions.
 */
const AppContent = () => {
  const location = useLocation();
  const cartContext = useCart();
  const { user, isMember } = useAuth(); 
  
  const toast = cartContext?.toast || { isVisible: false, message: '' };

  // Logic to hide layout elements on all Admin paths
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop /> 
      
      <Toaster 
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 5000,
          style: {
            background: '#3E2723',
            color: '#D4AF37',
            borderRadius: '1rem',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontWeight: '700'
          },
        }}
      />
      
      {!isAdminPage && <Navbar />}
      
      {toast?.isVisible && toast?.message && (
        <Toast 
          message={toast.message} 
          isVisible={toast.isVisible} 
        />
      )}
      
      {!isAdminPage && <CartSidebar />}
      
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} /> 
        <Route path="/menu" element={<FullMenu />} />
        <Route path="/ritual/:id" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/membership" element={<Membership />} />

        {/* AUTHENTICATED USER ROUTES */}
        <Route 
          path="/my-orders" 
          element={user ? <MyOrders /> : <Navigate to="/membership" replace />} 
        />
        
        <Route 
          path="/received-rituals" 
          element={user ? <ReceivedRituals /> : <Navigate to="/membership" replace />} 
        />

        <Route 
          path="/send-gift" 
          element={user ? <SendGift /> : <Navigate to="/membership" replace />} 
        />

        {/* SECURE PROFILE ROUTE */}
        <Route 
          path="/profile" 
          element={
            user && isMember ? <Profile /> : <Navigate to="/membership" replace />
          } 
        />

        {/* --- ADMIN COMMAND CENTER ROUTES --- */}
        
        {/* Main Dashboard Overview */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Add Ritual Page */}
        <Route 
          path="/admin/add-ritual" 
          element={
            <ProtectedRoute>
              <AdminDashboard>
                <AddRitual />
              </AdminDashboard>
            </ProtectedRoute>
          } 
        />

        {/* Ritual List Page */}
        <Route 
          path="/admin/rituals" 
          element={
            <ProtectedRoute>
              <AdminDashboard>
                <RitualList />
              </AdminDashboard>
            </ProtectedRoute>
          } 
        />

        {/* Gift Ritual Track Page - NEW CONNECTION */}
        <Route 
          path="/admin/gift-track" 
          element={
            <ProtectedRoute>
              <AdminDashboard>
                <AdminGiftTrack />
              </AdminDashboard>
            </ProtectedRoute>
          } 
        />

        {/* User Registry */}
        <Route 
          path="/admin/users" 
          element={
            <ProtectedRoute>
              <AdminDashboard>
                <AdminUsers />
              </AdminDashboard>
            </ProtectedRoute>
          } 
        />

        {/* Order Registry */}
        <Route 
          path="/admin/orders" 
          element={
            <ProtectedRoute>
              <AdminDashboard>
                <AdminOrders />
              </AdminDashboard>
            </ProtectedRoute>
          } 
        />

        {/* 404 CATCH ALL */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!isAdminPage && <Footer />}
    </>
  );
};

/**
 * Home Component
 */
const Home = () => {
  return (
    <main className="bg-[#FDFCF8] dark:bg-velvet-bean transition-colors duration-700 min-h-screen">
      <Hero />
      <Collection />
      <About />
      <Process />
      <Contact />
    </main>
  );
};

/**
 * Main App Component
 */
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;