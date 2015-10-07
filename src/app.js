import socket from "socket";
import Stroke from "stroke";
import {Observable} from "rx";
import {invoke} from "lodash";
const canvas = document.getElementById("draw-canvas");
const context = canvas.getContext("2d");

let currentStroke = null
const strokes = [];

function getMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

const logger = (m) => () => console.log(m);
const brushDown = Observable.fromEvent(canvas, "mousedown").map(getMousePos);
const brushUp = Observable.fromEvent(canvas, "mouseup").map(getMousePos);
const brushMove = Observable.fromEvent(canvas, "mousemove").map(getMousePos);

const isDown = Observable.merge(brushDown.map(() => true), brushUp.map(() => false));
const brushDrag = Observable.combineLatest(isDown, brushMove, (isDown, position) => {
  return {isDown, position};
})
  .filter(({isDown}) => isDown)
  .map(({position}) => position);

brushDown.subscribe((p) => {
  currentStroke = new Stroke();
  currentStroke.moveTo(p);
});

brushDrag.subscribe((p) => {
  currentStroke.moveTo(p);
});

brushUp.subscribe((p) => {
  currentStroke.moveTo(p);
  strokes.push(currentStroke);
  socket.emit("stroke", currentStroke);
  currentStroke = null;
});

socket.on("stroke", (stroke) => strokes.push(new Stroke(stroke)));
socket.on("strokes", (newStrokes) => {
  newStrokes = newStrokes.map((stroke) => new Stroke(stroke));
  strokes.push(...newStrokes);
});

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  invoke(strokes, "draw", context);
  if(currentStroke) {
    currentStroke.draw(context);
  }
  requestAnimationFrame(draw);
}

draw();
