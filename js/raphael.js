(function () {
  var viewport;
  var renderer;
  var camera;
  var scene;
  var cube;

  init();
  render();

  function init() {
    // 表示領域
    viewport = document.getElementById("viewport");

    // レンダラ
    renderer = new THREE.RaphaelRenderer();
    renderer.setSize(viewport.clientWidth, viewport.clientHeight);

    // シーングラフの作成
    scene = new THREE.Scene();

    // カメラの作成
    camera = new THREE.PerspectiveCamera(30, viewport.clientWidth / viewport.clientHeight, 1, 100);
    camera.position.set(0, 0, 6);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(camera);

    // 物体
    cube = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 4), new THREE.MeshNormalMaterial());
    scene.add(cube);
  }

  function render() {
    cube.rotation.x = 0.1 * Date.now() * 2.0 * Math.PI / 1000.0;
    cube.rotation.y = 0.2 * Date.now() * 2.0 * Math.PI / 1000.0;

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
})();
