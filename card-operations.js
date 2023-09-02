function cardOperations() {
  const cards = document.querySelectorAll(".card");
  let cardSelectedHandler = null;

  const getCardElement = (card) => {
    return card && card.dataset ? card : document.querySelector(`.card[data-name="${card}"]`);
  };

  const act = (card, fn) => {
    const cardEl = getCardElement(card);
    if (cardEl) {
      return fn(cardEl);
    }
  };

  const isCardPlaced = (card) => {
    // const cardEl = getCardElement(card);
    // return cardEl && cardEl.dataset.placed === "true";
    return act(card, (cardEl) => cardEl.dataset.placed === "true");
  };

  const isDetailsShown = (card) => {
    // const cardEl = getCardElement(card);
    // return cardEl && cardEl.classList.contains("up");
    return act(card, (cardEl) => cardEl.classList.contains("up"));
  };

  const showDetails = (card) => {
    // const cardEl = getCardElement(card);
    // cardEl.classList.add("up");
    act(card, (cardEl) => cardEl.classList.add("up"));
  };

  const hideDetails = (card) => {
    // const cardEl = getCardElement(card);
    // cardEl.classList.remove("up");
    act(card, (cardEl) => cardEl.classList.remove("up"));
  };

  const toggleDetails = (card) => {
    act(card, (cardEl) => cardEl.classList.toggle("up"));
  };

  const addToBoard = (card) => {
    act(card, (cardEl) => (cardEl.dataset.placed = "true"));
    blur(card);
    setSelectedCard(null);
  };

  const removeFromBoard = (card) => {
    act(card, (cardEl) => (cardEl.dataset.placed = "false"));
    removeBlur(card);
  };

  const blur = (card) => {
    act(card, (cardEl) => (cardEl.style.opacity = "0.5"));
  };

  const removeBlur = (card) => {
    if (isCardPlaced(card)) return;
    act(card, (cardEl) => (cardEl.style.opacity = "1"));
  };

  const setSelectedCard = (card) => {
    card = getCardElement(card);
    removeBlur(card);
    if (card) {
      cards.forEach((x) => {
        if (x !== card) {
          hideDetails(x);
          blur(x);
        }
      });
    } else {
      cards.forEach((x) => {
        hideDetails(x);
        removeBlur(x);
      });
    }
    if (cardSelectedHandler) cardSelectedHandler(card);
  };

  const getCardName = (cardEl) => {
    return cardEl.dataset.name;
  };

  const onCardSelected = (fn) => {
    cardSelectedHandler = fn;
  };

  const cardClickHandler = (event) => {
    const card = event.currentTarget;

    if (isCardPlaced(card)) return;

    toggleDetails(card);
    setSelectedCard(isDetailsShown(card) ? card : null);
  };

  cards.forEach((x) => x.addEventListener("click", cardClickHandler));

  return { onCardSelected, addToBoard, removeFromBoard, getCardName };
}
