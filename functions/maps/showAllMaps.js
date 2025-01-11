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

export default showAllMaps;
