import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, RefreshCw } from 'lucide-react';
import Layout from '../components/layout/Layout';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import { useCart } from '../contexts/CartContext';

const CartPage: React.FC = () => {
  const { cart, loading, error, retryFetchCart } = useCart();

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
          <div className="flex justify-center py-12">
            <Loader size="lg" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Unable to Load Cart</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <Button
            variant="primary"
            onClick={retryFetchCart}
            className="inline-flex items-center"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry Loading Cart
          </Button>
        </div>
      </Layout>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
          <div className="flex justify-center my-12">
            <ShoppingCart className="h-24 w-24 text-gray-300" />
          </div>
          <p className="text-gray-600 mb-8">Looks like you haven't added any products to your cart yet.</p>
          <Link
            to="/products"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
        
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
          {/* Cart items */}
          <div className="lg:col-span-7">
            <ul role="list" className="divide-y divide-gray-200">
              {cart.items.map((item) => (
                <li key={item.id}>
                  <CartItem item={item} />
                </li>
              ))}
            </ul>
            
            <div className="mt-6">
              <Link
                to="/products"
                className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Cart summary */}
          <div className="mt-10 lg:mt-0 lg:col-span-5">
            <CartSummary cart={cart} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;