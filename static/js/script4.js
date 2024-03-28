document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("registrationForm").addEventListener("submit", function(event) {
        // Get the values of name, email, username, password, and confirm password fields
        var name = document.getElementById("name").value.trim();
        var email = document.getElementById("email").value.trim();
        var username = document.getElementById("username").value.trim();
        var password = document.getElementById("password").value.trim();
        var confirmPassword = document.getElementById("confirmPassword").value.trim();

        // Check if the password is entered but confirm password is not
        if (password && !confirmPassword) {
            // If only password is entered, prompt user to enter confirm password and prevent form submission
            alert("Please enter confirm password");
            event.preventDefault();
            return;
        }

        // Check if confirm password is entered but password is not
        if (!password && confirmPassword) {
            // If only confirm password is entered, prompt user to enter password and prevent form submission
            alert("Please enter password");
            event.preventDefault();
            return;
        }

        // Check if both password and confirm password are entered but do not match
        if (password && confirmPassword && password !== confirmPassword) {
            // If passwords do not match, prompt user and prevent form submission
            alert("Passwords do not match");
            event.preventDefault();
            return;
        }
            return true;

    });
});