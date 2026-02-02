(function() {
  'use strict';

  var canvas, ctx;
  var points = [];
  var triangles = [];
  var mouse = { x: null, y: null };
  var config = {
    cellSize: 45,
    jitter: 10,
    glowRadius: 200
  };

  function init() {
    canvas = document.getElementById('triangle-net-canvas');
    if (!canvas) return;

    ctx = canvas.getContext('2d');
    resize();
    createGrid();
    bindEvents();
    animate();
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createGrid() {
    points = [];
    triangles = [];
    var cols = Math.ceil(canvas.width / config.cellSize) + 2;
    var rows = Math.ceil(canvas.height / (config.cellSize * 0.866)) + 2;

    for (var row = 0; row < rows; row++) {
      for (var col = 0; col < cols; col++) {
        var x = col * config.cellSize + (row % 2) * (config.cellSize / 2);
        var y = row * config.cellSize * 0.866;
        x += (Math.random() - 0.5) * config.jitter;
        y += (Math.random() - 0.5) * config.jitter;
        x -= config.cellSize;
        y -= config.cellSize;
        points.push({ x: x, y: y });
      }
    }

    for (var row = 0; row < rows - 1; row++) {
      for (var col = 0; col < cols - 1; col++) {
        var i = row * cols + col;
        if (row % 2 === 0) {
          triangles.push([i, i + 1, i + cols]);
          triangles.push([i + 1, i + cols + 1, i + cols]);
        } else {
          triangles.push([i, i + 1, i + cols + 1]);
          triangles.push([i, i + cols + 1, i + cols]);
        }
      }
    }
  }

  function bindEvents() {
    window.addEventListener('resize', function() {
      resize();
      createGrid();
    });
    window.addEventListener('mousemove', function(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener('mouseout', function() {
      mouse.x = null;
      mouse.y = null;
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var isDark = document.documentElement.classList.contains('dark');

    for (var i = 0; i < triangles.length; i++) {
      var t = triangles[i];
      var p1 = points[t[0]];
      var p2 = points[t[1]];
      var p3 = points[t[2]];

      var cx = (p1.x + p2.x + p3.x) / 3;
      var cy = (p1.y + p2.y + p3.y) / 3;

      var alpha = isDark ? 0.08 : 0.06;

      if (mouse.x !== null) {
        var dx = cx - mouse.x;
        var dy = cy - mouse.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < config.glowRadius) {
          var glow = 1 - dist / config.glowRadius;
          alpha += glow * (isDark ? 0.25 : 0.18);
        }
      }

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.closePath();

      if (isDark) {
        ctx.strokeStyle = 'rgba(148, 163, 184, ' + alpha + ')';
      } else {
        ctx.strokeStyle = 'rgba(100, 116, 139, ' + alpha + ')';
      }
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    requestAnimationFrame(animate);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
