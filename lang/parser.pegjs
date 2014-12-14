{
  import 'es6-symbol/implement';
  function getPos(col, line) {
    return {line: line, col: col};
  }

  function makeAssignmentStatement (sym, expr, pos) {
    return {
      type: Symbol.for('S_ASSIGN')
    , symbol: sym
    , expr: expr
    , pos: pos
    };
  }

  function makeSymbol (name, pos) {
    return {
      type: Symbol.for('T_SYM')
    , name: name.join('')
    , pos: pos
    };
  }

  function makeCall (sym, expr_list, pos) {
    return {
      type: Symbol.for('E_CALL')
    , symbol: sym
    , exprs: expr_list?expr_list:[]
    , pos: pos
    };
  }

  function makeFloat (w, f, pos) {
    return {
      type: Symbol.for('T_FLOAT')
    , value: { whole: parseInt(w.join('')|0)
             , fractional: parseInt(f.join('')|0)
             }
    , pos: pos
    };
  }

  function makeInt (value, pos) {
    return {
      type: Symbol.for('T_INT')
    , value: parseInt(value.join('')|0)
    , pos: pos
    };
  }

  function makeBaseInt (valueList, base, pos) {
    return {
      type: Symbol.for('T_BASE_INT')
    , value: valueList.join('')
    , base: base
    , pos: pos
    };
  }

  function _makeBinaryOp (a, b, op, pos) {
    return {
      type: op
    , valueA: a
    , valueB: b
    , pos: pos
    };
  }

  function makeAdd (a, b, pos) {
    return _makeBinaryOp(a, b, Symbol.for('E_ADD'), pos);
  }

  function makeSub (a, b, pos) {
    return _makeBinaryOp(a, b, Symbol.for('E_SUB'), pos);
  }

  function makeMul (a, b, pos) {
    return _makeBinaryOp(a, b, Symbol.for('E_MUL'), pos);
  }

  function makeDiv (a, b, pos) {
    return _makeBinaryOp(a, b, Symbol.for('E_DIV'), pos);
  }
}

start =
  statement
/ expr

statement "assignment statement (identifier := expression)" =
  ws* s:symbol ws* ":=" e:expr
  { return makeAssignmentStatement(s, e, getPos(column(), line())) }

digit =
  [0-9]

int =
  whole:digit+
  { return makeInt(whole, getPos(column(), line())); }

float =
  (whole:digit+ "." fractional:digit*)
  { return makeFloat(whole, fractional, getPos(column(), line())); }
/ (whole:digit* "." fractional:digit+)
  {return makeFloat(whole, fractional, getPos(column(), line())); }

binary =
  "0b" n:[0-1]+
  { return makeBaseInt(n, 2, getPos(column(), line())); }

hex =
  "0x" n:[0-9a-fA-F]+
  { return makeBaseInt(n, 16, getPos(column(), line())); }

number "number" =
  hex
/ binary
/ float
/ int

ws "whitespace" =
  (" " / "\r" / "\n" / "\t" / "\f")+

expr =
  eterm "=" eterm
/ eterm

expr_list =
  first:expr "," rest:expr_list
  { rest.unshift(first); return rest; }
/ e:expr
  { return [e]; }

eterm =
  first:term "+" second:eterm
  { return makeAdd(first, second, getPos(column(), line())); }
/ first:term "-" second:eterm
  { return makeAdd(first, second, getPos(column(), line())); }
/ term

term =
  first:factor "*" second:term
  { return makeMul(first, second, getPos(column(), line())); }
/ first:factor "/" second:term
  { return makeDiv(first, second, getPos(column(), line())); }
/ factor

symbol "identifier" =
  firstPart:[a-zA-Z] secondPart:[a-zA-Z0-9]*
  { secondPart.unshift(firstPart); return makeSymbol(secondPart, getPos(column(), line())); }

factor =
  ws* n:number ws*
  { return n; }
/ ws* s:symbol ws* "(" ws* es:expr_list? ws* ")" ws*
  { return makeCall(s, es, getPos(column(), line())); }
/ ws* s:symbol ws*
  { return s; }
/ ws* "(" ws* es:expr ws* ")" ws*
  { return es; }

