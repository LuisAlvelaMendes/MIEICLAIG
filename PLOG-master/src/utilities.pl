/* -*- Mode:Prolog; coding:iso-8859-1; indent-tabs-mode:nil; prolog-indent-width:8; prolog-paren-indent:4; tab-width:8; -*- */

/* Asks user for which Piece he intends to move, using _codes functions to make it so you only input 1 line like: cell "e2." */
checkEmptyPossibleTail([]).
parseCoordsList([Column | [Row | PossibleTail ] ], ColumnUserSelected, RowUserSelected):- checkEmptyPossibleTail(PossibleTail), atom_codes(ColumnUserSelected, [Column]), number_codes(RowUserSelected, [Row]).
parseCoordsList([Column | [_ | [PossibleTail | [] ] ] ], ColumnUserSelected, RowUserSelected):- number_codes(Temp, [PossibleTail]), Temp is 0, atom_codes(ColumnUserSelected, [Column]), RowUserSelected = 10.
parseCoordsList(_, _, _):- write('Invalid coords.'), nl, fail.

askCoords(Row, Column):-
        repeat,
        write('Coordinates (Lowercase Column followed by Row): '),
        read(FullCoords),nl,
        atom_codes(FullCoords, CoordsList),
        parseCoordsList(CoordsList, ColumnUserSelected, RowUserSelected),
        columnIndex(ColumnUserSelected, Column),
        Row is 10 - RowUserSelected, !.

/* asks for the column only, used for city placement */
askColumn(Column):-
        repeat,
        write('Column  '),
        read(ColumnUserSelected),
        columnIndex(ColumnUserSelected, Column).

/* converting a column to an integer index so we can find it in our list[row][column] */
columnIndex(a, 0).
columnIndex(b, 1).
columnIndex(c, 2).
columnIndex(d, 3).
columnIndex(e, 4).
columnIndex(f, 5).
columnIndex(g, 6).
columnIndex(h, 7).
columnIndex(i, 8).
columnIndex(j, 9).

/* city placement */
placeCity(Board, NewBoard, Player, RedCityColumn):-
        Player == red,
        write('Where to place?'), nl,
        askColumn(RedCityColumn),
        validateComputerCityPlace(RedCityColumn, Player),
        replaceInMatrix(Board, 0, RedCityColumn, redCityPiece, NewBoard),
        display_game(NewBoard).

placeCity(Board, NewBoard, Player, BlackCityColumn):-
        Player == black,
        write('Where to place?'), nl,
        askColumn(BlackCityColumn),
        validateComputerCityPlace(BlackCityColumn, Player),
        replaceInMatrix(Board, 9, BlackCityColumn, blackCityPiece, NewBoard),
        display_game(NewBoard).

placeCityComputer(Board, NewBoard, Player, RedCityColumn):-
        Player == red,
        sleep(1),
        random(1,9,RedCityColumn),
        replaceInMatrix(Board, 0, RedCityColumn, redCityPiece, NewBoard),
        display_game(NewBoard).

placeCityComputer(Board, NewBoard, Player, BlackCityColumn):-
        Player == black,
        sleep(1),
        random(1,9, BlackCityColumn),
        replaceInMatrix(Board, 9, BlackCityColumn, blackCityPiece, NewBoard),
        display_game(NewBoard).

/* checks if a selected piece is valid or not */
check_if_invalid_piece(Row, Column, Board, _):-
        getPiece(Row, Column, Board, Piece),
        write(Piece), nl,
        (Piece == emptyCell ; Piece == redCityPiece ; Piece == blackCityPiece),
        write('This piece cannot be moved.'), nl,
        !, fail.

check_if_invalid_piece(Row, Column, Board, Player):-
        getPiece(Row, Column, Board, Piece),
        Player == red,
        Piece == blackSoldier,
        write('Red player can only move red soldiers.'), nl,
        !, fail.

check_if_invalid_piece(Row, Column, Board, Player):-
        getPiece(Row, Column, Board, Piece),
        Player == black,
        Piece == redSoldier,
        write('Black player can only move black soldiers.'), nl,
        !, fail.

check_if_invalid_piece(_, _, _, _).

/* finding possible directions for cannons in case the selected piece can be in more than one cannon */
findall_cannon_possibledirections(Row, Column, Board, Piece, Check, ReturnList):-
        Check = ask,
        findall([CannonType, PieceNumber], checkPieceInCannonComputer(Row, Column, Board, Piece, CannonType, PieceNumber), ReturnList),
        length(ReturnList, Size),
        Size > 1.

findall_cannon_possibledirections(_,_, _, _, Check, _):-
        Check = dont.

/* printing a list of possible cannons */
print_list([H|T], I, FinalNumber):-
        format('~w - ~w', [I, H]), nl,
        I1 is I+1,
        print_list(T, I1, FinalNumber).

print_list([], I, FinalNumber):- FinalNumber = I.

find_list_element([[CannonTypeList, PieceNumberList]|_], 0, CannonType, PieceNumber):-
        CannonType = CannonTypeList,
        PieceNumber = PieceNumberList.

find_list_element([_|T], Number, CannonType, PieceNumber):-
        Number > 0,
        N1 is Number - 1,
        find_list_element(T, N1, CannonType, PieceNumber).

/* getting the Piece of index [row][col] from the list */

/* first, you must iterate through all rows (sublists of the biggest list) */
getPiece(0, Column, [Head |_], Piece):- iterateColumn(Column, Head, Piece).
getPiece(Row, Column, [_| Tail], Piece):-
        Row > 0,
        NextRow is Row - 1,
        getPiece(NextRow, Column, Tail, Piece), !.

/* then, iterate inside each sublist, go through all columns */
iterateColumn(0, [Head |_], Head):- !.
iterateColumn(Column, [_| Tail], Piece):-
        Column > 0,
        NextColumn is Column - 1,
        iterateColumn(NextColumn, Tail, Piece).

/* replacing elements in the board, when moving for example replacing redSoldier with emptyCell and destination emptyCell with redSoldier */
replaceInList([_H|T], 0, Value, [Value|T]).
replaceInList([H|T], Index, Value, [H|TNew]) :-
        Index > 0,
        Index1 is Index - 1,
        replaceInList(T, Index1, Value, TNew).

replaceInMatrix([H|T], 0, Column,Value, [HNew|T]) :-
        replaceInList(H, Column, Value, HNew).

replaceInMatrix([H|T], Row, Column, Value, [H|TNew]) :-
        Row > 0,
        Row1 is Row - 1,
        replaceInMatrix(T, Row1, Column, Value, TNew).

matrix(Matrix, I, J, Value) :-
    nth0(J, Matrix, Row),
    nth0(I, Row, Value).

matrixred(Matrix, I, J) :-
    nth0(J, Matrix, Row),
    nth0(I, Row, Value),
    Value == redSoldier.

matrixblack(Matrix, I, J) :-
    format("Matrixblack matrix ~w:", [Matrix]);    
    nth0(J, Matrix, Row),
    nth0(I, Row, Value),
    Value == blackSoldier.

clearConsole:-
    write('\33\[2J').
