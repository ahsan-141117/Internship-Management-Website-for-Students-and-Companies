document.addEventListener('DOMContentLoaded', async () => {
  // grab internship_id from URL and set hidden field
  const params       = new URLSearchParams(window.location.search);
  const internshipId = params.get('internship_id');
  document.getElementById('internship_id').value = internshipId;
});

const form = document.getElementById('submit-application-form');
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // ensure a resume file is selected
  const fileInput = document.getElementById('resume');
  if (!fileInput.files.length) {
    alert('Please select a resume file before submitting.');
    return;
  }

  // build form data (including file and hidden internship_id)
  const formData = new FormData(form);

  // send with session cookie
  const res = await fetch('/submit_application', {
    method:      'POST',
    body:        formData,
    credentials: 'include'
  });

  if (res.ok) {
    alert('Application submitted successfully');
    window.location.href = '/student_dashboard.html';
  } else {
    const err = await res.json();
    alert(err.error || 'Submission failed');
  }
});
