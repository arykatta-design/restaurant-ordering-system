let cart = []

fetch("/menu")
.then(res => res.json())
.then(menu => {

    const menuDiv = document.getElementById("menu")

    menuDiv.innerHTML = ""

    menu.forEach(item => {

        menuDiv.innerHTML += `
            <div class="card">

                <img src="${item.image}" width="250">

                <h2>${item.name}</h2>

                <p>₹${item.price}</p>

                ${
                    item.available
                    ?
                    `<button onclick='addToCart(${JSON.stringify(item)})'>
                        🛒 Add To Cart
                    </button>`
                    :
                    `<button disabled
                        style="background:red;color:white;cursor:not-allowed;">
                        Out Of Stock
                    </button>`
                }

            </div>
        `
    })

})

function addToCart(item) {

    let note = prompt(
        "Special Instructions?\n\nExamples:\n• Extra Cheese\n• No Onion\n• Less Spicy"
    )

    if(note === null){
        note = ""
    }

    const existingItem = cart.find(
        cartItem =>
            cartItem._id === item._id &&
            cartItem.note === note
    )

    if(existingItem){

        existingItem.quantity++

    }else{

        cart.push({
            ...item,
            quantity: 1,
            note: note
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

        <div class="cart-item">

            <p>
                <strong>${item.name}</strong>
                - ₹${itemTotal}
            </p>

            <div class="qty-controls">

                <button onclick="decreaseQty(${index})">
                    -
                </button>

                <span class="qty-number">
                    ${item.quantity}
                </span>

                <button onclick="increaseQty(${index})">
                    +
                </button>

            </div>

            ${
                item.note
                ?
                `<small>📝 ${item.note}</small>`
                :
                ""
            }

        </div>

        `
    })

    document.getElementById("total").innerText =
        `Total: ₹${total}`

    const totalItems =
        cart.reduce(
            (sum,item)=>sum+item.quantity,
            0
        )

    document.getElementById("floating-cart").innerText =
        `🛒 Cart (${totalItems}) • ₹${total}`
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

function checkStatus(){

    const params =
        new URLSearchParams(window.location.search)

    const tableNumber =
        params.get("table") || 1

    window.location.href =
        "/status.html?table=" + tableNumber
}

function placeOrder() {

    if(cart.length === 0){
        alert("Cart is empty")
        return
    }

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
    .then(() => {

        cart = []

        renderCart()

        window.location.href =
            "/status.html?table=" + tableNumber
    })
}

function toggleCart(){

    const drawer =
        document.getElementById("cartDrawer")

    drawer.classList.toggle("open")
}