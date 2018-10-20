var PIXI = require("pixi.js")
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

  // Deserialize graph structure from configuration
  elementGraph.deserialize(graphConf.graph);

  var app = new PIXI.Application(800, 600);
  document.body.appendChild(app.view);

  // create a new Sprite from an image path
  var bunny = PIXI.Sprite.fromImage(graphConf["image"]);

  // center the sprite's anchor point
  bunny.anchor.set(0.5);
  // move the sprite to the center of the screen
  bunny.x = app.screen.width / 2;
  bunny.y = app.screen.height / 2;

  app.stage.addChild(bunny);
}

/*
** Start neuronsanim.
*/

export function start() {
  var imgs = getNeuronsanimElements();

  imgs.forEach(initNeuronsanimElementsEffects);
}

start()
