document.addEventListener("DOMContentLoaded", () => {
  const submitButton = document.getElementById("submit");
  const editSection = document.getElementById("editSection");

  if (!submitButton || !editSection) {
    console.error("submitButton or editSection not found in the DOM.");
    return;
  }

  const tbody = document.getElementById("logsSection");
  if (!tbody) {
    console.error("logsSection not found in the DOM.");
    return; // Exit if the logsSection does not exist
  }

  // Icons for edit and delete buttons
  const editIcon = `<i class="fas fa-edit"></i>`;
  const deleteIcon = `<i class="fas fa-trash"></i>`;

  // Initialize data and event listeners
  let editIndex = -1;
  let date = JSON.parse(localStorage.getItem("date")) || [];
  let steps = JSON.parse(localStorage.getItem("steps")) || [];
  let water = JSON.parse(localStorage.getItem("water")) || [];
  let sleep = JSON.parse(localStorage.getItem("sleep")) || [];

  const stepsInput = document.getElementById("steps");
  const waterInput = document.getElementById("water");
  const sleepInput = document.getElementById("sleep");

  fillTable(); // Populate the table initially
  updateProgressTracker();

  // Submit button event listener
  submitButton.addEventListener("click", () => {
    const s = stepsInput.value || null;
    const w = waterInput.value || null;
    const sl = sleepInput.value || null;
    if (s === null || w === null || sl === null) {
      alert("Please enter all the fields.");
      return;
    }
    const d = new Date().toLocaleDateString();
    date = [d, ...date];
    steps = [s, ...steps];
    water = [w, ...water];
    sleep = [sl, ...sleep];
    clearInputs();
    fillTable();
    addToLocalStorage();
    updateProgressTracker();
  });

  // Function to clear inputs
  function clearInputs() {
    stepsInput.value = "";
    waterInput.value = "";
    sleepInput.value = "";
  }

  // Function to add data to localStorage
  function addToLocalStorage() {
    localStorage.setItem("date", JSON.stringify(date));
    localStorage.setItem("steps", JSON.stringify(steps));
    localStorage.setItem("water", JSON.stringify(water));
    localStorage.setItem("sleep", JSON.stringify(sleep));
  }

  // Function to fill the table with data
  function fillTable() {
    const rows = Math.max(steps.length, water.length, sleep.length);
    let html = "";
    for (let i = 0; i < rows; i++) {
      let s = steps[i] || "N/A";
      let w = water[i] || "N/A";
      let sl = sleep[i] || "N/A";
      let d = date[i] || "N/A";
      html += `<tr>
              <td>${d}</td>
              <td>${s}</td>
              <td>${w}</td>
              <td>${sl}</td>
              <td>
                  <button onclick="activateEdit(${i})" class="edit">${editIcon}</button>
              </td>
              <td>
                  <button onclick="deleteRow(${i})" class="delete">${deleteIcon}</button>
              </td>
          </tr>`;
    }
    tbody.innerHTML = html;
  }

  // Function to activate the edit mode
  function activateEdit(i) {
    stepsInput.value = steps[i];
    waterInput.value = water[i];
    sleepInput.value = sleep[i];
    editIndex = i;
    submitButton.classList.add("hidden");
    editSection.classList.remove("hidden");
  }

  // Function to delete a row
  function deleteRow(i) {
    if (!confirm(`Confirm that you want to delete the entry: \n ${date[i]}: ${steps[i]} steps, ${water[i]}L water, ${sleep[i]} hours sleep`))
      return;
    date.splice(i, 1);
    steps.splice(i, 1);
    water.splice(i, 1);
    sleep.splice(i, 1);
    fillTable();
    addToLocalStorage();
  }

  // Function to calculate space progress
  function calculateProgress() {
    const totalSteps = steps.reduce((sum, val) => sum + parseInt(val || 0, 10), 0);
    const distanceTraveled = totalSteps * 0.0001;
    const planetDistances = [0, 0.384, 225, 778, 1427];
    const planets = ["Earth", "Moon", "Mars", "Jupiter", "Saturn"];
    let currentPlanetIndex = 0;
    let progressPercent = 0;

    for (let i = 0; i < planets.length - 1; i++) {
      if (distanceTraveled >= planetDistances[i]) {
        currentPlanetIndex = i;
        if (distanceTraveled < planetDistances[i + 1]) {
          progressPercent = ((distanceTraveled - planetDistances[i]) / (planetDistances[i + 1] - planetDistances[i])) * 100;
          break;
        }
      }
    }
    return { currentPlanetIndex, progressPercent };
  }

  // Function to update progress tracker
  function updateProgressTracker() {
    const { currentPlanetIndex, progressPercent } = calculateProgress();
    const steps = document.querySelectorAll(".wizard-progress .step");

    steps.forEach((step, index) => {
      step.classList.remove("complete", "in-progress", "future");
      if (index < currentPlanetIndex) {
        step.classList.add("complete");
      } else if (index === currentPlanetIndex) {
        step.classList.add("in-progress");
      } else {
        step.classList.add("future");
      }
    });
  }
});
