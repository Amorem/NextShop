import React from "react";
import axios from "axios";

function Home({ products }) {
  console.log(products);
  return <>home</>;
}

Home.getInitialProps = async () => {
  // Fetch data on server
  const url = "http://localhost:3000/api/products";
  const response = await axios.get(url);
  // Return response as an object
  return { products: response.data };
  // This object will be merged into existing props
};

export default Home;
