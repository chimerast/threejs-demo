jQuery(function ($) {
  var viewport;
  var renderer;
  var camera;
  var controls;
  var scene;

  init();
  render();

  function init() {
    // 表示領域
    viewport = document.getElementById("viewport");

    // レンダラ
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(viewport.clientWidth, viewport.clientHeight);
    renderer.setClearColor(0xffffff);

    viewport.appendChild(renderer.domElement);

    // シーングラフの作成
    scene = new THREE.Scene();

    // カメラの作成
    camera = new THREE.PerspectiveCamera(30, viewport.clientWidth / viewport.clientHeight, 1, 100);
    camera.position.set(0, 0, 6);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(camera);

    // カメラコントロール
    controls = new THREE.TrackballControls(camera, viewport);

    // 物体
    var geometry = new THREE.SphereGeometry(2, 32, 16);
    var material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      map: THREE.ImageUtils.loadTexture("img/earth.png")
    });
    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
  }

  function render() {
    controls.update();

    renderer.clear();
    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
});
