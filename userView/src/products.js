// we are using this page in the json format where the objects will have an array of products with its details
import product1 from "./assets/products/1.png";
import product2 from "./assets/products/2.png";
import product3 from "./assets/products/3.png";
import product4 from "./assets/products/4.png";
import product5 from "./assets/products/5.png";

export const PRODUCTS = [
  {
    id: 1,
    productName: "Iphone",
    price: 430,
    productImage: product1,
  },
  {
    id: 2,
    productName: "Laptop",
    price: 1400,
    productImage: product2,
  },
  {
    id: 3,
    productName: "Camera",
    price: 1000,
    productImage: product3,
  },
  {
    id: 4,
    productName: "Jacket",
    price: 97,
    productImage: product4,
  },
  {
    id: 5,
    productName: "lED",
    price: 30,
    productImage: product5,
  },
];

export default PRODUCTS;
