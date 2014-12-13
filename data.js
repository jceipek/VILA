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

function ASTExpression () {
  this.expressions = [];
  this.fn = null;
}

function ASTTerm () {
  this.dataInstance = null;
}
ASTTerm.prototype = new ASTExpression();

function AssignmentASTOperation () {
  this.toSet = [];
  this.values = [];
}