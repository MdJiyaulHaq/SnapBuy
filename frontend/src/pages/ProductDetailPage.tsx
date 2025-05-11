import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronRight,
  Tag,
  ShoppingCart,
  Truck,
  ArrowLeft,
} from "lucide-react";
import Layout from "../components/layout/Layout";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import { getProduct } from "../api/products";
import { Product } from "../types/api";
import { useCart } from "../contexts/CartContext";
import { formatPrice } from "../utils/cart";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const { addItem } = useCart();
  const defaultImage =
    "https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const productData = await getProduct(parseInt(id));
        setProduct(productData);
        document.title = `${productData.title} | SnapBuy`;
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();

    return () => {
      document.title = "SnapBuy"; // Reset title on unmount
    };
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product.id, quantity);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-20">
          <Loader size="lg" />
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The product you are looking for does not exist.
          </p>
          <Link
            to="/products"
            className="text-primary-600 hover:text-primary-700 inline-flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link to="/" className="text-gray-500 hover:text-gray-700">
                Home
              </Link>
            </li>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <li>
              <Link
                to="/products"
                className="text-gray-500 hover:text-gray-700"
              >
                Products
              </Link>
            </li>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <li className="text-gray-900 font-medium truncate max-w-xs">
              {product.title}
            </li>
          </ol>
        </nav>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          {/* Image gallery */}
          <div className="flex flex-col">
            <div className="bg-gray-100 rounded-lg overflow-hidden mb-4">
              <img
                src={product.images?.[activeImage]?.image || defaultImage}
                alt={product.title}
                className="w-full h-[400px] object-cover object-center"
              />
            </div>

            {/* Thumbnail navigation */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2 mt-2">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setActiveImage(index)}
                    className={`relative rounded-md overflow-hidden h-16 w-16 flex-shrink-0 ${
                      activeImage === index
                        ? "ring-2 ring-primary-500"
                        : "ring-1 ring-gray-200"
                    }`}
                  >
                    <img
                      src={image.image}
                      alt={`${product.title} - ${index + 1}`}
                      className="w-full h-full object-cover object-center"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product details */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              {product.title}
            </h1>

            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl text-gray-900 font-bold">
                {formatPrice(product.unit_price)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Including tax: {product.price_with_tax}
              </p>
            </div>

            {/* Collection */}
            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <Tag className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-500">Collection:</span>
                <Link
                  to={`/collections/${product.collection}`}
                  className="text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  View Collection
                </Link>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900">Description</h3>
              <div className="mt-2 prose prose-sm text-gray-700">
                <p>{product.description}</p>
              </div>
            </div>

            {/* Features/highlights */}
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900">Highlights</h3>
              <div className="mt-4 space-y-2">
                {/* Placeholder highlights for demo */}
                <div className="flex items-center">
                  <Truck className="h-5 w-5 text-green-500 mr-2" />
                  <p className="text-sm text-gray-700">
                    Fast shipping - 2-3 business days
                  </p>
                </div>
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <p className="text-sm text-gray-700">
                    Premium quality materials
                  </p>
                </div>
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm text-gray-700">
                    30-day money-back guarantee
                  </p>
                </div>
              </div>
            </div>

            {/* Add to cart */}
            <div className="mt-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-32">
                  <label htmlFor="quantity" className="sr-only">
                    Quantity
                  </label>
                  <div className="flex border border-gray-300 rounded-md">
                    <button
                      type="button"
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                      className="px-3 py-2 bg-gray-100 border-r border-gray-300 rounded-l-md hover:bg-gray-200"
                    >
                      -
                    </button>
                    <input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="block w-full text-center border-0 focus:ring-0"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 bg-gray-100 border-l border-gray-300 rounded-r-md hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>
                </div>

                <Button
                  variant="primary"
                  className="flex-1 sm:flex-initial"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
              </div>

              <p className="mt-4 text-sm text-gray-500">
                {product.inventory > 0 ? (
                  <span className="text-green-600 font-medium">In stock</span>
                ) : (
                  <span className="text-red-600 font-medium">Out of stock</span>
                )}
                {product.inventory > 0 && product.inventory < 10 && (
                  <span className="ml-2">Only {product.inventory} left!</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetailPage;
