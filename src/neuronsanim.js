var Graph = require('graph-data-structure')
// var config = require('./default_config.json')

/*
** TODO : Responsiveness
** TODO : First pictures
** TODO : Documentation for Greg
** TODO : Second glow
*/

function loadJSON(jsonFile, callback) {
  var xobj = new XMLHttpRequest();
      xobj.overrideMimeType("application/json");

  xobj.open('GET', jsonFile, true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      var actual_JSON = JSON.parse(xobj.responseText);
      callback(actual_JSON);
    }
  };
  xobj.send(null);
}

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

var edgesIndex = [];

function drawEdges(element, app) {
  var graphCoord = getGraphNodesCoord(element);
  var graphEdges = getGraphEdges(element);
  var graphics = new PIXI.Graphics();

  graphics.lineStyle(1, 0xFFFFFF, 1);
  graphEdges.forEach((link) => {
    let src = graphCoord[link["source"]];
    let target = graphCoord[link["target"]];
    graphics.moveTo(src.x, src.y);
    graphics.lineTo(target.x, target.y);
  });
  addEdge(graphics, app);
}

/*
** Add graph edges.
*/

function addEdge(edge, app) {
  app.stage.addChild(edge);
  edgesIndex.push(app.stage.getChildIndex(edge));
}

/*
** Remove graph edges.
*/

function removeEdge(id) {

}

/*
** Clear graph edges.
*/

function clearEdges() {

}

/*
** Draw pulsing edges.
*/

var pulsingEdgesIndex = [];

function drawPulsingEdges(element, app) {
  var graphCoord = getGraphNodesCoord(element);
  var graphEdges = getGraphEdges(element);
  var graphics = new PIXI.Graphics();
  var pulseFilter = new PIXI.filters.GlowFilter(2, 4, 2, 0xFFFFFF, 1);
  var node = app.stage.getChildAt(nodesIndex[0]);

  graphics.lineStyle(1, 0xFFFFFF, 1);
  graphEdges.forEach((link) => {
    let src = graphCoord[link["source"]];
    let target = graphCoord[link["target"]];
    graphics.moveTo(src.x, src.y);
    graphics.lineTo(target.x, target.y);
  });

  // Create container for pulsing animation.
  var pulsingEdgesContainer = new PIXI.Container();
  pulsingEdgesContainer.addChild(graphics);
  addPulsingEdge(pulsingEdgesContainer, app);

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
    radius = 500 * (1 + Math.sin(Math.PI * count));
    count += 1/60;

    brush.clear();
    brush.beginFill();
    brush.drawCircle(node.position.x, node.position.y, radius);
    brush.endFill();
    // app.renderer.render(brush, renderTexture, false, null, false);
  });
}

/*
** Add graph pulsingEdges.
*/

function addPulsingEdge(pulsingEdge, app) {
  app.stage.addChild(pulsingEdge);
  pulsingEdgesIndex.push(app.stage.getChildIndex(pulsingEdge));
}

/*
** Remove graph pulsingEdges.
*/

function removePulsingEdge(id) {

}

/*
** Clear graph pulsingEdges.
*/

function clearPulsingEdges() {

}
/*
** Generate texture.
*/

var USE_NODES = true;

function nodeCanvasTexture() {
  var g = new PIXI.Graphics()

  if (USE_NODES) {
    g.boundsPadding = 10;
    g.beginFill(0xFFFFFF, 1);
    g.drawCircle(0, 0, 1);
    g.endFill();
  }

  return g.generateCanvasTexture();
}

/*
** Draw graph nodes.
*/

var nodesIndex = [];

function drawNodes(element, app) {
  var elementGraph = Graph();
  var graphConf = getGraphConf(element);
  var graphCoord = graphConf["nodeCoordinates"];
  // var glowFilter = new PIXI.filters.GlowFilter(7, 4, 2, 0xFFA500, 1);

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
    // nodeSprite.filters = [glowFilter];
    addNode(nodeSprite, app)
  });

  // var count = 0;
  // app.ticker.add(function() {
  //   // distance € [5;8]
  //   glowFilter.distance = 7 + Math.sin(Math.PI * count) * 2;
  //   // Add π per 4 seconds
  //   count += 1/240;
  // });
}

/*
** Add graph node.
*/

function addNode(node, app) {
  app.stage.addChild(node);
  nodesIndex.push(app.stage.getChildIndex(node));
}

/*
** Remove graph node and all its edges.
*/

function removeNode(id) {

}

/*
** Clear graph nodes and all edges.
*/

function clearNodes() {

}

/*
** Add a positioning tool to get mouse coordinates.
*/

function interactiveGraphBuilder(app) {
  var NODE_MODE = 0, EDGE_MODE = 1;
  var mode = NODE_MODE;
  var bg = app.stage.getChildAt(bgIndex);

  bg.interactive = true;

  // Node mode: click on stage adds a node to config.json.
  bg.on('click', () => {
    mode = NODE_MODE;
    var mouseposition = app.renderer.plugins.interaction.mouse.global;
    console.log(mode);
    console.log(mouseposition);
  });

  bg.on('rightclick', () => {
    mode = NODE_MODE;
    var mouseposition = app.renderer.plugins.interaction.mouse.global;
    console.log(mode);
  });

  // Edge mode: click on node1 + node 2 adds an edge to config.json.
  nodesIndex.forEach((id) => {
    var node = app.stage.getChildAt(id);
    node.interactive = true;
    node.on('click', () => {
      mode = EDGE_MODE;
      console.log(mode);
    });
  });

  // Interactive GraphBuilder will build a json and log.
  // Adding a node : use addNodes
  // Removing a node : use removeNodes
}

/*
** Draw background.
*/

var bgIndex = null;

function drawBg(bg, app) {
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

  bgIndex = app.stage.getChildIndex(bgContainer);
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
    antialias: true
    // transparent: true
  });

  drawBg(graphConf["image"], app);
  drawNodes(element, app);
  drawEdges(element, app);
  drawPulsingEdges(element, app);
  interactiveGraphBuilder(app);

  document.body.appendChild(app.view);
}

/*
** Start neuronsanim.
*/

var config = null;

export function start(cName = "default_config.json") {
  var imgs = getNeuronsanimElements();

  loadJSON("src/" + cName, (c) => {
    config = c;
    imgs.forEach(initNeuronsanimElementsView);
  })
}

start()
