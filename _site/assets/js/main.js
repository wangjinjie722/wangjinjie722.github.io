document.addEventListener('DOMContentLoaded', function () {
  // ========== AOS Init ==========
  AOS.init({
    duration: 700,
    once: true,
    offset: 80,
  });

  // ========== Dark Mode ==========
  var themeToggle = document.getElementById('theme-toggle');
  var savedTheme = localStorage.getItem('theme');

  // Apply saved theme or detect system preference
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }

  // ========== Typewriter Effect ==========
  var typewriterEl = document.getElementById('typewriter');
  if (typewriterEl) {
    var roles = [
      'Senior ML Engineer @ TikTok',
      'RecSys Researcher',
      'Game AI Enthusiast',
    ];
    var roleIndex = 0;
    var charIndex = 0;
    var isDeleting = false;
    var typeSpeed = 80;
    var deleteSpeed = 40;
    var pauseTime = 2000;

    function typeWrite() {
      var current = roles[roleIndex];

      if (!isDeleting) {
        typewriterEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === current.length) {
          setTimeout(function () {
            isDeleting = true;
            typeWrite();
          }, pauseTime);
          return;
        }
      } else {
        typewriterEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }

      setTimeout(typeWrite, isDeleting ? deleteSpeed : typeSpeed);
    }

    typeWrite();
  }

  // ========== Hero Neural Network Canvas ==========
  var heroCanvas = document.getElementById('hero-canvas');
  if (heroCanvas) {
    var ctx = heroCanvas.getContext('2d');
    var nodes = [];
    var mouse = { x: -1000, y: -1000 };
    var nodeCount = 50;
    var connectionDist = 150;
    var mouseRadius = 200;
    var animId;

    function resizeCanvas() {
      var hero = heroCanvas.parentElement;
      heroCanvas.width = hero.offsetWidth;
      heroCanvas.height = hero.offsetHeight;
    }

    function initNodes() {
      nodes = [];
      for (var i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * heroCanvas.width,
          y: Math.random() * heroCanvas.height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          radius: Math.random() * 2.5 + 1,
          baseRadius: Math.random() * 2.5 + 1,
          pulse: Math.random() * Math.PI * 2,
        });
      }
    }

    function getComputedColor(varName) {
      return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    }

    function drawNetwork() {
      ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);

      var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      var nodeColor = isDark ? 'rgba(99, 102, 241, 0.6)' : 'rgba(74, 144, 217, 0.5)';
      var nodeGlow = isDark ? 'rgba(99, 102, 241, 0.8)' : 'rgba(74, 144, 217, 0.7)';
      var lineColor = isDark ? 'rgba(99, 102, 241, ' : 'rgba(74, 144, 217, ';

      var time = Date.now() * 0.001;

      // Update and draw connections
      for (var i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
          var dx = nodes[i].x - nodes[j].x;
          var dy = nodes[i].y - nodes[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            var alpha = (1 - dist / connectionDist) * 0.25;

            // Brighten lines near mouse
            var midX = (nodes[i].x + nodes[j].x) / 2;
            var midY = (nodes[i].y + nodes[j].y) / 2;
            var mouseDist = Math.sqrt((midX - mouse.x) * (midX - mouse.x) + (midY - mouse.y) * (midY - mouse.y));
            if (mouseDist < mouseRadius) {
              alpha += (1 - mouseDist / mouseRadius) * 0.3;
            }

            ctx.strokeStyle = lineColor + alpha + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Update and draw nodes
      for (var k = 0; k < nodes.length; k++) {
        var node = nodes[k];
        var pulseFactor = Math.sin(time * 2 + node.pulse) * 0.3 + 0.7;

        // Mouse attraction
        var mdx = mouse.x - node.x;
        var mdy = mouse.y - node.y;
        var mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < mouseRadius && mDist > 0) {
          var force = (1 - mDist / mouseRadius) * 0.02;
          node.vx += mdx / mDist * force;
          node.vy += mdy / mDist * force;
        }

        // Damping
        node.vx *= 0.99;
        node.vy *= 0.99;

        node.x += node.vx;
        node.y += node.vy;

        // Bounce
        if (node.x < 0 || node.x > heroCanvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > heroCanvas.height) node.vy *= -1;
        node.x = Math.max(0, Math.min(heroCanvas.width, node.x));
        node.y = Math.max(0, Math.min(heroCanvas.height, node.y));

        // Glow near mouse
        var glowSize = node.baseRadius;
        if (mDist < mouseRadius) {
          glowSize = node.baseRadius * (1 + (1 - mDist / mouseRadius) * 1.5);
        }

        // Draw glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, glowSize * 2 * pulseFactor, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.fill();

        // Draw core
        ctx.beginPath();
        ctx.arc(node.x, node.y, glowSize * pulseFactor, 0, Math.PI * 2);
        ctx.fillStyle = nodeGlow;
        ctx.fill();
      }

      animId = requestAnimationFrame(drawNetwork);
    }

    // Only track mouse on hero area
    document.addEventListener('mousemove', function (e) {
      var rect = heroCanvas.getBoundingClientRect();
      if (e.clientY < rect.bottom) {
        mouse.x = e.clientX;
        mouse.y = e.clientY - rect.top;
      } else {
        mouse.x = -1000;
        mouse.y = -1000;
      }
    }, { passive: true });

    // Visibility: pause when hero not visible
    var heroObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        if (!animId) drawNetwork();
      } else {
        if (animId) {
          cancelAnimationFrame(animId);
          animId = null;
        }
      }
    }, { threshold: 0.1 });

    resizeCanvas();
    initNodes();
    drawNetwork();
    heroObserver.observe(heroCanvas.parentElement);

    window.addEventListener('resize', function () {
      resizeCanvas();
      initNodes();
    });
  }

  // ========== Navbar Scroll Shadow ==========
  var navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // ========== Hamburger Menu ==========
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  // ========== Active Nav Link (IntersectionObserver) ==========
  var sections = document.querySelectorAll('section[id]');
  var navLinkEls = document.querySelectorAll('.nav-link');

  if (sections.length && navLinkEls.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          navLinkEls.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });

    sections.forEach(function (section) {
      navObserver.observe(section);
    });
  }

  // ========== Timeline Scroll Progress ==========
  var timelineProgress = document.getElementById('timeline-progress');
  var timelineSection = document.querySelector('.timeline');

  if (timelineProgress && timelineSection) {
    var timelineItems = timelineSection.querySelectorAll('.timeline-item');

    var timelineObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, { rootMargin: '0px 0px -20% 0px' });

    timelineItems.forEach(function (item) {
      timelineObserver.observe(item);
    });

    window.addEventListener('scroll', function () {
      var rect = timelineSection.getBoundingClientRect();
      var totalHeight = timelineSection.offsetHeight;
      var windowH = window.innerHeight;
      // Line starts at 47px from top, ends 27px from bottom (matching CSS)
      var lineTop = 47;
      var lineBottom = 27;
      var lineHeight = totalHeight - lineTop - lineBottom;

      if (rect.top < windowH && rect.bottom > 0) {
        var scrolled = Math.min(1, Math.max(0, (windowH - rect.top - lineTop) / (totalHeight - lineTop + windowH)));
        timelineProgress.style.height = Math.min(scrolled * lineHeight, lineHeight) + 'px';
      }
    }, { passive: true });
  }

  // ========== Skills Stagger Animation ==========
  var skillTags = document.querySelectorAll('.skill-tag');
  if (skillTags.length) {
    var skillObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Animate all tags in this category
          var container = entry.target.closest('.skill-category');
          if (container) {
            container.querySelectorAll('.skill-tag').forEach(function (tag) {
              tag.classList.add('animate-in');
            });
          }
          skillObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px' });

    // Observe the first tag in each category
    document.querySelectorAll('.skill-category').forEach(function (cat) {
      var firstTag = cat.querySelector('.skill-tag');
      if (firstTag) skillObserver.observe(firstTag);
    });
  }

  // ========== Cursor Glow Effect (desktop only) ==========
  if (window.matchMedia('(min-width: 769px)').matches) {
    var glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    var glowActive = false;
    document.addEventListener('mousemove', function (e) {
      if (!glowActive) {
        glow.classList.add('active');
        glowActive = true;
      }
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    }, { passive: true });
  }

  // ========== Smooth reveal for section titles ==========
  document.querySelectorAll('.section-title').forEach(function (title) {
    title.style.opacity = '0';
    title.style.transform = 'translateY(20px)';
    title.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  var titleObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        titleObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -15% 0px' });

  document.querySelectorAll('.section-title').forEach(function (title) {
    titleObserver.observe(title);
  });

  // ========== Konami Code Easter Egg ==========
  var konamiCode = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA',
  ];
  var konamiIndex = 0;

  document.addEventListener('keydown', function (e) {
    if (e.code === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        konamiIndex = 0;
        triggerEasterEgg();
      }
    } else {
      konamiIndex = 0;
    }
  });

  function triggerEasterEgg() {
    var canvas = document.getElementById('neural-canvas');
    var msg = document.getElementById('easter-egg-msg');
    if (!canvas || !msg) return;

    canvas.style.display = 'block';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    msg.style.display = 'block';
    msg.style.opacity = '1';

    var eCtx = canvas.getContext('2d');
    var eNodes = [];
    var eNodeCount = 80;

    for (var i = 0; i < eNodeCount; i++) {
      eNodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        radius: Math.random() * 3 + 2,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    var startTime = Date.now();
    var duration = 3000;

    function animateEgg() {
      var elapsed = Date.now() - startTime;
      var progress = elapsed / duration;

      if (progress >= 1) {
        canvas.style.display = 'none';
        msg.style.display = 'none';
        return;
      }

      var opacity = progress < 0.7 ? 1 : 1 - (progress - 0.7) / 0.3;
      canvas.style.opacity = opacity;
      msg.style.opacity = opacity;

      eCtx.clearRect(0, 0, canvas.width, canvas.height);
      eCtx.fillStyle = 'rgba(15, 17, 23, 0.9)';
      eCtx.fillRect(0, 0, canvas.width, canvas.height);

      for (var i = 0; i < eNodes.length; i++) {
        for (var j = i + 1; j < eNodes.length; j++) {
          var dx = eNodes[i].x - eNodes[j].x;
          var dy = eNodes[i].y - eNodes[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            var alpha = (1 - dist / 150) * 0.5;
            var pulseAlpha = Math.sin(elapsed * 0.003 + eNodes[i].pulse) * 0.3 + 0.7;
            eCtx.strokeStyle = 'rgba(99, 102, 241, ' + alpha * pulseAlpha + ')';
            eCtx.lineWidth = 1;
            eCtx.beginPath();
            eCtx.moveTo(eNodes[i].x, eNodes[i].y);
            eCtx.lineTo(eNodes[j].x, eNodes[j].y);
            eCtx.stroke();
          }
        }
      }

      for (var k = 0; k < eNodes.length; k++) {
        var node = eNodes[k];
        var glow = Math.sin(elapsed * 0.005 + node.pulse) * 0.3 + 0.7;

        eCtx.beginPath();
        eCtx.arc(node.x, node.y, node.radius * glow * 1.5, 0, Math.PI * 2);
        eCtx.fillStyle = 'rgba(99, 102, 241, ' + glow * 0.6 + ')';
        eCtx.fill();

        eCtx.beginPath();
        eCtx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        eCtx.fillStyle = 'rgba(74, 144, 217, ' + glow + ')';
        eCtx.fill();

        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
      }

      requestAnimationFrame(animateEgg);
    }

    animateEgg();
  }

  // ========== Interactive Neural Playground ==========
  // A small interactive canvas in the footer area — click to spawn nodes
  var playground = document.getElementById('neural-playground');
  if (playground) {
    var pgCtx = playground.getContext('2d');
    var pgNodes = [];
    var pgMouse = { x: -1000, y: -1000 };

    function resizePlayground() {
      playground.width = playground.parentElement.offsetWidth;
      playground.height = 200;
    }

    // Seed some initial nodes
    function seedPlayground() {
      pgNodes = [];
      for (var i = 0; i < 20; i++) {
        pgNodes.push(createPgNode(
          Math.random() * playground.width,
          Math.random() * playground.height
        ));
      }
    }

    function createPgNode(x, y) {
      return {
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: Math.random() * 2 + 1.5,
        life: 1,
        decay: 0,
        pulse: Math.random() * Math.PI * 2,
      };
    }

    playground.addEventListener('click', function (e) {
      var rect = playground.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;

      // Spawn burst of nodes
      for (var i = 0; i < 5; i++) {
        var node = createPgNode(x, y);
        node.vx = (Math.random() - 0.5) * 4;
        node.vy = (Math.random() - 0.5) * 4;
        node.decay = 0.002;
        pgNodes.push(node);
      }

      // Limit total nodes
      if (pgNodes.length > 80) {
        pgNodes = pgNodes.slice(-60);
      }
    });

    playground.addEventListener('mousemove', function (e) {
      var rect = playground.getBoundingClientRect();
      pgMouse.x = e.clientX - rect.left;
      pgMouse.y = e.clientY - rect.top;
    }, { passive: true });

    playground.addEventListener('mouseleave', function () {
      pgMouse.x = -1000;
      pgMouse.y = -1000;
    });

    function drawPlayground() {
      pgCtx.clearRect(0, 0, playground.width, playground.height);

      var time = Date.now() * 0.001;
      var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      var lineBase = isDark ? 'rgba(99, 102, 241, ' : 'rgba(74, 144, 217, ';
      var nodeBase = isDark ? 'rgba(99, 102, 241, ' : 'rgba(74, 144, 217, ';

      // Connections
      for (var i = 0; i < pgNodes.length; i++) {
        for (var j = i + 1; j < pgNodes.length; j++) {
          var dx = pgNodes[i].x - pgNodes[j].x;
          var dy = pgNodes[i].y - pgNodes[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            var alpha = (1 - dist / 100) * 0.3 * Math.min(pgNodes[i].life, pgNodes[j].life);
            pgCtx.strokeStyle = lineBase + alpha + ')';
            pgCtx.lineWidth = 1;
            pgCtx.beginPath();
            pgCtx.moveTo(pgNodes[i].x, pgNodes[i].y);
            pgCtx.lineTo(pgNodes[j].x, pgNodes[j].y);
            pgCtx.stroke();
          }
        }
      }

      // Nodes
      for (var k = pgNodes.length - 1; k >= 0; k--) {
        var node = pgNodes[k];
        var pf = Math.sin(time * 2 + node.pulse) * 0.2 + 0.8;

        // Mouse repulsion
        var mdx = pgMouse.x - node.x;
        var mdy = pgMouse.y - node.y;
        var mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < 80 && mDist > 0) {
          node.vx -= mdx / mDist * 0.3;
          node.vy -= mdy / mDist * 0.3;
        }

        node.vx *= 0.98;
        node.vy *= 0.98;
        node.x += node.vx;
        node.y += node.vy;
        node.life -= node.decay;

        // Bounce
        if (node.x < 0 || node.x > playground.width) node.vx *= -1;
        if (node.y < 0 || node.y > playground.height) node.vy *= -1;
        node.x = Math.max(0, Math.min(playground.width, node.x));
        node.y = Math.max(0, Math.min(playground.height, node.y));

        // Remove dead nodes
        if (node.life <= 0) {
          pgNodes.splice(k, 1);
          continue;
        }

        pgCtx.beginPath();
        pgCtx.arc(node.x, node.y, node.radius * pf, 0, Math.PI * 2);
        pgCtx.fillStyle = nodeBase + (0.7 * node.life) + ')';
        pgCtx.fill();
      }

      requestAnimationFrame(drawPlayground);
    }

    resizePlayground();
    seedPlayground();
    drawPlayground();
    window.addEventListener('resize', function () {
      resizePlayground();
    });
  }
});
