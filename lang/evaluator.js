import S from './symbolTypes';

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
  if (a.type === S.T_INT && b.type === S.T_INT) {
    return makeResult(S.makeInt(a.value + b.value, pos));
  } else if (a.type === S.T_FLOAT && b.type === S.T_FLOAT) {
    return makeResult(S.makeFloat(a.value + b.value, pos));
  } else {
    return makeError("I don't understand addition on "+a.type.toString()+" and "+b.type.toString()
                    , [a, b], pos);
  }
};

var evaluateSub = function (a, b, pos, scope) {
  if (a.type === S.T_INT && b.type === S.T_INT) {
    return makeResult(S.makeInt(a.value - b.value, pos));
  } else if (a.type === S.T_FLOAT && b.type === S.T_FLOAT) {
    return makeResult(S.makeFloat(a.value - b.value, pos));
  } else {
    return makeError("I don't understand subtraction on "+a.type.toString()+" and "+b.type.toString()
                    , [a, b], pos);
  }
};

var evaluateMul = function (a, b, pos, scope) {
  if (a.type === S.T_INT && b.type === S.T_INT) {
    return makeResult(S.makeInt(a.value * b.value, pos));
  } else if (a.type === S.T_FLOAT && b.type === S.T_FLOAT) {
    return makeResult(S.makeFloat(a.value * b.value, pos));
  } else {
    return makeError("I don't understand multiplication on "+a.type.toString()+" and "+b.type.toString()
                    , [a, b], pos);
  }
};

var evaluateDiv = function (a, b, pos, scope) {
  if (a.type === S.T_INT && b.type === S.T_INT) {
    var div = a.value / b.value;
    var f = Math.trunc(div); // floor doesn't work correctly for negative numbers
    var res = S.makeInt(f, pos);
    res._couldLosePrecision = true;
    res._didLosePrecision = (f !== div);
    return makeResult(res);
  } else if (a.type === S.T_FLOAT && b.type === S.T_FLOAT) {
    return makeResult(S.makeFloat(a.value / b.value, pos));
  } else {
    return makeError("I don't understand division on "+a.type.toString()+" and "+b.type.toString()
                    , [a, b], pos);
  }
};

var evaluateEq = function (a, b, pos, scope) {
  if (a.type !== b.type) {
    return makeResult(S.makeBool(false, pos));
  } else if (a.type === S.T_INT || // Don't need to check b because we know the types match
             a.type === S.T_FLOAT ||
             a.type === S.T_BOOL) {
    return makeResult(S.makeBool(a.value == b.value, pos));
  } else {
    return makeError("I don't understand equivalence checks on "+a.type.toString()+" and "+b.type.toString()
                    , [a, b], pos);
  }
};

var evaluateNeg = function (node, pos, scope) {
  if (node.type === S.T_INT) {
    return makeResult(S.makeInt(-node.value, pos));
  } else if (node.type === S.T_FLOAT) {
    return makeResult(S.makeFloat(-node.value, pos));
  } else {
    return makeError("I don't understand negation on "+node.type.toString()
                    , [node], pos);
  }
};

var evaluateUnaryOperator = function (node, scope) {
  var res = node.value;
  if (!S.isTerminal(res)) {
    res = evaluateASTTree(node.value, scope);
    if (res.status === 'ERROR') {
      return res;
    }
  }
  if (node.type === S.E_NEG) {
    res = evaluateNeg(res.res, node.pos, scope);
  }
  node._cachedResult = res;
  if (res.status === 'ERROR') {
    return res;
  }
  return res;
}

var evaluateBinaryOperator = function (node, scope) {
  var resA = node.valueA;
  var resB = node.valueB;
  if (!S.isTerminal(resA)) {
    resA = evaluateASTTree(node.valueA, scope);
    if (resA.status === 'ERROR') {
      return resA;
    }
    resA = resA.res;
  }
  if (!S.isTerminal(resB)) {
    resB = evaluateASTTree(node.valueB, scope);
    if (resB.status === 'ERROR') {
      return resB;
    }
    resB = resB.res;
  }

  var res = null;
  if (node.type === S.E_ADD) {
    res = evaluateAdd(resA, resB, node.pos, scope);
  } else if (node.type === S.E_SUB) {
    res = evaluateSub(resA, resB, node.pos, scope);
  } else if (node.type === S.E_MUL) {
    res = evaluateMul(resA, resB, node.pos, scope);
  } else if (node.type === S.E_DIV) {
    res = evaluateDiv(resA, resB, node.pos, scope);
  } else if (node.type === S.E_EQ) {
    res = evaluateEq(resA, resB, node.pos, scope);
  }
  node._cachedResult = res;
  if (res.status === 'ERROR') {
    return res;
  }
  return res;
}

var evaluateTerminal = function (node, scope) {
  return makeResult(node);
};

var evaluateSymbol = function (node, scope) {
  // TODO: Think about optimizing this if it becomes a bottleneck;
  // it has to walk the scope 2x for the sake of avoiding try/catch
  if (scope.scopeOfSymbol(node.name) === null) {
    var e = makeError("I can't find "+node.name.toString()+" in my scope or parent scopes :("
                    , [node], node.pos);
    node._cachedResult = e;
    return e;
  }
  var s = scope.lookupSymbolValue(node.name);
  s.pos = node.pos; // pos actually doesn't make much sense for values
                    // mapped to symbols in the scope contents.
                    // However, when we do a symbol lookup, we can set it
                    // to the pos of the symbol we replaced.
  s = makeResult(s);
  node._cachedResult = s;
  return s;
};

var evaluateAssign = function (node, scope) {
  var res = evaluateASTTree(node.expr, scope);
  if (res.status === 'ERROR') {
    return res;
  }
  return makeAssignment(node.symbol, res.res);
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
  if (node.type === S.S_ASSIGN) {
    return evaluateAssign(node, scope);
  } else if (S.isUnaryOperator(node.type)) {
    return evaluateUnaryOperator(node, scope);
  } else if (S.isBinaryOperator(node.type)) {
    return evaluateBinaryOperator(node, scope);
  } else if (node.type === S.T_SYM) { // Needs to be above isTerminal because we don't want to evaluate symbols before lookup
    return evaluateSymbol(node, scope);
  } else if (S.isTerminal(node.type)) {
    return evaluateTerminal(node, scope);
  } else {
    return makeError("I don't understand "+node.type.toString()
                    , [node], node.pos);
    // S.E_CALL
  }
};