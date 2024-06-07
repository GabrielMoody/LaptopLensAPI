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

  try{
    const result = await sequelize.transaction(async t => {
      const data = await incoming_stock_transaction.create({
        name, 
        nama_vendor: vendor_name,
        date, 
        price, 
        sales: quantity
      })

      const [stock, created] = await stocks.findOrCreate({
        where: {
          name: data.name
        },
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
          })
        }
        
        return data
    })
    
    return res.json({
      status: "Success",
      data: result
    }).status(201)

  } catch(e) {
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

  try{
    const result = await sequelize.transaction(async t => {
      const data = await outgoing_stock_transaction.create({
        name,
        date, 
        price, 
        sales: quantity
      })

      const stock = await stocks.find({
        where: {
          name: data.name
        }
      })

      if(stock == null) {
        return res.json({
          status: "Fail",
          message: "Data stocks not found!"
        }).status(404)
      }
      
      const updated = await stocks.update(
        { 
          total_stocks: parseInt(stock.total_stocks) - parseInt(data.sales)
        },
        {
          where: {
          id: stock.id
          }
        })
        
        return data
    })
    
    return res.json({
      status: "Success",
      data: result
    }).status(201)

  } catch(e) {
    if(e.name == "SequelizeValidationError") {
      return res.json({
        status: "Fail",
        message: e.errors.map(e => e.message)
      }).status(400)
    }
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

  const data = await stocks.findAll({
    where: {
      [Op.like]: `%${name}%`
    }
  })

  if(data == null){
    return res.json({
      status: "Fail",
      message: "Data not found"
    }).status(404)
  }

  return res.json({
    status: "Success",
    data
  })
}

module.exports = {
  getAllStocks,
  getStockByIDHandler,
  postIncomingStockHandler,
  postOutgoingStockHandler,
  getStockByName
}

// export async function getIncomingStocksHandler(req, res) {
//   const {id} = req.params

//   const data = await incoming_stock_transaction.findByPk(id)

//   if(data === null) {
//     return res.json({
//       status: "Fail",
//       message: "Data not found."
//     }).status(404)
//   }

//   return res.json({
//     status: "Success",
//     data
//   }).status(200)
// }

// export async function getOutgoingStocksHandler(req, res) {
//   const {id} = req.params

//   const data = await outgoing_stock_transaction.findByPk(id)

//   if(data === null) {
//     return res.json({
//       status: "Fail",
//       message: "Data not found."
//     }).status(404)
//   }

//   return res.json({
//     status: "Success",
//     data
//   }).status(200)
// }

// export async function postStockHandler(req, res) {
//   const {
//     name,
//     type,
//     category,
//     buying_price,
//     selling_price,
//     total_stocks  
//   } = req.body

//   try{
//     const data = await stocks.create({
//       name,
//       type,
//       category,
//       buying_price,
//       selling_price,
//       total_stocks  
//     })
//   } catch(e) {
//     if(e.name == "SequelizeValidationError") {
//       return res.json({
//         status: "Fail",
//         message: e.errors.map(e => e.message)
//       }).status(400)
//     }
//   }

//   return res.json({
//     status: "Success",
//     data
//   }).status(201)
// }

// export async function getFilterStockHandler(req, res) {
//   const { category } = req.query

//   const data = null;

//   if(category == "low-end"){
//     data = await stocks.findAll({
//       where: {
//         selling_price: {
//           [Op.lte]: 8000000
//         }
//       }
//     })
//   } else if(category == "mid-end"){
//     data = await stocks.findAll({
//       where: {
//         selling_price: {
//           [Op.between]: [8000000, 16000000] 
//         }
//       }
//     })
//   } else if(category == "high-end") {
//     data = await stocks.findAll({
//       where: {
//         selling_price: {
//           [Op.gt]: 16000000      
//         }
//       }
//     })
//   } else {
//     return res.json({
//       status: "Fail",
//       message: "Category not found"
//     }).status(400)
//   }

//   if(data == null) {
//     return res.json({
//       status: "Fail",
//       message: "Data not found"
//     }).status(404)
//   }

//   return res.json({
//     status: "Success",
//     data
//   }).status(200)
// }