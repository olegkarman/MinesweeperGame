var levelDifficulty = 0;
var tableWidth = 0;
var tableHeight = 0;
var tableCreated = false;
var clockStarted = false;
var gameStarted = false;
var gameEnded = false;
var mines = 0;
var timer = 0;
var counterFunction;
var clicksFunction;
var tilesArray = new Array();
var neighborsPos = [[-1,1],[0,1],[1,1],[-1,0],[1,0],[-1,-1],[0,-1],[1,-1]];
var leftButtonPressed = false;
var rightButtonPressed = false;

function startClock() {
    counterFunction = setInterval(function(){ 
        if (timer < 1000) {
            timer++;
            document.getElementById('time_counter').innerHTML = ""+timer;
        } 
    }, 1000);
}

function stopClock() {
    clearInterval(counterFunction);
    clockStarted = false;
}

function clearClicks() {
    clicksFunction = setTimeout(function(){
        leftButtonPressed = false;
        rightButtonPressed = false;

        for (var i = 0; i < tilesArray.length; i++) {
            if (tilesArray[i].help) {
                tilesArray[i].help = false;
                removeHighlight(i);
            }
        }
    }, 200);
}

function disableContext() {
    return false;
}

function checkType(id) {
    if (tilesArray[id].type === "mine") return true;
}

function cleanTable() {
    while (document.getElementById('table-container').hasChildNodes()) {
        document.getElementById('table-container').removeChild(document.getElementById('table-container').lastChild);
    }
}

function deletePreviousTable() {
    var tmpTable = document.getElementById('minesweeper-table');
    tmpTable.parentNode.removeChild(tmpTable);
}

function highlightTiles(id) {
    tilesArray[id].help = true;
    var tile = document.getElementById("tile-"+(id+1));
    tile.className += " help";
}

function removeHighlight(id) {
    var tile = document.getElementById("tile-"+(id+1));
    tile.className = tile.className.split(" ")[0];
}

function changeLevel(lvldif) {
    if (levelDifficulty != lvldif) {
        levelDifficulty = lvldif;

        if (tableCreated) deletePreviousTable();

        tableCreated = false;
    }

    newLevel();
}

function newLevel() {
    gameStarted = true;
    gameEnded = false;
    stopClock();
    if (tilesArray.length > 0) tilesArray = [];

    cleanTable();

    var container = document.getElementById('table-container');
    var sweeperTable = document.createElement('table');
    sweeperTable.setAttribute('id', 'minesweeper-table')
    sweeperTable.setAttribute('frame', 'box');
    var sweeperTableBody = document.createElement('tbody');

    switch (levelDifficulty) {
        case 1:
            tableHeight = 8;
            tableWidth = 8;
            mines = 10;
            break;
        case 2:
            tableHeight = 16;
            tableWidth = 16;
            mines = 40;
            break;
        case 3:
            tableHeight = 16;
            tableWidth = 30;
            mines = 99;
            break;
        default:
            break;
    }

    var _loop = function _loop(i) {
        tr = document.createElement("tr");

        var _loop2 = function _loop2(j) {
            td = document.createElement("td");


            if (i == 0) {
                td.setAttribute("class", "tile");
                td.setAttribute("id", "header-tile");
                td.setAttribute("colSpan", tableWidth + 1);

                prepareHeaderTitle(td);

                tr.appendChild(td);
                return 'break';
            } else {
                td.setAttribute("class", "tile");
                td.setAttribute("id", "tile-" + (i + j * tableHeight));

                td.oncontextmenu = disableContext;
                if (td.addEventListener) {

                    td.addEventListener("mousedown", function (e) {
                        if (!gameEnded) {
                            document.getElementById("smiley").src = "res/png/danger.png";
                            if (e.button === 0) leftButtonPressed = true;
                            if (e.button === 2) rightButtonPressed = true;

                            if (leftButtonPressed && rightButtonPressed) {
                                revealNeighbors(i + j * tableHeight);
                            }
                        }
                    }, false);
                    td.addEventListener("mouseup", function (e) {
                        if (tilesArray.length > 0) {
                            document.getElementById("smiley").src = "res/png/smiley.png";
                            if (e.button === 0 && !rightButtonPressed) clickTile(i + j * tableHeight);
                            if (e.button === 2 && !leftButtonPressed) putFlag(i + j * tableHeight);

                            clearClicks();
                        }
                    }, false);
                } else {
                    if (td.attachEvent) {
                        td.attachEvent("onmousedown", function (e) {
                            if (!gameEnded) {
                                document.getElementById("smiley").src = "res/png/danger.png";

                                if (e.button === 0) leftButtonPressed = true;
                                if (e.button === 2) rightButtonPressed = true;

                                if (leftButtonPressed && rightButtonPressed) {
                                    revealNeighbors(i + j * tableHeight);
                                }
                            }
                        });
                    
                        td.attachEvent("onmouseup", function (e) {
                            if (tilesArray.length > 0) {
                                document.getElementById("smiley").src = "res/png/smiley.png";
                                if (e.button === 0 && !rightButtonPressed) clickTile(i + j * tableHeight);
                                if (e.button === 2 && !leftButtonPressed) putFlag(i + j * tableHeight);

                                clearClicks();
                            }
                        });
                    }
                }
                tr.appendChild(td);
            }
        };

        for (var j = 0; j < tableWidth; j++) {
            var _ret2 = _loop2(j);

            if (_ret2 === 'break') break;
        }
        sweeperTableBody.appendChild(tr);
    };

    for (var i = 0; i < tableHeight + 1; i++) {
        var tr;
        var td;

        _loop(i);
    }

    sweeperTable.appendChild(sweeperTableBody);
    container.appendChild(sweeperTable);

    timer = 0;
    document.getElementById("time_counter").innerHTML = ""+timer;

    setMines(mines);
}

function prepareHeaderTitle(data) {
    mineCounterDiv = document.createElement("div");
    mineCounterDiv.setAttribute("id","mine_counter");
    mineCounterDiv.setAttribute("class","counter");
    mineCounterDiv.innerHTML += mines;

    smileyImg = document.createElement("img");
    smileyImg.setAttribute("id","smiley");
    smileyImg.setAttribute("src","res/png/smiley.png");
    if (smileyImg.addEventListener) {
        smileyImg.addEventListener("mouseup", function () {
            newLevel();
        }, false);
    } else {
        if (smileyImg.attachEvent) {
            smileyImg.attachEvent("onmouseup", function () {
                newLevel();
            });
        }
    }

    timeCounterDiv = document.createElement("div");
    timeCounterDiv.setAttribute("id","time_counter");
    timeCounterDiv.setAttribute("class","counter");
    timeCounterDiv.innerHTML += ""+timer;

    data.appendChild(mineCounterDiv);
    data.appendChild(smileyImg);
    data.appendChild(timeCounterDiv);
}

function setMines(minesLeft) {
    for (var i = 0; i < tableWidth; i++) {
        for (var j = 0; j < tableHeight; j++) {
            if (tilesArray[tableHeight*i+j] === undefined || tilesArray[tableHeight*i+j].type === "empty") {
                if (Math.random() > 0.95 && minesLeft > 0) {
                    tilesArray[tableHeight*i+j] = {
                        "type":"mine",
                        "flagged":false,
                        "opened":false,
                        "help":false,
                        "xy":[i,j],
                        "id":tableHeight*i+j
                    };
                    minesLeft--;
                } else {
                    tilesArray[tableHeight*i+j] = {
                        "type":"empty",
                        "flagged":false,
                        "opened":false,
                        "help":false,
                        "xy":[i,j],
                        "id":tableHeight*i+j
                    };
                }
            }
        }
    }
    if (minesLeft > 0) setMines(minesLeft);
}

function clickTile(id) {
    if (clockStarted === false) {
        startClock();
        clockStarted = true;
    } 
    if (gameStarted === true && gameEnded === true) {
        newLevel();
    } else {
        if (tilesArray[(id-1)].type !== "mine" && tilesArray[(id-1)].opened === false) {
            openTile(id-1);
        } else if (tilesArray[(id-1)].type === "mine") {
            gameOver(id-1);
        }
    }
}

function revealNeighbors(id) {
    if (tilesArray[id-1].opened && tilesArray[id-1].type === "empty") {
        var tmpData = ifMinesOpened(id-1);
        if (tmpData.flagged) {
            for (var i = 0; i < tmpData.neighbors.length; i++) {
                if (tilesArray[tmpData.neighbors[i]].type === "empty"
                 && tilesArray[tmpData.neighbors[i]].opened === false) openTile(tilesArray[tmpData.neighbors[i]].id);
            }
        } else {
            for (var i = 0; i < tmpData.neighbors.length; i++) {
                if (tilesArray[tmpData.neighbors[i]].opened === false &&
                    tilesArray[tmpData.neighbors[i]].flagged === false) highlightTiles(tilesArray[tmpData.neighbors[i]].id);
            }
        }
    }
}

function ifMinesOpened(id) {
    var tmpNeighbors = [];
    var minesFlagged = true;

    for (var i = 0; i < neighborsPos.length; i++) {
        var curX = tilesArray[id].xy[0];
        var curY = tilesArray[id].xy[1];
        for (var j = 0; j < tilesArray.length; j++) {
            if (j !== id) {
                if (tilesArray[j].xy[0] === curX + neighborsPos[i][0] &&
                    tilesArray[j].xy[1] === curY + neighborsPos[i][1]) {
                    tmpNeighbors.push(j);
                }
            }
        }
    }

    for (var z = 0; z < tmpNeighbors.length; z++) {
        if (tilesArray[tmpNeighbors[z]].type === "mine" && !tilesArray[tmpNeighbors[z]].flagged 
        || tilesArray[tmpNeighbors[z]].type === "empty" && tilesArray[tmpNeighbors[z]].flagged) {
            minesFlagged = false;
            break;
        }
    }

    if (minesFlagged) return {"flagged": true, "neighbors": tmpNeighbors};
    else return {"flagged": false, "neighbors": tmpNeighbors}
}

function openTile(id) {

    var tileCounter = 0;
    var tmpNeighbors = [];

    tilesArray[id].opened = true;

    for (var i = 0; i < neighborsPos.length; i++) {
        var curX = tilesArray[id].xy[0];
        var curY = tilesArray[id].xy[1];
        for (var j = 0; j < tilesArray.length; j++) {
            if (j !== id) {
                if (tilesArray[j].xy[0] === curX + neighborsPos[i][0] &&
                    tilesArray[j].xy[1] === curY + neighborsPos[i][1]) {
                    tmpNeighbors.push(j);
                    if (checkType(j)) tileCounter++;
                }
            }
        }
    }

    var curTile = document.getElementById("tile-"+(id+1));
    curTile.removeAttribute("class");

    if (tileCounter !== 0) {
        curTile.innerHTML = tileCounter;
        var className = "tileOpened to"+tileCounter;
        curTile.setAttribute("class", className);
    }
    else {
        curTile.setAttribute("class", "emptyTile");

        for (var z = 0; z < tmpNeighbors.length; z++) {
            if (tilesArray[tmpNeighbors[z]].opened === false && tilesArray[tmpNeighbors[z]].type !== "mine") openTile(parseInt(tmpNeighbors[z]));
        }
    }

    if (mines === 0) {
        checkIfWin();
    }
}

function putFlag(id) {
    if (gameStarted === false) {
        startClock();
        gameStarted = true;
    }

    if (!tilesArray[(id-1)].flagged && !tilesArray[(id-1)].opened) {
        document.getElementById("tile-"+id).innerHTML += "!";
        tilesArray[(id-1)].flagged = true;
        mines--;
        document.getElementById("mine_counter").innerHTML = mines;
    } else if (tilesArray[(id-1)].flagged) {
        document.getElementById("tile-"+id).innerHTML = "";
        tilesArray[(id-1)].flagged = false;
        mines++;
        document.getElementById("mine_counter").innerHTML = mines;
    }

    if (mines === 0) {
        checkIfWin();
    }
}

function gameOver(id) {
    stopClock();
    gameEnded = true;

    for (i = 0; i < tilesArray.length; i++) {
        if (tilesArray[i].type === "mine") {
            var curTile = document.getElementById("tile-"+(i+1));
            var clone = curTile.cloneNode();
            while (curTile.firstChild) {
                clone.appendChild(curTile.lastChild);
            }
            curTile.parentNode.replaceChild(clone, curTile);
            if (!tilesArray[i].flagged) clone.innerHTML = "*";
            clone.removeAttribute("class");
            if (id !== i) clone.setAttribute("class","tileOpened");
            else clone.setAttribute("class","tileOpened tiledPressed");
            document.getElementById("smiley").src = "res/png/dead.png";
        } else {
            if (tilesArray[i].flagged) {
                var curTile = document.getElementById("tile-"+(i+1));
                curTile.innerHTML = "X";
            }
        }
    }

    tilesArray = [];
}

function checkIfWin() {
    var tableFullyOpened = true;

    for (var i = 0; i < tilesArray.length; i++) {
        if (tilesArray[i].type === "mine") {
            if (!tilesArray[i].flagged) {
                tableFullyOpened = false;
                break;
            }
        }
        if (tilesArray[i].type === "empty") {
            if (!tilesArray[i].opened) {
                tableFullyOpened = false;
                break;
            }
        }
    }

    if (tableFullyOpened) gameWin();
}

function gameWin() {
    document.getElementById("smiley").src = "res/png/complete.png";
    stopClock();
}