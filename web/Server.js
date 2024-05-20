const express = require("express");
const app = express();

const port = process.env.PORT || 3001;
const base = `${__dirname}/public`;

app.use(express.static("public"));

app.get("/Add_card", (req, res) => {
  res.sendFile(`${base}/Add_card_page.html`);
});

app.get("/", (req, res) => {
  res.sendFile(`${base}/Attendance.html`);
});

app.get("/stream", (req, res) => {
  res.sendFile(`${base}/stream_deck.html`);
});

app.get("/unideck", (req, res) => {
  res.sendFile(`${base}/unideck.html`);
});

app.get("/room", (req, res) => {
  res.sendFile(`${base}/room.html`);
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
