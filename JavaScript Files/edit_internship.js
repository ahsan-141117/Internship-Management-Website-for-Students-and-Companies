document.addEventListener('DOMContentLoaded', async () => {
    const params       = new URLSearchParams(window.location.search);
    const internshipId = params.get('internship_id');
    if (!internshipId) {
        alert('No internship ID provided');
        window.location.href = '/my_internships.html';
        return;
    }
    document.getElementById('internship_id').value = internshipId;
    const res = await fetch('/edit_internship?internship_id=' + internshipId, {
        credentials: 'include'
    });
    if (!res.ok) {
        alert('Failed to load internship details');
        return;
    }
    const data = await res.json();
    document.getElementById('title').value       = data.title;
    document.getElementById('mode').value        = data.mode;
    document.getElementById('skills').value      = data.skills;
    document.getElementById('salary').value      = data.salary;
    document.getElementById('duration').value    = data.duration;
    document.getElementById('deadline').value    = data.deadline ? data.deadline.split('T')[0] : ''; // Fix: Extract date part
    document.getElementById('domain').value      = data.domain;
    document.getElementById('location').value    = data.location;
    document.getElementById('description').value = data.description;
});
const editBtn = document.getElementById('edit-btn');
let editing   = false;
editBtn.addEventListener('click', async () => {
    if (!editing) {
        // Enable fields
        ['title','mode','skills','salary','duration','deadline','domain','location','description']
            .forEach(id => document.getElementById(id).disabled = false);
        editBtn.textContent = 'Save Changes';
        editing = true;
    } else {
        const payload = {
            internship_id: document.getElementById('internship_id').value,
            title:         document.getElementById('title').value,
            mode:          document.getElementById('mode').value,
            skills:        document.getElementById('skills').value,
            salary:        Number(document.getElementById('salary').value),
            duration:      document.getElementById('duration').value,
            deadline:      document.getElementById('deadline').value ? document.getElementById('deadline').value.split('T')[0] : null, // Handle empty dates
            domain:        document.getElementById('domain').value,
            location:      document.getElementById('location').value,
            description:   document.getElementById('description').value
        };
        const res = await fetch('/edit_internship', {
            method:      'POST',
            headers:     { 'Content-Type': 'application/json' },
            body:        JSON.stringify(payload),
            credentials: 'include'
        });
        if (res.ok) {
            alert('Internship updated successfully');
            ['title','mode','skills','salary','duration','deadline','domain','location','description']
                .forEach(id => document.getElementById(id).disabled = true);
            editBtn.textContent = 'Edit';
            editing = false;
        } else {
            const err = await res.json();
            alert(err.error || 'Update failed');
        }
    }
});