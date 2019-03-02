

var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table2');
var productList = [];

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Houston123$",
  database: "bamazon_db"

});
connection.connect();


var customerData = function () {
  connection.query("SELECT * FROM products order by id", function (err, res) {
    if (err) throw err;
    console.log("----------------------------");
    console.log("bamazon customerData");
    console.log("------------------------------");
    console.log("looking for product by id");
    console.log("");

    var table = new Table({
      head: ["ID", "Item", "Cost" ,"Quantity"],
      colWidths: [5, 15, 10, 10],
      colAligns: ["center", "left", "right", "left"],
      style: {
        head: ["blue"],
        compact: true
      }

    })
    //reset productlist
    productList = res

    for (var i = 0; i < res.length; i++) { 
      table.push([res[i].id, 
        res[i].product_name, 
        res[i].price,
        res[i].stock_quantity]);
    }
    //show table
    console.log(table.toString());
    console.log("");
    //get product details
    productDetails();
  });
};

var productDetails = function () {
  inquirer.prompt([
  {
    name: "itemsToBuy",
    type: "input",
    message: "Please enter the id of the item you want to buy!",
  },
  {
    name: "quantity",
    type: "input",
    message: "How many items would you like to buy?"
  }
]).then(function (firstResp) {
    var selection = parseInt(firstResp.itemsToBuy);
    //.log(selection);
    var amount = parseInt(firstResp.quantity);
    //console.log(amount);

    //filter product list to get selected item (array.filter)
    var filter = productList.filter(function(product){return product.id === selection})
    if (filter.length === 0)
    {
      console.log("You entered an invalid id")
      return;
    }
    else if(filter[0].stock_quantity >= amount){
      ///update the database
      var newquantity = filter[0].stock_quantity - quantity;
         connection.query(
            "UPDATE PRODUCT SET stock_quantity =" +
            newquantity +
            "WHERE id =" +
             filter[0].id,

         )}
    else {
      console.log("Insufficent items in stock")
      return;
    }
  })}
  // else
  //   inquirer.prompt({
  //     name: "quantity",
  //     type: "input",
  //     message: "number of item you like to buy"

  //   })
  //     .then(function (secondResp) {
  //       var quantity = secondResp.quantity;
  //       if (quantity > res[0].stock_quantity) {
  //         console.log(
  //           "sorry we are low " +
  //           res[0].stock_quantity +
  //           "in this item you selected"

  //         );
  //         shopping();
  //       } else {
  //         console.log("");
  //         console.log(res[0].productToBuy + "");
  //         console.log(quantity + "qty @ $" + res[0].price);

  //         
  //           function (err, resupdate) {
  //             if (err) throw err;
  //             console.log("");
  //             console.log("you order has been processed ");
  //             console.log("Thank you!" + "come back and see us!");
  //             console.log("");
  //             connection.end();
  //           }
  //         )
  //       }

  //     }

  //     )};
customerData();
