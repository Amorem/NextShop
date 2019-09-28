import React from "react";
import axios from "axios";
import ProductList from "../components/Index/ProductList";
import baseUrl from "../utils/baseUrl";

function Home({ products }) {
  return <ProductList products={products} />;
}

Home.getInitialProps = async () => {
  // Fetch data on server
  const url = `${baseUrl}/api/products`;
  const response = await axios.get(url);
  // Return response as an object
  return { products: response.data };
  // This object will be merged into existing props
};

export default Home;
