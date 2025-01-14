const lbButton = document.getElementById("leader-btn");
const createPlayerButton = document.getElementById("create-player-btn");
const createMapButton = document.getElementById("create-map-btn");
const playerFormContainer = document.getElementById("playerFormContainer");
const playerForm = document.getElementById("playerForm");
const mapForm = document.getElementById("mapForm");
const cancelFormButton = document.getElementById("cancelForm");
const showMapsButton = document.getElementById("map-btn");
const editPlayerButton = document.getElementById("edit-btn");
const playerNameValue = document.getElementById("player_name");
const playerKDAValue = document.getElementById("kda");
const playerFavouriteWeaponValue = document.getElementById("favourite_weapon");
const playerAverageWinRateValue = document.getElementById("average_winrate");
const playerBestMapValue = document.getElementById("best_map");
const submitButton = document.getElementById("submit-btn");
const updateButton = document.getElementById("update");
const removeButton = document.getElementById("delete");
const mapSubmitButton = document.getElementById("map-submit");
const playButton = document.getElementById("play-btn");
const modal = document.getElementById("modal");
const closeButton = document.getElementsByClassName("close-button")[0];
const modalText = document.getElementById("modal-text");
const modalTitle = document.getElementById("modal-title");
const url = "https://radiant-sierra-63820-be1933a6f975.herokuapp.com/";

let database = "players";
let showDelete = "none";
let showUpdate = "none";
let playersData = [];
let winner = [];
let mapData = [];
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
    playButton.style.display = "";
    lbButton.textContent = "Show Leaderboard";
  } else {
    playButton.style.display = "none";
    lbButton.textContent = "Show all players";
  }
  showAllPlayers();
}

// GET REQUEST
// get all the players
async function showAllPlayers() {
  try {
    // Fetch data from the API
    const response = await fetch(`${url}${database}`);

    const json = await response.json();
    const players = json.data;
    playersData = players;

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
        // "Actions",
      ];
      displayColumns = [
        (player) => player.player_name,
        (player) => player.kda,
        (player) => player.favourite_weapon,
        (player) => player.best_map,
        (player) => `${player.average_winrate}%`,
        // () => "actions",
      ];
      populateSearchHeadings(headers.slice(0, -1));
    } else if (database === "leaderboard") {
      headers = ["Player Name", "Average Winrate"];
      displayColumns = [
        (player) => player.player_name,
        (player) => `${player.average_winrate}%`,
      ];
    }
    const headerRow = document.createElement("tr");
    headers.forEach((header) => {
      const th = document.createElement("th");
      th.textContent = header;
      headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    players.forEach((player) => {
      const row = document.createElement("tr");

      displayColumns.forEach((columnFunction, index) => {
        const cell = document.createElement("td");
        const columnData = columnFunction(player);

        if (columnData === "actions" && database === "players") {
          // Add Edit and Delete buttons only in "players" state
          const editButton = document.createElement("button");
          const editIcon = document.createElement("i");
          editIcon.className = "fa fa-pencil";
          editButton.appendChild(editIcon);

          editButton.setAttribute("id", "edit-btn");
          editButton.addEventListener("click", () => {
            if (mapFormContainer.style.display != "none") {
              mapFormContainer.style.display = "none";
            }
            submitButton.style.display = "none";
            removeButton.style.display = "none";
            showUpdate = "block";
            updateButton.style.display = showUpdate;
            playerNameValue.value = player.player_name;
            playerKDAValue.value = player.kda;
            playerFavouriteWeaponValue.value = player.favourite_weapon;
            playerBestMapValue.value = player.best_map;
            playerAverageWinRateValue.value = player.average_winrate;

            window.scrollTo({ top: 0, behavior: "smooth" });

            updateButton.setAttribute("data-player-id", player.id);

            playerFormContainer.style.display =
              playerFormContainer.style.display === "none" ? "block" : "none";
          });

          const deleteButton = document.createElement("button");
          const deleteIcon = document.createElement("i");
          deleteIcon.className = "fa fa-trash";
          deleteButton.appendChild(deleteIcon);

          deleteButton.setAttribute("id", "delete-btn");
          deleteButton.onclick = () => {
            if (mapFormContainer.style.display != "none") {
              mapFormContainer.style.display = "none";
            }
            submitButton.style.display = "none";
            updateButton.style.display = "none";
            showDelete = "block";
            removeButton.style.display = showDelete;
            playerNameValue.value = player.player_name;

            playerFavouriteWeaponValue.value = player.favourite_weapon;
            playerBestMapValue.value = player.best_map;

            window.scrollTo({ top: 0, behavior: "smooth" });

            removeButton.setAttribute("data-player-id", player.id);

            playerFormContainer.style.display =
              playerFormContainer.style.display === "none" ? "block" : "none";
          };

          cell.appendChild(editButton);
          cell.appendChild(deleteButton);
        } else {
          cell.textContent = columnData;
        }

        row.appendChild(cell);
      });

      table.appendChild(row);
      return player.id;
    });

    // Append the table to the container
    tableContainer.appendChild(table);
  } catch (error) {
    console.error("Error fetching players:", error);
  }
}

async function getAllMaps() {
  try {
    const response = await fetch(`${url}maps`);
    const json = await response.json();
    const maps = json.data;
    mapData = maps;
  } catch (error) {}
}

// GET All maps
async function showAllMaps() {
  try {
    // Fetch data from the API
    const response = await fetch(`${url}maps`);
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
  playerNameValue.value = "";
  playerBestMapValue.value = "";
  playerFavouriteWeaponValue.value = "";

  if (mapFormContainer.style.display != "none") {
    mapFormContainer.style.display = "none";
  }
  if (submitButton.style.display === "none") {
    removeButton.style.display = "none";
    updateButton.style.display = "none";
    submitButton.style.display = "block";
  }
  playerFormContainer.style.display =
    playerFormContainer.style.display === "none" ? "block" : "none";
});

cancelFormButton.addEventListener("click", () => {
  playerFormContainer.style.display = "none";
});

// Handle form submission

submitButton.addEventListener("click", async (event) => {
  event.preventDefault();

  // Capture form data
  const formData = {
    player_name: document.getElementById("player_name").value,

    favourite_weapon: document.getElementById("favourite_weapon").value,
    best_map: document.getElementById("best_map").value,
  };

  try {
    // Send POST request to the backend
    const response = await fetch(`${url}players`, {
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

cancelFormButton.addEventListener("click", () => {
  playerFormContainer.style.display = "none";
});

mapSubmitButton.addEventListener("click", async (event) => {
  event.preventDefault();
  const formData = {
    map_name: document.getElementById("map_name").value,
  };

  try {
    // Send POST request to the backend
    const response = await fetch(`${url}maps`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("Map created successfully!");
      mapForm.reset();
      mapFormContainer.style.display = "none";
      showAllMaps();
    } else {
      throw new Error("Failed to create map");
    }
  } catch (error) {
    console.error("Error creating map:", error);
    alert("Error creating player. Please try again.");
  }
});
// End

// PATCH REQUEST

updateButton.addEventListener("click", (event) => {
  event.preventDefault();
  const playerId = updateButton.getAttribute("data-player-id");

  if (playerId) {
    editPlayer(playerId);
  } else {
    console.error("No player ID found. Update operation aborted.");
  }
});

async function editPlayer(id) {
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
    const response = await fetch(`${url}players/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("Player updated successfully!");
      playerForm.reset();
      playerFormContainer.style.display = "none";
      showAllPlayers();
    } else {
      throw new Error("Failed to update player");
    }
  } catch (error) {
    console.error("Error updating player:", error);
    alert("Error updating player. Please try again.");
  }
}

// PATCH REQUEST

// DELETE REQUEST

removeButton.addEventListener("click", async (event) => {
  event.preventDefault();
  const playerId = removeButton.getAttribute("data-player-id");
  const playerName = playerNameValue.value;

  if (playerId) {
    await deletePlayer(playerId, playerName);
  } else {
    console.error("No player ID found. Delete operation aborted.");
  }
});

async function deletePlayer(id, playerName) {
  try {
    const isConfirmed = confirm(
      `Are you sure you want to delete "${playerName}"?`
    );
    if (!isConfirmed) {
      return;
    }
    // gets the id of the specific user and passes to the API call at id
    const response = await fetch(`${url}players/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      alert(`${playerName} has been successfully deleted!`);
      playerForm.reset();
      playerFormContainer.style.display = "none";
      showAllPlayers();
    } else {
      throw new Error("Failed to delete player");
    }
  } catch (error) {
    console.error("Error deleting player:", error);
    alert("Error deleting player. Please try again.");
  }
}

// DELETE REQUEST

async function deleteMap() {
  // gets the id of the specific map and passes to the API call at id
}

// Populate dropdown with headers
function populateSearchHeadings(headers) {
  const searchHeadingDropdown = document.getElementById("heading-dropdown");
  searchHeadingDropdown.innerHTML =
    '<option value="" disabled selected>Select a heading</option>';

  headers.forEach((header) => {
    const option = document.createElement("option");
    option.value = header.toLowerCase().replace(/ /g, "_"); // Convert to query format
    option.textContent = header;
    searchHeadingDropdown.appendChild(option);
  });
}

// Trigger search on button click
document.getElementById("search-button").addEventListener("click", async () => {
  const selectedHeading = document.getElementById("heading-dropdown").value;
  const searchValue = document.getElementById("searchbar").value;

  if (!selectedHeading || !searchValue) {
    alert("Please select a heading and enter a search value.");
    return;
  }

  try {
    // Encode the query parameter
    const queryParam = `${selectedHeading}=${encodeURIComponent(searchValue)}`;
    const response = await fetch(`${url}players?${queryParam}`);

    if (!response.ok) throw new Error("Failed to perform search");

    const json = await response.json();
    displaySearchResults(json.data);
  } catch (error) {
    console.error("Error performing search:", error);
    alert("Search failed. Please try again.");
  }
});

// Display search results
function displaySearchResults(results) {
  const tableContainer = document.getElementsByClassName("list")[0];
  tableContainer.innerHTML = "";

  const table = document.createElement("table");
  table.className = "player-table";

  const headers =
    database === "players"
      ? [
          "Player Name",
          "K/D/A",
          "Favourite Weapon",
          "Best Map",
          "Average Winrate",
        ]
      : ["Player Name", "Average Winrate"];

  // Add headers
  const headerRow = document.createElement("tr");
  headers.forEach((header) => {
    const th = document.createElement("th");
    th.textContent = header;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  // Add rows
  results.forEach((result) => {
    const row = document.createElement("tr");
    headers.forEach((header) => {
      const key = header.toLowerCase().replace(/ /g, "_");
      const cell = document.createElement("td");
      cell.textContent = result[key] || "";
      row.appendChild(cell);
    });
    table.appendChild(row);
  });

  tableContainer.appendChild(table);
}

function showModal() {
  modal.style.display = "block";
}

function hideModal() {
  modal.style.display = "none";
}

// When the user clicks on <span> (x), close the modal
closeButton.onclick = function () {
  hideModal();
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    hideModal();
  }
};

function createGame() {
  let gameLog = [];
  let remainingPlayers = [...playersData]; // Create a copy of playersData
  let previousKiller = null; // Variable to store the previous killer
  let winner = null;

  while (remainingPlayers.length > 1) {
    // Randomly select a killer and a victim
    const killerIndex = Math.floor(Math.random() * remainingPlayers.length);
    let victimIndex;
    do {
      victimIndex = Math.floor(Math.random() * remainingPlayers.length);
    } while (victimIndex === killerIndex);

    const killer = remainingPlayers[killerIndex];
    const victim = remainingPlayers[victimIndex];
    addPlayerLoss(victim.id);

    // Check if the previous killer is the same as the current killer
    if (previousKiller && previousKiller.player_name === killer.player_name) {
      gameLog.push(`${killer.player_name} is on a kill streak`);
    }

    // Log the kill
    gameLog.push(
      `${killer.player_name} killed ${victim.player_name} with ${killer.favourite_weapon}`
    );

    // Remove the victim from the remaining players
    remainingPlayers.splice(victimIndex, 1);

    // Update the previous killer
    previousKiller = killer;

    // Update the title with the remaining players count
  }

  // Log the winner
  if (remainingPlayers.length === 1) {
    winner = remainingPlayers[0];
    addPlayerWin(winner.id);
    gameLog.push(`${remainingPlayers[0].player_name} is the winner!`);
  }

  return { gameLog, winner };
}

function typeGameLog(gameLog) {
  let index = 0;

  function typeNextEntry() {
    if (index < gameLog.length) {
      const entry = document.createElement("div");
      entry.textContent = gameLog[index];
      modalText.appendChild(entry);

      index++;

      // Random delay between 1 to 3 seconds
      const delay = Math.random() * 2000 + 1000;
      setTimeout(typeNextEntry, delay);
    }
  }

  typeNextEntry();
}

playButton.addEventListener("click", async () => {
  await getAllMaps();
  const maps = mapData; // Replace with actual map data

  const randomMap = maps[Math.floor(Math.random() * maps.length)].map_name;

  // Set the modal title
  modalTitle.textContent = `Players: ${playersData.length}, Map: ${randomMap}`;
  modalText.innerHTML = ""; // Clear previous game log
  const { gameLog, winner } = createGame();
  console.log("Winner:", winner);
  showModal();
  typeGameLog(gameLog);
});

async function addPlayerLoss(id) {
  try {
    const response = await fetch(`${url}players/loss/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
    } else {
      throw new Error("Failed to add loss");
    }
  } catch (error) {
    console.error("Error adding loss:", error);
    alert("Error adding loss player. Please try again.");
  }
}

async function addPlayerWin(id) {
  try {
    const response = await fetch(`${url}players/win/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
    } else {
      throw new Error("Failed to add win");
    }
  } catch (error) {
    console.error("Error adding win:", error);
    alert("Error adding win player. Please try again.");
  }
}
