const {incoming_stock_transaction, outgoing_stock_transaction} = require("../model/stocks")

export async function postIncomingStockHandler (req, res) {
  const {
    name, 
    vendor_name, 
    type, 
    incoming_date, 
    total_stock, 
    price, 
    total_price
  } = req.body;

  const data = await incoming_stock_transaction.create({
    name, 
    vendor_name, 
    type, 
    incoming_date, 
    total_stock, 
    price, 
    total_price
  })

  res.json({
    status: "Success",
    data
  }).status(201)
}

export async function postOutgoingStockHandler(req, res) {
  const {
    buyer_name,
    buyer_address,
    name,
    type,
    date,
    total,
    price,
    total_price
  } = req.body

  const data = await outgoing_stock_transaction.create({
    buyer_name,
    buyer_address,
    name,
    type,
    date,
    total,
    price,
    total_price
  })

  return res.json({
    status: "Success",
    data
  }).status(201)
}

export async function getIncomingStocksHandler(req, res) {
  const {id} = req.params

  const data = await incoming_stock_transaction.findByPk(id)

  if(data === null) {
    return res.json({
      status: "Fail",
      message: "Data not found."
    }).status(404)
  }

  return res.json({
    status: "Success",
    data
  }).status(200)
}

export async function getOutgoingStocksHandler(req, res) {
  const {id} = req.params

  const data = await outgoing_stock_transaction.findByPk(id)

  if(data === null) {
    return res.json({
      status: "Fail",
      message: "Data not found."
    }).status(404)
  }

  return res.json({
    status: "Success",
    data
  }).status(200)
}