const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const fs = require("fs/promises");
 
function ask(question) {
    return new Promise((resolve) => rl.question(question, resolve));
}
 
async function userMenu() {
    return Number(
        await ask(
            "1) Add order to the queue\n" +
            "2) Delete the order from the queue\n" +
            "3) Count orders\n" +
            "4) Output on display\n" +
            "0) Exit the program\n"
        )
    );
}
 
async function addOrder(queue) {
    const orderData = {};
    orderData.name = await ask("Enter the name: ");
    orderData.address = await ask("Enter the address: ");
    orderData.order = [];
 
    let totalAmount = 0;
 
    while (true) {
        const pizzaData = {};
        pizzaData.name = await ask("Enter the name of the pizza: ");
        pizzaData.cost = await ask("Enter the cost of the pizza: ");
        pizzaData.quantity = Number(await ask("Enter the quantity: "));
        totalAmount += pizzaData.cost * pizzaData.quantity;
 
        orderData.order.push(pizzaData);
 
        if (!Number(await ask("Finish order 0-yes 1-no\n"))) {
            break;
        }
    }
 
    orderData.amount = totalAmount;
 
    console.log(`Total amount $${orderData.amount}`);
 
    queue.push(orderData);
}
 
async function deleteOrder(queue) {
    if (queue.length > 0) {
        const order = queue.shift();
 
        await fs.writeFile(
            "./order.txt",
            "______________________________________________\n" +
            ` Name ${order.name} | Address ${order.address} | Total amount ${order.amount}\n` +
            "______________________________________________\n",
            {
                flag: "a+",
            }
        );
 
        console.log("The order is deleted.");
    }
}
 
function countOrder(queue) {
    if (queue.length === 0) {
        console.log("No orders");
        return;
    }
 
    console.log(`Number of clients ${queue.length}`);
}
 
function outputOnDisplay(queue) {
    let counter = 1;
    for (const order of queue) {
        console.log("-".repeat(80));
        console.log(`Order ${counter}`);
        console.log(`Name ${order.name}`);
        console.log(`Address ${order.address}`);
        console.log(`Total amount ${order.amount}`);
        console.log("-".repeat(80));
    }
}
 
const menuItems = {
    1: addOrder,
    2: deleteOrder,
    3: countOrder,
    4: outputOnDisplay,
};
 
async function main() {
    const queue = [];
 
    while (true) {
        const choice = await userMenu();
 
        if (!choice) {
            break;
        }
 
        await menuItems[choice](queue);
    }
 
    rl.close();
}
 
main();