import React, { useContext } from 'react';
import { ProductContext } from '../../context/products';
import ProductList from './ProductList';
import Loading from '../Loading';

function FeaturedProducts() {
  const { loading, featured } = useContext(ProductContext);

  if (loading) {
    return <Loading />;
  }

  return <ProductList title="featured products" products={featured} />;
}

export default FeaturedProducts;
