class KnightMoveGraph {
  _vertices = [];
  _currentPos = [0, 0];

  constructor() {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const vertex = this.getVertex(i, j);
        this.getPossibleMoves(i, j).forEach((x) => this.connect(vertex, this.getVertex(x[0], x[1])));
      }
    }
  }

  place = (row, col) => {
    this._currentPos = [row, col];
    return this;
  };

  move = (row, col) => {
    this._vertices.forEach((x) => x.reset());
    const startVertex = this.getVertex(...this._currentPos);
    const targetVertex = this.getVertex(row, col);
    targetVertex.height = 0;
    targetVertex.predecessor = "self";

    let startFound = false;
    const arr = [targetVertex];
    while (!startFound) {
      const vertex = arr.shift();
      const connectedVertices = vertex.connected.filter((x) => x.height === null);
      connectedVertices.forEach((x) => {
        x.height = vertex.height + 1;
        x.predecessor = vertex;
        if (x === startVertex) startFound = true;
      });
      if (!startFound) arr.push(...connectedVertices);
    }

    const result = [];
    let currentVertex = startVertex;
    while (currentVertex && currentVertex !== targetVertex) {
      result.push(currentVertex);
      currentVertex = currentVertex.predecessor;
    }
    if (result.length > 0) {
      if (this.isConnected(result[result.length - 1], targetVertex)) result.push(targetVertex);
    }
    this.place(row, col);
    return result.map((x) => x.toString());
  };

  getVertex = (row, col) => {
    let vertex = this._vertices.find((x) => x.value[0] === row && x.value[1] === col);
    if (!vertex) {
      vertex = new Vertex([row, col]);
      this._vertices.push(vertex);
    }
    return vertex;
  };

  connect = (vertex1, vertex2) => {
    if (this.isConnected(vertex1, vertex2)) return;
    vertex1.connected.push(vertex2);
    vertex2.connected.push(vertex1);
  };

  isConnected = (vertex1, vertex2) => {
    return vertex1.connected.findIndex((x) => x === vertex2) >= 0;
  };

  getPossibleMoves = (row, col) => {
    const result = [];
    // Up
    result.push([row + 2, col + 1]);
    result.push([row + 2, col - 1]);
    // Down
    result.push([row - 2, col + 1]);
    result.push([row - 2, col - 1]);
    // Left
    result.push([row + 1, col - 2]);
    result.push([row - 1, col - 2]);
    // Right
    result.push([row + 1, col + 2]);
    result.push([row - 1, col + 2]);
    return result.filter((x) => x.every((y) => y >= 0 && y <= 7));
  };
}