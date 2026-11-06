
(function () {
  const $ = window.PF.$,
    $$ = window.PF.$$;
  
  (function () {
    if (typeof THREE === "undefined") return;
    const box = $("#canvas-container");
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);
    box.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);

    const count = 3600,
      pos = new Float32Array(count * 3);
    for (let i = 0; i < pos.length; i++) pos[i] = (Math.random() - 0.5) * 30;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const stars = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        size: 0.03,
        color: 0xc9b49a,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        depthWrite: false,
      }),
    );
    scene.add(stars);

    // Make the falling-star background a little brighter in night mode.
    const updateStarBrightness = () => {
      stars.material.opacity = document.documentElement.getAttribute("data-theme") === "dark" ? 0.52 : 0.3;
    };
    updateStarBrightness();
    new MutationObserver(updateStarBrightness).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const pointer = { x: 0, y: 0 };
    addEventListener("pointermove", (e) => {
      pointer.x = (e.clientX / innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / innerHeight) * 2 + 1;
    });
    addEventListener("resize", () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    });
    const clock = new THREE.Clock();
    (function tick() {
      const t = clock.getElapsedTime();
      stars.rotation.y = t * 0.012 + pointer.x * 0.015;
      stars.rotation.x = t * 0.006 + pointer.y * 0.015;
      camera.position.y = -window.scrollY * 0.005;
      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    })();
  })();
})();
