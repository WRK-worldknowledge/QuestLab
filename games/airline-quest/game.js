startHelp("airlinequest")


let firstPick = null
let secondPick = null
let matchesLeft = 0
let isChecking = false

let time = 60
let timerInterval


const params =
    new URLSearchParams(
        location.search
    )


const gameType =
    params.get("type") ||
    "iata-airline"


const demo =
    params.get("demo") === "true"


/* =========================
   DATASET
========================= */

let dataFile


if(
    gameType === "logo-airline" ||
    gameType === "iata-logo"
){

    dataFile =
        "questmatch_logos.json"

}

else{

    dataFile =
        "questmatch_carriercodes_2026-2027.json"

}


/* =========================
   LOAD DATA
========================= */

const file =
    params.get("data")


const dataset =
    file ||
    dataFile


console.log(
    "GAME TYPE:",
    gameType
)


console.log(
    "DATA FILE:",
    dataset
)


fetch(
    "data/" + dataset
)

.then(
    response => {

        if(!response.ok){

            throw new Error(
                "Dataset not found: " +
                dataset
            )

        }

        return response.json()

    }
)

.then(
    data => {

        console.log(
            "DATA LOADED:",
            data
        )

        startGame(data)

    }
)

.catch(
    error => {

        console.error(
            error
        )

        alert(
            "Could not load the game data."
        )

    }
)


/* =========================
   SHUFFLE
========================= */

function shuffle(array){

    for(
        let i = array.length - 1;
        i > 0;
        i--
    ){

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            )


        const temp =
            array[i]


        array[i] =
            array[j]


        array[j] =
            temp

    }


    return array

}


/* =========================
   START GAME
========================= */

function startGame(data){

    clearInterval(
        timerInterval
    )


    time = 60


    const selectedPairs =
        shuffle(
            [...data]
        ).slice(
            0,
            7
        )


    matchesLeft =
        selectedPairs.length


    let tiles = []


    selectedPairs.forEach(
        pair => {


            /* =========================
               IATA ↔ AIRLINE
            ========================= */

            if(
                gameType ===
                "iata-airline"
            ){

                tiles.push({

                    type:
                        "airline",

                    value:
                        pair.airline,

                    match:
                        pair.iata

                })


                tiles.push({

                    type:
                        "iata",

                    value:
                        pair.iata,

                    match:
                        pair.iata

                })

            }


            /* =========================
               LOGO ↔ AIRLINE
            ========================= */

            else if(
                gameType ===
                "logo-airline"
            ){

                tiles.push({

                    type:
                        "image",

                    value:
                        pair.logo,

                    match:
                        pair.airline

                })


                tiles.push({

                    type:
                        "airline",

                    value:
                        pair.airline,

                    match:
                        pair.airline

                })

            }


            /* =========================
               IATA ↔ LOGO
            ========================= */

            else if(
                gameType ===
                "iata-logo"
            ){

                tiles.push({

                    type:
                        "iata",

                    value:
                        pair.iata,

                    match:
                        pair.airline

                })


                tiles.push({

                    type:
                        "image",

                    value:
                        pair.logo,

                    match:
                        pair.airline

                })

            }


            /* =========================
               AIRLINE ↔ COUNTRY
               NEXT GAME
            ========================= */

            else if(
                gameType ===
                "airline-country"
            ){

                tiles.push({

                    type:
                        "airline",

                    value:
                        pair.airline,

                    match:
                        pair.country

                })


                tiles.push({

                    type:
                        "country",

                    value:
                        pair.country,

                    match:
                        pair.country

                })

            }

        }
    )


    tiles =
        shuffle(
            tiles
        )


    const grid =
        document.getElementById(
            "grid"
        )


    if(!grid){

        console.error(
            "Grid element not found."
        )

        return

    }


    grid.innerHTML = ""


    tiles.forEach(
        (tile,index) => {

            const div =
                document.createElement(
                    "div"
                )


            div.className =
                "tile"


            /* =========================
               TIMER
            ========================= */

            if(index === 1){

                const timer =
                    document.createElement(
                        "div"
                    )


                timer.className =
                    "qTimerContainer"


                timer.innerHTML = `

                    <img
                        src="../../q.png"
                        class="qTimer"
                    >

                    <div id="qTime">
                        01:00
                    </div>

                `


                grid.appendChild(
                    timer
                )

            }


            /* =========================
               IMAGE TILE
            ========================= */

            if(
                tile.type ===
                "image"
            ){

                const img =
                    document.createElement(
                        "img"
                    )


                img.src =
                    "images/" +
                    tile.value


                img.alt =
                    "Airline logo"


                img.style.maxWidth =
                    "90%"


                img.style.maxHeight =
                    "90%"


                img.style.objectFit =
                    "contain"


                img.onerror =
                    () => {

                        console.error(
                            "Missing image:",
                            tile.value
                        )

                    }


                /* Long press / hold */

                let pressTimer


                img.addEventListener(
                    "touchstart",
                    () => {

                        pressTimer =
                            setTimeout(
                                () => {

                                    openImage(
                                        img.src
                                    )

                                },
                                500
                            )

                    }
                )


                img.addEventListener(
                    "touchend",
                    () => {

                        clearTimeout(
                            pressTimer
                        )

                    }
                )


                img.addEventListener(
                    "touchmove",
                    () => {

                        clearTimeout(
                            pressTimer
                        )

                    }
                )


                img.addEventListener(
                    "mousedown",
                    () => {

                        pressTimer =
                            setTimeout(
                                () => {

                                    openImage(
                                        img.src
                                    )

                                },
                                500
                            )

                    }
                )


                img.addEventListener(
                    "mouseup",
                    () => {

                        clearTimeout(
                            pressTimer
                        )

                    }
                )


                img.addEventListener(
                    "mouseleave",
                    () => {

                        clearTimeout(
                            pressTimer
                        )

                    }
                )


                div.appendChild(
                    img
                )

            }


            /* =========================
               TEXT TILE
            ========================= */

            else{

                div.innerText =
                    tile.value

            }


            /* =========================
               CLICK
            ========================= */

            div.onclick =
                () => {

                    selectTile(
                        div,
                        tile
                    )

                }


            grid.appendChild(
                div
            )

        }
    )


    /* =========================
       TIMER
    ========================= */

    updateTimer()


    timerInterval =
        setInterval(
            () => {

                time--


                updateTimer()


                if(time <= 0){

                    clearInterval(
                        timerInterval
                    )


                    timeUp()

                }

            },
            1000
        )

}


/* =========================
   TIMER DISPLAY
========================= */

function updateTimer(){

    const qTime =
        document.getElementById(
            "qTime"
        )


    if(!qTime)
        return


    const minutes =
        Math.floor(
            time / 60
        )


    const seconds =
        time % 60


    qTime.innerText =
        String(minutes)
            .padStart(
                2,
                "0"
            ) +
        ":" +
        String(seconds)
            .padStart(
                2,
                "0"
            )

}


/* =========================
   SELECT TILE
========================= */

function selectTile(
    div,
    tile
){

    if(isChecking)
        return


    if(
        firstPick &&
        firstPick.div === div
    ){

        return

    }


    if(!firstPick){

        firstPick = {

            div:
                div,

            tile:
                tile

        }


        div.classList.add(
            "selected"
        )


        return

    }


    secondPick = {

        div:
            div,

        tile:
            tile

    }


    checkMatch()

}


/* =========================
   CHECK MATCH
========================= */

function checkMatch(){

    isChecking = true


    const correct =
        firstPick.tile.match ===
        secondPick.tile.match


    const differentTypes =
        firstPick.tile.type !==
        secondPick.tile.type


    if(
        correct &&
        differentTypes
    ){

        firstPick.div.classList.add(
            "flip",
            "correct"
        )


        secondPick.div.classList.add(
            "flip",
            "correct"
        )


        setTimeout(
            () => {

                firstPick.div.style.visibility =
                    "hidden"


                secondPick.div.style.visibility =
                    "hidden"


                matchesLeft--


                reset()


                isChecking = false


                if(
                    matchesLeft === 0
                ){

                    finishGame()

                }

            },
            500
        )

    }

    else{

        firstPick.div.classList.add(
            "wrong"
        )


        secondPick.div.classList.add(
            "wrong"
        )


        setTimeout(
            () => {

                firstPick.div.classList.remove(
                    "wrong",
                    "selected"
                )


                secondPick.div.classList.remove(
                    "wrong",
                    "selected"
                )


                firstPick = null

                secondPick = null

                isChecking = false

            },
            600
        )

    }

}


/* =========================
   RESET
========================= */

function reset(){

    if(firstPick){

        firstPick.div.classList.remove(
            "selected"
        )

    }


    if(secondPick){

        secondPick.div.classList.remove(
            "selected"
        )

    }


    firstPick = null

    secondPick = null

}


/* =========================
   FINISH GAME
========================= */

function finishGame(){

    clearInterval(
        timerInterval
    )


    const timeBonus =
        Math.max(
            0,
            Math.floor(
                time / 20
            )
        )


    const xp =
        20 +
        timeBonus


    /* =========================
       DEMO
    ========================= */

    if(demo){

        const grid =
            document.getElementById(
                "grid"
            )


        const finish =
            document.getElementById(
                "finishScreen"
            )


        if(grid)
            grid.innerHTML = ""


        if(finish)
            finish.style.display =
                "block"


        return

    }


    /* =========================
       NORMAL GAME
    ========================= */

    if(
        typeof addXP ===
        "function"
    ){

        addXP(
            xp
        )

    }


    const grid =
        document.getElementById(
            "grid"
        )


    if(grid){

        grid.innerHTML = ""

    }


    const finish =
        document.getElementById(
            "finishScreen"
        )


    if(finish){

        finish.style.display =
            "block"


        const title =
            finish.querySelector(
                "h2"
            )


        if(title){

            title.innerText =
                "Mission Complete ✈️ +" +
                xp +
                " XP"

        }

    }

}


/* =========================
   IMAGE OVERLAY
========================= */

const overlay =
    document.getElementById(
        "imageOverlay"
    )


const overlayImg =
    document.getElementById(
        "overlayImage"
    )


function openImage(src){

    if(
        !overlay ||
        !overlayImg
    ){

        return

    }


    overlayImg.src =
        src


    overlay.style.display =
        "flex"

}


/* =========================
   CLOSE IMAGE
========================= */

if(overlay){

    overlay.onclick =
        () => {

            overlay.style.display =
                "none"

        }

}


/* =========================
   TIME UP
========================= */

function timeUp(){

    const restart =
        confirm(
            "Time's up!\n\nOK = Restart mission\nCancel = Back to Game Console"
        )


    if(restart){

        location.reload()

    }

    else{

        location.href =
            "index.html"

    }

}


/* =========================
   FINISH BUTTONS
========================= */

window.addEventListener(
    "DOMContentLoaded",
    () => {

        const newSessionBtn =
            document.getElementById(
                "newSessionBtn"
            )


        const backBtn =
            document.getElementById(
                "backBtn"
            )


        if(newSessionBtn){

            newSessionBtn.onclick =
                () => {

                    location.reload()

                }

        }


        if(backBtn){

            backBtn.onclick =
                () => {

                    window.history.back()

                }

        }

    }
)
