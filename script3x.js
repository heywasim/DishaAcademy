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

    // 🔴 Clear old result, header, button
    resultTable.innerHTML = "";

    const oldHeader = document.getElementById("resultHeader");
    if (oldHeader) oldHeader.remove();

    const oldBtn = document.getElementById("downloadBtn");
    if (oldBtn) oldBtn.remove();

    if (!className || !rollNumber || !studentName) {
        const row = resultTable.insertRow();
        row.insertCell(0).colSpan = 2;
        row.cells[0].innerText = "Please enter correct student details.";
        return;
    }

    loadingDiv.style.display = 'block';

    const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQaZ3CybbfgjvdNHfkK36L_s83Dgs6hM6v1jFN2agri82VGuIo6Tn-koA1S53CGzeET5OlkL2LNmCrF/pub?output=csv";

    fetch(sheetUrl)
        .then(response => response.text())
        .then(csv => {
            const data = CSVToArray(csv);
            const headers = data[0].map(h => h.trim().toLowerCase());

            const rollIndex = headers.indexOf("roll number");
            const classIndex = headers.indexOf("class");
            const nameIndex = headers.indexOf("student name");

            if (classIndex === -1 || rollIndex === -1 || nameIndex === -1) {
                resultTable.innerHTML = "<tr><td colspan='2'>Error: Column not found in sheet.</td></tr>";
                loadingDiv.style.display = 'none';
                return;
            }

            let found = false;

            for (let i = 1; i < data.length; i++) {
                const row = data[i];
                const rowClass = (row[classIndex] || "").trim().toLowerCase();
                const rowRoll = (row[rollIndex] || "").trim().toLowerCase();
                const rowName = (row[nameIndex] || "").trim().toLowerCase();

                if (rowClass === className && rowRoll === rollNumber) {
                    found = true;

                    // 🏫 School Header
                    const headerDiv = document.createElement("div");
                    headerDiv.id = "resultHeader";
                    headerDiv.innerHTML = `
                        <div style="text-align:center; margin-bottom:15px;">
                            <img src="logo.png" style="width:80px;"><br>
                            <h2 style="margin:5px 0;">Disha Academy</h2>
                            <p style="margin:0; font-size:14px;">
                                Kamarpara, Baligram, Ranitala, Murshidabad<br>
                                Mob: 9735803060
                            </p>
                            <hr>
                        </div>
                    `;

                    resultTable.parentElement.insertBefore(headerDiv, resultTable);

                    // 📊 Fill Table
                    for (let j = 0; j < headers.length; j++) {
                        const newRow = resultTable.insertRow();
                        newRow.insertCell(0).innerText = data[0][j];
                        newRow.insertCell(1).innerText = row[j];
                    }

                    // 📄 Download Button
                    const btn = document.createElement("button");
                    btn.id = "downloadBtn";
                    btn.innerText = "Download Result as PDF";
                    btn.style.marginTop = "15px";
                    btn.style.padding = "10px 15px";
                    btn.style.cursor = "pointer";
                    btn.style.background = "#4CAF50";
                    btn.style.color = "#fff";
                    btn.style.border = "none";
                    btn.style.borderRadius = "5px";

                    btn.onclick = downloadPDF;

                    resultTable.parentElement.appendChild(btn);

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

// ✅ FIXED PDF FUNCTION (ONLY RESULT SECTION)
function downloadPDF() {

    const header = document.getElementById("resultHeader");
    const table = document.getElementById("resultTable");

    const content = `
        <div>
            ${header ? header.outerHTML : ""}
            ${table.outerHTML}
        </div>
    `;

    const printWindow = window.open('', '', 'width=900,height=700');

    printWindow.document.write(`
        <html>
        <head>
            <title>Student Result</title>
            <style>
                body { font-family: Arial; text-align:center; padding:20px; }
                table { width: 100%; border-collapse: collapse; margin-top:20px; }
                td { border: 1px solid #000; padding: 8px; }
                img { margin-bottom:10px; }
                @media print {
                    body { margin: 0; }
                }
            </style>
        </head>
        <body>
            ${content}
        </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
}

// 📊 CSV Parser
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
