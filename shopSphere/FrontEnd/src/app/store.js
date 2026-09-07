import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import productReducer from "../features/product/productSlice";
import categoryReducer from "../features/category/categorySlice";
import cartReducer from "../features/cart/cartSlice";
import checkoutReducer from "../features/checkout/checkoutSlice";
import addressReducer from "../features/address/addressSlice";
import orderReducer from "../features/order/orderSlice";

import adminReducer from "../features/admin/adminSlice";
import adminProductReducer from "../features/admin/productSlice";

import adminCategoryReducer from "../features/category/categorySlice";

import reviewReducer from "../features/review/reviewSlice";
import paymentReducer from "../features/payment/paymentSlice";

// ================= WISHLIST =================
import wishlistReducer from "../features/wishlist/wishlistSlice";

// ======================================================
// Redux Store
// ======================================================

export const store = configureStore({
  reducer: {
    // ================= USER =================

    auth: authReducer,
    product: productReducer,
    category: categoryReducer,
    cart: cartReducer,
    checkout: checkoutReducer,
    address: addressReducer,
    orders: orderReducer,

    // ================= ADMIN =================

    admin: adminReducer,
    productsAdmin: adminProductReducer,
    adminCategories: adminCategoryReducer,

    // ================= OTHER =================

    review: reviewReducer,
    payment: paymentReducer,

    // ================= WISHLIST =================

    wishlist: wishlistReducer,
  },
});