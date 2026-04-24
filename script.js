import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getDatabase, ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

const BCA_SUBJECTS = {
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
        "BCA-305: Lab on DBMS",
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
        "BCA-503: Web Technology",
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
const materialUrlInput = document.getElementById("materialUrl");
const materialDescInput = document.getElementById("materialDesc");
const submitButton = document.getElementById("submitButton");
const formMessage = document.getElementById("formMessage");
const loadingState = document.getElementById("loadingState");
const emptyState = document.getElementById("emptyState");
const materialsContainer = document.getElementById("materialsContainer");

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const materialsRef = ref(db, "materials");

let firstLoadDone = false;

initializeAppUI();
bindFormEvents();
listenToMaterials();
setupFeatureCardAnimation();

function initializeAppUI() {
    Object.keys(BCA_SUBJECTS).forEach((semesterName) => {
        const option = document.createElement("option");
        option.value = semesterName;
        option.textContent = semesterName;
        semesterSelect.appendChild(option);
    });
}

function bindFormEvents() {
    semesterSelect.addEventListener("change", (event) => {
        updateSubjectOptions(event.target.value);
    });

    materialForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        clearMessage();

        const semester = semesterSelect.value.trim();
        const subject = subjectSelect.value.trim();
        const url = materialUrlInput.value.trim();
        const desc = materialDescInput.value.trim();

        if (!semester || !subject || !url || !desc) {
            showMessage("Please fill all fields.", "error");
            return;
        }

        if (!isValidHttpUrl(url)) {
            showMessage("Please enter a valid URL (http/https).", "error");
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = "Uploading...";

        try {
            const subjectKey = toFirebaseSafeKey(subject);
            const subjectRef = ref(db, `materials/${semester}/${subjectKey}`);
            const newItemRef = push(subjectRef);

            await set(newItemRef, {
                url,
                desc,
                timestamp: Date.now(),
                subjectLabel: subject
            });

            materialForm.reset();
            updateSubjectOptions("");
            showMessage("Material uploaded successfully.", "success");
        } catch (error) {
            showMessage(`Upload failed: ${error.message}`, "error");
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "Upload Material";
        }
    });
}

function updateSubjectOptions(semesterName) {
    subjectSelect.innerHTML = "";

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Select Subject";
    subjectSelect.appendChild(placeholder);

    if (!semesterName || !BCA_SUBJECTS[semesterName]) {
        return;
    }

    BCA_SUBJECTS[semesterName].forEach((subject) => {
        const option = document.createElement("option");
        option.value = subject;
        option.textContent = subject;
        subjectSelect.appendChild(option);
    });
}

function listenToMaterials() {
    onValue(
        materialsRef,
        (snapshot) => {
            const materialsData = snapshot.val() || {};
            renderMaterials(materialsData);

            if (!firstLoadDone) {
                firstLoadDone = true;
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
    let hasData = false;

    Object.keys(BCA_SUBJECTS).forEach((semesterName) => {
        const semesterData = materialsData[semesterName];
        if (!semesterData) {
            return;
        }

        const semesterSection = document.createElement("section");
        semesterSection.className = "semester-section";

        const semesterHeading = document.createElement("h3");
        semesterHeading.className = "semester-heading";
        semesterHeading.textContent = semesterName;
        semesterSection.appendChild(semesterHeading);

        let semesterHasAny = false;

        BCA_SUBJECTS[semesterName].forEach((subjectLabel) => {
            const subjectKey = toFirebaseSafeKey(subjectLabel);
            const subjectNode = semesterData[subjectKey];
            if (!subjectNode) {
                return;
            }

            const materialItems = Object.values(subjectNode)
                .filter((item) => item && item.url && item.desc)
                .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

            if (!materialItems.length) {
                return;
            }

            hasData = true;
            semesterHasAny = true;

            const subjectSection = document.createElement("article");
            subjectSection.className = "subject-section";

            const subjectHeading = document.createElement("h4");
            subjectHeading.className = "subject-heading";
            subjectHeading.textContent = subjectLabel;

            const materialGrid = document.createElement("div");
            materialGrid.className = "material-grid";

            materialItems.forEach((item) => {
                materialGrid.appendChild(createMaterialCard(item));
            });

            subjectSection.appendChild(subjectHeading);
            subjectSection.appendChild(materialGrid);
            semesterSection.appendChild(subjectSection);
        });

        if (semesterHasAny) {
            materialsContainer.appendChild(semesterSection);
        }
    });

    emptyState.classList.toggle("hidden", hasData);
}

function createMaterialCard(item) {
    const card = document.createElement("div");
    card.className = "material-card";

    const top = document.createElement("div");
    top.className = "material-top";

    const desc = document.createElement("p");
    desc.className = "material-desc";
    desc.textContent = item.desc;
    top.appendChild(desc);

    if (isRecentlyAdded(item.timestamp)) {
        const badge = document.createElement("span");
        badge.className = "new-badge";
        badge.textContent = "NEW";
        top.appendChild(badge);
    }

    const link = document.createElement("a");
    link.className = "material-link";
    link.href = item.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Open Material";

    const time = document.createElement("p");
    time.className = "material-time";
    time.textContent = formatTimestamp(item.timestamp);

    card.appendChild(top);
    card.appendChild(link);
    card.appendChild(time);
    return card;
}

function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
}

function clearMessage() {
    formMessage.textContent = "";
    formMessage.className = "form-message";
}

function isValidHttpUrl(input) {
    try {
        const parsed = new URL(input);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
        return false;
    }
}

function toFirebaseSafeKey(text) {
    return text.replace(/[.#$\[\]/]/g, "-");
}

function isRecentlyAdded(timestamp) {
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
    return `Added: ${date.toLocaleString()}`;
}

function setupFeatureCardAnimation() {
    const cards = document.querySelectorAll(".fade-in-up");
    if (!cards.length || !("IntersectionObserver" in window)) {
        return;
    }

    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }
            entry.target.classList.add("visible");
            currentObserver.unobserve(entry.target);
        });
    }, { threshold: 0.2 });

    cards.forEach((card) => observer.observe(card));
}
