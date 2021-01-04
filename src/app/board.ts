export enum WhitePiece {
    ROOK = '♖',
    KNIGHT = '♘',
    BISHOP = '♗',
    QUEEN = '♕',
    KING = '♔',
    PAWN = '♙',
}

export enum BlackPiece {
    ROOK = '♜',
    KNIGHT = '♞',
    BISHOP = '♝',
    QUEEN = '♛',
    KING = '♚',
    PAWN = '♟',
}

export interface Piece {
    moved: boolean;
    type: WhitePiece | BlackPiece;
}

export interface Tile {
    selected: boolean;
    destiny: boolean;
    blocked: boolean;
    piece?: Piece;
}

export interface Board {
    whiteTurn: boolean;
    selected: boolean;
    lineA: Tile[];
    lineB: Tile[];
    lineC: Tile[];
    lineD: Tile[];
    lineE: Tile[];
    lineF: Tile[];
    lineG: Tile[];
    lineH: Tile[];
}

export function getTile(board: Board, line: string, col: number) {
    return board['line' + line][col];
}