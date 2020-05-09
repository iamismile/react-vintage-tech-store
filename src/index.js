import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

// Context
import ProductProvider from './context/products';
import CartProvider from './context/cart';
import UserProvider from './context/user';

ReactDOM.render(
  <UserProvider>
    <ProductProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </ProductProvider>
  </UserProvider>,
  document.getElementById('root')
);
