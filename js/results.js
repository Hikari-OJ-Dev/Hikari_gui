document.getElementById("logs").textContent = "";
// Example JSON data
jsonData = [];
window.electronAPI.onMessage("results", (event, data) => {
  jsonData = data;
  console.log("Success", jsonData);
  displayResults(jsonData);
});

function displayResults(data) {
  pid = data.pid;
  document.getElementById(
    "head"
  ).innerText = `Submission Result for Problem ${pid}`;
  const resultsTable = document
    .getElementById("resultsTable")
    .getElementsByTagName("tbody")[0];
  const overallStatus = document.getElementById("overallStatus");
  const score = document.getElementById("score");
  const points = document.getElementById("points");

  // Clear previous results
  resultsTable.innerHTML = "";

  // Iterate over each test case in the JSON data
  for (const key in data) {
    if (data.hasOwnProperty(key) && !isNaN(key)) {
      const testCase = data[key];
      const row = resultsTable.insertRow();
      if (testCase.status != "AC") testCase.ans = "N/A";
      row.innerHTML = `<td>${key}</td>
                   <td class="status-${testCase.status}">${testCase.status}</td>
                   <td>${testCase.out.trim()}</td>
                   <td>${testCase.ans}</td>`;
    }
  }

  // Set overall status, score, and points
  overallStatus.className = `status-${data.status}`;
  overallStatus.textContent = data.status;
  score.textContent = data.score;
  points.textContent = data.pts;
  if (data.status == "CE") {
    document.getElementById("logs").textContent = data.log;
  }
}
document.getElementById("goBackButton").onclick = function () {
  window.history.back(); // This will take the user back to the previous page
};
// Call displayResults with the example JSON data
displayResults(jsonData);
