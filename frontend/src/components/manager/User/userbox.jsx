import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./userbox.css";

const UserBox = () => {
  const [userCount, setUserCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await axios.get("http://localhost:5000/user/users/count");
        setUserCount(response.data.count);
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };

    fetchUserCount();
  }, []);

  const handleClick = () => {
    navigate("/manager/students"); // Replace with the actual route
  };

  return (
    <div className="userboxnumber-container" onClick={handleClick}>
      <div className="userboxnumber-inner">
        <h3 className="userboxnumber-title">Users</h3>
        <p className="userboxnumber-count">{userCount}</p>
        <p className="userboxnumber-subtitle">Total Registered Users</p>
      </div>
    </div>
  );
};

export default UserBox;
