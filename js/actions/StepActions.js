var Reflux = require('reflux');

/*
 * Actions are used within Reflux by the components to tell the stores what to do.
 * @type {String[]}
 */

export default Reflux.createActions(
[
  'addStep'
, 'updateStep'
, 'removeStep'
]);