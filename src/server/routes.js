const express = require("express")
const router = express.Router()

const {
  getAllStocks,
  getStockByIDHandler,
  postIncomingStockHandler,
  postOutgoingStockHandler
  } = require("./handler")

router.get("/", getAllStocks)
router.get("/:stockId", getStockByIDHandler)
router.post("/incoming", postIncomingStockHandler)
router.post("/outgoing", postOutgoingStockHandler)

module.exports = router