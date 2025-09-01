document.addEventListener('DOMContentLoaded', () => {
  const createBtn = document.getElementById('create-btn');
  createBtn.addEventListener('click', async () => {
    const title       = document.getElementById('title').value;
    const mode        = document.getElementById('mode').value;
    const skills      = document.getElementById('skills').value;
    const salary      = Number(document.getElementById('salary').value);
    const duration    = document.getElementById('duration').value;
    const deadline    = document.getElementById('deadline').value;
    const domain      = document.getElementById('domain').value;
    const location    = document.getElementById('location').value;
    const description = document.getElementById('description').value;
    const payload     = {
      title,
      mode,
      skills,
      salary,
      duration,
      deadline,
      domain,
      location,
      description
    };
    const res = await fetch('/create_internship', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',  // <---- Added here
      body:    JSON.stringify(payload)
    });
    if (res.ok) {
      await res.json();
      alert('Internship created successfully');
      window.location.href = '/company_dashboard.html';
    } else {
      const err = await res.json();
      alert(err.error || 'Creation failed');
    }
  });
});
