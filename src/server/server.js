const express = require('express')

const stocks = require("./routes")

const app = express()

app.use(express.json())

app.use("/stocks", stocks)

const PORT = 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})