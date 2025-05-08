import api from "../api";

export function getMediaUrl(path: string | null | undefined): string {
  if (!path) return "";

  // If it's already a full URL, return as is
  if (path.startsWith("http")) {
    return path;
  }

  // Remove leading slash if present
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  // Get the base URL from the API configuration
  const baseUrl = api.defaults.baseURL || "http://127.0.0.1:8000/";

  // Combine the base URL with the media path
  return `${baseUrl}${cleanPath}`;
}
