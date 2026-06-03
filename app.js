const express = require("express")

const app = express()

app.use(express.json())
app.use(express.static("public"))

const menu = [
    {
        id: 1,
        name: "Margherita Pizza",
        price: 299,
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591"
    },
    {
        id: 2,
        name: "Paneer Pizza",
        price: 399,
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38"
    },
    {
        id: 3,
        name: "French Fries",
        price: 149,
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877"
    },
    {
        id: 4,
        name: "Cold Coffee",
        price: 199,
        image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c"
    }
]

let orders = []
let nextOrderId = 1

app.get("/menu", (req, res) => {
    res.json(menu)
})

app.post("/order", (req, res) => {

    const order = {
    id: nextOrderId++,
    table: req.body.table,
    items: req.body.items,
    total: req.body.total,
    status: "Preparing",
    time: new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true
})
}

    orders.push(order)

    res.json({
        message: "Order received"
    })
})

app.get("/orders", (req, res) => {
    res.json(orders)
})

app.get("/sales", (req, res) => {

    let totalSales = 0

    orders.forEach(order => {
        totalSales += order.total
    })

    res.json({
        totalSales
    })
})

app.post("/status/:id", (req, res) => {

    const order = orders.find(
        o => o.id == req.params.id
    )

    if (order) {
        order.status = req.body.status
    }

    res.json({
        message: "Status updated"
    })
})

app.delete("/order/:id", (req, res) => {

    orders = orders.filter(
        order => order.id != req.params.id
    )

    res.json({
        message: "Order cleared"
    })
})

app.get("/admin", (req, res) => {
    res.sendFile(__dirname + "/public/admin.html")
})

const PORT = process.env.PORT || 3000

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`)
})