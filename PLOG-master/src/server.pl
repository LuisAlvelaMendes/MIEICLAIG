:-use_module(library(sockets)).
:-use_module(library(lists)).
:-use_module(library(codesio)).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                        Server                                                   %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% To run, enter 'server.' on sicstus command line after consulting this file.
% You can test requests to this server by going to http://localhost:8081/<request>.
% Go to http://localhost:8081/quit to close server.

% Made by Luis Reis (ei12085@fe.up.pt) for LAIG course at FEUP.

port(8081).

% Server Entry Point
server :-
	port(Port),
	write('Opened Server'),nl,nl,
	socket_server_open(Port, Socket),
	server_loop(Socket),
	socket_server_close(Socket),
	write('Closed Server'),nl.

% Server Loop 
% Uncomment writes for more information on incomming connections
server_loop(Socket) :-
	repeat,
	socket_server_accept(Socket, _Client, Stream, [type(text)]),
		% write('Accepted connection'), nl,
	    % Parse Request
		catch((
			read_request(Stream, Request),
			read_header(Stream)
		),_Exception,(
			% write('Error parsing request.'),nl,
			close_stream(Stream),
			fail
		)),
		
		% Generate Response
		handle_request(Request, MyReply, Status),
		format('Request: ~q~n',[Request]),
		format('Reply: ~q~n', [MyReply]),
		
		% Output Response
		format(Stream, 'HTTP/1.0 ~p~n', [Status]),
		format(Stream, 'Access-Control-Allow-Origin: *~n', []),
		format(Stream, 'Content-Type: text/plain~n~n', []),
		format(Stream, '~p', [MyReply]),
	
		% write('Finnished Connection'),nl,nl,
		close_stream(Stream),
	(Request = quit), !.
	
close_stream(Stream) :- flush_output(Stream), close(Stream).

% Handles parsed HTTP requests
% Returns 200 OK on successful aplication of parse_input on request
% Returns 400 Bad Request on syntax error (received from parser) or on failure of parse_input
handle_request(Request, MyReply, '200 OK') :- catch(parse_input(Request, MyReply),error(_,_),fail), !.
handle_request(syntax_error, 'Syntax Error', '400 Bad Request') :- !.
handle_request(_, 'Bad Request', '400 Bad Request').

% Reads first Line of HTTP Header and parses request
% Returns term parsed from Request-URI
% Returns syntax_error in case of failure in parsing
read_request(Stream, Request) :-
	read_line(Stream, LineCodes),
	print_header_line(LineCodes),
	
	% Parse Request
	atom_codes('GET /',Get),
	append(Get,RL,LineCodes),
	read_request_aux(RL,RL2),	
	
	catch(read_from_codes(RL2, Request), error(syntax_error(_),_), fail), !.
read_request(_,syntax_error).
	
read_request_aux([32|_],[46]) :- !.
read_request_aux([C|Cs],[C|RCs]) :- read_request_aux(Cs, RCs).


% Reads and Ignores the rest of the lines of the HTTP Header
read_header(Stream) :-
	repeat,
	read_line(Stream, Line),
	print_header_line(Line),
	(Line = []; Line = end_of_file),!.

check_end_of_header([]) :- !, fail.
check_end_of_header(end_of_file) :- !,fail.
check_end_of_header(_).

% Function to Output Request Lines (uncomment the line bellow to see more information on received HTTP Requests)
% print_header_line(LineCodes) :- catch((atom_codes(Line,LineCodes),write(Line),nl),_,fail), !.
print_header_line(_).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                       Commands                                                  %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

:- consult('main.pl').

newPlaceCityRed(Board, RedCityColumn, NewBoard):-
	RedCityColumn \= 0,
	RedCityColumn \= 9,
	replaceInMatrix(Board, 0, RedCityColumn, redCityPiece, NewBoard).

newPlaceCityBlack(Board, BlackCityColumn, NewBoard):-
	BlackCityColumn \= 0,
	BlackCityColumn \= 9,
	replaceInMatrix(Board, 9, BlackCityColumn, blackCityPiece, NewBoard).

/* line 1: purely vertical line */

/*
   Piece1
   Piece2
   Piece3
*/

/* imagining Piece1 */
newCheckPieceInCannonComputer(Row, Column, ExtremityRow, ExtremityColumn, Board, Piece, CannonType, PieceNumber):-
        CannonType = verticalCannon,
        PieceNumber = 1,
        Row2 is Row + 1,
        Column2 is Column,
        getPiece(Row2, Column2, Board, BackPiece),
        BackPiece == Piece,
        ExtremityRow is Row + 2,
        ExtremityColumn is Column,
        getPiece(ExtremityRow, ExtremityColumn, Board, SecondBackPiece),
        SecondBackPiece == Piece.

/* imagining Piece 2 */
newCheckPieceInCannonComputer(Row, Column, ExtremityRow, ExtremityColumn, Board, Piece, CannonType, PieceNumber):-
        CannonType = verticalCannon,
        PieceNumber = 2,
        ExtremityRow is Row - 1,
        ExtremityColumn is Column,
        getPiece(ExtremityRow, ExtremityColumn, Board, FrontPiece),
        FrontPiece == Piece,
        Row3 is Row + 1,
        Column3 is Column,
        getPiece(Row3, Column3, Board, BackPiece),
        BackPiece == Piece.

/* imagining Piece 3 */
newCheckPieceInCannonComputer(Row, Column, ExtremityRow, ExtremityColumn, Board, Piece, CannonType, PieceNumber):-
        CannonType = verticalCannon,
        PieceNumber = 3,
        Row1 is Row - 1,
        Column1 is Column,
        getPiece(Row1, Column1, Board, FrontPiece),
        FrontPiece == Piece,
        ExtremityRow is Row - 2,
        ExtremityColumn is Column,
        getPiece(ExtremityRow, ExtremityColumn, Board, SecondFrontPiece),
        SecondFrontPiece == Piece.


/* line 2: NW -> SE diagonal line */

/*      Piece1
                Piece2
                        Piece3
*/

/* imagining Piece1 */
newCheckPieceInCannonComputer(Row, Column, ExtremityRow, ExtremityColumn, Board, Piece, CannonType, PieceNumber):-
        CannonType = diagonalNWSECannon,
        PieceNumber = 1,
        Row2 is Row + 1,
        Column2 is Column + 1,
        getPiece(Row2, Column2, Board, BackPiece),
        BackPiece == Piece,
        ExtremityRow is Row + 2,
        ExtremityColumn is Column + 2,
        getPiece(ExtremityRow, ExtremityColumn, Board, SecondBackPiece),
        SecondBackPiece == Piece.


/* imagining Piece 2 */
newCheckPieceInCannonComputer(Row, Column, ExtremityRow, ExtremityColumn, Board, Piece, CannonType, PieceNumber):-
        CannonType = diagonalNWSECannon,
        PieceNumber = 2,
        ExtremityRow is Row - 1,
        ExtremityColumn is Column - 1,
        getPiece(ExtremityRow, ExtremityColumn, Board, FrontPiece),
        FrontPiece == Piece,
        Row3 is Row + 1,
        Column3 is Column + 1,
        getPiece(Row3, Column3, Board, BackPiece),
        BackPiece == Piece.


/* imagining Piece 3 */
newCheckPieceInCannonComputer(Row, Column, ExtremityRow, ExtremityColumn, Board, Piece, CannonType, PieceNumber):-
        CannonType = diagonalNWSECannon,
        PieceNumber = 3,
        Row1 is Row - 1,
        Column1 is Column - 1,
        getPiece(Row1, Column1, Board, FrontPiece),
        FrontPiece == Piece,
        ExtremityRow is Row - 2,
        ExtremityColumn is Column - 2,
        getPiece(ExtremityRow, ExtremityColumn, Board, SecondFrontPiece),
        SecondFrontPiece == Piece.

/* line 3: SW -> NE diagonal line */

/*
                        Piece1
                Piece2
        Piece3
*/

/* imagining Piece1 */
newCheckPieceInCannonComputer(Row, Column, ExtremityRow, ExtremityColumn, Board, Piece, CannonType, PieceNumber):-
        CannonType = diagonalSWNECannon,
        PieceNumber = 1,
        Row2 is Row + 1,
        Column2 is Column - 1,
        getPiece(Row2, Column2, Board, BackPiece),
        BackPiece == Piece,
        ExtremityRow is Row + 2,
        ExtremityColumn is Column - 2,
        getPiece(ExtremityRow, ExtremityColumn, Board, SecondBackPiece),
        SecondBackPiece == Piece.

/* imagining Piece 2 */
newCheckPieceInCannonComputer(Row, Column, ExtremityRow, ExtremityColumn, Board, Piece, CannonType, PieceNumber):-
        CannonType = diagonalSWNECannon,
        PieceNumber = 2,
        ExtremityRow is Row - 1,
        ExtremityColumn is Column + 1,
        getPiece(ExtremityRow, ExtremityColumn, Board, FrontPiece),
        FrontPiece == Piece,
        Row3 is Row + 1,
        Column3 is Column - 1,
        getPiece(Row3, Column3, Board, BackPiece),
        BackPiece == Piece.

/* imagining Piece 3 */
newCheckPieceInCannonComputer(Row, Column, ExtremityRow, ExtremityColumn, Board, Piece, CannonType, PieceNumber):-
        CannonType = diagonalSWNECannon,
        PieceNumber = 3,
        Row1 is Row - 1,
        Column1 is Column + 1,
        getPiece(Row1, Column1, Board, FrontPiece),
        FrontPiece == Piece,
        ExtremityRow is Row - 2,
        ExtremityColumn is Column + 2,
        getPiece(ExtremityRow, ExtremityColumn, Board, SecondFrontPiece),
        SecondFrontPiece == Piece.

/* line 4: purely horizontal line */

/* Piece1 Piece2 Piece3 */

/* imagining Piece1 */
newCheckPieceInCannonComputer(Row, Column, ExtremityRow, ExtremityColumn, Board, Piece, CannonType, PieceNumber):-
        CannonType = horizontalCannon,
        PieceNumber = 1,
        Row2 is Row,
        Column2 is Column + 1,
        getPiece(Row2, Column2, Board, BackPiece),
        BackPiece == Piece,
        ExtremityRow is Row,
        ExtremityColumn is Column + 2,
        getPiece(ExtremityRow, ExtremityColumn, Board, SecondBackPiece),
        SecondBackPiece == Piece.

/* imagining Piece 2 */
newCheckPieceInCannonComputer(Row, Column, ExtremityRow, ExtremityColumn, Board, Piece, CannonType, PieceNumber):-
        CannonType = horizontalCannon,
        PieceNumber = 2,
        ExtremityRow is Row,
        ExtremityColumn is Column + 1,
        getPiece(ExtremityRow, ExtremityColumn, Board, FrontPiece),
        FrontPiece == Piece,
        Row2 is Row,
        Column2 is Column - 1,
        getPiece(Row2, Column2, Board, BackPiece),
        BackPiece == Piece.

/* imagining Piece 3 */
newCheckPieceInCannonComputer(Row, Column, ExtremityRow, ExtremityColumn, Board, Piece, CannonType, PieceNumber):-
        CannonType = horizontalCannon,
        PieceNumber = 3,
        Row1 is Row,
        Column1 is Column - 1,
        getPiece(Row1, Column1, Board, FrontPiece),
        FrontPiece == Piece,
        ExtremityRow is Row,
        ExtremityColumn is Column - 2,
        getPiece(ExtremityRow, ExtremityColumn, Board, SecondFrontPiece),
        SecondFrontPiece == Piece.

newCheckPieceInCannonComputer(_, _, _, _, _, _, _, _):- nl, fail.

checkRedCity(RedCityColumn, Board, Response):-
        getPiece(0, RedCityColumn, Board, Piece),
        (Piece == empty ; Piece == blackSoldier),
        Response = 'yesRed'.

checkBlackCity(BlackCityColumn, Board, Response):-
        getPiece(9, BlackCityColumn, Board, Piece),
        (Piece == empty ; Piece == redSoldier),
        Response = 'yesBlack'.

parse_input(handshake, handshake).
parse_input(test(C,N), Res) :- test(C,Res,N).
parse_input(quit, goodbye).

parse_input(initialBoard, Board):-
	initialBoard(Board).

parse_input(placeCityRed(Board,RedCityColumn, Row), Response):-
	Row == 0,
	newPlaceCityRed(Board, RedCityColumn, Response).

parse_input(placeCityBlack(Board,BlackCityColumn, Row), Response):-
	Row == 9,
	newPlaceCityBlack(Board, BlackCityColumn, Response). 

/* will respond with all possible places to move to [Row, Column], then, deconvert to find the clicable and move to it! */
parse_input(validatePiece(Board, Column, Row, Player), Response):-
	check_if_invalid_piece(Row, Column, Board, Player),
	findall([Row2,Column2], validateComputerMove(Row, Column, Row2, Column2, Board, Move), MovesN),
	findall([Row2,Column2], validateComputerRetreat(Row, Column, Row2, Column2, Board, Move), MovesR),
    append(MovesN,MovesR, Response).

parse_input(validatePieceCapture(Board, Column, Row), Response):-
	findall([Row2,Column2], validateComputerCapture(Row, Column, Row2, Column2, Board, _), Response).

parse_input(validatePieceCannon(Board, Column, Row, Piece), Response):-
	findall([CannonType, PieceNumber, ExtremityRow, ExtremityColumn], newCheckPieceInCannonComputer(Row, Column, ExtremityRow, ExtremityColumn, Board, Piece, CannonType, PieceNumber), Response).

parse_input(moveRedPiece(Board, OldRow, OldColumn, NewRow, NewColumn), Response):-
	replaceInMatrix(Board, OldRow, OldColumn, emptyCell, TempBoard),
    replaceInMatrix(TempBoard, NewRow, NewColumn, redSoldier, Response).

parse_input(moveBlackPiece(Board, OldRow, OldColumn, NewRow, NewColumn), Response):-
	replaceInMatrix(Board, OldRow, OldColumn, emptyCell, TempBoard),
    replaceInMatrix(TempBoard, NewRow, NewColumn, blackSoldier, Response).

parse_input(moveCannon(Board, Row, Column, CannonType, PieceNumber), Response):-
	findall([CurrentMove,Row2,Column2], validateComputerMoveCannon(Row, Column, Row2, Column2, Board, CannonType, PieceNumber, CurrentMove), Response).

parse_input(captureCannon(Board, Row, Column, CannonType, PieceNumber), Response):-
	findall([Row2,Column2], validateComputerCaptureCannon(Row, Column, Row2, Column2, Board, CannonType, PieceNumber), Response).

parse_input(moveCannonDirection(CurrentMove, Row, Column, Board, CannonType, PieceNumber), Response):-
	move_cannon(CurrentMove, Row, Column, Board, Response, CannonType, PieceNumber).

parse_input(captureCannonDirection(Board, Row1, Column1), Response):-
        capture_cannon(Row1, Column1, Board, Response).

parse_input(gameOver(RedCityColumn, BlackCityColumn, Board), Response):-
        checkRedCity(RedCityColumn, Board, Response); 
        checkBlackCity(BlackCityColumn, Board, Response).

parse_input(gameOver(_, _, _), Response):-
        Response = 'no'.

test(_,[],N) :- N =< 0.
test(A,[A|Bs],N) :- N1 is N-1, test(A,Bs,N1).
	