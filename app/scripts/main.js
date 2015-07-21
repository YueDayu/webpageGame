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
  var fly_speed = 0.2;
  var a_speed = 0;
  var d_speed = -1;
  var fly_degree = 0;
  var pos_dist = 50; //distance to the y-axis
  var model_rot_dir = 1;

  //type: 1 stone | 2 bonus | 3 point
  //maps
  var maps = [ //level 1-3
    [
      [
        [{type: 3, h: 10}],
        [{type: 3, h: 12}],
        [{type: 3, h: 14}],
        [{type: 3, h: 15}],
        [{type: 2, h: 15.5}, {type: 3, h: 11}],
        [{type: 3, h: 15}],
        [{type: 3, h: 14}],
        [{type: 3, h: 12}],
        [{type: 2, h: 10}]
      ],[
      [{type: 3, h: 13}],
      [{type: 3, h: 14}],
      [{type: 3, h: 15}],
      [{type: 3, h: 16}],
      [{type: 3, h: 17}, {type: 1, h: 21}],
      [{type: 3, h: 18}],
      [{type: 3, h: 19}],
      [{type: 2, h: 20}, {type: 1, h: 16}],
      [{type: 3, h: 19}],
      [{type: 3, h: 18}],
      [{type: 3, h: 17}, {type: 1, h: 21}],
      [{type: 3, h: 16}],
      [{type: 3, h: 15}],
      [{type: 3, h: 14}],
      [{type: 3, h: 13}]
    ],[
      [{type: 3, h: 10}],
      [{type: 3, h: 12}],
      [{type: 3, h: 14}],
      [{type: 3, h: 16}],
      [{type: 3, h: 18}],
      [{type: 3, h: 19}],
      [{type: 2, h: 20}, {type: 1, h: 17}]
    ]
    ],[
      [
        [{type: 3, h: 10}],
        [{type: 3, h: 10}, {type: 3, h: 12}, {type: 3, h: 14}, {type: 3, h: 16}, {type: 3, h: 18}],
        [{type: 3, h: 10}, {type: 3, h: 19}],
        [{type: 3, h: 10}, {type: 1, h: 13}, {type: 1, h: 16}, {type: 2, h: 19}],
        [{type: 3, h: 10}, {type: 3, h: 19}],
        [{type: 3, h: 10}, {type: 3, h: 12}, {type: 3, h: 14}, {type: 3, h: 16}, {type: 3, h: 18}],
        [{type: 3, h: 10}]
      ],
      [
        [{type: 3, h: 10}, {type: 3, h: 12}, {type: 3, h: 14}, {type: 3, h: 16}],
        [{type: 3, h: 10}, {type: 3, h: 16}],
        [{type: 2, h: 10}, {type: 1, h: 13}, {type: 1, h: 16}],
        [{type: 3, h: 10}, {type: 3, h: 16}],
        [{type: 3, h: 10}, {type: 3, h: 12}, {type: 3, h: 14}, {type: 3, h: 16}]
      ],
      [
        [{type: 3, h: 10}, {type: 3, h: 12}, {type: 3, h: 14}, {type: 3, h: 16}, {type: 3, h: 19}],
        [{type: 3, h: 10}, {type: 3, h: 20}, {type: 1, h: 13}, {type: 1, h: 18}, {type: 3, h: 15}],
        [{type: 3, h: 10}, {type: 2, h: 15}, {type: 3, h: 17}],
        [{type: 3, h: 10}, {type: 1, h: 14}],
        [{type: 3, h: 10}]
      ]
    ],[
      [
        [{type: 1, h: 11}],
        [{type: 1, h: 12.5}, {type: 3, h: 9}],
        [{type: 1, h: 7}, {type: 3, h: 11}, {type: 1, h: 15}],
        [{type: 1, h: 9}, {type: 1, h: 17.5}, {type: 3, h: 13}],
        [{type: 2, h: 14}]
      ],
      [
        [{type: 1, h: 10}, {type: 1, h: 15}, {type: 1, h: 20}],
        [{type: 3, h: 10}, {type: 3, h: 15}, {type: 3, h: 20}],
        [{type: 3, h: 10}, {type: 2, h: 15}, {type: 3, h: 20}],
        [{type: 3, h: 10}, {type: 3, h: 15}, {type: 3, h: 20}],
        [{type: 1, h: 10}, {type: 1, h: 15}, {type: 1, h: 20}]
      ],
      [
        [{type: 1, h: 10}, {type: 1, h: 13}, {type: 1, h: 16}, {type: 1, h: 19}],
        [{type: 3, h: 10}, {type: 3, h: 13}, {type: 3, h: 16}, {type: 3, h: 19}],
        [{type: 2, h: 10}, {type: 3, h: 13}, {type: 3, h: 16}, {type: 3, h: 19}],
        [{type: 3, h: 10}, {type: 3, h: 13}, {type: 3, h: 16}, {type: 3, h: 19}],
        [{type: 1, h: 10}, {type: 1, h: 13}, {type: 1, h: 16}, {type: 1, h: 19}]
      ]
    ]
  ];

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
      putElements();
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
      y : 5,
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
    pointLight.position.set( 100, 100, 0 );
    pointLight.position.multiplyScalar(300);
    scene.add(pointLight);
    ambientLight = new THREE.AmbientLight(0x999999);
    scene.add(ambientLight);

    addEnvMap(scene);

    loadPlane();
    loadIsland();
    loadBonus();
    loadPoint();
    loadStones();
    //loadHorse();
    //initObject();
    //loadBirds();

    window.addEventListener('resize', onWindowResize, false);
    $(window).keydown(function(e) {
      if (e.which == 32) {
        if (plane && plane.position.y < 40) {
          if (fly_degree > 90 || fly_degree < -90) {
            d_speed = 0.3;
          } else {
            d_speed = 0.2;
          }
        }
      }
    });
    $(window).keyup(function(e) {
      if (e.which == 32) {
        d_speed = -0.2;
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

      hideLoadding();
    });
  }

  function loadStones() {
    var loader = new THREE.JSONLoader();
    loader.load('images/model/stone.json', function(geometry, materials) {
      stonesGeometry = geometry;
      stonesMaterial = new THREE.MeshFaceMaterial(materials);

      hideLoadding();
    });
  }

  function loadPoint() {
    var loader = new THREE.JSONLoader();
    loader.load('images/model/point.json', function(geometry, materials) {
      pointGeometry = geometry;
      pointMaterial = new THREE.MeshFaceMaterial(materials);
      hideLoadding();
    });
  }

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

  var current_put_level = 2;
  var current_map_index = 0;
  var current_put_index = 0;
  var empty = 0;
  var float_h = 0;

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
    //TODO: debug
    //fly_degree = 0;
    if(currentNum >= loadNum) {
      var deg = Math.atan(fly_speed * Math.cos(fly_degree * Math.PI / 180) / pos_dist);
      island.rotation.y -= deg;

      pointLight.position.x = -Math.cos(island.rotation.y) * 50;
      pointLight.position.z = Math.sin(island.rotation.y) * 50;
      for (var i = 0; i < line.length; i++) {
        var cosNum = Math.cos(island.rotation.y + 2 * Math.PI * i / line.length);
        var sinNum = Math.sin(island.rotation.y + 2 *Math.PI * i / line.length);
        if (-cosNum * pos_dist < -40 && sinNum * pos_dist < 10 && sinNum * pos_dist > 0 && line[i].length > 0) { //clear the array
          for (var j = 0; j < line[i].length; j++) {
            scene.remove(line[i][j].element);
          }
          line[i].length = 0;
        } else if (-cosNum * pos_dist < -40 && sinNum * pos_dist > -10 && sinNum * pos_dist < 0 && line[i].length == 0) {
          if (empty <= 4) {
            var point = new THREE.Mesh(stonesGeometry, stonesMaterial);
            scene.add(point);
            var tempElem = {
              type: 1,
              element: point
            };
            point.position.y = -10;
            line[i].push(tempElem);
            empty++;
          } else {
            if (maps[current_put_level][current_map_index].length <= current_put_index) {
              empty = 0;
              current_map_index = Math.floor(Math.random() / 0.34); //random
              current_put_index = 0;
              float_h = (Math.random() - 0.5) * 6;
            } else {
              for (var j = 0; j < maps[current_put_level][current_map_index][current_put_index].length; j++) {
                var point;
                var tempElem;
                console.log(maps[current_put_level][current_map_index]);
                if (maps[current_put_level][current_map_index][current_put_index][j].type == 1) {
                  point = new THREE.Mesh(stonesGeometry, stonesMaterial);
                  scene.add(point);
                  tempElem = {
                    type: 1,
                    element: point
                  };
                } else if (maps[current_put_level][current_map_index][current_put_index][j].type == 2) {
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
                point.position.y = maps[current_put_level][current_map_index][current_put_index][j].h + float_h;
                line[i].push(tempElem);
              }
              current_put_index++;
            }
          }
        }
        for (var j = 0; j < line[i].length; j++) { //碰撞检测
          if (line[i][j].element.position.x > 48 && line[i][j].element.position.z > -2
            && line[i][j].element.position.z < 2
              && ((line[i][j].type == 1 && Math.abs(line[i][j].element.position.y - plane.position.y) < 1.5)
              || (line[i][j].type == 2 && Math.abs(line[i][j].element.position.y - plane.position.y) < 1)
              || (line[i][j].type == 3 && Math.abs(line[i][j].element.position.y - plane.position.y) < 1))) {
              scene.remove(line[i][j].element);
              line[i].splice(j, 1);
          } else {
            line[i][j].element.position.x = -cosNum * pos_dist;
            line[i][j].element.position.z = sinNum * pos_dist;
            line[i][j].element.rotation.y = (island.rotation.y + 2 * Math.PI * i / line.length + Math.PI);
          }
        }
      }
      plane.position.y += Math.sin(fly_degree * Math.PI / 180) * fly_speed;
      if (plane.position.y <= 0) {
        plane.position.y = 0;
      }

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
    plane_fly();
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
