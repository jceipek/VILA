import {Algorithm, Frame} from './data';
import Scope from './lang/scope';
var Parser = require('./lang/parser');
import evaluateASTTree from './lang/evaluator';
import S from './lang/symbolTypes';
var M = require("mori"); // Couldn't figure out how to convert to ECMAScript6

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
    var frame = new Frame();
    frame.inputScope = Scope.makeScope();
    var alg = new Algorithm(frame);
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
    frame.inputScope = this.newScopeFromScopeAndFrame(step.inputScope, step);
    return frame;
  }
, getStepAfter: function (step) {
    return step.nextStep;
  }
, getLastStepInChain: function (step) {
    var curr = step;
    while (curr.nextStep !== null) {
      curr = curr.nextStep;
    }
    return curr;
  }
, getStepCount: function(firstStep) {
    var curr = firstStep;
    var count = 0;
    while (curr.nextStep !== null) {
      curr = curr.nextStep;
      count++;
    }
    return count+1;
}
, getNthStep: function(firstStep, n){
    var curr = firstStep;
    var count = 0;
    while (curr !== null) {
      if (count === n){
        return curr;
      }
      curr = curr.nextStep;
      count++;
    }
    throw new Error("Trying to get " + n + " step but there were only " + count + " steps");
}
, getTransformationCodeFromStep: function (step) {
    if (!(step instanceof Frame)) {
      throw new Error("Trying to get transformation code for non-frame!");
    }
    return step.transformationCode;
  }
, setTransformationCodeForStep: function (step, value) {
    if (!(step instanceof Frame)) {
      throw new Error("Trying to set transformation code for non-frame!");
    }
    step.transformationCode = value;
  }
, getInputScopeForStep: function (step, scope) {
    return step.inputScope;
  }
, getOutputScopeForStep: function (step, scope) {
    return step.outputScope;
  }
, setOutputScopeForStep: function (step, scope) {
    step.outputScope = scope;
  }
, newScopeFromScopeAndFrame: function (scope, frame) {
    var newScope = scope;
    try {
      var parse = Parser.parse(frame.transformationCode);
      var result = evaluateASTTree(parse, scope);
      if (result.status === 'ASSIGNMENT') {
        newScope = Scope.mapSymbolToValue(scope, frame, M.get(result.symbol, 'name'), result.value);
      }
    } catch (e) {
      console.log(e);
    }
    return newScope;
  }
}
