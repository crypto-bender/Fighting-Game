const canvas = document.querySelector('canvas');
// c stands for context
const c = canvas.getContext('2d');
//resizes canvas
canvas.width = 1024;
canvas.height = 576;
//creates a black rectangle starting from 0, 0 and stretching from canvas width-canvas.height
c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.6;

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './img/background/background.png'
})

const shop = new Sprite({
  position: {
    x: 650,
    y: 225,
  },
  imageSrc: './img/decorations/shop_anim.png',
  scale:  2,
  framesMax: 6
})
const player = new Fighter({
  position: {
    x: 100,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0
  },
  color: 'red',
  offset: {
    x: 0,
    y: 0
  },
  imageSrc: './img/character/samuraiMack/Idle.png',
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 155
  },
  sprites: {
    idle: {
      imageSrc: './img/character/samuraiMack/Idle.png',
      framesMax: 8
    },
    run: {
      imageSrc: './img/character/samuraiMack/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/character/samuraiMack/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './img/character/samuraiMack/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './img/character/samuraiMack/Attack1.png',
      framesMax: 6
    },
    takeHit: {
      imageSrc: 'img/character/samuraiMack/Take Hit - white silhouette.png',
      framesMax: 4
    },
    death: {
      imageSrc: 'img/character/samuraiMack/Death.png',
      framesMax: 6
    }
  },
  attackBox: {
    offset: {
      x: 48,
      y: 10
    },
    width: 200,
    height: 75
  }
});

const enemy = new Fighter({
  position: {
    x: 900,
    y: 100
  },
  velocity: {
    x: 0,
    y: 0
  },
  color: 'blue',
  offset:{
    x: 50,
    y: 0
  },
  imageSrc: 'img/character/kenji/Idle.png',
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 167
  },
  sprites: {
    idle: {
      imageSrc: 'img/character/kenji/Idle.png',
      framesMax: 4,
    },
    run: {
      imageSrc: 'img/character/kenji/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: 'img/character/kenji/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: 'img/character/kenji/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: 'img/character/kenji/Attack1.png',
      framesMax: 4
    },
    takeHit: {
      imageSrc: 'img/character/kenji/Take hit.png',
      framesMax: 3
    },
    death: {
      imageSrc: 'img/character/kenji/Death.png',
      framesMax: 7
    }
  },
  attackBox: {
    offset: {
      x: -175,
      y: 20
    },
    width: 200,
    height: 75
  }
});

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  }
}

let lastKey;


decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  c.fillStyle = 'rgba(255, 255, 255, 0.15';
  c.fillRect(0,0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  //player movement
  player.velocity.x = 0;
  enemy.velocity.x = 0;

  if (keys.a.pressed && lastKey === 'a') {
    player.velocity.x = -5;
    player.switchSprite('run');
  } else if (keys.d.pressed && lastKey === 'd') {
    player.velocity.x = 5;
    player.switchSprite('run');
  } else {
    player.switchSprite('idle');
  }
  //jumping
  if (player.velocity.y < 0) {
    switchSprite('jump');
  }
  //falling
  if (player.velocity.y > 0) {
    player.switchSprite('fall');
  }


  //enemy movment
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -8;
    enemy.switchSprite('run');
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = 8;
    enemy.switchSprite('run');
  } else {
    enemy.switchSprite('idle');
  }
  //jumping
  if (enemy.velocity.y < 0) {
    switchSprite('jump');
  }
  //falling
  if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall');
  }

  //player attack collision
  if (rectangularCollision({
    rectangle1: player,
    rectangle2: enemy
    }) &&
    player.isAttacking && player.framesCurrent === 4) {
      enemy.takeHit();
      player.isAttacking = false;
      document.querySelector('#enemyHealth').style.width = enemy.health + '%';
    console.log('HIT!');
  }
  //if player misses
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }

  //enemy attack collision
  if (rectangularCollision({
    rectangle1: enemy,
    rectangle2: player
    }) &&
    enemy.isAttacking && enemy.framesCurrent === 2) {
      player.takeHit();
      enemy.isAttacking = false;
      document.querySelector('#playerHealth').style.width = player.health + '%';
    console.log('STRIKE!');
  }
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false;
  }
  //end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({player, enemy});
  }

};

animate();

window.addEventListener('keydown', function(event) {
  if (!player.dead) {
    switch (event.key) {
      case 'd':
        keys.d.pressed = true;
        lastKey = 'd';
        break;
      case 'a':
        keys.a.pressed = true;
        lastKey = 'a';
        break;
      case 'w':
        player.velocity.y = -15;
        break;
      case ' ':
        player.attack();
        break;
    }
  }
  if (!enemy.dead) {
    switch(event.key) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = true;
        enemy.lastKey = 'ArrowRight';
        break;
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = 'ArrowLeft';
        break;
      case 'ArrowUp':
        enemy.velocity.y = -15;
        break;
      case 'ArrowDown':
        enemy.attack();
        break;
    }
  }
});

window.addEventListener('keyup', function(event) {
  switch (event.key) {
    //player keys
    case 'd':
      keys.d.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;
    //enemy keys
    case 'ArrowRight':
      keys.ArrowRight.pressed = false;
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false;
      break;
  }
});