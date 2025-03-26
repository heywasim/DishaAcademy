// Function to fetch data from Google Sheet
function fetchData() {
    var className = document.getElementById('class').value;
    var rollNumber = document.getElementById('roll').value;

    var sheetUrl = 'https://docs.google.com/spreadsheets/d/1vllKIHCAQn5cWdbOmQK3__v9oPfYcV-pgW9RYETuvxo/export?format=csv'; // Your sheet URL

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

            // Loop through data and display results based on class and roll number
            for (var i = 1; i < data.length; i++) {
                var row = data[i];
                if (row[1] == className && row[2] == rollNumber) {
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
