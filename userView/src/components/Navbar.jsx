import { ShoppingCart } from "phosphor-react";
import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { useDispatch, useSelector } from "react-redux";
const Navbar = () => {
  // const navigate = useNavigate();
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  return (
    <div className="navbar">
      {/* {userInfo && ( */}
      <div className="links">
        <Link to="/">Shop</Link>
        <Link to="cart">
          <ShoppingCart size={32} />
        </Link>
      </div>
      {/* )} */}
    </div>
  );
};

export default Navbar;
