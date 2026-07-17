document
    .getElementById("startBtn")
    .onclick = () => {

    const type =
        document
        .getElementById("gameType")
        .value;

    location.href =
        "game.html" +
        "?data=airline_complete.json" +
        "&type=" + type;
};
