const {v4: uuidv4} = require("uuid")

const incomingStockHandler = (req, h) => {
  const {
    name, 
    vendor_name, 
    type, 
    incoming_date, 
    total_stock, 
    price, 
    total_price
  } = req.payload;

  return h.response({
    status: "success",
    data: {
      name,
      vendor_name,
      type,
      incoming_date,
      total_stock,
      price,
      total_price
    }
  }).code(201);
}