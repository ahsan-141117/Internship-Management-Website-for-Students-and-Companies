// javascript/internship_details.js

const params       = new URLSearchParams(window.location.search);
const internshipId = params.get('internship_id');

document.addEventListener('DOMContentLoaded', async () => {
    if (!internshipId) {
        alert('No internship ID provided');
        window.location.href = '/browse_internships.html';
        return;
    }
    
    const res = await fetch('/internship_details?internship_id=' + internshipId, {
        credentials: 'include'
    });
    
    if (!res.ok) {
        alert('Failed to load internship details');
        return;
    }
    
    const data = await res.json();
    
    // Populate company logo or fallback to ASTA logo
    const logoEl = document.getElementById('company-logo');
    logoEl.src = data.logo_path || '/asta-logo.svg';
    logoEl.alt = data.company_name + ' Logo';

    document.getElementById('title').textContent        = data.title;
    document.getElementById('company-name').textContent = data.company_name;
    document.getElementById('location').textContent     = data.location;
    document.getElementById('mode').textContent         = data.mode;
    document.getElementById('domain').textContent       = data.domain;
    document.getElementById('skills').textContent       = Array.isArray(data.skills)
                                                        ? data.skills.join(', ')
                                                        : data.skills;
    document.getElementById('salary').textContent       = data.salary;
    document.getElementById('duration').textContent     = data.duration;
    document.getElementById('deadline').textContent     = data.deadline || 'Not specified';
    document.getElementById('description').textContent  = data.description;
});

const applyBtn = document.getElementById('apply-btn');
applyBtn.addEventListener('click', () => {
    window.location.href = '/submit_application.html?internship_id=' + internshipId;
});
