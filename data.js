export class Algorithm {
  constructor (firstStep) {
    this.examples = [];
    this.steps = firstStep; // This is a doubly linked list
  }
}

// Steps form a linked list because
// we want to efficiently add and remove
// them and an Algorithm hopefully
// won't require all that many of them
export class Step {
  constructor () {
    this.inputScope = null;
    this.nextStep = null;
    this.lastStep = null;
    this.outputScope = null;
  }
}

export class Loop extends Step {
  constructor () {
    this.frames = [];
  }
}

export class Frame extends Step {
  constructor () {
    this.transformationCode = "";
  }
}

export class BaseData {
  constructor () {
    this.name = null;
    this.type = null;
    this.visualizers = [];
  }
}

export class SourceData extends BaseData {
  constructor () {
    super();
    this.value = null;
  }
}

export class DataInstance {
  constructor () {
    this.baseData = null;
    this.derivedFromInstance = null;
    this.value = null;
  }
}