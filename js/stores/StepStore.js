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
var _selectedStep = null;

export default Reflux.createStore({
  listenables: StepActions
, onAddStep: function () {
    console.log('ADD STEP FIRED');
    _steps.push(Math.floor(Math.random()*10));
    this.updateSteps(_steps);
  }
, onUpdateStep: function () {
    console.log('UPDATE STEP FIRED');
  }
, onRemoveStep: function () {
    console.log('REMOVE STEP FIRED');
  }
  // called whenever we change a list. normally this would mean a database API call
, updateSteps: function (steps) {
    // if we used a real database, we would likely do the below in a callback
    _steps = steps;
    this.trigger(_steps); // sends the updated list to all listening components
  }
  // this will be called by all listening components
  // as they register their listeners
, getDefaultData: function() {
    return _steps;
  }
});