const PROGRAM = `
30->M
300->J
ClrHome
Output(4,3,"WELCOME TO..."
Pause 
Output(5,4,"TR'S SLOTS"
Pause 
Output(8,1,"HIGHSCORE:"
Output(8,12,Q)
Pause 
Lbl 1
ClrHome
Menu("WHAT TO DO?","PLAY THE SLOTS",PS,"CHECK WALLET",CW,"WINNING COMBOS",WC)
Lbl CW
If M<=0
Goto 99
Output(1,1,"COINS:"
Output(1,8,M)
Pause 
Goto 1
Lbl PS
If M<=0
Goto 99
MENU("INSERT COINS...","3 Coins",3C,"2 Coins",2C,"1 Coin",1C)
Lbl 1C
1 -> X
Goto PPS
Lbl 2C
2 -> X
Goto PPS
Lbl 3C
3 -> X
Goto PPS
Lbl PPS
If X>M
Goto NE
M-X->M
J+1->J
randInt(1,7)->A
Lbl 11
randInt(1,7)->B
If B=A
Goto 11
Lbl 12
randInt(1,7)->C
If C=A or C=B
Goto 12
randInt(1,7)->D
Lbl 13
randInt(1,7)->E
If E=D
Goto 13
Lbl 14
randInt(1,7)->F
If F=D or F=E
Goto 14
randInt(1,7)->G
Lbl 15
randInt(1,7)->H
If H=G
Goto 15
Lbl 16
randInt(1,7)->I
If I=G or I=H
Goto 16
If X=1
Then
\tClrHome
\tOutput(1,1,"JACKPOT: ")
\tOutput(1,10,J
\tOutput(5,1,"*")
\tPause 
End
If X=2
Then
\tClrHome
\tOutput(1,1,"JACKPOT: "
\tOutput(1,10,J
\tOutput(5,1,"*"
\t
\tOutput(3,1,"*"
\tOutput(7,1,"*"
\tPause 
End
If X=3
Then
\tClrHome
\tOutput(1,1,"JACKPOT: "
\tOutput(1,10,J
\tOutput(5,1,"*"
\t
\tOutput(3,1,"*"
\tOutput(7,1,"*"
\t
\tOutput(2,1,"*"
\tOutput(8,1,"*"
\tPause 
End
If A=1
Then
\tOutput(3,3,"="
\tGoto SB
End
If A=8
Then
\tOutput(3,3,"W"
\tGoto SB
End
Output(3,3,A)
Lbl SB
If B=1
Then
\tOutput(5,3,"="
\tGoto SC
End
If B=8
Then
\tOutput(5,3,"W"
\tGoto SC
End
Output(5,3,B)
Lbl SC
If C=1
Then
\tOutput(7,3,"="
\tGoto SD
End
If C=8
Then
\tOutput(7,3,"W"
\tGoto SD
End
Output(7,3,C)
Lbl SD
Pause 
If D=1
Then
\tOutput(3,6,"="
\tGoto SE
End
If D=8
Then
\tOutput(3,6,"W"
\tGoto SE
End
Output(3,6,D)
Lbl SE
If E=1
Then
\tOutput(5,6,"="
\tGoto SF
End
If E=8
Then
\tOutput(5,6,"W"
\tGoto SF
End
Output(5,6,E)
Lbl SF
If F=1
Then
\tOutput(7,6,"="
\tGoto SG
End
If F=8
Then
\tOutput(7,6,"W"
\tGoto SG
End
Output(7,6,F)
Lbl SG
Pause 
If G=1
Then
\tOutput(3,9,"="
\tGoto SH
End
If G=8
Then
\tOutput(3,9,"W"
\tGoto SH
End
Output(3,9,G)
Lbl SH
If H=1
Then
\tOutput(5,9,"="
\tGoto SI
End
If H=8
Then
\tOutput(5,9,"W"
\tGoto SI
End
Output(5,9,H)
Lbl SI
If I=1
Then
\tOutput(7,9,"="
\tGoto LO
End
If I=8
Then
\tOutput(7,9,"W"
\tGoto LO
End
Output(7,9,I)
Lbl LO
Pause 
If X=1
Goto C1
If X=2
Goto C2
If X=3
Goto C3
ClrHome
Disp "PLEASE RE-INSERT"
Pause 
M+X->M
Goto PS
Lbl C1
If B=7 and E=7 and H=7
Goto BW
If B=1 and E=1 and H=1
Goto TB
If B=E and B=H
Goto PO
Output(4,11,"NOT A"
Output(5,12,"WIN"
Pause 
Goto PA
Lbl C2
If B=7 and E=7 and H=7
Goto BW
If A=7 and D=7 and G=7
Goto BW
If C=7 and F=7 and I=7
Goto BW
If B=1 and E=1 and H=1
Goto TB
If A=1 and D=1 and G=1
Goto TB
If C=1 and F=1 and I=1
Goto TB
If B=E and B=H
Goto PO
If A=D and A=G
Goto PO
If C=F and C=I
Goto PO
Output(4,11,"NOT A"
Output(5,12,"WIN"
Pause 
Goto PA
Lbl C3
If B=7 and E=7 and H=7
Goto BW
If A=7 and D=7 and G=7
Goto BW
If C=7 and F=7 and I=7
Goto BW
If A=7 and E=7 and I=7
Goto BW
If C=7 and E=7 and G=7
Goto BW
If B=1 and E=1 and H=1
Goto TB
If A=1 and D=1 and G=1
Goto TB
If C=1 and F=1 and I=1
Goto TB
If A=1 and E=1 and I=1
Goto TB
If C=1 and E=1 and G=1
Goto TB
If A=D and A=G
Goto PO
If B=E and B=H
Goto PO
If C=F and C=I
Goto PO
If A=I and A=E
Goto PO
If C=E and C=G
Goto PO
Output(4,11,"NOT A"
Output(5,12,"WIN"
Pause 
Goto PA
End
Lbl PO
M+50->M
Output(4,12,"YOU"
Output(5,12,"WIN!"
Pause 
If M>Q
Goto HS
Goto PA
Lbl PA
Goto 1
Menu("PLAY AGAIN?","YES",1,"LEAVE SLOTS",99)
Lbl BW
M+J->M
300->J
Output(4,11,"!BIG!"
Output(5,11,"!WIN!"
Pause 
Lbl HS
If M>Q
Then
\tM->Q
\tClrHome
\tOutput(4,3,"!HIGH SCORE!"
\tPause 
End
Goto PA
Lbl NE
ClrHome
Disp "YOU DONT HAVE"
Disp "ENOUGH COINS"
Pause 
Goto 1
Lbl 99
ClrHome
Output(4,4,"FINAL"
Output(5,4,"SCORE:"
Output(5,11,M)
Pause 
If M>Q
M->Q
Lbl WC
\tClrHome
\tOutput(1,1,"-WINNING COMBOS-"
\tOutput(3,2,"777"
\tOutput(3,8,J
\tOutput(5,2,"==="
\tOutput(5,8,"150"
\tOutput(7,2,"ANY3"
\tOutput(7,8,"50"
\tPause 
\tGoto 1
End
Lbl TB
M+150->M
Output(5,11,"!WIN!"
Pause 
If M>Q
Goto HS
Goto PA
Lbl GC
prgmCASINO
`

export default PROGRAM