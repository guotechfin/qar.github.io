function Wave() {
  var settings = {
    'colorTop'    : '#EA4C89',
    'colorBottom' : '#EA4C89',
    'cWidth'      : window.innerWidth,
    'cHeight'     : window.innerHeight,
    'forceDivider': 300
  };

  var density = .75;   // 密度
  var friction = 1.14; // 摩擦

  // 四分之一的像素密集度作为颗粒点？
  var detail = settings.cWidth / 4;

  var particles;       // 颗粒
  var canvas = document.createElement('canvas');
  document.body.appendChild(canvas);

  var context;
  if (canvas && canvas.getContext) {
    context = canvas.getContext('2d');
    particles = [];
    for (var i = 0; i < detail + 1; i++) {
      particles.push({
        x: settings.cWidth / (detail - 4) * (i - 2),
        y: settings.cHeight * .4,
        original: {
          x: 0,
          y: settings.cHeight * .5
        },
        velocity: { // 速率
          x: 0,
          y: Math.random()
        },
        tension: {  // 张力
          x: 0,
          y: 0
        },
        force: {
          x: 0,
          y: 0
        },
        mass: 10
      });
    }
  } else {
    return false;
  }

  canvas.width = settings.cWidth;
  canvas.height = settings.cHeight;
  setInterval(timeUpdate, 40);
  var pulse = false;
  this.startTwitch = function() {
    pulse = setInterval(twitch, 100);
  }
  this.stopTwitch = function() {
    clearTimeout(pulse);
  }
  this.startTwitch();
  function twitch() {
    var forceRange = canvas.height / settings.forceDivider;
    InsertImpulse(Math.random() * canvas.width, (Math.random() * (forceRange * 2) - forceRange));
  }
  function InsertImpulse(positionX, forceY) {
    var particle = particles[Math.round(positionX / settings.cWidth * particles.length)];
    if (particle) {
      particle.force.y += forceY;
    }
  }
  function timeUpdate(e) {
    var gradientFill = context.createLinearGradient(settings.cWidth * .5, settings.cHeight * .2, settings.cWidth * .5, settings.cHeight);
    gradientFill.addColorStop(0, settings.colorBottom);
    gradientFill.addColorStop(1, settings.colorTop);
    context.clearRect(0, 0, settings.cWidth, settings.cHeight);
    context.fillStyle = gradientFill;
    context.beginPath();
    var len = particles.length;
    var i;
    var current, previous, next;
    for (i = 0; i < len; i++) {
      current = particles[i];
      previous = particles[i - 1];
      next = particles[i + 1];
      if (previous && next) {
        var forceY = 0;
        var extensionY = 0;
        if (i > 0)
        {
          extensionY = previous.y - current.y - previous.tension.y;
          forceY += -density * extensionY;
        }
        if (i < len - 1)
        {
           extensionY = current.y - next.y - current.tension.y;
           forceY += density * extensionY;
        }
        extensionY = current.y - current.original.y;
        forceY += density / 15 * extensionY;
        current.tension.y = next.y - current.y;
        current.velocity.y += -(forceY / current.mass) + current.force.y;
        current.velocity.y /= friction;
        current.force.y /= friction;
        current.y += current.velocity.y;
        var control = {x: 0,y: 0};
        control.x = previous.x;
        control.y = previous.y;
        var anchor = {x: 0,y: 0};
        anchor.x = previous.x + (current.x - previous.x) / 2;
        anchor.y = previous.y + (current.y - previous.y) / 2;
        context.quadraticCurveTo(control.x, control.y, anchor.x, anchor.y);
      }
    }
    context.lineTo(particles[particles.length - 1].x, particles[particles.length - 1].y);
    context.lineTo(settings.cWidth, settings.cHeight);
    context.lineTo(0, settings.cHeight);
    context.lineTo(particles[0].x, particles[0].y);
    context.fill();
  }
  return this;
};

var wave = Wave();
