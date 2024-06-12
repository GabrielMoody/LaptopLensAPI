const { Op } = require("sequelize");
const moment = require('moment');
const { sequelize } = require("../model/connection");

const data_exporter = require('json2csv').Parser;

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
    
  return res.status(201).json({
    status: "Success",
    data
  })

  } catch(e) {
    if(transaction){
      await transaction.rollback()
    }
    if(e.name == "SequelizeValidationError") {
      return res.status(400).json({
        status: "Fail",
        message: e.errors.map(e => e.message)
      })
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
          
    return res.status(201).json({
      status: "Success",
      data
    })
  } catch(e) {
    if(transaction){
      await transaction.rollback()
    }

    if(e.name == "SequelizeValidationError") {
      e.errors = "Quantity exceeded the current total stocks"
    }

    return res.status(400).json({
      status: "Fail",
      message: e.errors || "Data stock not found!"
    })
  }

}

async function getStockByIDHandler(req, res) {
  const {stockId} = req.params

  try{
    const data = await stocks.findByPk(stockId)
    
    if(data === null) {
      return res.status(404).json({
        status: "Fail",
        message: "Data not found."
      })
    }

    return res.status(200).json({
      status: "Success",
      data
    })
  } catch(e) {
    return res.status(400).json({
      status: "Failed",
      message: "Errors occur while retrieving data"
    })
  } 
}

async function getAllStocks(req, res) {
  const {name} = req.query

  let data
  try{
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
      return res.status(404).json({
        status: "Fail",
        message: "Data not found"
      })
    }
  
    return res.status(200).json({
      status: "Success",
      data
    })
  } catch(e){
    return res.status(400).json({
      status: "Failed",
      message: "Errors occur while retrieving data"
    })
  }
}

async function getCSVData(req, res) {
  const {month} = req.query

  try{
    const data = await outgoing_stock_transaction.findAll({
      attributes: [
        'name',
        'price',
        'date',
        'sales'
      ],
      where: {
        date: {
          [Op.gte]: moment().subtract(month, 'months').toDate()
        }
      }
    })

    const parseData = JSON.parse(JSON.stringify(data))
    const header = ['name', 'price', 'date', 'sales']

    const json_data = new data_exporter({header})
    const csv_data = json_data.parse(parseData)

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=transaksi_keluar.csv");

    res.attachment('transaksi_keluar.csv').send(csv_data)
  } catch(e) {
    return res.status(400).json({
      status: "Failed",
      message : "Error occurs while retrieving data"
    })
  }

}

module.exports = {
  getAllStocks,
  getStockByIDHandler,
  postIncomingStockHandler,
  postOutgoingStockHandler,
  getCSVData
}