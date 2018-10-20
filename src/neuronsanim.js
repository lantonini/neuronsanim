var Graph = require('graph-data-structure')

// Load configuration
var config = require('./config.json')

/*
** Returns an array of selected DOM elements.
*/

function getImgsByAttribute(attrib) {
  return document.querySelectorAll("img[" + attrib + "]");
}

/*
** Returns an array of all DOM elements with neuronsanim attribute.
*/

function getNeuronsanimImgs() {
  return getImgsByAttribute('neuronsanim');
}

/*
** Set neuronsanim effects on image.
*/

function initImageEffects(element) {
  var elementGraph = Graph();
  var graphName = element.getAttribute("name");
  var graphConf = config[graphName];

  // Deserialize graph structure from configuration
  elementGraph.deserialize(graphConf.graph);
  console.log(elementGraph.nodes())
}

/*
** Start neuronsanim.
*/

export function start() {
  var ne = getNeuronsanimImgs();

  ne.forEach(initImageEffects);
}

start()
