document.addEventListener("DOMContentLoaded", function () {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });

    const container = document.getElementById("earth-container");
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(1.5, 64, 64);
    const textureLoader = new THREE.TextureLoader();

    textureLoader.load(
        "earth_texture.jpg",
        function (texture) {
            const material = new THREE.MeshStandardMaterial({ map: texture });
            const earth = new THREE.Mesh(geometry, material);
            scene.add(earth);

            const light = new THREE.PointLight(0xffffff, 1.5);
            light.position.set(3, 3, 5);
            scene.add(light);

            camera.position.z = 4;

            function animate() {
                requestAnimationFrame(animate);
                earth.rotation.y += 0.002;
                renderer.render(scene, camera);
            }

            animate();
        },
        undefined, 
        function (error) {
            console.error("❌ Error loading texture:", error);
        }
    );

    window.addEventListener("resize", () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
});
