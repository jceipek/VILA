'use strict';
var Reflux = require('reflux');
import StepActions from 'actions/StepActions';
import Scope from 'lang/scope';
import evaluateASTTree from 'lang/evaluator';
var Parser = require('lang/parser');
var M = require("mori"); // Couldn't figure out how to convert to ECMAScript6

// TODO: Think about a different way to construct ids?
var _nextId = 0;
var _getNewId = function () {
  return (_nextId++); // Add after returning old value
};

var _makeFrame = function (inputScope, codeStr, status) {
  return {
    type: 'FRAME'
  , id: _getNewId()
  , inputScope: inputScope
  , code: codeStr
  , status: status
  };
};

var _steps = [_makeFrame(Scope.makeScope(),"1+2",'EXPRESSION')];

// TODO: optimize here when things slow down (this is called every time code changes)
var _findFrameIndex = function (id) {
  for (var i = 0; i < _steps.length; i++) {
    if (_steps[i].id === id) {
      return i;
    }
  }
  throw new Error("CAN'T FIND FRAME WITH INDEX: "+id);
};

// XXX: TODO: Clean this up; it's pretty confusing
var _outputScopeFromFrameWithResponse = function (frame) {
  var newScope = frame.inputScope;
  if (frame.code === "") {
    return {status:'EMPTY', scope: newScope};
  }
  var result;
  try {
    var parse = Parser.parse(frame.code);
    result = evaluateASTTree(parse, frame.inputScope);
    if (result.status === 'ASSIGNMENT') {
      newScope = Scope.mapSymbolToValue(frame.inputScope, frame, M.get(result.symbol, 'name'), result.value);
    }
  } catch (e) {
    return {status:'ERROR', scope:frame.inputScope};
  }

  if (result.status === 'ASSIGNMENT') {
    return {status:'ASSIGNMENT', scope:newScope};
  } else if (result.status === 'ERROR') {
    return {status:'ERROR', scope:frame.inputScope}; // Lexing error
  } else {
    return {status:'EXPRESSION', scope:newScope};
  }
};

export default Reflux.createStore({
  listenables: StepActions
, onAddStep: function (lastId) {
    console.log('ADD STEP FIRED: '+lastId);
    if (lastId === null) {
      _steps.push(_makeFrame(Scope.makeScope(),""));
    } else {
      var lastIndex = _findFrameIndex(lastId);
      var outputScopeResponse = _outputScopeFromFrameWithResponse(_steps[lastIndex])
      _steps[lastIndex].status = outputScopeResponse.status;
      var outputScope = outputScopeResponse.scope;
      var newFrame = _makeFrame(outputScope,"");
      _steps.splice(lastIndex+1
                   , 0 // Remove 0 items.
                   , newFrame);
    }
    this.updateSteps(_steps);
  }
, onUpdateStep: function (id,code) {
    console.log('UPDATE STEP FIRED');
    var index = _findFrameIndex(id);
    _steps[index].code = code;
    if (index === _steps.length - 1) {
      var outputScopeResponse = _outputScopeFromFrameWithResponse(_steps[index]);
      _steps[index].status = outputScopeResponse.status;
    }
    while (index+1 < _steps.length) {
      var outputScopeResponse = _outputScopeFromFrameWithResponse(_steps[index]);
      var outputScope = outputScopeResponse.scope;
      _steps[index].status = outputScopeResponse.status;
      _steps[index+1].inputScope = outputScope;
      index++;
    }
    this.updateSteps(_steps);
  }
, onRemoveStep: function () {
    console.log('REMOVE STEP FIRED');
  }
  // called whenever we change a list.
  // Eventually this will use a database API call
, updateSteps: function (steps) {
    // If we used a real database, we would likely do the following in a callback
    _steps = steps;
    this.trigger(_steps); // Sends the updated steps to all listening components
  }
  // This should be called by all listening components
  // as they register their listeners
, getInitialState: function() {
    console.log("DEFAULT DATA");
    return _steps;
  }
});