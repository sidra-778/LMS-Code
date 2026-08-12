// ================================
// Password Show / Hide
// ================================

const password = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", () => {

    if (password.type === "password") {

        password.type = "text";

        togglePassword.classList.remove("fa-eye");
        togglePassword.classList.add("fa-eye-slash");

    } else {

        password.type = "password";

        togglePassword.classList.remove("fa-eye-slash");
        togglePassword.classList.add("fa-eye");

    }

});

// ================================
// Language Switch
// ================================

const englishBtn = document.getElementById("englishBtn");
const urduBtn = document.getElementById("urduBtn");

// Main Text

const title = document.getElementById("title");
const titleUr = document.getElementById("titleUr");

const description = document.getElementById("description");
const descriptionUr = document.getElementById("descriptionUr");

const loginHeading = document.getElementById("loginHeading");
const loginHeadingUr = document.getElementById("loginHeadingUr");

const loginText = document.getElementById("loginText");
const loginTextUr = document.getElementById("loginTextUr");

// Labels

const englishTexts = document.querySelectorAll(".en");
const urduTexts = document.querySelectorAll(".ur");

const urduParagraphs = document.querySelectorAll(".urdu");

// Inputs

const emailInput = document.querySelector("input[type='email']");
const passwordInput = document.getElementById("password");

// ================================
// English Mode
// ================================

englishBtn.addEventListener("click", () => {

    englishBtn.classList.add("active");
    urduBtn.classList.remove("active");

    document.documentElement.lang = "en";
    document.body.style.direction = "ltr";

    title.style.display = "block";
    titleUr.style.display = "none";

    description.style.display = "block";
    descriptionUr.style.display = "none";

    loginHeading.style.display = "block";
    loginHeadingUr.style.display = "none";

    loginText.style.display = "block";
    loginTextUr.style.display = "none";

    englishTexts.forEach(item => {

        item.style.display = "inline";

    });

    urduTexts.forEach(item => {

        item.style.display = "none";

    });

    urduParagraphs.forEach(item => {

        item.style.display = "none";

    });

    emailInput.placeholder = "Enter your email";

    passwordInput.placeholder = "Enter your password";

});

// ================================
// Urdu Mode
// ================================

urduBtn.addEventListener("click", () => {

    urduBtn.classList.add("active");
    englishBtn.classList.remove("active");

    document.documentElement.lang = "ur";
    document.body.style.direction = "rtl";

    title.style.display = "none";
    titleUr.style.display = "block";

    description.style.display = "none";
    descriptionUr.style.display = "block";

    loginHeading.style.display = "none";
    loginHeadingUr.style.display = "block";

    loginText.style.display = "none";
    loginTextUr.style.display = "block";

    englishTexts.forEach(item => {

        item.style.display = "none";

    });

    urduTexts.forEach(item => {

        item.style.display = "inline";

    });

    urduParagraphs.forEach(item => {

        item.style.display = "block";

    });

    emailInput.placeholder = "اپنا ای میل درج کریں";

    passwordInput.placeholder = "اپنا پاس ورڈ درج کریں";

});

// ================================
// Form Validation
// ================================

const form = document.querySelector("form");

form.addEventListener("submit", function (e) {

    e.preventDefault();

    const email = emailInput.value.trim();
    const passwordValue = passwordInput.value.trim();

    if (email === "" || passwordValue === "") {

        if (document.documentElement.lang === "ur") {

            alert("براہ کرم تمام معلومات درج کریں۔");

        } else {

            alert("Please fill in all required fields.");

        }

        return;

    }

    if (document.documentElement.lang === "ur") {

        alert("لاگ ان کامیاب!");

    } else {

        alert("Login Successful!");

    }

});