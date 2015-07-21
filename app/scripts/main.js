;(function () {
  'use strict';
  //models
  var loadNum = 5;
  var currentNum = 0;
  var plane;
  var island;
  var skybox;
  var horseNum = 5;
  var birdsNum = 3;
  var birdList = [];
  var horseList = [];
  var birdPos = [
    {x:3, y:20, z:-35},
    {x:6, y:24, z:-33},
    {x:1, y:21, z:-30}
  ];
  var horsePos =
    [{x:0, y:4.6, z:28},
    {x:-1, y:4.1, z:30},
    {x:5, y:4, z:30},
    {x:10, y:5.1, z:25},
    {x:8, y:3, z:33}];
  var stonesGeometry, stonesMaterial, stones = [];
  var pointGeometry, pointMaterial, points = [];
  var bonusGeometry, bonusMaterial, bonuses = [];
  //scene element
  var scene;
  var camera;
  var renderer;
  var ambientLight;
  var pointLight;
  //game control
  var fly_speed = 0.1;
  var a_speed = 0;
  var d_speed = -1;
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
    skybox = new THREE.Mesh(new THREE.BoxGeometry(1000, 1000, 1000), material);
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
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 3000);
    camera.position.z = -4;
    camera.position.x = 60;
    camera.position.y = 10;
    camera.lookAt({
      x : 0,
      y : 3,
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
    pointLight.position.multiplyScalar(90);
    scene.add(pointLight);
    ambientLight = new THREE.AmbientLight(0xaaaaaa);
    scene.add(ambientLight);

    addEnvMap(scene);

    loadPlane();
    loadIsland();
    //loadHorse();
    initObject();
    //loadBirds();

    window.addEventListener('resize', onWindowResize, false);
    $(window).keydown(function(e) {
      if (e.which == 32) {
        if (fly_degree > 90 || fly_degree < -90) {
          d_speed = 0.3;
        } else {
          d_speed = 0.15;
        }
      }
    });
    $(window).keyup(function(e) {
      if (e.which == 32) {
        d_speed = -0.15;
      }
    });
    animate();
  }

  function loadPlane() {
    var loader = new THREE.JSONLoader();
    loader.load('images/model/plane.json', function(geometry, materials) {
      for (var i = 0; i < materials.length; i++ ) {
        var m = materials[i];
        m.skinning = true;
      }
      plane = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(materials));
      plane.position.y = 8;
      var animation = new THREE.Animation(plane, plane.geometry.animations[0]);
      animation.play();
      plane.scale.set(0.5, 0.5, 0.5);
      plane.position.x = pos_dist;
      plane.rotation.y = Math.PI;
      scene.add(plane);
      hideLoadding();
    });
  }

  //function loadBirds() {
  //  var loader = new THREE.JSONLoader( true );
  //  loader.load( "images/model/bird.json", function (geometry) {
  //    var birdMat = new THREE.MeshLambertMaterial({color: 0xeeeeee, morphTargets: true, overdraw: 0.5});
  //    for (var i = 0; i < birdsNum; i++) {
  //      var bird = new THREE.Mesh(geometry, birdMat);
  //      bird.scale.set(0.01, 0.01, 0.01);
  //      bird.position.x = birdPos[i].x;
  //      bird.position.y = birdPos[i].y;
  //      bird.position.z = birdPos[i].z;
  //      birdList.push(bird);
  //      bird.rotation.y = Math.PI / 2;
  //      scene.add(bird);
  //    }
  //    hideLoadding();
  //  });
  //}
  //
  //function loadHorse() {
  //  var loader = new THREE.JSONLoader( true );
  //  loader.load( "images/model/horse.json", function ( geometry ) {
  //    var horseMat = new THREE.MeshLambertMaterial({color: 0x606060, morphTargets: true, overdraw: 0.5});
  //    for (var i = 0; i < horseNum; i++) {
  //      var horse = new THREE.Mesh(geometry, horseMat);
  //      horse.scale.set(0.01, 0.01, 0.01);
  //      horse.rotation.y = (Math.random() - 0.5) * 0.8 + Math.PI / 2;
  //      horse.rotation.x = (Math.random() - 0.5) * 0.3;
  //      horse.position.x = horsePos[i].x;
  //      horse.position.y = horsePos[i].y;
  //      horse.position.z = horsePos[i].z;
  //      horseList.push(horse);
  //      scene.add(horse);
  //    }
  //    hideLoadding();
  //  });
  //}

  //TODO
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

  function loadBonus() {
    var loader = new THREE.JSONLoader();
    loader.load('images/model/bonus.json', function(geometry, materials) {
      bonusGeometry = geometry;
      bonusMaterial = new THREE.MeshFaceMaterial(materials);
      var bonus = new THREE.Mesh(geometry, bonusMaterial);
      scene.add(bonus);

      hideLoadding();
    });
  }

  function loadStones() {
    var loader = new THREE.JSONLoader();
    loader.load('images/model/stone.json', function(geometry, materials) {
      stonesGeometry = geometry;
      stonesMaterial = materials;

      hideLoadding();
    });
  }

  function loadPoint() {
    var loader = new THREE.JSONLoader();
    loader.load('images/model/point.json', function(geometry, materials) {
      pointGeometry = geometry;
      pointMaterial = materials;

      hideLoadding();
    });
  }

  function plane_fly() {
    a_speed += d_speed;
    if (d_speed >= 0.3 && a_speed < -2.5) {
      a_speed = -2.5;
    } else if (d_speed >= 0.3 && a_speed > 2.5) {
      a_speed = 2.5;
    } else if (fly_degree > 90 && a_speed > 1 && d_speed < 0) {
      a_speed = 1;
    } else if (a_speed < -1) {
      a_speed = -1;
    } else if (a_speed > 1.5) {
      a_speed = 1.5;
    }
    if (fly_degree >= -90 && fly_degree <= 90) {
      fly_degree += a_speed;
    } else {
      fly_degree += Math.abs(a_speed);
      if(fly_degree >= 180) {
        fly_degree = -179;
      }
    }
    if (d_speed < 0 && fly_degree >= -90 + a_speed && fly_degree <= -90 - a_speed) {
        fly_degree = -90;
    }
    //fly_degree = 0;
    if(plane && island && skybox) {
      var deg = Math.atan(fly_speed * Math.cos(fly_degree * Math.PI / 180) / pos_dist);
      island.rotation.y -= deg;
      plane.position.y += Math.sin(fly_degree * Math.PI / 180) * fly_speed;

      //for (var i = 0; i < birdsNum; i++) {
      //  var dist = Math.sqrt(birdList[i].position.x * birdList[i].position.x + birdList[i].position.z * birdList[i].position.z);
      //  birdList[i].position.x += dx;
      //  birdList[i].position.z += dz;
      //  birdList[i].rotation.y -= deg;
      //}

      plane.rotation.x = fly_degree * Math.PI / 180;
      var pos = plane.position.y * 1.1;
      if (pos < 0) {
        pos = 0;
      }
      camera.position.y = pos;
      if (plane.rotation.z >= 0.1 || plane.rotation.z <= -0.1) {
        model_rot_dir = -model_rot_dir;
      }
      var rot_delta = Math.min(0.001, Math.max(0.0005, (0.1 - Math.abs(plane.rotation.z)) / 0.1 * 0.005));
      plane.rotation.z += model_rot_dir * rot_delta;
    }
  }

  var clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    var delta = clock.getDelta();
    THREE.AnimationHandler.update(3 * delta);
    //plane_fly();
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
