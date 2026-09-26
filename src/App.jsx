import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import CartProvider from "./context/CartContext";
import WishlistProvider from "./context/WishlistContext";
import TierProvider from "./context/TierContext";
import TierWelcomeModal from "./components/TierWelcomeModal";
import WelcomeGift from "./components/WelcomeGift";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Wishlist from "./pages/Wishlist";
import JoinLounge from "./pages/JoinLounge";
import Register from "./pages/Register";
import Account from "./pages/Account";
import MemberDashboard from "./pages/MemberDashboard";
import PremierDashboard from "./pages/PremierDashboard";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import GiftBox from "./pages/GiftBox";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import ShopMembers from "./pages/ShopMembers";
import Tiers from "./pages/Tiers";
import CustomBox from "./pages/CustomBox";
import WelcomeGiftPage from "./pages/WelcomeGiftPage";

function AppLayout() {
  const location = useLocation();

  const isLounge =
    location.pathname === "/account" ||
    location.pathname.startsWith("/account/");

  return (
    <>
      {!isLounge && <Navbar />}

      <TierWelcomeModal />
      <WelcomeGift />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:category" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/box" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/custom-box" element={<CustomBox />} />
        <Route path="/welcome-gift" element={<WelcomeGiftPage />} />

        <Route path="/join" element={<JoinLounge />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/tiers" element={<Tiers />} />

        <Route path="/account" element={<Account />} />
        <Route path="/account/member" element={<MemberDashboard />} />
        <Route path="/account/premier" element={<PremierDashboard />} />
        <Route path="/account/gift-box" element={<GiftBox />} />
        <Route path="/account/orders" element={<Orders />} />
        <Route path="/account/profile" element={<Profile />} />
        <Route path="/account/notifications" element={<Notifications />} />
        <Route path="/account/settings" element={<Settings />} />
        <Route path="/account/shop-members" element={<ShopMembers />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <WishlistProvider>
          <TierProvider>
            <AppLayout />
          </TierProvider>
        </WishlistProvider>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;