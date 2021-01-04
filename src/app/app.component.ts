import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Board, getTile, Tile } from './board';
import * as ChessActions from './chess.actions';

enum WhitePiece {
  ROOK = '♖',
  KNIGHT = '♘',
  BISHOP = '♗',
  QUEEN = '♕',
  KING = '♔',
  PAWN = '♙',
}

enum BlackPiece {
  ROOK = '♜',
  KNIGHT = '♞',
  BISHOP = '♝',
  QUEEN = '♛',
  KING = '♚',
  PAWN = '♙',
}

interface AppState {
  board: Board;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'chess-angular';

  white = WhitePiece;

  board$: Observable<Board>;

  board: Board;


  constructor(/*private store: Store<{ count: number }>, */private storeBoard: Store<AppState>) {
    this.board$ = this.storeBoard.select('board');

    this.board$.subscribe(board => {
      this.board = board;
    });

    this.storeBoard.dispatch(new ChessActions.ResetGame());

  }

  increment() {
    this.storeBoard.dispatch(new ChessActions.SelectTile({ line: 'A', col: 1 }));
    //this.store.dispatch(increment());
    console.log(this.board$);
  }

  decrement() {
    //this.store.dispatch(decrement());
  }

  reset() {
    this.storeBoard.dispatch(new ChessActions.ResetGame());
  }

  tileClick(line: string, col: number) {
    const tile: Tile = getTile(this.board, line, col);
    if (tile.selected || !(tile.destiny || tile.blocked)) {
      this.storeBoard.dispatch(new ChessActions.SelectTile({ line, col }));
    } else if (tile.destiny || tile.blocked) {
      this.storeBoard.dispatch(new ChessActions.MovePiece({ line, col }));
    }
  }
}
