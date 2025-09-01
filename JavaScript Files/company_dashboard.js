document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('/company_dashboard', { credentials: 'include' });
        if (!response.ok) {
            throw new Error('Not authorized or error occurred');
        }

        const data = await response.json();
        document.getElementById('welcome-msg').textContent = 'Welcome ' + data.name;
    }
    catch (error) {
        window.location.href = '/login.html';
    }

    document.getElementById('my-company-account-box').addEventListener('click', function() {
        window.location.href = '/manage_company_account.html';
    });
    document.getElementById('my-internships-box').addEventListener('click', function() {
        window.location.href = '/my_internships.html';
    });
    document.getElementById('create-internship-box').addEventListener('click', function() {
        window.location.href = '/create_internship.html';
    });
    document.getElementById('received-applications-box').addEventListener('click', function() {
        window.location.href = '/received_applications.html';
    });
});
