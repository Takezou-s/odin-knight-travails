function boardOperations() {
  let cellSelectedHandler = null;
  const cells = [];

  const boardEl = document.getElementById("board");
  boardEl.innerHTML = "";
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const div = document.createElement("div");
      div.dataset.row = i;
      div.dataset.col = j;
      div.dataset.gameCell = "true";
      div.classList.add("cell");
      div.style.backgroundColor = (i + j) % 2 === 0 ? "#3f3f3f" : "#eeeeee";
      boardEl.appendChild(div);
      cells.push(div);
    }
  }

  const onCellSelected = (fn) => {
    cellSelectedHandler = fn;
  };

  const isCardPlaced = (cell) => {
    return cell.dataset.card && cell.dataset.card !== "";
  };

  const getRowCol = (cell) => {
    return [cell.dataset.row, cell.dataset.col];
  };

  const defineCard = (cell, cardName) => {
    cell.dataset.card = cardName;
  };

  const addCard = (cell, cardName, cardEl) => {
    const oldCell = document.querySelector(`.cell[data-card="${cardName}"]`);
    if (oldCell) {
      removeCard(oldCell);
    }
    cell.innerHTML = "";
    defineCard(cell, cardName);
    cardEl.style.maxHeight = cell.offsetHeight + "px";
    cardEl.style.maxWidth = cell.offsetWidth + "px";
    cardEl.style.pointerEvents = "none";
    cardEl.style.zIndex = "10";
    cell.appendChild(cardEl);
  };

  const removeCard = (cell) => {
    cell.dataset.card = "";
    cell.innerHTML = "";
  };

  const getPlacedCard = (cell) => {
    return cell.dataset.card;
  };

  const getCell = (row, col) => {
    return document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
  };

  const cellsBetween = (start, end) => {
    const arr = [];
    let num = (start[0] < end[0] && 1) || (start[0] > end[0] && -1) || 0;
    let current = start[0];
    while (current - num !== end[0]) {
      const element = [current, start[1]];
      const index = arr.findIndex((x) => x[0] === element[0] && x[1] === element[1]);
      if (index < 0) arr.push(element);

      current += num;
    }
    num = (start[1] < end[1] && 1) || (start[1] > end[1] && -1) || 0;
    current = start[1];
    while (current - num !== end[1]) {
      const element = [end[0], current];
      const index = arr.findIndex((x) => x[0] === element[0] && x[1] === element[1]);
      if (index < 0) arr.push(element);

      current += num;
    }
    return arr;
  };

  const move = async (arr2) => {
    cells.forEach((x) => {
      const card = getPlacedCard(x);
      if (!card || card === "") {
        x.innerHTML = "";
      }
    });
    let arr = [];
    arr = [...arr2];
    const target = arr2[arr2.length - 1];
    const targetCell = getCell(...target);
    const targetChildren = targetCell.innerHTML;

    let currentPos = arr.shift();
    const currentCell = getCell(...currentPos);
    const cardName = getPlacedCard(currentCell);
    const child = currentCell.children[0];
    let count = 0;
    while (arr.length > 0) {
      const nextPos = arr.shift();
      cellsBetweenArr = cellsBetween(currentPos, nextPos);
      let cell1Pos = cellsBetweenArr.shift();
      while (cellsBetweenArr.length > 0) {
        const cell2Pos = cellsBetweenArr.shift();
        const cell1 = getCell(...cell1Pos);
        const cell2 = getCell(...cell2Pos);
        let text = "▲";

        let transitionDone = false;
        let fn = () => {
          return transitionDone;
        };
        ontransitionend = (event) => {
          if (event.target === child && fn) {
            console.log("Transition done");
            transitionDone = true;
          }
        };

        child.style.position = "relative";
        child.classList.add("move");
        if (cell1Pos[0] !== cell2Pos[0]) {
          const top = cell2.offsetTop - cell1.offsetTop;
          child.style.top = top + "px";
          if (top > 0) text = "▼";
        } else {
          const left = cell2.offsetLeft - cell1.offsetLeft;
          child.style.left = left + "px";
          text = "◄";
          if (left > 0) text = "►";
        }
        await new Promise((resolve, reject) => {
          const timeoutId = setTimeout(() => resolve(true), 5000);
          const intervalId = setInterval(() => {
            if (fn()) {
              resolve(true);
              clearInterval(intervalId);
              clearTimeout(timeoutId);
            }
          }, 10);
        });

        child.classList.remove("move");
        child.style.position = "";
        child.style.top = "";
        child.style.left = "";
        defineCard(cell1, "");
        cell2.innerHTML = "";
        cell2.append(child);
        defineCard(cell2, cardName);
        if (arr2.findIndex((x, index, array) => x.join("") === cell1Pos.join("") && index !== array.length - 1) >= 0) {
          cell1.innerHTML = `
            <span style="position: absolute; right: 5px; top: 0; font-size: 48px; pointer-events: none">${++count}</span>
            <span style="pointer-events: none">${text}</span>
            `;
        } else cell1.innerHTML = `<span style="pointer-events: none">${text}</span>`;

        const cell2str = cell2Pos.join("");
        const targetstr = target.join("");
        if (cell2str !== targetstr && targetCell.innerHTML !== targetChildren) {
          targetCell.innerHTML = targetChildren;
        }
        cell1Pos = cell2Pos;
      }

      currentPos = nextPos;
    }
  };
  boardEl.addEventListener("click", (event) => {
    const target = event.target;
    if (!target.dataset.gameCell) {
      return;
    }
    if (cellSelectedHandler) cellSelectedHandler(target, target.dataset.row, target.dataset.col);
  });

  return { onCellSelected, isCardPlaced, getRowCol, addCard, removeCard, getPlacedCard, move, getCell };
}
