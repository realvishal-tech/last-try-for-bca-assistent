/**
 * Firebase Configuration
 * =====================
 * Initialize Firebase and provide database references
 */

// Firebase Configuration Object
// Replace with your actual Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDj_ZhNM5tVoPdX_Nz3aB2cQ7mKLpQrz4A",
    authDomain: "bca-study-hub-85d4a.firebaseapp.com",
    projectId: "bca-study-hub-85d4a",
    storageBucket: "bca-study-hub-85d4a.appspot.com",
    messagingSenderId: "123456789012",
    databaseURL: "https://bca-study-hub-85d4a-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database(app);

// Database References
const materialsRef = database.ref('materials');

/**
 * Subject Structure for BCA
 * Maps semester to subjects with codes and names
 */
const BCA_SUBJECTS = {
    1: [
        { code: 'BCA-101', name: 'Mathematical Foundation' },
        { code: 'BCA-102', name: 'Computer Fundamentals' },
        { code: 'BCA-103', name: 'Business Communication & Information System' },
        { code: 'BCA-104', name: 'C Programming' },
        { code: 'BCA-105', name: 'Lab on DOS & Windows' },
        { code: 'BCA-106', name: 'Lab on C' }
    ],
    2: [
        { code: 'BCA-201', name: 'Discrete Mathematics' },
        { code: 'BCA-202', name: 'Computer Architecture' },
        { code: 'BCA-203', name: 'Data Structure through C' },
        { code: 'BCA-204', name: 'System Analysis and Design' },
        { code: 'BCA-205', name: 'Lab on MS-Office' },
        { code: 'BCA-206', name: 'Lab on Data Structure through C' }
    ],
    3: [
        { code: 'BCA-301', name: 'Fundamentals of Management & Business Accounting' },
        { code: 'BCA-302', name: 'Database Management System' },
        { code: 'BCA-303', name: 'Object Oriented Programming using C++' },
        { code: 'BCA-304', name: 'Numerical Methodology' },
        { code: 'BCA-305', name: 'Lab on DBMS (SQL/MS-ACCESS)' },
        { code: 'BCA-306', name: 'Lab on C++' }
    ],
    4: [
        { code: 'BCA-401', name: 'Java Programming' },
        { code: 'BCA-402', name: 'Computer Graphics & Multimedia' },
        { code: 'BCA-403', name: 'Operating System & Linux' },
        { code: 'BCA-404', name: 'Software Engineering Principles' },
        { code: 'BCA-405', name: 'Lab on Java Programming' },
        { code: 'BCA-406', name: 'Lab on Computer Graphics & Linux' }
    ],
    5: [
        { code: 'BCA-501', name: 'Relational Database Management System' },
        { code: 'BCA-502', name: 'Artificial Intelligence through Python Programming' },
        { code: 'BCA-503', name: 'Web Technology (HTML, JavaScript, CSS)' },
        { code: 'BCA-504', name: 'Computer Network, Security and Cyber Law' },
        { code: 'BCA-505', name: 'Lab on Oracle' },
        { code: 'BCA-506', name: 'Lab on Python Programming & Web Technology' }
    ],
    6: [
        { code: 'BCA-601', name: 'Project Report' },
        { code: 'BCA-602', name: 'Seminar Presentation' },
        { code: 'BCA-603', name: 'Viva-Voce' }
    ]
};

/**
 * Utility function to get subjects for a semester
 */
function getSubjectsBySemester(semester) {
    return BCA_SUBJECTS[semester] || [];
}

/**
 * Utility function to get subject name by code
 */
function getSubjectNameByCode(code) {
    for (let sem in BCA_SUBJECTS) {
        const subject = BCA_SUBJECTS[sem].find(s => s.code === code);
        if (subject) return subject.name;
    }
    return code;
}

/**
 * Toast Notification System
 */
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon;
    switch (type) {
        case 'success':
            icon = '<i class="fas fa-check-circle"></i>';
            break;
        case 'error':
            icon = '<i class="fas fa-exclamation-circle"></i>';
            break;
        case 'info':
            icon = '<i class="fas fa-info-circle"></i>';
            break;
        default:
            icon = '<i class="fas fa-bell"></i>';
    }

    toast.innerHTML = `
        <div class="toast-content">
            ${icon}
            <span>${message}</span>
        </div>
    `;

    toastContainer.appendChild(toast);

    // Auto remove after 4 seconds
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

/**
 * Format timestamp to readable date
 */
function formatDate(timestamp) {
    if (!timestamp) return 'Just now';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    // Less than a minute
    if (diff < 60000) return 'Just now';
    
    // Less than an hour
    if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
    
    // Less than a day
    if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
    
    // Less than a week
    if (diff < 604800000) return Math.floor(diff / 86400000) + 'd ago';
    
    // Format as date
    return date.toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

/**
 * Theme Management
 */
function initializeTheme() {
    const savedTheme = localStorage.getItem('appTheme') || 'light';
    applyTheme(savedTheme);
}

function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        localStorage.setItem('appTheme', 'dark');
        const themeBtn = document.getElementById('themeToggleBtn');
        if (themeBtn) themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('appTheme', 'light');
        const themeBtn = document.getElementById('themeToggleBtn');
        if (themeBtn) themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

function toggleTheme() {
    const currentTheme = localStorage.getItem('appTheme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }
});
