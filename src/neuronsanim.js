import { Graph } from 'graph-data-structure'

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

}

/*
** Start neuronsanim.
*/

export function start() {
  var ne = getNeuronsanimImgs();

  ne.forEach(initImageEffects);
}
