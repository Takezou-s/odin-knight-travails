class Vertex {
  value = null;
  connected = [];
  height = null;
  predecessor = null;

  constructor(value) {
    this.value = value;
  }

  reset = () => {
    this.height = null;
    this.predecessor = null;
  };

  toString = () => {
    return this.value[0] + ", " + this.value[1];
  };
}
