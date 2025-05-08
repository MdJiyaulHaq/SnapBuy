import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Cart } from '../../types/api';
import { formatPrice } from '../../utils/cart';
import Button from '../common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { createCheckoutSession } from '../../api/stripe';
import toast from 'react-hot-toast';

interface CartSummaryProps {
  cart: Cart;
}

const CartSummary: React.FC<CartSummaryProps> = ({ cart }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const subtotal = cart.total_price;
  // Demo values
  const shipping = 5.99;
  const tax = parseFloat(subtotal) * 0.07;
  const total = parseFloat(subtotal) + shipping + tax;

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login?redirect=checkout');
      return;
    }

    try {
      const successUrl = `${window.location.origin}/checkout/success`;
      const cancelUrl = `${window.location.origin}/checkout/cancel`;

      const checkoutUrl = await createCheckoutSession(
        'price_1RMNN6IiDKGueWGHRbcFHOzD', // Test product price ID
        successUrl,
        cancelUrl,
        'payment'
      );

      window.location.href = checkoutUrl;
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to start checkout process');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
      
      <div className="space-y-4">
        <div className="flex justify-between text-base text-gray-600">
          <p>Subtotal</p>
          <p>{formatPrice(subtotal)}</p>
        </div>
        
        <div className="flex justify-between text-base text-gray-600">
          <p>Shipping</p>
          <p>{formatPrice(shipping)}</p>
        </div>
        
        <div className="flex justify-between text-base text-gray-600">
          <p>Tax (7%)</p>
          <p>{formatPrice(tax)}</p>
        </div>
        
        <div className="border-t border-gray-200 pt-4 flex justify-between text-lg font-medium text-gray-900">
          <p>Total</p>
          <p>{formatPrice(total)}</p>
        </div>
      </div>
      
      <div className="mt-6">
        <Button
          variant="primary"
          fullWidth
          onClick={handleCheckout}
        >
          Proceed to Checkout
        </Button>
      </div>
      
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>or</p>
        <button 
          onClick={() => navigate('/products')}
          className="font-medium text-primary-600 hover:text-primary-700"
        >
          Continue Shopping
          <span aria-hidden="true"> &rarr;</span>
        </button>
      </div>
    </div>
  );
};

export default CartSummary;