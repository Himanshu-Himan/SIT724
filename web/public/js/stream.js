function selectUnit(unitName) {
  alert(unitName);
}

const url = `http://localhost:3000/api/units/${1}`;
const headers = {
  Accept: "application/json",
  Username: "aadmin",
  Auth_Token: "D6DEF6qq_X98naP1s8Cr",
};

const queryParams = new URLSearchParams({
});

const requestOptions = {
  headers: headers,
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
    data.tutorials.forEach((tutorial) => {
      const currentTime = new Date();
      const meetingTime = new Date(
        `${tutorial.meeting_day} ${tutorial.meeting_time}`
      );
      if (meetingTime > currentTime) {
        if (tutorial.campus_id === 2) {
          console.log("Unit is active and matches campus ID");
          createButton(data);
        } else {
          console.log("Unit is active but does not match campus ID");
        }
      } else {
        console.log("Unit is not active at the current time");
      }
    });
  })
  .catch((error) => {
    console.error(error.message);
  });
