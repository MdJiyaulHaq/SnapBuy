import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Layout from "../components/layout/Layout";
import ProductGrid from "../components/products/ProductGrid";
import CollectionCard from "../components/products/CollectionCard";
import Button from "../components/common/Button";
import { getCollections, getProduct } from "../api/products";
import { Product, Collection } from "../types/api";
import toast from "react-hot-toast";

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const collectionsData = await getCollections();
        setCollections(collectionsData.slice(0, 3));

        // Get featured products from collections
        const featuredProductIds = collectionsData
          .map((collection) => collection.featured_product)
          .filter((id): id is number => id !== null);

        // Fetch each featured product
        const featuredProductPromises = featuredProductIds.map((id) =>
          getProduct(id).catch(() => null)
        );

        const products = await Promise.all(featuredProductPromises);
        setFeaturedProducts(products.filter((p): p is Product => p !== null));
      } catch (error) {
        console.error("Error fetching data:", error);
        const errorMessage = "Failed to load content. Please try again later.";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-900 to-primary-600 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Discover Amazing Products at Unbeatable Prices
            </h1>
            <p className="text-xl mb-8 text-white/90">
              Shop the latest trends and find everything you need, all in one
              place.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => (window.location.href = "/products")}
              >
                Shop Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent text-white border-white hover:bg-white/10"
                onClick={() => (window.location.href = "/collections")}
              >
                Browse Collections
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Shop by Collection
            </h2>
            <Link
              to="/collections"
              className="text-primary-600 hover:text-primary-700 flex items-center"
            >
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Featured Products
            </h2>
            <Link
              to="/products"
              className="text-primary-600 hover:text-primary-700 flex items-center"
            >
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <ProductGrid products={featuredProducts} loading={loading} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-secondary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Sign Up & Get 10% Off</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join our community and get exclusive access to promotions, new
            arrivals, and more.
          </p>
          <Button
            variant="outline"
            size="lg"
            className="bg-transparent text-white border-white hover:bg-white/10"
            onClick={() => (window.location.href = "/register")}
          >
            Sign Up Now
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
