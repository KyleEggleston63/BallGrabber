// setup canvas
const MAXBALLS = 30;
const BACKGROUND_FILLSTYLE = 'rgba(0, 0, 0, 0.3)';
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

// function to generate random number

function random(min,max) {
  var num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}

function Ball(num, x, y, velX, velY, color, size) {
  this.num = num;
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.color = color;
  this.size = size;
}

// define ball draw method

Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
}

Ball.prototype.update = function() {
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

      if (distance < this.size + balls[j].size) {
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


function loop() {
  // width = canvas.width = window.innerWidth;
  // height = canvas.height = window.height;
  ctx.fillStyle = BACKGROUND_FILLSTYLE;
  ctx.fillRect(0, 0, width, height);

  for (var i = 0; i < balls.length; i++) {
    balls[i].draw();
    balls[i].update();
    balls[i].collisionDetect();
  }

  requestAnimationFrame(loop);
}

var balls = [];
var size = random(30, 63);
var ball = new Ball(
  1,
  random(0 + size, width - size),
  random(0 + size, height - size),
  random(-1, 1),
  random(-1, 1),
  'rgb(' + random(100, 200) + ',' + random(100, 200) + ',' + random(100, 200) + ')',
    // ' + random(0, 255) + ', ' + random(0, 255) + ', ' + random(0, 255) + ')',
  size
);

Change this to a do while you lazy fuck.

balls.push(ball);
ctx.fillStyle = BACKGROUND_FILLSTYLE;
ctx.fillRect(0, 0, width, height);
console.log("ballNum:" + ball.num + "   x:" + ball.x + ", y:" + ball.y);
ball.draw();

while (balls.length < MAXBALLS) {
  var size = random(20, 50);
  var ball = new Ball(
    balls.length + 1,
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-12,12),
    random(-12,12),
    'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')',
    size
  );

  ball.collisionDraw();
}

loop();