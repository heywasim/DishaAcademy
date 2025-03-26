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
            headerRow.insertCell(0).innerText = "Student Name";
            headerRow.insertCell(1).innerText = "Class";
            headerRow.insertCell(2).innerText = "Roll Number";
            headerRow.insertCell(3).innerText = "Math";
            headerRow.insertCell(4).innerText = "Science";
            headerRow.insertCell(5).innerText = "English";
            headerRow.insertCell(6).innerText = "History";
            headerRow.insertCell(7).innerText = "Geography";

            // Flag to track if any result is found
            let found = false;

            // Loop through data and display results based on class and roll number
            for (var i = 1; i < data.length; i++) {
                var row = data[i];
                if (row[1] == className && row[2] == rollNumber) {
                    found = true; // Mark as found
                    var newRow = resultTable.insertRow();
                    newRow.insertCell(0).innerText = row[0]; // Student Name
                    newRow.insertCell(1).innerText = row[1]; // Class
                    newRow.insertCell(2).innerText = row[2]; // Roll Number
                    newRow.insertCell(3).innerText = row[3]; // Math
                    newRow.insertCell(4).innerText = row[4]; // Science
                    newRow.insertCell(5).innerText = row[5]; // English
                    newRow.insertCell(6).innerText = row[6]; // History
                    newRow.insertCell(7).innerText = row[7]; // Geography
                }
            }

            // If no results were found, display a message
            if (!found) {
                var noResultRow = resultTable.insertRow();
                noResultRow.insertCell(0).colSpan = 8; // Make this row span all columns
                noResultRow.cells[0].innerText = "No results found for the given class and roll number.";
            }
        })
        .catch(error => {
            console.error("Error fetching data", error);
        });
}
