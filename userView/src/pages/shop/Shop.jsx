import React, { useEffect, useState } from "react";
import PRODUCTS from "../../products";
import Product from "./Product";
import "./Shop.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getProducts } from "../../../apiCall/api";

const Shop = () => {
  const [productList, setProductList] = useState([]);

  const getProductsList = async () => {
    let response = await getProducts();
    console.log(response);
    // setProductList(response.data);
  };
  useEffect(() => {
    getProductsList();
  }, [getProductsList]);

  console.log(productList);
  // const navigate = useNavigate();
  // const dispatch = useDispatch();

  // const userLogin = useSelector((state) => state.userLogin);
  // const { userInfo } = userLogin;
  // const productList = useSelector((state) => state.productList);
  // const { loading, products, error } = productList;
  // // console.log(products);
  // React.useEffect(() => {
  //   if (!userInfo) {
  //     navigate("/login");
  //   }
  // }, [userInfo]);
  // const getProducts = async () => {
  //   try {
  //     return await axios.get(`http://localhost:8000/api/products`);
  //   } catch (error) {
  //     console.log("error has been occured");
  //   }
  // };

  // console.log(productList);
  // const res = axios
  //   .get(`http://localhost:8000/api/products`)
  //   .then(() => res.data);
  // console.log(res.data);
  return (
    <div className="shop">
      <div className="shopTitle">
        <h2> Invento User Area</h2>
      </div>
      <div className="products">
        {PRODUCTS.map((product) => (
          <div key={product.id}>
            <Product data={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
