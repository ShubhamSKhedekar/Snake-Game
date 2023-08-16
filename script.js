//[0]
//Make constants to be used fro projects
let inputDirection = { x: 0, y: 0 };
let score = 0;
let hiScore = 0;
let lastUpdatedTime = 0;
let speedCtrl = 8;
let foodEatingS = new Audio("Music/food.mp3");
let gameOverS = new Audio("Music/gameover.mp3");
let backgroundS = new Audio("Music/music.mp3");
let inputMoveS = new Audio("Music/move.mp3");
let snakeArr = [{ x: 12, y: 15 }];
let foodArr = [{ x: 7, y: 9 }];


//[2]
function main(ctime) {
  //Update game after every 0.5 secs
  if ((ctime - lastUpdatedTime) / 1000 < 1 / speedCtrl) {
    //console.log("notReady");
    window.requestAnimationFrame(main);
  } else {
    //console.log(ctime);
    lastUpdatedTime = ctime;
    window.requestAnimationFrame(main);
    gameEngine();
  }
}


//[4]
function isCollide(sArr) {
  //If snake bumps into himself
  for (let i = 1; i < sArr.length; i++) {
    if (snakeArr[0].x === sArr[i].x && snakeArr[0].y === sArr[i].y) {
      return true;
    }
  }

  //If snake touches board boundary
  if (
    snakeArr[0].x <= 0 ||
    snakeArr[0].x >= 18 ||
    snakeArr[0].y <= 0 ||
    snakeArr[0].y >= 18
  ) {
    return true;
  }
  return false;
}


//[3]
function gameEngine() {
  //1.Update snake and food
  //If snake collides with board's boundary
  if (isCollide(snakeArr) == true) {
    //Game over music & Background music
    gameOverS.play();
    backgroundS.pause();
    alert("Game Over. Press Okay key to play again!");
    inputDirection = { x: 0, y: 0 };
    snakeArr = [{ x: 12, y: 15 }];
    score = 0;
    document.getElementsByClassName("score1")[0].innerHTML =
      "Current Score:" + score;
  }

  //If snake eats food
  if (foodArr[0].x == snakeArr[0].x && foodArr[0].y == snakeArr[0].y) {
    //Add one more element in snake's body.
    snakeArr.unshift({
      x: inputDirection.x + snakeArr[0].x,
      y: inputDirection.y + snakeArr[0].y,
    });
    //Example: If pressed ArrowUp
    //x:0+12 -> 12 , y:-1+15 -> 14
    foodEatingS.play();

    //Score logic
    score += 1;
    document.getElementsByClassName("score1")[0].innerHTML =
      "Current Score:" + score;
    if (localStorage.getItem("hiScoreVal") == null) {
      hiScore = 0;
    } else {
      hiScore = JSON.parse(localStorage.getItem("hiScoreVal"));
      if (hiScore < score) {
        hiScore = score;
      }
    }
    localStorage.setItem("hiScoreVal", JSON.stringify(hiScore));
    document.getElementsByClassName("score2")[0].innerHTML =
      "Highest Score: " + hiScore;

    //Delete existing food element, generate new at different co-ordinates.
    let a = 2;
    let b = 16;
    //Formula to generate random numbers between a to b.
    foodArr[0] = {
      x: Math.round(a + (b - a) * Math.random()),
      y: Math.round(a + (b - a) * Math.random()),
    };
  }

  //Keep snake moving
  for (let i = snakeArr.length - 2; i >= 0; i--) {
    snakeArr[i + 1] = JSON.parse(JSON.stringify(snakeArr[i]));
    //snakeArr[i+1]={...snakeArr[i]};  -->Works same as above for Deep Copy
  }
  //For snake Head
  snakeArr[0].x += inputDirection.x;
  snakeArr[0].y += inputDirection.y;

  //2.Display snake and food
  //Display snake
  document.getElementsByClassName("board")[0].innerHTML = "";
  snakeArr.forEach(function update(ele, index) {
    let snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = ele.y;
    snakeElement.style.gridColumnStart = ele.x;
    if (index == 0) {
      snakeElement.classList.add("head");
    } else {
      snakeElement.classList.add("snakeBody");
    }
    document.getElementsByClassName("board")[0].appendChild(snakeElement);
    //console.log("ready1");
  });

  //Display food
  foodArr.forEach(function update1(ele, index) {
    let foodElement = document.createElement("div");
    foodElement.style.gridRowStart = ele.y;
    foodElement.style.gridColumnStart = ele.x;
    foodElement.classList.add("food");
    document.getElementsByClassName("board")[0].appendChild(foodElement);
    //console.log("ready2");
  });
}


//[1]
//Game logic starts here 
window.requestAnimationFrame(main);

//To display Highesh Score till now
if (localStorage.getItem("hiScoreVal") == null) {
  hiScore = 0;
} else {
  hiScore = JSON.parse(localStorage.getItem("hiScoreVal"));
  if (hiScore < score) {
    hiScore = score;
  }
}
localStorage.setItem("hiScoreVal", JSON.stringify(hiScore));
document.getElementsByClassName("score2")[0].innerHTML =
  "Highest Score: " + hiScore;

  
//[2-3]
//Identifying which key is pressed on keyboard, to move sanke accordingly (changing direction)
window.addEventListener("keydown", (keyPressed) => {
  inputDirection = { x: 0, y: 0 };
  //Input move Sound
  inputMoveS.play();
  backgroundS.play();

  switch (keyPressed.key) {
    case "ArrowUp":
      //console.log("ArrowUpKey");
      inputDirection.x = 0;
      inputDirection.y = -1;
      break;

    case "ArrowDown":
      //console.log("ArrowDownKey");
      inputDirection.x = 0;
      inputDirection.y = 1;
      break;

    case "ArrowLeft":
      //console.log("ArrowLeftKey");
      inputDirection.x = -1;
      inputDirection.y = 0;
      break;

    case "ArrowRight":
      //console.log("ArrowRightKey");
      inputDirection.x = 1;
      inputDirection.y = 0;
      break;

    default:
      break;
  }
});
