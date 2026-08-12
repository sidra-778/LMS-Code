/*=========================================
    LMS Dashboard JavaScript
==========================================*/

// ==============================
// Sidebar Toggle
// ==============================

const menuBtn = document.querySelector(".menu-btn");
const sidebar = document.querySelector(".sidebar");

menuBtn.addEventListener("click", () => {

    sidebar.classList.toggle("show");

});

// ==============================
// Language Switch
// ==============================

const enBtn = document.getElementById("enBtn");
const urBtn = document.getElementById("urBtn");

const body = document.body;

enBtn.addEventListener("click", () => {

    body.classList.remove("urdu");

    enBtn.classList.add("active");
    urBtn.classList.remove("active");

    document.documentElement.lang = "en";

});

urBtn.addEventListener("click", () => {

    body.classList.add("urdu");

    urBtn.classList.add("active");
    enBtn.classList.remove("active");

    document.documentElement.lang = "ur";

});

// ==============================
// Active Sidebar Item
// ==============================

const menuItems = document.querySelectorAll(".sidebar ul li");

menuItems.forEach(item => {

    item.addEventListener("click", () => {

        menuItems.forEach(i => {

            i.classList.remove("active");

        });

        item.classList.add("active");

    });

});

// ==============================
// Notification Click
// ==============================

const notification = document.querySelector(".notification");

notification.addEventListener("click", () => {

    alert("You have 3 new notifications.");

});

// ==============================
// Welcome Button
// ==============================

const browseBtn = document.querySelector(".welcome button");

browseBtn.addEventListener("click", () => {

    alert("Redirecting to Courses...");

});

// ==============================
// Card Hover Animation
// ==============================

const cards = document.querySelectorAll(".card");

cards.forEach(card => {

    card.addEventListener("mouseenter", () => {

        card.style.transform = "translateY(-8px)";
        card.style.transition = ".3s";

    });

    card.addEventListener("mouseleave", () => {

        card.style.transform = "translateY(0px)";

    });

});

// ==============================
// Course Card Hover
// ==============================

const courses = document.querySelectorAll(".course");

courses.forEach(course => {

    course.addEventListener("mouseenter", () => {

        course.style.transform = "translateY(-8px)";
        course.style.transition = ".3s";

    });

    course.addEventListener("mouseleave", () => {

        course.style.transform = "translateY(0px)";

    });

});

// ==============================
// Fake Progress Animation
// ==============================

const progressBars = document.querySelectorAll(".progress div");

window.addEventListener("load", () => {

    progressBars.forEach(bar => {

        const width = bar.style.width;

        bar.style.width = "0";

        setTimeout(() => {

            bar.style.width = width;
            bar.style.transition = "1.5s";

        }, 300);

    });

});

// ==============================
// Greeting According To Time
// ==============================

const heading = document.querySelector(".welcome h1");

const hour = new Date().getHours();

if(hour < 12){

    heading.innerHTML = `
    <span class="en">Good Morning ☀️</span>
    <span class="ur">صبح بخیر ☀️</span>
    `;

}
else if(hour < 18){

    heading.innerHTML = `
    <span class="en">Good Afternoon 🌤️</span>
    <span class="ur">دوپہر بخیر 🌤️</span>
    `;

}
else{

    heading.innerHTML = `
    <span class="en">Good Evening 🌙</span>
    <span class="ur">شام بخیر 🌙</span>
    `;

}

// ==============================
// Profile Click
// ==============================

const profile = document.querySelector(".profile");

profile.addEventListener("click", () => {

    alert("Profile page will open.");

});

// ==============================
// Smooth Scroll
// ==============================

document.querySelectorAll("a").forEach(anchor => {

    anchor.addEventListener("click", function(e){

        if(this.getAttribute("href") === "#"){

            e.preventDefault();

        }

    });

});

// ==============================
// Console Message
// ==============================

console.log("LMS Dashboard Loaded Successfully.");