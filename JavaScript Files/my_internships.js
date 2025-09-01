document.addEventListener('DOMContentLoaded', async () => {
  const res = await fetch('/my_internships', { credentials: 'include' });
  if (!res.ok) {
    alert('Failed to load your internships');
    return;
  }

  const internships = await res.json();
  const container   = document.getElementById('internships-list');
  container.innerHTML = '';

  internships.forEach(item => {
    const card = document.createElement('div');
    card.className = 'internship-card';
    card.dataset.id = item.internship_id;
    card.innerHTML = `
      <h2>${item.title}</h2>
      <p><strong>Mode:</strong> ${item.mode}</p>
      <p><strong>Skills:</strong> ${item.skills}</p>
      <p><strong>Salary:</strong> ${item.salary}</p>
      <p><strong>Duration:</strong> ${item.duration}</p>
      <p><strong>Deadline:</strong> ${item.deadline}</p>
      <p><strong>Domain:</strong> ${item.domain}</p>
      <p><strong>Location:</strong> ${item.location}</p>
      <p><strong>Description:</strong> ${item.description}</p>
      <button class="edit-btn">Edit</button>
      <button class="delete-btn">Delete</button>
    `;
    container.appendChild(card);
  });
});

document.getElementById('internships-list').addEventListener('click', async e => {
  const card = e.target.closest('.internship-card');
  if (!card) return;

  const id = card.dataset.id;
  if (e.target.matches('.edit-btn')) {
    window.location.href = `/edit_internship.html?internship_id=${id}`;
  }
  else if (e.target.matches('.delete-btn')) {
    if (!confirm('Are you sure you want to delete this internship?')) return;
    const res = await fetch(`/delete_internship?internship_id=${id}`, {
      credentials: 'include'
    });
    if (res.ok) {
      card.remove();
      alert('Internship deleted');
    } else {
      const err = await res.json();
      alert(err.error || 'Deletion failed');
    }
  }
});
