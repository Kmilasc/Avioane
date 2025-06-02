let gridX = 16, gridY = 16;
let player = [], computer = [];
let playerAirplanes = [], computerAirplanes = [];
let playerLives = 0, computerLives = 0;
let playerScore = 0, computerScore = 0;
let positions = [];
let selectedAirplane = 1;
let playerTurn = true;
let canEditGrid = true

/* UP */
positions[0] = [[-2, 1], [-1, 1], [0, 1], [1, 1], [2, 1], [0, 2], [-1, 3], [0, 3], [1, 3]];

/* DOWN */
positions[1] = [[-2, -1], [-1, -1], [0, -1], [1, -1], [2, -1], [0, -2], [-1, -3], [0, -3], [1, -3]];

/* LEFT */
positions[2] = [[1, -2], [1, -1], [1, 0], [1, 1], [1, 2], [2, 0], [3, -1], [3, 0], [3, 1]];

/* RIGHT */
positions[3] = [[-1, -2], [-1, -1], [-1, 0], [-1, 1], [-1, 2], [-2, 0], [-3, -1], [-3, 0], [-3, 1]];


/*****************************/

const ids = ["e", "a", "t", "d", "m"];
const imagesIds = {
	Airplane: "a",
	Down: "d",
	Unknown: "e",
	Marked: "m",
	Taken: "t"
};

function loadImages() {
	console.log("loadImages/0")
	console.log = "Loading images... Please wait...";
	for (const element of ids) {
		let img = new Image();
		let name = "assets/av" + element + ".svg";
		img.src = name;
		// Assign the loaded image to a global variable or use it as needed
	}
	console.log = "Done";
}


function resetGame() {
	canEditGrid = true;
	console.log("resetGame/0")
	document.getElementById("replayButton").style.display = "none";
	document.getElementById("setupTable").style.display = "";
	document.getElementById("playerZone").innerHTML = "";
	document.getElementById("computerZone").innerHTML = "";
	playerLives = 5;
	computerLives = 5;
	document.getElementById("playerLives").innerHTML = playerLives;
	document.getElementById("computerLives").innerHTML = computerLives;
	preview();
}

function preview() {
	console.log("preview/0")
	
	if(!canEditGrid) return
	player = initializePlayer(true);
	if (player) displayGrid(false);
}

function startGame() {
	console.log("startGame/0")
	if (!(player = initializePlayer(false))) return;
	if (!(computer = initializeComputer())) return;

	playerTurn = true; 
	canEditGrid = false; 
	document.getElementById("setupTable").style.display = "none";
	document.getElementById("playerLives").innerHTML = playerLives;
	document.getElementById("computerLives").innerHTML = computerLives;
	displayGrid(true);
	displayGrid(false);
}

function showMessage(msg) {
    let box = document.getElementById("messageBox");
    if (!box) {
        box = document.createElement("div");
        box.id = "messageBox";
        box.style.display = "none";
        box.style.position = "fixed";
        box.style.top = "10px";
        box.style.left = "50%";
        box.style.transform = "translateX(-50%)";
        box.style.background = "#222";
        box.style.color = "#fff";
        box.style.padding = "10px 20px";
        box.style.borderRadius = "5px";
        box.style.zIndex = "1000";
        document.body.appendChild(box);
    }
    box.innerText = msg;
    box.style.display = "block";
    setTimeout(() => { box.style.display = "none"; }, 4000);
}

function initializePlayer(preview) {
    console.log("initializePlayer/0")
    let x, y, j, p, varfx, varfy, nrAvion = 0, orientare;

    let grid = [];
    for (y = 0; y < gridX; ++y) {
        grid[y] = [];
        for (x = 0; x < gridX; ++x)
            grid[y][x] = [imagesIds.Unknown, -1, 0];
    }

    playerLives = 0;

    for (j = 1; j < 6; j++) {
        varfx = document.getElementById("pozx" + j).value;
        varfy = document.getElementById("pozy" + j).value;

        if (varfx == "" || varfy == "") {
            if (!preview) {
                showMessage("Fill in the board with 5 planes!!!");
                return false;
            }
            else
                continue;
        }

        varfx = parseInt(varfx) - 1;
        varfy = parseInt(varfy) - 1;

        orientare = parseInt(document.getElementById("dir" + j).value);

        // checking the position of the airplane

        if (varfx < 0 || varfx >= gridX || varfy < 0 || varfy >= gridY || grid[varfy][varfx][0] == "a") {
            showMessage("Plane " + j + " was not set right!!!");
            document.getElementById("pozx" + j).focus();
            return false;
        }

        for (p = 0; p < 9; p++) {
            let pozx = positions[orientare][p][0] + varfx;
            let pozy = positions[orientare][p][1] + varfy;

            if (pozx >= gridX || pozx < 0 || pozy >= gridY || pozy < 0) {
                showMessage("Plane " + j + " was not set right!!!");
                document.getElementById("pozx" + j).focus();
                return false;
            }

            if (grid[pozy][pozx][0] == "a") {
                showMessage("Plane " + j + " overlaps another plane!!!");
                document.getElementById("pozx" + j).focus();
                return false;
            }
        }

        for (p = 0; p < 9; p++) {
            let pozx = positions[orientare][p][0] + varfx;
            let pozy = positions[orientare][p][1] + varfy;
            grid[pozy][pozx][0] = "a";
            grid[pozy][pozx][1] = nrAvion;
        }
        grid[varfy][varfx][0] = "a";
        grid[varfy][varfx][1] = nrAvion;
        grid[varfy][varfx][2] = "cap";

        playerAirplanes[nrAvion] = 10;
        playerLives++;
        nrAvion++;
    }
    return grid;
}

function initializeComputer() {
	console.log("initializeComputer/0")
	let y, x, p, grid, orientare;
	grid = [];
	for (y = 0; y < gridX; ++y) {
		grid[y] = [];
		for (x = 0; x < gridX; ++x)
			grid[y][x] = ["e", -1, 0];
	}
	let j, ok, varfx, varfy, nrAvion = 0;
	computerLives = 0;
	for (j = 0; j < 5; j++) {
		do {
			varfx = Math.floor(Math.random() * 12 + 2);
			varfy = Math.floor(Math.random() * 12 + 2);
			orientare = Math.round(Math.random() * 3);
			ok = true;

			// checking the position of the airplane
			if (grid[varfy][varfx][0] == "a") {
				ok = false;
				continue;
			}

			for (p = 0; p < 9; p++) {
				let pozx = positions[orientare][p][0] + varfx;
				let pozy = positions[orientare][p][1] + varfy;
				if ((pozx >= gridX || pozx < 0) || (pozy >= gridY || pozy < 0)) {
					ok = false;
					break;
				}

				if (grid[pozy][pozx][0] == "a") {
					ok = false;
					break;
				}
			}

		} while (!ok);

		for (p = 0; p < 9; p++) {
			let pozx = positions[orientare][p][0] + varfx;
			let pozy = positions[orientare][p][1] + varfy;
			grid[pozy][pozx][0] = "a";
			grid[pozy][pozx][1] = nrAvion;
		}
		grid[varfy][varfx][0] = "a";
		grid[varfy][varfx][1] = nrAvion;
		grid[varfy][varfx][2] = "cap";

		computerAirplanes[nrAvion] = 10;
		computerLives++;
		nrAvion++;
	}
	return grid;
}


function setImage(y, x, id, isComputer) {
	console.log("setImage/4")
	if (isComputer) {
		computer[y][x][0] = id;
		document.images["pc" + y + "_" + x].src = "src/assets/av" + id + ".svg";
	}
	else {
		player[y][x][0] = id;
		document.images["ply" + y + "_" + x].src = "src/assets/av" + id + ".svg";
	}
}

function displayGrid(isComputer) {
	console.log("displayGrid/1")
	let y, x, s;
	s = '<div class="only-numbers-row">';
	for (y = 0; y < gridY; y++) {
		s += '<div class="number-x">' + (y + 1) + '</div>';
	}
	s += '</div>';
	if (isComputer) {
		for (y = 0; y < gridY; y++) {
			s += '<div class="row">'
			for (x = 0; x < gridX; x++) {
				s += '<button onclick="javascript:gridClick(' + y + ',' + x + ');"><img class="img-grid" name="pc' + y + '_' + x + '" src="src/assets/ave.svg" width=16 height=16><div class="overlay"></div></button>';
			}
			s += '<div class="number-y">' + (y + 1) + '</div>';
			s += '</div>';
		}
	} else {
		for (y = 0; y < gridY; y++) {
			s += '<div class="row">'
			s += '<div class="number-y">' + (y + 1) + '</div>';
			for (x = 0; x < gridX; x++) {
				s += '<button onmouseover="javascript:previewHover(' + y + ',' + x + ');" onmouseout="javascript:clearPreview();" onclick="javascript:playerGridClick(' + y + ',' + x + ');"><img class="img-grid" name="ply' + y + '_' + x + '" src="src/assets/av' + player[y][x][0] + '.svg" width=16 height=16><div class="overlay"></div></button>';
			}
			s += '</div>';
		}
	}

	if (isComputer)
		document.getElementById("computerZone").innerHTML = s;
	else
		document.getElementById("playerZone").innerHTML = s;
}

function playerGridClick(y, x) {
	console.log("playerGridClick/2")
	if (selectedAirplane) {
		document.getElementById("pozx" + selectedAirplane).value = x + 1;
		document.getElementById("pozy" + selectedAirplane).value = y + 1;
		preview();
	}
}

function gridClick(y, x) {
    console.log("gridClick/2")
    if (playerTurn) {
        if ((computer[y][x][2] == "cap") && (computer[y][x][0] == "a")) {
            let nrAvion = computer[y][x][1];
            computerAirplanes[nrAvion] = 0;
            shootDownAirplane(computer, nrAvion, true);
            showMessage("You struck down one of the opponent's planes!!!");
            if (--computerLives == 0) {
                showMessage("YOU WON!!! CONGRATS :)");
                playerScore++;
                document.getElementById("playerScore").innerHTML = playerScore;
                document.getElementById("replayButton").style.display = "";
                playerTurn = false;
            }
            document.getElementById("computerLives").innerHTML = computerLives;
        } else
            if (computer[y][x][0] == "a") {
                setImage(y, x, imagesIds.Taken, true);
                let nrAvion = computer[y][x][1];
                if (--computerAirplanes[nrAvion] == 0) {
                    shootDownAirplane(computer, nrAvion, true);
                    showMessage("YOUR AIRPLANE WAS SHOT DOWN!!!");
                    if (--computerLives == 0) {
                        showMessage("YOU LOST!!! :(");
                        playerTurn = false;
                        playerScore++;
                        document.getElementById("playerScore").innerHTML = playerScore;
                        document.getElementById("replayButton").style.display = "";
                    }
                    document.getElementById("computerLives").innerHTML = computerLives;
                }


                if (playerTurn) computerGridClick();
            }
            else if (computer[y][x][0] == "e") {
                setImage(y, x, imagesIds.Marked, true);
                computerGridClick();
            }
    }
}

function computerGridClick() {
    console.log("computerGridClick/0")
    let x, y, selectedX, selectedY;
    let selected = false;

    for (y = 0; y < gridY && !selected; ++y) {
        for (x = 0; x < gridX && !selected; ++x) {
            if (player[y][x][0] == "t") {
                selectedX = x; selectedY = y;

                if ((x - 1 >= 0) && ((player[y][x - 1][0] == "a") || (player[y][x - 1][0] == "e"))) {
                    selectedX = x - 1;
                    selected = true;
                } else if ((x + 1 < gridX) && ((player[y][x + 1][0] == "a") || (player[y][x + 1][0] == "e"))) {
                    selectedX = x + 1;
                    selected = true;
                } else if ((y - 1 >= 0) && ((player[y - 1][x][0] == "a") || (player[y - 1][x][0] == "e"))) {
                    selectedY = y - 1;
                    selected = true;
                } else if ((y + 1 < gridY) && ((player[y + 1][x][0] == "a") || (player[y + 1][x][0] == "e"))) {
                    selectedY = y + 1;
                    selected = true;
                }
            }
        }
    }

    if (!selected) {
        do {
            selectedY = Math.floor(Math.random() * (gridY - 1));
            selectedX = Math.floor(Math.random() * (gridX - 1));
        } while ((player[selectedY][selectedX][0] == "t") || (player[selectedY][selectedX][0] == "d") || (player[selectedY][selectedX][0] == "m"));
    }

    if ((player[selectedY][selectedX][2] == "cap") || (player[selectedY][selectedX][0] == "a")) {
        setImage(selectedY, selectedX, imagesIds.Taken, false);
        let nrAvion = player[selectedY][selectedX][1];
        if (player[selectedY][selectedX][2] == "cap") {
            playerAirplanes[nrAvion] = 1;
        }
        if (--playerAirplanes[nrAvion] == 0) {
            shootDownAirplane(player, nrAvion, false);
            showMessage("One of your planes was struck down!!!");
            playerLostLive()
        }
    } else if (player[selectedY][selectedX][0] == "e") {
        setImage(selectedY, selectedX, imagesIds.Marked, false);
    }

    document.getElementById("playerLives").innerHTML = playerLives;
}

function playerLostLive() {
    console.log("playerLostLive/0")
    if (--playerLives == 0) {
        displayEnemyAirplanes();
        showMessage("YOU LOST :(\n");
        playerTurn = false;

        computerScore++;
        document.getElementById("computerScore").innerHTML = computerScore;
        document.getElementById("replayButton").style.display = "";
    }
}

function shootDownAirplane(grid, nrAvion, isComputer) {
	console.log("shootDownAirplane/3")
	let y, x;
	for (y = 0; y < gridX; ++y) {
		for (x = 0; x < gridX; ++x) {
			if (grid[y][x][1] == nrAvion)
				if (isComputer) setImage(y, x, imagesIds.Down, true);
				else setImage(y, x, imagesIds.Down, false);
		}
	}
}


function displayEnemyAirplanes() {
	console.log("displayEnemyAirplanes/0")
	console.log("DisplayAirplanes")
	let y, x;
	for (y = 0; y < gridX; ++y) {
		for (x = 0; x < gridX; ++x) {
			if (computer[y][x][0] == "t")
				setImage(y, x, imagesIds.Down, true);
			else if (computer[y][x][0] == "a")
				setImage(y, x, imagesIds.Airplane, true);
		}
	}
}

function validateCoordinateInput(e) {
	const input = e;
	const value = parseInt(input.value);
	const max = parseInt(input.getAttribute("max"));
	const min = parseInt(input.getAttribute("min"));

    if (isNaN(value) || value < min || value > max) {
		input.value = "";
		showMessage(`Please enter a number between ${min} and ${max}.`);
		input.focus();
	} else {
		preview();
	}

}

function previewHover(y, x) {
    if (!canEditGrid || !selectedAirplane) return;
    
    let orientare = parseInt(document.getElementById("dir" + selectedAirplane).value);
    let previewCells = [];
    
    // Add the head position
    previewCells.push([y, x]);
    
    // Add the airplane body positions
    for (let p = 0; p < 9; p++) {
        let pozx = positions[orientare][p][0] + x;
        let pozy = positions[orientare][p][1] + y;
        
        if (pozx >= 0 && pozx < gridX && pozy >= 0 && pozy < gridY) {
            previewCells.push([pozy, pozx]);
        }
    }
    
    // Apply preview style to all cells
    previewCells.forEach(([py, px]) => {
        let button = document.querySelector(`button[onclick*="playerGridClick(${py},${px})"]`);
        if (button) {
            button.classList.add('preview-hover');
        }
    });
}

function clearPreview() {
    document.querySelectorAll('.preview-hover').forEach(element => {
        element.classList.remove('preview-hover');
    });
}