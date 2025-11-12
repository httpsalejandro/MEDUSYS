// app.js

// Parallax suave en el hero
const hero = document.querySelector('.hero-bg');
window.addEventListener('scroll', () => {
  const y = window.scrollY * 0.12;
  hero.style.transform = `translate3d(0, ${y}px, 0)`;
});

// Enlaces de la nav: desplazamiento suave
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').substring(1);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Preferencia de movimiento reducido
const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
if (mq.matches) {
  hero.style.transform = 'none';
}
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("neuronCanvas");
  const ctx = canvas.getContext("2d");
  const nodes = document.querySelectorAll(".node");

  // Ajustar tamaño del canvas
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  // Obtener posiciones de los nodos
  const positions = Array.from(nodes).map(node => {
    return {
      x: (parseFloat(node.style.getPropertyValue("--x")) / 100) * canvas.width,
      y: (parseFloat(node.style.getPropertyValue("--y")) / 100) * canvas.height
    };
  });

  // Dibujar conexiones
  ctx.strokeStyle = "rgba(147,185,224,0.6)";
  ctx.lineWidth = 2;
  positions.forEach((pos, i) => {
    positions.forEach((pos2, j) => {
      if (i < j) {
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(pos2.x, pos2.y);
        ctx.stroke();
      }
    });
  });

  // Navegación al hacer clic
  nodes.forEach(node => {
    node.addEventListener("click", () => {
      const target = node.dataset.target;
      document.getElementById(target).scrollIntoView({ behavior: "smooth" });
    });
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("neuronCanvas");
  const ctx = canvas.getContext("2d");
  const nodes = document.querySelectorAll(".node");

  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  const positions = Array.from(nodes).map(node => ({
    x: (parseFloat(node.style.getPropertyValue("--x")) / 100) * canvas.width,
    y: (parseFloat(node.style.getPropertyValue("--y")) / 100) * canvas.height
  }));

  function drawConnections() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(147,185,224,0.5)";
    ctx.lineWidth = 1.5;
    positions.forEach((pos, i) => {
      positions.forEach((pos2, j) => {
        if (i < j) {
          ctx.beginPath();
          ctx.moveTo(pos.x, pos.y);
          ctx.lineTo(pos2.x, pos2.y);
          ctx.stroke();
        }
      });
    });
  }

  // Animación pulsante
  let hue = 0;
  function animate() {
    hue += 0.5;
    ctx.strokeStyle = `hsla(${hue}, 70%, 70%, 0.6)`;
    drawConnections();
    requestAnimationFrame(animate);
  }
  animate();

  // Navegación suave
  nodes.forEach(node => {
    node.addEventListener("click", () => {
      const target = node.dataset.target;
      document.getElementById(target).scrollIntoView({ behavior: "smooth" });
    });
  });
});