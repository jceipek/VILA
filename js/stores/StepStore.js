'use strict';
var Reflux = require('reflux');
import StepActions from 'actions/StepActions';

// // some variables and helpers for our fake database stuff
// var todoCounter = 0,
//     localStorageKey = "todos";

// function getItemByKey(list,itemKey){
//     return _.find(list, function(item) {
//         return item.key === itemKey;
//     });
// }

var _steps = [];

export default Reflux.createStore({
  listenables: StepActions
, onAddStep: function () {
    console.log('ADD STEP FIRED');
    _steps.push(Math.floor(Math.random()*10));
    this.trigger(_steps);
  }
, onUpdateStep: function () {
    console.log('UPDATE STEP FIRED');
  }
, onRemoveStep: function () {
    console.log('REMOVE STEP FIRED');
  }
, onGetSteps: function () {
    console.log('GET STEPS');
    this.trigger(_steps);
  }
});