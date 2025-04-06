document.getElementById('searchForm').addEventListener('submit', function (e) {
    e.preventDefault();
    fetchData();
});

function fetchData() {
    const className = document.getElementById('class').value;
    const rollNumber = document.getElementById('roll').value;
    const resultTable = document.getElementById('resultTable');
    const loadingDiv = document.getElementById('loading');

    resultTable.innerHTML = "";
    loadingDiv.style.display = 'block';

    const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSfptSg0SNcIpNqjIVjLdOiHOwbzAYYTHScxI1El4zSLvfK-eP1lpnPME3TUQ6BDpGGrySIyY-ISecC/pub?output=csv';

    fetch(sheetUrl)
        .then(response => response.text())
        .then(csv => {
            const data = CSVToArray(csv);
            const headers = data[0];
            let found = false;

            for (let i = 1; i < data.length; i++) {
                const row = data[i];
                if (row[1] === className && row[2] === rollNumber) {
                    found = true;
                    for (let j = 0; j < headers.length; j++) {
                        const newRow = resultTable.insertRow();
                        newRow.insertCell(0).innerText = headers[j];
                        newRow.insertCell(1).innerText = row[j];
                    }
                    break;
                }
            }

            if (!found) {
                const noResultRow = resultTable.insertRow();
                noResultRow.insertCell(0).colSpan = 2;
                noResultRow.cells[0].innerText = "No result found for given Class and Roll Number.";
            }

            loadingDiv.style.display = 'none';
        })
        .catch(err => {
            loadingDiv.innerText = "Error fetching data. Please try again later.";
            console.error(err);
        });
}

// CSV to Array parser
function CSVToArray(strData, strDelimiter = ",") {
    const objPattern = new RegExp((
        "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
        "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
        "([^\"\\" + strDelimiter + "\\r\\n]*))"
    ), "gi");

    let arrData = [[]];
    let arrMatches = null;

    while (arrMatches = objPattern.exec(strData)) {
        let strMatchedDelimiter = arrMatches[1];
        if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
            arrData.push([]);
        }

        let strMatchedValue = arrMatches[2]
            ? arrMatches[2].replace(/""/g, "\"")
            : arrMatches[3];

        arrData[arrData.length - 1].push(strMatchedValue);
    }

    return arrData;
}
