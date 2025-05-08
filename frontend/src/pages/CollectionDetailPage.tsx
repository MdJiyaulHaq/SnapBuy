import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";
import Layout from "../components/layout/Layout";
import ProductGrid from "../components/products/ProductGrid";
import Loader from "../components/common/Loader";
import { getCollectionDetails } from "../api/products";
import { Collection, Product } from "../types/api";
import toast from "react-hot-toast";

const CollectionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);
      try {
        const data = await getCollectionDetails(id);
        setCollection(data.collection);
        setProducts(data.products);
        document.title = `${data.collection.title} Collection | SnapBuy`;
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.detail || "Failed to load collection details";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      document.title = "SnapBuy"; // Reset title on unmount
    };
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-20">
          <Loader size="lg" />
        </div>
      </Layout>
    );
  }

  if (error || !collection) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Collection Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            {error || "The collection you are looking for does not exist."}
          </p>
          <Link
            to="/collections"
            className="text-primary-600 hover:text-primary-700 inline-flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Collections
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
                to="/collections"
                className="text-gray-500 hover:text-gray-700"
              >
                Collections
              </Link>
            </li>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <li className="text-gray-900 font-medium truncate">
              {collection.title}
            </li>
          </ol>
        </nav>

        {/* Collection header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {collection.title}
          </h1>
          <p className="text-gray-600">{collection.product_count} Products</p>
        </div>

        {/* Products grid */}
        {products.length > 0 ? (
          <ProductGrid products={products} loading={false} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">
              No products found in this collection.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CollectionDetailPage;
