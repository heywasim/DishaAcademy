document.getElementById('searchForm').addEventListener('submit', function (e) {
    e.preventDefault();
    fetchData();
});

function fetchData() {
    const className = document.getElementById('class').value.trim().toLowerCase();
    const rollNumber = document.getElementById('roll').value.trim().toLowerCase();
    const studentName = document.getElementById('studentName').value.trim().toLowerCase();
    const resultTable = document.getElementById('resultTable');
    const loadingDiv = document.getElementById('loading');

    resultTable.innerHTML = "";

    if (!className || !rollNumber || !studentName) {
        const row = resultTable.insertRow();
        row.insertCell(0).colSpan = 2;
        row.cells[0].innerText = "Please enter correct student details.";
        return;
    }

    loadingDiv.style.display = 'block';

    const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQZx8wdmml7j7N1gISQaUExmVMAMmTHzwB3gob457MDim0KUApatv4AeSvycOHwyBNCWkvo56PP6dbu/pub?output=csv";

    fetch(sheetUrl)
        .then(response => response.text())
        .then(csv => {
            const data = CSVToArray(csv);
            const headers = data[0].map(h => h.trim().toLowerCase());

            // 🔑 find exact column indexes for your sheet
            const rollIndex = headers.indexOf("roll number");
            const classIndex = headers.indexOf("class");
            const nameIndex = headers.indexOf("student name");

            if (classIndex === -1 || rollIndex === -1 || nameIndex === -1) {
                resultTable.innerHTML = "<tr><td colspan='2'>Error: Could not detect Class / Roll / Student Name columns in sheet.</td></tr>";
                loadingDiv.style.display = 'none';
                return;
            }

            let found = false;

            for (let i = 1; i < data.length; i++) {
                const row = data[i];
                const rowClass = (row[classIndex] || "").trim().toLowerCase();
                const rowRoll = (row[rollIndex] || "").trim().toLowerCase();
                const rowName = (row[nameIndex] || "").trim().toLowerCase();

                if (rowClass === className && rowRoll === rollNumber && rowName === studentName) {
                    found = true;
                    for (let j = 0; j < headers.length; j++) {
                        const newRow = resultTable.insertRow();
                        newRow.insertCell(0).innerText = data[0][j]; // header
                        newRow.insertCell(1).innerText = row[j];     // value
                    }
                    break;
                }
            }

            if (!found) {
                const noResultRow = resultTable.insertRow();
                noResultRow.insertCell(0).colSpan = 2;
                noResultRow.cells[0].innerText = "No result found - Please check details.";
            }

            loadingDiv.style.display = 'none';
        })
        .catch(err => {
            loadingDiv.innerText = "Error fetching data. Please try again later.";
            console.error(err);
        });
}

// CSV parser
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
