let receivedData = "";
const API_URL = "http://localhost:5000/api";

connectSerial();

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

          $.get(`${API_URL}/student`)
            .then((response) => {
              Autheticate(response, line);
            })
            .catch((error) => {
              console.error(`Error: ${error}`);
            });
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

function Autheticate(response, card_id) {
  var student_id ="";
  var checker = false;
  const date = new Date();
  var _status = "";
  response.forEach((check) => {
    if (check.card_id == card_id) {
      checker = !checker;
      student_id = check.student_id;
    }
  });

  if (checker) {
    console.log("Succesfull");
    _status = "Present";
    const body = {
      card_id,
      student_id,
      date,
      _status,
    };
    $.post(`${API_URL}/attendance`, body)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(`Error: ${error}`);
      });
  } else {
    console.log("Incorrect");
    _status = "Card not registered";
    const body = {
      card_id,
      student_id,
      date,
      _status,
    };
    $.post(`${API_URL}/attendance`, body)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(`Error: ${error}`);
      });
  }
}

$("#next").on("click", () => {
  location.href = "/Add_card";
});
