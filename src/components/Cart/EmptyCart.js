import React from 'react';
import { Link } from 'react-router-dom';

function EmptyCart() {
  return (
    <section className="section empty-cart">
      <h2>Empty cart...</h2>
      <Link to="/products" className="btn btn-primary">
        FIll it
      </Link>
    </section>
  );
}

export default EmptyCart;
