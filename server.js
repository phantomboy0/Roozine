const express = require("express");
//const fs = require("fs");
const fs = require("@cyclic.sh/s3fs")(
  "cyclic-vast-plum-ladybug-slip-us-west-1"
);
const cors = require("cors");
const { log } = require("console");
const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/appendData", (req, res) => {
  // Get the received data from the request body
  const receivedData = req.body;
  //likes
  receivedData.l = 0;
  //dislikes
  receivedData.d = 0;
  //heart
  receivedData.h = 0;
  //smiles
  receivedData.s = 0;
  //cry
  receivedData.c = 0;
  // Read the existing data from the database.json file (if it exists)
  let existingData = [];
  try {
    existingData = JSON.parse(fs.readFileSync("db.json", "utf8"));
  } catch (error) {
    console.error("Error reading db.json:", error.message);
  }

  try {
    lastUsedId = JSON.parse(fs.readFileSync("id.json", "utf8"));
    ++lastUsedId.lastID;
    req.body.id = lastUsedId.lastID;
  } catch (error) {
    console.error("Error reading id.json:", error.message);
  }

  fs.writeFileSync("id.json", JSON.stringify(lastUsedId, null, 2), "utf8");

  // Append the received data to the existing data
  existingData.push(receivedData);

  // Write the updated data back to the database.json file
  fs.writeFileSync("db.json", JSON.stringify(existingData, null, 2), "utf8");

  // Send a response back to the client
  res.json({ success: true, message: "Data appended to db.json" });
});

app.get("/getData", (req, res) => {
  console.log("Request received at /getData"); // Add this line

  try {
    const data = JSON.parse(fs.readFileSync("db.json", "utf8"));
    res.json(data);
  } catch (error) {
    console.error("Error reading database.json:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const findObjectById = (id, jsonData) => {
  return jsonData.findIndex((obj) => obj.id === id);
};

app.post("/react", (req, res) => {
  // Get the received data from the request body
  const receivedData = req.body;

  // Read the existing data from the db.json file (if it exists)
  let existingData = [];
  try {
    existingData = JSON.parse(fs.readFileSync("db.json", "utf8"));
  } catch (error) {
    console.error("Error reading db.json:", error.message);
  }

  // Find the object with ID 2 in existingData
  const foundObject = findObjectById(receivedData.id - 1, existingData) + 1;

  if (existingData[foundObject]) {
    // Update properties based on receivedData
    switch (receivedData.e) {
      case "l":
        ++existingData[foundObject].l;
        break;

      case "d":
        ++existingData[foundObject].d;
        break;

      case "h":
        ++existingData[foundObject].h;
        break;

      case "s":
        ++existingData[foundObject].s;
        break;

      case "c":
        ++existingData[foundObject].c;
        break;

      default:
        break;
    }
  } else {
    console.log(`Object with ID ${foundObject} not found.`);
  }
  console.log(existingData[foundObject].id);
  console.log(receivedData.id);
  // Append the received data to the existing data
  // existingData.push(receivedData);

  // Write the updated data back to the db.json file
  fs.writeFileSync("db.json", JSON.stringify(existingData, null, 2), "utf8");

  // Send a response back to the client
  res.json({ success: true, message: "Data appended to db.json" });
});

function chooseBestPostOfTheDay() {
  let TodaysPosts = [];
  try {
    TodaysPosts = JSON.parse(fs.readFileSync("db.json"));
  } catch (error) {
    console.error("somthing went wrong on reading db.json: " + error);
  }

  if (TodaysPosts.lenght < 1) {
    console.log("There is 0 posts to choose today?!");
    return;
  }
  let BestPost;

  BestPost = TodaysPosts[0];
  TodaysPosts.forEach((post) => {
    if (
      BestPost.l + BestPost.d + BestPost.h + BestPost.s + BestPost.c <
      post.l + post.d + post.h + post.s + post.c
    ) {
      BestPost = post;
    }
  });
  console.log("the best post was: " + BestPost);
}
chooseBestPostOfTheDay();
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
