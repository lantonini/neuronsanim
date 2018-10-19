/*
** Returns an array of selected DOM elements.
*/

function getElementsByAttribute(attrib) {
  return document.querySelectorAll("[" + attrib + "]");
}

/*
** Returns an array of all DOM elements with neuronsanim attribute.
*/

function getNeuronsanimElements() {
  return getElementsByAttribute('neuronsanim');
}

/*
** Start neuronsanim.
*/

function neuronsanim() {
  var ne = getNeuronsanimElements();
}

neuronsanim();
