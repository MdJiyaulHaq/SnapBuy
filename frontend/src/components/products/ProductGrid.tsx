import React from 'react';
import { Product } from '../../types/api';
import ProductCard from './ProductCard';
import Loader from '../common/Loader';

interface ProductGridProps {
  products: Product[];
  loading: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, loading }) => {
  if (loading) {
    return (
      <div className="my-12 flex justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="my-12 text-center">
        <p className="text-gray-500 text-lg">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;