let selectedCard = null;
let fighting = false;

const graph = new KnightMoveGraph();
const fightButton = document.getElementById("fightButton");
fightButton.style.opacity = "0.4";

const { onCardSelected, addToBoard, removeFromBoard, getCardName, isCardPlaced, getPlace, setPlace } = cardOperations();
const {
  onCellSelected,
  isCardPlaced: isCardPlacedOnCell,
  getRowCol,
  addCard,
  removeCard,
  getPlacedCard,
  move,
  getCell,
} = boardOperations();

const adjustFightButtonStyle = () => {
  const condition = isCardPlaced("geralt") && isCardPlaced("monster") && !fighting;
  fightButton.style.opacity = condition ? "1" : "0.4";
  fightButton.style.cursor = condition ? "pointer" : "unset";
};

onCardSelected((card) => (selectedCard = card));
onCellSelected((cell, row, col) => {
  if (isCardPlacedOnCell(cell)) {
    const card = getPlacedCard(cell);
    removeCard(cell);
    removeFromBoard(card);
  }
  if (selectedCard) {
    addCard(cell, getCardName(selectedCard), selectedCard.querySelector("img").cloneNode(true));
    addToBoard(selectedCard, row, col);
    adjustFightButtonStyle();
  }
});

const fight = async () => {
  fighting = true;
  adjustFightButtonStyle();
  if (!isCardPlaced("geralt") || !isCardPlaced("monster")) return;
  const geraltPlace = getPlace("geralt");
  const monsterPlace = getPlace("monster");

  graph.place(...geraltPlace);
  await move(graph.move(...monsterPlace));

  setPlace("geralt", ...monsterPlace);
  removeFromBoard("monster");
  fighting = false;
  adjustFightButtonStyle();
};

fightButton.addEventListener("click", fight);
