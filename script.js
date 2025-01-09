const lbButton = document.getElementById("leader-btn");
const createPlayerButton = document.getElementById("create-player-btn");
const createMapButton = document.getElementById("create-map-btn");
const playerFormContainer = document.getElementById("playerFormContainer");
const playerForm = document.getElementById("playerForm");
const cancelFormButton = document.getElementById("cancelForm");
const showMapsButton = document.getElementById("map-btn");
let database = "players";
lbButton.textContent = "Show Leaderboard";

window.addEventListener("load", (event) => {
  showAllPlayers();
});

lbButton.addEventListener("click", showLeaderBoard);
showMapsButton.addEventListener("click", showAllMaps);

// GET REQUEST
// Get the leaderboard
async function showLeaderBoard() {
  database = database === "players" ? "leaderboard" : "players";
  if (database === "players") {
    lbButton.textContent = "Show Leaderboard";
  } else {
    lbButton.textContent = "Show all players";
  }
  showAllPlayers();
}

// GET REQUEST
// get all the players
async function showAllPlayers() {
  try {
    // Fetch data from the API
    const response = await fetch(`http://localhost:3000/${database}`);
    const json = await response.json();
    const players = json.data;

    const tableContainer = document.getElementsByClassName("list")[0];
    tableContainer.innerHTML = "";

    const table = document.createElement("table");
    table.className = "player-table";

    let headers = [];
    let displayColumns = [];

    if (database === "players") {
      headers = [
        "Player Name",
        "K/D/A",
        "Favourite Weapon",
        "Best Map",
        "Average Winrate",
        "Actions",
      ];
      displayColumns = [
        (player) => player.player_name,
        (player) => player.kda,
        (player) => player.favourite_weapon,
        (player) => player.best_map,
        (player) => `${player.average_winrate}%`,
      ];
    } else if (database === "leaderboard") {
      headers = ["Player Name", "Average Winrate"];
      displayColumns = [
        (player) => player.player_name,
        (player) => `${player.average_winrate}%`,
      ];
    }

    // Create the table header
    const headerRow = document.createElement("tr");
    headers.forEach((header) => {
      const th = document.createElement("th");
      th.textContent = header;
      headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Populate the table with player data
    players.forEach((player) => {
      const row = document.createElement("tr");

      displayColumns.forEach((columnFunction, index) => {
        const cell = document.createElement("td");
        const columnData = columnFunction(player);

        if (columnData === "actions" && database === "players") {
          // Add Edit and Delete buttons only in "players" state
          const editButton = document.createElement("button");
          editButton.textContent = "Edit";
          editButton.onclick = () => editPlayer(player.id);

          const deleteButton = document.createElement("button");
          deleteButton.textContent = "Delete";
          deleteButton.onclick = () => deletePlayer(player.id);

          cell.appendChild(editButton);
          cell.appendChild(deleteButton);
        } else {
          cell.textContent = columnData;
        }

        row.appendChild(cell);
      });

      table.appendChild(row);
    });

    // Append the table to the container
    tableContainer.appendChild(table);
  } catch (error) {
    console.error("Error fetching players:", error);
  }
}

// GET All maps
async function showAllMaps() {
  try {
    // Fetch data from the API
    const response = await fetch("http://localhost:3000/maps");
    const json = await response.json();
    const maps = json.data;

    // Get the container to display the table
    const tableContainer = document.getElementsByClassName("list")[0];
    tableContainer.innerHTML = ""; // Clear any existing content

    // Create the table element
    const table = document.createElement("table");
    table.className = "map-table";

    // Create the table header
    const headerRow = document.createElement("tr");
    const header = document.createElement("th");
    header.textContent = "Map Name";
    headerRow.appendChild(header);
    table.appendChild(headerRow);

    // Populate the table with map data
    maps.forEach((map) => {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.textContent = map.map_name; // Replace with the correct key for the map name
      row.appendChild(cell);
      table.appendChild(row);
    });

    // Append the table to the container
    tableContainer.appendChild(table);
  } catch (error) {
    console.error("Error fetching maps:", error);
  }
}

// POST REQUEST

createPlayerButton.addEventListener("click", () => {
  if (mapFormContainer.style.display != "none") {
    mapFormContainer.style.display = "none";
  }
  playerFormContainer.style.display =
    playerFormContainer.style.display === "none" ? "block" : "none";
});

// Hide the form on cancel
cancelFormButton.addEventListener("click", () => {
  playerFormContainer.style.display = "none";
});

// Handle form submission
playerForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent default form submission behavior

  // Capture form data
  const formData = {
    player_name: document.getElementById("player_name").value,
    kda: document.getElementById("kda").value,
    favourite_weapon: document.getElementById("favourite_weapon").value,
    best_map: document.getElementById("best_map").value,
    average_winrate: document.getElementById("average_winrate").value,
  };

  try {
    // Send POST request to the backend
    const response = await fetch("http://localhost:3000/players", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("Player created successfully!");
      playerForm.reset();
      playerFormContainer.style.display = "none";
      showAllPlayers();
    } else {
      throw new Error("Failed to create player");
    }
  } catch (error) {
    console.error("Error creating player:", error);
    alert("Error creating player. Please try again.");
  }
});

// Create Map
createMapButton.addEventListener("click", () => {
  if (playerFormContainer.style.display != "none") {
    playerFormContainer.style.display = "none";
  }
  mapFormContainer.style.display =
    mapFormContainer.style.display === "none" ? "block" : "none";
});

// Hide the form on cancel
cancelFormButton.addEventListener("click", () => {
  playerFormContainer.style.display = "none";
});

// Handle form submission
playerForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent default form submission behavior

  // Capture form data
  const formData = {
    map_name: document.getElementById("map_name").value,
  };

  try {
    // Send POST request to the backend
    const response = await fetch("http://localhost:3000/maps", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("Player created successfully!");
      playerForm.reset();
      playerFormContainer.style.display = "none";
      showAllPlayers();
    } else {
      throw new Error("Failed to create map");
    }
  } catch (error) {
    console.error("Error creating player:", error);
    alert("Error creating player. Please try again.");
  }
});
// End

async function createNewPlayer() {
  // calls the api
  // Opens a prompt to input player details
  // takes details and posts to API
}

// POST REQUEST
async function createNewMap() {
  // calls the api
  // Opens a prompt to input map details
  // takes details and posts to API
}

// PATCH REQUEST

async function editPlayer() {
  // calls the api
  // Opens a prompt to input update to player details
  // takes details and posts to API
}

// PATCH REQUEST

async function editPlayer() {
  // calls the api
  // Opens a prompt to input update to map details
  // takes details and posts to API
}

// DELETE REQUEST

async function deletePlayer() {
  // gets the id of the specific user and passes to the API call at id
}

// DELETE REQUEST

async function deleteMap() {
  // gets the id of the specific map and passes to the API call at id
}
