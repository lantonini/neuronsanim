var Graph = require('graph-data-structure')

// Load configuration
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

  // Create HTML5 canvas
  var canvas = document.createElement("canvas")
  var ctx = canvas.getContext("2d");

  // Add a canvas of the same dimensions of element
  canvas.setAttribute("width", "640")
  canvas.setAttribute("height", "480")
  document.body.appendChild(canvas)

  if (!ctx) {
    console.log("Ctx context not accessible.")
    return;
  }

  let image = new Image();
  image.src = graphConf["image"];
  image.addEventListener("load", () => {
    ctx.drawImage(image, 0, 0);
  });
}

/*
** Start neuronsanim.
*/

export function start() {
  var imgs = getNeuronsanimElements();

  imgs.forEach(initNeuronsanimElementsEffects);
}

start()
