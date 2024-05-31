const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
  res.end("Hello world")
})

router.post("/incoming", (req, res) => {

})

router.post("/outgoing", (req, res) => {

})

module.exports = router