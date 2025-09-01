document.addEventListener('DOMContentLoaded', async () =>
{
  // fetch current user data via session
  const res = await fetch('/manage_student_account', { credentials: 'include' });
  const { name, email } = await res.json();

  document.getElementById('name').value  = name;
  document.getElementById('email').value = email;
});

// Toggle edit/confirm
const editBtn = document.getElementById('edit-btn');
let editing = false;

editBtn.addEventListener('click', async () =>
{
  const nameField     = document.getElementById('name');
  const emailField    = document.getElementById('email');
  const passwordField = document.getElementById('password');

  if (!editing)
  {
    // enable fields
    nameField.disabled     = false;
    emailField.disabled    = false;
    passwordField.disabled = false;
    editBtn.textContent    = 'Confirm';
    editing                = true;
  }
  else
  {
    // collect values
    const payload = {
      name:     nameField.value,
      email:    emailField.value,
      password: passwordField.value
    };

    const res = await fetch('/manage_student_account', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',  // <-- Added here
      body:    JSON.stringify(payload)
    });

    if (res.ok)
    {
      // disable fields again
      nameField.disabled     = true;
      emailField.disabled    = true;
      passwordField.disabled = true;
      editBtn.textContent    = 'Edit';
      editing                = false;
    }
    else
    {
      const err = await res.json();
      alert(err.error || 'Update failed');
    }
  }
});
