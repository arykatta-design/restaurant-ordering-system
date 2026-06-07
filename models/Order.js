const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    table: Number,
    items: Array,
    total: Number,
    status: {
        type: String,
        default: "Preparing"
    },
    time: String
})

module.exports = mongoose.model("Order", orderSchema)