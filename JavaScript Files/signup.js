document.addEventListener("DOMContentLoaded", function() {
    const userType  = document.getElementById('userType');
    const logoField = document.getElementById('logoField');
    const logoInput = document.getElementById('logo');
    const form      = document.getElementById('signupForm');

    function toggleLogoField() {
        if (userType.value === 'Company') {
            logoField.style.display = '';
            logoInput.required      = true;
        } else {
            logoField.style.display = 'none';
            logoInput.required      = false;
            logoInput.value         = '';
        }
    }

    userType.addEventListener('change', toggleLogoField);
    toggleLogoField();

    form.addEventListener("submit", async function(e) {
        e.preventDefault();

        const type     = userType.value.trim();
        const name     = document.getElementById('name').value.trim();
        const email    = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        try {
            let res;
            if (type === 'Company') {
                // For companies, send multipart/form-data (includes logo file)
                const formData = new FormData(form);
                formData.set('userType', type);
                formData.set('name', name);
                formData.set('email', email);
                formData.set('password', password);

                res = await fetch('/signup', {
                    method: 'POST',
                    body: formData
                });
            } else {
                // For students, send JSON - no file upload
                const payload = {
                    userType: type,
                    name: name,
                    email: email,
                    password: password
                };

                res = await fetch('/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }

            if (res.ok) {
                alert('Signup successful! Redirecting to login…');
                window.location.href = '/login.html';
            } else {
                const result = await res.json();
                alert(result.error || 'Signup failed. Please try again.');
            }
        } catch (err) {
            console.error('Network error:', err);
            alert('Unable to reach server. Check your connection and try again.');
        }
    });
});
