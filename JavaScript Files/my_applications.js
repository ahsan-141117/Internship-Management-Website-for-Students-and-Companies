document.addEventListener('DOMContentLoaded', async () => {
  const res = await fetch('/my_applications', {
    credentials: 'include'
  });
  if (!res.ok) {
    alert('Failed to load your applications');
    return;
  }

  const applications = await res.json();
  const tbody        = document.getElementById('applications-body');
  let rows           = '';

  applications.forEach(app => {
    rows += `<tr>
      <td>${app.application_id}</td>
      <td>${app.title}</td>
      <td>${app.company}</td>
      <td>${app.status}</td>
    </tr>`;
  });

  tbody.innerHTML = rows;
});
