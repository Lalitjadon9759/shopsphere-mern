import { useEffect, useState } from "react";

import {
  Heart,
  ShoppingCart,
  Search,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Package,
} from "lucide-react";

import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { logout } from "../../features/auth/authSlice";

import { fetchWishlist } from "../../features/wishlist/wishlistSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  // ======================================================
  // Redux
  // ======================================================

  const { isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  // ======================================================
  // Cart
  // ======================================================

  const cartItems =
    useSelector((state) => state.cart.cart?.items) || [];

  const cartCount = cartItems.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  // ======================================================
  // Wishlist
  // ======================================================

  const wishlistProducts = useSelector(
    (state) => state.wishlist?.products || []
  );

  const wishlistCount = wishlistProducts.length;

  const wishlistLoading = useSelector(
    (state) => state.wishlist?.loading || false
  );

  // ======================================================
  // Local State
  // ======================================================

  const [search, setSearch] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // ======================================================
  // Load Wishlist
  // ======================================================

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    dispatch(fetchWishlist());
  }, [isAuthenticated, dispatch]);

  // ======================================================
  // Sync Search With URL
  // ======================================================

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const urlSearch = params.get("search") || "";

    setSearch(urlSearch);
  }, [location.search]);

  // ======================================================
  // Search
  // ======================================================

  const handleSearch = (e) => {
    e.preventDefault();

    const value = search.trim();

    if (!value) {
      navigate("/products");
    } else {
      navigate(
        `/products?search=${encodeURIComponent(value)}`
      );
    }

    setMobileMenu(false);
    setProfileOpen(false);
  };

  // ======================================================
  // Logo
  // ======================================================

  const handleLogoClick = () => {
    setSearch("");
    setMobileMenu(false);
    setProfileOpen(false);
  };

  // ======================================================
  // Logout
  // ======================================================

  const handleLogout = () => {
    dispatch(logout());

    toast.success("Logged out successfully");

    setSearch("");
    setProfileOpen(false);
    setMobileMenu(false);

    navigate("/");
  };

  // ======================================================
  // Desktop Navigation
  // ======================================================

  const navClass = ({ isActive }) =>
    `relative whitespace-nowrap py-2 text-sm font-medium transition ${
      isActive
        ? "text-blue-600"
        : "text-slate-700 hover:text-blue-600"
    }`;

  // ======================================================
  // Mobile Navigation
  // ======================================================

  const mobileNavClass = ({ isActive }) =>
    `rounded-xl px-4 py-3 text-sm font-medium transition ${
      isActive
        ? "bg-blue-50 text-blue-600"
        : "text-slate-700 hover:bg-slate-100"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white shadow-sm">

      {/* ==================================================
          DESKTOP / MAIN NAVBAR
      ================================================== */}

      <div className="w-full">
        <div
          className="
            mx-auto
            flex
            min-h-[68px]
            w-full
            max-w-[1600px]
            items-center
            gap-4
            px-4
            sm:px-6
            lg:px-8
            xl:px-10
          "
        >

          {/* ==================================================
              LOGO
          ================================================== */}

          <Link
            to="/"
            onClick={handleLogoClick}
            className="
              flex
              shrink-0
              items-center
              gap-2
              rounded-xl
              py-1
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-blue-600
                text-white
                shadow-sm
              "
            >
              <ShoppingCart size={21} />
            </div>

            <span
              className="
                text-lg
                font-bold
                tracking-tight
                text-slate-900
                sm:text-xl
              "
            >
              ShopSphere
            </span>
          </Link>

          {/* ==================================================
              DESKTOP NAVIGATION
          ================================================== */}

          <nav
            className="
              hidden
              shrink-0
              items-center
              gap-4
              lg:flex
              xl:gap-6
            "
          >
            <NavLink
              to="/"
              end
              className={navClass}
            >
              Home
            </NavLink>

            <NavLink
              to="/products"
              className={navClass}
            >
              Products
            </NavLink>

            <NavLink
              to="/categories"
              className={navClass}
            >
              Categories
            </NavLink>
          </nav>

          {/* ==================================================
              DESKTOP SEARCH
          ================================================== */}

          <form
            onSubmit={handleSearch}
            className="
              hidden
              min-w-0
              flex-1
              lg:flex
            "
          >
            <div className="relative w-full min-w-0">

              {/* Search Icon */}

              <Search
                size={18}
                className="
                  pointer-events-none
                  absolute
                  left-3.5
                  top-1/2
                  z-10
                  -translate-y-1/2
                  text-slate-400
                "
              />

              {/* Search Input */}

              <input
                type="search"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search products..."
                aria-label="Search products"
                className="
                  h-10
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  bg-slate-50
                  pl-11
                  pr-4
                  text-sm
                  text-slate-800
                  outline-none
                  transition
                  placeholder:text-slate-400
                  hover:border-slate-400
                  focus:border-blue-500
                  focus:bg-white
                  focus:ring-4
                  focus:ring-blue-100
                "
              />

            </div>
          </form>

          {/* ==================================================
              RIGHT SIDE ACTIONS
          ================================================== */}

          <div
            className="
              ml-auto
              flex
              shrink-0
              items-center
              gap-1
              sm:gap-2
            "
          >

            {/* ==================================================
                WISHLIST
            ================================================== */}

            <Link
              to="/wishlist"
              aria-label={`Wishlist${
                wishlistCount > 0
                  ? `, ${wishlistCount} items`
                  : ""
              }`}
              title="Wishlist"
              className="
                relative
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                text-slate-700
                transition
                hover:bg-slate-100
                hover:text-red-500
              "
            >
              <Heart
                size={21}
                className={
                  wishlistCount > 0
                    ? "fill-red-500 text-red-500"
                    : "text-slate-700"
                }
              />

              {wishlistCount > 0 && (
                <span
                  className="
                    absolute
                    -right-0.5
                    -top-0.5
                    flex
                    h-5
                    min-w-5
                    items-center
                    justify-center
                    rounded-full
                    bg-red-500
                    px-1
                    text-[10px]
                    font-bold
                    text-white
                  "
                >
                  {wishlistCount > 99
                    ? "99+"
                    : wishlistCount}
                </span>
              )}

              {wishlistLoading &&
                wishlistCount === 0 && (
                  <span
                    className="
                      absolute
                      -right-0.5
                      -top-0.5
                      h-3
                      w-3
                      animate-pulse
                      rounded-full
                      bg-slate-400
                    "
                  />
                )}
            </Link>

            {/* ==================================================
                CART
            ================================================== */}

            <Link
              to="/cart"
              aria-label={`Shopping cart${
                cartCount > 0
                  ? `, ${cartCount} items`
                  : ""
              }`}
              title="Shopping Cart"
              className="
                relative
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                text-slate-700
                transition
                hover:bg-slate-100
                hover:text-blue-600
              "
            >
              <ShoppingCart size={21} />

              {cartCount > 0 && (
                <span
                  className="
                    absolute
                    -right-0.5
                    -top-0.5
                    flex
                    h-5
                    min-w-5
                    items-center
                    justify-center
                    rounded-full
                    bg-blue-600
                    px-1
                    text-[10px]
                    font-bold
                    text-white
                  "
                >
                  {cartCount > 99
                    ? "99+"
                    : cartCount}
                </span>
              )}
            </Link>

            {/* ==================================================
                AUTH - LOGGED OUT
            ================================================== */}

            {!isAuthenticated ? (
              <div className="hidden items-center gap-2 sm:flex">

                <Link
                  to="/login"
                  className="
                    rounded-lg
                    border
                    border-slate-300
                    px-3
                    py-2
                    text-sm
                    font-medium
                    text-slate-700
                    transition
                    hover:border-blue-500
                    hover:bg-blue-50
                    hover:text-blue-600
                  "
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="
                    rounded-lg
                    bg-blue-600
                    px-3.5
                    py-2
                    text-sm
                    font-medium
                    text-white
                    shadow-sm
                    transition
                    hover:bg-blue-700
                    hover:shadow
                  "
                >
                  Register
                </Link>

              </div>
            ) : (

              /* ==================================================
                 PROFILE
              ================================================== */

              <div className="relative hidden sm:block">

                <button
                  type="button"
                  onClick={() =>
                    setProfileOpen(
                      (prev) => !prev
                    )
                  }
                  className="
                    flex
                    max-w-[180px]
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-slate-300
                    bg-white
                    px-3
                    py-2
                    text-sm
                    font-medium
                    text-slate-700
                    transition
                    hover:border-blue-500
                    hover:bg-slate-50
                  "
                >
                  <User size={18} />

                  <span className="max-w-[120px] truncate">
                    {user?.name || "Account"}
                  </span>
                </button>

                {profileOpen && (
                  <div
                    className="
                      absolute
                      right-0
                      top-full
                      mt-2
                      w-60
                      overflow-hidden
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      shadow-xl
                    "
                  >

                    {/* User Information */}

                    <div
                      className="
                        border-b
                        border-slate-200
                        bg-slate-50
                        px-4
                        py-4
                      "
                    >
                      <p className="truncate font-semibold text-slate-900">
                        {user?.name || "User"}
                      </p>

                      {user?.email && (
                        <p className="mt-1 truncate text-xs text-slate-500">
                          {user.email}
                        </p>
                      )}
                    </div>

                    {/* Profile */}

                    <Link
                      to="/profile"
                      onClick={() =>
                        setProfileOpen(false)
                      }
                      className="
                        flex
                        items-center
                        gap-3
                        px-4
                        py-3
                        text-sm
                        text-slate-700
                        transition
                        hover:bg-slate-100
                      "
                    >
                      <User size={17} />
                      My Profile
                    </Link>

                    {/* Wishlist */}

                    <Link
                      to="/wishlist"
                      onClick={() =>
                        setProfileOpen(false)
                      }
                      className="
                        flex
                        items-center
                        justify-between
                        px-4
                        py-3
                        text-sm
                        text-slate-700
                        transition
                        hover:bg-slate-100
                      "
                    >
                      <span className="flex items-center gap-3">
                        <Heart
                          size={17}
                          className={
                            wishlistCount > 0
                              ? "fill-red-500 text-red-500"
                              : ""
                          }
                        />
                        Wishlist
                      </span>

                      {wishlistCount > 0 && (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>

                    {/* Orders */}

                    <Link
                      to="/orders"
                      onClick={() =>
                        setProfileOpen(false)
                      }
                      className="
                        flex
                        items-center
                        gap-3
                        px-4
                        py-3
                        text-sm
                        text-slate-700
                        transition
                        hover:bg-slate-100
                      "
                    >
                      <Package size={17} />
                      My Orders
                    </Link>

                    {/* Admin */}

                    {user?.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() =>
                          setProfileOpen(false)
                        }
                        className="
                          flex
                          items-center
                          gap-3
                          px-4
                          py-3
                          text-sm
                          text-slate-700
                          transition
                          hover:bg-slate-100
                        "
                      >
                        <LayoutDashboard
                          size={17}
                        />
                        Admin Dashboard
                      </Link>
                    )}

                    {/* Logout */}

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="
                        flex
                        w-full
                        items-center
                        gap-3
                        border-t
                        border-slate-200
                        px-4
                        py-3
                        text-left
                        text-sm
                        text-red-600
                        transition
                        hover:bg-red-50
                      "
                    >
                      <LogOut size={17} />
                      Logout
                    </button>

                  </div>
                )}

              </div>
            )}

            {/* ==================================================
                MOBILE BUTTON
            ================================================== */}

            <button
              type="button"
              onClick={() =>
                setMobileMenu(
                  (prev) => !prev
                )
              }
              aria-label={
                mobileMenu
                  ? "Close menu"
                  : "Open menu"
              }
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                text-slate-700
                transition
                hover:bg-slate-100
                lg:hidden
              "
            >
              {mobileMenu ? (
                <X size={23} />
              ) : (
                <Menu size={23} />
              )}
            </button>

          </div>
        </div>
      </div>

      {/* ==================================================
          MOBILE MENU
      ================================================== */}

      {mobileMenu && (
        <div
          className="
            border-t
            border-slate-200
            bg-white
            px-4
            py-4
            shadow-lg
            lg:hidden
          "
        >

          {/* Mobile Search */}

          <form
            onSubmit={handleSearch}
            className="mb-4"
          >
            <div className="relative">

              <Search
                size={18}
                className="
                  pointer-events-none
                  absolute
                  left-3.5
                  top-1/2
                  z-10
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type="search"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search products..."
                aria-label="Search products"
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  bg-slate-50
                  pl-11
                  pr-4
                  text-sm
                  text-slate-800
                  outline-none
                  transition
                  placeholder:text-slate-400
                  hover:border-slate-400
                  focus:border-blue-500
                  focus:bg-white
                  focus:ring-4
                  focus:ring-blue-100
                "
              />

            </div>
          </form>

          {/* Mobile Navigation */}

          <nav className="flex flex-col gap-1">

            <NavLink
              to="/"
              end
              onClick={() =>
                setMobileMenu(false)
              }
              className={mobileNavClass}
            >
              Home
            </NavLink>

            <NavLink
              to="/products"
              onClick={() =>
                setMobileMenu(false)
              }
              className={mobileNavClass}
            >
              Products
            </NavLink>

            <NavLink
              to="/categories"
              onClick={() =>
                setMobileMenu(false)
              }
              className={mobileNavClass}
            >
              Categories
            </NavLink>

            {/* Mobile Wishlist */}

            <NavLink
              to="/wishlist"
              onClick={() =>
                setMobileMenu(false)
              }
              className={mobileNavClass}
            >
              <div className="flex items-center justify-between">

                <span className="flex items-center gap-2">
                  <Heart
                    size={17}
                    className={
                      wishlistCount > 0
                        ? "fill-red-500 text-red-500"
                        : ""
                    }
                  />
                  Wishlist
                </span>

                {wishlistCount > 0 && (
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-600">
                    {wishlistCount}
                  </span>
                )}

              </div>
            </NavLink>

            {/* Mobile Cart */}

            <NavLink
              to="/cart"
              onClick={() =>
                setMobileMenu(false)
              }
              className={mobileNavClass}
            >
              <div className="flex items-center justify-between">

                <span className="flex items-center gap-2">
                  <ShoppingCart size={17} />
                  Cart
                </span>

                {cartCount > 0 && (
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-600">
                    {cartCount}
                  </span>
                )}

              </div>
            </NavLink>

            {/* ==================================================
                MOBILE AUTH
            ================================================== */}

            {!isAuthenticated ? (
              <>
                <div className="my-2 border-t border-slate-200" />

                <Link
                  to="/login"
                  onClick={() =>
                    setMobileMenu(false)
                  }
                  className="
                    rounded-xl
                    border
                    border-slate-300
                    px-4
                    py-3
                    text-center
                    text-sm
                    font-medium
                    text-slate-700
                    transition
                    hover:bg-slate-50
                  "
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() =>
                    setMobileMenu(false)
                  }
                  className="
                    rounded-xl
                    bg-blue-600
                    px-4
                    py-3
                    text-center
                    text-sm
                    font-medium
                    text-white
                    transition
                    hover:bg-blue-700
                  "
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <div className="my-2 border-t border-slate-200" />

                {/* User */}

                <div className="rounded-xl bg-slate-50 px-4 py-3">
                  <p className="font-semibold text-slate-900">
                    {user?.name || "User"}
                  </p>

                  {user?.email && (
                    <p className="mt-1 truncate text-xs text-slate-500">
                      {user.email}
                    </p>
                  )}
                </div>

                {/* Profile */}

                <Link
                  to="/profile"
                  onClick={() =>
                    setMobileMenu(false)
                  }
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-4
                    py-3
                    text-sm
                    text-slate-700
                    hover:bg-slate-100
                  "
                >
                  <User size={18} />
                  My Profile
                </Link>

                {/* Wishlist */}

                <Link
                  to="/wishlist"
                  onClick={() =>
                    setMobileMenu(false)
                  }
                  className="
                    flex
                    items-center
                    justify-between
                    rounded-xl
                    px-4
                    py-3
                    text-sm
                    text-slate-700
                    hover:bg-slate-100
                  "
                >
                  <span className="flex items-center gap-3">
                    <Heart
                      size={18}
                      className={
                        wishlistCount > 0
                          ? "fill-red-500 text-red-500"
                          : ""
                      }
                    />
                    Wishlist
                  </span>

                  {wishlistCount > 0 && (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                {/* Orders */}

                <Link
                  to="/orders"
                  onClick={() =>
                    setMobileMenu(false)
                  }
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-4
                    py-3
                    text-sm
                    text-slate-700
                    hover:bg-slate-100
                  "
                >
                  <Package size={18} />
                  My Orders
                </Link>

                {/* Admin */}

                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={() =>
                      setMobileMenu(false)
                    }
                    className="
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      px-4
                      py-3
                      text-sm
                      text-slate-700
                      hover:bg-slate-100
                    "
                  >
                    <LayoutDashboard size={18} />
                    Admin Dashboard
                  </Link>
                )}

                {/* Logout */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    px-4
                    py-3
                    text-left
                    text-sm
                    text-red-600
                    transition
                    hover:bg-red-50
                  "
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            )}

          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;