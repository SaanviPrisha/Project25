var chef, chefImage, chefName;
var robot, robotImage, robotName;
var gameState = "start"
var database;
var counter = 0;
var buttonState = 0;
var foodButton = 0;
var x = 0;
var item1, item2, item3, item4;
var userPick, chefPick;
var background1, background2;
var Pizza, Pasta, GrilledChesse, Noodles;
var pizzaImage, pastaImage, breadImage1, noodlesImage;

function preload() {
  //load the images
  background1 = loadImage("Images/Login and Background Page/restrauntImage.jpg")
  background2 = loadImage("Images/Login and Background Page/Design.png")
  chefImage = loadImage("Images/Login and Background Page/Chef 21.16.06.png")
  robotImage = loadImage("Images/Login and Background Page/RobotProfile.png")
  pizzaImage = loadImage("Images/Pizza/PizzaWithoutToppings.png")
  pastaImage = loadImage("Images/Pasta/BoiledPasta.jpg")
  breadImage1 = loadImage("Images/Grilled Cheese/Bread (1).png")
  noodlesImage = loadImage("Images/Noodles/Noodles.png")
}
function setup() {
  //creates the canvas and database
  createCanvas(windowWidth, windowHeight);
  database = firebase.database()

  //creates the chef
  chef = createSprite(windowWidth/2 + 100, windowHeight/2, 50, 50);
  chef.addImage(chefImage)
  chef.scale = 2
  
  //creates the robot
  robot = createSprite(windowWidth/2 - 100, windowHeight/2, 50, 50);
  robot.addImage(robotImage)
  robot.scale = 0.2

  //creates the two input boxes where you put your name
  input1 = createInput("Chef Name")
  input1.position(windowWidth/2 + 70, windowHeight/2 + 100)

  input2 = createInput("Robot Name")
  input2.position(windowWidth/2 - 130, windowHeight/2 + 100)

  database.ref("Counter/").on("value", data => {
    counter = data.val().Counter
  })

  database.ref("gameState/").on("value", data => {
    gameState = data.val()
  })

  item1 = createButton("Grilled Cheese")
  item1.position(windowWidth/2 - 300, windowHeight/2)
  item1.hide()

  item2 = createButton("Pasta")
  item2.position(windowWidth/2 - 100, windowHeight/2)
  item2.hide()

  item3 = createButton("Pizza")
  item3.position(windowWidth/2, windowHeight/2)
  item3.hide()

  item4 = createButton("Noodles")
  item4.position(windowWidth/2 + 150, windowHeight/2)
  item4.hide()

  Pizza = createSprite(windowWidth/4 - 50, windowHeight - 100, 20, 20)
  Pizza.addImage(pizzaImage)
  Pizza.scale = 0.1

  Pasta = createSprite(windowWidth/3 + 50, windowHeight - 100, 20, 20)
  Pasta.addImage(pastaImage)
  Pasta.scale = 0.1

  GrilledChesse = createSprite(windowWidth/2, windowHeight - 100, 20, 20)
  GrilledChesse.addImage(breadImage1)
  GrilledChesse.scale = 0.5

  Noodles = createSprite(windowWidth/2 + 300, windowHeight - 100, 20, 20)
  Noodles.addImage(noodlesImage)
  Noodles.scale = 0.4
}
function draw() {
  //background and text
  background(230, 156, 103);
  textSize(30)
  text("No idea!", windowWidth/2 - 20, 40)

  if(buttonState == 1) {
    x = x + 1
  }
  if(x == 30) {
    buttonState = 0;
  }
  if(mousePressedOver(chef) && buttonState == 0) {
    name = input1.value()
    updateName(name, "Chef");
    buttonState = 1;
    counter = counter + 1
    updateCounter(counter);
  }
  if(mousePressedOver(robot) && buttonState == 0) {
    name = input2.value()
    updateName(name, "Robot");
    buttonState = 1
    counter = counter + 1
    updateCounter(counter);
  }
  database.ref("Players/").on("value", data => {
    chefName = data.val().Chef.name
    robotName = data.val().Robot.name
  })
  if(counter == 2) {
    gameState = "play"
    updateState(gameState);
  }
  if(gameState == "play") {
    menu();
  }
  drawSprites();

  if(userPick != undefined) {
    item1.hide()
    item2.hide()
    item3.hide()
    item4.hide()
  }
  if(chefPick != undefined) {
    item1.hide()
    item2.hide()
    item3.hide()
    item4.hide()
  }
}
//the function to update the database
function updateName(name, branch) {
    database.ref("Players/"+ branch + "/").set({
      name: name
    })
}
function updateCounter(counter) {
  database.ref("Counter/").set({
    Counter: counter
  })
}
function updateState(state) {
  database.ref("/").update({
    gameState: state
  })
}
function updateColor(item){
  database.ref("Items/" + item).update({
    color: "#03e8fc"
  })
  if(counter == 2) {
    userPick = item
    counter = counter + 1
    updateCounter(counter);
  }
  if(counter == 3) {
    chefPick = item
    counter = counter + 1 
    updateCounter(counter);
  }
}
function menu() {
  chef.visible = false;
  robot.visible = false;
  input1.hide()
  input2.hide()

  text("Choose 1 item from the menu bellow! The robot must click the button first, and then the chef can pick!", windowWidth - windowWidth + 20, 100)
  item1.show()
  item2.show()
  item3.show()
  item4.show()

  database.ref("Items/").on("value", data=>{
    var colors = data.val()
    item1.style("background-color",colors.GrilledCheese.color)
    item2.style("background-color",colors.Pasta.color)
    item3.style("background-color",colors.Pizza.color)
    item4.style("background-color",colors.Noodles.color)
  })
  item1.mousePressed(function () {
    updateColor("GrilledCheese") 
  })
  item2.mousePressed(function () {
    updateColor("Pasta")
  })
  item3.mousePressed(function () {
    updateColor("Pizza")
  })
  item4.mousePressed(function () {
    updateColor("Noodles")
  })
}


