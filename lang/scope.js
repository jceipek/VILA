var M = require("mori"); // Couldn't figure out how to convert to ECMAScript6

// NOTE: we currently store the full history of every value in memory
// It may be prudent to use some form of compression or simplification
// on the history if we start having memory issues.
export default {
  makeSymbolMap: function (value, originStep) {
    return M.hash_map(
      'value', value
    , 'origin', originStep);
  }
, makeScope: function (params) {
    params = params?params:{};
    var parentScope = params.parentScope?params.parentScope:null;
    var contents;
    if (params.lastScope) {
      M.get(params.lastScope, 'contents');
    } else {
      contents = M.hash_map();
    }

    return M.hash_map(
      'parentScope', parentScope
    , 'contents', contents);
  }
, scopeOfSymbol: function (scope, symbol) {
    if (M.has_key(M.get(scope, 'contents'), symbol)) {
      return 0; // current scope
    }
    var parentScope = M.get(scope, 'parentScope');
    if (parentScope !== null) {
      return 1+this.scopeOfSymbol(parentScope, symbol); // scope n
    } else {
      return null; // not available in the scope hierarchy
    }
  }
, mapSymbolToValue: function (sourceScope, originStep, symbol, value) {
    var contents = M.get(sourceScope, 'contents');
    var map = this.makeSymbolMap(value, originStep);
    contents = M.conj(contents, M.vector(symbol, map));
    return M.conj(sourceScope, M.vector('contents', contents));
  }
, lookupSymbolMap: function (scope, symbol) {
    var contents = M.get(scope, 'contents');
    var res = M.get(contents, symbol, null);
    if (res === null) {
      var parentScope = M.get(scope, 'parentScope');
      if (parentScope !== null) {
        this.lookupSymbolMap (parentScope, symbol);
      } else {
        throw new Error("Symbol " + symbol + " doesn't exist!");
      }
    } else {
      return res;
    }
  }
, lookupSymbolValue: function (scope, symbol) {
    var map = this.lookupSymbolMap(scope, symbol);
    return M.get(map, 'value');
  }
, lookupSymbolHistory: function (scope, symbol) {
    var history = [];
    var currScope = scope;
    while (scope !== null) {
      var contents = M.get(currScope, 'contents');
      var res = M.get(contents, symbol, null);
      if (res !== null) {
        history.push(res);
      }
      currScope = M.get(currScope, 'parentScope');
    }
    return history;
  }
, jsOfScope: function (scope) {
    return M.clj_to_js(scope);
  }
}