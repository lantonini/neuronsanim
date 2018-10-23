var Graph = require('graph-data-structure')
var config = require('./config.json')

PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.HIGH

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

function drawEdges(element, app) {
  var graphCoord = getGraphNodesCoord(element);
  var graphEdges = getGraphEdges(element);
  var graphics = new PIXI.Graphics();

  graphics.lineStyle(1, 0x000000);
  graphEdges.forEach((link) => {
    let src = graphCoord[link["source"]];
    let target = graphCoord[link["target"]];
    graphics.moveTo(src.x, src.y);
    graphics.lineTo(target.x, target.y);
  });
  app.stage.addChild(graphics);
}

/*
** Generate texture.
*/

function nodeCanvasTexture(size = 5) {
  var g = new PIXI.Graphics()

  g.boundsPadding = size * 2;
  g.beginFill(0x000000, 1);
  g.drawCircle(0, 0, size);
  g.endFill();

  return g.generateCanvasTexture();
}

/*
** Add pulse glow to given node edges.
*/

function nodePulse(node, app) {
  // Create a ring filter mask.
  // Add filter starting from node position.
  console.log(node);
}

/*
** Draw graph nodes.
*/

function drawNodes(element, app) {
  var elementGraph = Graph();
  var graphConf = getGraphConf(element);
  var graphCoord = graphConf["nodeCoordinates"];
  var glowFilter = new PIXI.filters.GlowFilter(7, 4, 2, 0xFFA500, 1);
  var nodesIndex = [];

  // Deserialize graph structure from configuration.
  let texture = nodeCanvasTexture();
  elementGraph.deserialize(graphConf.graph);
  elementGraph.nodes().forEach((id) => {
    let n = graphCoord[id]
    var nodeSprite = new PIXI.Sprite(texture)

    nodeSprite.position.x = n.x
    nodeSprite.position.y = n.y
    nodeSprite.anchor.x = 0.5
    nodeSprite.anchor.y = 0.5
    nodeSprite.filters = [glowFilter];
    app.stage.addChild(nodeSprite);
    nodesIndex.push(app.stage.getChildIndex(nodeSprite));
  });

  var count = 0;
  app.ticker.add(function() {
    // distance € [5;8]
    glowFilter.distance = 6.5 + Math.sin(Math.PI * count) * 1.5;
    // Add π per 4 seconds
    count += 1/240;
  });

  return nodesIndex;
}

/*
** Add a positioning tool to get mouse coordinates.
*/

/*
** Draw background.
*/

function drawBg(app, bg) {
  var bgContainer = new PIXI.Container();
  var bg = new PIXI.Sprite.fromImage(bg);
  var filter = new PIXI.filters.ColorMatrixFilter();

  bg.anchor.set(0.5);
  bg.x = app.screen.width / 2;
  bg.y = app.screen.height / 2;
  bgContainer.addChild(bg);
  bgContainer.filters = [filter];
  filter.desaturate();
  app.stage.addChild(bgContainer);
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

  drawBg(app, graphConf["image"]);
  drawEdges(element, app);
  let nodesIndex = drawNodes(element, app);
  let pulsingNode = app.stage.getChildAt(nodesIndex[0]);
  nodePulse(pulsingNode, app);

  document.body.appendChild(app.view);
}

/*
** Start neuronsanim.
*/

export function start() {
  var imgs = getNeuronsanimElements();

  imgs.forEach(initNeuronsanimElementsView);
}

start()
