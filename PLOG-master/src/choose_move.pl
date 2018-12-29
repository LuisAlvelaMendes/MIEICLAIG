/* -*- Mode:Prolog; coding:iso-8859-1; indent-tabs-mode:nil; prolog-indent-width:8; prolog-paren-indent:4; tab-width:8; -*- */

/* choosing an action presuming bot has nearby enemies he will either capture or retreat, else, he will move */
choose_action_computer(Board, NewBoard, Player, BotType, Coords, RowToReplace, ColumnToReplace):-
        Player == red,
        nl,
        findall([MRow,MColumn],matrixred(Board, MColumn, MRow),RedPieces),
        length(RedPieces,Len),
        random(0,Len,N),
        nth0(N, RedPieces, Coords),
        main_action_logic(Coords, Board, NewBoard, Player, BotType, RowToReplace, ColumnToReplace), !.

choose_action_computer(Board, NewBoard, Player, BotType, Coords, RowToReplace, ColumnToReplace):-
        Player == black,
        nl,
        findall([MRow,MColumn],matrixblack(Board, MColumn, MRow), BlackPieces),
        length(BlackPieces,Len),
        random(1,Len,N),
        nth0(N, BlackPieces, Coords),
        main_action_logic(Coords, Board, NewBoard, Player, BotType, RowToReplace, ColumnToReplace), !.

main_action_logic(Coords, Board, NewBoard, _, BotType, RowToReplace, ColumnToReplace):-
        nth0(0, Coords, Row),
        nth0(1, Coords, Column),
        BotType == agressive,
        checkComputerNearbyEnemies(Row, Column, Board),
        choose_to_capture(Row, Column, Board, NewBoard, RowToReplace, ColumnToReplace).

main_action_logic(Coords, Board, NewBoard, _, BotType, RowToReplace, ColumnToReplace):-
        nth0(0, Coords, Row),
        nth0(1, Coords, Column),
        BotType == agressive,
        checkComputerNearbyEnemies(Row, Column, Board),
        choose_to_retreat(Row, Column, Board, NewBoard, RowToReplace, ColumnToReplace).

main_action_logic(Coords, Board, NewBoard, _, BotType, RowToReplace, ColumnToReplace):-
        nth0(0, Coords, Row),
        nth0(1, Coords, Column),
        BotType == agressive,
        choose_to_move_computer(Row, Column, Board, NewBoard, RowToReplace, ColumnToReplace).

main_action_logic(Coords, Board, NewBoard, _, BotType, RowToReplace, ColumnToReplace):-
        nth0(0, Coords, Row),
        nth0(1, Coords, Column),
        BotType == agressive,
        choose_to_capture_cannon(Row, Column, Board, NewBoard, RowToReplace, ColumnToReplace).

main_action_logic(Coords, Board, NewBoard, _, BotType, RowToReplace, ColumnToReplace):-
        nth0(0, Coords, Row),
        nth0(1, Coords, Column),
        BotType == agressive,
        choose_to_move_cannon(Row, Column, Board, NewBoard, RowToReplace, ColumnToReplace).

main_action_logic(Coords, Board, NewBoard, _, BotType, RowToReplace, ColumnToReplace):-
        nth0(0, Coords, Row),
        nth0(1, Coords, Column),
        BotType == easy,
        checkComputerNearbyEnemies(Row, Column, Board),
        choose_to_retreat(Row, Column, Board, NewBoard, RowToReplace, ColumnToReplace).

main_action_logic(Coords, Board, NewBoard, _, BotType, RowToReplace, ColumnToReplace):-
        nth0(0, Coords, Row),
        nth0(1, Coords, Column),
        BotType == easy,
        checkComputerNearbyEnemies(Row, Column, Board),
        choose_to_capture(Row, Column, Board, NewBoard, RowToReplace, ColumnToReplace).

main_action_logic(Coords, Board, NewBoard, _, BotType, RowToReplace, ColumnToReplace):-
        nth0(0, Coords, Row),
        nth0(1, Coords, Column),
        BotType == easy,
        choose_to_move_computer(Row, Column, Board, NewBoard, RowToReplace, ColumnToReplace).

main_action_logic(Coords, Board, NewBoard, _, BotType, RowToReplace, ColumnToReplace):-
        nth0(0, Coords, Row),
        nth0(1, Coords, Column),
        BotType == easy,
        choose_to_move_cannon(Row, Column, Board, NewBoard, RowToReplace, ColumnToReplace).

main_action_logic(_, Board, NewBoard, Player, BotType):-
        choose_action_computer(Board, NewBoard, Player, BotType).

/* capture*/
choose_to_capture(Row1, Column1, Board, NewBoard, RowToReplace, ColumnToReplace):-
        findall([Position], validateComputerCapture(Row1, Column1, _, _, Board, Position), Positions),
        length(Positions,LenPositions),
        random(0,LenPositions,M),
        nth0(M, Positions, Pos),
        nth0(0, Pos, Position),
        move(Position, Row1, Column1, Board, NewBoard, RowToReplace, ColumnToReplace).

/* retreat */
choose_to_retreat(Row1, Column1, Board, NewBoard, RowToReplace, ColumnToReplace):-
        findall([CurrentMove], validateComputerRetreat(Row1, Column1, _, _, Board, CurrentMove), Moves),
        length(Moves,LenMoves),
        random(0,LenMoves,M),
        nth0(M, Moves, Move),
        nth0(0, Move, CurrentMove),
        move(CurrentMove, Row1, Column1, Board, NewBoard, RowToReplace, ColumnToReplace).

/* move normally */
choose_to_move_computer(Row1, Column1, Board, NewBoard, RowToReplace, ColumnToReplace):-
        findall([CurrentMove], validateComputerMove(Row1, Column1, _, _, Board, CurrentMove), Moves),
        length(Moves,LenMoves),
        random(0,LenMoves,M),
        nth0(M, Moves, Move),
        nth0(0, Move, CurrentMove),
        move(CurrentMove, Row1, Column1, Board, NewBoard, RowToReplace, ColumnToReplace).

/* move cannon */
choose_to_move_cannon(Row1, Column1, Board, NewBoard, DestinationRow, DestinationColumn):-
        getPiece(Row1, Column1, Board, Piece),
        checkPieceInCannonComputer(Row1, Column1, Board, Piece, CannonType, PieceNumber),
        findall([CurrentMove], validateComputerMoveCannon(Row1, Column1, _, _, Board, CannonType, PieceNumber, CurrentMove), Moves),
        length(Moves,LenMoves),
        random(0,LenMoves,M),
        nth0(M, Moves, Move),
        nth0(0, Move, CurrentMove),
        move_cannon(CurrentMove, Row1, Column1, Board, NewBoard, CannonType, PieceNumber, DestinationRow, DestinationColumn).

/* capture cannon */
choose_to_capture_cannon(Row1, Column1, Board, NewBoard, Row2, Column2):-
        getPiece(Row1, Column1, Board, Piece),
        checkPieceInCannonComputer(Row1, Column1, Board, Piece, CannonType, PieceNumber),
        validateComputerCaptureCannon(Row1, Column1, Row2, Column2, Board, CannonType, PieceNumber),
        capture_cannon(Row2, Column2, Board, NewBoard).
