const API_URL = "http://localhost:5000/api";
let receivedData = "";
let temp = false;

async function sendDataToServer(card_id) {
  const existingData = await $.get(`${API_URL}/student`);
  const student_id = document.getElementById("itemDropdown").value;

  const isAlreadyRegistered = existingData.some((entry) => {
    return entry.card_id === card_id;
  });

  const body = {
    card_id,
    student_id,
  };

  if (!isAlreadyRegistered) {
    try {
      $.post(`${API_URL}/student`, body)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.error(`Error: ${error}`);
        });
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  }
}

let usbVendorId = 0x3343,
  usbProductId = 0x0043;

async function connectSerial() {
  try {
    const port = await navigator.serial.getPorts().then((ports) => {
      if (!ports.length)
        return navigator.serial.requestPort({
          filters: [{ usbVendorId, usbProductId }],
        });
      else return Promise.resolve(ports[0]);
    });
    await port.open({ baudRate: 9600 });

    const textDecoder = new TextDecoderStream();
    const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
    const reader = textDecoder.readable.getReader();

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        reader.releaseLock();
        break;
      }

      const chunk = value;
      receivedData += chunk;

      if (receivedData.includes("\n")) {
        const lines = receivedData.split("\n");
        receivedData = lines.pop(); // Save the incomplete line

        lines.forEach((line) => {
          console.log(line); // Process each complete line
          sendDataToServer(line); // Send to server
        });
      }
    }

    await readableStreamClosed.catch((error) => {
      console.error(`Error: ${error}`);
    });
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

connectSerial();
// var studentIds = "";

// const url = "http://localhost:3000/api/students";
// const headers = {
//   Accept: "application/json",
//   Username: "aadmin",
//   Auth_Token: "RabpSNAsz6ysxdFjW3D_",
// };

// const queryParams = new URLSearchParams({
//   unit_id: 1,
//   all: false,
// });

// const requestOptions = {
//   headers: headers,
// };

// const itemDropdown = document.getElementById("itemDropdown");

// fetch(`${url}?${queryParams.toString()}`, requestOptions)
//   .then((response) => {
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }
//     return response.json();
//   })
//   .then((data) => {
//     //console.log(data);
//     studentIds = data.map((item) => item.student_id);
//     console.log(studentIds);

//     const initialOption = document.createElement("option");
//     initialOption.value = "";
//     initialOption.textContent = "Select student id";
//     itemDropdown.appendChild(initialOption);

//     studentIds.forEach((item) => {
//       const option = document.createElement("option");
//       option.value = item;
//       option.textContent = item;
//       itemDropdown.appendChild(option);
//     });
//   })
//   .catch((error) => {
//     console.error(error.message);
//   });

let authToken = localStorage.getItem("authToken");

const url = "http://localhost:3000/api/students";
const queryParams = new URLSearchParams({
  unit_id: 1,
  all: false,
});

function fetchStudentIds() {
  const headers = {
    Accept: "application/json",
    Username: "aadmin",
    Auth_Token: authToken,
  };
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
      studentIds = data.map((item) => item.student_id);
      console.log(studentIds);

      const initialOption = document.createElement("option");
      initialOption.value = "";
      initialOption.textContent = "Select student id";
      itemDropdown.appendChild(initialOption);

      studentIds.forEach((item) => {
        const option = document.createElement("option");
        option.value = item;
        option.textContent = item;
        itemDropdown.appendChild(option);
      });
    })
    .catch((error) => {
      console.error(error.message);
    });
}

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
    localStorage.setItem("authToken", authToken);
    console.log("Authentication token refreshed:", authToken);
    // After refreshing token, fetch student IDs
    fetchStudentIds();
  } catch (error) {
    console.error("Error refreshing authentication token:", error);
  }
}

// Call refreshAuthToken initially to get the token
refreshAuthToken();

$("#home").on("click", () => {
  location.href = "/";
});
