require("dotenv").config();
// require("./models");
// const bodyParser = require("body-parser");
const express = require("express");
const bodyParser = require('body-parser');
const db = require("./models/index");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3001;

// const io = require('socket.io')(3001, {
//   cors: {
//     origin : ['http://localhost:3000']
//   }
// })

// middlewares
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// app.use(express.json());
app.use(cors());
// const myMiddleWare = (req, res, next) => {
//   console.log(`incoming request: ${req.method} - ${req.url}`);
//   // move along there
//   next();
// };

// app.use(myMiddleWare);

// io.on("connection", socket => {
//   try {
//     socket.on('new-save', async (items)=>{
//     console.log(items)
//     await db.Item.remove();
//     const allItems = await db.Item.insertMany([...items]);
//     io.emit('sending-new-items', allItems)
//   })

//   } catch (err) {
//     console.log(err.message);
//   }
  
// })

app.use('/users', require('./controllers/users'))

app.listen(PORT, () =>
  console.log(
    `listening to the smooth sounds of port ${PORT} in the morning 🌊`
  )
);
