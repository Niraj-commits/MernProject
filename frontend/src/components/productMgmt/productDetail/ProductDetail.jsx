import React, { useEffect } from "react";
import "./ProductDetail.scss";
import useRedirectLoggedOutUser from "../../../customHook/useRedirectLoggedOutUser";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getProduct } from "../../../redux/features/product/productSlice";
import Card from "../../card/Card";
import { selectIsLoggedIn } from "../../../redux/features/auth/authSlice";
import { SpinnerImg } from "../../loader/Loader";
import DOMPurify from "dompurify";

const ProductDetail = () => {
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();
  const { id } = useParams();

  const isLoggedIn = useSelector(selectIsLoggedIn);

  const { product, isLoading, isError, message } = useSelector(
    (state) => state.product
  );

  const status = (quantity) => {
    if (quantity > 0) {
      return <span className="--color-success">InStock</span>;
    }
    return <span className="--color-danger">Out Of Stock</span>;
  };

  useEffect(() => {
    if (isLoggedIn === true) {
      dispatch(getProduct(id));
      console.log(product);
    }
    if (isError) {
      console.log(message);
    }
  }, [isLoggedIn, isError, message, dispatch]);
  return (
    <div className="product-detail">
      <h3 className="--mt">Product Detail</h3>
      <Card cardClass="card">
        {isLoading && <SpinnerImg />}
        {product && (
          <div className="detail">
            <Card cardClass="group">
              {product?.image ? (
                <img
                  src={product.image.filePath}
                  alt={product.image.fileName}
                />
              ) : (
                <p>No Image Set For this Product</p>
              )}
            </Card>
            <h4>Product Availability: {status(product.quantity)}</h4>
            <hr />
            <h4>
              <span className="badge">Name: </span> &nbsp; {product.name}
            </h4>
            <p>
              <b>SKU : </b> {product.sku}
            </p>
            <p>
              <b>Category : </b> {product.category}
            </p>
            <p>
              <b>Price : </b> {"Rs."}
              {product.price}
            </p>
            <p>
              <b>Quantity : </b> {product.quantity}
            </p>
            <p>
              <b>Total Value : </b> {"Rs."}
              {product.price * product.quantity}
            </p>
            <hr />
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(product.description),
              }}
            ></div>
            <hr />
            <code className="--color-dark size">
              Created on: {product.createdAt.toLocaleString()}
            </code>
            <br />
            <code className="--color-dark size">
              Last Updated: {product.updatedAt.toLocaleString()}
            </code>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProductDetail;
