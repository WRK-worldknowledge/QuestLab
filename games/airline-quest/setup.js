document
    .getElementById("startBtn")
    .onclick = () => {

    const type =
        document.getElementById(
            "gameType"
        ).value;

    const demo =
        new URLSearchParams(
            location.search
        ).get("demo") === "true";

    if(demo){

        location.href =
            "game.html?demo=true&type=" +
            type;

        return;
    }

    const user =
        localStorage.getItem(
            "questlabUser"
        );

    let dataset =
        "airline_complete.json";

    if(
        user &&
        (
            user.endsWith(
                "@talnet.nl"
            ) ||
            user.endsWith(
                "@rebergen.org"
            )
        )
    ){
        dataset =
            "airline_rocva_full_array.json";
    }

    location.href =
        "game.html?data=" +
        dataset +
        "&type=" +
        type;
};
