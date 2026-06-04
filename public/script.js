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

        cart = []

        renderCart()

        window.location.href =
            "/status.html?table=" + tableNumber
    })
}