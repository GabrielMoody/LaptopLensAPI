const express = require('express')
const cors = require('cors')

const stocks = require("./src/stocks/routes")
const auth = require("./src/auth/routes")
const db = require("./src/model/connection")

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended: true}))

db.sequelize.sync({force: true}).then(() => {
  console.log("Drop db")
})

app.use("/stocks", stocks)
app.use("/", auth)

const PORT = 8080

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})