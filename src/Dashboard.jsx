import React, { useState } from "react";
import ProfileCard from "./ProfileCard";
import "./Dashboard.css";

const Dashboard = ({
  profile,
  pages,
  selectedPage,
  setSelectedPage,
  pageDetails,
  since,
  setSince,
  until,
  setUntil,
  handleLogout,
  fetchPageAccessToken,
}) => {
  const [showMetrics, setShowMetrics] = useState(false);

  const onPageSelect = (event) => {
    const pageId = event.target.value;
    setSelectedPage(pageId);
    setShowMetrics(false); // Hide metrics when a new page is selected
  };

  const handleShowMetrics = () => {
    fetchPageAccessToken(selectedPage);
    setShowMetrics(true); // Show metrics when the SHOW button is clicked
  };

  return (
    <div className="dashBoard">
      <div>
        <ProfileCard profile={profile}></ProfileCard>
      </div>
      <div className="page-details-container">
        <div className="header">
          {pages.length > 0 && (
            <div className="page-select-container">
              <label>
                <b>PAGES&nbsp;&nbsp;</b>
                <select value={selectedPage} onChange={onPageSelect}>
                  <option value="">CHOOSE</option>
                  {pages.map((page) => (
                    <option key={page.id} value={page.id}>
                      {page.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}
          <div className="date-inputs">
            <label>
              <b>&nbsp;SINCE</b>
              <input
                type="date"
                value={since}
                onChange={(e) => setSince(e.target.value)}
              />
            </label>
            <label>
              <b>&nbsp;UNTIL</b>
              <input
                type="date"
                value={until}
                onChange={(e) => setUntil(e.target.value)}
              />
            </label>
            <button onClick={handleShowMetrics} className="fetch-button">
              SHOW
            </button>
            <button
              onClick={handleLogout}
              className="loginBtn loginBtn--facebook"
              style={{ width: 110 }}
            >
              Logout
            </button>
          </div>
        </div>

        {showMetrics && pageDetails && (
          <div className="metrics-container">
            <div className="metric-card">
              <strong>Total Followers :&nbsp;</strong>
              <b>{pageDetails.fans}</b>
            </div>
            <div className="metric-card">
              <strong>Total Engagement:&nbsp;</strong>
              <b>{pageDetails.engagement}</b>
            </div>
            <div className="metric-card">
              <strong>Total Impressions:&nbsp;</strong>
              <b>{pageDetails.impressions}</b>
            </div>
            <div className="metric-card">
              <strong>Total Reactions:&nbsp;</strong>
              <b>{pageDetails.reactions}</b>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
