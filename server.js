const express = require('express')
const cors = require('cors')

const stocks = require("./src/stocks/routes")
const auth = require("./src/auth/routes")
const predict = require("./src/server/routes")
const db = require("./src/model/connection")

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended: true}))

db.sequelize.sync().then(() => {
  console.log("Database connect")
})

app.use("/stocks", stocks)
app.use("/", auth)
app.use("/", predict)

// const PORT = 8080

app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${process.env.PORT}`)
})