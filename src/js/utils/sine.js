
/* eslint-disable */

/* https://codepen.io/isuttell/pen/OPVELL?q=wave&limit=all&type=type-pens */

/**
 * Generates multiple customizable animated sines waves
 * using a canvas element. Supports retina displays and
 * limited mobile support
 *
 * I've created a seperate library based on this pen.
 * Check it out at https://github.com/isuttell/sine-waves
 */
function SineWaveGenerator(options) {
  Object.assign(this, options || {});

  if(!this.el) { throw "No Canvas Selected"; }
  this.ctx = this.el.getContext('2d');

  if(!this.waves.length) { throw "No waves specified"; }

  // Internal
  this._resizeWidth();
  window.addEventListener('resize', this._resizeWidth.bind(this));
  // User
  this.resizeEvent();
  window.addEventListener('resize', this.resizeEvent.bind(this));

  if(typeof this.initialize === 'function') {
    this.initialize.call(this);
  }
  // Start the magic
  this.loop();
}

// Defaults
SineWaveGenerator.prototype.speed = 10;
SineWaveGenerator.prototype.amplitude = 50;
SineWaveGenerator.prototype.wavelength = 50;
SineWaveGenerator.prototype.segmentLength = 10;

SineWaveGenerator.prototype.lineWidth = 2;
SineWaveGenerator.prototype.strokeStyle  = 'rgba(207, 122, 145, 1)';

SineWaveGenerator.prototype.resizeEvent = function() {};

// fill the screen
SineWaveGenerator.prototype._resizeWidth = function() {
  this.dpr = window.devicePixelRatio || 1;

  this.width = this.el.width = window.innerWidth * this.dpr;
  this.height = this.el.height = window.innerHeight * this.dpr;
  this.el.style.width = window.innerWidth + 'px';
  this.el.style.height = window.innerHeight + 'px';

  this.waveWidth = this.width * 0.95;
  this.waveLeft = this.width * 0.025;
}

SineWaveGenerator.prototype.clear = function () {
  this.ctx.clearRect(0, 0, this.width, this.height);
}

SineWaveGenerator.prototype.time = 0;

SineWaveGenerator.prototype.update = function(time) {
  this.time = this.time - 0.007;
  if(typeof time === 'undefined') {
    time = this.time;
  }

  var index = -1;
  var length = this.waves.length;

  while(++index < length) {
    var timeModifier = this.waves[index].timeModifier || 1;
    this.drawSine(time * timeModifier, this.waves[index]);
  }
  index = void 0;
  length = void 0;
}

// Constants
var PI2 = Math.PI * 2;
var HALFPI = Math.PI / 2;

SineWaveGenerator.prototype.ease = function(percent, amplitude) {
  return amplitude * (Math.sin(percent * PI2 - HALFPI) + 1) * 0.5;
}

SineWaveGenerator.prototype.drawSine = function(time, options) {
  var options = options || {};
  var amplitude = options.amplitude || this.amplitude;
  var wavelength = options.wavelength || this.wavelength;
  var lineWidth = options.lineWidth || this.lineWidth;
  var strokeStyle = options.strokeStyle || this.strokeStyle;
  var segmentLength = options.segmentLength || this.segmentLength;

  var x = time;
  var y = 0;
  var amp = this.amplitude;

  // Center the waves
  var yAxis = this.height / 2;

  // Styles
  this.ctx.lineWidth = lineWidth * this.dpr;
  this.ctx.strokeStyle = strokeStyle;
  this.ctx.lineCap = 'round';
  this.ctx.lineJoin = 'round';
  this.ctx.beginPath();

  // Starting Line
  this.ctx.moveTo(0, yAxis);
  this.ctx.lineTo(this.waveLeft, yAxis);

  for(var i = 0; i < this.waveWidth; i += segmentLength) {
    x = (time * this.speed) + (-yAxis + i) / wavelength;
    y = Math.sin(x);

    // Easing
    amp = this.ease(i / this.waveWidth, amplitude);

    this.ctx.lineTo(i + this.waveLeft, amp * y + yAxis);

    amp = void 0;
  }

  // Ending Line
  this.ctx.lineTo(this.width, yAxis);

  // Stroke it
  this.ctx.stroke();

  // Clean up
  options = void 0;
  amplitude = void 0;
  wavelength = void 0;
  lineWidth = void 0;
  strokeStyle = void 0;
  segmentLength = void 0;
  x = void 0;
  y = void 0;
}

SineWaveGenerator.prototype.loop = function() {
  var context = this.ctx;

  if (stop) {
      this.clear();
      this.ctx = null;
      return;
  }

  this.clear();
  this.update();

  window.requestAnimationFrame(this.loop.bind(this));
}

var stop = false;

export default {
    show(dom) {
        stop = false;

        new SineWaveGenerator({
          el: dom,
          speed: 8,

          waves: [
            {
              timeModifier: 1,
              lineWidth: 3,
              amplitude: 150,
              wavelength: 200,
              segmentLength: 20,
            },
            {
              timeModifier: 1,
              lineWidth: 2,
              amplitude: 150,
              wavelength: 100,
            },
            {
              timeModifier: 1,
              lineWidth: 1,
              amplitude: -150,
              wavelength: 50,
              segmentLength: 10,
            },
            {
              timeModifier: 1,
              lineWidth: 0.5,
              amplitude: -100,
              wavelength: 100,
              segmentLength: 10,
            }
          ],

          initialize: function (){

          },

          resizeEvent: function() {
            var gradient = this.ctx.createLinearGradient(0, 0, this.width, 0);
            gradient.addColorStop(0,"rgb(98, 239, 171)");
            gradient.addColorStop(0.5,"rgba(255, 135, 151,.8)");
            gradient.addColorStop(1,"rgb(225, 164, 244)");

            var index = -1;
            var length = this.waves.length;
        	  while(++index < length){
              this.waves[index].strokeStyle = gradient;
            }

            // Clean Up
            index = void 0;
            length = void 0;
            gradient = void 0;
          }
      });
    },

    hide() {
      stop = true;
    }
};
