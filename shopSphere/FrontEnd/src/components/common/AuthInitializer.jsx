import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../../features/cart/cartSlice";

import api from "../../api/axios";
import { getToken } from "../../utils/storage";

import {
  setUser,
  resetAuth,
  setLoading,
} from "../../features/auth/authSlice";

import FullScreenLoader from "./FullScreenLoader";

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    const initialize = async () => {
      const token = getToken();

      if (!token) return;

      dispatch(setLoading(true));

      try {
        const response = await api.get("/auth/profile");

        dispatch(setUser(response.data.user));
      } catch (error) {
        dispatch(resetAuth());
      } finally {
        dispatch(setLoading(false));
      }
    };

    initialize();
  }, [dispatch]);

  if (loading) {
    return <FullScreenLoader />;
  }

  return children;
};
 
export default AuthInitializer;