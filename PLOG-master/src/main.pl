/* -*- Mode:Prolog; coding:iso-8859-1; indent-tabs-mode:nil; prolog-indent-width:8; prolog-paren-indent:4; tab-width:8; -*- */

:-include('valid_computer_moves.pl').
:-include('choose_move.pl').
:-include('game_over.pl').
:-include('menu.pl').
:-include('display_game.pl').
:-include('move.pl').
:-include('utilities.pl').
:-include('server.pl').

:- use_module(library(random)).
:- use_module(library(system)).
:- use_module(library(between)).

/* Main game running file, contains game loop */

/* Menu loop */
play:-
        repeat,
        clearConsole,
        mainMenu, !,
        write('Enter game mode: '),
        read(Selection),
        Selection >= 1,
        Selection =< 3,
        initialBoard(Board),
        selectGameMode(Selection, Board),!.

selectGameMode(Selection, Board):-
        Selection == 1,
        display_game(Board),
        humanVsHumanPlaceCity(Board, NewBoard, RedCityColumn, BlackCityColumn), !,
        humanVsHuman(NewBoard, RedCityColumn, BlackCityColumn).

selectGameMode(Selection, Board):-
        Selection == 2,
        chooseComputerDifficulty(BotType),
        display_game(Board),
        humanVsComputerPlaceCity(Board, NewBoard, RedCityColumn, BlackCityColumn), !,
        humanVsComputer(NewBoard, RedCityColumn, BlackCityColumn, BotType).

selectGameMode(Selection, Board):-
        Selection == 3,
        display_game(Board),
        computerVsComputerPlaceCity(Board, NewBoard, RedCityColumn, BlackCityColumn), !,
        computerVsComputer(NewBoard, RedCityColumn, BlackCityColumn).

/* HUMANS logic */

/* choosing city - Player vs Player */
humanVsHumanPlaceCity(Board, NewBoard, RedCityColumn, BlackCityColumn):-
        write('Red player place your city!'), nl,
        placeCity(Board, TempBoard, red, RedCityColumn),
        write('Black player place your city!'), nl,
        placeCity(TempBoard, NewBoard, black, BlackCityColumn), !.

/* choosing actions within the game */
choose_action(Board, NewBoard, Player):-
        repeat,
        nl,
        write('Select your piece!'), nl,nl,
        askCoords(Row, Column),
        check_if_invalid_piece(Row, Column, Board, Player),
        write('Would you like to move (either retreat/forward) (1), capture (2), cannon(3)? '),
        read(Answer),
        choose_move_option(Row, Column, Board, Answer, NewBoard, Action),
        Action, !.

choose_move_option(Row, Column, Board, 1, NewBoard, move_choice(Row, Column, Board, NewBoard)).
choose_move_option(Row, Column, Board, 2, NewBoard, capture_choice(Row, Column, Board, NewBoard)).
choose_move_option(Row, Column, Board, 3, NewBoard, cannon_choice(Row, Column, Board, NewBoard)).

/* move and capture */
move_choice(Row, Column, Board, NewBoard):-
        write('Where do you want to move?'), nl,
        findall([Move,Row2,Column2], validateComputerMove(Row, Column, Row2, Column2, Board, Move), MovesN),
        findall([Move,Row2,Column2], validateComputerRetreat(Row, Column, Row2, Column2, Board, Move), MovesR),
        append(MovesN,MovesR,Moves),
        askCoords(Row1, Column1),
        findMoves(Moves,Row1,Column1,CurrentMove),
        format('test after check move: ~w',[CurrentMove]),
        move(CurrentMove, Row, Column, Board, NewBoard).

capture_choice(Row, Column, Board, NewBoard):-
        write('Capture target?'), nl,
        findall([Position,Row2,Column2], validateComputerCapture(Row, Column, Row2, Column2, Board, Position), Captures),
        askCoords(Row1, Column1),
        findMoves(Captures,Row1,Column1,Position),
        move(Position, Row, Column, Board, NewBoard).


findMoves([],_,_,_):-write('Cannot do this!'),sleep(1),nl,fail.
findMoves([Move|Tail],Row1,Column1,CurrentMove):-
        nth0(1,Move,Row1),
        nth0(2,Move,Column1),
        nth0(0,Move,CurrentMove);
        findMoves(Tail,Row1,Column1,CurrentMove).

/* cannons */
check_number_valid(Number, FinalNumber):- Number < FinalNumber, Number >= 0.

ask_which_cannon(ReturnList, CannonType, PieceNumber):-
        repeat, nl,
        write('Which cannon? '), nl,
        print_list(ReturnList, 0, FinalNumber),
        write('Answer: '),
        read(Number),
        check_number_valid(Number, FinalNumber),
        find_list_element(ReturnList, Number, CannonType, PieceNumber).

cannon_choice(Row, Column, Board, NewBoard):-
        getPiece(Row, Column, Board, Piece),
        findall_cannon_possibledirections(Row, Column, Board, Piece, Check, ReturnList),
        Check == ask,
        ask_which_cannon(ReturnList, CannonType, PieceNumber),
        write('Move cannon(5), or capture with cannon(6)? '),
        read(Answer),nl,
        choose_cannon_option(Row, Column, Board, NewBoard, CannonType, PieceNumber, Answer, FinalAction),
        FinalAction.

cannon_choice(Row, Column, Board, NewBoard):-
        getPiece(Row, Column, Board, Piece),
        findall_cannon_possibledirections(Row, Column, Board, Piece, Check, _),
        Check == dont,
        checkPieceInCannonComputer(Row, Column, Board, Piece, CannonType, PieceNumber),
        write('Move cannon(5), or capture with cannon(6)? '),
        read(Answer),nl,
        choose_cannon_option(Row, Column, Board, NewBoard, CannonType, PieceNumber, Answer, FinalAction),
        FinalAction.

cannon_choice(_, _, _, _):-
        write('Invalid input!'), nl, fail.

choose_cannon_option(Row, Column, Board, NewBoard, CannonType, PieceNumber, 5, move_cannon_choice(Row, Column, Board, NewBoard, CannonType, PieceNumber)).
choose_cannon_option(Row, Column, Board, NewBoard, CannonType, PieceNumber, 6, capture_cannon_choice(Row, Column, Board, NewBoard, CannonType, PieceNumber)).

move_cannon_choice(Row, Column, Board, NewBoard, CannonType, PieceNumber):-
        write('Where do you want to move?'), nl,
        findall([CurrentMove,Row2,Column2], validateComputerMoveCannon(Row, Column, Row2, Column2, Board, CannonType, PieceNumber, CurrentMove), Moves),
        askCoords(Row1, Column1),
        findMoves(Moves,Row1,Column1,CurrentMove),
        write(CurrentMove), nl,
        move_cannon(CurrentMove, Row, Column, Board, NewBoard, CannonType, PieceNumber).

capture_cannon_choice(Row, Column, Board, NewBoard, CannonType, PieceNumber):-
        findall([Row2,Column2], validateComputerCaptureCannon(Row, Column, Row2, Column2, Board, CannonType, PieceNumber), Moves),
        length(Moves,N),
        (N>0;write('There are no possible targets'),nl,fail),
        write('Which target do you want to shoot?'), nl,
        askCoords(Row1, Column1),
        findMovesCap(Moves,Row1,Column1),
        capture_cannon(Row1, Column1, Board, NewBoard).

findMovesCap([],_,_):-write('Cannot do this!'),sleep(1),nl,fail.
findMovesCap([Move|Tail],Row1,Column1):-
        nth0(0,Move,Row1),
        nth0(1,Move,Column1);
        findMovesCap(Tail,Row1,Column1).

/* Main game loop */

humanVsHuman(Board, RedCityColumn, BlackCityColumn):-
        write('Red player turn!'), nl,
        choose_action(Board, N, red),
        display_game(N),
        \+ game_over(N, RedCityColumn, BlackCityColumn),
        write('Black player turn!'), nl,
        choose_action(N, FinalBoard, black),
        display_game(FinalBoard),
        \+ game_over(FinalBoard, RedCityColumn, BlackCityColumn),
        humanVsHuman(FinalBoard, RedCityColumn, BlackCityColumn).

humanVsHuman(Board, RedCityColumn, BlackCityColumn):- game_over(Board, RedCityColumn, BlackCityColumn), fail.

/* COMPUTER logic human vs computer*/

/* choosing bot mode */
chooseComputerDifficulty(BotType):-
        nl,
        write('Agressive Computer (1) or Easy Computer (0)?'), nl,
        read(Decision), nl,
        matchDecision(Decision, BotType).

matchDecision(0, easy).
matchDecision(1, agressive).

/* choosing city - Player vs Computer */
humanVsComputerPlaceCity(Board, NewBoard, RedCityColumn, BlackCityColumn):-
        write('Red is now choosing city placement'), nl,
        placeCityComputer(Board, TempBoard, red, RedCityColumn),
        write('Black player place your city!'), nl,
        placeCity(TempBoard, NewBoard, black, BlackCityColumn), !.

/* Main loop */

humanVsComputer(Board, RedCityColumn, BlackCityColumn, BotType):-
        write('Red player turn!'), nl,
        choose_action_computer(Board, N, red, BotType),
        sleep(1),
        display_game(N),
        \+ game_over(N, RedCityColumn, BlackCityColumn),
        write('Black player turn!'), nl,
        choose_action(N, FinalBoard, black),
        display_game(FinalBoard),
        \+ game_over(FinalBoard, RedCityColumn, BlackCityColumn), !,
        humanVsComputer(FinalBoard, RedCityColumn, BlackCityColumn, BotType).

humanVsComputer(Board, RedCityColumn, BlackCityColumn, _):- game_over(Board, RedCityColumn, BlackCityColumn), fail.

/* COMPUTER ONLY */

/* choosing city - Player vs Computer */
computerVsComputerPlaceCity(Board, NewBoard, RedCityColumn, BlackCityColumn):-
        write('Red is now choosing city placement'), nl,
        placeCityComputer(Board, TempBoard, red, RedCityColumn),
        write('Black is now choosing city placement'), nl,
        placeCityComputer(TempBoard, NewBoard, black, BlackCityColumn), !.

/* Main loop */

computerVsComputer(Board, RedCityColumn, BlackCityColumn):-
        write('Red player turn!'), nl,
        choose_action_computer(Board, N, red, agressive),
        sleep(1),
        display_game(N),
        \+ game_over(N, RedCityColumn, BlackCityColumn),
        write('Black player turn!'), nl,
        choose_action_computer(N, FinalBoard, black, agressive),
        sleep(1),
        display_game(FinalBoard),
        \+ game_over(FinalBoard, RedCityColumn, BlackCityColumn), !,
        computerVsComputer(FinalBoard, RedCityColumn, BlackCityColumn).

computerVsComputer(Board, RedCityColumn, BlackCityColumn):- game_over(Board, RedCityColumn, BlackCityColumn), fail.

value(Board, Player, Value):-
        Player==red,
        findall([MRow,MColumn],matrixred(Board, MColumn, MRow),RedPieces),
        length(RedPieces,RLen),
        findall([MRow,MColumn],matrixblack(Board, MColumn, MRow),BlackPieces),
        length(BlackPieces,BLen),
        Value is (RLen/(RLen+BLen))*100.


value(Board, Player, Value):-
        Player==black,
        findall([MRow,MColumn],matrixred(Board, MColumn, MRow),RedPieces),
        length(RedPieces,RLen),
        findall([MRow,MColumn],matrixblack(Board, MColumn, MRow),BlackPieces),
        length(BlackPieces,BLen),
        Value is (BLen/(RLen+BLen))*100.
