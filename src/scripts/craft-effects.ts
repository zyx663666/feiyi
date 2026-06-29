/**
 * 非遗工艺页通用交互脚本
 * 为 hero 背景图区域添加水波纹涟漪效果
 * 需要在页面中放置：
 *   - .craft-hero[data-ripple] 容器
 *   - .craft-hero 内的 .ripple-canvas
 */

export function initCraftEffects() {
  initRippleEffect();
}

/**
 * 水波纹涟漪效果
 * 鼠标在 hero 背景图上移动/点击时，canvas 绘制扩散圆环
 */
function initRippleEffect() {
  const banners = document.querySelectorAll<HTMLElement>(".craft-hero[data-ripple]");

  banners.forEach((banner) => {
    const canvas = banner.querySelector<HTMLCanvasElement>(".ripple-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const ripples: Array<{
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      opacity: number;
      color: string;
    }> = [];

    function resizeCanvas() {
      const rect = banner.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // 鼠标移动生成涟漪
    let lastTime = 0;
    banner.addEventListener("mousemove", (e) => {
      const now = Date.now();
      if (now - lastTime < 80) return;
      lastTime = now;

      const rect = banner.getBoundingClientRect();
      ripples.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        radius: 0,
        maxRadius: 100 + Math.random() * 50,
        opacity: 0.6,
        color: "rgba(245, 240, 232, 0.8)",
      });
      if (ripples.length > 12) ripples.shift();
    });

    // 点击生成更强涟漪
    banner.addEventListener("click", (e) => {
      const rect = banner.getBoundingClientRect();
      ripples.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        radius: 0,
        maxRadius: 180,
        opacity: 0.9,
        color: "rgba(245, 240, 232, 1)",
      });
    });

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 2;
        r.opacity -= 0.012;

        if (r.opacity <= 0 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = r.color.replace(/[\d.]+\)$/g, `${r.opacity})`);
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius * 0.6, 0, Math.PI * 2);
        ctx.strokeStyle = r.color.replace(/[\d.]+\)$/g, `${r.opacity * 0.4})`);
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      requestAnimationFrame(animate);
    }
    animate();
  });
}
