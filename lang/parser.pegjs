{
  import S from './symbolTypes';
  function getPos(col, line) {
    return {line: line, col: col};
  }
  function coerceStringListToInt (strList) {
    return parseInt(strList.join('')|0);
  }
}

start =
  statement
/ expr

statement "assignment statement (identifier := expression)" =
  ws* s:symbol ws* ":=" e:expr
  { return S.makeAssignmentStatement(s, e, getPos(column(), line())) }

digit =
  [0-9]

int =
  whole:digit+
  { return S.makeInt(coerceStringListToInt(whole), getPos(column(), line())); }

float =
  (whole:digit+ "." fractional:digit*)
  { return S.makeFloat(coerceStringListToInt(whole), coerceStringListToInt(fractional), getPos(column(), line())); }
/ (whole:digit* "." fractional:digit+)
  {return S.makeFloat(coerceStringListToInt(whole), coerceStringListToInt(fractional), getPos(column(), line())); }

binary =
  "0b" n:[0-1]+
  { return S.makeBaseInt(n.join(''), 2, getPos(column(), line())); }

hex =
  "0x" n:[0-9a-fA-F]+
  { return S.makeBaseInt(n.join(''), 16, getPos(column(), line())); }

bool "boolean" =
  "True"
  { return S.makeBool(true, getPos(column(), line())); }
/ "False"
  { return S.makeBool(false, getPos(column(), line())); }

number "number" =
  hex
/ binary
/ float
/ int

baseType "primitive type (number or boolean)" =
  number
/ bool

ws "whitespace" =
  (" " / "\r" / "\n" / "\t" / "\f")+

expr =
  first:eterm "=" second:eterm
  { return S.makeEq(first, second, getPos(column(), line())); }
/ eterm

expr_list =
  first:expr "," rest:expr_list
  { rest.unshift(first); return rest; }
/ e:expr
  { return [e]; }

eterm =
  first:term "+" second:eterm
  { return S.makeAdd(first, second, getPos(column(), line())); }
/ first:term "-" second:eterm
  { return S.makeSub(first, second, getPos(column(), line())); }
/ term

term =
  first:factor "*" second:term
  { return S.makeMul(first, second, getPos(column(), line())); }
/ first:factor "/" second:term
  { return S.makeDiv(first, second, getPos(column(), line())); }
/ factor

symbol "identifier" =
  firstPart:[a-zA-Z] secondPart:[a-zA-Z0-9]*
  { secondPart.unshift(firstPart); return S.makeSymbol(secondPart, getPos(column(), line())); }

factor =
  ws* n:baseType ws*
  { return n; }
/ ws* s:symbol ws* "(" ws* es:expr_list? ws* ")" ws*
  { return S.makeCall(s, es, getPos(column(), line())); }
/ ws* s:symbol ws*
  { return s; }
/ ws* "(" ws* es:expr ws* ")" ws*
  { return es; }

