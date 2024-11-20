import React from "react";
import Navbar from "../components/Navbar";
import ProductList from "../components/ProductList";
export default function Product() {
  return (
    <div>
      <div className="flex gap-3 w-full">
        <Navbar />
          <ProductList />
      </div>
    </div>
  );
}
