import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';

const CheckoutSuccessPage: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-[calc(100vh-64px-300px)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-success-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Payment Successful!</h2>
          <p className="mt-2 text-sm text-gray-600">
            Thank you for your purchase. Your payment has been processed successfully.
          </p>
          <div className="mt-6 space-y-4">
            <Button
              variant="primary"
              fullWidth
              onClick={() => window.location.href = '/products'}
            >
              Continue Shopping
            </Button>
            <Link
              to="/orders"
              className="inline-block text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              View Order History
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutSuccessPage;