const PROGRAM: string = `
ClrHome
Output(4,3,"WELCOME TO..."
Pause 
Output(8,1,"HIGHSCORE:"
Output(8,11,theta)
Output(5,2,"TR'S BLACKJACK"
Pause 
500->S
Lbl 1
0->A
0->B
0->C
0->D
0->E
0->Z
0->Y
0->X
0->V
0->U
0->W
0->T
ClrHome
Lbl 22
Menu("WHAT TO DO?","DEAL UM' UP",DC,"VIEW WALLET",VW)
Lbl VW
ClrHome
Output(1,1,"CASH LEFT:"
Output(1,12,S)
Pause 
If S<=0
Then
\tOutput(4,4,"SORRY MAN."
\tOutput(5,3,"YOU'RE BROKE.
\tPause 
\tGoto 99
End
Goto 22
Lbl DC
ClrHome
If S<=0
Then
\tOutput(4,3,"THIS TABLE IS"
\tOutput(5,2,"FOR PEOPLE WHO"
\tOutput(6,4,"HAVE MONEY."
\tPause 
\tGoto 99
End
Disp "BET HOW MUCH?   "
Input R
If R<=0
Goto K2
If R>S
Goto K1
If R<=S
Goto 2
End
Lbl K1
If S<=0
Goto NC
If S>0
Goto MB
End
Lbl MB
ClrHome
Disp "YOU MUST BET"
Disp "LESS THAN"
Output(2,11,S)
Pause 
Goto 1
End
Lbl NC
Disp "SORRY. YOU ARE"
Disp "OUT OF CASH"
Pause 
Goto 99
End
Lbl K2
ClrHome
Disp "YOU MUST BET"
Disp "MORE THAN 0"
Pause 
Goto 1
End
Lbl 2
randInt(2,11)->A
randInt(2,11)->B
If A=11 and B=11
10->B
ClrHome
Output(1,2,"1ST CARD:"
If A=11
Then
\tOutput(1,11,"A"
Else
\tOutput(1,11,A)
End
Pause 
Output(2,2,"2ND CARD:"
If B=11
Then
\tOutput(2,11,"A"
Else
\tOutput(2,11,B)
End
Pause 
If A=11
Then
\tMenu("YOU HAVE AN ACE","SCORE AS 1",A1,"SCORE AS 11",A2)
Else
\tGoto 1B
\tLbl A1
\t1->A
\tGoto 1T
\tLbl A2
\t11->A
\tGoto 1T
\tLbl 1B
\tIf B=11
\tThen
\t\tMenu("YOU HAVE AN ACE","SCORE AS 1",B1,"SCORE AS 11",B2)
\tElse
\t\tGoto 1T
\tEnd
\tLbl B1
\t1->B
\tGoto 1T
\tLbl B2
\t11->B
\tGoto 1T
\tLbl 1T
\tA+B->T
\tOutput(8,2,"TOTAL:")
\tOutput(8,9,T)
\tPause 
\tMenu("HIT?","YES",A,"STAY",theta)
End
Lbl A
randInt(2,11)->C
Output(3,2,"3RD CARD:"
If C=11
Then
\tOutput(3,11,"A"
Else
\tOutput(3,11,C)
End
Output(8,2,"              "
Pause 
If C=11
Then
\tMenu("YOU HAVE AN ACE","SCORE AS 1",C1,"SCORE AS 11",C2)
Else
\tGoto 2T
End
Lbl C1
1->C
Goto 2T
Lbl C2
11->C
Goto 2T
Lbl 2T
T+C->T
Output(8,2,"TOTAL:"
Output(8,9,T)
Pause 
Menu("HIT?","YES",B,"STAY",theta)
End
Lbl B
randInt(2,11)->D
Output(4,2,"4TH CARD:"
If D=11
Then
\tOutput(4,11,"A"
Else
\tOutput(4,11,D)
End
Output(8,2,"              "
Pause 
If D=11
Then
\tMenu("YOU HAVE AN ACE","SCORE AS 1",D1,"SCORE AS 11",D2)
Else
\tGoto 3T
End
Lbl D1
1->D
Goto 3T
Lbl D2
11->D
Goto 3T
Lbl 3T
T+D->T
Output(8,2,"TOTAL:"
Output(8,8,T)
Pause 
Menu("HIT","YES",C,"STAY",theta)
Lbl C
randInt(2,11)->E
Output(5,2,"5TH CARD:"
If E=11
Then
\tOutput(5,11,"A"
Else
\tOutput(5,11,E)
End
Output(8,2,"              "
Pause 
If E=11
Then
\tMenu("YOU HAVE AN ACE","SCORE AS 1",E1,"SCORE AS 11",E2)
Else
\tGoto 4T
End
Lbl E1
1->E
Goto 4T
Lbl E2
11->E
Goto 4T
Lbl 4T
T+E->T
Output(8,2,"TOTAL:"
Output(8,8,T)
Pause 
Goto theta
Lbl theta
ClrHome
Output(8,2,"YOU HAVE:")
Output(8,11,T)
Pause 
If T>21
Goto thetatheta
If T<=21
Goto thetaD
End
Lbl thetaD
randInt(2,11)->Y
randInt(2,11)->X
If Y=11 and X=11
10->X
Output(1,2,"1ST CARD:"
If Y=11
Then
\tOutput(1,11,"A"
Else
\tOutput(1,11,Y)
End
Output(2,2,"2ND CARD:"
If X=11
Then
\tOutput(2,11,"A"
Else
\tOutput(2,11,X)
End
Pause 
Y+X->Z
Output(7,2,"DEALER HAS:"
Output(7,13,Z)
Pause 
If Z>=17
Goto thetaS
If Z<17
Goto thetaH
End
Lbl thetaH
Output(6,3,"-DEALER HITS-"
Pause 
Output(6,2,"               "
randInt(1,11)->W
Output(3,2,"3RD CARD:"
If W=11
Then
\tOutput(3,11,"A"
Else
\tOutput(3,11,W)
End
Output(7,2,"               "
Pause 
If W=11
Then
\tW+Z->P
\tGoto 1P
End
Goto 1Z
Lbl 1P
If P>21
1->W
Lbl 1Z
W+Z->Z
Output(7,2,"DEALER HAS:"
Output(7,13,Z)
Pause 
If Z<17
Goto H2
If Z>=17
Goto thetaS
End
Lbl H2
Output(6,3,"-DEALER HITS-"
Pause 
Output(6,2,"               "
randInt(1,11)->V
Output(4,2,"4TH CARD:"
If V=11
Then
\tOutput(4,11,"A"
Else
\tOutput(4,11,V)
End
Output(7,2,"              "
Pause 
If V=11
Then
\tV+Z->P
\tGoto 2P
Else
\tGoto 2Z
End
Lbl 2P
If P>21
1->V
Goto 2Z
Lbl 2Z
V+Z->Z
Output(7,2,"DEALER HAS:"
Output(7,13,Z)
Pause 
If Z>=17
Goto thetaS
If Z<17
Goto H3
End
Lbl H3
Output(6,3,"-DEALER HITS-"
Pause 
Output(6,2,"               "
randInt(1,11)->U
Output(5,2,"5TH CARD:"
If U=11
Then
\tOutput(5,11,"A"
Else
\tOutput(5,11,U)
End
Output(7,2,"              "
Pause 
If U=11
Then
\tU+Z->P
\tGoto 3P
Else
\tGoto 3Z
End
Lbl 3P
If P>21
1->U
Goto 3Z
Lbl 3Z
U+Z->Z
Output(7,2,"DEALER HAS:"
Output(7,13,Z)
Pause 
Goto thetaS
End
Lbl thetaS
Output(6,2,"-DEALER STAYS-"
Pause 
ClrHome
If Z>21
Goto DB
Output(7,2,"DEALER HAS:"
Output(7,13,Z)
Output(8,2,"YOU HAVE:"
Output(8,11,T)
Pause 
If Z=T
Goto SM
If Z>T
Goto DW
If T>Z
Goto YW
Lbl thetatheta
ClrHome
Output(4,6,"!BUST!"
Pause 
Output(4,5,"YOU LOSE"
Pause 
S-R->S
Output(7,5,"CASH:"
Output(7,11,S)
Pause 
Goto PA
Lbl DW
ClrHome
If E>0
Goto 5C
Output(4,5,"YOU LOSE"
Pause 
S-R->S
Output(7,5,"CASH:"
Output(7,11,S)
Pause 
Goto PA
End
Lbl YW
ClrHome
If T=21 and C=0
Goto BJ
If E>0
Goto 5C
Output(4,5,"YOU WIN!"
Pause 
S+R->S
Output(7,5,"CASH:"
Output(7,11,S)
Pause 
Goto PA
End
Lbl PA
Menu("DEAL AGAIN?","YES",1,"LEAVE TABLE",99)
Lbl 99
ClrHome
Output(3,4,"FINAL"
Output(4,4,"SCORE:"
Output(4,11,S)
Pause 
If S>theta
Then
\tS->theta
\tOutput(7,2,"HIGHSCORE!"
\tPause 
End
prgmCASINO
Lbl SM
ClrHome
If E>0
Goto 5C
If T=21 and C=0
Goto BJ
Output(4,7,"PUSH"
Pause 
Output(7,5,"CASH:"
Output(7,11,S)
Pause 
Goto PA
End
Lbl DB
Output(4,3,"DEALER BUST!"
Pause 
If E>0
Goto 5C
If T=21 and C=0
Goto BJ
Output(5,5,"YOU WIN!"
Pause 
S+R->S
Output(7,5,"CASH:"
Output(7,11,S)
Pause 
Goto PA
End
Lbl BJ
ClrHome
Output(4,4,"BLACK JACK"
Pause 
Output(5,5,"YOU WIN!"
Pause 
S+2R->S
Output(7,5,"CASH:"
Output(7,11,S)
Pause 
Goto PA
End
Lbl 5C
ClrHome
Output(3,4,"YOU HAVE A"
Output(4,2,"5 CARD CHARLIE"
Pause 
Output(5,5,"YOU WIN!"
Pause 
S+4R->S
Output(7,5,"CASH:"
Output(7,11,S)
Pause 
Goto PA
End
Lbl GC
prgmCASINO
End
`

export default PROGRAM