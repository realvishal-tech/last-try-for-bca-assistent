/**
 * Materials Display Handler
 * ==========================
 * Handles real-time material fetch and display
 */

let allMaterials = [];
let materialsLoaded = false;

/**
 * Initialize materials handler on page load
 */
document.addEventListener('DOMContentLoaded', () => {
    loadAllMaterials();
});

/**
 * Load all materials from Firebase with real-time listener
 */
function loadAllMaterials() {
    const loadingState = document.getElementById('loadingState');
    const emptyState = document.getElementById('emptyState');
    const container = document.getElementById('materialsContainer');

    // Show loading state
    if (loadingState) loadingState.classList.remove('hidden');
    if (container) container.innerHTML = '';

    materialsRef.on('value', (snapshot) => {
        const data = snapshot.val() || {};
        allMaterials = [];

        // Parse materials from Firebase structure
        for (let semesterNum in data) {
            for (let subjectCode in data[semesterNum]) {
                const subjectMaterials = data[semesterNum][subjectCode];
                for (let materialId in subjectMaterials) {
                    const material = subjectMaterials[materialId];
                    allMaterials.push({
                        id: materialId,
                        semester: parseInt(semesterNum),
                        subject: subjectCode,
                        subjectName: getSubjectNameByCode(subjectCode),
                        desc: material.desc || '',
                        url: material.url || '',
                        timestamp: material.timestamp || 0
                    });
                }
            }
        }

        materialsLoaded = true;

        // Hide loading state
        if (loadingState) loadingState.classList.add('hidden');

        // Display materials
        if (allMaterials.length === 0) {
            if (container) container.innerHTML = '';
            if (emptyState) emptyState.classList.remove('hidden');
        } else {
            if (emptyState) emptyState.classList.add('hidden');
            displayMaterials(allMaterials);
        }
    });
}

/**
 * Display materials grouped by semester and subject
 */
function displayMaterials(materials) {
    const container = document.getElementById('materialsContainer');
    if (!container) return;

    container.innerHTML = '';

    // Group by semester
    const groupedBySemester = {};
    materials.forEach(material => {
        if (!groupedBySemester[material.semester]) {
            groupedBySemester[material.semester] = {};
        }
        if (!groupedBySemester[material.semester][material.subject]) {
            groupedBySemester[material.semester][material.subject] = [];
        }
        groupedBySemester[material.semester][material.subject].push(material);
    });

    // Sort materials within each subject by timestamp (newest first)
    for (let sem in groupedBySemester) {
        for (let subject in groupedBySemester[sem]) {
            groupedBySemester[sem][subject].sort((a, b) => 
                (b.timestamp || 0) - (a.timestamp || 0)
            );
        }
    }

    // Create semester sections
    const semesters = Object.keys(groupedBySemester).sort((a, b) => parseInt(a) - parseInt(b));
    
    semesters.forEach(semesterNum => {
        const semesterElement = document.createElement('div');
        semesterElement.className = 'semester-section';
        semesterElement.innerHTML = `
            <div class="semester-header">
                <h2>
                    <i class="fas fa-graduation-cap"></i>
                    Semester ${semesterNum}
                </h2>
                <span class="semester-count">
                    ${Object.values(groupedBySemester[semesterNum])
                        .reduce((sum, subj) => sum + subj.length, 0)} materials
                </span>
            </div>
        `;

        // Create subject groups within semester
        const subjectsDiv = document.createElement('div');
        subjectsDiv.className = 'subjects-container';

        const subjects = Object.keys(groupedBySemester[semesterNum]).sort();
        
        subjects.forEach(subjectCode => {
            const subjectMaterials = groupedBySemester[semesterNum][subjectCode];
            const subjectElement = document.createElement('div');
            subjectElement.className = 'subject-group';

            const subjectName = subjectMaterials[0].subjectName;
            subjectElement.innerHTML = `
                <div class="subject-header">
                    <h3>
                        <i class="fas fa-book"></i>
                        ${subjectCode}
                    </h3>
                    <p class="subject-name">${subjectName}</p>
                </div>
                <div class="materials-grid" data-subject="${subjectCode}"></div>
            `;

            // Add materials to grid
            const materialsGrid = subjectElement.querySelector('.materials-grid');
            subjectMaterials.forEach(material => {
                const materialCard = createMaterialCard(material);
                materialsGrid.appendChild(materialCard);
            });

            subjectsDiv.appendChild(subjectElement);
        });

        semesterElement.appendChild(subjectsDiv);
        container.appendChild(semesterElement);
    });
}

/**
 * Create a material card element
 */
function createMaterialCard(material) {
    const card = document.createElement('div');
    card.className = 'material-card';
    card.dataset.materialId = material.id;
    card.dataset.semester = material.semester;
    card.dataset.subject = material.subject;

    const isNew = Date.now() - material.timestamp < 24 * 60 * 60 * 1000; // Less than 24 hours

    card.innerHTML = `
        <div class="material-card-content">
            ${isNew ? '<span class="badge-new">New</span>' : ''}
            
            <h4 class="material-title">
                <i class="fas fa-file-pdf"></i>
                ${escapeHtml(material.desc)}
            </h4>

            <p class="material-meta">
                <i class="fas fa-clock"></i>
                <span>${formatDate(material.timestamp)}</span>
            </p>

            <div class="material-actions">
                <a href="${material.url}" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   class="btn-material-link">
                    <i class="fas fa-external-link-alt"></i>
                    Open Material
                </a>
            </div>
        </div>
    `;

    return card;
}

/**
 * Filter materials based on search and semester selection
 */
function filterMaterials() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const selectedSemester = document.getElementById('semesterFilter').value;

    let filtered = allMaterials;

    // Filter by semester
    if (selectedSemester) {
        filtered = filtered.filter(m => m.semester === parseInt(selectedSemester));
    }

    // Filter by search term
    if (searchTerm) {
        filtered = filtered.filter(m =>
            m.desc.toLowerCase().includes(searchTerm) ||
            m.subject.toLowerCase().includes(searchTerm) ||
            m.subjectName.toLowerCase().includes(searchTerm)
        );
    }

    const container = document.getElementById('materialsContainer');
    const emptyState = document.getElementById('emptyState');

    if (filtered.length === 0 && materialsLoaded) {
        if (container) container.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
    } else {
        if (emptyState) emptyState.classList.add('hidden');
        displayMaterials(filtered);
    }
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
