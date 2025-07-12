const NAV_BAR = document.getElementById('navBar');
const NAV_LIST = document.getElementById('navList');
const HERO_HEADER = document.getElementById('heroHeader');
const HAMBURGER_BTN = document.getElementById('hamburgerBtn');
const NAV_LINKS = Array.from( document.querySelectorAll('.nav__list-link'));
const SERVICE_BOXES = document.querySelectorAll('.service-card__box');
const ACTIVE_LINK_CLASS = 'active';
const BREAKPOINT = 576;

let currentServiceBG = null;
let currentActiveLink = document.querySelector('.nav__list-link.active');

// Remove the active state once the breakpoint is reached
const resetActiveState = ()=>{
  NAV_LIST.classList.remove('nav--active');
  Object.assign(NAV_LIST.style, {
    height: null
  });
  Object.assign(document.body.style, {
    overflowY: null
  });
}

//Add padding to the header to make it visible because navbar has a fixed position.
const addPaddingToHeroHeaderFn = () => {
  const NAV_BAR_HEIGHT = NAV_BAR.getBoundingClientRect().height;
  const HEIGHT_IN_REM = NAV_BAR_HEIGHT / 10;

  // If hamburger button is active, do not add padding
  if (NAV_LIST.classList.contains('nav--active')) {
    return;
  }
  Object.assign(HERO_HEADER.style, {
    paddingTop: HEIGHT_IN_REM + 'rem'
  });
}
addPaddingToHeroHeaderFn();
window.addEventListener('resize', ()=>{
  addPaddingToHeroHeaderFn();

  // When the navbar is active and the window is being resized, remove the active state once the breakpoint is reached
  if(window.innerWidth >= BREAKPOINT){
    addPaddingToHeroHeaderFn();
    resetActiveState();
  }
});

// As the user scrolls, the active link should change based on the section currently displayed on the screen.
window.addEventListener('scroll', ()=>{
  const sections = document.querySelectorAll('#heroHeader, #services, #works, #projects, #creativity, #contact, #about');

  // Loop through sections and check if they are visible
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const NAV_BAR_HEIGHT = NAV_BAR.getBoundingClientRect().height;
    if (window.scrollY >= sectionTop - NAV_BAR_HEIGHT) {
      const ID = section.getAttribute('id');
      const LINK = NAV_LINKS.filter(link => {
        return link.href.includes('#'+ID);
      })[0];
    //   console.log(LINK);
      currentActiveLink.classList.remove(ACTIVE_LINK_CLASS);
      LINK.classList.add(ACTIVE_LINK_CLASS);
      currentActiveLink = LINK;
    }
  });
});

// Shows & hide navbar on smaller screen
HAMBURGER_BTN.addEventListener('click', ()=>{
  NAV_LIST.classList.toggle('nav--active');
  if (NAV_LIST.classList.contains('nav--active')) {
    Object.assign(document.body.style, {
      overflowY: 'hidden'
    });
    Object.assign(NAV_LIST.style, {
      height: '100vh'
    });
    return;
  }
  Object.assign(NAV_LIST.style, {
    height: 0
  });
  Object.assign(document.body.style, {
    overflowY: null
  });
});

// When navbar link is clicked, reset the active state
NAV_LINKS.forEach(link => {
  link.addEventListener('click', ()=>{
    resetActiveState();
    link.blur();
  })
})

// Handles the hover animation on services section
SERVICE_BOXES.forEach(service => {
  const moveBG = (x, y) => {
    Object.assign(currentServiceBG.style, {
      left: x + 'px',
      top: y + 'px',
    })
  }
  service.addEventListener('mouseenter', (e) => {
    if (currentServiceBG === null) {
      currentServiceBG = service.querySelector('.service-card__bg');
    }
    moveBG(e.clientX, e.clientY);
  });
  service.addEventListener('mousemove', (e) => {
    const LEFT = e.clientX - service.getBoundingClientRect().left;
    const TOP = e.clientY - service.getBoundingClientRect().top;
    moveBG(LEFT, TOP);
  });
  service.addEventListener('mouseleave', () => {
    const IMG_POS = service.querySelector('.service-card__illustration')
    const LEFT = IMG_POS.offsetLeft + currentServiceBG.getBoundingClientRect().width;
    const TOP = IMG_POS.offsetTop + currentServiceBG.getBoundingClientRect().height;

    moveBG(LEFT, TOP);
    currentServiceBG = null;
  });
});

// Handles smooth scrolling
new SweetScroll({
  trigger: '.nav__list-link',
  easing: 'easeOutQuint',
  offset: NAV_BAR.getBoundingClientRect().height - 80
});

// Modal Image Gallery
function onClick(element) {
    document.getElementById("img01").src = element.src;
    document.getElementById("modal01").style.display = "block";
    var captionText = document.getElementById("caption");
    captionText.innerHTML = element.alt;
}

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

    const serviceID = "service_re41wdm";
    const templateID = "template_h5rrguw";

    emailjs.send(serviceID, templateID, params)
    .then(res => {
        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        document.getElementById("message").value = "";
        showConfirmation(); // Display message send successfully.
    })
    .catch(err => console.log(err));
}

function showEmptyFields() {
    document.getElementById("submitButton").style.display = "none"; // Hide the submit button
    document.getElementById("showEmptyFields").style.display = "block"; // Show the empty fields message

    // Hide the empty fields message after 6 seconds (5000 milliseconds)
    setTimeout(function() {
        document.getElementById("showEmptyFields").style.display = "none";
        document.getElementById("submitButton").style.display = "block"; // Show the submit button again
    }, 4000);
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

function isValidGmail(email) {
    // Regular expression to match a Gmail address
    const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailPattern.test(email);
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
