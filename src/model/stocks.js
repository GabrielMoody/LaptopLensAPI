const { DataTypes } = require("sequelize")
const db = require("./connection")

const stocks = db.sequelize.define("stocks", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  vendor_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  total_stocks: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
})

const incoming_stock_transaction = db.sequelize.define("incoming_stock_transaction", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nama_vendor: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false
  }, 
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }, 
  sales: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
})

const outgoing_stock_transaction = db.sequelize.define("outgoing_stock_transaction", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false
  }, 
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }, 
  sales: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
})

module.exports = {
  stocks,
  incoming_stock_transaction,
  outgoing_stock_transaction
}