import React, { useState, useEffect } from 'react';
import axios from 'axios';
import url from '../utils/URL';
import { featuredProducts, flattenProducts } from '../utils/helpers';

export const ProductContext = React.createContext();

function ProductProvider({ children }) {
  // states
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [featured, setFeatured] = useState([]);

  // lifecycle
  useEffect(() => {
    setLoading(true);
    axios.get(`${url}/products`).then((response) => {
      const products = flattenProducts(response.data);
      const featured = featuredProducts(products);
      setProducts(products);
      setFeatured(featured);
      setLoading(false);
    });
    return () => {};
  }, []);

  // return context provider
  return (
    <ProductContext.Provider value={{ loading, products, featured }}>
      {children}
    </ProductContext.Provider>
  );
}

export default ProductProvider;
