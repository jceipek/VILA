import {Algorithm, Frame} from './data'


// All state of the application should live in here
// so we can easily serialize and desirialize it later
// Eventually, TODO: store it via the browser's data store
// to prevent work from getting lost
// Much later, TODO: save it in the cloud?
var applicationState = {
  algorithms: []
};

var is_ready = false;

export default {
  setup: function () {
    var alg = new Algorithm(new Frame());
    applicationState.algorithms.push(alg);
    is_ready = true;
  }
, isReady: function () {
    return is_ready;
  }
, getSteps: function () { // Note: this will be superseded once multiple algs can coexist
    return applicationState.algorithms[0].steps;
  }
, createNewFrameAfterStep: function (step) {
    var frame = new Frame();
    step.nextStep = frame;
    frame.lastStep = this;
    return frame;
  }
, getStepAfter: function (step) {
    return step.nextStep;
  }
, getLastStepInChain: function (step) {
    var curr = step;
    while (curr.nextStep != null) {
      curr = curr.nextStep;
    }
    return curr;
  }
, getTransfomationCodeFromStep: function (step) {
    if (!(step instanceof Frame)) {
      throw new Error("Trying to get transformation code for non-frame!");
    }
    return step.transformationCode;
  }
, setTransfomationCodeForStep: function (step, value) {
    if (!(step instanceof Frame)) {
      throw new Error("Trying to set transformation code for non-frame!");
    }
    step.transformationCode = value;
  }
}
