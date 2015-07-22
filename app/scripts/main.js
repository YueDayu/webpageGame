;(function () {
  'use strict';
  //models
  var loadNum = 6;
  var currentNum = 0;
  var plane;
  var island;
  var skyBox;
  var line = [];
  var stonesGeometry, stonesMaterial;
  var pointGeometry, pointMaterial;
  var bonusGeometry, bonusMaterial;
  //scene element
  var scene;
  var camera;
  var renderer;
  var ambientLight;
  var pointLight;
  //game control
  var fly_speed = 0.15;
  var a_speed = 0;
  var d_speed = -1;
  var fly_degree = 0;
  var pos_dist = 50; //distance to the y-axis
  var model_rot_dir = 1;
  var current_put_level = 0;
  var current_map_index = 0;
  var current_put_index = 0;
  var empty = 0;
  var float_h = 0;
  var score = 0;
  var fuel = 100;
  var c = document.getElementById("bar");
  var showFuelBar = c.getContext("2d");
  var clock = new THREE.Clock();

  //type: 1 stone | 2 bonus | 3 point
  //maps
  var maps;
  //Sound
  var pointAudio;
  var bonusAudio;
  var stoneAudio;
  var hitGroundAudio;
  var engineAudio;

  //state
  var is_playing;

  //start!
  init();

  function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 3000);
    camera.position.z = -4;
    camera.position.x = 60;
    camera.position.y = 11;
    camera.lookAt({
      x : 0,
      y : 5,
      z : -3
    });
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);
    pointLight = new THREE.PointLight( 0xaaaaaa, 0.75 );
    pointLight.position.set(-50, 100, 0);
    pointLight.position.multiplyScalar(300);
    scene.add(pointLight);
    ambientLight = new THREE.AmbientLight(0x999999);
    scene.add(ambientLight);
    //load sky box
    addEnvMap(scene);
    //load models
    loadPlane();
    loadIsland();
    loadBonus();
    loadPoint();
    loadStones();
    loadSound();
    loadMap();
    //add event listener
    window.addEventListener('resize', onWindowResize, false);
    $(window).keypress(function(e) {
      if (e.which == 32 && currentNum >= loadNum) {
        if (!is_playing) {
          $('#ui-start').hide();
          is_playing = true;
          reset();
        } else {
          if (plane && plane.position.y < 40 && fuel > 0) {
            engineAudio.play();
            if (fly_degree > 90 || fly_degree < -90) {
              d_speed = 0.3;
            } else {
              d_speed = 0.2;
            }
          } else {
            planeDown();
          }
        }
      }
    });
    $(window).keyup(function(e) {
      if (e.which == 32) {
        planeDown();
      }
    });
    is_playing = false;
    animate();
  }

  function planeDown() {
    engineAudio.pause();
    d_speed = -0.2;
  }

  //resize
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }

  //main loop and render
  function animate() {
    requestAnimationFrame(animate);
    var delta = clock.getDelta();
    THREE.AnimationHandler.update(3 * delta);
    if (is_playing) {
      plane_fly()
    }
    renderer.render(scene, camera);
  }

  //end loading
  function hideLoading() {
    currentNum++;
    if (currentNum >= loadNum) {
      $('#loading').fadeOut();
      $('#score').fadeIn();
      putElements();
      UiStart();
    }
  }

  //reset game
  function reset() {
    for (var i = 0; i < line.length; i++) {
      for (var j = 0; j < line[i].length; j++) {
        scene.remove(line[i][j].element);
      }
    }
    line.length = 0;
    current_put_level = 0;
    current_map_index = 0;
    current_put_index = 0;
    empty = 0;
    float_h = 0;
    putElements();
    plane.position.y = 8;
    plane.scale.set(0.5, 0.5, 0.5);
    plane.position.x = pos_dist;
    plane.rotation.y = Math.PI;
    fly_degree = 0;
    a_speed = 0;
    score = 0;
    fuel = 100;
    $('#show')[0].innerHTML = '0';
  }

  //load functions
  function addEnvMap(scene) {
    var urls = [
      'images/pics/0004.png',
      'images/pics/0002.png',
      'images/pics/0006.png',
      'images/pics/0005.png',
      'images/pics/0001.png',
      'images/pics/0003.png'
    ];
    var cubeMap = THREE.ImageUtils.loadTextureCube(urls);
    cubeMap.format = THREE.RGBFormat;
    var shader = THREE.ShaderLib["cube"];
    shader.uniforms["tCube"].value = cubeMap;
    var material = new THREE.ShaderMaterial({
      fragmentShader: shader.fragmentShader,
      vertexShader: shader.vertexShader,
      uniforms: shader.uniforms,
      depthWrite: false,
      side: THREE.BackSide
    });
    skyBox = new THREE.Mesh(new THREE.BoxGeometry(1000, 1000, 1000), material);
    scene.add(skyBox);
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
      hideLoading();
    });
  }

  function loadMap() {
    $.getJSON('images/map/map.json', function(data) {
      maps = data;
      hideLoading();
    });
  }

  function loadIsland() {
    var loader = new THREE.JSONLoader();
    loader.load('images/model/island.json', function(geometry, materials) {
      island = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
      island.scale.set(10, 10, 10);
      island.position.y = -5;
      scene.add(island);
      hideLoading();
    });
  }

  function loadBonus() {
    var loader = new THREE.JSONLoader();
    loader.load('images/model/bonus.json', function(geometry, materials) {
      bonusGeometry = geometry;
      bonusMaterial = new THREE.MeshFaceMaterial(materials);
      hideLoading();
    });
  }

  function loadStones() {
    var loader = new THREE.JSONLoader();
    loader.load('images/model/stone.json', function(geometry, materials) {
      stonesGeometry = geometry;
      stonesMaterial = new THREE.MeshFaceMaterial(materials);
      hideLoading();
    });
  }

  function loadPoint() {
    var loader = new THREE.JSONLoader();
    loader.load('images/model/point.json', function(geometry, materials) {
      pointGeometry = geometry;
      pointMaterial = new THREE.MeshFaceMaterial(materials);
      hideLoading();
    });
  }

  function loadSound() {
    pointAudio = document.createElement("audio");
    pointAudio.src = "images/music/note_2.mp3";

    bonusAudio = document.createElement("audio");
    bonusAudio.src = "images/music/megagem_6.mp3";

    stoneAudio = document.createElement("audio");
    stoneAudio.src = "images/music/cloud_hit.mp3";

    hitGroundAudio = document.createElement("audio");
    hitGroundAudio.src = "images/music/ground_hit.mp3";

    engineAudio = document.createElement("audio");
    engineAudio.src = "images/music/engine.mp3";
    engineAudio.setAttribute("loop", true);
  }

  //add invisible elements
  function putElements() {
    for (var i = 0; i < 130; i++) {
      var point = new THREE.Mesh(stonesGeometry, stonesMaterial);
      point.position.x = pos_dist * Math.cos(2 * Math.PI * i / 130);
      point.position.z = pos_dist * Math.sin(2 * Math.PI * i / 130);
      point.position.y = -10;
      scene.add(point);
      var tempElem = {
        type: 1,
        element: point
      };
      var temp = [];
      temp.push(tempElem);
      line.push(temp);
    }
  }

  //controller functions
  function levelControl() {
    if (score < 50) {
      if (current_put_level != 0) {
        current_put_level = 0;
        empty = 0;
      }
    } else if (score < 130) {
      if (current_put_level != 1) {
        current_put_level = 1;
        empty = 0;
      }
    } else {
      if (current_put_level != 2) {
        current_put_level = 2;
        empty = 0;
      }
    }
  }

  function fuelControl() {
    fuel -= 0.03;
    showFuelBar.fillStyle = "#000000";
    showFuelBar.fillRect(0, 0, 300, 200);
    showFuelBar.fillStyle = "#FF0000";
    showFuelBar.fillRect(0, 0, fuel * 3, 200);
    if (fuel > 10) {
      $('#no-fuel').hide();
    } else {
      $('#no-fuel').show();
    }
    if (fuel < 0) {
      fuel = 0;
    }
    if (fuel > 100) {
      fuel = 100;
    }
  }

  function speedControl() {
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
  }

  function planeControl() {
    plane.position.y += Math.sin(fly_degree * Math.PI / 180) * fly_speed;
    if (plane.position.y <= 0) {
      plane.position.y = 0;
      onCollideGround();
    }
    plane.rotation.x = fly_degree * Math.PI / 180;
    if (plane.rotation.z >= 0.1 || plane.rotation.z <= -0.1) {
      model_rot_dir = -model_rot_dir;
    }
    var rot_delta = Math.min(0.001, Math.max(0.0005, (0.1 - Math.abs(plane.rotation.z)) / 0.1 * 0.005));
    plane.rotation.z += model_rot_dir * rot_delta;
  }

  function cameraControl() {
    var pos = plane.position.y * 1.1;
    if (pos < 0) {
      pos = 0;
    }
    camera.position.y = pos;
  }

  function islandControl() {
    island.rotation.y -= Math.atan(fly_speed * Math.cos(fly_degree * Math.PI / 180) / pos_dist);
  }

  function lightControl() {
    pointLight.position.x = -Math.cos(island.rotation.y) * 50;
    pointLight.position.z = Math.sin(island.rotation.y) * 50;
  }

  function collisionDetection(i) {
    var cosNum = Math.cos(island.rotation.y + 2 * Math.PI * i / line.length);
    var sinNum = Math.sin(island.rotation.y + 2 *Math.PI * i / line.length);
    for (var j = 0; j < line[i].length; j++) { //碰撞检测
      if (line[i][j].element.position.x > 48 && line[i][j].element.position.z > -2
        && line[i][j].element.position.z < 2
        && ((line[i][j].type == 1 && Math.abs(line[i][j].element.position.y - plane.position.y) < 1.5)
        || (line[i][j].type == 2 && Math.abs(line[i][j].element.position.y - plane.position.y) < 1)
        || (line[i][j].type == 3 && Math.abs(line[i][j].element.position.y - plane.position.y) < 1))) {
        if(line[i][j].type == 3) {
          score++;
        } else if (line[i][j].type == 1) {
          fuel -= 10;
        } else {
          fuel += 10;
        }
        $('#show')[0].innerHTML = score;
        scene.remove(line[i][j].element);
        onCollidePoint(line[i][j]);
        line[i].splice(j, 1);
      } else {
        line[i][j].element.position.x = -cosNum * pos_dist;
        line[i][j].element.position.z = sinNum * pos_dist;
        line[i][j].element.rotation.y = (island.rotation.y + 2 * Math.PI * i / line.length + Math.PI);
      }
    }
  }

  //add element for a line
  function addElement(i) {
    var cosNum = Math.cos(island.rotation.y + 2 * Math.PI * i / line.length);
    var sinNum = Math.sin(island.rotation.y + 2 *Math.PI * i / line.length);
    if (-cosNum * pos_dist < -40 && sinNum * pos_dist < 10 && sinNum * pos_dist > 0 && line[i].length > 0) { //clear the array
      for (var j = 0; j < line[i].length; j++) {
        scene.remove(line[i][j].element);
      }
      line[i].length = 0;
    } else if (-cosNum * pos_dist < -40 && sinNum * pos_dist > -10 && sinNum * pos_dist < 0 && line[i].length == 0) {
      if (empty <= 4) {
        var hiddenPoint = new THREE.Mesh(stonesGeometry, stonesMaterial);
        scene.add(hiddenPoint);
        var hiddenPointTempElem = {
          type: 1,
          element: hiddenPoint
        };
        hiddenPoint.position.y = -10;
        line[i].push(hiddenPointTempElem);
        empty++;
      } else {
        if (maps[current_put_level][current_map_index].length <= current_put_index) {
          empty = 0;
          current_map_index = Math.floor(Math.random() / 0.34); //random
          current_put_index = 0;
          float_h = (Math.random() - 0.5) * 6;
        } else {
          for (var k = 0; k < maps[current_put_level][current_map_index][current_put_index].length; k++) {
            var point;
            var tempElem;
            if (maps[current_put_level][current_map_index][current_put_index][k].type == 1) {
              point = new THREE.Mesh(stonesGeometry, stonesMaterial);
              scene.add(point);
              tempElem = {
                type: 1,
                element: point
              };
            } else if (maps[current_put_level][current_map_index][current_put_index][k].type == 2) {
              point = new THREE.Mesh(bonusGeometry, bonusMaterial);
              scene.add(point);
              tempElem = {
                type: 2,
                element: point
              };
            } else {
              point = new THREE.Mesh(pointGeometry, pointMaterial);
              scene.add(point);
              tempElem = {
                type: 3,
                element: point
              };
            }
            point.position.y = maps[current_put_level][current_map_index][current_put_index][k].h + float_h;
            line[i].push(tempElem);
          }
          current_put_index++;
        }
      }
    }
  }

  //main loop function
  function plane_fly() {
    levelControl();
    fuelControl();
    if (is_playing) {
      speedControl();
    }
    if(currentNum >= loadNum) {
      for (var i = 0; i < line.length; i++) {
        addElement(i);
        collisionDetection(i);
      }
      lightControl();
      planeControl();
      cameraControl();
      islandControl();
    }
  }

  function UiStart() {
    var title = $("#ui-start");
    $('#no-fuel').hide();
    title.fadeIn();
  }

  function onCollideGround() {
    is_playing = false;
    hitGroundAudio.play();
    UiStart();
  }

  function onCollidePoint(element) {
    if (element.type == 3) pointAudio.play();
    else if (element.type == 2) bonusAudio.play();
    else stoneAudio.play();
  }

})();
