import React from "react";
import "./ProfileCard.css";
import pic1 from './Images/pic2.jpg'
const ProfileCard = ({profile}) => {
  return (
    <div className="profile-card">
      <div className="cover-photo">
        <img src={pic1} alt="Cover" />
      </div>
      <div className="profile-info">
        <div className="profile-picture">
          <img src={profile.picture.data.url} alt="Profile" />
        </div>
        <div className="profile-details">
        <h1>{profile.name.toUpperCase()}</h1>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
