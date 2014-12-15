import S from './symbolTypes';

var evaluateAdd = function (a, b, pos, scope) {
  if (a.type === S.T_INT && b.type === S.T_INT) {
    return S.makeInt(a.value + b.value, pos);
  } else {
    throw new Error("Error: We don't yet support addition on "+a.type.toString()+" and "+b.type.toString());
  }
};

var evaluateSub = function (a, b, pos, scope) {
  if (a.type === S.T_INT && b.type === S.T_INT) {
    return S.makeInt(a.value - b.value, pos);
  } else {
    throw new Error("Error: We don't yet support subtraction on "+a.type.toString()+" and "+b.type.toString());
  }
};

var evaluateMul = function (a, b, pos, scope) {
  if (a.type === S.T_INT && b.type === S.T_INT) {
    return S.makeInt(a.value * b.value, pos);
  } else {
    throw new Error("Error: We don't yet support multiplication on "+a.type.toString()+" and "+b.type.toString());
  }
};

var evaluateDiv = function (a, b, pos, scope) {
  if (a.type === S.T_INT && b.type === S.T_INT) {
    return S.makeInt(Math.floor(a.value / b.value), pos);
  } else {
    throw new Error("Error: We don't yet support division on "+a.type.toString()+" and "+b.type.toString());
  }
};

var evaluateEq = function (a, b, pos, scope) {
  if (a.type === S.T_INT && b.type === S.T_INT) {
    return S.makeBool(a.value == b.value, pos);
  } else {
    throw new Error("Error: We don't yet support equivalence checks on "+a.type.toString()+" and "+b.type.toString());
  }
};

var evaluateBinaryOperator = function (node, scope) {
  var resA = node.valueA;
  var resB = node.valueB;
  if (!S.isTerminal(node.valueA)) {
    resA = evaluateASTTree(node.valueA, scope);
  }
  if (!S.isTerminal(node.valueB)) {
    resB = evaluateASTTree(node.valueB, scope);
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
  return res;
}

var evaluateTerminal = function (node, scope) {
  return node;
};

var evaluateSymbol = function (node, scope) {
  var s = scope.lookupSymbolValue(node.name);
  s.pos = node.pos; // pos actually doesn't make much sense for values
                    // mapped to symbols in the scope contents.
                    // However, when we do a symbol lookup, we can set it
                    // to the pos of the symbol we replaced.
  node._cachedResult = s;
  return s;
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
  if (S.isBinaryOperator(node.type)) {
    return evaluateBinaryOperator(node, scope);
  } else if (S.isTerminal(node.type)) {
    return evaluateTerminal(node, scope);
  } else if (node.type === S.T_SYM) {
    return evaluateSymbol(node, scope);
  } else {
    throw new Error("ERROR: Cannot yet evaluate " + node.type.toString());
    // S.S_ASSIGN
    // S.E_CALL
  }
};