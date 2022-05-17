var rectangularCollision = function({rectangle1, rectangle2}) {
  return  (rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
    rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height);
}

//game time and countdown
var determineWinner = function({player, enemy}) {
  document.querySelector('#endMessage').style.display = 'flex';
  if (player.health === enemy.health) {
    document.querySelector('#endMessage').innerHTML = 'Tie';
  } else if( player.health > enemy.health) {
    document.querySelector('#endMessage').innerHTML = 'Player 1 Wins!';
  } else if (player.health < enemy.health) {
    document.querySelector('#endMessage').innerHTML = 'Player 2 Wins!';
  }
  document.querySelector('#timer').innerHTML = 'GameOver';
  timer = 0;
}

let timer = 60;
function decreaseTimer() {
  setTimeout(decreaseTimer, 1000)
  if (timer > 0) {
    timer--;
    document.querySelector('#timer').innerHTML = timer;
  }
  if(timer === 0){
    document.querySelector('#endMessage').style.display = 'flex';
    determineWinner({player, enemy});
  }
}