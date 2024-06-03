const express = require('express')

const stocks = require("./routes")
const db = require("../model/connection")

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

db.sequelize.sync({force: true}).then(() => {
  console.log("Drop db")
})

app.use("/stocks", stocks)

const PORT = 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})