require("dotenv").config();
// require("./models");
// const bodyParser = require("body-parser");
const express = require("express");
const db = require("./models/index");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3001;

// middlewares
app.use(cors());
app.use(express.json());
// app.use(bodyParser.json());

const myMiddleWare = (req, res, next) => {
  console.log(`incoming request: ${req.method} - ${req.url}`);
  // move along there
  next();
};

app.use(myMiddleWare);

app.get("/", async (req, res) => {
  try {
    const allItems = await db.Item.find({});
    res.json(allItems);
    console.log(allItems);
  } catch (err) {
    console.log(err.message);
  }
});

app.post("/", async (req, res) => {
  try {
    const clientData = req.body;
    await db.Item.remove();
    const allItems = await db.Item.insertMany([...req.body]);
    console.log(allItems);
    res.json(allItems);
  } catch (err) {
    console.log(err.message);
  }
});

app.listen(PORT, () =>
  console.log(
    `listening to the smooth sounds of port ${PORT} in the morning 🌊`
  )
);
