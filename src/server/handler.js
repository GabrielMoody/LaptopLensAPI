const { Op } = require("sequelize");
const { sequelize } = require("../model/connection");
const {incoming_stock_transaction, outgoing_stock_transaction, stocks} = require("../model/stocks");

async function postIncomingStockHandler (req, res) {
  const {
    name, 
    vendor_name,
    date, 
    price, 
    quantity
  } = req.body;

  let transaction
  try{
    transaction = await sequelize.transaction();
    const data = await incoming_stock_transaction.create({
      name, 
      nama_vendor: vendor_name,
      date, 
      price, 
      sales: quantity
    },
    {
      transaction
    }
    )

    const [stock, created] = await stocks.findOrCreate({
      where: {
        name: data.name
      },
      transaction,
      defaults: {
        name: data.name,
        vendor_name: data.nama_vendor,
        price: data.price,
        total_stocks: data.sales
      }
    })
    
  if(!created){
    const updated = await stocks.update(
      { 
        total_stocks: parseInt(stock.total_stocks) + parseInt(data.sales)
      },
      {
        where: {
        id: stock.id
        }
      },
      transaction
    )
  }

  await transaction.commit()
    
  return res.json({
    status: "Success",
    data
  }).status(201)

  } catch(e) {
    if(transaction){
      await transaction.rollback()
    }
    if(e.name == "SequelizeValidationError") {
      return res.json({
        status: "Fail",
        message: e.errors.map(e => e.message)
      }).status(400)
    }
  }
}

async function postOutgoingStockHandler(req, res) {
  const {
    name,
    date, 
    price, 
    quantity
  } = req.body;

  let transaction
  try{
    transaction = await sequelize.transaction();
    const data = await outgoing_stock_transaction.create({
      name,
      date, 
      price, 
      sales: quantity
    },
    {
      transaction
    })

    const stock = await stocks.findOne({
      where: {
        name: data.name
      },
      transaction,
      attributes: ['total_stocks']
      })
    
    const updated = await stocks.update(
      { 
        total_stocks: parseInt(stock.total_stocks) - parseInt(data.sales)
      },
      {
        where: {
          name: name
        },
        transaction
      })

    await transaction.commit()
          
    return res.json({
      status: "Success",
      data
    }).status(201)
  } catch(e) {
    if(transaction){
      await transaction.rollback()
    }

    if(e.name == "SequelizeValidationError") {
      e.errors = "Quantity exceeded the current total stocks"
    }

    return res.json({
      status: "Fail",
      message: e.errors || "Data stock not found!"
    }).status(400)
  }

}

async function getStockByIDHandler(req, res) {
  const {stockId} = req.params

  const data = await stocks.findByPk(stockId)

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

async function getAllStocks(req, res) {
  const {name} = req.query

  let data = null
  if(name == null){
    data = await stocks.findAll()
  } else {
    data = await stocks.findAll({
      where: {
        name: {
          [Op.like]: `%${name}%`
        }
      }
    })
  }

  if(data == null){
    return res.json({
      status: "Fail",
      message: "Data not found"
    }).status(404)
  }

  return res.json({
    status: "Success",
    data
  }).status(200)
}

async function getCSVData(req, res) {
  const {date} = req.query

  const data = await outgoing_stock_transaction.findAll({
    where: {

    }
  })
}

module.exports = {
  getAllStocks,
  getStockByIDHandler,
  postIncomingStockHandler,
  postOutgoingStockHandler,
  getCSVData
}