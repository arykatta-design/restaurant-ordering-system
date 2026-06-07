const express = require("express")
require("dotenv").config()
const mongoose = require("mongoose")
const multer = require("multer")
const path = require("path")

const Order = require("./models/Order")
const Menu = require("./models/Menu")

const app = express()

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log("✅ MongoDB Connected")
})
.catch((err) => {
    console.log("❌ MongoDB Error:", err)
})

app.use(express.json())
app.use(express.static("public"))
app.use("/uploads", express.static("uploads"))

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(
            null,
            Date.now() + path.extname(file.originalname)
        )
    }
})

const upload = multer({
    storage
})

const defaultMenu = [
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

app.get("/seed-menu", async (req, res) => {

    await Menu.deleteMany({})
    await Menu.insertMany(defaultMenu)

    res.json({
        message: "Menu seeded successfully"
    })
})

app.get("/menu", async (req, res) => {

    const menuItems = await Menu.find()

    res.json(menuItems)
})

app.post(
    "/menu",
    upload.single("image"),
    async (req, res) => {

        const item = new Menu({
            name: req.body.name,
            price: req.body.price,
            image: "/uploads/" + req.file.filename
        })

        await item.save()

        res.json({
            message: "Menu item added"
        })
    }
)

app.put("/menu/:id", async (req, res) => {

    await Menu.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            price: req.body.price,
            image: req.body.image
        }
    )

    res.json({
        message: "Menu item updated"
    })
})

app.delete("/menu/:id", async (req, res) => {

    await Menu.findByIdAndDelete(req.params.id)

    res.json({
        message: "Menu item deleted"
    })
})

app.post("/toggle-stock/:id", async (req, res) => {

    const item = await Menu.findById(req.params.id)

    item.available = !item.available

    await item.save()

    res.json({
        message: "Stock updated"
    })
})

app.get("/admin-menu", async (req, res) => {

    console.log("🔥 ADMIN MENU ROUTE HIT")

    try {

        const menuItems = await Menu.find()

        console.log("Found items:", menuItems.length)

        res.json(menuItems)

    } catch(err) {

        console.log("ERROR:", err)

        res.status(500).json({
            error: err.message
        })
    }
})

app.post("/order", async (req, res) => {

    const order = new Order({
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
    })

    await order.save()

    res.json({
        message: "Order received"
    })
})

app.get("/orders", async (req, res) => {

    const orders = await Order.find().sort({ _id: -1 })

    res.json(orders)
})

app.get("/sales", async (req, res) => {

    const orders = await Order.find()

    const totalSales = orders.reduce(
        (sum, order) => sum + order.total,
        0
    )

    res.json({
        totalSales
    })
})

app.post("/status/:id", async (req, res) => {

    await Order.findByIdAndUpdate(
        req.params.id,
        {
            status: req.body.status
        }
    )

    res.json({
        message: "Status updated"
    })
})

app.delete("/order/:id", async (req, res) => {

    await Order.findByIdAndDelete(
        req.params.id
    )

    res.json({
        message: "Order deleted"
    })
})

app.get("/order-status/:table", async (req, res) => {

    const orders = await Order.find({
        table: req.params.table
    })

    res.json(orders)
})

app.get("/admin", (req, res) => {
    res.sendFile(__dirname + "/public/admin.html")
})

const PORT = process.env.PORT || 3000
app.get("/menu-manager", (req, res) => {
    res.sendFile(__dirname + "/public/admin-menu.html")
})

app.listen(PORT, "0.0.0.0", () => {
    console.log("🔥 THIS IS THE NEW APP.JS FILE")
    console.log(`🚀 Server running on port ${PORT}`)
})