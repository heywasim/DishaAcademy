// Function to fetch data from Google Sheet
function fetchData() {
    var className = document.getElementById('class').value;
    var rollNumber = document.getElementById('roll').value;

    var sheetUrl = 'https://docs.google.com/spreadsheets/d/2PACX-1vSfptSg0SNcIpNqjIVjLdOiHOwbzAYYTHScxI1El4zSLvfK-eP1lpnPME3TUQ6BDpGGrySIyY-ISecC/export?format=csv'; // Your sheet URL

    fetch(sheetUrl)
        .then(response => response.text())
        .then(csvData => {
            var data = CSVToArray(csvData);
            var resultTable = document.getElementById('resultTable');
            resultTable.innerHTML = ""; // Clear any previous results

            // Add table headers
            var headerRow = resultTable.insertRow();
            headerRow.insertCell(0).innerText = "Field";
            headerRow.insertCell(1).innerText = "Value";

            // Flag to track if any result is found
            let found = false;

            // Loop through data and display results based on class and roll number
            for (var i = 1; i < data.length; i++) {
                var row = data[i];
                if (row[1] == className && row[2] == rollNumber) {
                    found = true; // Mark as found
                    var newRow;

                    // Vertically display data
                    newRow = resultTable.insertRow();
                    newRow.insertCell(0).innerText = "Student Name";
                    newRow.insertCell(1).innerText = row[0]; // Student Name

                    newRow = resultTable.insertRow();
                    newRow.insertCell(0).innerText = "Class";
                    newRow.insertCell(1).innerText = row[1]; // Class

                    newRow = resultTable.insertRow();
                    newRow.insertCell(0).innerText = "Roll Number";
                    newRow.insertCell(1).innerText = row[2]; // Roll Number

                    newRow = resultTable.insertRow();
                    newRow.insertCell(0).innerText = "Math";
                    newRow.insertCell(1).innerText = row[3]; // Math

                    newRow = resultTable.insertRow();
                    newRow.insertCell(0).innerText = "Science";
                    newRow.insertCell(1).innerText = row[4]; // Science

                    newRow = resultTable.insertRow();
                    newRow.insertCell(0).innerText = "English";
                    newRow.insertCell(1).innerText = row[5]; // English

                    newRow = resultTable.insertRow();
                    newRow.insertCell(0).innerText = "History";
                    newRow.insertCell(1).innerText = row[6]; // History

                    newRow = resultTable.insertRow();
                    newRow.insertCell(0).innerText = "Geography";
                    newRow.insertCell(1).innerText = row[7]; // Geography
                }
            }

            // If no results were found, display a message
            if (!found) {
                var noResultRow = resultTable.insertRow();
                noResultRow.insertCell(0).colSpan = 2; // Make this row span both columns
                noResultRow.cells[0].innerText = "No results found for the given class and roll number.";
            }
        })
        .catch(error => {
            console.error("Error fetching data", error);
        });
}

// Convert CSV data to array
function CSVToArray(csv) {
    var rows = csv.split("\n");
    var result = [];
    for (var i = 0; i < rows.length; i++) {
        result.push(rows[i].split(","));
    }
    return result;
}

// Event listener for form submission
document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from refreshing the page
    fetchData(); // Fetch and display the data
});
