import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';

const CheckoutCancelPage: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-[calc(100vh-64px-300px)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <XCircle className="mx-auto h-12 w-12 text-error-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Payment Cancelled</h2>
          <p className="mt-2 text-sm text-gray-600">
            Your payment was cancelled. No charges were made to your account.
          </p>
          <div className="mt-6 space-y-4">
            <Button
              variant="primary"
              fullWidth
              onClick={() => window.location.href = '/products'}
            >
              Return to Products
            </Button>
            <Link
              to="/cart"
              className="inline-block text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              Return to Cart
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutCancelPage;