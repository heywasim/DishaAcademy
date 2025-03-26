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

            // Loop through data and display results based on class and roll number
            let found = false;

            for (var i = 1; i < data.length; i++) {
                var row = data[i];
                if (row[1] == className && row[2] == rollNumber) {
                    found = true; // Mark as found
                    var newRow = resultTable.insertRow();

                    var nameCell = newRow.insertCell(0);
                    nameCell.innerHTML = "Student Name: " + row[0];

                    var classCell = newRow.insertCell(1);
                    classCell.innerHTML = "Class: " + row[1];

                    var rollCell = newRow.insertCell(2);
                    rollCell.innerHTML = "Roll Number: " + row[2];

                    var mathCell = newRow.insertCell(3);
                    mathCell.innerHTML = "Math: " + row[3];

                    var scienceCell = newRow.insertCell(4);
                    scienceCell.innerHTML = "Science: " + row[4];

                    var englishCell = newRow.insertCell(5);
                    englishCell.innerHTML = "English: " + row[5];

                    var historyCell = newRow.insertCell(6);
                    historyCell.innerHTML = "History: " + row[6];

                    var geographyCell = newRow.insertCell(7);
                    geographyCell.innerHTML = "Geography: " + row[7];
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
