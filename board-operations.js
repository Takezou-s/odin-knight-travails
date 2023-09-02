function boardOperations() {
  let cellSelectedHandler = null;

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

  const addCard = (cell, cardName, cardEl) => {
    const oldCell = document.querySelector(`.cell[data-card="${cardName}"`);
    if (oldCell) {
      removeCard(oldCell);
    }
    cell.dataset.card = cardName;
    cardEl.style.maxHeight = cell.offsetHeight + "px";
    cardEl.style.maxWidth = cell.offsetWidth + "px";
    cardEl.style.pointerEvents = "none";
    cell.appendChild(cardEl);
  };

  const removeCard = (cell) => {
    cell.dataset.card = "";
    cell.innerHTML = "";
  };

  const getPlacedCard = (cell) => {
    return cell.dataset.card;
  };

  boardEl.addEventListener("click", (event) => {
    const target = event.target;
    if (!target.dataset.gameCell) {
      return;
    }
    if (cellSelectedHandler) cellSelectedHandler(target);
  });

  return { onCellSelected, isCardPlaced, getRowCol, addCard, removeCard, getPlacedCard };
}
