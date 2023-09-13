function loadGames(): Game[] {
    try {
        const games: Game[] = [];
        // get the games from local storage
        const gamesString = localStorage.getItem('games');

        // Handle the case where there are no games in localStorage
        if (!gamesString) {
            console.error("No games found in localStorage.");
            return [];
        }
        const gamesJson = JSON.parse(gamesString);
        gamesJson.forEach((gameJson: any) => {
            const game = new Game(gameJson.playerName, gameJson.score, new Date(gameJson.date));
            games.push(game);
        });
     
        return games;
    } catch (error) {
        console.error("Error loading games:", error);
        return [];
    }
}
// render the games
function renderGames(games) {
    try {
        const gamesTable = document.getElementById('games-table');
        if (!gamesTable) {
            console.error("No games table found.");
            return;
        }
        gamesTable.innerHTML = '';

        // Create the table header
        const tableHeader = document.createElement('tr');
        tableHeader.innerHTML = '<th>Player Name</th><th>Score</th><th>Date</th>';
        gamesTable.appendChild(tableHeader);

        // Populate the table with game data
        games.reverse().forEach((game) => {
            const shortDate = game.date.toLocaleDateString(undefined, {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
            const gameRow = document.createElement('tr');
            gameRow.innerHTML = `<td>${game.playerName}</td>
            <td>${game.score}</td><td>${shortDate}</td>`;
            gamesTable.appendChild(gameRow);
        });

    } catch (error) {
        console.error("Error rendering games:", error);
    }

}
function backHome() {
    window.location.href = "/index.html";
}   
const ScorPagegames: Game[] = loadGames();
console.log(ScorPagegames);

renderGames(ScorPagegames)
