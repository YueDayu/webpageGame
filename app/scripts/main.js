;
(function () {
  'use strict';
  //models
  var loadNum = 2;
  var currentNum = 0;
  var plane;
  var island;
  var skybox;
  var stonesGeometry, stonesMaterial, stones = [];
  var starsGeometry, starsMaterial, stars = [];
  var bonusGeometry, bonusMaterial, bonus = [];
  //scene element
  var scene;
  var camera;
  var renderer;
  var ambientLight;
  var pointLight;
  //game control
  var fly_speed;
  var fly_degree = 0;
  var pos_dist = 50; //distance to the y-axis
  var model_rot_dir = 1;

  function addEnvMap(scene) {
    var urls = [
      'images/pics/0004.png',
      'images/pics/0002.png',
      'images/pics/0006.png',
      'images/pics/0005.png',
      'images/pics/0001.png',
      'images/pics/0003.png'
    ];
    var cubemap = THREE.ImageUtils.loadTextureCube(urls);
    cubemap.format = THREE.RGBFormat;
    var shader = THREE.ShaderLib["cube"];
    shader.uniforms["tCube"].value = cubemap;
    var material = new THREE.ShaderMaterial({
      fragmentShader: shader.fragmentShader,
      vertexShader: shader.vertexShader,
      uniforms: shader.uniforms,
      depthWrite: false,
      side: THREE.BackSide
    });
    var skybox = new THREE.Mesh(new THREE.BoxGeometry(1000, 1000, 1000), material);
    scene.add(skybox);
  }

  function hideLoadding() {
    currentNum++;
    if (currentNum >= loadNum) {
      $('#loading').fadeOut();
    }
  }
  var controls;

  function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 3000);
    camera.position.z = 65;
    camera.position.x = 0;
    camera.position.y = 10;
    camera.lookAt({
      x : 0,
      y : 0,
      z : 0
    });
    //TODO
    controls = new THREE.OrbitControls( camera );
    controls.center.set( 0, 0, 0 );
    //TODO
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);
    pointLight = new THREE.PointLight( 0xaaaaaa, 0.75 );
    pointLight.position.set( -100, 100, 100 );
    pointLight.position.multiplyScalar( 90 );
    scene.add(pointLight);
    ambientLight = new THREE.AmbientLight(0xaaaaaa);
    scene.add(ambientLight);

    addEnvMap(scene);

    loadPlane();
    loadIsland();
    initObject();

    window.addEventListener('resize', onWindowResize, false);
    $(window).keypress(function(e) {
      console.log(e.which);
    });
    animate();
  }

  function loadPlane() {
    var loader = new THREE.JSONLoader();
    loader.load('images/model/plane.json', function(geometry, materials) {
      plane = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
      plane.position.y = 10;
      //var animation = new THREE.Animation(plane, plane.geometry.animations[0]);
      //animation.play();
      plane.scale.set(0.5, 0.5, 0.5);
      plane.position.y = 8;
      plane.position.z = 50;
      plane.rotation.y = 90 * Math.PI / 180;
      scene.add(plane);
      hideLoadding();
    });
  }

  function initObject() {
    var geometry = new THREE.Geometry();
    geometry.vertices.push( new THREE.Vector3(0, 0, 150 ) );
    geometry.vertices.push( new THREE.Vector3(0, 0, -150 ) );

    var line;

    for ( var i = 0; i <= 20; i ++ ) {
      for (var j = 0; j < 5; j++) {
        line = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: 0x000000, opacity: 0.2}));
        line.position.x = ( i * 10 ) - 100;
        line.position.y = j * 10;
        scene.add(line);

        line = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: 0x000000, opacity: 0.2}));
        line.position.z = ( i * 10 ) - 100;
        line.rotation.y = 90 * Math.PI / 180;
        line.position.y = j * 10;
        scene.add(line);
      }
    }
  }

  function loadIsland() {
    var loader = new THREE.JSONLoader();
    loader.load('images/model/island.json', function(geometry, materials) {
      island = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
      island.scale.set(10, 10, 10);
      island.position.y = -5;
      scene.add(island);
      hideLoadding();
    });
  }

  function plane_fly() {
    if(plane) {
      if (plane.rotation.z >= 0.1 || plane.rotation.z <= -0.1) {
        model_rot_dir = -model_rot_dir;
      }
      var rot_delta = Math.min(0.001, Math.max(0.0005, (0.1 - Math.abs(plane.rotation.z)) / 0.1 * 0.005));
      plane.rotation.z += model_rot_dir * rot_delta;
      plane.rotation.x = fly_degree;
    }
  }

  var clock = new THREE.Clock();

  function animate() {
    plane_fly();
    requestAnimationFrame(animate);
    //var delta = clock.getDelta();
    //THREE.AnimationHandler.update(delta);
    controls.update();
    renderer.render(scene, camera);
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }

  init();
})();
