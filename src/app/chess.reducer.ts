import { BlackPiece, Piece, Tile } from './board';
import { WhitePiece } from './board';
import { Board } from './board';
import * as ChessActions from './chess.actions';

export type Action = ChessActions.All;

const defaultBoard: Board = generateDefaultBoard();

const helperLine = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

const newState = (state, newData) => {
    return Object.assign({}, state, newData);
}

export function chessReducer(state: Board = defaultBoard, action: Action) {
    console.log(action.type, state);
    switch (action.type) {
        case ChessActions.SELECT_TILE:
            var board = JSON.parse(JSON.stringify(state)) as Board;
            board = selectTile(board, action.payload.line, action.payload.col);
            return newState(state, board);
        case ChessActions.MOVE_PIECE:
            var board = JSON.parse(JSON.stringify(state)) as Board;
            board = movePiece(board, action.payload.line, action.payload.col);
            board.whiteTurn = !board.whiteTurn;
            return newState(state, board);
        case ChessActions.RESET_GAME:
        default:
            return defaultBoard;
    }
}

function selectTile(board: Board, line: string, col: number) {
    const fullLine = 'line' + line;
    if (board[fullLine][col].piece) {
        if ((Object.values(BlackPiece).includes(board[fullLine][col].piece.type) && board.whiteTurn)
            ||
            (Object.values(WhitePiece).includes(board[fullLine][col].piece.type) && !board.whiteTurn)) {
            return board;
        }
    }
    if (board[fullLine][col].selected) {
        removeAllselections(board);
    } else {
        removeAllselections(board);
        if (board[fullLine][col].piece) {
            board[fullLine][col].selected = true;
            switch (board[fullLine][col].piece.type) {
                case WhitePiece.PAWN:
                    checkWhitePawnMovement(board, line, col);
                    break;
                case BlackPiece.PAWN:
                    checkBlackPawnMovement(board, line, col);
                    break;
                case WhitePiece.ROOK:
                case BlackPiece.ROOK:
                    checkRookMovement(board, line, col);
                    break;
                case WhitePiece.BISHOP:
                case BlackPiece.BISHOP:
                    checkBishopMovement(board, line, col);
                    break;
                case WhitePiece.QUEEN:
                case BlackPiece.QUEEN:
                    checkQueenMovement(board, line, col);
                    break;
                case WhitePiece.KING:
                case BlackPiece.KING:
                    checkKingMovement(board, line, col);
                    break;
                case WhitePiece.KNIGHT:
                case BlackPiece.KNIGHT:
                    checkKnightMovement(board, line, col);
                    break;
            }
        }
    }
    board.selected = board[fullLine][col].selected;
    return board;
}

function movePiece(board: Board, line: string, col: number) {
    const fullLine = 'line' + line;
    const tile = findSelected(board);
    tile.piece.moved = true;
    board[fullLine][col].piece = tile.piece;
    tile.piece = null;
    removeAllselections(board);
    return board;
}

function checkWhitePawnMovement(board: Board, line: string, col: number) {
    const linha = helperLine.indexOf(line);
    if (linha > 0) {
        if (!board['line' + helperLine[linha - 1]][col].piece) {
            board['line' + helperLine[linha - 1]][col].destiny = true;
        }
        if (!board['line' + line][col].moved && !board['line' + helperLine[linha - 2]][col].piece
            && board['line' + helperLine[linha - 1]][col].destiny
            && !board['line' + helperLine[linha]][col].piece.moved) {
            board['line' + helperLine[linha - 2]][col].destiny = true;
        }

        if (col < 7 && board['line' + helperLine[linha - 1]][col + 1].piece && Object.values(BlackPiece).includes(board['line' + helperLine[linha - 1]][col + 1].piece.type)) {
            board['line' + helperLine[linha - 1]][col + 1].blocked = true;
        }

        if (col > 0 && board['line' + helperLine[linha - 1]][col - 1].piece && Object.values(BlackPiece).includes(board['line' + helperLine[linha - 1]][col - 1].piece.type)) {
            board['line' + helperLine[linha - 1]][col - 1].blocked = true;
        }
    }
}

function checkBlackPawnMovement(board: Board, line: string, col: number) {
    const linha = helperLine.indexOf(line);
    if (linha < 7) {
        if (!board['line' + helperLine[linha + 1]][col].piece) {
            board['line' + helperLine[linha + 1]][col].destiny = true;
        }
        if (!board['line' + line][col].moved && !board['line' + helperLine[linha + 2]][col].piece
            && board['line' + helperLine[linha + 1]][col].destiny
            && !board['line' + helperLine[linha]][col].piece.moved) {
            board['line' + helperLine[linha + 2]][col].destiny = true;
        }

        if (col < 7 && board['line' + helperLine[linha + 1]][col + 1].piece && Object.values(WhitePiece).includes(board['line' + helperLine[linha + 1]][col + 1].piece.type)) {
            board['line' + helperLine[linha + 1]][col + 1].blocked = true;
        }

        if (col > 0 && board['line' + helperLine[linha + 1]][col - 1].piece && Object.values(WhitePiece).includes(board['line' + helperLine[linha + 1]][col - 1].piece.type)) {
            board['line' + helperLine[linha + 1]][col - 1].blocked = true;
        }
    }
}

function checkRookMovement(board: Board, line: string, col: number) {
    checkOrtogonalMovement(board, line, col);
}

function checkBishopMovement(board: Board, line: string, col: number) {
    checkDiagonalMovement(board, line, col);
}

function checkQueenMovement(board: Board, line: string, col: number) {
    checkOrtogonalMovement(board, line, col);
    checkDiagonalMovement(board, line, col);
}

function checkKingMovement(board: Board, line: string, col: number) {
    checkKingOrtogonalMovement(board, line, col);
    checkKingDiagonalMovement(board, line, col);
}

function checkOrtogonalMovement(board: Board, line: string, col: number) {
    const linha = helperLine.indexOf(line);
    for (var c = col - 1; c >= 0; c--) {
        if (!board['line' + helperLine[linha]][c].piece) {
            board['line' + helperLine[linha]][c].destiny = true;
        } else {
            checkBlocked(board['line' + helperLine[linha]][col].piece, board['line' + helperLine[linha]][c]);
            break;
        }
    }

    for (var c = col + 1; c < 8; c++) {
        if (!board['line' + helperLine[linha]][c].piece) {
            board['line' + helperLine[linha]][c].destiny = true;
        } else {
            checkBlocked(board['line' + helperLine[linha]][col].piece, board['line' + helperLine[linha]][c]);
            break;
        }
    }

    for (var row = linha - 1; row >= 0; row--) {
        if (!board['line' + helperLine[row]][col].piece) {
            board['line' + helperLine[row]][col].destiny = true;
        } else {
            checkBlocked(board['line' + helperLine[linha]][col].piece, board['line' + helperLine[row]][col]);
            break;
        }
    }

    for (var row = linha + 1; row < 8; row++) {
        if (!board['line' + helperLine[row]][col].piece) {
            board['line' + helperLine[row]][col].destiny = true;
        } else {
            checkBlocked(board['line' + helperLine[linha]][col].piece, board['line' + helperLine[row]][col]);
            break;
        }
    }
}

function checkDiagonalMovement(board: Board, line: string, col: number) {
    const linha = helperLine.indexOf(line);
    var linhaAux = 0;
    var breakUp = false;
    var breakDown = false;
    for (var c = col - 1; c >= 0; c--) {
        linhaAux++;
        if ((linha + linhaAux) < 8 && !breakUp) {
            if (!board['line' + helperLine[linha + linhaAux]][c].piece) {
                board['line' + helperLine[linha + linhaAux]][c].destiny = true;
            } else {
                checkBlocked(board['line' + helperLine[linha]][col].piece, board['line' + helperLine[linha + linhaAux]][c]);
                breakUp = true;
            }
        }
        if ((linha - linhaAux) >= 0 && !breakDown) {
            if (!board['line' + helperLine[linha - linhaAux]][c].piece) {
                board['line' + helperLine[linha - linhaAux]][c].destiny = true;
            } else {
                checkBlocked(board['line' + helperLine[linha]][col].piece, board['line' + helperLine[linha - linhaAux]][c]);
                breakDown = true;
            }
        }

        if (breakUp && breakDown) {
            break;
        }
    }

    linhaAux = 0;
    breakUp = false;
    breakDown = false;
    for (var c = col + 1; c < 8; c++) {
        linhaAux++;
        if ((linha + linhaAux) < 8 && !breakUp) {
            if (!board['line' + helperLine[linha + linhaAux]][c].piece) {
                board['line' + helperLine[linha + linhaAux]][c].destiny = true;
            } else {
                checkBlocked(board['line' + helperLine[linha]][col].piece, board['line' + helperLine[linha + linhaAux]][c]);
                breakUp = true;
            }
        }
        if ((linha - linhaAux) >= 0 && !breakDown) {
            if (!board['line' + helperLine[linha - linhaAux]][c].piece) {
                board['line' + helperLine[linha - linhaAux]][c].destiny = true;
            } else {
                checkBlocked(board['line' + helperLine[linha]][col].piece, board['line' + helperLine[linha - linhaAux]][c]);
                breakDown = true;
            }
        }

        if (breakUp && breakDown) {
            break;
        }
    }
}

function checkKingOrtogonalMovement(board: Board, line: string, col: number) {
    const linha = helperLine.indexOf(line);
    if (col - 1 >= 0) {
        if (!board['line' + helperLine[linha]][col - 1].piece) {
            board['line' + helperLine[linha]][col - 1].destiny = true;
        } else {
            checkBlocked(board['line' + helperLine[linha]][col].piece, board['line' + helperLine[linha]][col - 1]);
        }
    }
    if (col + 1 < 8) {
        if (!board['line' + helperLine[linha]][col + 1].piece) {
            board['line' + helperLine[linha]][col + 1].destiny = true;
        } else {
            checkBlocked(board['line' + helperLine[linha]][col].piece, board['line' + helperLine[linha]][col + 1]);
        }
    }
    if (linha - 1 >= 0) {
        if (!board['line' + helperLine[linha - 1]][col].piece) {
            board['line' + helperLine[linha - 1]][col].destiny = true;
        } else {
            checkBlocked(board['line' + helperLine[linha]][col].piece, board['line' + helperLine[linha - 1]][col]);
        }
    }
    if (linha + 1 < 8) {
        if (!board['line' + helperLine[linha + 1]][col].piece) {
            board['line' + helperLine[linha + 1]][col].destiny = true;
        } else {
            checkBlocked(board['line' + helperLine[linha]][col].piece, board['line' + helperLine[linha + 1]][col]);
        }
    }
}

function checkKingDiagonalMovement(board: Board, line: string, col: number) {
    const linha = helperLine.indexOf(line);
    var linhaAux = 1;
    if (col - 1 >= 0) {
        if ((linha + linhaAux) < 8) {
            if (!board['line' + helperLine[linha + linhaAux]][col - 1].piece) {
                board['line' + helperLine[linha + linhaAux]][col - 1].destiny = true;
            } else {
                checkBlocked(board['line' + helperLine[linha]][col].piece, board['line' + helperLine[linha + linhaAux]][col - 1]);
            }
        }
        if ((linha - linhaAux) >= 0) {
            if (!board['line' + helperLine[linha - linhaAux]][col - 1].piece) {
                board['line' + helperLine[linha - linhaAux]][col - 1].destiny = true;
            } else {
                checkBlocked(board['line' + helperLine[linha]][col].piece, board['line' + helperLine[linha - linhaAux]][col - 1]);
            }
        }
    }

    if (col + 1 < 8) {
        if ((linha + linhaAux) < 8) {
            if (!board['line' + helperLine[linha + linhaAux]][col + 1].piece) {
                board['line' + helperLine[linha + linhaAux]][col + 1].destiny = true;
            } else {
                checkBlocked(board['line' + helperLine[linha]][col].piece, board['line' + helperLine[linha + linhaAux]][col + 1]);
            }
        }
        if ((linha - linhaAux) >= 0) {
            if (!board['line' + helperLine[linha - linhaAux]][col + 1].piece) {
                board['line' + helperLine[linha - linhaAux]][col + 1].destiny = true;
            } else {
                checkBlocked(board['line' + helperLine[linha]][col].piece, board['line' + helperLine[linha - linhaAux]][col + 1]);
            }
        }
    }
}

function checkKnightMovement(board: Board, line: string, col: number) {
    const linha = helperLine.indexOf(line);
    var linhaAux = 2;
    if (col - 1 >= 0) {
        if ((linha + linhaAux) < 8) {
            if (!board['line' + helperLine[linha + linhaAux]][col - 1].piece) {
                board['line' + helperLine[linha + linhaAux]][col - 1].destiny = true;
            } else {
                checkBlocked(board['line' + helperLine[linha]][col].piece, board['line' + helperLine[linha + linhaAux]][col - 1]);
            }
        }
        if ((linha - linhaAux) >= 0) {
            if (!board['line' + helperLine[linha - linhaAux]][col - 1].piece) {
                board['line' + helperLine[linha - linhaAux]][col - 1].destiny = true;
            } else {
                checkBlocked(board['line' + helperLine[linha]][col].piece, board['line' + helperLine[linha - linhaAux]][col - 1]);
            }
        }
    }

    if (col + 1 < 8) {
        if ((linha + linhaAux) < 8) {
            if (!board['line' + helperLine[linha + linhaAux]][col + 1].piece) {
                board['line' + helperLine[linha + linhaAux]][col + 1].destiny = true;
            } else {
                checkBlocked(board['line' + helperLine[linha]][col].piece, board['line' + helperLine[linha + linhaAux]][col + 1]);
            }
        }
        if ((linha - linhaAux) >= 0) {
            if (!board['line' + helperLine[linha - linhaAux]][col + 1].piece) {
                board['line' + helperLine[linha - linhaAux]][col + 1].destiny = true;
            } else {
                checkBlocked(board['line' + helperLine[linha]][col].piece, board['line' + helperLine[linha - linhaAux]][col + 1]);
            }
        }
    }

    var linhaAux = 1;
    if (col - 2 >= 0) {
        if ((linha + linhaAux) < 8) {
            if (!board['line' + helperLine[linha + linhaAux]][col - 2].piece) {
                board['line' + helperLine[linha + linhaAux]][col - 2].destiny = true;
            } else {
                checkBlocked(board['line' + helperLine[linha]][col].piece, board['line' + helperLine[linha + linhaAux]][col - 2]);
            }
        }
        if ((linha - linhaAux) >= 0) {
            if (!board['line' + helperLine[linha - linhaAux]][col - 2].piece) {
                board['line' + helperLine[linha - linhaAux]][col - 2].destiny = true;
            } else {
                checkBlocked(board['line' + helperLine[linha]][col].piece, board['line' + helperLine[linha - linhaAux]][col - 2]);
            }
        }
    }

    if (col + 2 < 8) {
        if ((linha + linhaAux) < 8) {
            if (!board['line' + helperLine[linha + linhaAux]][col + 2].piece) {
                board['line' + helperLine[linha + linhaAux]][col + 2].destiny = true;
            } else {
                checkBlocked(board['line' + helperLine[linha]][col].piece, board['line' + helperLine[linha + linhaAux]][col + 2]);
            }
        }
        if ((linha - linhaAux) >= 0) {
            if (!board['line' + helperLine[linha - linhaAux]][col + 2].piece) {
                board['line' + helperLine[linha - linhaAux]][col + 2].destiny = true;
            } else {
                checkBlocked(board['line' + helperLine[linha]][col].piece, board['line' + helperLine[linha - linhaAux]][col + 2]);
            }
        }
    }
}

function generateDefaultBoard() {
    const board: Board = {
        whiteTurn: true,
        selected: false,
        lineA: [
            {
                selected: false,
                destiny: false,
                blocked: false,
                piece: { moved: false, type: BlackPiece.ROOK },
            },
            {
                selected: false,
                destiny: false,
                blocked: false,
                piece: { moved: false, type: BlackPiece.KNIGHT },
            },
            {
                selected: false,
                destiny: false,
                blocked: false,
                piece: { moved: false, type: BlackPiece.BISHOP },
            },
            {
                selected: false,
                destiny: false,
                blocked: false,
                piece: { moved: false, type: BlackPiece.QUEEN },
            },
            {
                selected: false,
                destiny: false,
                blocked: false,
                piece: { moved: false, type: BlackPiece.KING },
            },
            {
                selected: false,
                destiny: false,
                blocked: false,
                piece: { moved: false, type: BlackPiece.BISHOP },
            },
            {
                selected: false,
                destiny: false,
                blocked: false,
                piece: { moved: false, type: BlackPiece.KNIGHT },
            },
            {
                selected: false,
                destiny: false,
                blocked: false,
                piece: { moved: false, type: BlackPiece.ROOK },
            }
        ],
        lineB: [],
        lineC: [],
        lineD: [],
        lineE: [],
        lineF: [],
        lineG: [],
        lineH: [
            {
                selected: false,
                destiny: false,
                blocked: false,
                piece: { moved: false, type: WhitePiece.ROOK },
            },
            {
                selected: false,
                destiny: false,
                blocked: false,
                piece: { moved: false, type: WhitePiece.KNIGHT },
            },
            {
                selected: false,
                destiny: false,
                blocked: false,
                piece: { moved: false, type: WhitePiece.BISHOP },
            },
            {
                selected: false,
                destiny: false,
                blocked: false,
                piece: { moved: false, type: WhitePiece.QUEEN },
            },
            {
                selected: false,
                destiny: false,
                blocked: false,
                piece: { moved: false, type: WhitePiece.KING },
            },
            {
                selected: false,
                destiny: false,
                blocked: false,
                piece: { moved: false, type: WhitePiece.BISHOP },
            },
            {
                selected: false,
                destiny: false,
                blocked: false,
                piece: { moved: false, type: WhitePiece.KNIGHT },
            },
            {
                selected: false,
                destiny: false,
                blocked: false,
                piece: { moved: false, type: WhitePiece.ROOK },
            }
        ]
    };

    //board.lineB = [];
    for (var i = 0; i < 8; i++) {
        board.lineB.push({
            selected: false,
            destiny: false,
            blocked: false,
            piece: { moved: false, type: BlackPiece.PAWN },
        });
    }

    for (var i = 0; i < 8; i++) {
        board.lineC.push({
            selected: false,
            destiny: false,
            blocked: false,
        });
    }

    for (var i = 0; i < 8; i++) {
        board.lineD.push({
            selected: false,
            destiny: false,
            blocked: false,
        });
    }

    for (var i = 0; i < 8; i++) {
        board.lineE.push({
            selected: false,
            destiny: false,
            blocked: false,
        });
    }

    for (var i = 0; i < 8; i++) {
        board.lineF.push({
            selected: false,
            destiny: false,
            blocked: false,
        });
    }

    for (var i = 0; i < 8; i++) {
        board.lineG.push({
            selected: false,
            destiny: false,
            blocked: false,
            piece: { moved: false, type: WhitePiece.PAWN },
        });
    }

    /*board.lineC[5].piece = { moved: false, type: WhitePiece.BISHOP };
    board.lineF[2].piece = { moved: false, type: BlackPiece.BISHOP };
    board.lineF[5].piece = { moved: false, type: WhitePiece.BISHOP };*/


    return board;
}

function removeAllselections(board: Board) {
    helperLine.forEach(letter => {
        for (var i = 0; i < 8; i++) {
            board['line' + letter][i].selected = false;
            board['line' + letter][i].destiny = false;
            board['line' + letter][i].blocked = false;
        }
    });
}

function findSelected(board: Board) {
    for (var col = 0; col < 8; col++) {
        for (var row = 0; row < 8; row++) {
            if (board['line' + helperLine[col]][row].selected) {
                return board['line' + helperLine[col]][row];
            }
        }
    }
}

function checkBlocked(selectedPiece: Piece, blockingTile: Tile) {
    if ((isWhite(selectedPiece) && isBlack(blockingTile.piece))
        ||
        (isBlack(selectedPiece) && isWhite(blockingTile.piece))) {
        blockingTile.blocked = true;
    }
}

function isWhite(piece: any) {
    return Object.values(WhitePiece).includes(piece.type);
}

function isBlack(piece: any) {
    return Object.values(BlackPiece).includes(piece.type);
}