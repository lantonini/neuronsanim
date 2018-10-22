var Graph = require('graph-data-structure')
var config = require('./config.json')

/*
** Returns an array of all DOM neuronsanim elements.
*/

function getNeuronsanimElements() {
  return document.querySelectorAll('neuronsanim');
}

/*
** Get graph name.
*/

function getGraphName(element) {
  return element.getAttribute("name");
}

/*
** Get graph conf.
*/

function getGraphConf(element) {
  let name = getGraphName(element);
  return config[name];
}

/*
** Get graph nodes coordinates.
*/

function getGraphNodesCoord(element) {
  let conf = getGraphConf(element);
  return conf["nodeCoordinates"];
}

/*
** Get graph edges.
*/

function getGraphEdges(element) {
  let conf = getGraphConf(element);
  return conf["graph"]["links"];
}

/*
** Draw graph edges.
*/

function drawEdges(element, graphics) {
  var graphCoord = getGraphNodesCoord(element);
  var graphEdges = getGraphEdges(element);

  graphics.lineStyle(2);
  graphEdges.forEach((link) => {
    let src = graphCoord[link["source"]];
    let target = graphCoord[link["target"]];
    graphics.moveTo(src.x, src.y);
    graphics.lineTo(target.x, target.y);
  });
}

/*
** Draw graph nodes.
*/

function drawNodes(element, graphics) {
  var elementGraph = Graph();
  var graphConf = getGraphConf(element);
  var graphCoord = graphConf["nodeCoordinates"];

  // Deserialize graph structure from configuration
  elementGraph.deserialize(graphConf.graph);

  elementGraph.nodes().forEach((id) => {
    let n = graphCoord[id]

    graphics.beginFill();
    graphics.drawCircle(n.x, n.y, 10);
    graphics.endFill();
  });
}

/*
** Set neuronsanim effects on image.
*/

function initNeuronsanimElementsView(element) {
  var graphName = element.getAttribute("name");
  var graphConf = config[graphName];
  var graphCoord = graphConf["nodeCoordinates"];
  var graphEdges = graphConf["graph"]["links"];

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

  var graphics = new PIXI.Graphics();
  drawEdges(element, graphics);
  drawNodes(element, graphics);
  app.stage.addChild(graphics);
}

/*
** Start neuronsanim.
*/

export function start() {
  var imgs = getNeuronsanimElements();

  imgs.forEach(initNeuronsanimElementsView);
}

start()
