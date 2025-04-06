function fetchData() {
    var className = document.getElementById('class').value;
    var rollNumber = document.getElementById('roll').value;

    var sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSfptSg0SNcIpNqjIVjLdOiHOwbzAYYTHScxI1El4zSLvfK-eP1lpnPME3TUQ6BDpGGrySIyY-ISecC/pub?output=csv';

    fetch(sheetUrl)
        .then(response => response.text())
        .then(csvData => {
            var data = CSVToArray(csvData);
            var resultTable = document.getElementById('resultTable');
            resultTable.innerHTML = ""; // Clear any previous results

            let found = false;

            for (var i = 1; i < data.length; i++) {
                var row = data[i];
                if (row[1] == className && row[2] == rollNumber) {
                    found = true;

                    const headers = data[0];
                    for (let j = 0; j < headers.length; j++) {
                        const newRow = resultTable.insertRow();
                        newRow.insertCell(0).innerText = headers[j];
                        newRow.insertCell(1).innerText = row[j];
                    }
                    break;
                }
            }

            if (!found) {
                var noResultRow = resultTable.insertRow();
                noResultRow.insertCell(0).colSpan = 2;
                noResultRow.cells[0].innerText = "No results found for the given class and roll number.";
            }
        })
        .catch(error => {
            console.error("Error fetching data", error);
        });
}

function CSVToArray(csv) {
    var rows = csv.trim().split("\n");
    return rows.map(row => row.split(","));
}

document.getElementById('searchForm').addEventListener('submit', function (event) {
    event.preventDefault();
    fetchData();
});
