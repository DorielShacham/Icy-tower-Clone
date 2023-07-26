function loadGames() {
    try {
        var games_1 = [];
        // get the games from local storage
        var gamesString = localStorage.getItem('games');
        // Handle the case where there are no games in localStorage
        if (!gamesString) {
            console.error("No games found in localStorage.");
            return [];
        }
        var gamesJson = JSON.parse(gamesString);
        gamesJson.forEach(function (gameJson) {
            var game = new Game(gameJson.userName, gameJson.score, new Date(gameJson.date));
            games_1.push(game);
        });
        return games_1;
    }
    catch (error) {
        console.error("Error loading games:", error);
        return [];
    }
}
// render the games
function renderGames(games) {
    try {
        var gamesTable_1 = document.getElementById('games-table');
        if (!gamesTable_1) {
            console.error("No games table found.");
            return;
        }
        gamesTable_1.innerHTML = '';
        // Create the table header
        var tableHeader = document.createElement('tr');
        tableHeader.innerHTML = '<th>Player Name</th><th>Score</th><th>Date</th>';
        gamesTable_1.appendChild(tableHeader);
        // Populate the table with game data
        games.forEach(function (game) {
            var gameRow = document.createElement('tr');
            gameRow.innerHTML = "<td>" + game.playerName + "</td><td>" + game.score + "</td><td>" + game.date + "</td>";
            gamesTable_1.appendChild(gameRow);
        });
    }
    catch (error) {
        console.error("Error rendering games:", error);
    }
}
function backHome() {
    window.location.href = "index.html";
}
var ScorPagegames = loadGames();
console.log(ScorPagegames);
renderGames(ScorPagegames);
