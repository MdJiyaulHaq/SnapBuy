import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Plus, Minus } from 'lucide-react';
import { CartItem as CartItemType } from '../../types/api';
import { formatPrice } from '../../utils/cart';
import { useCart } from '../../contexts/CartContext';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateItem, removeItem } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);
  const defaultImage = 'https://images.pexels.com/photos/3587478/pexels-photo-3587478.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || isUpdating) return;
    
    setIsUpdating(true);
    try {
      await updateItem(item.id, newQuantity);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      await removeItem(item.id);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center py-6 border-b border-gray-200">
      {/* Product image */}
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <img
          src={defaultImage}
          alt={item.product.title}
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Product details */}
      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>
              <Link to={`/products/${item.product.id}`}>{item.product.title}</Link>
            </h3>
            <p className="ml-4">{formatPrice(item.total_price)}</p>
          </div>
          <p className="mt-1 text-sm text-gray-500">Unit price: {formatPrice(item.product.unit_price)}</p>
        </div>
        
        <div className="flex flex-1 items-end justify-between text-sm mt-2">
          <div className="flex items-center">
            <button
              disabled={isUpdating}
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="mx-2 w-8 text-center">{item.quantity}</span>
            <button
              disabled={isUpdating}
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="flex">
            <button
              disabled={isUpdating}
              onClick={handleRemove}
              className="font-medium text-error-600 hover:text-error-800 disabled:opacity-50 flex items-center"
            >
              <X className="h-4 w-4 mr-1" /> 
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;