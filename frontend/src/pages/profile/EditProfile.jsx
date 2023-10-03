import React, { useEffect, useState } from "react";
import "./Profile.scss";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { selectUser } from "../../redux/features/auth/authSlice";
import Loader from "../../components/loader/Loader";
import Card from "../../components/card/Card";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector(selectUser);
  const { email } = user;

  useEffect(() => {
    if (!email) {
      navigate("/profile");
    }
  }, [email, navigate]);

  const initialState = {
    name: user?.name,
    email: user?.email,
    address: user?.address,
    description: user?.description,
    photo: user?.photo,
  };
  const [profile, setProfile] = useState(initialState);
  const [profileImage, setProfileImage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  };
  return (
    <div className="profile --my2">
      {isLoading && <Loader />}

      <Card cardClass={"card --flex-dir-column"}>
        <form className="--form-control --m" onSubmit={saveProfile}>
          {/* <h2>Edit-Profile Page</h2> */}
          <span className="profile-data">
            <p>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={profile?.name}
                onChange={handleInputChange}
                className="editProfile"
              />
            </p>
            <p>
              <label>Email:</label>
              <input
                type="text"
                name="email"
                value={profile?.email}
                disabled
                className="editProfile"
              />
            </p>
            <p>
              <label>Address:</label>
              <input
                type="text"
                name="address"
                value={profile?.address}
                onChange={handleInputChange}
                className="editProfile"
              />
            </p>
            <label>Description:</label>
            <p>
              <textarea
                type="text"
                name="description"
                value={profile?.description}
                onChange={handleInputChange}
                cols="30"
                rows="4"
              ></textarea>
            </p>

            <div>
              <button className="--btn --btn-primary">Save Profile</button>
            </div>
          </span>
        </form>
      </Card>
    </div>
  );
};

export default EditProfile;
