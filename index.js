// const CANVAS_WIDTH = 540;
// const CANVAS_HEIGHT = 860;
const CANVAS_WIDTH = 0.45*screen.width;
const CANVAS_HEIGHT = 0.5*screen.width;
const PLAYER_WIDTH = 0.066*CANVAS_WIDTH;
const OBSTACLE_SPEED = 0.005*CANVAS_WIDTH;
const PLAYER_SPEED = 0.009*CANVAS_WIDTH;
const PLAYER_HEIGHT = 0.1*CANVAS_HEIGHT;
const BACKGROUND_COLOR = 51;
const gameMode = { 
  MAIN_MENU: 0,
  PLASTIC: 1,
  GLASS_COLOR: 2,
  GLASS_COLORLESS: 3,
  METAL: 4,
  PAPER: 5,
  ORGANIC: 6,
  SUMMARY: 7,
  PAUSE_MENU: 8,
  RULES: 9,
  ROUND_START: 10
}

var player = new Player();
var img;
var pauseBackground;
var mode = gameMode.MAIN_MENU;
var currentMode;
var menu;
var semaphore = 0;
var roundSemaphore = 0;
var nextRoundSemaphore = 0;
var obstacles = new Array();
var deletedCount = 0;
var nextRound = gameMode.PLASTIC;
var points = 0;
var coutner;
var Bins = new Array(6);
var PlasticObstacleImages = new Array(3);
var GlassColorObstacleImages = new Array(3);
var GlassColorlessObstacleImages = new Array(3);
var MetalObstacleImages = new Array(3);
var PaperObstacleImages = new Array(3);
var OrganicObstacleImages = new Array(3);
var instructionImage;



function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  loadImages();
  //img = loadImage('/assets/yellowBin.png');
  //Bins[0] = img;

  menu = new MainMenu();
  menu.currentOption = 0;
  pauseMenu = new PauseMenu();
  pauseMenu.currentOption = 0;
  counter = new Counter();
}

function draw(){
  if(mode == gameMode.MAIN_MENU){
    background(BACKGROUND_COLOR);
    menu.update();
    menu.show();
  }else if(mode == gameMode.PAUSE_MENU){
    pauseMenu.show();
    pauseMenu.update();
  }else if(mode == gameMode.ROUND_START){
    if(nextRound == gameMode.PLASTIC){
      roundStart(1,'yellow');
    }else if(nextRound == gameMode.GLASS_COLOR){
      roundStart(2,'green');
    }else if(nextRound == gameMode.GLASS_COLORLESS){
      roundStart(3,'white');
    }else if(nextRound == gameMode.METAL){
      roundStart(4,'red');
    }else if(nextRound == gameMode.PAPER){
      roundStart(5,'blue');
    }else if(nextRound == gameMode.ORGANIC){
      roundStart(6,'brown');
    }
  }else if(mode == gameMode.PLASTIC){
    currentMode = gameMode.PLASTIC;
    gameplay();
  }else if(mode == gameMode.GLASS_COLOR){
    currentMode = gameMode.GLASS_COLOR;
    gameplay();
  }else if(mode == gameMode.GLASS_COLORLESS){
    currentMode = gameMode.GLASS_COLORLESS;
    gameplay();
  }else if(mode == gameMode.METAL){
    currentMode = gameMode.METAL;
    gameplay();
  }else if(mode == gameMode.PAPER){
    currentMode = gameMode.PAPER;
    gameplay();
  }else if(mode == gameMode.ORGANIC){
    currentMode = gameMode.ORGANIC;
    gameplay();
  }else if(mode == gameMode.SUMMARY){
    drawSummary();
  }else if(mode == gameMode.RULES){
    background(51);
    image(instructionImage,0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    if(keyIsDown(ENTER)){
      setTimeout(function(){mode = gameMode.MAIN_MENU},150);
    }
  }
}

function gameplay(){
  // console.log('mode' + mode + '  currentMode ' + currentMode);
  background(51);
  player.update();
  player.show();
  generateObstacle();
  drawObstacles();
  collisionDetection();
  displayPoints();
  counter.update();
  counter.show();
}

function loadImages(){
  instructionImage = loadImage('/assets/instruction2.png');

  Bins[0] = loadImage('/assets/yellowBin.png');
  Bins[1] = loadImage('/assets/greenBin.png');
  Bins[2] = loadImage('/assets/whiteBin.png');
  Bins[3] = loadImage('/assets/redBin.png');
  Bins[4] = loadImage('/assets/blueBin.png');
  Bins[5] = loadImage('/assets/organicBin.png');

  PlasticObstacleImages[0] = loadImage('/assets/Obstacles/butelkaplastik.png');
  PlasticObstacleImages[1] = loadImage('/assets/Obstacles/butelkaplastik1.png');
  PlasticObstacleImages[2] = loadImage('/assets/Obstacles/butelkaplastik2.png');
  GlassColorObstacleImages[0] = loadImage('/assets/Obstacles/butelkazielona.png');
  GlassColorObstacleImages[1] = loadImage('/assets/Obstacles/butelkazielona1.png');
  GlassColorObstacleImages[2] = loadImage('/assets/Obstacles/butelkazielona2.png');
  GlassColorlessObstacleImages[0] = loadImage('/assets/Obstacles/butelkabiala.png');
  GlassColorlessObstacleImages[1] = loadImage('/assets/Obstacles/butelkabiala1.png');
  GlassColorlessObstacleImages[2] = loadImage('/assets/Obstacles/butelkabiala2.png');
  MetalObstacleImages[0] = loadImage('/assets/Obstacles/puszka.png');
  MetalObstacleImages[1] = loadImage('/assets/Obstacles/puszka1.png');
  MetalObstacleImages[2] = loadImage('/assets/Obstacles/puszka2.png');
  PaperObstacleImages[0] = loadImage('/assets/Obstacles/papier.png');
  PaperObstacleImages[1] = loadImage('/assets/Obstacles/papier1.png');
  PaperObstacleImages[2] = loadImage('/assets/Obstacles/papier2.png');
  OrganicObstacleImages[0] = loadImage('assets/Obstacles/ogryzek.png');
  OrganicObstacleImages[1] = loadImage('assets/Obstacles/ogryzek1.png');
  OrganicObstacleImages[2] = loadImage('assets/Obstacles/ogryzek2.png');
}

function drawSummary(){
  background(51);
  textSize(30);
  fill(255);
  text('GRATULACJE!',CANVAS_WIDTH/2 - 100,CANVAS_HEIGHT/2 - 150);
  text('TWÓJ WYNIK TO:',CANVAS_WIDTH / 2 - 120, CANVAS_HEIGHT / 2 - 100);
  textSize(46);
  text(`${points}`, CANVAS_WIDTH/2 - 10,CANVAS_HEIGHT /2 - 40);
  textSize(30);
  text('PUNKTÓW', CANVAS_WIDTH/2-73,CANVAS_HEIGHT /2 + 10);
  text('WYJŚCIE', CANVAS_WIDTH/2 -63,CANVAS_HEIGHT /2 + 120);
  noFill();
  stroke(255);
  rect(CANVAS_WIDTH/2 -73,CANVAS_HEIGHT/2+75,150,63);
  if(keyIsDown(ENTER)){
    player.reset();
    setTimeout(function(){mode = gameMode.MAIN_MENU},120);
  }

}

function Counter(){
  this.currentTime = new Date().getTime();
  this.deadline = this.currentTime + 30000;
  this.timeLeft;
  this.pauseStart;

  this.reset = function(){
    this.currentTime = new Date().getTime();
    this.deadline = this.currentTime + 30000;
  }
  this.update = function() {
    this.timeLeft = this.deadline - new Date().getTime();
    if(this.timeLeft < 100){
      this.reset();
      console.log('TIME LEFT 0');
      if(mode == gameMode.ORGANIC){
        mode = gameMode.SUMMARY
      }else{
        mode = gameMode.ROUND_START;
      }
    }
  }
  this.pause = function(){
    this.pauseStart = new Date().getTime();
  }
  this.resume = function(){
    let resumeTime = new Date().getTime();
    this.deadline+= (resumeTime - this.pauseStart);
  }
  this.show = function(){
    // document.getElementById("counter").innerHTML = (this.timeLeft / 1000);
    stroke(255);
    textSize(20);
    fill(255);
    text(`CZAS RUNDY: ${Math.floor(this.timeLeft / 1000)}`,50, 90);
  }
  //this.deadline = this.currentTime +
}

function displayPoints(){
  // document.getElementById("pointsCount").innerHTML = points;
  stroke(255);
  textSize(20);
  fill(255);
  text(`WYNIK: ${points}`,50,50);
}

function roundStart(roundNumber, color){
  let offset;
  let textInput;

  if(roundNumber === 1){
    offset = 60;
    textInput = 'ŻÓŁTEGO';
  }else if(roundNumber === 2){
    offset = 70;
    textInput = 'ZIELONEGO';
  }else if(roundNumber === 3){
    offset = 55;
    textInput = 'BIAŁEGO';
  }else if(roundNumber === 4){
    offset = 85;
    textInput = 'CZERWONEGO';
  }else if(roundNumber === 5){
    offset = 85;
    textInput = 'NIEBIESKIEGO';
  }else if(roundNumber === 6){
    offset = 80;
    textInput = 'BRĄZOWEGO';
  }


  background(BACKGROUND_COLOR);
  textSize(22);
  fill(255);
  noStroke();
  text(`ZŁAP ODPADY PASUJĄCE DO`,CANVAS_WIDTH / 2 - 160,CANVAS_HEIGHT / 2);
  fill(color);
  text(`${textInput}`,CANVAS_WIDTH / 2 - offset,CANVAS_HEIGHT / 2 + 30);
  fill(255);
  text(`POJEMNIKA`,CANVAS_WIDTH / 2 - 70,CANVAS_HEIGHT / 2 + 60);

  if(roundSemaphore == 0){
    roundSemaphore = 1;
    setTimeout(() => {
      mode = nextRound;
      if(nextRound == gameMode.PLASTIC){
        roundSemaphore = 0;
        nextRound = gameMode.GLASS_COLOR;
        counter.reset();
      }else if(nextRound == gameMode.GLASS_COLOR){
        roundSemaphore = 0;
        nextRound = gameMode.GLASS_COLORLESS;
        counter.reset();
      }else if(nextRound == gameMode.GLASS_COLORLESS){
        roundSemaphore = 0;
        nextRound = gameMode.METAL;
        counter.reset();
      }else if(nextRound == gameMode.METAL){
        roundSemaphore = 0;
        nextRound = gameMode.PAPER;
        counter.reset();
      }else if(nextRound == gameMode.PAPER){
        roundSemaphore = 0;
        nextRound = gameMode.ORGANIC
        counter.reset();
      }else if(nextRound == gameMode.ORGANIC){
        roundSemaphore = 0;
        nextRound = gameMode.SUMMARY;
        counter.reset();
      }
      console.log('nextRound value: ' + nextRound);
    },3000);
  }
}



function Player(){
  this.x = CANVAS_WIDTH / 2;
  this.y = CANVAS_HEIGHT - 100;
  this.width = PLAYER_WIDTH;
  this.height = 100;
  this.speed = PLAYER_SPEED;
  this.image;

  this.update = function(){
   this.image = Bins[mode - 1];
    if(keyIsDown(RIGHT_ARROW)){
      if(this.x + this.speed + PLAYER_WIDTH < CANVAS_WIDTH){
        this.x += this.speed;
      }
    }else if(keyIsDown(LEFT_ARROW)){
      if(this.x - this.speed > 0){
        this.x -= this.speed;
      }
    }else if(keyIsDown(ESCAPE)){
      mode = gameMode.PAUSE_MENU;
      counter.pause();
    }
    //console.log('x: ' + this.x);
}

  this.show = function(){
    // fill(1);
    // rect(this.x,this.y,PLAYER_WIDTH,40);
    image(this.image, this.x, this.y,this.width,this.height);
    
  }
  this.reset = function(){
    this.x = CANVAS_WIDTH / 2;
    this.y = CANVAS_HEIGHT - 100;
    obstacles = new Array();
    deletedCount = 0;
    points = 0;
    nextRound = gameMode.PLASTIC;

  }
}
function Obstacle(xPos,yPos,type,img){
  this.x = xPos;
  this.y = yPos;
  this.width = 55;
  this.height = 90;
  this.speed = OBSTACLE_SPEED;
  this.toDelete = false;
  this.type = type;
  this.alreadyScored = false;
  this.image = img;
  

  this.update = function(){
    this.y += this.speed;
    if(this.y > CANVAS_HEIGHT){
      this.toDelete = true;
    }
  }

  this.show = function(){
    if(!this.alreadyScored){
      noFill();
    stroke(255);
    if(this.type == mode){
      stroke(255,0,0);
    }
    // rect(this.x,this.y,this.width,this.height);
    
    image(this.image, this.x ,this.y ,this.width ,this.height);
    }
  }
}

function MainMenu(){
  this.currentOption;
  this.RECT_POS_1 = CANVAS_HEIGHT / 2 - 115;
  this.RECT_POS_2 = CANVAS_HEIGHT / 2 - 45;

  this.update = function(){
    if(keyIsDown(DOWN_ARROW)){
      if(this.currentOption == 0){
        this.currentOption = 1;
      }
    }else if(keyIsDown(UP_ARROW)){
      if(this.currentOption == 1){
        this.currentOption = 0;
      }
    }else if(keyIsDown(ENTER)){
      if(this.currentOption == 0){
        mode = gameMode.ROUND_START;
      }else if(this.currentOption == 1){
        setTimeout(() => {mode = gameMode.RULES;},120);
        
      }
    }
  }

  this.show = function(){
    textSize(36);
    fill(255);
    text('GRAJ',CANVAS_WIDTH / 2 - 50,CANVAS_HEIGHT / 2 - 70);
    text('ZASADY',CANVAS_WIDTH/2 - 70,CANVAS_HEIGHT / 2 );
    noFill();
    stroke(255);
    if(this.currentOption == 0){
      rect(CANVAS_WIDTH / 2 - 100,this.RECT_POS_1,200,60);
    }else if(this.currentOption == 1){
      rect(CANVAS_WIDTH / 2 - 100,this.RECT_POS_2,200,60);
    }
  }
}

function PauseMenu(){
  this.currentOption;
  this.backgroundColor = color(255,255,255,1);
  this.RECT_POS_1 = CANVAS_HEIGHT / 2 - 115;
  this.RECT_POS_2 = CANVAS_HEIGHT / 2 - 45;
  //this.backgroundColor.setAlpha(1);

  this.update = function(){
    if(keyIsDown(DOWN_ARROW)){
      if(this.currentOption == 0){
        this.currentOption = 1;
        
      }
    }else if(keyIsDown(UP_ARROW)){
      if(this.currentOption == 1){
        this.currentOption = 0;

      }
    }else if(keyIsDown(ENTER)){
      if(this.currentOption == 0){
        // mode = gameMode.GAMEPLAY;
        counter.resume();
        mode = currentMode;
      }else if(this.currentOption == 1){
        player.reset();
        setTimeout(function(){mode = gameMode.MAIN_MENU},120); // so that we don't immediately start new game after exiting 
        //mode = gameMode.MAIN_MENU;
      }
    }
  }

  this.show = function(){

    // clear();
    textSize(42);
    fill(255);
    text('PAUZA',CANVAS_WIDTH / 2 - 70,CANVAS_HEIGHT / 2 - 150);
    textSize(36);
    fill(255);
    text('WRÓC DO GRY',CANVAS_WIDTH / 2 - 135,CANVAS_HEIGHT / 2 - 70);
    text('WYJDŹ',CANVAS_WIDTH/2 - 70,CANVAS_HEIGHT / 2 );
    noFill();
    stroke(255);
    //Very sketchy workaround to having responsive menu
    if(this.currentOption == 0){
      rect(CANVAS_WIDTH / 2 - 155,this.RECT_POS_1,300,60);
      stroke(51);
      rect(CANVAS_WIDTH / 2 - 110,this.RECT_POS_2,200,60);
    }else if(this.currentOption == 1){
      rect(CANVAS_WIDTH / 2 - 110,this.RECT_POS_2,200,60);
      stroke(51);
      rect(CANVAS_WIDTH / 2 - 155,this.RECT_POS_1,300,60);
    }
  }
}

function generateObstacle() {
  if(semaphore == 0){
    semaphore = 1;
    var promise = new Promise(function(resolve, reject) {
      window.setTimeout(function() {
        let tx = generateRandomObstaclePostion();
        let upperTypeBound;
        let lowerTypeBound;
        if(currentMode + 2 > 6){
            lowerTypeBound = 4;
            upperTypeBound = 6;
        }else{
          lowerTypeBound = mode;
          upperTypeBound = currentMode + 2;
        }
        console.log('('+mode+';' + upperTypeBound + ')');

        let type = getRandomInt(lowerTypeBound,upperTypeBound);
        let imgIndex = getRandomInt(0,2);
        // console.log('type: ' +type);
        if(type === 1){
          img = PlasticObstacleImages[imgIndex];
        }else if(type === 2){
          img = GlassColorObstacleImages[imgIndex];
        }else if(type === 3){
          img = GlassColorlessObstacleImages[imgIndex];
        }else if(type === 4){
          img = MetalObstacleImages[imgIndex];
        }else if(type === 5){
          img = PaperObstacleImages[imgIndex];
        }else if(type === 6){
          img = OrganicObstacleImages[imgIndex];
        }
        result = [tx,type,img];
        resolve(result);
      },1000);
    }).then((result) => {
     obstacles.push(new Obstacle(result[0],0,result[1],result[2]));
    
    });
    //console.log(promise);
  }
}

function drawObstacles(){
  //console.log('drawObstacles called! obstacles.length: ' + obstacles.length);
  for(let i = deletedCount; i < obstacles.length; i++){
    if(obstacles[0] != null){
      if(obstacles[i].toDelete){
        deletedCount = i;
        // console.log('obstacle deleted!');
        //obstacles.shift();
      }else{
        obstacles[i].update();
        obstacles[i].show();
      }
    }
  }
}

function generateRandomObstaclePostion(){
  semaphore = 0;
  let tempX = getRandomInt(0,CANVAS_WIDTH);
  let stepX = Math.floor(CANVAS_WIDTH / 10);
  switch(true){
    case (tempX >= 0 && tempX <stepX):
       tempX = 20;
      //  console.log('case: ' +tempX);
       break;
    case tempX >=stepX && tempX <2*stepX:
      tempX = stepX;
      // console.log('case:' +tempX);
      break;
    case tempX >=2*stepX && tempX <3*stepX:
      tempX = 2*stepX;
      // console.log('case: ' +tempX);
      break;
    case tempX >=3*stepX && tempX < 4*stepX:
      tempX = 3*stepX;
      // console.log('case: ' +tempX);
      break;
    case tempX >=4*stepX && tempX < 5*stepX:
      tempX = 4*stepX;
      // console.log('case: ' + tempX);
      break;
    case tempX >=5*stepX && tempX < 6*stepX:
      tempX = 5*stepX;
      // console.log('case: ' +tempX);
      break;
    case tempX >=6*stepX && tempX < 7*stepX:
      tempX = 6*stepX;
      // console.log('case:' + tempX);
      break;
    case tempX >= 7*stepX && tempX < 8*stepX:
      tempX = 7*stepX;
      break;
    case tempX >= 8*stepX && tempX < 9*stepX:
      tempX = 8*stepX;
      break;
    case tempX >= 9*stepX && tempX <= CANVAS_WIDTH:
      tempX = 9*stepX;
      break;
  }
  return tempX;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function doCollide(rect1, rect2){
  if (rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y) {
     // collision detected!
     return true;
 }
 return false;
}

function collisionDetection(){
  for(let i = deletedCount; i < obstacles.length; i ++){
    if(doCollide(obstacles[i],player)){
      console.log('collision detected!');
      console.log(obstacles[i].type);
      if(obstacles[i].type == mode){
        console.log('POINT SCORED!');
        if(obstacles[i].alreadyScored == false){
          points++;
          obstacles[i].alreadyScored = true;
        }
      }
    }
  }
}

// function displayPointGainedMarker(){
//   this.x = CANVAS_WIDTH / 2;
//   this.y = CANVAS_HEIGHT / 2;
//   this.toShow = text('+1',this.x,this.y);
  
//   this.update = function(){

//   }

//   this.show = function(){
//     this.toShow;
//   }
// }


  