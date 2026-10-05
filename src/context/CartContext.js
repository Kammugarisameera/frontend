import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback
} from "react";

import { useAuth } from "./AuthContext";


const CartContext = createContext(null);

const API_URL = "http://localhost:5000";


export const CartProvider = ({ children }) => {

  const {
    user,
    isLoggedIn
  } = useAuth();


  const [cartItems, setCartItems] = useState([]);

  const [loading, setLoading] = useState(false);

  const [adding, setAdding] = useState(false);

  const [error, setError] = useState("");


  /*
   * ============================
   * GET USER ID
   * ============================
   */

  const getUserId = useCallback(() => {

    return (
      user?._id ||
      user?.id ||
      user?.userId ||
      localStorage.getItem("userId")
    );

  }, [user]);


  /*
   * ============================
   * FETCH CART
   * ============================
   */

  const fetchCart = useCallback(async () => {

    const userId = getUserId();


    if (!isLoggedIn || !userId) {

      setCartItems([]);

      return;

    }


    try {

      setLoading(true);

      setError("");


      const response = await fetch(
        `${API_URL}/cart/${userId}`
      );


      const contentType =
        response.headers.get("content-type") || "";


      const data =
        contentType.includes("application/json")
          ? await response.json()
          : {};


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to fetch cart"
        );

      }


      const items =
        data.cart ||
        data.items ||
        data.data ||
        [];


      setCartItems(
        Array.isArray(items)
          ? items
          : []
      );


    } catch (err) {

      setError(
        err.message ||
        "Failed to load cart"
      );

    } finally {

      setLoading(false);

    }

  }, [getUserId, isLoggedIn]);


  /*
   * ============================
   * ADD TO CART
   * ============================
   */

  const addToCart = async (
    productId,
    quantity = 1
  ) => {

    const userId = getUserId();


    if (!isLoggedIn || !userId) {

      return {
        success: false,
        message: "Please login first."
      };

    }


    try {

      setAdding(true);


      const response = await fetch(
        `${API_URL}/cart/add`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            userId,
            productId,
            quantity
          })
        }
      );


      const contentType =
        response.headers.get("content-type") || "";


      const data =
        contentType.includes("application/json")
          ? await response.json()
          : {};


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to add product"
        );

      }


      await fetchCart();


      return {
        success: true,
        message:
          data.message ||
          "Product added to cart"
      };


    } catch (err) {

      return {
        success: false,
        message:
          err.message ||
          "Failed to add product"
      };

    } finally {

      setAdding(false);

    }

  };


  /*
   * ============================
   * UPDATE CART ITEM
   * ============================
   */

  const updateCartItem = async (
    itemId,
    quantity
  ) => {

    try {

      setError("");


      if (quantity < 1) {

        return removeCartItem(itemId);

      }


      const response = await fetch(
        `${API_URL}/cart/${itemId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            quantity
          })
        }
      );


      const contentType =
        response.headers.get("content-type") || "";


      const data =
        contentType.includes("application/json")
          ? await response.json()
          : {};


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to update cart"
        );

      }


      await fetchCart();


    } catch (err) {

      setError(
        err.message ||
        "Failed to update cart"
      );

    }

  };


  /*
   * ============================
   * REMOVE ITEM
   * ============================
   */

  const removeCartItem = async (
    itemId
  ) => {

    try {

      setError("");


      const response = await fetch(
        `${API_URL}/cart/${itemId}`,
        {
          method: "DELETE"
        }
      );


      const contentType =
        response.headers.get("content-type") || "";


      const data =
        contentType.includes("application/json")
          ? await response.json()
          : {};


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to remove item"
        );

      }


      await fetchCart();


    } catch (err) {

      setError(
        err.message ||
        "Failed to remove item"
      );

    }

  };


  /*
   * ============================
   * CLEAR LOCAL CART
   * ============================
   */

  const clearCart = () => {

    setCartItems([]);

  };


  /*
   * ============================
   * REFRESH CART
   * WHEN LOGIN CHANGES
   * ============================
   */

  useEffect(() => {

    fetchCart();

  }, [
    fetchCart
  ]);


  /*
   * ============================
   * CART COUNT
   * ============================
   */

  const cartCount =
    cartItems.reduce(
      (total, item) =>
        total +
        Number(item.quantity || 0),
      0
    );


  /*
   * ============================
   * CART TOTAL
   * ============================
   */

  const cartTotal =
    cartItems.reduce(
      (total, item) => {

        const price =
          Number(
            item.price ||
            item.productId?.price ||
            0
          );

        const quantity =
          Number(
            item.quantity || 0
          );

        return (
          total +
          price * quantity
        );

      },
      0
    );


  return (

    <CartContext.Provider
      value={{

        cartItems,

        cartCount,

        cartTotal,

        loading,

        adding,

        error,

        fetchCart,

        addToCart,

        updateCartItem,

        removeCartItem,

        clearCart

      }}
    >

      {children}

    </CartContext.Provider>

  );

};


export const useCart = () => {

  return useContext(CartContext);

};


export default CartContext;