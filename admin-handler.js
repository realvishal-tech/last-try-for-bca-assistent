/**
 * Admin Material Handler
 * ======================
 * Handles admin login, material submission, and management
 */

const ADMIN_CREDENTIALS = {
    email: 'admin@bca.com',
    password: 'Admin@@2023'
};

let materialsCache = {};

/**
 * Initialize admin handlers on page load
 */
document.addEventListener('DOMContentLoaded', () => {
    checkAdminLogin();
    document.getElementById('adminLoginForm').addEventListener('submit', handleAdminLogin);
    document.getElementById('addMaterialForm').addEventListener('submit', handleAddMaterial);
    loadAdminStatistics();
});

/**
 * Check if admin is already logged in
 */
function checkAdminLogin() {
    const isAdmin = sessionStorage.getItem('adminLoggedIn');
    if (isAdmin === 'true') {
        showAdminDashboard();
    } else {
        showAdminLogin();
    }
}

/**
 * Show admin login screen
 */
function showAdminLogin() {
    document.getElementById('adminLogin').classList.remove('hidden');
    document.getElementById('adminDashboard').classList.add('hidden');
}

/**
 * Show admin dashboard
 */
function showAdminDashboard() {
    document.getElementById('adminLogin').classList.add('hidden');
    document.getElementById('adminDashboard').classList.remove('hidden');
    loadAdminStatistics();
    loadMaterialsList();
}

/**
 * Handle admin login
 */
function handleAdminLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value;

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        showAdminDashboard();
        showToast('✅ Login successful! Welcome Admin', 'success');
        document.getElementById('adminLoginForm').reset();
    } else {
        showToast('❌ Invalid email or password', 'error');
    }
}

/**
 * Handle material addition
 */
function handleAddMaterial(e) {
    e.preventDefault();

    const semester = document.getElementById('semesterSelect').value;
    const subject = document.getElementById('subjectSelect').value;
    const description = document.getElementById('descriptionInput').value.trim();
    const url = document.getElementById('linkInput').value.trim();

    // Validation
    if (!semester || !subject || !description || !url) {
        showToast('❌ Please fill all fields', 'error');
        return;
    }

    // Show loading state
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';

    // Store material in Firebase
    const materialData = {
        desc: description,
        url: url,
        timestamp: Date.now()
    };

    // Build reference: materials/semester/subject/autoId
    const materialRef = database.ref(`materials/${semester}/${subject}`).push();
    
    materialRef.set(materialData)
        .then(() => {
            showToast('✅ Material uploaded successfully!', 'success');
            document.getElementById('addMaterialForm').reset();
            loadAdminStatistics();
            loadMaterialsList();
            
            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        })
        .catch((error) => {
            console.error('Error uploading material:', error);
            showToast(`❌ Error uploading material: ${error.message}`, 'error');
            
            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        });
}

/**
 * Update subject dropdown based on selected semester
 */
function updateSubjects() {
    const semester = document.getElementById('semesterSelect').value;
    const subjectSelect = document.getElementById('subjectSelect');
    
    subjectSelect.innerHTML = '<option value="">Select Subject</option>';
    
    if (!semester) return;

    const subjects = getSubjectsBySemester(parseInt(semester));
    subjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject.code;
        option.textContent = `${subject.code} - ${subject.name}`;
        subjectSelect.appendChild(option);
    });
}

/**
 * Load admin statistics from Firebase
 */
function loadAdminStatistics() {
    materialsRef.once('value', (snapshot) => {
        const data = snapshot.val() || {};
        
        let totalMaterials = 0;
        let subjectsSet = new Set();
        let semestersSet = new Set();

        for (let sem in data) {
            semestersSet.add(sem);
            for (let subject in data[sem]) {
                subjectsSet.add(subject);
                const materials = data[sem][subject];
                totalMaterials += Object.keys(materials || {}).length;
            }
        }

        document.getElementById('totalMaterials').textContent = totalMaterials;
        document.getElementById('totalSubjects').textContent = subjectsSet.size;
        document.getElementById('totalSemesters').textContent = semestersSet.size;
    });
}

/**
 * Load and display materials list in admin panel
 */
function loadMaterialsList() {
    materialsRef.on('value', (snapshot) => {
        const data = snapshot.val() || {};
        const tbody = document.getElementById('materialsTableBody');
        
        let materials = [];
        
        for (let sem in data) {
            for (let subject in data[sem]) {
                const semesterMaterials = data[sem][subject];
                for (let id in semesterMaterials) {
                    const material = semesterMaterials[id];
                    materials.push({
                        id: id,
                        semester: sem,
                        subject: subject,
                        subjectName: getSubjectNameByCode(subject),
                        ...material
                    });
                }
            }
        }

        // Sort by timestamp (newest first)
        materials.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

        // Store in cache for search
        materialsCache = materials;

        // Clear and populate table
        tbody.innerHTML = '';
        
        if (materials.length === 0) {
            tbody.innerHTML = '<tr class="empty-row"><td colspan="5" style="text-align: center; color: #999;">No materials added yet</td></tr>';
            return;
        }

        materials.forEach(material => {
            const row = document.createElement('tr');
            const urlDisplay = material.url.length > 40 
                ? material.url.substring(0, 40) + '...' 
                : material.url;
            
            row.innerHTML = `
                <td>Sem ${material.semester}</td>
                <td><strong>${material.subject}</strong></td>
                <td>${material.desc}</td>
                <td>
                    <a href="${material.url}" target="_blank" title="${material.url}" class="link-preview">
                        ${urlDisplay}
                    </a>
                </td>
                <td>
                    <button class="btn-icon btn-danger" onclick="deleteMaterial('${material.semester}', '${material.subject}', '${material.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    });
}

/**
 * Delete a material from Firebase
 */
function deleteMaterial(semester, subject, id) {
    if (!confirm('Are you sure you want to delete this material?')) {
        return;
    }

    const materialRef = database.ref(`materials/${semester}/${subject}/${id}`);
    materialRef.remove()
        .then(() => {
            showToast('✅ Material deleted successfully', 'success');
            loadAdminStatistics();
            loadMaterialsList();
        })
        .catch((error) => {
            console.error('Error deleting material:', error);
            showToast(`❌ Error deleting material: ${error.message}`, 'error');
        });
}

/**
 * Filter materials in admin panel
 */
function filterAdminMaterials() {
    const searchTerm = document.getElementById('adminSearchInput').value.toLowerCase();
    const tbody = document.getElementById('materialsTableBody');
    
    if (!searchTerm) {
        loadMaterialsList();
        return;
    }

    const filtered = materialsCache.filter(material => 
        material.desc.toLowerCase().includes(searchTerm) ||
        material.subject.toLowerCase().includes(searchTerm) ||
        material.url.toLowerCase().includes(searchTerm) ||
        material.subjectName.toLowerCase().includes(searchTerm)
    );

    tbody.innerHTML = '';
    
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="5" style="text-align: center; color: #999;">No materials found</td></tr>';
        return;
    }

    filtered.forEach(material => {
        const row = document.createElement('tr');
        const urlDisplay = material.url.length > 40 
            ? material.url.substring(0, 40) + '...' 
            : material.url;
        
        row.innerHTML = `
            <td>Sem ${material.semester}</td>
            <td><strong>${material.subject}</strong></td>
            <td>${material.desc}</td>
            <td>
                <a href="${material.url}" target="_blank" title="${material.url}" class="link-preview">
                    ${urlDisplay}
                </a>
            </td>
            <td>
                <button class="btn-icon btn-danger" onclick="deleteMaterial('${material.semester}', '${material.subject}', '${material.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

/**
 * Admin logout
 */
function adminLogout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.removeItem('adminLoggedIn');
        showAdminLogin();
        document.getElementById('adminLoginForm').reset();
        showToast('👋 Logged out successfully', 'info');
    }
}
