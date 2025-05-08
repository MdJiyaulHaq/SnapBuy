import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Product } from "../../types/api";
import { useCart } from "../../contexts/CartContext";
import { formatPrice } from "../../utils/cart";
import { getMediaUrl } from "../../utils/media";
import Button from "../common/Button";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();

  // Default image in case product has no images
  const defaultImage =
    "https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product.id, 1);
  };

  return (
    <div className="group bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      <Link to={`/products/${product.id}`} className="block relative">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
          <img
            src={getMediaUrl(product.images?.[0]?.image) || defaultImage}
            alt={product.title}
            className="w-full h-64 object-cover object-center transform group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
      </Link>

      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="text-lg font-medium text-gray-900 mb-1 truncate">
            {product.title}
          </h3>
        </Link>

        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-900">
            {formatPrice(product.unit_price)}
          </span>

          <Button
            variant="primary"
            size="sm"
            onClick={handleAddToCart}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
