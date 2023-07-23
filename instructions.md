# Game Details - icytower clone

# Pages
Homepage === loge-in -shiran
GamePage
ScorePage === finish

# model
- hendelsubmit -> get the data from users and save it in local storage and move to the game
- hendelfinish -> save all data to local storige and move to scoreboard 

# controlers
- update score
- fall down (end game) - @added completed
- hit obstical (loss/collect point)
- move (up, left, right) - @fixed and completed
- movment of the background -> as the figur move up in the screen the backgrund move down
- data-from-storage -> function that get the data we put in local storage to the page we load
- on-load -> will help us start the loading page only with what we need


# view
- loge-in page -> the user enter his username and/or choose a figure
- rendergame -> take data from storage and render the game on screen
- renderscoreboard -> take data from storgae and render a score table


# css
- figurs -> 2/3 options(?)
- backgraund invarunment -> incloding obsticals -> shalves, coins & bombs