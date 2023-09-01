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

//Script for counting number animation
const counters = document.querySelectorAll('.count');
const speed = 5; // Adjust the speed of counting (milliseconds per step)
const softwareCounter = counters[1]; // Select the Software counter

window.addEventListener('scroll', () => {
  counters.forEach((counter, index) => {
    const target = +counter.getAttribute('data-count');
    let currentCount = 0;
    let counterSpeed = speed;

    if (index === 1) {
      // Increase speed for Software counter
      counterSpeed = 1; // Adjust the speed for Software counter
      currentCount = 190;
    }

    const updateCount = () => {
      if (currentCount < target) {
        currentCount += 0.2;
        counter.innerText = currentCount.toFixed(1);
        setTimeout(updateCount, counterSpeed);
      } else {
        counter.innerText = target;
      }
    };

    updateCount();
  });
});

//Script for image Panels Active and deactive process

const panels = document.querySelectorAll('.panel');

panels.forEach((panel) => {
	panel.addEventListener('click', () => {
		removeActiveClasses();
		panel.classList.toggle('active');
	});
});

function removeActiveClasses() {
	panels.forEach((panel) => {
		panel.classList.remove('active');
	});
}

  // Function to open the lightbox with a specific image
  function openLightbox(imageUrl) {
    const lightbox = document.querySelector('.lightbox');
    const lightboxImage = document.getElementById('lightbox-image');

    lightboxImage.src = imageUrl;
    lightbox.style.display = 'block';
}

// Function to close the lightbox
function closeLightbox() {
    const lightbox = document.querySelector('.lightbox');
    lightbox.style.display = 'none';
}

// Add double-click event listeners to your image panels
const imagePanels = document.querySelectorAll('.panel'); // Use a different variable name here
imagePanels.forEach(panel => {
    panel.addEventListener('dblclick', function () {
        const backgroundImage = getComputedStyle(panel).backgroundImage;
        const imageUrl = backgroundImage.match(/url\(["']?([^"']*)["']?\)/)[1];
        openLightbox(imageUrl);
    });
});
