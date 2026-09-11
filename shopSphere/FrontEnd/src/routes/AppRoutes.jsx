import { BrowserRouter, Routes, Route } from "react-router-dom";

// ================= LAYOUTS =================

import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";

// ================= ROUTE GUARDS =================

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

// =====================================================
// USER PAGES
// =====================================================

import Home from "../pages/user/Home";
import UserProducts from "../pages/user/Products";
import ProductDetails from "../pages/user/ProductDetails";
import Cart from "../pages/user/Cart";
import UserCategories from "../pages/user/Categories";

import Wishlist from "../pages/wishlist";

import Checkout from "../pages/Checkout";
import OrderSuccess from "../pages/OrderSuccess";
import OrderDetails from "../pages/OrderDetails";
import MyOrders from "../pages/MyOrders";

// =====================================================
// AUTH PAGES
// =====================================================

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// =====================================================
// PAYMENT PAGES
// =====================================================

import PaymentSuccess from "../components/payment/PaymentSuccess";
import PaymentFailed from "../components/payment/PaymentFailed";

// =====================================================
// ADMIN PAGES
// =====================================================

import Dashboard from "../pages/admin/Dashboard";
import AdminProducts from "../pages/admin/Products";
import AddProduct from "../pages/admin/AddProduct";
import EditProduct from "../pages/admin/EditProduct";
import Categories from "../pages/admin/Categories";
import Orders from "../pages/admin/Orders";
import Users from "../pages/admin/Users";
import Analytics from "../pages/admin/Analytics";
import Reviews from "../pages/admin/Reviews";

// =====================================================
// COMMON
// =====================================================

import NotFound from "../pages/NotFound";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* =====================================================
            USER APPLICATION
        ===================================================== */}

        <Route element={<UserLayout />}>

          {/* ================= HOME ================= */}

          <Route
            path="/"
            element={<Home />}
          />

          {/* ================= AUTH ================= */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* ================= PRODUCTS ================= */}

          <Route
            path="/products"
            element={<UserProducts />}
          />

          <Route
            path="/products/:slug"
            element={<ProductDetails />}
          />

          {/* ================= CATEGORIES ================= */}

          <Route
            path="/categories"
            element={<UserCategories />}
          />

          {/* =================================================
              PROTECTED USER ROUTES
          ================================================= */}

          {/* ================= CART ================= */}

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          {/* ================= WISHLIST ================= */}

          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />

          {/* ================= CHECKOUT ================= */}

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          {/* ================= ORDER SUCCESS ================= */}

          <Route
            path="/order-success/:id"
            element={
              <ProtectedRoute>
                <OrderSuccess />
              </ProtectedRoute>
            }
          />

          {/* ================= MY ORDERS ================= */}

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />

          {/* ================= ORDER DETAILS ================= */}

          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetails />
              </ProtectedRoute>
            }
          />

          {/* ================= PAYMENT SUCCESS ================= */}

          <Route
            path="/payment-success/:id"
            element={
              <ProtectedRoute>
                <PaymentSuccess />
              </ProtectedRoute>
            }
          />

          {/* ================= PAYMENT FAILED ================= */}

          <Route
            path="/payment-failed"
            element={
              <ProtectedRoute>
                <PaymentFailed />
              </ProtectedRoute>
            }
          />

        </Route>

        {/* =====================================================
            ADMIN APPLICATION
        ===================================================== */}

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >

          {/* ================= DASHBOARD ================= */}

          <Route
            index
            element={<Dashboard />}
          />

          {/* ================= PRODUCTS ================= */}

          <Route
            path="products"
            element={<AdminProducts />}
          />

          <Route
            path="products/new"
            element={<AddProduct />}
          />

          <Route
            path="products/edit/:id"
            element={<EditProduct />}
          />

          {/* ================= CATEGORIES ================= */}

          <Route
            path="categories"
            element={<Categories />}
          />

          {/* ================= ORDERS ================= */}

          <Route
            path="orders"
            element={<Orders />}
          />

          {/* ================= USERS ================= */}

          <Route
            path="users"
            element={<Users />}
          />

          {/* ================= REVIEWS ================= */}

          <Route
            path="reviews"
            element={<Reviews />}
          />

          {/* ================= ANALYTICS ================= */}

          <Route
            path="analytics"
            element={<Analytics />}
          />

        </Route>

        {/* =====================================================
            404 NOT FOUND
        ===================================================== */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;