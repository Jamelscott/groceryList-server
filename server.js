require("dotenv").config();
// require("./models");
// const bodyParser = require("body-parser");
const express = require("express");
const db = require("./models/index");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3001;
const io = require('socket.io')(3001, {
  cors: {
    origin : ['http://localhost:3000']
  }
})

// middlewares
app.use(cors());
app.use(express.json());
io.on("connection", socket => {
  try {
    socket.on('new-save', async (items)=>{
    console.log(items)
    await db.Item.remove();
    const allItems = await db.Item.insertMany([...items]);
    io.emit('sending-new-items', allItems)
  })

  } catch (err) {
    console.log(err.message);
  }
  
})
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

// app.post("/", async (req, res) => {
//   try {
//     const clientData = req.body;
//     await db.Item.remove();
//     const allItems = await db.Item.insertMany([...req.body]);
//     // console.log(allItems);
//     res.json(allItems);
//   } catch (err) {
//     console.log(err.message);
//   }
// });

app.listen(PORT, () =>
  console.log(
    `listening to the smooth sounds of port ${PORT} in the morning 🌊`
  )
);
