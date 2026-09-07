const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const SERVER_URL = API_URL.replace(/\/api\/?$/, "");

export const getImageUrl = (url) => {
  if (!url) {
    return "https://placehold.co/600x600?text=No+Image";
  }

  // External image
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Backend uploaded image
  return `${SERVER_URL}${url.startsWith("/") ? url : `/${url}`}`;
};