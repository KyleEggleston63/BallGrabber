// setup canvas
var para = document.querySelector('p');
const MAXBALLS = 3;
const BACKGROUND_FILLSTYLE = 'rgba(0, 0, 0, 1)';
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

// function to generate random number

function random(min,max) {
  var num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}

function Shape(x, y, velX, velY, exists, color, size) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exists = exists;
  this.color = color;
  this.size = size;
}

function CircleOfEvil(x, y, exists) {
  Shape.call(this, x, y, 20, 20, exists);
  this.color = "red"
  this.size = 75;
}

CircleOfEvil.prototype = Object.create(Shape.prototype);
CircleOfEvil.prototype.constructor = CircleOfEvil;

CircleOfEvil.prototype.draw = function () {
  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.strokeStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();
}

CircleOfEvil.prototype.setControls = function () {
  var _this = this;
  window.onkeydown = function (e) {
      console.log(e.keyCode);
      if (e.keyCode === 65) {
        _this.x -= _this.velX;
      } else if (e.keyCode === 68) {
        _this.x += _this.velX;
      } else if (e.keyCode === 87) {
        _this.y -= _this.velY;
      } else if (e.keyCode === 83) {
        _this.y += _this.velY;
      }
    }
}

CircleOfEvil.prototype.checkBounds = function () {

  if ((this.x + this.size) >= width) {
    this.x = this.x - this.size;
  }

  if ((this.x - this.size) <= 0) {
    this.x = this.x + this.size;
  }

  if ((this.y + this.size) >= height) {
    this.y = this.y - this.size;
  }

  if ((this.y - this.size) <= 0) {
    this.y = this.y + this.size;
  }

}

CircleOfEvil.prototype.collisionDetect = function () {
  for (var j = 0; j < balls.length; j++) {
    if ( balls[j].exists ) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);
      // var other = balls[j];

      if (distance < this.size + balls[j].size) {
        balls[j].exists = false;
        count--;
        para.textContent = 'Balls Remaining: ' + count;
        if (count <= 0) {
          updateAllBalls();
          ctx.fillStyle = 'black';
          ctx.fillRect(0, 0, width, height);
          evilCircle.draw();
          requestAnimationFrame(collisionDetect);
          window.alert("CONGRATULATIONS!  You sucked up " + MAXBALLS + " balls");
            // in " + totalSeconds + " seconds!");

          drawBalls();
        }
      }
    }
  }
}


function Ball(num, x, y, velX, velY, exists, color, size) {
  Shape.call(this, x, y, velX, velY, exists);
  this.num = num;
  this.color = color;
  this.size = size;
}

Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;

// define ball draw method

Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
}

Ball.prototype.update = function () {
  width = window.innerWidth;
  height = window.height;
  if ((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  if ((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if ((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if ((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;

}

Ball.prototype.collisionDetect = function() {
  for (var j = 0; j < balls.length; j++) {
    if (!(this === balls[j])) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);
      // var other = balls[j];

      if (this.exists === true && balls[j].exists === true && distance < this.size + balls[j].size) {
        var newVelX = (this.velX * (this.size - balls[j].size) + (2 * balls[j].size * balls[j].velX)) / (this.size + balls[j].size);
        balls[j].velX = (balls[j].velX * (balls[j].size - this.size) + (2 * this.size * this.velX)) / (balls[j].size + this.size);
        this.velX = newVelX;

        var newVelY = (this.velY * (this.size - balls[j].size) + (2 * balls[j].size * balls[j].velY)) / (this.size + balls[j].size);
        balls[j].velY = (balls[j].velY * (balls[j].size - this.size) + (2 * this.size * this.velY)) / (balls[j].size + this.size);
        this.velY = newVelY;

        balls[j].update();
        balls[j].draw();
        this.update();
        this.draw();
      }
    }
  }
};

Ball.prototype.collisionDraw = function () {
  for (var j = 0; j < balls.length; j++) {
    if (!(this === balls[j])) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size + 1) {
        var size = random(10, 30);
        this.x = random(0 + size, width - size);
        this.y = random(0 + size, height - size);
        j = -1;
      }
    }
  }
  console.log("ballNum:" + this.num + "   x:" + this.x + ", y:" + this.y);
  balls.push(this);
  this.draw();
};

var evilCircle = new CircleOfEvil(random(0, width), random(0, height), true);
evilCircle.setControls();

function updateAllBalls() {
  for (var i = 0; i < balls.length; i++) {
    if (balls[i].exists) {
      balls[i].update();
      balls[i].draw();
      balls[i].collisionDetect();
    }
  }
}

function loop() {
  // width = canvas.width = window.innerWidth;
  // height = canvas.height = window.height;
  ctx.fillStyle = BACKGROUND_FILLSTYLE;
  ctx.fillRect(0, 0, width, height);

  updateAllBalls();

  evilCircle.draw();
  evilCircle.checkBounds();
  evilCircle.collisionDetect();

  requestAnimationFrame(loop);
}

function drawBalls() {
  balls = [];
  count = MAXBALLS;
  do {
    var size = random(20, 50);
    var ball = new Ball(
      balls.length + 1,
      random(0 + size, width - size),
      random(0 + size, height - size),
      random(-12,12),
      random(-12,12),
      true,
      'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')',
      size
    );

    ball.collisionDraw();
  } while (balls.length < MAXBALLS);
}

ctx.fillStyle = BACKGROUND_FILLSTYLE;
ctx.fillRect(0, 0, width, height);
var balls = [];
var count;

drawBalls();

para.textContent = 'Balls Remaining: ' + count;

loop();