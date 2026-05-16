// The array that stores all student objects
let students = [];
let idCounter = 1;

// Grab all the elements we need from the HTML
const studentNameInput = document.getElementById("studentName");
const studentGradeInput = document.getElementById("studentGrade");
const addBtn = document.getElementById("addBtn");
const studentList = document.getElementById("studentList");
const averageGrade = document.getElementById("averageGrade");
const errorMsg = document.getElementById("errorMsg");

// =====================
// LOAD FROM LOCALSTORAGE
// =====================
function loadFromStorage() {
  const saved = localStorage.getItem("students");
  if (saved) {
    students = JSON.parse(saved);
    // Set idCounter to avoid duplicate ids
    if (students.length > 0) {
      idCounter = Math.max(...students.map((s) => s.id)) + 1;
    }
    displayStudents();
    calculateAverage();
  }
}

// =====================
// SAVE TO LOCALSTORAGE
// =====================
function saveToStorage() {
  localStorage.setItem("students", JSON.stringify(students));
}

// =====================
// ADD STUDENT
// =====================
addBtn.addEventListener("click", function () {
  const name = studentNameInput.value.trim();
  const grade = Number(studentGradeInput.value);

  // Validation
  if (name === "") {
    showError("Student name cannot be empty.");
    return;
  }
  if (studentGradeInput.value === "" || grade < 0 || grade > 100) {
    showError("Grade must be a number between 0 and 100.");
    return;
  }

  // Hide error if input is valid
  errorMsg.style.display = "none";

  // Create the student object and add to array
  const student = { id: idCounter, name: name, grade: grade };
  students.push(student);
  idCounter++;

  // Save to localStorage
  saveToStorage();

  // Update the screen
  displayStudents();
  calculateAverage();

  // Clear the inputs
  studentNameInput.value = "";
  studentGradeInput.value = "";
});

// =====================
// DELETE STUDENT
// =====================
function deleteStudent(id) {
  students = students.filter(function (student) {
    return student.id !== id;
  });

  // Save to localStorage
  saveToStorage();

  // Update the screen
  displayStudents();
  calculateAverage();
}

// =====================
// DISPLAY STUDENTS
// =====================
function displayStudents() {
  // Clear the current table
  studentList.innerHTML = "";

  // Calculate average for highlighting
  const avg = calculateAverage();

  // Loop through array and create a row for each student
  students.forEach(function (student) {
    const row = document.createElement("tr");

    // BONUS: Highlight if above average
    if (student.grade > avg) {
      row.classList.add("above-average");
    }

    row.innerHTML = `
      <td>${student.name}</td>
      <td>${student.grade}</td>
      <td>
        <button onclick="deleteStudent(${student.id})">Delete</button>
      </td>
    `;

    studentList.appendChild(row);
  });
}

// =====================
// CALCULATE AVERAGE
// =====================
function calculateAverage() {
  if (students.length === 0) {
    averageGrade.textContent = "0";
    return 0;
  }

  const total = students.reduce(function (sum, student) {
    return sum + student.grade;
  }, 0);

  const average = total / students.length;
  averageGrade.textContent = average.toFixed(1);
  return average;
}

// =====================
// SHOW ERROR MESSAGE
// =====================
function showError(message) {
  errorMsg.textContent = message;
  errorMsg.style.display = "block";
}

// =====================
// RUN ON PAGE LOAD
// =====================
loadFromStorage();