// javascript/received_applications.js

document.addEventListener('DOMContentLoaded', async () => {
    await loadApplications();
});

const searchBtn = document.getElementById('search-btn');
if (searchBtn) {
    searchBtn.addEventListener('click', async () => {
        await loadApplications();
    });
}

async function loadApplications() {
    const candidateName = document.getElementById('candidate_name')?.value.trim();
    const params = new URLSearchParams();
    if (candidateName) params.append('candidate_name', candidateName);

    const res = await fetch('/received_applications?' + params.toString(), { credentials: 'include' });
    if (!res.ok) {
        alert('Failed to load received applications');
        return;
    }

    const applications = await res.json();
    const tbody = document.getElementById('applications-body');
    tbody.innerHTML = '';

    applications.forEach(app => {
        const tr = document.createElement('tr');
        tr.dataset.id = app.application_id;
        tr.innerHTML = `
            <td>${app.applied_post}</td>
            <td>${app.student_name}</td>
            <td>${app.student_email}</td>
            <td><button class="download-btn">Download</button></td>
            <td>
              <button class="action-btn" data-action="accept">Accept</button>
              <button class="action-btn" data-action="reject">Reject</button>
              <button class="action-btn" data-action="shortlist">Shortlist</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Delegate download and action buttons
document.getElementById('applications-body').addEventListener('click', async e => {
    const tr = e.target.closest('tr');
    if (!tr) return;

    const id = tr.dataset.id;
    if (e.target.matches('.download-btn')) {
        window.location.href = `/download_resume?application_id=${id}`;
    }
    else if (e.target.matches('.action-btn')) {
        const action = e.target.dataset.action;
        if (!confirm(`Are you sure you want to ${action} this application?`)) return;

        const res = await fetch(
            `/action_application?application_id=${id}&action=${action}`,
            { credentials: 'include' }
        );
        if (res.ok) {
            const { message } = await res.json();
            alert(message);
            tr.remove();
        } else {
            const err = await res.json();
            alert(err.error || 'Action failed');
        }
    }
});
