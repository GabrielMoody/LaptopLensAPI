import { Op } from "sequelize";

const {incoming_stock_transaction, outgoing_stock_transaction, stocks} = require("../model/stocks")

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

  try{
    const data = await incoming_stock_transaction.create({
      name, 
      vendor_name, 
      type, 
      incoming_date, 
      total_stock, 
      price, 
      total_price
    })
  } catch(e) {
    if(e.name == "SequelizeValidationError") {
      return res.json({
        status: "Fail",
        message: e.errors.map(e => e.message)
      }).status(400)
    }
  }

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

  try {
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
  } catch(e) {
    if(e.name == "SequelizeValidationError") {
      return res.json({
        status: "Fail",
        message: e.errors.map(e => e.message)
      }).status(400)
    }
  }

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

export async function postStockHandler(req, res) {
  const {
    name,
    type,
    category,
    buying_price,
    selling_price,
    total_stocks  
  } = req.params

  try{
    const data = await stocks.create({
      name,
      type,
      category,
      buying_price,
      selling_price,
      total_stocks  
    })
  } catch(e) {
    if(e.name == "SequelizeValidationError") {
      return res.json({
        status: "Fail",
        message: e.errors.map(e => e.message)
      }).status(400)
    }
  }

  return res.json({
    status: "Success",
    data
  }).status(201)
}

export async function getFilterStockHandler(req, res) {
  const { category } = req.query

  const data = null;

  if(category == "low-end"){
    data = await stocks.findAll({
      where: {
        selling_price: {
          [Op.lte]: 8000000
        }
      }
    })
  } else if(category == "mid-end"){
    data = await stocks.findAll({
      where: {
        selling_price: {
          [Op.between]: [8000000, 16000000] 
        }
      }
    })
  } else {
    data = await stocks.findAll({
      where: {
        selling_price: {
          [Op.gt]: 16000000      
        }
      }
    })
  }

  if(data == null) {
    return res.json({
      status: "Fail",
      message: "Data not found"
    }).status(400)
  }

  return res.json({
    status: "Success",
    data
  }).status(200)
}