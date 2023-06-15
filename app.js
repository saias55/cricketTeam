const express = require("express");
const app = express();

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");
const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;
app.use(express.json());

let initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server running at http:localhost:3000/players/");
    });
  } catch (error) {
    console.log(`Db Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
 SELECT
 *
 FROM
 cricket_team;`;
  const playersArray = await db.all(getPlayersQuery);
  response.send(playersArray);
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  //console.log(playerId);
  const getSinglePlayer = `
    SELECT * 
    FROM cricket_team
    WHERE player_id = ${playerId};`;
  const player = await db.get(getSinglePlayer);
  response.send(player);
});

app.post("/players/", async (request, response) => {
  const playerDetailed = request.body;
  const { playerName, jerseyNumber, role } = playerDetailed;

  const addPlayerQuery = `
    INSERT INTO 
        cricket_team(player_name, jersey_number, role)
    VALUES
        (
            '${playerName}',
            '${jerseyNumber}',
            '${role}'
        );`;
  const dbResponse = await db.run(addPlayerQuery);
  response.send("Player Added to Team");
});

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetailed = request.body;
  const { playerName, jerseyNumber, role } = playerDetailed;
  const updatePlayerDetails = `
        UPDATE cricket_team
        SET
            player_name = "${playerName}",
            jersey_number = "${jerseyNumber}",
            role = "${role}"
        WHERE player_id = ${playerId};`;
  await db.run(updatePlayerDetails);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
        DELETE FROM cricket_team
        WHERE player_id = ${playerId}`;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});

module.exports = app;
