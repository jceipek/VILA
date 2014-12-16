import {Algorithm, Step} from './data'


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
    var alg = new Algorithm(new Step());
    applicationState.algorithms.push(alg);
    is_ready = true;
  }
, isReady: function () {
    return is_ready;
  }
, getSteps: function () { // Note: this will be superseded once multiple algs can coexist
    return applicationState.algorithms[0].steps;
  }
}
