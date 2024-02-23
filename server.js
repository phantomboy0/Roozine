const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/appendData", (req, res) => {
  // Get the received data from the request body
  const receivedData = req.body;

  // Read the existing data from the database.json file (if it exists)
  let existingData = [];
  try {
    existingData = JSON.parse(fs.readFileSync("db.json", "utf8"));
  } catch (error) {
    console.error("Error reading db.json:", error.message);
  }

  // Append the received data to the existing data
  existingData.push(receivedData);

  // Write the updated data back to the database.json file
  fs.writeFileSync("db.json", JSON.stringify(existingData, null, 2), "utf8");

  // Send a response back to the client
  res.json({ success: true, message: "Data appended to db.json" });
});

app.get("/getData", (req, res) => {
  console.log("Request received at /getData"); // Add this line
  console.log(`Server port on ${env.port}`);
  try {
    const data = JSON.parse(fs.readFileSync("db.json", "utf8"));
    res.json(data);
  } catch (error) {
    console.error("Error reading database.json:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
