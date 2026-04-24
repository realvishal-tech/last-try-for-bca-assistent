/*
  BCA Study Platform
  - Admin writes material links to Firebase Realtime Database
  - User section listens in real-time and renders Semester -> Subject -> Materials
*/

const BCA_STRUCTURE = {
    "Semester 1": [
        "BCA-101: Mathematical Foundation",
        "BCA-102: Computer Fundamentals",
        "BCA-103: Business Communication & Information System",
        "BCA-104: C Programming",
        "BCA-105: Lab on DOS & Windows",
        "BCA-106: Lab on C"
    ],
    "Semester 2": [
        "BCA-201: Discrete Mathematics",
        "BCA-202: Computer Architecture",
        "BCA-203: Data Structure through C",
        "BCA-204: System Analysis and Design",
        "BCA-205: Lab on MS-Office",
        "BCA-206: Lab on Data Structure through C"
    ],
    "Semester 3": [
        "BCA-301: Fundamentals of Management & Business Accounting",
        "BCA-302: Database Management System",
        "BCA-303: Object Oriented Programming using C++",
        "BCA-304: Numerical Methodology",
        "BCA-305: Lab on DBMS (SQL/MS-ACCESS)",
        "BCA-306: Lab on C++"
    ],
    "Semester 4": [
        "BCA-401: Java Programming",
        "BCA-402: Computer Graphics & Multimedia",
        "BCA-403: Operating System & Linux",
        "BCA-404: Software Engineering Principles",
        "BCA-405: Lab on Java Programming",
        "BCA-406: Lab on Computer Graphics & Linux"
    ],
    "Semester 5": [
        "BCA-501: Relational Database Management System",
        "BCA-502: Artificial Intelligence through Python Programming",
        "BCA-503: Web Technology (HTML, JavaScript, CSS)",
        "BCA-504: Computer Network, Security and Cyber Law",
        "BCA-505: Lab on Oracle",
        "BCA-506: Lab on Python Programming & Web Technology"
    ],
    "Semester 6": [
        "BCA-601: Project Report",
        "BCA-602: Seminar Presentation",
        "BCA-603: Viva-Voce"
    ]
};

// Use your Firebase project details. These are copied from the existing project config.
const firebaseConfig = {
    apiKey: "AIzaSyDj_ZhNM5tVoPdX_Nz3aB2cQ7mKLpQrz4A",
    authDomain: "bca-study-hub-85d4a.firebaseapp.com",
    projectId: "bca-study-hub-85d4a",
    storageBucket: "bca-study-hub-85d4a.appspot.com",
    messagingSenderId: "123456789012",
    databaseURL: "https://bca-study-hub-85d4a-default-rtdb.firebaseio.com"
};

const semesterSelect = document.getElementById("semesterSelect");
const subjectSelect = document.getElementById("subjectSelect");
const materialForm = document.getElementById("materialForm");
const materialUrl = document.getElementById("materialUrl");
const materialDesc = document.getElementById("materialDesc");
const submitBtn = document.getElementById("submitBtn");
const adminStatus = document.getElementById("adminStatus");
const loadingState = document.getElementById("loadingState");
const emptyState = document.getElementById("emptyState");
const materialsContainer = document.getElementById("materialsContainer");

let materialsRef;
let firstLoadCompleted = false;

init();

function init() {
    initializeFirebase();
    populateSemesterDropdown();
    bindEvents();
    attachRealtimeListener();
}

function initializeFirebase() {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    materialsRef = firebase.database().ref("materials");
}

function populateSemesterDropdown() {
    const semesterNames = Object.keys(BCA_STRUCTURE);
    semesterNames.forEach((semesterName) => {
        const option = document.createElement("option");
        option.value = semesterName;
        option.textContent = semesterName;
        semesterSelect.appendChild(option);
    });
}

function updateSubjectDropdown(semesterName) {
    subjectSelect.innerHTML = "";

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Select Subject";
    subjectSelect.appendChild(placeholder);

    if (!semesterName || !BCA_STRUCTURE[semesterName]) {
        return;
    }

    BCA_STRUCTURE[semesterName].forEach((subject) => {
        const option = document.createElement("option");
        option.value = subject;
        option.textContent = subject;
        subjectSelect.appendChild(option);
    });
}

function bindEvents() {
    semesterSelect.addEventListener("change", (event) => {
        updateSubjectDropdown(event.target.value);
    });

    materialForm.addEventListener("submit", handleMaterialSubmit);
}

async function handleMaterialSubmit(event) {
    event.preventDefault();

    const semester = semesterSelect.value;
    const subject = subjectSelect.value;
    const url = materialUrl.value.trim();
    const desc = materialDesc.value.trim();

    if (!semester || !subject || !url || !desc) {
        setAdminStatus("Please fill all fields.", "error");
        return;
    }

    if (!isValidHttpUrl(url)) {
        setAdminStatus("Please enter a valid URL (http/https).", "error");
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Saving...";

    try {
        await materialsRef.child(semester).child(subject).push({
            url,
            desc,
            timestamp: Date.now()
        });

        materialUrl.value = "";
        materialDesc.value = "";
        setAdminStatus("Material added successfully.", "success");
    } catch (error) {
        setAdminStatus(`Failed to add material: ${error.message}`, "error");
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Add Material";
    }
}

function setAdminStatus(message, type) {
    adminStatus.textContent = message;
    adminStatus.className = `status-text ${type}`;
}

function attachRealtimeListener() {
    materialsRef.on(
        "value",
        (snapshot) => {
            const data = snapshot.val() || {};
            renderMaterials(data);

            if (!firstLoadCompleted) {
                firstLoadCompleted = true;
                loadingState.classList.add("hidden");
            }
        },
        (error) => {
            loadingState.classList.add("hidden");
            emptyState.classList.remove("hidden");
            emptyState.textContent = `Error loading materials: ${error.message}`;
        }
    );
}

function renderMaterials(materialsData) {
    materialsContainer.innerHTML = "";

    const semesterNames = Object.keys(BCA_STRUCTURE);
    let hasAnyMaterial = false;

    semesterNames.forEach((semesterName) => {
        const semesterNode = materialsData[semesterName];
        if (!semesterNode) {
            return;
        }

        const semesterBlock = document.createElement("section");
        semesterBlock.className = "semester-block";

        const semesterTitle = document.createElement("h3");
        semesterTitle.className = "semester-title";
        semesterTitle.textContent = semesterName;
        semesterBlock.appendChild(semesterTitle);

        let semesterHasMaterial = false;

        BCA_STRUCTURE[semesterName].forEach((subjectName) => {
            const subjectNode = semesterNode[subjectName];
            if (!subjectNode) {
                return;
            }

            const materialItems = Object.values(subjectNode)
                .filter((item) => item && item.url && item.desc)
                .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

            if (!materialItems.length) {
                return;
            }

            semesterHasMaterial = true;
            hasAnyMaterial = true;

            const subjectBlock = document.createElement("article");
            subjectBlock.className = "subject-block";

            const subjectTitle = document.createElement("h4");
            subjectTitle.className = "subject-title";
            subjectTitle.textContent = subjectName;
            subjectBlock.appendChild(subjectTitle);

            const materialsGrid = document.createElement("div");
            materialsGrid.className = "materials-grid";

            materialItems.forEach((item) => {
                materialsGrid.appendChild(createMaterialCard(item));
            });

            subjectBlock.appendChild(materialsGrid);
            semesterBlock.appendChild(subjectBlock);
        });

        if (semesterHasMaterial) {
            materialsContainer.appendChild(semesterBlock);
        }
    });

    emptyState.classList.toggle("hidden", hasAnyMaterial);
}

function createMaterialCard(item) {
    const card = document.createElement("div");
    card.className = "material-card";

    const cardTop = document.createElement("div");
    cardTop.className = "card-top";

    const desc = document.createElement("p");
    desc.className = "card-desc";
    desc.textContent = item.desc;
    cardTop.appendChild(desc);

    if (isNew(item.timestamp)) {
        const badge = document.createElement("span");
        badge.className = "new-badge";
        badge.textContent = "NEW";
        cardTop.appendChild(badge);
    }

    const link = document.createElement("a");
    link.className = "material-link";
    link.href = item.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Open Material";

    const time = document.createElement("p");
    time.className = "card-time";
    time.textContent = formatTimestamp(item.timestamp);

    card.appendChild(cardTop);
    card.appendChild(link);
    card.appendChild(time);

    return card;
}

function isValidHttpUrl(urlString) {
    try {
        const url = new URL(urlString);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}

function isNew(timestamp) {
    if (!timestamp) {
        return false;
    }
    return Date.now() - timestamp <= 24 * 60 * 60 * 1000;
}

function formatTimestamp(timestamp) {
    if (!timestamp) {
        return "Added recently";
    }

    const date = new Date(timestamp);
    return `Added on ${date.toLocaleString()}`;
}
