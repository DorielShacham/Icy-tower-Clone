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
            var game = new Game(gameJson.playerName, gameJson.score, new Date(gameJson.date));
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
        games.reverse().forEach(function (game) {
            var shortDate = game.date.toLocaleDateString(undefined, {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
            var gameRow = document.createElement('tr');
            gameRow.innerHTML = "<td>" + game.playerName + "</td>\n            <td>" + game.score + "</td><td>" + shortDate + "</td>";
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
