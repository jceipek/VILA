import S from './symbolTypes';
var M = require("mori"); // Couldn't figure out how to convert to ECMAScript6

var makeAssignment = function (sym, r) {
  return { status: 'ASSIGNMENT', symbol: sym, value: r };
}

var makeResult = function (r) {
  return { status: 'RESULT', res: r };
}

var makeError = function (e, vals, pos) {
  return { status: 'ERROR', message: e, involvedValues: vals, pos: pos };
}

var evaluateAdd = function (a, b, pos, scope) {
  if (M.get(a,'type') === S.T_INT && M.get(b,'type') === S.T_INT) {
    return makeResult(S.makeInt(M.get(a, 'value') + M.get(b,'value'), pos));
  } else if (M.get(a,'type') === S.T_FLOAT && M.get(b,'type') === S.T_FLOAT) {
    return makeResult(S.makeFloat(M.get(a, 'value') + M.get(b,'value'), pos));
  } else {
    return makeError("I don't understand addition on "+M.get(a,'type').toString()+" and "+M.get(b,'type').toString()
                    , [a, b], pos);
  }
};

var evaluateSub = function (a, b, pos, scope) {
  if (M.get(a,'type') === S.T_INT && M.get(b,'type') === S.T_INT) {
    return makeResult(S.makeInt(M.get(a, 'value') - M.get(b,'value'), pos));
  } else if (M.get(a,'type') === S.T_FLOAT && M.get(b,'type') === S.T_FLOAT) {
    return makeResult(S.makeFloat(M.get(a, 'value') - M.get(b,'value'), pos));
  } else {
    return makeError("I don't understand subtraction on "+M.get(a,'type').toString()+" and "+M.get(b,'type').toString()
                    , [a, b], pos);
  }
};

var evaluateMul = function (a, b, pos, scope) {
  if (M.get(a,'type') === S.T_INT && M.get(b,'type') === S.T_INT) {
    return makeResult(S.makeInt(M.get(a, 'value') * M.get(b,'value'), pos));
  } else if (M.get(a,'type') === S.T_FLOAT && M.get(b,'type') === S.T_FLOAT) {
    return makeResult(S.makeFloat(M.get(a, 'value') * M.get(b,'value'), pos));
  } else {
    return makeError("I don't understand multiplication on "+M.get(a,'type').toString()+" and "+M.get(b,'type').toString()
                    , [a, b], pos);
  }
};

var evaluateDiv = function (a, b, pos, scope) {
  var a_type = M.get(a,'type');
  var b_type = M.get(b,'type');
  var a_value = M.get(a, 'value');
  var b_value = M.get(b, 'value');
  if (a_type === S.T_INT && b_type === S.T_INT) {
    var div = a_value / b_value;
    var f = Math.trunc(div); // floor doesn't work correctly for negative numbers
    var res = S.makeInt(f, pos);
    res._couldLosePrecision = true;
    res._didLosePrecision = (f !== div);
    return makeResult(res);
  } else if (a_type === S.T_FLOAT && b_type === S.T_FLOAT) {
    return makeResult(S.makeFloat(a_value / b_value, pos));
  } else {
    return makeError("I don't understand division on "+a_type.toString()+" and "+b_type.toString()
                    , [a, b], pos);
  }
};

var evaluateEq = function (a, b, pos, scope) {
  var a_type = M.get(a,'type');
  var b_type = M.get(b,'type');
  if (a_type !== b_type) {
    return makeResult(S.makeBool(false, pos));
  } else if (a_type === S.T_INT || // Don't need to check b because we know the types match
             a_type === S.T_FLOAT ||
             a_type === S.T_BOOL) {
    return makeResult(S.makeBool(M.get(a, 'value') == M.get(b,'value'), pos));
  } else {
    return makeError("I don't understand equivalence checks on "+a_type.toString()+" and "+b_type.toString()
                    , [a, b], pos);
  }
};

var evaluateNeg = function (node, pos, scope) {
  var node_type = M.get(node,'type');
  var node_value = M.get(node,'value');
  if (node_type === S.T_INT) {
    return makeResult(S.makeInt(-node_value, pos));
  } else if (node_type === S.T_FLOAT) {
    return makeResult(S.makeFloat(-node_value, pos));
  } else {
    return makeError("I don't understand negation on "+node_type.toString()
                    , [node], pos);
  }
};

var evaluateUnaryOperator = function (node, scope) {
  var val = M.get(node,'value');
  var res;
  if (!S.isTerminal(val)) {
    res = evaluateASTTree(val, scope);
    if (res.status === 'ERROR') {
      return res;
    }
    val = res.res;
  }
  var node_pos = M.get(node,'pos');
  var node_type = M.get(node,'type');
  if (node_type === S.E_NEG) {
    res = evaluateNeg(val, node_pos, scope);
  } else {
    return makeError("I don't understand the unary operator "+node_type.toString()
                    , [node], node_pos);
  }
  node._cachedResult = res;
  return res;
}

var evaluateBinaryOperator = function (node, scope) {
  var valA = M.get(node,'valueA');
  var valB = M.get(node,'valueB');
  if (!S.isTerminal(valA)) {
    var resA = evaluateASTTree(valA, scope);
    if (resA.status === 'ERROR') {
      return resA;
    }
    valA = resA.res;
  }
  if (!S.isTerminal(valB)) {
    var resB = evaluateASTTree(valB, scope);
    if (resB.status === 'ERROR') {
      return resB;
    }
    valB = resB.res;
  }

  var res = null;
  var node_pos = M.get(node, 'pos');
  var node_type = M.get(node, 'type');
  if (node_type === S.E_ADD) {
    res = evaluateAdd(valA, valB, node_pos, scope);
  } else if (node_type === S.E_SUB) {
    res = evaluateSub(valA, valB, node_pos, scope);
  } else if (node_type === S.E_MUL) {
    res = evaluateMul(valA, valB, node_pos, scope);
  } else if (node_type === S.E_DIV) {
    res = evaluateDiv(valA, valB, node_pos, scope);
  } else if (node_type === S.E_EQ) {
    res = evaluateEq(valA, valB, node_pos, scope);
  } else {
    return makeError("I don't understand the binary operator "+node_type.toString()
                    , [node], node_pos);
  }
  node._cachedResult = res;
  return res;
}

var evaluateTerminal = function (node, scope) {
  return makeResult(node);
};

var evaluateSymbol = function (node, scope) {
  // TODO: Think about optimizing this if it becomes a bottleneck;
  // it has to walk the scope 2x for the sake of avoiding try/catch
  var node_name = M.get(node,'name');
  var node_pos = M.get(node,'pos');
  if (scope.scopeOfSymbol(node_name) === null) {
    var e = makeError("I can't find "+node_name.toString()+" in my scope or parent scopes :("
                    , [node], node_pos);
    node._cachedResult = e;
    return e;
  }
  var s = scope.lookupSymbolValue(node_name);
  s = M.assoc(s, 'pos', node_pos);
  // pos actually doesn't make much sense for values
  // mapped to symbols in the scope contents.
  // However, when we do a symbol lookup, we can set it
  // to the pos of the symbol we replaced.

  s = makeResult(s);
  node._cachedResult = s;
  return s;
};

var evaluateAssign = function (node, scope) {
  var res = evaluateASTTree(M.get(node,'expr'), scope);
  if (res.status === 'ERROR') {
    return res;
  }
  return makeAssignment(M.get(node,'symbol'), res.res);
};

// NOTE: As this is architected, this MUST NOT modify the scope. EVER.
// Otherwise, all of the time travelling stuff won't work.
// This means that functions must be externally pure. i.e. a function
// can modify its own local variables but may not modify
// variables external to its scope.
export default function evaluateASTTree (node, scope) {
  if (!node) {
    return;
  }
  var node_type = M.get(node,'type');
  if (node_type === S.S_ASSIGN) {
    return evaluateAssign(node, scope);
  } else if (S.isUnaryOperator(node_type)) {
    return evaluateUnaryOperator(node, scope);
  } else if (S.isBinaryOperator(node_type)) {
    return evaluateBinaryOperator(node, scope);
  } else if (node_type === S.T_SYM) { // Needs to be above isTerminal because we don't want to evaluate symbols before lookup
    return evaluateSymbol(node, scope);
  } else if (S.isTerminal(node_type)) {
    return evaluateTerminal(node, scope);
  } else {
    return makeError("I don't understand "+node_type.toString()
                    , [node], M.get(node,'pos'));
    // S.E_CALL
  }
};