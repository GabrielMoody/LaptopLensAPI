const { DataTypes } = require("sequelize")
const db = require("./connection")

const stocks = db.sequelize.define("stocks", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  buying_price: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  selling_price: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  total_stocks: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
})

const incoming_stock_transaction = db.sequelize.define("incoming_stock_transaction", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  vendor_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  }, 
  incoming_date: {
    type: DataTypes.DATE,
    allowNull: false
  }, 
  total_stock: {
    type: DataTypes.INTEGER,
    allowNull: false
  }, 
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false
  }, 
  total_price: {
    type: DataTypes.DECIMAL,
    allowNull: false
  }
})

const outgoing_stock_transaction = db.sequelize.define("outgoing_stock_transaction", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  buyer_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  buyer_address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }, 
  type: {
    type: DataTypes.STRING,
    allowNull: false
  }, 
  date: {
    type: DataTypes.DATE,
    allowNull: false
  }, 
  total: {
    type: DataTypes.INTEGER,
    allowNull: false
  }, 
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  total_price: {
    type: DataTypes.DECIMAL,
    allowNull: false
  }
})

module.exports = {
  stocks,
  incoming_stock_transaction,
  outgoing_stock_transaction
}