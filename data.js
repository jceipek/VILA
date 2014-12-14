export class Algorithm {
  constructor () {
    this.inputData = [];
    this.steps = [];
  }
}

export class Step {
  constructor () {
    this.inputDataInstances = [];
  }
}

export class Loop extends Step {
  constructor () {
    this.frames = [];
  }
}

export class Frame extends Step {
  constructor () {
    this.transformation = null;
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