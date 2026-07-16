let seconds = 60;

setInterval(() => {

    seconds--;

    const min =
        String(
            Math.floor(seconds/60)
        ).padStart(2,"0");

    const sec =
        String(
            seconds%60
        ).padStart(2,"0");

    document.getElementById(
        "qTime"
    ).innerHTML =
        min + ":" + sec;

},1000);
