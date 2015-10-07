import {isNumber} from "lodash";

export default class Stroke {
  constructor({points=[]}={}) {
    this.points = points;
  }

  moveTo(point) {
    if(point && isNumber(point.x) && isNumber(point.y)) {
      this.points.push(point);
    }
    return this;
  }

  draw(context) {
    const {points} = this;
    points.forEach(({x, y}, i) => {
      if(i === 0) {
        context.beginPath();
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    });
    context.stroke();
  }
}
