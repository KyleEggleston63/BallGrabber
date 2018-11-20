// setup canvas

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

// function to generate random number

function random(min,max) {
  var num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}

function Ball(x, y, velX, velY, color, size) {
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

      if (distance < this.size + balls[j].size) {
        // balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';

        // (balls[j].color + this.color) / 2;
        // this.velX = -(this.velX);
        // this.velY = -(this.velY);
        // var thisVelocity = Math.sqrt((this.velX * this.velX) + (this.velY * this.velY));
        // var otherVelocity = Math.sqrt((balls[j].velX * balls[j].velX) + (balls[j].velY * balls[j].velY));
        var newVelX = (this.velX * (this.size - balls[j].size) + (2 * balls[j].size * balls[j].velX)) / (this.size + balls[j].size);
        balls[j].velX = (balls[j].velX * (balls[j].size - this.size) + (2 * this.size * this.velX)) / (balls[j].size + this.size);
        this.velX = newVelX;

        var newVelY = (this.velY * (this.size - balls[j].size) + (2 * balls[j].size * balls[j].velY)) / (this.size + balls[j].size);
        balls[j].velY = (balls[j].velY * (balls[j].size - this.size) + (2 * this.size * this.velY)) / (balls[j].size + this.size);
        this.velY = newVelY;

        this.update();
        balls[j].update();

        // if (this.velX == 0 && this.velY == 0) {
        //   this.velX = -(balls[j].velX * 0.75);
        //   this.velY = -(balls[j].velY * 0.63);
        // }
      }
    }
  }
};


var balls = [];


function loop() {
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0, 0, width, height);

  while (balls.length < 25) {
    var size = random(10, 20);
    var ball = new Ball(
      random(0 + size, width - size),
      random(0 + size, height - size),
      random(-7, 7),
      random(-7, 7),
      'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')',
      size
    );
    balls.push(ball);
  }

  for (var i = 0; i < balls.length; i++) {
    balls[i].draw();
    balls[i].update();
    balls[i].collisionDetect();
  }

  requestAnimationFrame(loop);
}

loop();