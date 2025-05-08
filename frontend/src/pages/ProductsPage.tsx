import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  RefreshCw,
} from "lucide-react";
import Layout from "../components/layout/Layout";
import ProductGrid from "../components/products/ProductGrid";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { getProducts, getCollections } from "../api/products";
import { Product, Collection } from "../types/api";
import toast from "react-hot-toast";

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const currentPage = parseInt(searchParams.get("page") || "1");
  const searchQuery = searchParams.get("search") || "";
  const selectedCollection = searchParams.get("collection") || "";
  const ordering = searchParams.get("ordering") || "";

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsData, collectionsData] = await Promise.all([
        getProducts(currentPage, searchQuery, ordering, selectedCollection),
        getCollections(),
      ]);

      // Validate and set products data
      if (productsData && Array.isArray(productsData.results)) {
        setProducts(productsData.results);
        setTotalPages(Math.ceil(productsData.count / 12));
      } else {
        console.error("Invalid products data:", productsData);
        setProducts([]);
        setTotalPages(1);
      }

      // Validate and set collections data
      if (Array.isArray(collectionsData)) {
        setCollections(collectionsData);
      } else {
        console.error("Invalid collections data:", collectionsData);
        setCollections([]);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        "Failed to load products. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
      setProducts([]);
      setCollections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, searchQuery, selectedCollection, ordering]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchParams.set("page", "1");
    setSearchParams(searchParams);
  };

  const handleCollectionChange = (collectionId: string) => {
    if (collectionId === selectedCollection) {
      searchParams.delete("collection");
    } else {
      searchParams.set("collection", collectionId);
    }
    searchParams.set("page", "1");
    setSearchParams(searchParams);
  };

  const handleOrderingChange = (value: string) => {
    if (value) {
      searchParams.set("ordering", value);
    } else {
      searchParams.delete("ordering");
    }
    setSearchParams(searchParams);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    searchParams.set("page", newPage.toString());
    setSearchParams(searchParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const setSearchTerm = (term: string) => {
    if (term) {
      searchParams.set("search", term);
    } else {
      searchParams.delete("search");
    }
  };

  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <Button
            variant="primary"
            onClick={fetchData}
            className="inline-flex items-center"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Products</h1>

        {/* Mobile filter button */}
        <div className="lg:hidden mb-4">
          <Button
            variant="outline"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="w-full flex justify-center items-center"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            {filtersOpen ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar - desktop always visible, mobile toggleable */}
          <div
            className={`lg:block lg:w-64 flex-shrink-0 ${
              filtersOpen ? "block" : "hidden"
            }`}
          >
            <div className="bg-white p-4 rounded-lg shadow-sm">
              {/* Search input */}
              <form onSubmit={handleSearchSubmit} className="mb-6">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    fullWidth
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </form>

              {/* Collection filter */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Collections</h3>
                <div className="space-y-2">
                  {collections.map((collection) => (
                    <div key={collection.id} className="flex items-center">
                      <input
                        id={`collection-${collection.id}`}
                        type="checkbox"
                        checked={
                          selectedCollection === collection.id.toString()
                        }
                        onChange={() =>
                          handleCollectionChange(collection.id.toString())
                        }
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`collection-${collection.id}`}
                        className="ml-2 text-sm text-gray-700"
                      >
                        {collection.title} ({collection.product_count})
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price sorting */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Sort By</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="price-asc"
                      type="radio"
                      name="sort"
                      checked={ordering === "unit_price"}
                      onChange={() => handleOrderingChange("unit_price")}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <label
                      htmlFor="price-asc"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Price: Low to High
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="price-desc"
                      type="radio"
                      name="sort"
                      checked={ordering === "-unit_price"}
                      onChange={() => handleOrderingChange("-unit_price")}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <label
                      htmlFor="price-desc"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Price: High to Low
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="name-asc"
                      type="radio"
                      name="sort"
                      checked={ordering === "title"}
                      onChange={() => handleOrderingChange("title")}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <label
                      htmlFor="name-asc"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Name: A to Z
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="name-desc"
                      type="radio"
                      name="sort"
                      checked={ordering === "-title"}
                      onChange={() => handleOrderingChange("-title")}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <label
                      htmlFor="name-desc"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Name: Z to A
                    </label>
                  </div>
                  {ordering && (
                    <div className="mt-2">
                      <button
                        className="text-sm text-primary-600 hover:text-primary-700"
                        onClick={() => handleOrderingChange("")}
                      >
                        Clear Sorting
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Products grid */}
          <div className="flex-1">
            <ProductGrid products={products} loading={loading} />

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav
                  className="inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    const isCurrentPage = pageNum === currentPage;

                    // Only show a limited set of page numbers
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            isCurrentPage
                              ? "z-10 bg-primary-50 border-primary-500 text-primary-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }

                    // Show ellipsis
                    if (
                      (pageNum === 2 && currentPage > 3) ||
                      (pageNum === totalPages - 1 &&
                        currentPage < totalPages - 2)
                    ) {
                      return (
                        <span
                          key={pageNum}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                        >
                          ...
                        </span>
                      );
                    }

                    return null;
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductsPage;
