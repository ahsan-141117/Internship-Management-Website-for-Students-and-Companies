document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("loginForm");

  form.addEventListener("submit", async function(e) {
    e.preventDefault();

    const userType = document.getElementById("userType").value;   // "Student" or "Company"
    const email    = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      const res = await fetch("/login", {
  method:  "POST",
  headers: { "Content-Type": "application/json" },
  credentials: 'include',   // <---- Add this line
  body:    JSON.stringify({ userType, email, password })
});


      const result = await res.json();

      if (res.ok) {
        // Redirect to role-specific dashboard
        if (userType === "Student") {
          window.location.href = "student_dashboard.html";
        }
        else {
          window.location.href = "company_dashboard.html";
        }
      }
      else if (res.status === 401) {
        alert(result.error || "Invalid email or password.");
      }
      else {
        alert(result.error || "Login failed. Please try again.");
      }
    }
    catch (err) {
      console.error("Network error:", err);
      alert("Unable to reach server. Check your connection and try again.");
    }
  });
});
