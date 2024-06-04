const { Sequelize } = require("sequelize")
const database = require("../../config/database.js")

const { DataTypes } = Sequelize;

const barangMasuk = database.define('barangmasuk',{
    nama_barang: {
        type: DataTypes.STRING,
    },
    nama_vendor: {
        type: DataTypes.STRING,
    },
    jenis_barang: {
        type: DataTypes.STRING,
    },
    tanggal_masuk: {
        type: DataTypes.DATE,
    },
    jumlah_barang:{
        type: DataTypes.INTEGER,
    },
    harga_barang:{
        type: DataTypes.FLOAT,
    },
    total_harga:{
        type: DataTypes.FLOAT,
    },
},{
    freezeTableName:true
});

module.exports = barangMasuk