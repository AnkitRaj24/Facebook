import React, { useEffect, useState } from "react";

const App = () => {
  const [profile, setProfile] = useState(null);
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [pageDetails, setPageDetails] = useState({});
  const [error, setError] = useState(null);
  const [since, setSince] = useState("");
  const [until, setUntil] = useState("");

  useEffect(() => {
    // Load Facebook SDK
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: "486088357288497",
        cookie: true,
        xfbml: true,
        version: "v13.0",
      });

      // Check login status on init
      window.FB.getLoginStatus((response) => {
        if (response.status === "connected") {
          fetchUserProfile(response.authResponse.accessToken);
          fetchPages(response.authResponse.accessToken);
        }
      });
    };

    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }, []);

  const handleLogin = () => {
    window.FB.login(
      (response) => {
        if (response.authResponse) {
          fetchUserProfile(response.authResponse.accessToken);
          fetchPages(response.authResponse.accessToken);
        } else {
          console.log("User cancelled login or did not fully authorize.");
          setError("User cancelled login or did not fully authorize.");
        }
      },
      {
        scope:
          "public_profile,email,pages_show_list,pages_read_engagement,pages_read_user_content",
      }
    );
  };

  const fetchUserProfile = (accessToken) => {
    window.FB.api(
      "/me",
      { fields: "name,email,picture", access_token: accessToken },
      (response) => {
        if (response && !response.error) {
          setProfile(response);
        } else {
          console.error("Error fetching profile: ", response.error);
          setError(response.error);
        }
      }
    );
  };

  const fetchPages = (accessToken) => {
    window.FB.api("/me/accounts", { access_token: accessToken }, (response) => {
      if (response && !response.error) {
        setPages(response.data);
      } else {
        console.error("Error fetching pages: ", response.error);
        setError(response.error);
      }
    });
  };

  const handlePageSelect = (event) => {
    const pageId = event.target.value;
    setSelectedPage(pageId);
    fetchPageDetails(pageId);
  };

  const fetchPageDetails = (pageId) => {
    const accessToken = window.FB.getAccessToken();
    const params = {
      access_token: accessToken,
      since: since,
      until: until,
      period: "day",
    };

    window.FB.api(
      `/${pageId}/insights?metric=page_fans,page_engaged_users,page_impressions,page_reactions_on_post`,
      params,
      (response) => {
        if (response && !response.error) {
          const details = {
            fans:
              response.data.find((metric) => metric.name === "page_fans")
                ?.values[0].value || 0,
            engagement:
              response.data.find(
                (metric) => metric.name === "page_engaged_users"
              )?.values[0].value || 0,
            impressions:
              response.data.find((metric) => metric.name === "page_impressions")
                ?.values[0].value || 0,
            reactions:
              response.data.find(
                (metric) => metric.name === "page_reactions_on_post"
              )?.values[0].value || 0,
          };
          setPageDetails(details);
        } else {
          console.error("Error fetching page details: ", response.error);
          setError(response.error);
        }
      }
    );
  };

  return (
    <div>
      {!profile ? (
        <button onClick={handleLogin}>Login with Facebook</button>
      ) : (
        <div>
          <h1>Welcome, {profile.name}</h1>
          <img src={profile.picture.data.url} alt="Profile" />
        </div>
      )}

      {pages.length > 0 && (
        <div>
          <h2>Pages Managed by User:</h2>
          <select onChange={handlePageSelect}>
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
          <button onClick={() => fetchPageDetails(selectedPage)}>
            Get Page Details
          </button>
        </div>
      )}

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

      {error && (
        <div>
          <h2>Error: {error.message}</h2>
        </div>
      )}
    </div>
  );
};

export default App;
