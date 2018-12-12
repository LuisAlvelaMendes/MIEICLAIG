/* -*- Mode:Prolog; coding:=iso-8859-1; indent-tabs-mode:nil; prolog-indent-width:8; prolog-paren-indent:4; tab-width:8; -*- */
:- use_module(library(aggregate)).
:- use_module(library(lists)).
:- use_module(library(clpfd)).

/* Option 0: place city, placing the city also counts as part of the game, and the city must be placed in a given row without counting the corners */
validateComputerCityPlace(Column, red):-
  Column \= 0,
  Column \= 9.

validateComputerCityPlace(Column, black):-
  Column \= 0,
  Column \= 9.

/* Option 1: move soldier */

/* Option 1.1: forward */
/* A soldier can move forward if the adjacent points in front are free */

/* Predicate to determine frontal adjacency (checks if the spot is empty so he can move) */

/* Right side position, 1 row head and one column to the right */

/* Relative to red soldiers */
validateComputerMoveRightAdjacentFront(Row, Column, Row1, Column1, Board):-
  getPiece(Row, Column, Board, Piece),
  Piece == redSoldier,
  Row1 is Row + 1,
  Column1 is Column + 1,
  Row1 =< 9,
  Column1 =< 9,
  getPiece(Row1, Column1, Board, OtherPiece),
  OtherPiece == emptyCell, !.

/* Relative to black soldiers */
validateComputerMoveRightAdjacentFront(Row, Column, Row1, Column1, Board):-
  getPiece(Row, Column, Board, Piece),
  Piece == blackSoldier,
  Row1 is Row - 1,
  Column1 is Column + 1,
  Row1 >= 0,
  Row1 is Row - 1,
  Column1 is Column + 1,
  Row1 =< 9,
  Column1 =< 9,
  getPiece(Row1, Column1, Board, OtherPiece),
  OtherPiece == emptyCell, !.

/* Left side position, 1 row head and one column to the left */

/* Relative to red soldiers */
validateComputerMoveLeftAdjacentFront(Row, Column, Row1, Column1, Board):-
  getPiece(Row, Column, Board, Piece),
  Piece == redSoldier,
  Row1 is Row + 1,
  Column1 is Column - 1,
  Row1 =< 9,
  Column1 =< 9,
  getPiece(Row1, Column1, Board, OtherPiece),
  OtherPiece == emptyCell, !.

/* Relative to black soldiers */
validateComputerMoveLeftAdjacentFront(Row, Column, Row1, Column1, Board):-
  getPiece(Row, Column, Board, Piece),
  Piece == blackSoldier,
  Row1 is Row - 1,
  Column1 is Column - 1,
  Row1 =< 9,
  Column1 =< 9,
  getPiece(Row1, Column1, Board, OtherPiece),
  OtherPiece == emptyCell, !.

/* Position directly in front */

/* Relative to red soldiers */
validateComputerMoveFront(Row, Column, Row1, Column1, Board):-
  getPiece(Row, Column, Board, Piece),
  Piece == redSoldier,
  Row1 is Row + 1,
  Column1 is Column,
  Row1 =< 9,
  getPiece(Row1, Column, Board, OtherPiece),
  OtherPiece == emptyCell, !.

/* Relative to black soldiers */
validateComputerMoveFront(Row, Column, Row1, Column1, Board):-
  getPiece(Row, Column, Board, Piece),
  Piece == blackSoldier,
  Row1 is Row - 1,
  Column1 is Column,
  Row1 =< 9,
  getPiece(Row1, Column, Board, OtherPiece),
  OtherPiece = emptyCell, !.

/* Option 1.3: capture */

/* Frontal Capture */

/* Relative to red soldiers */
validateComputerCaptureFront(Row, Column, Row1, Column1, Board):-
  getPiece(Row, Column, Board, Piece),
  Piece == redSoldier,
  Row1 is Row + 1,
  Column1 is Column,
  Row1 =< 9,
  getPiece(Row1, Column, Board, OtherPiece),
  (OtherPiece == blackSoldier ; OtherPiece == blackCityPiece).

/* Relative to black soldiers */
validateComputerCaptureFront(Row, Column, Row1, Column1, Board):-
  getPiece(Row, Column, Board, Piece),
  Piece == blackSoldier,
  Row1 is Row - 1,
  Column1 is Column,
  Row1 =< 9,
  getPiece(Row1, Column, Board, OtherPiece),
  (OtherPiece == redSoldier ; OtherPiece == redCityPiece).

/* Left side position, 1 row head and one column to the left */

/* Relative to red soldiers */
validateComputerCaptureLeftAdjacentFront(Row, Column, Row1, Column1, Board):-
  getPiece(Row, Column, Board, Piece),
  Piece == redSoldier,
  Row1 is Row + 1,
  Column1 is Column - 1,
  Row1 =< 9,
  Column1 =< 9,
  getPiece(Row1, Column1, Board, OtherPiece),
  (OtherPiece == blackSoldier ; OtherPiece == blackCityPiece).

/* Relative to black soldiers */
validateComputerCaptureLeftAdjacentFront(Row, Column, Row1, Column1, Board):-
  getPiece(Row, Column, Board, Piece),
  Piece == blackSoldier,
  Row1 is Row - 1,
  Column1 is Column - 1,
  Row1 =< 9,
  Column1 =< 9,
  getPiece(Row1, Column1, Board, OtherPiece),
  (OtherPiece == redSoldier ; OtherPiece == redCityPiece).

/* Right side position, 1 row head and one column to the right */

/* Relative to red soldiers */
validateComputerCaptureRightAdjacentFront(Row, Column, Row1, Column1, Board):-
  getPiece(Row, Column, Board, Piece),
  Piece == redSoldier,
  Row1 is Row + 1,
  Column1 is Column + 1,
  Row1 =< 9,
  Column1 =< 9,
  getPiece(Row1, Column1, Board, OtherPiece),
  (OtherPiece == blackSoldier ; OtherPiece == blackCityPiece).

/* Relative to black soldiers */
validateComputerCaptureRightAdjacentFront(Row, Column, Row1, Column1, Board):-
  getPiece(Row, Column, Board, Piece),
  Piece == blackSoldier,
  Row1 is Row - 1,
  Column1 is Column + 1,
  Row1 =< 9,
  Column1 =< 9,
  getPiece(Row1, Column1, Board, OtherPiece),
  (OtherPiece == redSoldier ; OtherPiece == redCityPiece).

/* Left side -actual- left, one column to the left */

/* Relative to red soldiers */
validateComputerCaptureLeftSide(Row, Column, Row1, Column1, Board):-
  getPiece(Row, Column, Board, Piece),
  Piece == redSoldier,
  Row1 is Row,
  Column1 is Column - 1,
  Row1 =< 9,
  Column1 =< 9,
  getPiece(Row1, Column1, Board, OtherPiece),
  (OtherPiece == blackSoldier ; OtherPiece == blackCityPiece).

/* Relative to black soldiers */
validateComputerCaptureLeftSide(Row, Column, Row1, Column1, Board):-
  getPiece(Row, Column, Board, Piece),
  Piece == blackSoldier,
  Row1 is Row,
  Column1 is Column - 1,
  Row1 =< 9,
  Column1 =< 9,
  getPiece(Row1, Column1, Board, OtherPiece),
  (OtherPiece == redSoldier ; OtherPiece == redCityPiece).

/* Right side -actual- right */

/* Relative to red soldiers */
validateComputerCaptureRightSide(Row, Column, Row1, Column1, Board):-
  getPiece(Row, Column, Board, Piece),
  Piece == redSoldier,
  Row1 is Row,
  Column1 is Column + 1,
  Row1 =< 9,
  Column1 =< 9,
  getPiece(Row1, Column1, Board, OtherPiece),
  (OtherPiece == blackSoldier ; OtherPiece == blackCityPiece).

/* Relative to black soldiers */
validateComputerCaptureRightSide(Row, Column, Row1, Column1, Board):-
  getPiece(Row, Column, Board, Piece),
  Piece == blackSoldier,
  Row1 is Row,
  Column1 is Column + 1,
  Row1 =< 9,
  Column1 =< 9,
  getPiece(Row1, Column1, Board, OtherPiece),
  (OtherPiece == redSoldier ; OtherPiece == redCityPiece).

/* to retreat we need a predicate to deterimne if there are enemies nearby */
checkComputerNearbyEnemies(Row, Column, Board):- validateComputerFrontEnemy(Row, Column, Board).
checkComputerNearbyEnemies(Row, Column, Board):- validateComputerLeftAdjacentFrontEnemy(Row, Column, Board).
checkComputerNearbyEnemies(Row, Column, Board):- validateComputerRightAdjacentFrontEnemy(Row, Column, Board).
checkComputerNearbyEnemies(Row, Column, Board):- validateComputerLeftSideEnemy(Row, Column, Board).
checkComputerNearbyEnemies(Row, Column, Board):- validateComputerRightSideEnemy(Row, Column, Board).

/* front checking for enemies */

/* red soldier */
validateComputerFrontEnemy(Row, Column, Board):-
  getPiece(Row, Column, Board, Piece),
  Piece == redSoldier,
  Row1 is Row + 1,
  Row1 =< 9,
  getPiece(Row1, Column, Board, OtherPiece),
  (OtherPiece == blackSoldier ; OtherPiece == blackCityPiece).

/* black soldier */
validateComputerFrontEnemy(Row, Column, Board):-
  getPiece(Row, Column, Board, Piece),
  Piece == blackSoldier,
  Row1 is Row - 1,
  Row1 =< 9,
  getPiece(Row1, Column, Board, OtherPiece),
  (OtherPiece == redSoldier ; OtherPiece == redCityPiece).

/* Left side position, 1 row head and one column to the left */

/* Relative to red soldiers */
validateComputerLeftAdjacentFrontEnemy(Row, Column, Board):-
  getPiece(Row, Column, Board, Piece),
  Piece == redSoldier,
  Row1 is Row + 1,
  Column1 is Column - 1,
  Row1 =< 9,
  Column1 >= 0,
  getPiece(Row1, Column1, Board, OtherPiece),
  (OtherPiece == blackSoldier ; OtherPiece == blackCityPiece).

/* Relative to black soldiers */
validateComputerLeftAdjacentFrontEnemy(Row, Column, Board):-
  getPiece(Row, Column, Board, Piece),
  Piece == blackSoldier,
  Row1 is Row - 1,
  Column1 is Column - 1,
  Row1 >=0,
  Column1 >=0,
  getPiece(Row1, Column1, Board, OtherPiece),
  (OtherPiece == redSoldier ; OtherPiece == redCityPiece).

/* Right side position, 1 row head and one column to the right */

/* Relative to red soldiers */
validateComputerRightAdjacentFrontEnemy(Row, Column, Board):-
  getPiece(Row, Column, Board, Piece),
  Piece == redSoldier,
  Row1 is Row + 1,
  Column1 is Column + 1,
  Row1 =< 9,
  Column1 =< 9,
  getPiece(Row1, Column1, Board, OtherPiece),
  (OtherPiece == blackSoldier ; OtherPiece == blackCityPiece).

/* Relative to black soldiers */
validateComputerRightAdjacentFrontEnemy(Row, Column, Board):-
  getPiece(Row, Column, Board, Piece),
  Piece == blackSoldier,
  Row1 is Row - 1,
  Column1 is Column + 1,
  Row1 =< 9,
  Column1 =< 9,
  getPiece(Row1, Column1, Board, OtherPiece),
  (OtherPiece == redSoldier ; OtherPiece == redCityPiece).

/* Left side -actual- left, one column to the left */

/* Relative to red soldiers */
validateComputerLeftSideEnemy(Row, Column, Board):-
  getPiece(Row, Column, Board, Piece),
  Piece == redSoldier,
  Row1 is Row,
  Column1 is Column - 1,
  Row1 =< 9,
  Column1 =< 9,
  getPiece(Row1, Column1, Board, OtherPiece),
  (OtherPiece == blackSoldier ; OtherPiece == blackCityPiece).

/* Relative to black soldiers */
validateComputerLeftSideEnemy(Row, Column, Board):-
  getPiece(Row, Column, Board, Piece),
  Piece == blackSoldier,
  Row1 is Row,
  Column1 is Column - 1,
  Row1 =< 9,
  Column1 =< 9,
  getPiece(Row1, Column1, Board, OtherPiece),
  (OtherPiece == redSoldier ; OtherPiece == redCityPiece).

/* Right side -actual- right */

/* Relative to red soldiers */
validateComputerRightSideEnemy(Row, Column, Board):-
  getPiece(Row, Column, Board, Piece),
  Piece == redSoldier,
  Row1 is Row,
  Column1 is Column + 1,
  Row1 =< 9,
  Column1 =< 9,
  getPiece(Row1, Column1, Board, OtherPiece),
  (OtherPiece == blackSoldier ; OtherPiece == blackCityPiece).

/* Relative to black soldiers */
validateComputerRightSideEnemy(Row, Column, Row1, Column1, Board):-
  getPiece(Row, Column, Board, Piece),
  Piece == blackSoldier,
  Row1 = Row,
  Column1 = Column + 1,
  Row1 =< 9,
  Column1 =< 9,
  getPiece(Row1, Column1, Board, OtherPiece),
  (OtherPiece == redSoldier ; OtherPiece == redCityPiece).

/* Option 1.2: retreat */

/* directly backwards */

/* relative to red soldiers */
validateComputerRetreatBack(Row, Column, Row1, Column1, Board):-
  getPiece(Row, Column, Board, Piece),
  Piece == redSoldier,
  checkComputerNearbyEnemies(Row, Column, Board),
  Row1 is Row - 2,
  Column1 = Column,
  Row1 >= 0,
  getPiece(Row1, Column, Board, OtherPiece),
  OtherPiece == emptyCell,
  Row2 is Row - 1,
  getPiece(Row2, Column, Board, OtherPiece2),
  OtherPiece2 == emptyCell, !.

/* relative to black soldiers */
validateComputerRetreatBack(Row, Column, Row1, Column1, Board):-
  getPiece(Row, Column, Board, Piece),
  Piece == blackSoldier,
  checkComputerNearbyEnemies(Row, Column, Board),
  Row1 is Row + 2,
  Column1 = Column,
  Row1 =< 9,
  getPiece(Row1, Column, Board, OtherPiece),
  OtherPiece == emptyCell,
  Row2 is Row + 1,
  getPiece(Row2, Column, Board, OtherPiece2),
  OtherPiece2 == emptyCell, !.

/* backwards to the left diagonal */

/* relative to red soldiers */
validateComputerRetreatLeft(Row, Column, Row1, Column1, Board):-
  getPiece(Row, Column, Board, Piece),
  Piece == redSoldier,
  checkComputerNearbyEnemies(Row, Column, Board),
  Row1 is Row - 2,
  Column1 is Column - 2,
  Row1 =< 9,
  getPiece(Row1, Column1, Board, OtherPiece),
  OtherPiece == emptyCell,
  Row2 is Row - 1,
  Column2 is Column - 1,
  getPiece(Row2, Column2, Board, OtherPiece2),
  OtherPiece2 == emptyCell, !.

/* relative to black soldiers */
validateComputerRetreatLeft(Row, Column, Row1, Column1, Board):-
  getPiece(Row, Column, Board, Piece),
  Piece == blackSoldier,
  checkComputerNearbyEnemies(Row, Column, Board),
  Row1 is Row + 2,
  Column1 is Column - 2,
  Row1 =< 9,
  getPiece(Row1, Column1, Board, OtherPiece),
  OtherPiece == emptyCell,
  Row2 is Row + 1,
  Column2 is Column - 1,
  getPiece(Row2, Column2, Board, OtherPiece2),
  OtherPiece2 == emptyCell, !.

/* backwards to the right diagonal */

/* relative to red soldiers */
validateComputerRetreatRight(Row, Column, Row1, Column1, Board):-
  getPiece(Row, Column, Board, Piece),
  Piece == redSoldier,
  checkComputerNearbyEnemies(Row, Column, Board),
  Row1 is Row - 2,
  Column1 is Column + 2,
  Row1 =< 9,
  getPiece(Row1, Column1, Board, OtherPiece),
  OtherPiece == emptyCell,
  Row2 is Row - 1,
  Column2 is Column + 1,
  getPiece(Row2, Column2, Board, OtherPiece2),
  OtherPiece2 == emptyCell, !.

/* relative to black soldiers */
validateComputerRetreatRight(Row, Column, Row1, Column1, Board):-
  getPiece(Row, Column, Board, Piece),
  Piece == blackSoldier,
  checkComputerNearbyEnemies(Row, Column, Board),
  Row1 is Row + 2,
  Column1 is Column + 2,
  Row1 =< 9,
  getPiece(Row1, Column1, Board, OtherPiece),
  OtherPiece == emptyCell,
  Row2 is Row + 1,
  Column2 is Column + 1,
  getPiece(Row2, Column2, Board, OtherPiece2),
  OtherPiece2 == emptyCell, !.

/* A valid movement can be forwards or backwards */
validateComputerMove(Row, Column, Row1, Column1, Board, CurrentMove):- validateComputerMoveFront(Row, Column, Row1, Column1, Board), CurrentMove = front.
validateComputerMove(Row, Column, Row1, Column1, Board, CurrentMove):- validateComputerMoveLeftAdjacentFront(Row, Column, Row1, Column1, Board), CurrentMove = frontLeft.
validateComputerMove(Row, Column, Row1, Column1, Board, CurrentMove):- validateComputerMoveRightAdjacentFront(Row, Column, Row1, Column1, Board), CurrentMove = frontRight.

validateComputerRetreat(Row, Column, Row1, Column1, Board, CurrentMove):- validateComputerRetreatBack(Row, Column, Row1, Column1, Board), CurrentMove = back.
validateComputerRetreat(Row, Column, Row1, Column1, Board, CurrentMove):- validateComputerRetreatLeft(Row, Column, Row1, Column1, Board), CurrentMove = backLeft.
validateComputerRetreat(Row, Column, Row1, Column1, Board, CurrentMove):- validateComputerRetreatRight(Row, Column, Row1, Column1, Board), CurrentMove = backRight.

/* A valid capture can only be in the follwing ways */
validateComputerCapture(Row, Column, Row1, Column1, Board, Position):- validateComputerCaptureFront(Row, Column, Row1, Column1, Board), Position = front.
validateComputerCapture(Row, Column, Row1, Column1, Board, Position):- validateComputerCaptureLeftAdjacentFront(Row, Column, Row1, Column1, Board), Position = frontLeft.
validateComputerCapture(Row, Column, Row1, Column1, Board, Position):- validateComputerCaptureRightAdjacentFront(Row, Column, Row1, Column1, Board), Position = frontRight.
validateComputerCapture(Row, Column, Row1, Column1, Board, Position):- validateComputerCaptureLeftSide(Row, Column, Row1, Column1, Board), Position = leftSide.
validateComputerCapture(Row, Column, Row1, Column1, Board, Position):- validateComputerCaptureRightSide(Row, Column, Row1, Column1, Board), Position = rightSide.

/* Option 2: use cannon */

/* Option 2.1: move cannon */

/* first you need a predicate to see if the selected piece is in a cannon line */

/* there are 4 possible cannon lines */

/* line 1: purely vertical line */

/*
   Piece1
   Piece2
   Piece3
*/

/* imagining Piece1 */
checkPieceInCannonComputer(Row, Column, Board, Piece, CannonType, PieceNumber):-
        CannonType = verticalCannon,
        PieceNumber = 1,
        Row2 is Row + 1,
        Column2 is Column,
        getPiece(Row2, Column2, Board, BackPiece),
        BackPiece == Piece,
        Row3 is Row + 2,
        Column3 is Column,
        getPiece(Row3, Column3, Board, SecondBackPiece),
        SecondBackPiece == Piece.

/* imagining Piece 2 */
checkPieceInCannonComputer(Row, Column, Board, Piece, CannonType, PieceNumber):-
        CannonType = verticalCannon,
        PieceNumber = 2,
        Row1 is Row - 1,
        Column1 is Column,
        getPiece(Row1, Column1, Board, FrontPiece),
        FrontPiece == Piece,
        Row3 is Row + 1,
        Column3 is Column,
        getPiece(Row3, Column3, Board, BackPiece),
        BackPiece == Piece.

/* imagining Piece 3 */
checkPieceInCannonComputer(Row, Column, Board, Piece, CannonType, PieceNumber):-
        CannonType = verticalCannon,
        PieceNumber = 3,
        Row1 is Row - 1,
        Column1 is Column,
        getPiece(Row1, Column1, Board, FrontPiece),
        FrontPiece == Piece,
        Row2 is Row - 2,
        Column2 is Column,
        getPiece(Row2, Column2, Board, SecondFrontPiece),
        SecondFrontPiece == Piece.


/* line 2: NW -> SE diagonal line */

/*      Piece1
                Piece2
                        Piece3
*/

/* imagining Piece1 */
checkPieceInCannonComputer(Row, Column, Board, Piece, CannonType, PieceNumber):-
        CannonType = diagonalNWSECannon,
        PieceNumber = 1,
        Row2 is Row + 1,
        Column2 is Column + 1,
        getPiece(Row2, Column2, Board, BackPiece),
        BackPiece == Piece,
        Row3 is Row + 2,
        Column3 is Column + 2,
        getPiece(Row3, Column3, Board, SecondBackPiece),
        SecondBackPiece == Piece.


/* imagining Piece 2 */
checkPieceInCannonComputer(Row, Column, Board, Piece, CannonType, PieceNumber):-
        CannonType = diagonalNWSECannon,
        PieceNumber = 2,
        Row1 is Row - 1,
        Column1 is Column - 1,
        getPiece(Row1, Column1, Board, FrontPiece),
        FrontPiece == Piece,
        Row3 is Row + 1,
        Column3 is Column + 1,
        getPiece(Row3, Column3, Board, BackPiece),
        BackPiece == Piece.


/* imagining Piece 3 */
checkPieceInCannonComputer(Row, Column, Board, Piece, CannonType, PieceNumber):-
        CannonType = diagonalNWSECannon,
        PieceNumber = 3,
        Row1 is Row - 1,
        Column1 is Column - 1,
        getPiece(Row1, Column1, Board, FrontPiece),
        FrontPiece == Piece,
        Row2 is Row - 2,
        Column2 is Column - 2,
        getPiece(Row2, Column2, Board, SecondFrontPiece),
        SecondFrontPiece == Piece.

/* line 3: SW -> NE diagonal line */

/*
                        Piece1
                Piece2
        Piece3
*/

/* imagining Piece1 */
checkPieceInCannonComputer(Row, Column, Board, Piece, CannonType, PieceNumber):-
        CannonType = diagonalSWNECannon,
        PieceNumber = 1,
        Row2 is Row + 1,
        Column2 is Column - 1,
        getPiece(Row2, Column2, Board, BackPiece),
        BackPiece == Piece,
        Row3 is Row + 2,
        Column3 is Column - 2,
        getPiece(Row3, Column3, Board, SecondBackPiece),
        SecondBackPiece == Piece.

/* imagining Piece 2 */
checkPieceInCannonComputer(Row, Column, Board, Piece, CannonType, PieceNumber):-
        CannonType = diagonalSWNECannon,
        PieceNumber = 2,
        Row1 is Row - 1,
        Column1 is Column + 1,
        getPiece(Row1, Column1, Board, FrontPiece),
        FrontPiece == Piece,
        Row3 is Row + 1,
        Column3 is Column - 1,
        getPiece(Row3, Column3, Board, BackPiece),
        BackPiece == Piece.

/* imagining Piece 3 */
checkPieceInCannonComputer(Row, Column, Board, Piece, CannonType, PieceNumber):-
        CannonType = diagonalSWNECannon,
        PieceNumber = 3,
        Row1 is Row - 1,
        Column1 is Column + 1,
        getPiece(Row1, Column1, Board, FrontPiece),
        FrontPiece == Piece,
        Row2 is Row - 2,
        Column2 is Column + 2,
        getPiece(Row2, Column2, Board, SecondFrontPiece),
        SecondFrontPiece == Piece.

/* line 4: purely horizontal line */

/* Piece1 Piece2 Piece3 */

/* imagining Piece1 */
checkPieceInCannonComputer(Row, Column, Board, Piece, CannonType, PieceNumber):-
        CannonType = horizontalCannon,
        PieceNumber = 1,
        Row2 is Row,
        Column2 is Column + 1,
        getPiece(Row2, Column2, Board, BackPiece),
        BackPiece == Piece,
        Row3 is Row,
        Column3 is Column + 2,
        getPiece(Row3, Column3, Board, SecondBackPiece),
        SecondBackPiece == Piece.

/* imagining Piece 2 */
checkPieceInCannonComputer(Row, Column, Board, Piece, CannonType, PieceNumber):-
        CannonType = horizontalCannon,
        PieceNumber = 2,
        Row1 is Row,
        Column1 is Column + 1,
        getPiece(Row1, Column1, Board, FrontPiece),
        FrontPiece == Piece,
        Row2 is Row,
        Column2 is Column - 1,
        getPiece(Row2, Column2, Board, BackPiece),
        BackPiece == Piece.

/* imagining Piece 3 */
checkPieceInCannonComputer(Row, Column, Board, Piece, CannonType, PieceNumber):-
        CannonType = horizontalCannon,
        PieceNumber = 3,
        Row1 is Row,
        Column1 is Column - 1,
        getPiece(Row1, Column1, Board, FrontPiece),
        FrontPiece == Piece,
        Row2 is Row,
        Column2 is Column - 2,
        getPiece(Row2, Column2, Board, SecondFrontPiece),
        SecondFrontPiece == Piece.

checkPieceInCannonComputer(_, _, _, _, _, _):- nl, fail.

/* now for actual movement validity */

/* forward */

/* vertical line */

/* red cannon */
validateComputerMoveCannonForward(Row, Column, Row1, Column1, Board, CannonType, PieceNumber):-
        getPiece(Row, Column, Board, Piece),
        Piece == redSoldier,
        CannonType == verticalCannon,
        Row1 is Row + (4 - PieceNumber),
        Column1 is Column,
        getPiece(Row1, Column1, Board, OtherPiece),
        OtherPiece == emptyCell.

/* black cannon */
validateComputerMoveCannonForward(Row, Column, Row1, Column1, Board, CannonType, PieceNumber):-
        getPiece(Row, Column, Board, Piece),
        Piece == blackSoldier,
        CannonType == verticalCannon,
        Row1 is Row - PieceNumber,
        Column1 is Column,
        getPiece(Row1, Column1, Board, OtherPiece),
        OtherPiece == emptyCell.

/* NW -> SE diagonal line */

validateComputerMoveCannonForward(Row, Column, Row1, Column1, Board, CannonType, PieceNumber):-
        CannonType == diagonalNWSECannon,
        Row1 is Row - PieceNumber,
        Column1 is Column - PieceNumber,
        getPiece(Row1, Column1, Board, Piece),
        Piece == emptyCell.

/* SW -> NE diagonal line */

validateComputerMoveCannonForward(Row, Column, Row1, Column1, Board, CannonType, PieceNumber):-
        CannonType == diagonalSWNECannon,
        Row1 is Row - PieceNumber,
        Column1 is Column + PieceNumber,
        getPiece(Row1, Column1, Board, Piece),
        Piece == emptyCell.

/* Horizontal line */

validateComputerMoveCannonForward(Row, Column, Row1, Column1, Board, CannonType, PieceNumber):-
        CannonType == horizontalCannon,
        Row1 is Row,
        Column1 is Column + (4-PieceNumber),
        getPiece(Row1, Column1, Board, Piece),
        Piece == emptyCell.

/* backward */

/* vertical line */

/* red cannon */
validateComputerMoveCannonBackward(Row, Column, Row1, Column1, Board, CannonType, PieceNumber):-
        getPiece(Row, Column, Board, Piece),
        Piece == redSoldier,
        CannonType == verticalCannon,
        Row1 is Row - PieceNumber,
        Column1 is Column,
        getPiece(Row1, Column1, Board, OtherPiece),
        OtherPiece == emptyCell.

/* black cannon */
validateComputerMoveCannonBackward(Row, Column, Row1, Column1, Board, CannonType, PieceNumber):-
        getPiece(Row, Column, Board, Piece),
        Piece == blackSoldier,
        CannonType == verticalCannon,
        Row1 is Row + (4 - PieceNumber),
        Column1 is Column,
        getPiece(Row1, Column1, Board, OtherPiece),
        OtherPiece == emptyCell.

/* NW -> SE diagonal line */

validateComputerMoveCannonBackward(Row, Column, Row1, Column1, Board, CannonType, PieceNumber):-
        CannonType == diagonalNWSECannon,
        Row1 is Row + (4 - PieceNumber),
        Column1 is Column + (4 - PieceNumber),
        getPiece(Row1, Column1, Board, Piece),
        Piece == emptyCell.

/* SW -> NE diagonal line */

validateComputerMoveCannonBackward(Row, Column, Row1, Column1, Board, CannonType, PieceNumber):-
        CannonType == diagonalSWNECannon,
        Row1 is Row + (4 - PieceNumber),
        Column1 is Column - (4-PieceNumber),
        getPiece(Row1, Column1, Board, Piece),
        Piece == emptyCell.

/* Horizontal line */

validateComputerMoveCannonBackward(Row, Column, Row1, Column1, Board, CannonType, PieceNumber):-
        CannonType == horizontalCannon,
        Row1 is Row,
        Column1 is Column - PieceNumber,
        getPiece(Row1, Column1, Board, Piece),
        Piece == emptyCell.

validateComputerMoveCannon(Row, Column, Row1, Column1, Board, CannonType, PieceNumber, CurrentMove):- validateComputerMoveCannonForward(Row, Column, Row1, Column1, Board, CannonType, PieceNumber), CurrentMove = forward.
validateComputerMoveCannon(Row, Column, Row1, Column1, Board, CannonType, PieceNumber, CurrentMove):- validateComputerMoveCannonBackward(Row, Column, Row1, Column1, Board, CannonType, PieceNumber), CurrentMove = backward.
validateComputerMoveCannon(_, _, _, _, _, _, _, _):- nl, !, fail.

/* Option 2.2: capture cannon */

/* Capture up for both players */

validateComputerCaptureCannonFront(Row, Column, Row1, Column1, Board, CannonType, PieceNumber):-
        getPiece(Row, Column, Board, Piece),
        CannonType == verticalCannon,
        Column1 is Column,
        Row2 is Row - PieceNumber,
        getPiece(Row2, Column, Board, EmptyPiece),
        EmptyPiece == emptyCell,
        (
        (Row1 is Row - (PieceNumber+1),
          getPiece(Row1, Column, Board, EnemyPiece),
          ((Piece == blackSoldier,
          (EnemyPiece == redSoldier; EnemyPiece == redCityPiece)
            )
          ;
          (Piece == redSoldier,
          (EnemyPiece == blackSoldier; EnemyPiece == blackCityPiece)
          ))
        )
        ;
          (Row1 is Row - (PieceNumber+2),
          getPiece(Row1, Column, Board, EnemyPiece),
          ((Piece == blackSoldier,
          (EnemyPiece == redSoldier; EnemyPiece == redCityPiece))
          ;
          (Piece == redSoldier,
          (EnemyPiece == blackSoldier; EnemyPiece == blackCityPiece)
          )
        ))).

/* Capture up for both players */

validateComputerCaptureCannonBack(Row, Column, Row1, Column1, Board, CannonType, PieceNumber):-
        getPiece(Row, Column, Board, Piece),
        CannonType == verticalCannon,
        Column1 is Column,
        Row2 is Row + (4-PieceNumber),
        getPiece(Row2, Column, Board, EmptyPiece),
        EmptyPiece == emptyCell,
        (
        (Row1 is Row + (5-PieceNumber),
          getPiece(Row1, Column, Board, EnemyPiece),
          ((Piece == blackSoldier,
          (EnemyPiece == redSoldier; EnemyPiece == redCityPiece)
            )
          ;
          (Piece == redSoldier,
          (EnemyPiece == blackSoldier; EnemyPiece == blackCityPiece)
          ))
        )
        ;
          (Row1 is Row + (5-PieceNumber),
          getPiece(Row1, Column, Board, EnemyPiece),
          ((Piece == blackSoldier,
          (EnemyPiece == redSoldier; EnemyPiece == redCityPiece)
          )
          ;
          (Piece == redSoldier,
          (EnemyPiece == blackSoldier; EnemyPiece == blackCityPiece)
          )
        ))).

/* Capture left for both players */

validateComputerCaptureLeftSide(Row, Column, Row1, Column1, Board, CannonType, PieceNumber):-
        getPiece(Row, Column, Board, Piece),
        CannonType == horizontalCannon,
        Row1 is Row,
        Column2 is Column - PieceNumber,
        getPiece(Row, Column2, Board, EmptyPiece),
        EmptyPiece == emptyCell,
        (
        (Column1 is Column - (PieceNumber+1),
          getPiece(Row, Column1, Board, EnemyPiece),
          ((Piece == blackSoldier,
          (EnemyPiece == redSoldier; EnemyPiece == redCityPiece)
            )
          ;
          (Piece == redSoldier,
          (EnemyPiece == blackSoldier; EnemyPiece == blackCityPiece)
          ))
        )
        ;
          (Column1 is Column - (PieceNumber+2),
          getPiece(Row, Column1, Board, EnemyPiece),
          ((Piece == blackSoldier,
          (EnemyPiece == redSoldier; EnemyPiece == redCityPiece)
          )
          ;
          (Piece == redSoldier,
          (EnemyPiece == blackSoldier; EnemyPiece == blackCityPiece)
          )
        ))).

/* Capture right for both players */

validateComputerCaptureRightSide(Row, Column, Row1, Column1, Board, CannonType, PieceNumber):-
        getPiece(Row, Column, Board, Piece),
        CannonType == horizontalCannon,
        Row1 is Row,
        Column2 is Column + 4 - PieceNumber,
        getPiece(Row, Column2, Board, EmptyPiece),
        EmptyPiece == emptyCell,
        (
        (Column1 is Column + 5 - PieceNumber,
          getPiece(Row, Column1, Board, EnemyPiece),
          ((Piece == blackSoldier,
          (EnemyPiece == redSoldier; EnemyPiece == redCityPiece)
            )
          ;
          (Piece == redSoldier,
          (EnemyPiece == blackSoldier; EnemyPiece == blackCityPiece)
          ))
        )
        ;
          (Column1 is Column + 6 - PieceNumber,
          getPiece(Row, Column1, Board, EnemyPiece),
          ((Piece == blackSoldier,
          (EnemyPiece == redSoldier; EnemyPiece == redCityPiece)
          )
          ;
          (Piece == redSoldier,
          (EnemyPiece == blackSoldier; EnemyPiece == blackCityPiece)
          )
        ))).

/* Capture in North East direction for both players */

validateComputerCaptureNE(Row, Column, Row1, Column1, Board, CannonType, PieceNumber):-
        getPiece(Row, Column, Board, Piece),
        CannonType == diagonalSWNECannon,
        Row2 is Row - PieceNumber,
        Column2 is Column + PieceNumber,
        getPiece(Row2, Column2, Board, EmptyPiece),
        EmptyPiece == emptyCell,
        (
        ( Column1 is Column + PieceNumber+1,
          Row1 is Row - (PieceNumber + 1),
          getPiece(Row1, Column1, Board, EnemyPiece),
          ((Piece == blackSoldier,
          (EnemyPiece == redSoldier; EnemyPiece == redCityPiece)
            )
          ;
          (Piece == redSoldier,
          (EnemyPiece == blackSoldier; EnemyPiece == blackCityPiece)
          ))
        )
        ;
          (Column1 is Column + PieceNumber+2,
          Row1 is Row - (PieceNumber + 2),
          getPiece(Row1, Column1, Board, EnemyPiece),
          (
            (Piece == blackSoldier,
            (EnemyPiece == redSoldier; EnemyPiece == redCityPiece)
            )
          ;
            (Piece == redSoldier,
            (EnemyPiece == blackSoldier; EnemyPiece == blackCityPiece)
            )
          )
        )).

/* Capture in North West direction for both players */

validateComputerCaptureNW(Row, Column, Row1, Column1, Board, CannonType, PieceNumber):-
        getPiece(Row, Column, Board, Piece),
        CannonType == diagonalNWSECannon,
        Row2 is Row - PieceNumber,
        Column2 is Column - PieceNumber,
        getPiece(Row2, Column2, Board, EmptyPiece),
        EmptyPiece == emptyCell,
        (
        ( Column1 is Column - (PieceNumber + 1),
          Row1 is Row - (PieceNumber + 1),
          getPiece(Row1, Column1, Board, EnemyPiece),
          ((Piece == blackSoldier,
          (EnemyPiece == redSoldier; EnemyPiece == redCityPiece)
            )
          ;
          (Piece == redSoldier,
          (EnemyPiece == blackSoldier; EnemyPiece == blackCityPiece)
          ))
        )
        ;
          (Column1 is Column - (PieceNumber + 2),
          Row1 is Row - (PieceNumber + 2),
          getPiece(Row1, Column1, Board, EnemyPiece),
          (
            (Piece == blackSoldier,
            (EnemyPiece == redSoldier; EnemyPiece == redCityPiece)
            )
          ;
            (Piece == redSoldier,
            (EnemyPiece == blackSoldier; EnemyPiece == blackCityPiece)
            )
          )
        )).

/* Capture in South West direction for both players */

validateComputerCaptureSW(Row, Column, Row1, Column1, Board, CannonType, PieceNumber):-
        getPiece(Row, Column, Board, Piece),
        CannonType == diagonalSWNECannon,
        Row2 is Row + (4-PieceNumber),
        Column2 is Column - (4 - PieceNumber),
        getPiece(Row2, Column2, Board, EmptyPiece),
        EmptyPiece == emptyCell,
        (
        ( Column1 is Column - (5 - PieceNumber),
          Row1 is Row + (5-PieceNumber),
          getPiece(Row1, Column1, Board, EnemyPiece),
          ((Piece == blackSoldier,
          (EnemyPiece == redSoldier; EnemyPiece == redCityPiece)
            )
          ;
          (Piece == redSoldier,
          (EnemyPiece == blackSoldier; EnemyPiece == blackCityPiece)
          ))
        )
        ;
          (Column1 is Column - (6 - PieceNumber),
          Row1 is Row + (6-PieceNumber),
          getPiece(Row1, Column1, Board, EnemyPiece),
          (
            (Piece == blackSoldier,
            (EnemyPiece == redSoldier; EnemyPiece == redCityPiece)
            )
          ;
            (Piece == redSoldier,
            (EnemyPiece == blackSoldier; EnemyPiece == blackCityPiece)
            )
          )
        )).

/* Capture in South East direction for both players */

validateComputerCaptureSE(Row, Column, Row1, Column1, Board, CannonType, PieceNumber):-
        getPiece(Row, Column, Board, Piece),
        CannonType == diagonalNWSECannon,
        Row2 is Row + (4 - PieceNumber),
        Column2 is Column + (4 - PieceNumber),
        getPiece(Row2, Column2, Board, EmptyPiece),
        EmptyPiece == emptyCell,
        (
        ( Column1 is Column + (5 - PieceNumber),
          Row1 is Row + (5 - PieceNumber),
          getPiece(Row1, Column1, Board, EnemyPiece),
          ((Piece == blackSoldier,
          (EnemyPiece == redSoldier; EnemyPiece == redCityPiece)
            )
          ;
          (Piece == redSoldier,
          (EnemyPiece == blackSoldier; EnemyPiece == blackCityPiece)
          ))
        )
        ;
          (Column1 is Column + (6 - PieceNumber),
          Row1 is Row + (6 - PieceNumber),
          getPiece(Row1, Column1, Board, EnemyPiece),
          (
            (Piece == blackSoldier,
            (EnemyPiece == redSoldier; EnemyPiece == redCityPiece)
            )
          ;
            (Piece == redSoldier,
            (EnemyPiece == blackSoldier; EnemyPiece == blackCityPiece)
            )
          )
        )).

/* A valid cannon capture can only be in the following ways */
validateComputerCaptureCannon(Row, Column, Row1, Column1, Board, CannonType, PieceNumber):- validateComputerCaptureCannonFront(Row, Column, Row1, Column1, Board, CannonType, PieceNumber).
validateComputerCaptureCannon(Row, Column, Row1, Column1, Board, CannonType, PieceNumber):- validateComputerCaptureCannonBack(Row, Column, Row1, Column1, Board, CannonType, PieceNumber).
validateComputerCaptureCannon(Row, Column, Row1, Column1, Board, CannonType, PieceNumber):- validateComputerCaptureRightSide(Row, Column, Row1, Column1, Board, CannonType, PieceNumber).
validateComputerCaptureCannon(Row, Column, Row1, Column1, Board, CannonType, PieceNumber):- validateComputerCaptureLeftSide(Row, Column, Row1, Column1, Board, CannonType, PieceNumber).
validateComputerCaptureCannon(Row, Column, Row1, Column1, Board, CannonType, PieceNumber):- validateComputerCaptureNE(Row, Column, Row1, Column1, Board, CannonType, PieceNumber).
validateComputerCaptureCannon(Row, Column, Row1, Column1, Board, CannonType, PieceNumber):- validateComputerCaptureNW(Row, Column, Row1, Column1, Board, CannonType, PieceNumber).
validateComputerCaptureCannon(Row, Column, Row1, Column1, Board, CannonType, PieceNumber):- validateComputerCaptureSE(Row, Column, Row1, Column1, Board, CannonType, PieceNumber).
validateComputerCaptureCannon(Row, Column, Row1, Column1, Board, CannonType, PieceNumber):- validateComputerCaptureSW(Row, Column, Row1, Column1, Board, CannonType, PieceNumber).

validateComputerCaptureCannon(_, _, _, _, _, _, _):- nl, fail.
