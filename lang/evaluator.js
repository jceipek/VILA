import S from './symbolTypes';

var evaluateAdd = function (a, b, pos) {
  if (a.type === S.T_INT && b.type === S.T_INT) {
    return S.makeInt(a.value + b.value, pos);
  } else {
    throw new Error("Error: We don't yet support addition on "+a.type.toString()+" and "+b.type.toString());
  }
};

var evaluateSub = function (a, b, pos) {
  if (a.type === S.T_INT && b.type === S.T_INT) {
    return S.makeInt(a.value - b.value, pos);
  } else {
    throw new Error("Error: We don't yet support subtraction on "+a.type.toString()+" and "+b.type.toString());
  }
};

var evaluateMul = function (a, b, pos) {
  if (a.type === S.T_INT && b.type === S.T_INT) {
    return S.makeInt(a.value * b.value, pos);
  } else {
    throw new Error("Error: We don't yet support multiplication on "+a.type.toString()+" and "+b.type.toString());
  }
};

var evaluateDiv = function (a, b, pos) {
  if (a.type === S.T_INT && b.type === S.T_INT) {
    return S.makeInt(Math.floor(a.value / b.value), pos);
  } else {
    throw new Error("Error: We don't yet support division on "+a.type.toString()+" and "+b.type.toString());
  }
};

var evaluateBinaryOperator = function (node) {
  var resA = node.valueA;
  var resB = node.valueB;
  if (!S.isTerminal(node.valueA)) {
    resA = evaluateASTTree(node.valueA);
  }
  if (!S.isTerminal(node.valueB)) {
    resB = evaluateASTTree(node.valueB);
  }

  var res = null;
  if (node.type === S.E_ADD) {
    res = evaluateAdd(resA, resB, node.pos);
  } else if (node.type === S.E_SUB) {
    res = evaluateSub(resA, resB, node.pos);
  } else if (node.type === S.E_MUL) {
    res = evaluateMul(resA, resB, node.pos);
  } else if (node.type === S.E_DIV) {
    res = evaluateDiv(resA, resB, node.pos);
  }
  node._cachedResult = res;
  return res;
}

var evaluateInt = function (node) {
  return node;
};

var evaluateBaseInt = function (node) {
  return node;
};

var evaluateFloat = function (node) {
  return node;
};


export default function evaluateASTTree (node) {
  if (!node) {
    return;
  }
  if (S.isBinaryOperator(node.type)) {
    return evaluateBinaryOperator(node);
  } else if (node.type === S.T_INT) {
    return evaluateInt(node);
  } else if (node.type === S.T_BASE_INT) {
    return evaluateBaseInt(node);
  } else if (node.type === S.T_FLOAT) {
    return evaluateFloat(node);
  } else {
    throw new Error("ERROR: Cannot yet evaluate " + node.type.toString());
    // S.S_ASSIGN
    // S.T_SYM
    // S.E_CALL
  }
};