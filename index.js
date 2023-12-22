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

updateTable();