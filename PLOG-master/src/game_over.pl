/* -*- Mode:Prolog; coding:iso-8859-1; indent-tabs-mode:nil; prolog-indent-width:8; prolog-paren-indent:4; tab-width:8; -*- */
:- use_module(library(lists)).

/* game over occurs whenever the redCityPiece or the blackCityPiece are no longer in play, which means they were taken by the opposite Player */
game_over(Board, RedCityColumn, _):-  lookForRedCity(Board, RedCityColumn), write('Black wins! Game Over!'), nl, sleep(1).
game_over(Board, _, BlackCityColumn):- lookForBlackCity(Board, BlackCityColumn), write('Red wins! Game Over!'), nl, sleep(1).

/* the red city was either taken by cannon (leaving the cell empty) or there is a blackSoldier there */
lookForRedCity(Board, RedCityColumn):-
        getPiece(0, RedCityColumn, Board, Piece),
        (Piece == empty ; Piece == blackSoldier).

lookForBlackCity(Board, BlackCityColumn):-
        getPiece(9, BlackCityColumn, Board, Piece),
        (Piece == empty ; Piece == redSoldier).
