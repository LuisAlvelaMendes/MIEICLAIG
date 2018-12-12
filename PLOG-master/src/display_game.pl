:-include('boardLists.pl').

/*Separador de cima */
printGenericSeparator:-write('   _______________________________________'), nl.

/*Spearador do meio */
printMiddleSeparator:-write('  |___|___|___|___|___|___|___|___|___|___|'), nl.

/*Letras do fim */
printLetters:- write('    A   B   C   D   E   F   G   H   I   J '), nl.

/*Varios carateres e a sua correspondencia com elementos na lista interna*/
getSymbol(emptyCell, ' ').
getSymbol(redSoldier, 'R').
getSymbol(blackSoldier, 'B').
getSymbol(redCityPiece, '#').
getSymbol(blackCityPiece, '$').

/*Imprime um daqueles carateres com barras a volta*/
printCell(Char):- write('| '), write(Char), write(' ').

/*Caso base: quando ja consumiu toda a linha (sublista da lista grande) so imprime uma barra final e um espaco*/
display_board_line([]):- write('| ') , nl, printMiddleSeparator.

/*Para cada linha, ou seja, sublista, vai tentando encontrar uma correspondencia entre o elemento a analisar nesta etapa, que vai sendo a cabeca, e o charater a imprimir. Depois usa-se tail rescursion para ir passando ao proximo elemento*/
display_board_line([Head|Tail]):- getSymbol(Head,Char), printCell(Char), display_board_line(Tail).

displayID(ID):- ID \= '10', write(ID), write(' ').
displayID(ID):- ID = '10', write(ID).

/*Vai consumindo cada sublista da lista grande, cada linha [emptyCell, emptyCell, ...] neste caso e um "Head", vai-se usando tail recursion para chegar as outras linhas*/
display_game_aux([], []):-printLetters, nl.
display_game_aux([Head|Tail], [RHead|RTail]):- displayID(RHead), display_board_line(Head), display_game_aux(Tail, RTail).

display_game(Board):- clearConsole, printGenericSeparator, display_game_aux(Board, ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1']).

/*display_game(+Board,+Player)*/
