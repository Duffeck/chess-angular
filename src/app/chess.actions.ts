
import { Action } from '@ngrx/store';

export const SELECT_TILE = '[ Board ] select';
export const MOVE_PIECE = '[ Board ] move';
export const RESET_GAME = '[ Board ] reset';

export class SelectTile implements Action {
    readonly type = SELECT_TILE;

    constructor(public payload: { line: string, col: number }) { }
}

export class ResetGame implements Action {
    readonly type = RESET_GAME;
}

export class MovePiece implements Action {
    readonly type = MOVE_PIECE;

    constructor(public payload: { line: string, col: number }) { }
}

export type All = SelectTile | ResetGame | MovePiece;