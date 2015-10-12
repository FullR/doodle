import socket from "socket";
import Stroke from "stroke";
import {Observable} from "rx";
import {invoke} from "lodash";
import {getMousePos, prop, fromEvent, getWindowSize} from "util";

const logger = (m) => () => console.log(m);
const canvas = document.getElementById("draw-canvas");
const context = canvas.getContext("2d");
const getCanvasMousePos = (event) => getMousePos(canvas, event);
const win = getWindowSize();
canvas.width = win.width;
canvas.height = win.height;


let currentStroke = null
const strokes = [];

const brushDown = fromEvent(canvas, "mousedown").map(getCanvasMousePos);
const brushUp = fromEvent(canvas, "mouseup").map(getCanvasMousePos);
const brushMove = fromEvent(canvas, "mousemove").map(getCanvasMousePos);

const isDown = Observable.merge(
  brushDown.map(() => true), 
  brushUp.map(() => false)
);

const brushDrag = Observable.combineLatest(isDown, brushMove, (isDown, position) => {
  return {isDown, position};
})
.filter(prop("isDown"))
.map(prop("position"));

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
