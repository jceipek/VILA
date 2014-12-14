// NOTE: we currently store the full history of every value in memory
// It may be prudent to use some form of compression or simplification
// on the history if we start having memory issues.
// First, though, it would probably be smarter to store diffs of complex values
// such as arrays rather than making deep copies every time one of their subvalues
// changes.
export default class Scope {
  constructor () {
    this.parentScope = null;
    this.childScopes = [];
    this.contents = {};
  }

  doesSymbolExist (symbol) {
    if (this.contents.hasOwnProperty(symbol)) {
      return true;
    } else if (this.parentScope != null) {
      return this.parentScope.doesSymbolExist(symbol);
    } else {
      return false;
    }
  }

  lookupSymbolValue (symbol) {
    if (this.contents.hasOwnProperty(symbol)) {
      var l = this.contents[symbol].length;
      if (l === 0) {
        throw new Error("Symbol " + symbol + " has no value history!");
      } else {
        return this.contents[symbol][l-1]; // Most recently added value
      }
    } else if (this.parentScope != null) {
      return this.parentScope.lookup(symbol);
    } else {
      throw new Error("Symbol " + symbol + " doesn't exist!");
    }
  }

  lookupSymbolHistory (symbol) {
    if (this.contents.hasOwnProperty(symbol)) {
      return this.contents[symbol];
    } else {
      return null;
    }
  }

  setSymbolValue (symbol, value) {
    if (!this.contents.hasOwnProperty(symbol)) {
      this.contents[symbol] = [value];
    } else {
      this.contents[symbol].push(value);
    }
  }

  addNewScope () {
    var s = new Scope();
    s.parentScope = this;
    this.childScopes.push(s);
    return s;
  }
}