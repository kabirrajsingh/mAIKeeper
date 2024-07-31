import React from "react";
import './ProductCard2.css'; // Import custom CSS
import { CartButton } from "../Pages/ProductPaga";
import { Link, useParams } from "react-router-dom";
export const ProductCard2 = ({ title, price, description }) => {
  return (
    <div className="product-card">
      <div className="product-header">
        <h3>{title}</h3>
        <p className="product-price">{price}</p>
      </div>
      <div className="product-body">
        <p>{description}</p>
      </div>
      <Link to='/CartPage'><CartButton name="Add to Cart" color=""  /></Link>
    </div>
  );
};
