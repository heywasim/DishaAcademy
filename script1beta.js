const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQeoZJafbOO0mfnUhjwFKwfZ9AN_uY1eqxbOk9SVf8HH9_6we7ArWecWOGPAM4wvniB3SyRV_SLgpiu/pub?output=csv";

let allData = [];

fetch(sheetURL)
.then(res => res.text())
.then(csv => {
    const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true });

    // 🔥 Clean keys (remove extra spaces)
    allData = parsed.data.map(row => {
        let cleanRow = {};
        Object.keys(row).forEach(key => {
            const cleanKey = key.trim().replace(/\s+/g, " ");
            cleanRow[cleanKey] = row[key];
        });
        return cleanRow;
    });

    console.log("CLEAN DATA:", allData);
});

document.getElementById("searchForm").addEventListener("submit", function(e){
    e.preventDefault();

    if(allData.length === 0){
        alert("Loading data... please wait");
        return;
    }

    const roll = document.getElementById("roll").value.trim().toLowerCase();
    const name = document.getElementById("name").value.trim().toLowerCase();
    const cls = document.getElementById("class").value.trim().toLowerCase();

    const result = allData.find(row => {

        const r = (row["Roll Number"] || "").toLowerCase();
        const n = (row["Student Name"] || "").toLowerCase();
        const c = (row["Class"] || "").toLowerCase();

        return (
            (!roll || r == roll) &&
            (!name || n.includes(name)) &&
            (!cls || c == cls)
        );
    });

    if(result){
        showResult(result);
    } else {
        alert("No result found. Check input.");
    }
});

function showResult(d){

    const resultDiv = document.getElementById("resultCard");

    resultDiv.innerHTML = `
    <div class="marksheet">

        <h2 style="text-align:center;">Disha Academy</h2>
        <p style="text-align:center;">Academic Report</p>

        <p><b>Name:</b> ${d["Student Name"]}</p>
        <p><b>Father:</b> ${d["Father's Name"]}</p>
        <p><b>Class:</b> ${d["Class"]} | Sec: ${d["Secion"]} | Roll: ${d["Roll Number"]}</p>

        <table>
            <tr><th>Subject</th><th>Marks</th></tr>
            <tr><td>Bengali</td><td>${d["Bengali"]}</td></tr>
            <tr><td>English</td><td>${d["English"]}</td></tr>
            <tr><td>Mathematics</td><td>${d["Mathematics"]}</td></tr>
            <tr><td>Drawing</td><td>${d["Drawing"]}</td></tr>
            <tr><td>Computer</td><td>${d["Computer"]}</td></tr>
            <tr><td>EVS</td><td>${d["Environmental Science"]}</td></tr>
            <tr><td>Conversation</td><td>${d["Conversation"]}</td></tr>
            <tr><td>GK</td><td>${d["General Knowledge"]}</td></tr>
        </table>

        <h3>Total: ${d["Grand Total"] || d["Grand  Total"]}</h3>
        <h3>Percentage: ${d["Percentage"]}%</h3>
        <h3>Rank: ${d["Class Rank"]}</h3>
        <h3>Result: ${d["RESULT"]}</h3>

    </div>
    `;

    resultDiv.classList.remove("hidden");
    document.getElementById("downloadBtn").classList.remove("hidden");
}
