const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQeoZJafbOO0mfnUhjwFKwfZ9AN_uY1eqxbOk9SVf8HH9_6we7ArWecWOGPAM4wvniB3SyRV_SLgpiu/pub?output=csv";

let allData = [];

fetch(sheetURL)
.then(res => res.text())
.then(csv => {
    const parsed = Papa.parse(csv, { header: true });
    allData = parsed.data;
});

document.getElementById("searchForm").addEventListener("submit", function(e){
    e.preventDefault();

    const roll = document.getElementById("roll").value.toLowerCase();
    const name = document.getElementById("name").value.toLowerCase();
    const cls = document.getElementById("class").value.toLowerCase();

    const result = allData.find(row => {

        return (
            (!roll || row["Roll Number"]?.toLowerCase() === roll) &&
            (!name || row["Student Name"]?.toLowerCase().includes(name)) &&
            (!cls || row["Class"]?.toLowerCase() === cls)
        );

    });

    if(result) showResult(result);
    else alert("No result found");
});

function showResult(d){

    const html = `
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

        <h3>Total: ${d["Grand  Total"]}</h3>
        <h3>Percentage: ${d["Percentage"]}%</h3>
        <h3>Rank: ${d["Class Rank"]}</h3>
        <h3>Result: ${d["RESULT"]}</h3>

    </div>
    `;

    const resultDiv = document.getElementById("resultCard");
    resultDiv.innerHTML = html;

    resultDiv.classList.remove("hidden");
    document.getElementById("downloadBtn").classList.remove("hidden");

    gsap.from(".marksheet", {y:50, opacity:0, duration:0.8});
}

document.getElementById("downloadBtn").addEventListener("click", ()=>{
    html2pdf().set({
        margin: 0.5,
        filename: "Disha_Result.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    }).from(document.getElementById("resultCard")).save();
});
