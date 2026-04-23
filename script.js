/* ============================================
   BCA STUDY HUB - MAIN JAVASCRIPT
   ============================================ */

// ============================================
// DATA STRUCTURE & INITIALIZATION
// ============================================

const SEMESTERS = {
    1: [
        { code: 'BCA-101', name: 'Mathematical Foundation', type: 'Theory' },
        { code: 'BCA-102', name: 'Computer Fundamentals', type: 'Theory' },
        { code: 'BCA-103', name: 'Business Communication & IS', type: 'Theory' },
        { code: 'BCA-104', name: 'C Programming', type: 'Theory' },
        { code: 'BCA-105', name: 'Lab on DOS & Windows', type: 'Lab' },
        { code: 'BCA-106', name: 'Lab on C', type: 'Lab' }
    ],
    2: [
        { code: 'BCA-201', name: 'Data Structure', type: 'Theory' },
        { code: 'BCA-202', name: 'Database Management System', type: 'Theory' },
        { code: 'BCA-203', name: 'Web Development Basics', type: 'Theory' },
        { code: 'BCA-204', name: 'Operating Systems', type: 'Theory' },
        { code: 'BCA-205', name: 'Lab on Data Structures', type: 'Lab' },
        { code: 'BCA-206', name: 'Lab on DBMS', type: 'Lab' }
    ],
    3: [
        { code: 'BCA-301', name: 'Object Oriented Programming', type: 'Theory' },
        { code: 'BCA-302', name: 'Software Engineering', type: 'Theory' },
        { code: 'BCA-303', name: 'Computer Networks', type: 'Theory' },
        { code: 'BCA-304', name: 'Web Technologies', type: 'Theory' },
        { code: 'BCA-305', name: 'Lab on OOP', type: 'Lab' },
        { code: 'BCA-306', name: 'Lab on Web Technologies', type: 'Lab' }
    ],
    4: [
        { code: 'BCA-401', name: 'Database Design', type: 'Theory' },
        { code: 'BCA-402', name: 'Advanced Web Development', type: 'Theory' },
        { code: 'BCA-403', name: 'Artificial Intelligence', type: 'Theory' },
        { code: 'BCA-404', name: 'System Security', type: 'Theory' },
        { code: 'BCA-405', name: 'Lab on Advanced DB', type: 'Lab' },
        { code: 'BCA-406', name: 'Lab on Web Security', type: 'Lab' }
    ],
    5: [
        { code: 'BCA-501', name: 'Mobile App Development', type: 'Theory' },
        { code: 'BCA-502', name: 'Cloud Computing', type: 'Theory' },
        { code: 'BCA-503', name: 'Machine Learning', type: 'Theory' },
        { code: 'BCA-504', name: 'Big Data Analytics', type: 'Theory' },
        { code: 'BCA-505', name: 'Lab on Mobile Dev', type: 'Lab' },
        { code: 'BCA-506', name: 'Lab on ML', type: 'Lab' }
    ],
    6: [
        { code: 'BCA-601', name: 'DevOps & Deployment', type: 'Theory' },
        { code: 'BCA-602', name: 'IoT & Embedded Systems', type: 'Theory' },
        { code: 'BCA-603', name: 'Blockchain Technology', type: 'Theory' },
        { code: 'BCA-604', name: 'Project Management', type: 'Theory' },
        { code: 'BCA-605', name: 'Project Work', type: 'Lab' },
        { code: 'BCA-606', name: 'Internship', type: 'Lab' }
    ]
};

// Initialize data on first load
function initializeData() {
    if (!localStorage.getItem('bcaContent')) {
        const initialContent = generateInitialContent();
        localStorage.setItem('bcaContent', JSON.stringify(initialContent));
    }
    if (!localStorage.getItem('userTheme')) {
        localStorage.setItem('userTheme', 'light');
    }
}

function generateInitialContent() {
    const content = [];
    let contentId = 1;

    for (let sem = 1; sem <= 6; sem++) {
        const subjects = SEMESTERS[sem];
        subjects.forEach(subject => {
            // Add 2 notes per subject
            for (let i = 1; i <= 2; i++) {
                content.push({
                    id: `content-${contentId++}`,
                    subject: subject.code,
                    subjectName: subject.name,
                    semester: sem,
                    title: `${subject.code} - Topic ${i} Notes`,
                    type: 'Notes',
                    description: `Comprehensive notes on ${subject.name} - Part ${i}`,
                    link: '#',
                    content: `Detailed content about ${subject.name}. This includes important concepts, formulas, and examples relevant to the topic.`
                });
            }

            // Add 1 PYQ per subject
            content.push({
                id: `content-${contentId++}`,
                subject: subject.code,
                subjectName: subject.name,
                semester: sem,
                title: `${subject.code} - Previous Year Questions`,
                type: 'PYQs',
                description: `Last 5 years examination questions from ${subject.name}`,
                link: '#',
                content: `Question Paper 2020, 2021, 2022, 2023, 2024 with solutions`
            });

            // Add 1 video per subject
            content.push({
                id: `content-${contentId++}`,
                subject: subject.code,
                subjectName: subject.name,
                semester: sem,
                title: `${subject.code} - Complete Lecture Series`,
                type: 'Videos',
                description: `Full video lecture on ${subject.name}`,
                link: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                content: ''
            });

            // Add 1 program for theory subjects
            if (subject.type === 'Theory' && subject.code.includes('104')) {
                content.push({
                    id: `content-${contentId++}`,
                    subject: subject.code,
                    subjectName: subject.name,
                    semester: sem,
                    title: `${subject.code} - Sample Programs`,
                    type: 'Programs',
                    description: `Code examples and programs for ${subject.name}`,
                    link: '#',
                    content: `#include<stdio.h>\nmain(){\nprintf("Hello, World!");\nreturn 0;\n}`
                });
            }

            // Add 1 lab work for lab subjects
            if (subject.type === 'Lab') {
                content.push({
                    id: `content-${contentId++}`,
                    subject: subject.code,
                    subjectName: subject.name,
                    semester: sem,
                    title: `${subject.code} - Lab Manual`,
                    type: 'Lab',
                    description: `Lab procedures and experiments for ${subject.name}`,
                    link: '#',
                    content: `Experiment List: 1. Basic Programs, 2. Data Structures, 3. Advanced Concepts`
                });
            }
        });
    }

    return content;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function initializeTheme() {
    const theme = localStorage.getItem('userTheme') || 'light';
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
    }
    setupThemeToggle();
}

function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('userTheme', isDark ? 'dark' : 'light');
        updateThemeIcon();
    });

    updateThemeIcon();
}

function updateThemeIcon() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    const isDark = document.body.classList.contains('dark-mode');
    themeToggle.innerHTML = `<i class="fas fa-${isDark ? 'sun' : 'moon'}"></i>`;
}

function setupHamburger() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (!hamburger) return;

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// ============================================
// ENTRY SCREEN & LOGIN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeData();
    initializeTheme();
    setupHamburger();
    
    const entryForm = document.getElementById('entryForm');
    if (entryForm) {
        entryForm.addEventListener('submit', handleNameEntry);
    }
});

function handleNameEntry(e) {
    e.preventDefault();
    const name = document.getElementById('nameInput').value.trim();
    
    if (!name) {
        showToast('Please enter your name', 'error');
        return;
    }

    localStorage.setItem('userName', name);
    document.getElementById('entryScreen').style.display = 'none';
    document.getElementById('mainApp').classList.remove('hidden');
    showWelcomeModal(name);
}

function showWelcomeModal(name) {
    document.getElementById('welcomeText').textContent = `Welcome, ${name} 👋 Ready to study smart?`;
    document.getElementById('welcomeModal').classList.remove('hidden');
}

function closeWelcomeModal() {
    document.getElementById('welcomeModal').classList.add('hidden');
    loadHomePage();
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('userName');
        location.reload();
    }
}

// ============================================
// HOME PAGE
// ============================================

function loadHomePage() {
    const userName = localStorage.getItem('userName');
    document.getElementById('userNameDisplay').textContent = userName;

    renderSemesters();
    setupSearchBar();
    loadBonusFeatures();
}

function renderSemesters() {
    const grid = document.getElementById('semesterGrid');
    grid.innerHTML = '';

    for (let i = 1; i <= 6; i++) {
        const card = document.createElement('div');
        card.className = 'semester-card';
        card.onclick = () => navigateToSemester(i);
        
        const subjects = SEMESTERS[i];
        card.innerHTML = `
            <div class="semester-number">${i}</div>
            <div class="semester-subjects">${subjects.length} Subjects</div>
        `;
        
        grid.appendChild(card);
    }
}

function navigateToSemester(semNum) {
    window.location.href = `semester.html?sem=${semNum}`;
}

function getSubjectsBySemester(semNum) {
    return SEMESTERS[semNum] || [];
}

// ============================================
// SEARCH FUNCTIONALITY
// ============================================

function setupSearchBar() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();
        
        if (query.length === 0) {
            document.getElementById('searchResults').style.display = 'none';
            return;
        }

        const results = performSearch(query);
        displaySearchResults(results);
    });
}

function performSearch(query) {
    const allContent = getAllContent();
    return allContent.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.subject.toLowerCase().includes(query) ||
        item.subjectName.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
    );
}

function displaySearchResults(results) {
    const section = document.getElementById('searchResults');
    const grid = document.getElementById('searchResultsGrid');
    
    if (results.length === 0) {
        grid.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><p>No results found</p></div>';
        section.style.display = 'block';
        return;
    }

    grid.innerHTML = '';
    results.forEach(item => {
        const card = document.createElement('div');
        card.className = 'content-card';
        card.innerHTML = `
            <div class="subject-header">
                <h3>${item.title}</h3>
                <span class="content-badge">${item.type}</span>
            </div>
            <p class="content-description">${item.description}</p>
            <p style="font-size: 12px; color: #666;"><strong>${item.subject}</strong> - Semester ${item.semester}</p>
        `;
        grid.appendChild(card);
    });

    section.style.display = 'block';
}

function clearSearch() {
    document.getElementById('searchInput').value = '';
    document.getElementById('searchResults').style.display = 'none';
}

function filterByType(type) {
    const allContent = getAllContent();
    const filtered = allContent.filter(c => c.type === type);
    displaySearchResults(filtered);
}

// ============================================
// CONTENT MANAGEMENT
// ============================================

function getAllContent() {
    return JSON.parse(localStorage.getItem('bcaContent')) || [];
}

function getContentBySubjectAndType(subject, type) {
    const allContent = getAllContent();
    return allContent.filter(c => 
        c.subject === subject && c.type === type
    );
}

function saveContent(contentItem, editId = null) {
    let allContent = getAllContent();

    if (editId) {
        const index = allContent.findIndex(c => c.id === editId);
        if (index >= 0) {
            allContent[index] = { ...allContent[index], ...contentItem };
        }
    } else {
        allContent.push(contentItem);
    }

    localStorage.setItem('bcaContent', JSON.stringify(allContent));
}

function deleteContentItem(id) {
    let allContent = getAllContent();
    allContent = allContent.filter(c => c.id !== id);
    localStorage.setItem('bcaContent', JSON.stringify(allContent));
}

// ============================================
// BOOKMARK SYSTEM
// ============================================

function navigateToBookmarks() {
    const bookmarkedItems = JSON.parse(localStorage.getItem('bookmarkedItems')) || [];
    const bookmarkedSubjects = JSON.parse(localStorage.getItem('bookmarkedSubjects')) || [];

    if (bookmarkedItems.length === 0 && bookmarkedSubjects.length === 0) {
        showToast('No bookmarks yet', 'info');
        return;
    }

    let html = `
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>My Bookmarks - BCA Study Hub</title>
            <link rel="stylesheet" href="style.css">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        </head>
        <body>
            <nav class="navbar">
                <div class="navbar-container">
                    <div class="navbar-logo">
                        <i class="fas fa-bookmark"></i>
                        <span>My Bookmarks</span>
                    </div>
                    <button onclick="history.back()" class="btn-secondary">
                        <i class="fas fa-arrow-left"></i> Back
                    </button>
                </div>
            </nav>
            <main class="main-content">
                <div class="container">
                    <h1>My Bookmarks</h1>
    `;

    if (bookmarkedSubjects.length > 0) {
        html += '<h2 style="margin-top: 30px;">Bookmarked Subjects</h2><div class="subjects-grid">';
        bookmarkedSubjects.forEach(subject => {
            html += `
                <div class="subject-card">
                    <div class="subject-header">
                        <h3>${subject.name}</h3>
                        <span class="subject-code">${subject.code}</span>
                    </div>
                    <button onclick="goToSubject('${subject.code}', '${subject.name}', ${subject.semester})" class="btn-primary" style="width: 100%;">
                        <i class="fas fa-arrow-right"></i> Explore
                    </button>
                </div>
            `;
        });
        html += '</div>';
    }

    if (bookmarkedItems.length > 0) {
        const allContent = getAllContent();
        const bookmarkedContent = allContent.filter(c => bookmarkedItems.includes(c.id));

        html += '<h2 style="margin-top: 30px;">Bookmarked Content</h2><div class="content-items">';
        bookmarkedContent.forEach(item => {
            html += `
                <div class="content-item">
                    <div class="content-item-header">
                        <h3>${item.title}</h3>
                        <span class="content-badge">${item.type}</span>
                    </div>
                    <p class="content-description">${item.description}</p>
                </div>
            `;
        });
        html += '</div>';
    }

    html += `
                </div>
            </main>
            <footer class="footer">
                <div class="footer-content">
                    <p>&copy; 2026 BCA Study Hub - LND College | Crafted with <i class="fas fa-heart"></i> for students</p>
                </div>
            </footer>
            <script>
                function goToSubject(code, name, sem) {
                    window.location.href = 'subject.html?code=' + code + '&name=' + encodeURIComponent(name) + '&sem=' + sem;
                }
            </script>
        </body>
        </html>
    `;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
}

// ============================================
// PROGRESS TRACKING
// ============================================

function navigateToProgress() {
    const completed = JSON.parse(localStorage.getItem('completedSubjects')) || [];
    
    let html = `
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Progress - BCA Study Hub</title>
            <link rel="stylesheet" href="style.css">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        </head>
        <body>
            <nav class="navbar">
                <div class="navbar-container">
                    <div class="navbar-logo">
                        <i class="fas fa-chart-pie"></i>
                        <span>Progress Tracker</span>
                    </div>
                    <button onclick="history.back()" class="btn-secondary">
                        <i class="fas fa-arrow-left"></i> Back
                    </button>
                </div>
            </nav>
            <main class="main-content">
                <div class="container">
                    <h1>Your Learning Progress</h1>
                    <div class="semester-grid">
    `;

    for (let sem = 1; sem <= 6; sem++) {
        const subjects = SEMESTERS[sem];
        const completedCount = subjects.filter(s => completed.includes(s.code)).length;
        const percentage = Math.round((completedCount / subjects.length) * 100);

        html += `
            <div class="semester-card">
                <h3>Semester ${sem}</h3>
                <div class="progress-bar-mini">
                    <div class="progress-fill" style="width: ${percentage}%"></div>
                </div>
                <p>${completedCount}/${subjects.length} completed (${percentage}%)</p>
            </div>
        `;
    }

    const totalCompleted = completed.length;
    const totalSubjects = Object.values(SEMESTERS).reduce((sum, arr) => sum + arr.length, 0);
    const overallPercentage = Math.round((totalCompleted / totalSubjects) * 100);

    html += `
                    </div>
                    <div class="stat-card" style="max-width: 500px; margin: 40px auto;">
                        <i class="fas fa-trophy"></i>
                        <div>
                            <h3>${overallPercentage}%</h3>
                            <p>Overall Progress</p>
                            <p style="font-size: 12px; margin-top: 10px;">${totalCompleted}/${totalSubjects} subjects completed</p>
                        </div>
                    </div>
                </div>
            </main>
            <footer class="footer">
                <div class="footer-content">
                    <p>&copy; 2026 BCA Study Hub - LND College</p>
                </div>
            </footer>
        </body>
        </html>
    `;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
}

function isSubjectCompleted(subjectCode) {
    const completed = JSON.parse(localStorage.getItem('completedSubjects')) || [];
    return completed.includes(subjectCode);
}

function toggleSubjectCompletion(subjectCode) {
    const completed = JSON.parse(localStorage.getItem('completedSubjects')) || [];
    const index = completed.indexOf(subjectCode);

    if (index > -1) {
        completed.splice(index, 1);
        showToast('Subject marked incomplete', 'info');
    } else {
        completed.push(subjectCode);
        showToast('Subject marked as complete ✅', 'success');
    }

    localStorage.setItem('completedSubjects', JSON.stringify(completed));
}

// ============================================
// BONUS FEATURES
// ============================================

function addToRecentlyViewed(subject) {
    let recent = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    
    recent = recent.filter(r => r.code !== subject.code);
    recent.unshift(subject);
    recent = recent.slice(0, 5);
    
    localStorage.setItem('recentlyViewed', JSON.stringify(recent));
}

function loadBonusFeatures() {
    const recent = JSON.parse(localStorage.getItem('recentlyViewed')) || [];

    if (recent.length > 0) {
        document.getElementById('recentlyViewedSection').style.display = 'block';
        const grid = document.getElementById('recentlyViewedGrid');
        grid.innerHTML = '';

        recent.forEach(subject => {
            const card = document.createElement('div');
            card.className = 'subject-card';
            card.innerHTML = `
                <h3>${subject.name}</h3>
                <p>${subject.code}</p>
                <button onclick="window.location.href='subject.html?code=${subject.code}&name=${encodeURIComponent(subject.name)}&sem=${subject.semester}'" class="btn-primary" style="width: 100%;">
                    Continue
                </button>
            `;
            grid.appendChild(card);
        });
    }

    // Trending (simulated)
    if (Math.random() > 0.5) {
        document.getElementById('trendingSection').style.display = 'block';
        const allContent = getAllContent();
        const trending = allContent.filter(c => c.type === 'Notes').slice(0, 3);

        const grid = document.getElementById('trendingGrid');
        grid.innerHTML = '';

        trending.forEach(item => {
            const card = document.createElement('div');
            card.className = 'content-card';
            card.innerHTML = `
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <span class="content-badge">${item.type}</span>
            `;
            grid.appendChild(card);
        });
    }

    // Continue Learning
    const completed = JSON.parse(localStorage.getItem('completedSubjects')) || [];
    const recentlyWeek = JSON.parse(localStorage.getItem('recentlyViewed')) || [];

    if (recentlyWeek.length > 0 && completed.length < 30) {
        document.getElementById('continueLearningSection').style.display = 'block';
        const grid = document.getElementById('continueLearningGrid');
        grid.innerHTML = '';

        recentlyWeek.slice(0, 3).forEach(subject => {
            const card = document.createElement('div');
            card.className = 'subject-card';
            card.innerHTML = `
                <h3>${subject.name}</h3>
                <p>${subject.code}</p>
                <div style="font-size: 12px; color: #666; margin: 10px 0;">Continue where you left off</div>
                <button onclick="window.location.href='subject.html?code=${subject.code}&name=${encodeURIComponent(subject.name)}&sem=${subject.semester}'" class="btn-primary" style="width: 100%;">
                    Resume
                </button>
            `;
            grid.appendChild(card);
        });
    }
}

// ============================================
// DOWNLOAD FUNCTIONALITY
// ============================================

function downloadContentItem(itemId) {
    const allContent = getAllContent();
    const item = allContent.find(c => c.id === itemId);

    if (!item) return;

    let text = `${item.title}\n`;
    text += `Subject: ${item.subject}\n`;
    text += `Type: ${item.type}\n`;
    text += `Description: ${item.description}\n\n`;
    text += item.content || item.link;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.title.replace(/\s+/g, '_')}.txt`;
    a.click();

    showToast('Content downloaded 📥', 'success');
}

// ============================================
// ITEM BOOKMARKING
// ============================================

function isItemBookmarked(itemId) {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarkedItems')) || [];
    return bookmarks.includes(itemId);
}

function toggleBookmarkItem(itemId) {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarkedItems')) || [];
    const index = bookmarks.indexOf(itemId);

    if (index > -1) {
        bookmarks.splice(index, 1);
    } else {
        bookmarks.push(itemId);
    }

    localStorage.setItem('bookmarkedItems', JSON.stringify(bookmarks));
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function extractYoutubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
}

function downloadContent() {
    showToast('Download started 📥', 'success');
}

function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// ============================================
// EXPORT/IMPORT FUNCTIONS (for admin)
// ============================================

function exportData() {
    const data = {
        content: getAllContent(),
        bookmarks: JSON.parse(localStorage.getItem('bookmarkedItems')) || [],
        completedSubjects: JSON.parse(localStorage.getItem('completedSubjects')) || [],
        bookmarkedSubjects: JSON.parse(localStorage.getItem('bookmarkedSubjects')) || []
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bca-studyhub-data.json';
    a.click();

    showToast('Data exported successfully 📥', 'success');
}

// ============================================
// ADMIN UTILITY FUNCTIONS
// ============================================

function getAllContent() {
    return JSON.parse(localStorage.getItem('bcaContent')) || [];
}

function saveContent(contentItem, editId = null) {
    let allContent = getAllContent();

    if (editId) {
        const index = allContent.findIndex(c => c.id === editId);
        if (index >= 0) {
            allContent[index] = { ...allContent[index], ...contentItem };
        }
    } else {
        allContent.push(contentItem);
    }

    localStorage.setItem('bcaContent', JSON.stringify(allContent));
}

function deleteContentItem(id) {
    let allContent = getAllContent();
    allContent = allContent.filter(c => c.id !== id);
    localStorage.setItem('bcaContent', JSON.stringify(allContent));
}

function downloadContentItem(itemId) {
    const allContent = getAllContent();
    const item = allContent.find(c => c.id === itemId);

    if (!item) return;

    let text = `${item.title}\n`;
    text += `Subject: ${item.subject}\n`;
    text += `Type: ${item.type}\n`;
    text += `Description: ${item.description}\n\n`;
    text += item.content || item.link;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.title.replace(/\s+/g, '_')}.txt`;
    a.click();

    showToast('Content downloaded 📥', 'success');
}

// ============================================
// PAGE PROGRESS BAR
// ============================================

window.addEventListener('scroll', () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.pageYOffset;
    const scrollPercent = scrollHeight > 0 ? (scrolled / scrollHeight) * 100 : 0;
    
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.style.width = scrollPercent + '%';
    }
});

// ============================================
// INITIALIZE ON LOAD
// ============================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeData();
        initializeTheme();
    });
} else {
    initializeData();
    initializeTheme();
}
