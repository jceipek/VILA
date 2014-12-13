function Algorithm () {
  this.inputData = [];
  this.steps = [];
}

function Step () {
  this.inputDataInstances = [];
}

function Loop () {
  this.frames = [];
}
Loop.prototype = new Step();

function Frame () {
  this.transformation = null;
}
Frame.prototype = new Step();

function BaseData () {
  this.name = null;
  this.type = null;
  this.visualizers = [];
}

function SourceData () {
  this.value = null;
}
SourceData.prototype = new BaseData();

function DataInstance () {
  this.baseData = null;
  this.derivedFromInstance = null;
  this.value = null;
}

function ASTExpression (exprList, fnName) {
  this.expressions = exprList;
  this.fn = fnName;
}

function ASTTerm (dataInstance) {
  this.dataInstance = dataInstance;
}
ASTTerm.prototype = new ASTExpression();

function AssignmentASTOperation () {
  this.toSet = [];
  this.values = [];
}

module.exports = {
  makeAlgorithm: function () { return new Algorithm(); }
, makeStep: function () { return new Step(); }
, makeLoop: function () { return new Loop(); }
, makeFrame: function () { return new Frame(); }
, makeBaseData: function () { return new BaseData(); }
, makeSourceData: function () { return new SourceData(); }
, makeDataInstance: function () { return new DataInstance(); }
, makeASTExpression: function (exprList, fnName) { return new ASTExpression(exprList, fnName); }
, makeASTTerm: function (dataInstance) { return new ASTTerm(dataInstance); }
, makeAssignmentASTOperation: function () { return new AssignmentASTOperation(); }
}