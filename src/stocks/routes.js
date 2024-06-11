const express = require("express")
const router = express.Router()
const {verifyToken} = require("../auth/middleware")

const {
  getAllStocks,
  getStockByIDHandler,
  postIncomingStockHandler,
  postOutgoingStockHandler,
  getCSVData
  } = require("./handler")

router.use(verifyToken)

router.get("/", getAllStocks)
router.get("/:stockId", getStockByIDHandler)
router.post("/incoming", postIncomingStockHandler)
router.post("/outgoing", postOutgoingStockHandler)
router.post("/export", getCSVData)

module.exports = router