document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('/student_dashboard', { credentials: 'include' });

        if (!response.ok) {
            throw new Error('Not authorized or error occurred');
        }

        const data = await response.json();
        document.getElementById('welcome-msg').textContent = 'Welcome ' + data.name;
    }
    catch (error) {
        window.location.href = '/login.html';
    }

    document.getElementById('my-account-box').addEventListener('click', function() {
        window.location.href = '/manage_student_account.html';
    });
    document.getElementById('browse-internships-box').addEventListener('click', function() {
        window.location.href = '/browse_internships.html';
    });
    document.getElementById('my-applications-box').addEventListener('click', function() {
        window.location.href = '/my_applications.html';
    });
});
