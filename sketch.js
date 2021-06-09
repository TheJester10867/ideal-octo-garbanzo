var PLAY = 1;
var END = 0;
var START = 2;
var gameState = START;

var trex, trex_running, trex_collided, trex_resting;
var ground, invisibleGround, groundImage;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score = 0;
var gameOver, restart, start, startImg;

localStorage["HighestScore"] = 0;

function preload(){
  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  trex_resting = loadAnimation("trex1.png")
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  startImg = loadImage("start.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(displayWidth - 150, displayHeight / 1.5);
  console.log(displayWidth);
  console.log(displayHeight / 1.5);

  ground = createSprite(2500, 472, 5000, 100);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;
  if (gameState === PLAY){
    ground.velocityX = -(6 + 3* score/ 100);
  }

  trex = createSprite(100, ground.y - 22, 80, 200);
  trex.addAnimation("resting", trex_resting);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.67;
  trex.debug = true;
  
  gameOver = createSprite(canvas.width / 2, (canvas.height / 2) - 20);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(canvas.width / 2, (canvas.height / 2) + 20);
  restart.addImage(restartImg);

  start = createSprite(canvas.width / 2, canvas.height / 2);
  start.addImage(startImg);
  start.scale = 0.3;

  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(2500, 485, 5000, 10);
  invisibleGround.visible = true;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw(){
  background(225);
  frameRate(32);
  textSize(20);
  if (localStorage["Highest Score"] !== undefined){
    text("Highest Score: "+ localStorage["Highest Score"], (canvas.width / 20) - 10, (canvas.height / 20) + 5);
    text("Score: "+ score, (canvas.width / 20) - 10, (canvas.height / 20) + 30);
  } else {
    text("Score: "+ score, (canvas.width / 20) - 10, (canvas.height / 20) + 5);
  }
  
  camera.position.y = canvas.height / 2;

  if (gameState === START && mousePressedOver(start)){
    start.destroy();
    trex.changeAnimation("running", trex_running);
    gameState = PLAY;
  } else if (gameState === PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3 * score/ 100);
  
    if(keyWentDown("space") && trex.y >= (trex.y - 50)) {
      trex.velocityY = -15;
    }
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  } else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  drawSprites();
}

function spawnClouds() {
  if (frameCount % 60 === 0) {
    var rndm = Math.random(75, 375);
    var cloud = createSprite(canvas.width + rndm, (canvas.width / 4) - (canvas.width / 10), 40, 10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

function spawnObstacles() {
  if(frameCount % 100 === 0) {
    var obstacle = createSprite(canvas.width + 200, ground.y - 10, 10, 40);
    obstacle.debug = true;
    obstacle.velocityX = -(6 + 3 * score/ 100);
    obstacle.scale = 1.5;
    
    //generate random obstacles
    var rand = Math.round(random(1, 6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = START;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  if(localStorage["HighestScore"] < score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  score = 0;
}