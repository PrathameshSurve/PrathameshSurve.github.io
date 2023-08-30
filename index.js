function isValidGmail(email) {
    // Regular expression to match a Gmail address
    const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailPattern.test(email);
}

function sendMail() {
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var message = document.getElementById("message").value;

    if (name.trim() === "" || message.trim() === "") {
        showEmptyFields();
        return;
    }

    if (!isValidGmail(email)) {
        showValidMail();
        return;
    }

    var params = {
        name: name,
        email: email,
        message: message,
    };

    const serviceID = "service_cyotcw4";
    const templateID = "template_lah4eg7";

    emailjs.send(serviceID, templateID, params)
        .then(res => {
            document.getElementById("name").value = "";
            document.getElementById("email").value = "";
            document.getElementById("message").value = "";
            showConfirmation(); // Display message send successfully.
        })
        .catch(err => console.log(err));
}

function showConfirmation() {
    document.getElementById("submitButton").style.display = "none"; // Hide the submit button
    document.getElementById("confirmation").style.display = "block"; // Show the confirmation message

    // Hide the mail sent confirmation message after 10 seconds (5000 milliseconds)
    setTimeout(function() {
        document.getElementById("confirmation").style.display = "none";
        document.getElementById("submitButton").style.display = "block"; // Show the submit button again
    }, 10000);
}

function showValidMail() {
    document.getElementById("submitButton").style.display = "none"; // Hide the submit button
    document.getElementById("showValidMail").style.display = "block"; // Show the invalid mail Id message

    // Hide the invalid email message after 6 seconds (5000 milliseconds)
    setTimeout(function() {
        document.getElementById("showValidMail").style.display = "none";
        document.getElementById("submitButton").style.display = "block"; // Show the submit button again
    }, 6000);
}

function showEmptyFields() {
    document.getElementById("submitButton").style.display = "none"; // Hide the submit button
    document.getElementById("showEmptyFields").style.display = "block"; // Show the empty fields message

    // Hide the empty fields message after 6 seconds (5000 milliseconds)
    setTimeout(function() {
        document.getElementById("showEmptyFields").style.display = "none";
        document.getElementById("submitButton").style.display = "block"; // Show the submit button again
    }, 6000);
}
