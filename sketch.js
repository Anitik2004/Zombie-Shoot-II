var PLAY = 1;
var END = 0;
var gameState = PLAY;

var bg,bgImg;
var player, shooter_moving, shooter_shooting;
var zombiesGroup, zombie1, zombie2, zombie3, zombie4, zombie5, zombie6, zombie7, zombie8;
var enemiesGroup, enemy1, enemy2;
var villainsGroup, villain1, villain2, villain3, villain4;
var squidGroup, squidImg;
var bulletGroup, bulletImg;
var blastImg;
var creepsterFont;
var gameOverImg, restartImg;
var gameOverSound, gunshotSound, blastSound;

var score=0;
var killingScore=0;

function preload(){

  shooter1 = loadImage("shooter_1.png")
  shooter2 = loadImage("shooter_2.png")
  zombie1 = loadImage("zombie1.png");
  zombie2 = loadImage("zombie2.png");
  zombie3 = loadImage("zombie3.png");
  zombie4 = loadImage("zombie4.png");
  zombie5 = loadImage("zombie5.png");
  zombie6 = loadImage("zombie6.png");
  zombie7 = loadImage("zombie7.png");
  zombie8 = loadImage("zombie8.png");
  enemy1 = loadImage("enemy1.png");
  enemy2 = loadImage("enemy2.png");
  villain1 = loadImage("villain1.png");
  villain2 = loadImage("villain2.png");
  villain3 = loadImage("villain3.png");
  villain4 = loadImage("villain4.png");
  squidImg = loadImage("squid.png");
  bulletImg = loadImage("bullet.png")
  gameOverImg = loadImage("you-are-dead.png")
  restartImg = loadImage("restart.png")
  creepsterFont = loadFont("font.ttf")
  bgImg = loadImage("bg.jpeg")
  blastImg = loadImage("explosion.png");
  gameOverSound = loadSound("game-over.mp3")
  gunshotSound = loadSound("gunshot.mp3")
  blastSound = loadSound("explosion.mp3")

}

function setup() {
  
  createCanvas(windowWidth,windowHeight);

//adding the background image
bg = createSprite(displayWidth/2-20,displayHeight/2-40,20,20)
 bg.addImage(bgImg)
   bg.scale = 0

//creating the player sprite
player = createSprite(80, 300, 50, 50);
 player.addImage(shooter1)
   //player.addImage(shooter2)
   player.scale = 0.3
   player.debug = true;
   player.setCollider("rectangle",0,0,300,300)

//creating the game over sprite
gameOver = createSprite(800,300);
 gameOver.addImage(gameOverImg);
   gameOver.scale = 0.4
   gameOver.visible = false;

//creating the restart sprite
restart = createSprite(800,400);
 restart.addImage(restartImg);
   restart.scale = 0.5
   restart.visible = false;

//creating the explosion sprite
blast = createSprite(100,100,50,50);
 blast.addImage(blastImg)
   blast.scale=0.4
   blast.visible = false;

  squidGroup = new Group();
  bulletGroup = new Group();
  enemiesGroup = new Group();
  zombiesGroup = new Group();
  villainsGroup = new Group();

}

function draw() {
  background(bgImg);
  textSize(25);
  fill("red");
  textFont(creepsterFont);
  text("SCORE: "+ score, 10,25);
  text("ENEMIES KILLED: "+killingScore,675,25);

  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);

    if(villainsGroup.isTouching(player)){
      gameState = END;
      gameOverSound.play();
      console.log("Villain is touching the player");
    }

    if(zombiesGroup.isTouching(player)){
      gameState = END;
      gameOverSound.play();
      console.log("Zombie is touching the player");
    }

    if(enemiesGroup.isTouching(player)){
      gameState = END;
      gameOverSound.play();
      console.log("Enemy is touching the player");
    }
  
    if(squidGroup.isTouching(player)){
      gameState = END;
      gameOverSound.play();
      console.log("Squid is touching the player");
    }
  
    //moving the player up and down and making the game mobile compatible using touches
    if(player.y>75){
      if(keyDown("UP_ARROW")||touches.length>0){
        player.y = player.y-30
      }
    }
    
  
    if(player.y<700){
      if(keyDown("DOWN_ARROW")||touches.length>0){
        player.y = player.y+30
      }
    }
  
    if(player.x>100){
      if(keyDown("LEFT_ARROW")||touches.length>0){
        player.x = player.x-30
      }
    }
  
    if(player.x<1400){
      if(keyDown("RIGHT_ARROW")||touches.length>0){
        player.x = player.x+30
      }
    }

    //release bullets and change the image of shooter to shooting position when space is pressed
    if(keyWentDown("space")){
      player.addImage(shooter2)
      spawnBullets();
      bulletGroup.visible = true;
      gunshotSound.play();
    }
    //player goes back to original standing image once we stop pressing the space bar
    else if(keyWentUp("space")){
      player.addImage(shooter1)
    }

    villainsGroup.isTouching(bulletGroup,villainsDestroy);
    zombiesGroup.isTouching(bulletGroup,zombiesDestroy);
    enemiesGroup.isTouching(bulletGroup,enemiesDestroy);
    squidGroup.isTouching(bulletGroup,squidDestroy);
  }

  else if (gameState === END){
    gameOver.visible = true;
    restart.visible = true;
    squidGroup.setVelocityXEach(0);
    enemiesGroup.setVelocityXEach(0);
    zombiesGroup.setVelocityXEach(0);
    villainsGroup.setVelocityXEach(0);
    squidGroup.setLifetimeEach(-1);
    enemiesGroup.setLifetimeEach(-1);
    zombiesGroup.setLifetimeEach(-1);
    villainsGroup.setLifetimeEach(-1);
    player.destroy();
  }

  if (keyDown("r")){
    gameState = PLAY;
    gameOver.visible = false;
    restart.visible = false;
    squidGroup.destroyEach();
    enemiesGroup.destroyEach();
    zombiesGroup.destroyEach();
    villainsGroup.destroyEach();
    score = 0;
    player.addImage(shooter1)
    killingScore = 0;
    gameState = PLAY;
  }

  spawnSquids();
  spawnEnemies();
  spawnZombies();
  spawnVillains();

drawSprites();

}

function spawnSquids() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var squid = createSprite(1500,120,40,10);
    squid.y = Math.round(random(80,750));
    squid.addImage(squidImg);
    squid.scale = 0.1;
    squid.velocityX = -3;
    
     //assign lifetime to the variable
    squid.lifetime = 750;
    
    //adjust the depth
    squid.depth = player.depth;
    player.depth = player.depth + 1;
    
    //add each cloud to the group
    squidGroup.add(squid);
  }
  
}

function villainsDestroy(villain){
  blast.visible = true
  blast.x = villain.x
  blast.y = villain.y
  killingScore = killingScore + 15
  villain.remove();
  blastSound.play();
}

function zombiesDestroy(zombie){
  blast.visible = true
  blast.x = zombie.x
  blast.y = zombie.y
  killingScore = killingScore + 5
  zombie.remove();
  blastSound.play();
}

function enemiesDestroy(enemy){
  blast.visible = true
  blast.x = enemy.x
  blast.y = enemy.y
  killingScore = killingScore + 10
  enemy.remove();
  blastSound.play();
}

function squidDestroy(squid){
  blast.visible = true
  blast.x = squid.x;
  blast.y = squid.y;
  killingScore = killingScore + 10
  squid.remove();
  blastSound.play();
}

function spawnZombies() {
  if(frameCount % 60 === 0) {
    var zombie = createSprite(1500,165,10,40);
    zombie.y = Math.round(random(80,750));
    //obstacle.debug = true;
    zombie.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,8));
    switch(rand) {
      case 1: zombie.addImage(zombie1);
              break;
      case 2: zombie.addImage(zombie2);
              break;
      case 3: zombie.addImage(zombie3);
              break;
      case 4: zombie.addImage(zombie4);
              break;
      case 5: zombie.addImage(zombie5);
              break;
      case 6: zombie.addImage(zombie6);
              break;
      case 7: zombie.addImage(zombie7);
              break;
      case 8: zombie.addImage(zombie8);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    zombie.scale = 0.3;
    zombie.lifetime = 450;
    //add each obstacle to the group
    zombiesGroup.add(zombie);
  }
}

function spawnEnemies() {
  if(frameCount % 60 === 0) {
    var enemy = createSprite(1500,165,10,40);
    enemy.y = Math.round(random(80,750));
    //obstacle.debug = true;
    enemy.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: enemy.addImage(enemy1);
              break;
      case 2: enemy.addImage(enemy2);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    enemy.scale = 0.3;
    enemy.lifetime = 450;
    //add each obstacle to the group
    enemiesGroup.add(enemy);
  }
}

function spawnVillains() {
  if(frameCount % 60 === 0) {
    var villain = createSprite(1500,165,10,40);
    villain.y = Math.round(random(80,750));
    //obstacle.debug = true;
    villain.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,4));
    switch(rand) {
      case 1: villain.addImage(villain1);
              break;
      case 2: villain.addImage(villain2);
              break;
      case 3: villain.addImage(villain3);
              break;
      case 4: villain.addImage(villain4);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    villain.scale = 0.3;
    villain.lifetime = 450;
    //add each obstacle to the group
    villainsGroup.add(villain);
  }
}

function spawnBullets() {
  var bullet= createSprite(100, 100, 60, 10);
  bullet.addImage(bulletImg);
  bullet.x = player.x;
  bullet.y = player.y;
  bullet.velocityX = 16;
  bullet.lifetime = 900;
  bullet.scale = 0.3;
  bulletGroup.add(bullet);
}