import api from "./index";
import { Product, ProductsResponse, Collection } from "../types/api";

export const getProducts = async (
  page = 1,
  search = "",
  ordering = "",
  collection = ""
) => {
  try {
    console.log("Fetching products with params:", {
      page,
      search,
      ordering,
      collection,
    });
    const response = await api.get<ProductsResponse>("/store/products/", {
      params: {
        page,
        search,
        ordering,
        collection_id: collection || undefined, // Only include if collection is not empty
      },
    });
    console.log("Products API Response:", response.data);

    // Return default structure if response is invalid
    if (!response.data || typeof response.data !== "object") {
      return {
        count: 0,
        results: [],
        next: null,
        previous: null,
      };
    }

    // Ensure results is always an array
    const results = Array.isArray(response.data.results)
      ? response.data.results
      : [];

    return {
      count: response.data.count || 0,
      results,
      next: response.data.next || null,
      previous: response.data.previous || null,
    };
  } catch (error: any) {
    console.error(
      "Error fetching products:",
      error.response?.data || error.message
    );
    // Return default structure on error
    return {
      count: 0,
      results: [],
      next: null,
      previous: null,
    };
  }
};

export const getProduct = async (id: number) => {
  try {
    console.log("Fetching product:", id);
    const response = await api.get<Product>(`/store/products/${id}/`);
    console.log("Single Product API Response:", response.data);

    if (!response.data || typeof response.data !== "object") {
      throw new Error("Invalid product data received from API");
    }

    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching product:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getCollections = async () => {
  try {
    console.log("Fetching collections");
    const response = await api.get<Collection[]>("/store/collections/");
    console.log("Collections API Response:", response.data);

    // Return empty array if response is invalid
    if (!response.data) {
      return [];
    }

    // Ensure response is always an array
    return Array.isArray(response.data) ? response.data : [];
  } catch (error: any) {
    console.error(
      "Error fetching collections:",
      error.response?.data || error.message
    );
    // Return empty array on error
    return [];
  }
};

export const getCollection = async (id: number) => {
  try {
    console.log("Fetching collection:", id);
    const response = await api.get<Collection>(`/store/collections/${id}/`);
    console.log("Single Collection API Response:", response.data);

    if (!response.data || typeof response.data !== "object") {
      throw new Error("Invalid collection data received from API");
    }

    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching collection:",
      error.response?.data || error.message
    );
    throw error;
  }
};
