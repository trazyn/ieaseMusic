
/* eslint-disable */
/*
 * Copyright MIT © <2013> <Francesco Trillini>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
 * to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var self = window;

;(function(self) {

	var canvas, context, wave1 = [], wave2 = [], wave3 = [], mouse = { x: innerWidth * 0.5, y: innerHeight * 0.5 }, angle = 0, mouseDown = true, interactive = true, FPS = 60;

	/*
 	 * Init.
	 */

	function init(container) {

		canvas = document.createElement('canvas');

        canvas.width = innerWidth;
		canvas.height = innerHeight;

		canvas.style.position = 'absolute';
		canvas.style.top = 0;
		canvas.style.bottom = 0;
		canvas.style.left = 0;
		canvas.style.right = 0;
		canvas.style.zIndex = -1;
		canvas.style.cursor = 'n-resize';

        container.appendChild(canvas);

		// Browser supports canvas?
		if(!!(capable)) {

			context = canvas.getContext('2d');

			// Events
			if('ontouchmove' in window) {

				canvas.addEventListener('touchstart', onTouchStart, false);
				canvas.addEventListener('touchend', onTouchEnd, false);
				canvas.addEventListener('touchmove', onTouchMove, false);

			}

			else {

				canvas.addEventListener('mousedown', onMouseDown, false);
				canvas.addEventListener('mouseup', onMouseUp, false);
				canvas.addEventListener('mousemove', onMouseMove, false);

			}

			window.onresize = onResize;

			createWaves();

		}

		else {

			console.error('Please, update your browser for seeing this animation.');

		}
	}

	/*
	 * Checks if browser supports canvas element.
	 */

	function capable() {

		return canvas.getContext && canvas.getContext('2d');

	}

	/*
	 * On resize window event.
	 */

	function onResize() {

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

	}

	/*
	 * Mouse down event.
	 */

	function onMouseDown(event) {

		event.preventDefault();

		mouseDown = true;

	}

	/*
	 * Mouse up event.
	 */

	function onMouseUp(event) {

		event.preventDefault();

		mouseDown = false;

	}

	/*
	 * Mouse move event.
	 */

	function onMouseMove(event) {

		event.preventDefault();

		mouse.x = event.pageX - canvas.offsetLeft;
		mouse.y = event.pageY - canvas.offsetTop;

		if(interactive)

			mouseDown = interactive = false;

	}

	/*
	 * Touch start event.
	 */

	function onTouchStart(event) {

		event.preventDefault();

		mouseDown = true;

	}

	/*
	 * Touch end event.
	 */

	function onTouchEnd(event) {

		event.preventDefault();

		mouseDown = false;

	}

	/*
	 * Touch move event.
	 */

	function onTouchMove(event) {

		event.preventDefault();

		mouse.x = event.touches[0].pageX - canvas.offsetLeft;
		mouse.y = event.touches[0].pageY - canvas.offsetTop;

		if(interactive)

			mouseDown = interactive = false;

	}

	/*
	 * Create waves.
	 */

	function createWaves() {

		var totalPoints = Math.round(canvas.width / 140);

		for(var quantity = 0, len = totalPoints; quantity < len; quantity++)

			// First wave
			wave1.push({

				x: canvas.width * quantity / (len - 1),
				y: canvas.height * 0.5 - 20,
				vy: Math.random() * 10,

				depth: canvas.height * 0.2

			});

		for(var quantity = 0, len = totalPoints; quantity < len; quantity++)

			// Second wave
			wave2.push({

				x: canvas.width * quantity / (len - 1),
				y: canvas.height * 0.5,
				vy: Math.random() * 10,

				depth: canvas.height * 0.2

			});

		for(var quantity = 0, len = totalPoints; quantity < len; quantity++)

			// Third wave
			wave3.push({

				x: canvas.width * quantity / (len - 1),
				y: canvas.height * 0.5 + 20,
				vy: Math.random() * 10,

				depth: canvas.height * 0.2

			});

		wave();

	}

	/*
	 * Loop logic.
	 */

	function wave() {

	    if (stop) {
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);
            context = null;
            wave1 = [];
            wave2 = [];
            wave3 = [];
            return;
	    }

		clear();
		update();
		render();

		requestAnimFrame(wave);

	}

	/*
	 * Clear the whole screen.
	 */

	function clear() {

		context.clearRect(0, 0, innerWidth, innerHeight);

	};

	/*
	 * Update the waves.
	 */

	function update() {

	    var ease, friction, threshold;

		friction = 0.99;
		threshold = interactive ? Math.round(canvas.width / 4.5) : 280;

		if(interactive) {

			angle += 0.05;

			mouse.x = canvas.width * 0.5 + Math.sin(angle) * canvas.width * 0.2;
			mouse.y = (canvas.height * 0.5 - 50) + Math.sin(angle) * canvas.height * 0.2;

		}

		for(var index = 0; index < (wave1.length || wave2.length || wave3.length); index++) {

			var point1 = wave1[index];
			var point2 = wave2[index];
			var point3 = wave3[index];

			point1.y += point1.vy;
			point2.y += point2.vy;
			point3.y += point3.vy;

			// Ease
			point1.vy += (point1.depth - point1.y) * (interactive ? 0.03 : 0.009);
			point2.vy += (point2.depth - point2.y) * (interactive ? 0.02 : 0.008);
			point3.vy += (point3.depth - point3.y) * (interactive ? 0.01 : 0.007);

			// Friction
			point1.vy *= friction;
			point2.vy *= friction;
			point3.vy *= friction;

			// Threshold
			if(distanceTo(mouse, point1) < threshold && mouseDown)

				point1.vy += (mouse.y - point1.y) * (interactive ? 0.03 : 0.009);

			if(distanceTo(mouse, point2) < threshold && mouseDown)

				point2.vy += (mouse.y - point2.y) * (interactive ? 0.02 : 0.008);

			if(distanceTo(mouse, point3) < threshold && mouseDown)

				point3.vy += (mouse.y - point3.y) * (interactive ? 0.01 : 0.007);

		}

	}

	/*
	 * Render the waveS.
	 */

	function render() {

		for(var wave = 0; wave < (wave1.length || wave2.length || wave3.length); wave++) {

			// Smooth bezier curves
			clear();

			context.save();
			context.globalAlpha = 1;
			context.fillStyle = '#19dfae';
			context.beginPath();

			context.moveTo(wave1[0].x, wave1[0].y);

			// Draw through N wave1
			for(var N = 1; N < wave1.length - 2; N++) {

				var xc = (wave1[N].x + wave1[N + 1].x) / 2;
				var yc = (wave1[N].y + wave1[N + 1].y) / 2;

				context.quadraticCurveTo(wave1[N].x, wave1[N].y, xc, yc);

			}

			context.quadraticCurveTo(wave1[wave1.length - 2].x, wave1[wave1.length - 2].y, wave1[wave1.length - 1].x, wave1[wave1.length - 1].y);
			context.lineTo(canvas.width, canvas.height);
			context.lineTo(0, canvas.height);
			context.lineTo(0, wave1[0].y);
			context.fill();
			context.restore();

			context.save();
			context.globalAlpha = 1;
			context.fillStyle = '#f251dd';
			context.beginPath();

			context.moveTo(wave2[0].x, wave2[0].y);

			// Draw through N wave2
			for(var N = 1; N < wave2.length - 2; N++) {

				var xc = (wave2[N].x + wave2[N + 1].x) / 2;
				var yc = (wave2[N].y + wave2[N + 1].y) / 2;

				context.quadraticCurveTo(wave2[N].x, wave2[N].y, xc, yc);

			}

			context.quadraticCurveTo(wave2[wave2.length - 2].x, wave2[wave2.length - 2].y, wave2[wave2.length - 1].x, wave2[wave2.length - 1].y);
			context.lineTo(canvas.width, canvas.height);
			context.lineTo(0, canvas.height);
			context.lineTo(0, wave2[0].y);
			context.fill();
			context.restore();

			context.save();
			context.globalAlpha = 1;
			context.fillStyle = '#f1dfdd';
			context.beginPath();

			context.moveTo(wave3[0].x, wave3[0].y);

			// Draw through N wave3
			for(var N = 1; N < wave3.length - 2; N++) {

				var xc = (wave3[N].x + wave3[N + 1].x) / 2;
				var yc = (wave3[N].y + wave3[N + 1].y) / 2;

				context.quadraticCurveTo(wave3[N].x, wave3[N].y, xc, yc);

			}

			context.quadraticCurveTo(wave3[wave3.length - 2].x, wave3[wave3.length - 2].y, wave3[wave3.length - 1].x, wave3[wave3.length - 1].y);
			context.lineTo(canvas.width, canvas.height);
			context.lineTo(0, canvas.height);
			context.lineTo(0, wave3[0].y);
			context.fill();
			context.restore();

		}

	}

	/*
	 * Distance between two wave1.
	 */

	function distanceTo(pointA, pointB) {

		var dx = Math.abs(pointA.x - pointB.x);
		var dy = Math.abs(pointA.y - pointB.y);

		return Math.sqrt(dx * dx + dy * dy);

	};

	/*
	 * Request new frame by Paul Irish.
	 * 60 FPS.
	 */

	window.requestAnimFrame = (function() {

		return  window.requestAnimationFrame       ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame    ||
				window.oRequestAnimationFrame      ||
				window.msRequestAnimationFrame     ||

				function(callback) {

					window.setTimeout(callback, 1000 / FPS);

				};

    })();

    showWave = init;
})(self);

var stop = false;
var showWave;

export default {
    show(container) {
        stop = false;
        showWave(container);
    },

    hide() {
        stop = true;
    }
};
