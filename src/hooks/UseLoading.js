import { useState } from "react";

const useLoading = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Fungsi untuk memulai loading
  const startLoading = () => setIsLoading(true);

  // Fungsi untuk menghentikan loading
  const stopLoading = () => setIsLoading(false);

  return { isLoading, startLoading, stopLoading };
};

export default useLoading;
