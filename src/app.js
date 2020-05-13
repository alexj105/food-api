const express = require('express')
require('./db/mongoose.js')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/menu')

const app = express()
app.use(express.json())
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // обновить, чтобы соответствовать домену, с которого вы сделаете запрос
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", 'PATCH')
  res.header("Access-Control-Allow-Methods", 'DELETE')
  next();
});

app.use(userRouter)
app.use(taskRouter)
module.exports = app   
