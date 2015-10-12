import {Observable} from "rx";

function getMousePos(canvas, {clientX, clientY}) {
  var {left, top} = canvas.getBoundingClientRect();
  return {
    x: clientX - left,
    y: clientY - top
  };
}

function prop(key) {
  return (obj) => obj ? obj[key] : null;
}

function fromEvent(el, eventId) {
  return Observable.create((observer) => {
    const onEvent = (event) => observer.onNext(event);
    el.addEventListener(eventId, onEvent);
    return () => el.removeEventListener(eventId, onEvent);
  });
}

function getWindowSize() {
  const docElement = document.documentElement;
  const body = document.getElementsByTagName('body')[0];
  const width = window.innerWidth || docElement.clientWidth || body.clientWidth;
  const height = window.innerHeight|| docElement.clientHeight|| body.clientHeight;
  return {width, height};
}

export {getMousePos, prop, fromEvent, getWindowSize};
