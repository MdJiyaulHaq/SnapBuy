import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, RefreshCw } from 'lucide-react';
import Layout from '../components/layout/Layout';
import CollectionCard from '../components/products/CollectionCard';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { getCollections } from '../api/products';
import { Collection } from '../types/api';
import toast from 'react-hot-toast';

const CollectionsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const searchQuery = searchParams.get('search') || '';
  const sortBy = searchParams.get('sort') || '';

  const fetchCollections = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCollections();
      setCollections(data);
      filterAndSortCollections(data, searchQuery, sortBy);
    } catch (error: any) {
      const errorMessage = 'Failed to load collections. Please try again later.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortCollections = (collections: Collection[], search: string, sort: string) => {
    let filtered = [...collections];

    // Apply search filter
    if (search) {
      filtered = filtered.filter(collection =>
        collection.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply sorting
    switch (sort) {
      case 'name_asc':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name_desc':
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'products_asc':
        filtered.sort((a, b) => a.product_count - b.product_count);
        break;
      case 'products_desc':
        filtered.sort((a, b) => b.product_count - a.product_count);
        break;
    }

    setFilteredCollections(filtered);
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  useEffect(() => {
    filterAndSortCollections(collections, searchQuery, sortBy);
  }, [searchQuery, sortBy, collections]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const search = formData.get('search') as string;
    
    if (search) {
      searchParams.set('search', search);
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams);
  };

  const handleSortChange = (value: string) => {
    if (value) {
      searchParams.set('sort', value);
    } else {
      searchParams.delete('sort');
    }
    setSearchParams(searchParams);
  };

  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <Button
            variant="primary"
            onClick={fetchCollections}
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Collections</h1>
        </div>

        {/* Mobile filter button */}
        <div className="lg:hidden mb-4">
          <Button
            variant="outline"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="w-full flex justify-center items-center"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            {filtersOpen ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar */}
          <div 
            className={`lg:block lg:w-64 flex-shrink-0 ${filtersOpen ? 'block' : 'hidden'}`}
          >
            <div className="bg-white p-4 rounded-lg shadow-sm">
              {/* Search input */}
              <form onSubmit={handleSearchSubmit} className="mb-6">
                <div className="relative">
                  <Input
                    type="text"
                    name="search"
                    placeholder="Search collections..."
                    defaultValue={searchQuery}
                    fullWidth
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </form>

              {/* Sort options */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Sort By</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="name-asc"
                      type="radio"
                      name="sort"
                      checked={sortBy === 'name_asc'}
                      onChange={() => handleSortChange('name_asc')}
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
                      checked={sortBy === 'name_desc'}
                      onChange={() => handleSortChange('name_desc')}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <label
                      htmlFor="name-desc"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Name: Z to A
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="products-asc"
                      type="radio"
                      name="sort"
                      checked={sortBy === 'products_asc'}
                      onChange={() => handleSortChange('products_asc')}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <label
                      htmlFor="products-asc"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Products: Low to High
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="products-desc"
                      type="radio"
                      name="sort"
                      checked={sortBy === 'products_desc'}
                      onChange={() => handleSortChange('products_desc')}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <label
                      htmlFor="products-desc"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Products: High to Low
                    </label>
                  </div>
                  {sortBy && (
                    <div className="mt-2">
                      <button
                        className="text-sm text-primary-600 hover:text-primary-700"
                        onClick={() => handleSortChange('')}
                      >
                        Clear Sorting
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Collections grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader size="lg" />
              </div>
            ) : filteredCollections.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-xl font-medium text-gray-900 mb-4">No Collections Found</h2>
                <p className="text-gray-600">
                  {searchQuery 
                    ? `No collections match "${searchQuery}"`
                    : 'Check back later for new collections.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCollections.map((collection) => (
                  <CollectionCard key={collection.id} collection={collection} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CollectionsPage;