let cart = []

fetch("/menu")
.then(res => res.json())
.then(menu => {

    const menuDiv = document.getElementById("menu")

    menu.forEach(item => {

        menuDiv.innerHTML += `
            <div class="card">
                <img src="${item.image}" width="250">
                <h2>${item.name}</h2>
                <p>₹${item.price}</p>

                <button onclick='addToCart(${JSON.stringify(item)})'>
                    Add To Cart
                </button>
            </div>
        `
    })
})

function addToCart(item) {

    const existingItem = cart.find(
        cartItem => cartItem.id === item.id
    )

    if(existingItem){
        existingItem.quantity++
    }
    else{
        cart.push({
            ...item,
            quantity: 1
        })
    }

    renderCart()
}

function renderCart() {

    const cartDiv = document.getElementById("cart")

    cartDiv.innerHTML = ""

    let total = 0

    cart.forEach((item, index) => {

        const itemTotal =
            item.price * item.quantity

        total += itemTotal

        cartDiv.innerHTML += `
            <p>

                ${item.name}

                x${item.quantity}

                - ₹${itemTotal}

                <button onclick="decreaseQty(${index})">
                    -
                </button>

                <button onclick="increaseQty(${index})">
                    +
                </button>

            </p>
        `
    })

    document.getElementById("total").innerText =
        `Total: ₹${total}`
}

function increaseQty(index) {

    cart[index].quantity++

    renderCart()
}

function decreaseQty(index) {

    cart[index].quantity--

    if(cart[index].quantity <= 0){
        cart.splice(index, 1)
    }

    renderCart()
}

function placeOrder() {

    const params =
        new URLSearchParams(window.location.search)

    const tableNumber =
        params.get("table") || 1

    const total =
        cart.reduce(
            (sum, item) =>
                sum + (item.price * item.quantity),
            0
        )

    fetch("/order", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            table: tableNumber,
            items: cart,
            total: total
        })
    })
    .then(res => res.json())
    .then(data => {

        alert("Order Placed!")

window.location.href =
"/status.html?table=" + tableNumber
    })
}