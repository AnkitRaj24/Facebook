import React from "react";

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
  
  fetchPageDetails,
  pageAccessToken,
  fetchPageAccessToken,
}) => {
  const onPageSelect = (event) => {
    const pageId = event.target.value;
      setSelectedPage(pageId);
      fetchPageAccessToken(pageId);
    // No need to fetch pageAccessToken here, it should be handled in App component
  };

  return (
    <div>
      <div>
        <h1>Welcome, {profile.name}</h1>
        <img src={profile.picture.data.url} alt="Profile" />
        <button onClick={handleLogout}>Logout</button>
      </div>

      {pages.length > 0 && (
        <div>
          <h2>Pages Managed by User:</h2>
          <select value={selectedPage} onChange={onPageSelect}>
            <option value="">Select a page</option>
            {pages.map((page) => (
              <option key={page.id} value={page.id}>
                {page.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedPage && (
        <div>
          <h3>Selected Page Details</h3>
          <label>
            Since:
            <input
              type="date"
              value={since}
              onChange={(e) => setSince(e.target.value)}
            />
          </label>
          <label>
            Until:
            <input
              type="date"
              value={until}
              onChange={(e) => setUntil(e.target.value)}
            />
          </label>
          <button
            onClick={() => fetchPageDetails(selectedPage, pageAccessToken)}
          >
            Get Page Details
          </button>

          {pageDetails && (
            <div>
              <h3>Page Metrics</h3>
              <div>
                <strong>Total Followers / Fans:</strong> {pageDetails.fans}
              </div>
              <div>
                <strong>Total Engagement:</strong> {pageDetails.engagement}
              </div>
              <div>
                <strong>Total Impressions:</strong> {pageDetails.impressions}
              </div>
              <div>
                <strong>Total Reactions:</strong> {pageDetails.reactions}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
