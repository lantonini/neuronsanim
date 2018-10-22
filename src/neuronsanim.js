var Graph = require('graph-data-structure')
var config = require('./config.json')

/*
** Returns an array of all DOM neuronsanim elements.
*/

function getNeuronsanimElements() {
  return document.querySelectorAll('neuronsanim');
}

/*
** Set neuronsanim effects on image.
*/

function initNeuronsanimElementsEffects(element) {
  var elementGraph = Graph();
  var graphName = element.getAttribute("name");
  var graphConf = config[graphName];
  var graphCoord = graphConf["nodeCoordinates"];
  var graphEdges = graphConf["graph"]["links"];

  // Deserialize graph structure from configuration
  elementGraph.deserialize(graphConf.graph);

  // Initialize graph viewport.
  var app = new PIXI.Application({
    "width": element.getAttribute("width"),
    "height": element.getAttribute("height"),
    "antialias": true
  });
  document.body.appendChild(app.view);

  // Add background
  var bg = PIXI.Sprite.fromImage(graphConf["image"]);
  bg.anchor.set(0.5);
  bg.x = app.screen.width / 2;
  bg.y = app.screen.height / 2;
  app.stage.addChild(bg);

  let graphics = new PIXI.Graphics();

  // Draw edges of graph.
  graphics.lineStyle(2);
  graphEdges.forEach((link) => {
    let src = graphCoord[link["source"]];
    let target = graphCoord[link["target"]];
    graphics.moveTo(src.x, src.y);
    graphics.lineTo(target.x, target.y);
  });

  // Draw nodes of graph.
  elementGraph.nodes().forEach((id) => {
    let n = graphCoord[id]

    graphics.beginFill();
    graphics.drawCircle(n.x, n.y, 10);
    graphics.endFill();
  });

  app.stage.addChild(graphics);
}

/*
** Start neuronsanim.
*/

export function start() {
  var imgs = getNeuronsanimElements();

  imgs.forEach(initNeuronsanimElementsEffects);
}

start()
