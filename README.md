# TI-Basic Emulator

A simple TI-Basic parser and interpreter that is capable of running some programs from my old TI-83+ calculator.

Note: Only a subset of the language is implemented, specifically the subset required to run these old programs. Your mileage may vary if you try running other programs.

<img src="https://user-images.githubusercontent.com/160978/212590865-1f1f4bfc-41ec-4645-b00b-69a827817f30.jpg" width="50%">

## Programs

### Slots

A simple slot machine simulation, roughly based on the slot machine mini-games from early [Pokemon games](https://bulbapedia.bulbagarden.net/wiki/Slot_machine#Generation_I_and_FireRed_and_LeafGreen). The odds here are totally random so you're just as likely to hit the jackpot as any other winning combo.

### Blackjack

This was the first real computer program I ever wrote! Loosely follows real world blackjack rules with some slight additions...

- Whenever an ace is rolled you must immediately decide to score it as 1 or 11.
- If you get five cards without busting, that's a Five Card Charlie, which doubles your winnings!

Importantly, this program doesn't use an actual deck of cards (I definitely didn't know about stacks when I wrote this) so card values are selected randomly each time someone hits. As a result, it's entirely possible to get 5 of the same card in a single game, and counting cards is impossible.

### Demo

Simple demo that echos key presses back to the user.

## How to run

```
npm run start
```

## Credits

Loosely based on...
- https://github.com/JacobMisirian/TiBASIC
- https://github.com/davidtorosyan/ti-js
