const API_URL = "http://localhost:5000/api";

document
  .getElementById("roomForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const roomNum = document.getElementById("roomNum").value;
    const numTables = parseInt(document.getElementById("numTables").value);
    const numChairsPerTable = parseInt(
      document.getElementById("numChairsPerTable").value
    );

    const totalChairs = numTables * numChairsPerTable;

    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `
      <h2>Room Details:</h2>
      <p>Room Name: ${roomNum}</p>
      <p>Number of Tables: ${numTables}</p>
      <p>Number of Chairs per Table: ${numChairsPerTable}</p>
      <p>Total Number of Chairs in the Room: ${totalChairs}</p>
    `;
    const body = {
      roomNum,
      numTables,
      numChairsPerTable,
      totalChairs
    };

    $.post(`${API_URL}/room`, body)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(`Error: ${error}`);
      });
  });
