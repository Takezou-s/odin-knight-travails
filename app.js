const graph = new KnightMoveGraph();

// graph.place(0, 0);
// console.log(graph.move(3, 2));
// console.log(graph.move(3, 4));

let selectedCard = null;
const { onCardSelected, addToBoard, removeFromBoard, getCardName } = cardOperations();
const { onCellSelected, isCardPlaced, getRowCol, addCard, removeCard, getPlacedCard } = boardOperations();
onCardSelected((card) => (selectedCard = card));
onCellSelected((cell) => {
  if (isCardPlaced(cell)) {
    const card = getPlacedCard(cell);
    removeCard(cell);
    removeFromBoard(card);
    return;
  }
  if (selectedCard) {
    addCard(cell, getCardName(selectedCard), selectedCard.querySelector("img").cloneNode(true));
    addToBoard(selectedCard);
  }
});
