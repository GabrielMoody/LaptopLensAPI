const express = require("express")
const router = express.Router()

const {postIncomingStockHandler, postOutgoingStockHandler, getIncomingStocksHandler, getOutgoingStocksHandler} = require("./handler")

router.get("/", (req, res) => {
  res.end("Hello world")
})

router.get("/incoming/:id", getIncomingStocksHandler)
router.get("/outgoing/:id", getOutgoingStocksHandler)
router.post("/incoming", postIncomingStockHandler)
router.post("/outgoing", postOutgoingStockHandler)

module.exports = router