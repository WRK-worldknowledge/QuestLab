document
    .getElementById("startBtn")
    .onclick = () => {

    const type =
        document.getElementById(
            "gameType"
        ).value;


    if(!type){

        alert(
            "Please select a game type"
        );

        return;
    }


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


    let dataset;


    if(
        type === "iata-airline" ||
        type === "airline-country"
    ){

        dataset =
            "questmatch_carriercodes_2026-2027.json";

    }


    if(
        type === "logo-airline" ||
        type === "iata-logo"
    ){

        dataset =
            "questmatch_logos.json";

    }


    location.href =
        "game.html?data=" +
        dataset +
        "&type=" +
        type;
};
