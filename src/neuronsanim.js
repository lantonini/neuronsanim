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

function drawEdges(element, app) {
  var graphCoord = getGraphNodesCoord(element);
  var graphEdges = getGraphEdges(element);
  var graphics = new PIXI.Graphics();

  graphics.lineStyle(2, 0xFFFFFF, 0.75);
  graphEdges.forEach((link) => {
    let src = graphCoord[link["source"]];
    let target = graphCoord[link["target"]];
    graphics.moveTo(src.x, src.y);
    graphics.lineTo(target.x, target.y);
  });
  app.stage.addChild(graphics);
}

/*
** Draw pulsing edges.
*/

function drawPulsingEdges(node, element, app) {
  var graphCoord = getGraphNodesCoord(element);
  var graphEdges = getGraphEdges(element);
  var graphics = new PIXI.Graphics();
  var pulseFilter = new PIXI.filters.GlowFilter(2, 4, 2, 0xFFFFFF, 1);

  graphics.lineStyle(2, 0xFFFFFF);
  graphEdges.forEach((link) => {
    let src = graphCoord[link["source"]];
    let target = graphCoord[link["target"]];
    graphics.moveTo(src.x, src.y);
    graphics.lineTo(target.x, target.y);
  });

  // Create container for pulsing animation.
  var pulsingEdgesContainer = new PIXI.Container();
  pulsingEdgesContainer.addChild(graphics);
  app.stage.addChild(pulsingEdgesContainer);

  // // Create mask for pulsing animation.
  // var renderTexture = PIXI.RenderTexture.create(app.screen.width,
  //                                               app.screen.height);
  // var renderTextureSprite = new PIXI.Sprite(renderTexture);
  // app.stage.addChild(renderTextureSprite);
  //
  // // Mask the pulsing animation container with renderTextureSprite.
  // pulsingEdgesContainer.mask = renderTextureSprite;

  var brush = new PIXI.Graphics();
  pulsingEdgesContainer.mask = brush;

  var radius = 0;
  var count = 0;
  app.ticker.add(function() {
    // Increase/Decrease mask radius.
    radius = 1000 * (1 + Math.sin(Math.PI * count));
    count += 1/120;

    brush.clear();
    brush.beginFill();
    brush.drawCircle(node.position.x, node.position.y, radius);
    brush.endFill();
    // app.renderer.render(brush, renderTexture, false, null, false);
  });
}

/*
** Generate texture.
*/

function nodeCanvasTexture(size = 2) {
  var g = new PIXI.Graphics()

  g.boundsPadding = 10;
  g.beginFill(0xFFFFFF, 1);
  g.drawCircle(0, 0, size);
  g.endFill();

  return g.generateCanvasTexture();
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
    glowFilter.distance = 7 + Math.sin(Math.PI * count) * 2;
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
    width: element.getAttribute("width"),
    height: element.getAttribute("height"),
    antialias: true,
    transparent: true
  });

  drawBg(app, graphConf["image"]);
  drawEdges(element, app);

  let nodesIndex = drawNodes(element, app);
  let pulsingNode = app.stage.getChildAt(nodesIndex[0]);
  drawPulsingEdges(pulsingNode, element, app);

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
