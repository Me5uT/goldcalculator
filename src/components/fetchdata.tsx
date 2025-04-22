import { useEffect } from "react";
import { filterGoldItems } from "../utils/utils";
import React from "react";

export const useFetchData = () => {
  const [productList, setProductList] = React.useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://finans.truncgil.com/v4/today.json"
        );
        const data = await response.json();

        localStorage.setItem(
          "productList",
          JSON.stringify(filterGoldItems(data))
        );
        setProductList(filterGoldItems(data));
      } catch (error) {
        console.error("Error fetching finance data:", error);
        // Hata durumunu handle et
      }
    };

    fetchData();
  }, []); // useEffect sadece bir kere çağrılsın diye boş bağımlılık array'i kullanılır

  return { productList };
};
