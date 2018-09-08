import { mix, easeInQuad } from "./util";
import { HEAD_RATIO } from "./components/head";
import { sum, tail, zipWith } from "lodash";
import { COLUMN_COUNT } from "./store";

// This calculates the layout of the pieces of Machine
// and RatingSquare. This is done JavaScript and in
// one central location, since that makes it easier to
// make complex transitions between different kinds of
// layouts (the morph animation).

export interface LayoutInputs {
  winW: number;
  winH: number;
  t: number;
}

export interface LayoutOutputs extends LayoutInputs {
  square: Rect;
  machine: Rect;
  current: Rect;
  heads: Rect[];
  platforms: Rect[];
  midLayer: (headI: number, move: boolean) => Rect;
  machineOpacity: number;
  squareOpacity: number;
}

const consts = {
  squarePadPx: 25,
  squareYPx: -50,
  machineRatio: 0.45,
  machinePaddingHOuter: 0.05,
  machinePaddingHInner: 0.04,
  headW: 0.17,
  headToTop: 0.1,
  platformH: 0.1,
  platformToBottom: 0.15,
  horizontalMorphSpeedup: 0.3,
};

class Rect {
  constructor(
    public w: number,
    public h: number,
    public x: number,
    public y: number,
  ) {
    this.w = w;
    this.h = h;
    this.x = x;
    this.y = y;
  }

  mix(other: Rect, t: number): Rect {
    // tslint:disable-next-line:no-any
    return new (Rect as any)(
      ...["w", "h", "x", "y"].map(k => mix(this[k], other[k], t)),
    );
  }
}

function layoutHeads(target: Rect, reference: Rect): Rect[] {
  const op = consts.machinePaddingHOuter * reference.w;
  const ip = consts.machinePaddingHInner * reference.w;
  const flexPad = target.w / 2 - op - ip;
  const headY = target.y + consts.headToTop * reference.h;
  const headW = consts.headW * reference.w;
  const headH = headW * HEAD_RATIO;
  let c = 0;
  return [target.x + op, flexPad, 2 * ip, flexPad].map((v, i) => {
    c += v;
    const x = i % 2 === 0 ? c : c - headW;
    return new Rect(headW, headH, x, headY);
  });
}

function layoutPlatforms(target: Rect, reference: Rect): Rect[] {
  const op = consts.machinePaddingHOuter * reference.w;
  const ip = consts.machinePaddingHInner * reference.w;
  const ph = consts.platformH * reference.h;
  const pw = reference.w / 2 - op - ip;
  const py = target.y + target.h - consts.platformToBottom * reference.h - ph;
  return [op, target.w - pw - op].map(v => {
    return new Rect(pw, ph, target.x + v, py);
  });
}

function layoutMidLayer(
  current: Rect,
  machine: Rect,
): (headI: number, move: boolean) => Rect {
  const headsStill = layoutHeads(machine, machine);
  const refHeadStill = headsStill[0];
  const platformsStill = layoutPlatforms(machine, machine);
  const refPlatformStill = platformsStill[0];
  const platformsCurrent = layoutPlatforms(current, machine);
  const refPlatformCurrent = platformsCurrent[0];

  const tempStartY = refHeadStill.y + refHeadStill.h;
  const tempEndY = refPlatformStill.y;
  const h = tempEndY - tempStartY;
  const y = refPlatformCurrent.y - h;

  const headCenters = headsStill.map(e => e.x + e.w / 2);
  const headDeltas = zipWith(tail(headCenters), headCenters, (a, b) => a - b);
  return (_headI: number, move: boolean) => {
    const headI = _headI - 1; // use zero based head indices, unlike rest of app
    const roundedI = Math.floor(Math.max(0, Math.min(COLUMN_COUNT - 2, headI)));
    const progress = headI - roundedI;
    const start = headCenters[roundedI];
    const delta = headDeltas[roundedI];
    let x = mix(start, start + delta, progress) + machine.x;
    const pi = +(headI + 0.5 > COLUMN_COUNT / 2);
    if (move) {
      x += platformsCurrent[pi].x - platformsStill[pi].x;
    }
    return new Rect(machine.w, h, x, y);
  };
}

function spaceEvenlyX(rects: Rect[]): Rect[] {
  const xMin = Math.min(...rects.map(r => r.x));
  const xMax = Math.max(...rects.map(r => r.x + r.w));
  const wTot = xMax - xMin;
  const wUsed = sum(rects.map(r => r.w));
  const space = (wTot - wUsed) / (rects.length - 1);
  let c = xMin;
  return rects.map(r => {
    const out = new Rect(r.w, r.h, c, r.y);
    c += r.w + space;
    return out;
  });
}

export function layout(inputs: LayoutInputs): LayoutOutputs {
  const d = inputs.winW - 2 * consts.squarePadPx;
  const square = new Rect(d, d, consts.squarePadPx, consts.squareYPx);
  const machine = new Rect(
    inputs.winW,
    inputs.winW * consts.machineRatio,
    0,
    0,
  );
  const _h = consts.horizontalMorphSpeedup;
  const _a = machine.mix(square, inputs.t);
  const _b = machine.mix(square, Math.max(0, (inputs.t - _h) / (1 - _h)));
  const current = new Rect(_b.w, _a.h, _b.x, _a.y);
  const headsMachine = layoutHeads(machine, machine);
  const headsSquare = spaceEvenlyX(layoutHeads(square, machine));
  const heads = zipWith(headsMachine, headsSquare, (a, b) =>
    a.mix(b, inputs.t),
  );
  const platforms = layoutPlatforms(current, machine);
  return {
    ...inputs,
    square,
    machine,
    current,
    heads,
    platforms,
    machineOpacity: Math.max(0, Math.min(1, easeInQuad(1 - inputs.t))),
    squareOpacity: Math.max(0, Math.min(1, easeInQuad(inputs.t))),
    midLayer: layoutMidLayer(current, machine),
  };
}
