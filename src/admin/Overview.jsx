import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { DB } from '../js/db.js';

function Chart3D() {
  const containerRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const data = DB.getMonthlyReport(6);
    const w = container.clientWidth || 600;
    const h = container.clientHeight || 320;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFFFFFF);
    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
    camera.position.set(6, 4, 8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 5);
    scene.add(light);

    const maxVal = Math.max(...data.map(d => d.revenue), 1);
    const barWidth = 0.5, gap = 0.2;
    const totalW = data.length * (barWidth + gap) - gap;
    const startX = -totalW / 2;
    const colors = [0xFFD700, 0xFF006E, 0x3A86FF, 0x00FF00, 0xFF6B00, 0x9B30FF];

    data.forEach((d, i) => {
      const hh = Math.max((d.revenue / maxVal) * 2.5, 0.1);
      const geo = new THREE.BoxGeometry(barWidth, hh, 0.5);
      const mat = new THREE.MeshStandardMaterial({
        color: colors[i % colors.length],
        roughness: 0.3, metalness: 0.1,
        emissive: colors[i % colors.length], emissiveIntensity: 0.05
      });
      const bar = new THREE.Mesh(geo, mat);
      bar.position.set(startX + i * (barWidth + gap), hh / 2, 0);
      bar.castShadow = true;
      scene.add(bar);

      const edge = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: 0x000000 }));
      edge.position.copy(bar.position);
      scene.add(edge);

      function makeLabel(text, fontSize, yPos, scl) {
        const c = document.createElement('canvas');
        c.width = 256; c.height = 64;
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#000000';
        ctx.font = `bold ${fontSize}px Space Grotesk, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(text, 128, 36);
        const tex = new THREE.CanvasTexture(c);
        const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
        sp.position.set(startX + i * (barWidth + gap), yPos, 0);
        sp.scale.set(scl, scl * 0.25, 1);
        scene.add(sp);
      }

      makeLabel(d.label, 24, -0.3, 1.2);
      const val = d.revenue >= 1000000 ? (d.revenue / 1000000).toFixed(1) + 'jt' : 'Rp ' + new Intl.NumberFormat('id-ID').format(d.revenue);
      makeLabel(val, 20, hh + 0.4, 1);
    });

    function animate() {
      animRef.current = requestAnimationFrame(animate);
      scene.rotation.y += 0.005;
      renderer.render(scene, camera);
    }
    animate();

    const resize = () => {
      const cw = container.clientWidth || 600;
      const ch = container.clientHeight || 320;
      camera.aspect = cw / ch;
      camera.updateProjectionMatrix();
      renderer.setSize(cw, ch);
    };
    window.addEventListener('resize', resize);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="chart-3d-container" ref={containerRef} />;
}

export default function Overview() {
  const [stats, setStats] = useState(DB.getStats());

  useEffect(() => {
    setStats(DB.getStats());
  }, []);

  const rupiah = (n) => 'Rp ' + new Intl.NumberFormat('id-ID').format(n);

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card color-yellow">
          <div className="stat-label">Total Pendapatan</div>
          <div className="stat-value">{rupiah(stats.totalRevenue)}</div>
        </div>
        <div className="stat-card color-pink">
          <div className="stat-label">Total Order</div>
          <div className="stat-value">{stats.totalOrders}</div>
        </div>
        <div className="stat-card color-blue">
          <div className="stat-label">Laba Bersih</div>
          <div className="stat-value">{rupiah(stats.totalProfit)}</div>
        </div>
        <div className="stat-card color-green">
          <div className="stat-label">Total Pengeluaran</div>
          <div className="stat-value">{rupiah(stats.totalExpense)}</div>
        </div>
        <div className="stat-card color-yellow">
          <div className="stat-label">Total Produk</div>
          <div className="stat-value">{stats.productCount}</div>
        </div>
        <div className="stat-card color-pink">
          <div className="stat-label">Produk Terjual</div>
          <div className="stat-value">{stats.productSold}</div>
        </div>
      </div>
      <Chart3D />
    </div>
  );
}
