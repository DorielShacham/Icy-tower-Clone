Goal: 
# Game Details - icytower clone

# Pages
Homepage === loge-in --> shiran --> @completed
GamePage             --> doriel
ScorePage === finish --> tamar/shiran

# model
- hendelsubmit -> get the data from users and save it in local storage and move to the game
- hendelfinish -> save all data to local storige and move to scoreboard 

# controlers
- update score --> tamar / shiran
- fall down (end game) --> doriel --> @completed
- hit obstical (loss/collect point)  --> tamar --> finish
- move (up, left, right) --> doriel  --> @completed
- movment of the background -> as the figur move up in the screen the backgrund move down --> shiran
- data-from-storage -> function that get the data we put in local storage to the page we load --> shiran
- on-load -> will help us start the loading page only with what we need --> shiran
- movment of the floor --> doriel
- movment of the bomb & coin --> tamar --> finish


# view
- loge-in page -> the user enter his username and/or choose a figure --> shiran
- rendergame -> take data from storage and render the game on screen --> doriel & tamar
- renderscoreboard -> take data from storgae and render a score table --> tamar/shiran


# css
- figurs/player -> 1 options --> doriel/shiran
- backgraund invarunment --> shiran
- obsticals -> coins & bombs --> tamar
- obstical -> floor --> doriel/shran