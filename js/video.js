jQuery(function ($) {
  var viewport;
  var renderer;
  var camera;
  var controls;
  var scene;
  var video;
  var texture;

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

    // テクスチャ
    video = document.getElementById('video');

    texture = new THREE.Texture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBFormat;
    texture.generateMipmaps = false;

    // 物体
    var geometry = new THREE.SphereGeometry(2, 32, 16);
    var material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      map: texture
    });
    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
  }

  function render() {
    controls.update();

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      if (texture) texture.needsUpdate = true;
    }

    renderer.clear();
    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
});
