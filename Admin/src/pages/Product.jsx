import React , {useEffect }from "react";
import Navbar from "../components/Navbar";
import ProductList from "../components/ProductList";
import { useNavigate } from "react-router-dom";
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
