import React, { useState, useEffect, useReducer } from 'react';
// import localCart from '../utils/localCart';
import reducer from './reducer';
import {
  REMOVE_ITEM,
  INCREASE_AMOUNT,
  DECREASE_AMOUNT,
  ADD_TO_CART,
  CLEAR_CART,
} from './actions';

function getCartFromLocalStorage() {
  return localStorage.getItem('cart')
    ? JSON.parse(localStorage.getItem('cart'))
    : [];
}

export const CartContext = React.createContext();

function CartProvider({ children }) {
  // useReducer hook
  const [cart, dispatch] = useReducer(reducer, getCartFromLocalStorage());

  // states
  // const [cart, setCart] = useState(getCartFromLocalStorage());
  const [total, setTotal] = useState(0);
  const [cartItems, setCartItems] = useState(0);

  // lifecycle
  useEffect(() => {
    // local storage
    localStorage.setItem('cart', JSON.stringify(cart));

    // cart amounts
    let newCartItems = cart.reduce((total, cartItem) => {
      return (total += cartItem.amount);
    }, 0);
    setCartItems(newCartItems);

    // cart total
    let newTotal = cart.reduce((total, cartItem) => {
      return (total += cartItem.price * cartItem.amount);
    }, 0);
    newTotal = parseFloat(newTotal.toFixed(2));
    setTotal(newTotal);

    return () => {};
  }, [cart]);

  // functionality
  const removeItem = (id) => {
    dispatch({ type: REMOVE_ITEM, payload: id });
    // let newCart = [...cart].filter((item) => item.id !== id);
    // setCart(newCart);
  };

  const increaseAmount = (id) => {
    dispatch({ type: INCREASE_AMOUNT, payload: id });
    // const newCart = [...cart].map((item) => {
    //   return item.id === id
    //     ? { ...item, amount: item.amount + 1 }
    //     : { ...item };
    // });
    // setCart(newCart);
  };

  const decreaseAmount = (id, amount) => {
    if (amount === 1) {
      dispatch({ type: REMOVE_ITEM, payload: id });
    } else {
      dispatch({ type: DECREASE_AMOUNT, payload: id });
    }
    // if (amount === 1) {
    //   removeItem(id);
    //   return;
    // } else {
    //   const newCart = [...cart].map((item) => {
    //     return item.id === id
    //       ? { ...item, amount: item.amount - 1 }
    //       : { ...item };
    //   });
    //   setCart(newCart);
    // }
  };

  const addToCart = (product) => {
    let item = [...cart].find((item) => item.id === product.id);
    if (item) {
      dispatch({ type: INCREASE_AMOUNT, payload: product.id });
    } else {
      dispatch({ type: ADD_TO_CART, payload: product });
    }
    // const { id, title, image, price } = product;
    // const item = [...cart].find((item) => item.id === id);
    // if (item) {
    //   increaseAmount(id);
    //   return;
    // } else {
    //   const newItem = { id, title, image, price, amount: 1 };
    //   const newCart = [...cart, newItem];
    //   setCart(newCart);
    // }
  };

  const clearCart = () => {
    dispatch({ type: CLEAR_CART });
    // setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        total,
        cartItems,
        removeItem,
        increaseAmount,
        decreaseAmount,
        addToCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;
