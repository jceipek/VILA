import 'es6-symbol/implement';
var S = {
  S_ASSIGN: Symbol.for('S_ASSIGN')
, E_CALL: Symbol.for('E_CALL')
, E_ADD: Symbol.for('E_ADD')
, E_SUB: Symbol.for('E_SUB')
, E_MUL: Symbol.for('E_MUL')
, E_DIV: Symbol.for('E_DIV')
, T_SYM: Symbol.for('T_SYM')
, T_FLOAT: Symbol.for('T_FLOAT')
, T_INT: Symbol.for('T_INT')
, T_BASE_INT: Symbol.for('T_BASE_INT')
};

S.isTerminal = function (t) {
    return t === S.T_SYM ||
           t === S.T_FLOAT ||
           t === S.T_INT ||
           t === S.T_BASE_INT;
};

S.isBinaryOperator = function (b) {
    return b === S.E_ADD ||
           b === S.E_SUB ||
           b === S.E_MUL ||
           b === S.E_DIV;
};

S.makeAssignmentStatement = function (sym, expr, pos) {
  return {
    type: S.S_ASSIGN
  , symbol: sym
  , expr: expr
  , pos: pos
  };
};

S.makeSymbol = function (name, pos) {
  return {
    type: S.T_SYM
  , name: name.join('')
  , pos: pos
  };
};

S.makeCall = function (sym, expr_list, pos) {
  return {
    type: S.E_CALL
  , symbol: sym
  , exprs: expr_list?expr_list:[]
  , pos: pos
  };
};

S.makeFloat = function (w, f, pos) {
  return {
    type: S.T_FLOAT
  , value: { whole: w
           , fractional: f
           }
  , pos: pos
  };
};

S.makeInt = function (value, pos) {
  return {
    type: S.T_INT
  , value: value
  , pos: pos
  };
};

S.makeBaseInt = function (strValue, base, pos) {
  return {
    type: S.T_BASE_INT
  , strValue: strValue
  , base: base
  , pos: pos
  };
};

var _makeBinaryOp = function (a, b, op, pos) {
  return {
    type: op
  , valueA: a
  , valueB: b
  , pos: pos
  };
};

S.makeAdd = function (a, b, pos) {
  return _makeBinaryOp(a, b, S.E_ADD, pos);
};

S.makeSub = function (a, b, pos) {
  return _makeBinaryOp(a, b, S.E_SUB, pos);
};

S.makeMul = function (a, b, pos) {
  return _makeBinaryOp(a, b, S.E_MUL, pos);
};

S.makeDiv = function (a, b, pos) {
  return _makeBinaryOp(a, b, S.E_DIV, pos);
};

export default S;