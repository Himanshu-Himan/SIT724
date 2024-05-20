function selectUnit(unitName) {
  alert(unitName);
}
let authToken = localStorage.getItem("authToken1");

// Call refreshAuthToken initially to get the token
refreshAuthToken();

const url = `http://localhost:3000/api/units`;
const headers = {
  Accept: "application/json",
  Username: "aadmin",
  Auth_Token: authToken, // Initial authentication token
};

const queryParams = new URLSearchParams({
  include_in_active: true,
});

const url1 = `http://localhost:3000/api/units/`;
const headers1 = {
  Accept: "application/json",
  Username: "aadmin",
  Auth_Token: authToken, // Initial authentication token
};

const queryParams1 = new URLSearchParams({
  include_in_active: true,
});

const requestOptions = {
  headers: headers,
};

const requestOptions1 = {
  headers: headers1,
};

fetch(`${url}?${queryParams.toString()}`, requestOptions)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    console.log(data);
    data.forEach((datas) => {
      fetch(`${url1}/${datas.id}`, requestOptions1)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((unitData) => {
          console.log(unitData);
          if (unitData.active) {
            const currentDay = new Date().toLocaleString("en-us", {
              weekday: "long",
            });
            const currentTime = new Date();
            let unitButtonCreated = false; // Flag to check if button for unit is already created
            unitData.tutorials.forEach((tutorial) => {
              if (tutorial.meeting_day === currentDay) {
                const meetingTime = new Date(
                  currentTime.toDateString() + " " + tutorial.meeting_time
                );
                const timeDifference =
                  Math.abs(currentTime - meetingTime) / 36e5; // Convert milliseconds to hours
                if (timeDifference <= 3) {
                  // Check if time difference is less than or equal to 3 hours
                  if (!unitButtonCreated) {
                    const unitButton = document.createElement("button");
                    unitButton.className = "button";
                    unitButton.textContent = unitData.name;
                    unitButton.id = unitData.id;
                    unitButton.addEventListener("click", () =>
                      selectUnit(unitData.name)
                    );
                    document
                      .querySelector(".stream-deck")
                      .appendChild(unitButton);
                    unitButtonCreated = true; // Set flag to true indicating button for unit is created
                  }
                }
              }
            });
          }
        });
    });
  });

// Function to refresh authentication token
async function refreshAuthToken() {
  try {
    const response = await fetch("http://localhost:3000/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "aadmin",
        password: "password",
      }),
    });
    const responseData = await response.json();
    authToken = responseData.auth_token;
    localStorage.setItem("authToken1", authToken);
    console.log("Authentication token refreshed:", authToken);
    // After refreshing token, fetch student IDs
  } catch (error) {
    console.error("Error refreshing authentication token:", error);
  }
}
