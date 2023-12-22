let pieces = [ 
    ["b", "rook", "A8"], 
    ["b", "knight", "B8"],
    ["b", "bishop", "C8"],
    ["b", "queen", "D8"],
    ["b", "king", "E8"],
    ["b", "bishop", "F8"],
    ["b", "knight", "G8"],
    ["b", "rook", "H8"],
    ["b", "pawn", "A7"], 
    ["b", "pawn", "B7"],
    ["b", "pawn", "C7"],
    ["b", "pawn", "D7"],
    ["b", "pawn", "E7"],
    ["b", "pawn", "F7"],
    ["b", "pawn", "G7"],
    ["b", "pawn", "H7"],
    ["w", "rook", "A1"], 
    ["w", "knight", "B1"],
    ["w", "bishop", "C1"],
    ["w", "queen", "D1"],
    ["w", "king", "E1"],
    ["w", "bishop", "F1"],
    ["w", "knight", "G1"],
    ["w", "rook", "H1"],
    ["w", "pawn", "A2"], 
    ["w", "pawn", "B2"],
    ["w", "pawn", "C2"],
    ["w", "pawn", "D2"],
    ["w", "pawn", "E2"],
    ["w", "pawn", "F2"],
    ["w", "pawn", "G2"],
    ["w", "pawn", "H2"],
]

// create table element
var table = document.createElement("table");

function updateTable() {
    // clear any innerHTML that could exist in the present table
    table.innerHTML = "";

    // board sources
    const l_square = "assets/images/board/square brown light_2x_ns.png";
    const d_square = "assets/images/board/square brown dark_2x_ns.png";

    // create 8 rows
    for (var i = 0; i < 8; i++) {
        // create the row with the "tr" element
        var row = document.createElement("tr");

        // create 8 columns
        for (var j = 0; j < 8; j++) {
            // create the cell with the "th" element
            var cell = document.createElement("td");

            // determine cell id
            // assign cell id to cell
            // add class styling for cell
            var cellID = determineCellID(i, j);
            cell.id = cellID;
            cell.className = "overlay-container";

            // create img element for board square
            // add class styling for board image
            // determine parity for light and dark squares
            // append the image to the cell
            var square = document.createElement("img");
            square.className = "board-image";
            square.src = (j + i) % 2 === 0 ? d_square : l_square;
            cell.appendChild(square);

            // get piece index
            var index = pieceExists(cellID);

            // determine if piece exists in this cell
            if (index > -1) {
                // create img element for piece
                // add class styling for piece image
                var piece = document.createElement("img");
                piece.className = "piece-image";
                piece.src = getPieceImageSource(pieces[index][0], pieces[index][1]);
                cell.appendChild(piece);
            }

            // append the cell to the row
            row.appendChild(cell);
        }

        // append row to the table
        table.appendChild(row);
    }

    // append table to the body of the html
    document.body.appendChild(table);
}



function isPathClear(startSquare, endSquare) {
    const startFile = startSquare.charAt(0);
    const startRank = parseInt(startSquare.charAt(1), 10);
    const endFile = endSquare.charAt(0);
    const endRank = parseInt(endSquare.charAt(1), 10);

    const fileDirection = startFile === endFile ? 0 : startFile < endFile ? 1 : -1;
    const rankDirection = startRank === endRank ? 0 : startRank < endRank ? 1 : -1;

    let currentFile = startFile.charCodeAt(0) + fileDirection;
    let currentRank = startRank + rankDirection;

    while (currentFile !== endFile.charCodeAt(0) || currentRank !== endRank) {
        const currentSquare = String.fromCharCode(currentFile) + currentRank.toString();

        // check if any piece exists in the path
        if (pieceExists(currentSquare) !== -1) {
            return false; // path is not clear
        }

        currentFile += fileDirection;
        currentRank += rankDirection;
    }

    return true; // path is clear
}



function determineLegality(pieceIndex, destination) {
    const type = pieces[pieceIndex][1];
    const color = pieces[pieceIndex][0];
    const currentSquare = pieces[pieceIndex][2];
    const destinationFile = destination.charAt(0);
    const destinationRank = parseInt(destination.charAt(1), 10);
    let fileDifference = 0;
    let rankDifference = 0;
    let capturedPieceIndex = 0;

    // what type of piece is it?
    switch (type) {
        case "rook":
            // Check if the destination is along a rank or file
            fileDifference = Math.abs(currentSquare.charCodeAt(0) - destinationFile.charCodeAt(0));
            rankDifference = Math.abs(parseInt(currentSquare.charAt(1), 10) - destinationRank);

            if (fileDifference === 0 || rankDifference === 0) {
                // Check if the path is clear
                if (isPathClear(currentSquare, destination)) {
                    // Check if the destination square is empty or has an opponent's piece
                    capturedPieceIndex = pieceExists(destination);
                    if (capturedPieceIndex === -1 || pieces[capturedPieceIndex][0] !== color) {
                        return true;
                    }
                }
            }

            return false;
        case "knight":
            // Check if the destination is a valid L-shaped move
            fileDifference = Math.abs(currentSquare.charCodeAt(0) - destinationFile.charCodeAt(0));
            rankDifference = Math.abs(parseInt(currentSquare.charAt(1), 10) - destinationRank);

            if ((fileDifference === 2 && rankDifference === 1) || (fileDifference === 1 && rankDifference === 2)) {
                // Check if the destination square is empty or has an opponent's piece
                capturedPieceIndex = pieceExists(destination);
                if (capturedPieceIndex === -1 || pieces[capturedPieceIndex][0] !== color) {
                    return true;
                }
            }

            return false;
        case "bishop":
            // check if destination is along a diagonal
            fileDifference = Math.abs(currentSquare.charCodeAt(0) - destinationFile.charCodeAt(0));
            rankDifference = Math.abs(parseInt(currentSquare.charAt(1), 10) - destinationRank);

            if (fileDifference === rankDifference) {
                // check if path is clear
                if (isPathClear(currentSquare, destination)) {
                    // check if destination square is empty or has an opponent's piece
                    capturedPieceIndex = pieceExists(destination);
                    if (capturedPieceIndex === -1 || pieces[capturedPieceIndex][0] !== color) {
                        return true;
                    }
                }
            }

            return false;
            break;
        case "queen":
            // check if destination is along a rank, file, or diagonal
            fileDifference = Math.abs(currentSquare.charCodeAt(0) - destinationFile.charCodeAt(0));
            rankDifference = Math.abs(parseInt(currentSquare.charAt(1), 10) - destinationRank);
    
            // queen can move along a rank, file, or diagonal
            if (
                fileDifference === 0 || rankDifference === 0 || fileDifference === rankDifference
            ) {
                // check if the path is clear
                if (isPathClear(currentSquare, destination)) {
                    // check if destination square is empty or has an opponent's piece
                    capturedPieceIndex = pieceExists(destination);
                    if (capturedPieceIndex === -1 || pieces[capturedPieceIndex][0] !== color) {
                        return true;
                    }
                }
            }
    
            return false;
        case "king":
            // Check if the destination is within one square in any direction
            fileDifference = Math.abs(currentSquare.charCodeAt(0) - destinationFile.charCodeAt(0));
            rankDifference = Math.abs(parseInt(currentSquare.charAt(1), 10) - destinationRank);

            if (fileDifference <= 1 && rankDifference <= 1) {
                // Check if the destination square is empty or has an opponent's piece
                capturedPieceIndex = pieceExists(destination);
                if (capturedPieceIndex === -1 || pieces[capturedPieceIndex][0] !== color) {
                    return true;
                }
            }
            return false;
        case "pawn":
            // Determine direction based on color
            const direction = color === "w" ? 1 : -1;

            // Check if destination is one or two squares forward
            if (
                (destinationRank === parseInt(currentSquare.charAt(1), 10) + direction && destinationFile === currentSquare.charAt(0)) ||
                (destinationRank === parseInt(currentSquare.charAt(1), 10) + 2 * direction &&
                    destinationFile === currentSquare.charAt(0) &&
                    ((color === "w" && currentSquare.charAt(1) === "2") || (color === "b" && currentSquare.charAt(1) === "7")))
            ) {
                // Check if there is no piece in the destination cell
                if (pieceExists(destination) === -1) {
                    return true;
                }
            }

            // Check if pawn is capturing diagonally
            if (
                destinationRank === parseInt(currentSquare.charAt(1), 10) + direction &&
                (destinationFile === String.fromCharCode(currentSquare.charCodeAt(0) + 1) ||
                    destinationFile === String.fromCharCode(currentSquare.charCodeAt(0) - 1))
            ) {
                // Check if there is a piece of the opposite color in the destination cell
                const capturedPieceIndex = pieceExists(destination);
                if (capturedPieceIndex > -1 && pieces[capturedPieceIndex][0] !== color) {
                    return true;
                }
            }

            return false;
    }
}

function updatePiecePosition(location, destination) {
    // find piece index based on location
    var pieceIndex = pieceExists(location);

    if (pieceIndex > -1) {
        if (determineLegality(pieceIndex, destination)) {
            // update piece location to destination
            pieces[pieceIndex][2] = destination;
        } // else... don't move the piece
    }
}

function getPieceImageSource(color, piece) {
    // piece sources
    const b_rook = "assets/images/pieces/b_rook_2x_ns.png";
    const b_knight = "assets/images/pieces/b_knight_2x_ns.png";
    const b_bishop = "assets/images/pieces/b_bishop_2x_ns.png";
    const b_queen = "assets/images/pieces/b_queen_2x_ns.png";
    const b_king = "assets/images/pieces/b_king_2x_ns.png";
    const b_pawn = "assets/images/pieces/b_pawn_2x_ns.png";
    const w_rook = "assets/images/pieces/w_rook_2x_ns.png";
    const w_knight = "assets/images/pieces/w_knight_2x_ns.png";
    const w_bishop = "assets/images/pieces/w_bishop_2x_ns.png";
    const w_queen = "assets/images/pieces/w_queen_2x_ns.png";
    const w_king = "assets/images/pieces/w_king_2x_ns.png";
    const w_pawn = "assets/images/pieces/w_pawn_2x_ns.png";

    if (color === "b") {
        switch (piece) {
            case "rook":
                return b_rook;
            case "knight":
                return b_knight;
            case "bishop":
                return b_bishop;
            case "queen":
                return b_queen;
            case "king":
                return b_king;
            case "pawn":
                return b_pawn;
        }
    } else {
        switch (piece) {
            case "rook":
                return w_rook;
            case "knight":
                return w_knight;
            case "bishop":
                return w_bishop;
            case "queen":
                return w_queen;
            case "king":
                return w_king;
            case "pawn":
                return w_pawn;
        }
    }
}

function pieceExists(cellID) {    
    for (var i = 0; i < pieces.length; i++) {
        if (pieces[i][2] === cellID) {
            return i;
        }
    }

    return -1;
}

function determineCellID(i, j) {
    switch (j) {
        case 0:
            return "A" + (8 - i).toString();
        case 1:
            return "B" + (8 - i).toString();
        case 2:
            return "C" + (8 - i).toString();
        case 3:
            return "D" + (8 - i).toString();
        case 4:
            return "E" + (8 - i).toString();
        case 5:
            return "F" + (8 - i).toString();
        case 6:
            return "G" + (8 - i).toString();
        case 7:
            return "H" + (8 - i).toString();
    }
}

var selectedCell = null;

function handleCellClick(cellID) {
    if (selectedCell === null) {
        // first click
        selectedCell = cellID;

        // highlight selected cell
        document.getElementById(selectedCell).classList.add("selected-cell");
    } else {
        // second click
        if (selectedCell !== cellID) {
            updatePiecePosition(selectedCell, cellID);
            updateTable();
        }

        // remove the highlight from the first selected cell
        document.getElementById(selectedCell).classList.remove("selected-cell");

        // reset selected cell
        selectedCell = null;
    }
}

// I don't know how this click function works, but it works :)
table.addEventListener('click', function(event) {
    var clickedElement = event.target;

    if (clickedElement.tagName === 'IMG' || clickedElement.tagName === 'TD') {
        var cell = clickedElement.tagName === 'IMG' ? clickedElement.parentNode : clickedElement;
        var cellID = cell.id;
        handleCellClick(cellID);
    }
});

updateTable();