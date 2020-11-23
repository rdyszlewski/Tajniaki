# Tajniaki

Tajniaki it’s a digital version of a board game named "Codenames". 
## Rules of game

Two teams take part in the game, blue and red. In each team must be at least two people. One person from each team plays the role of spymaster,   the rest are ordinary players.
On the board are placed 25 randomly selected words. The task of the team will have to guess all their words before the opposing team does it. Spymasters of the team know, whose words belong to which team, but ordinary players don’t know it. The spymaster’s job is to give the words, which may connote witch specific number of words located on the board. Spymaster give also this number. The ordinary player’s job is to guess words that belong to their team. Players in one turn can guess at most as many words as the number given by the spymaster. Players guess one word at a time. If players revealed the word correctly and guess fewer words than the spymaster gave, they can guess further, but they don’t have to.  In case of the wrong answer, the team ends its turn, and the opposing team’s turn begins. On the board located on the killer’s card. If any of the teams will reveal this card, they lose and the winner becomes the opposing team. On the board are located words of blue teams, red teams, one killer card, and neutral cards.

## Gameplay

### Main menu

After pressing the Game button, the player is taken to the lobby. In this view, you can change nick, which will be visible in the later stages of the game.

### Lobby

The players choose which team they want to be. After choosing should press "Ready" button. If all players press "Ready" buttons,  the countdown to the end of the team’s choosing will begin.

### Voting

On this screen, players vote for the player to become the spymaster of their team. The player with the most votes becomes the spymaster. In case of a tie, the spymaster is chosen randomly.

### Game
#### Ordinary player
- right mouse button – select a card. Selecting is visible only in ordinary players in the team.
- left mouse button – answer. The asnwer will be accept, if all players answer the same card

#### Spymaster
- entering the word. The word can’t be empty. A number must be entered.

## Requirements

nodejs

Installing

```bash
sudo apt install nodejs
```

npm
```bash
sudo apt install npm
```

## Usage

Initialization of project
```bash
npm init
```

Install electron for project
```bash
npm install –save-dev electron
```

Runing electron application
```bash
npm start
```

Running in browser
```bash
ng serve
```

## Server
You need a running server to play:
https://github.com/Parabbits/TajniakiServer2
