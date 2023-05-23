//Post Methods for all SFSU user related pages
//Author(s): Eunice
var express = require('express');
var router = express.Router();
var db = require("../conf/database");
var bcrypt = require('bcryptjs');


//SFSU LOGIN--------------------------------------------------------------------------------------
router.post('/sfsuLogin',(req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;
  var sql = "SELECT userID,firstname,lastname,verifiedEmail,password FROM registeredUsers where verifiedEmail = ?;";
  let userid;
  let firstname;
  let lastname;
  db.query(sql,[email], function(err,result, fields){
    if(err) throw err;

    // if(result.length && (password == encryption.decryptData(result[0].password))){
    if(result.length == 1 && bcrypt.compareSync(password, result[0].password)){
        userid = result[0].userID;
        firstname = result[0].firstname;
        lastname = result[0].lastname;
        //login user
        req.session.userid = userid;  
        req.session.email = email;   
        req.session.firstName = firstname;
        req.session.lastName = lastname;
        res.locals.logged = true;
        req.session.driver = false;
        req.session.restaurantOwner = false;

        // console.log("fn: %s",  req.session.firstName);
        res.render('index', {email : req.session.email});
      }else{
        res.render('login/sfsuLogin', { 
          title: 'SFSU User Login',
          action:"/sfsuUser/sfsuLogin",
          registrationLink: "/sfsuRegistration",
          message: "Invalid Login",
          error: true
        });
       
      }
  });
});

//SFSU USER LOGOUT--------------------------------------------------------------------------
router.post('/logout', (req,res,next)=>{
  if(req.session.email){
    console.log("Logging out: %s", req.session.email);
    req.session.destroy();
    res.redirect('/');
  }
});

//SFSU USER REGISTRATION------------------------------------------------------------------


//Author: Eunice
router.post('/sfsuRegistration',(req, res, next) => {
  // console.log('registration router reached.');
  // Getting the input values from the registration form 
  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let email = req.body.email;
  let password = req.body.password;
  let confirmpassword = req.body.confirmpassword;
  //Tutorial Used: https://www.youtube.com/watch?v=auEkP8ZKWOE 
  //Checking to make sure that the confirm password and password is the same
  if(confirmpassword == password){
    if(isValid(email)){
      //Querying the database to check if the email already exists
      db.query("SELECT * FROM registeredUsers WHERE verifiedEmail = ?",[email],function(err,result,fields){

        if(err) throw err;
  
          if(result.length > 0 ){
            console.log("Email is already registered.");
          }else{
            //Hashing the password before storing into the database
            // const hashedpassword = encryption.encryptData(password);
            var hashedpassword = bcrypt.hashSync(password, 8);

            //Inserting the values from the form into the database
            let baseSQL = "INSERT INTO registeredUsers(firstname, lastname, password, verifiedEmail) VALUES (?,?,?,?)";
            db.query(baseSQL, [firstname, lastname, hashedpassword, email], function(err, result, fields){
              if(err) throw err;
              // console.log("Supposed to be redirecting to login\n");
              res.redirect('/sfsuLogin');
            })
          }
          
      })
    }else{
      // console.log("Not a valid email address.\n");
      res.render('registration/sfsuRegistration', {
        title: 'SFSU User Registration',
        sfsuUser: true,
        action: "/sfsuUser/sfsuRegistration",
        loginLink: "/SFSULogin",
        message: "Not a valid email address", 
        error: true
      });
    }
    
  }else{
    console.log("Passwords do not match\n");
    res.render('registration/sfsuRegistration', {
      title: 'SFSU User Registration',
      sfsuUser: true,
      action: "/sfsuUser/sfsuRegistration",
      loginLink: "/SFSULogin",
      message: "Passwords does not match", 
      error: true
    });
  }

});


//Function to check if the user trying to register is a SFSU email
function isValid(email){
  var parts = email.split("@");
  if(parts[1] === "sfsu.edu" || parts[1] === "mail.sfsu.edu"){
    return true;
  }
  return false;
}

//CHECKOUT----------------------------------------------------------------------------------------
var checkoutCartResults = [];


//Tutorial used: https://www.webslesson.info/2022/07/nodejs-autocomplete-search-with-mysql-database.html 
router.get('/getBuildings', function(req, res, next){
  var search_query = req.query.search_query;
  var sql = "SELECT name FROM dropoffPoints WHERE name LIKE ? LIMIT 3;";
  db.query(sql, ['%' + search_query + '%'], (err, result)=>{
    // console.log(result);
    res.json(result);
  }) 
});

router.post('/submitOrder', function(req,res,next){
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${year}-${month}-${day}`;
  let currentOwner = res.locals.userId;    


  let ticketItems = req.body.ticket;
  let buildingName = req.body.building;
  let room = req.body.room;
  let total = parseFloat(req.body.total);
  let restaurant = parseInt(req.body.ticket[0].restaurantID);
  console.log(req.body);
  console.log(restaurant);
  let numTicketItems = Object.keys(req.body.ticket).length;
  var newTickets = [];
  var cartIDs = [];
  //Getting the building id
  var buildingID = "SELECT pointID FROM dropoffPoints WHERE name = ?;";
  //Storing items inside of the orders table
  var insertOrder = "INSERT INTO team7.order(customerID, total, orderDate, restaurantName, dropoff, roomNumber) VALUES (?,?,?,?,?,?);";
  //Storing the menu items into the ticket
  var insertTicket = "INSERT INTO ticket(orderID, menuItem, quantity) VALUES ?";
  //Deleting items from the cart
  var deleteCartItems = "DELETE FROM cart WHERE cartID IN (?);";

  db.query(buildingID, [buildingName], (err, result)=>{
    if(err) throw err;
    if(result){
      let dropoffID = result[0].pointID;
      db.query(insertOrder, [currentOwner, total, currentDate, restaurant, dropoffID, room], (err, secondres)=>{
        if(err) throw err;
        let orderID = secondres.insertId;

        //Storing the individual ticket items in the array and storing the cart ids
        for(let i = 0; i < numTicketItems; i++){
          let individualTickets = [];
          individualTickets.push(orderID);
          individualTickets.push(parseInt(req.body.ticket[i].menuID));
          individualTickets.push(parseInt(req.body.ticket[i].quantity));
          newTickets.push(individualTickets);
          cartIDs.push(parseInt(req.body.ticket[i].cart));
        }

        db.query(insertTicket, [newTickets], (err, ticketRes)=>{
          if(err) throw err;
        })

        //Deleting the individual items from the cart table
        db.query(deleteCartItems, [cartIDs], (err, deleteCarts)=>{
          if(err) throw err;
        })
      })
    }
  })
  res.redirect('/orderCompleted');
});

//Delete ticket from the cart table
router.post('/deleteItem', function(req, res, next){
  let currentOwner = res.locals.userId;
  let ticketMenuID = req.body.ticket[0].delete;
  // console.log(req.body.ticket);
  let displayRestaurant;
  // console.log(ticketMenuID);
  

  var deleteItemFromCart = "DELETE FROM cart WHERE cartItem = ? AND userCart = ?;";
  db.query(deleteItemFromCart, [ticketMenuID, currentOwner], (err, result)=>{
    if(err) throw err;
  });
  
  //Getting the restaurant to be displayed again
  var getRestaurant = "SELECT restaurant FROM menu WHERE menu.menuID = ?";
  var showNewCart = "SELECT menu.menuID, menu.name, menu.images, menu.price, cart.quantity, cart.cartItemTotal FROM cart JOIN menu ON cart.cartItem = menu.menuID WHERE cart.userCart = ? AND cart.restaurantIDMenu = ?;";

  db.query(getRestaurant, [ticketMenuID], (err, result)=>{
    if(err) throw err;
    console.log(result[0].restaurant);
    displayRestaurant = result[0].restaurant;

    db.query(showNewCart, [currentOwner, displayRestaurant], (err, result)=>{
      if(err) throw err;
      console.log(result);
      checkoutCartResults = result;
      res.render('sfsu-user-pages/checkOut', {usersCart : checkoutCartResults});

    })
  })
    
})

//Menu and Cart-----------------------------------------------------------------------

var menuCartResults = [];

router.post('/addToCart', function(req, res, next){
  //Validate that it is a sfsu user
  var validLogin = true;
  if(!req.session.email){
    validLogin = false;
    res.render('login/sfsuLogin', { 
      title: 'SFSU User Login',
      action:"/sfsuUser/sfsuLogin",
      registrationLink: "/sfsuRegistration",
      message: "Please login as a SFSU user first.",
      error: true
  
    });
  }else{
    if(req.session.driver || req.session.restaurantOwner){
      validLogin = false;
      res.render('login/sfsuLogin', { 
        title: 'SFSU User Login',
        action:"/sfsuUser/sfsuLogin",
        registrationLink: "/sfsuRegistration",
        message: "Please login as a SFSU user first.",
        error: true
    
      });
    }
  }
  let numCartItems = Object.keys(req.body.cart).length;
  // console.log(numCartItems);
  if(validLogin){
    if(numCartItems >= 1){
      var cartItems = [];
      let currentOwner = res.locals.userId;    
      var newItems = false;  
      console.log(req.body.cart);
      //Used to display items in the checkout only items from that restaurant
      var display_cart_from_restaurant = req.body.restaurantid;
      var displayCart = `SELECT menu.menuID, menu.name, menu.images, menu.price, menu.restaurant, cart.cartID, cart.quantity, cart.cartItemTotal 
      FROM cart JOIN menu ON cart.cartItem = menu.menuID WHERE cart.userCart = ? AND cart.restaurantIDMenu = ?`;
      
      for(var i = 0; i < numCartItems; i++){
        if(!req.body.cart[i].cartID){
          var itemInformation = [];
          itemInformation.push(currentOwner);
          itemInformation.push(parseInt(req.body.cart[i].menuid));
          itemInformation.push(parseInt(req.body.cart[i].quantity));
          itemTotalPrice = parseFloat(req.body.cart[i].quantity) * req.body.cart[i].price;
          itemInformation.push(itemTotalPrice);
          itemInformation.push(parseInt(req.body.restaurantid));
          cartItems.push(itemInformation);
          newItems = true;
        }else{
          var updateCartItem = "UPDATE cart SET quantity = ?, cartItemTotal = ? WHERE cartID = ?;";
          var newQuantity = req.body.cart[i].quantity;
          var newPrice = newQuantity * req.body.cart[i].price;
          var updateCardID = req.body.cart[i].cartID;
          db.query(updateCartItem, [newQuantity, newPrice, updateCardID], function(err, result,fields){
            console.log("updating item");
            if(err) throw err;
          })
        }
        
      }

      
      if(newItems){
        //Inserting into the cart table
        var sql = "INSERT INTO cart(userCart, cartItem, quantity, cartItemTotal, restaurantIDMenu) VALUES ?";
        db.query(sql, [cartItems], function(err, result, fields){
          if(err) throw err;
        })
      }




      db.query(displayCart, [currentOwner, display_cart_from_restaurant], function(err, result, fields){
        if(err) throw err;
        menuCartResults = result;
        console.log(result);
        res.render('sfsu-user-pages/checkOut', {usersCart : menuCartResults});
      });
      
        
      

    } 
  }
})



module.exports = router;
