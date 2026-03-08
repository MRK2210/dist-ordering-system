    async function placeOrder() {

        const shopName = document.getElementById("shopName").value;
        const mobile = document.getElementById("mobile").value;

        const lassi = Number(document.getElementById("lassi").value);
        const mattha = Number(document.getElementById("mattha").value);
        const buttermilk = Number(document.getElementById("buttermilk").value);

        const order = {
            shopName,
            mobile,
            lassi,
            mattha,
            buttermilk
        };


        console.log("Sending order:", order);

        try {

            const response = await fetch("/api/placeorder", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(order)
            });

            const result = await response.text();

            alert(result);

        } catch (error) {

            console.error("Error:", error);
            alert("Order failed");

        }
    }
