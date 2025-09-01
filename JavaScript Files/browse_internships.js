// javascript/browse_internships.js

document.addEventListener('DOMContentLoaded', async () => {
    await performSearch();
});

const searchBtn = document.getElementById('search-btn');
searchBtn.addEventListener('click', async () => {
    await performSearch();
});

async function performSearch() {
    const keyword   = document.getElementById('keyword').value;
    const location  = document.getElementById('location').value;
    const domain    = document.getElementById('domain').value;
    const salaryMin = document.getElementById('salary_min').value;
    const salaryMax = document.getElementById('salary_max').value;
    const params    = new URLSearchParams();

    if (keyword)   params.append('keyword', keyword);
    if (location)  params.append('location', location);
    if (domain)    params.append('domain', domain);
    if (salaryMin) params.append('salary_min', salaryMin);
    if (salaryMax) params.append('salary_max', salaryMax);

    const res = await fetch('/browse_internships?' + params.toString(), {
        credentials: 'include'
    });
    if (!res.ok) {
        alert('Failed to load internships');
        return;
    }

    const results = await res.json();
    renderResults(results);
}

function renderResults(items) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'internship flex align-center gap-1';
        div.innerHTML = `
      <img src="${item.logo_path || '/asta-logo.svg'}" alt="${item.name} Logo" class="company-logo">
      <div>
        <h2>${item.title}</h2>
        <p><strong>Company:</strong> ${item.name}</p>
        <p><strong>Skills:</strong> ${item.skills}</p>
        <p><strong>Location:</strong> ${item.location}</p>
        <p><strong>Domain:</strong> ${item.domain}</p>
        <p><strong>Salary:</strong> ${item.salary}</p>
        <button onclick="window.location.href='/internship_details.html?internship_id=${item.internship_id}'">
          View Details
        </button>
      </div>
    `;
        resultsDiv.appendChild(div);
    });
}
