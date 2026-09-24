import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


// ===============================
// FIREBASE CONFIG
// ===============================

const firebaseConfig = {
    apiKey: "AIzaSyA9jASXFkIHzuDM3yXLM7nItVmlxAFQGWs",
    authDomain: "jlove-88897.firebaseapp.com",
    projectId: "jlove-88897",
    storageBucket: "jlove-88897.firebasestorage.app",
    messagingSenderId: "977214027902",
    appId: "1:977214027902:web:9ea0d3a891d9db4da3002f",
    measurementId: "G-H4MS9EJKVM"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// ===============================
// ELEMENTS
// ===============================

const homePage = document.getElementById("homePage");
const congratsPage = document.getElementById("congratsPage");
const lovePage = document.getElementById("lovePage");

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

const loveBtn = document.getElementById("loveBtn");
const meetBtn = document.getElementById("meetBtn");

const dateModal = document.getElementById("dateModal");
const closeModal = document.getElementById("closeModal");

const dateForm = document.getElementById("dateForm");

const bgMusic = document.getElementById("bgMusic");

const successMessage = document.getElementById("successMessage");
const successClose = document.getElementById("successClose");


// ===============================
// NO BUTTON
// ===============================

function moveNoButton() {

    const width = noBtn.offsetWidth;
    const height = noBtn.offsetHeight;

    const maxX = window.innerWidth - width - 15;
    const maxY = window.innerHeight - height - 15;

    const x = Math.random() * Math.max(maxX, 10);
    const y = Math.random() * Math.max(maxY, 10);

    noBtn.style.position = "fixed";
    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;
    noBtn.style.zIndex = "9999";

    noBtn.animate(
        [
            {
                transform: "scale(.6) rotate(-15deg)"
            },
            {
                transform: "scale(1.15) rotate(10deg)"
            },
            {
                transform: "scale(1) rotate(0)"
            }
        ],
        {
            duration: 350,
            easing: "ease-out"
        }
    );
}

noBtn.addEventListener("mouseenter", moveNoButton);

noBtn.addEventListener(
    "touchstart",
    function (event) {
        event.preventDefault();
        moveNoButton();
    },
    {
        passive: false
    }
);

noBtn.addEventListener(
    "click",
    function (event) {
        event.preventDefault();
        moveNoButton();
    }
);


// ===============================
// YES BUTTON
// ===============================

yesBtn.addEventListener("click", async function () {

    try {
        bgMusic.volume = 0.35;
        await bgMusic.play();
    } catch (error) {
        console.log("Music error:", error);
    }

    homePage.classList.remove("active");

    setTimeout(function () {

        congratsPage.classList.add("active");

        createHeartBurst();

    }, 250);

});


// ===============================
// LOVE BUTTON
// ===============================

loveBtn.addEventListener("click", function () {

    congratsPage.classList.remove("active");

    setTimeout(function () {

        lovePage.classList.add("active");

    }, 250);

});


// ===============================
// OPEN MODAL
// ===============================

meetBtn.addEventListener("click", function () {

    dateModal.classList.add("show");

});


// ===============================
// CLOSE MODAL
// ===============================

closeModal.addEventListener("click", function () {

    dateModal.classList.remove("show");

});

dateModal.addEventListener("click", function (event) {

    if (event.target === dateModal) {

        dateModal.classList.remove("show");

    }

});


// ======================================================
// BOOK DATE → FIREBASE
// ======================================================

dateForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const bookBtn = document.getElementById("bookBtn");

    const name = document.getElementById("name").value.trim();
    const place = document.getElementById("place").value.trim();
    const flower = document.getElementById("flower").value.trim();
    const food = document.getElementById("food").value.trim();
    const date = document.getElementById("date").value;

    if (!name || !place || !flower || !food || !date) {

        alert("সবগুলো তথ্য পূরণ করো ❤️");
        return;

    }


    const message = `💌 NEW DATE REQUEST

👤 Name: ${name}

📍 Place: ${place}

🌹 Flower: ${flower}

🍕 Food: ${food}

📅 Date: ${date}

❤️ Booked with: U.b. Riju`;


    bookBtn.disabled = true;
    bookBtn.textContent = "Saving... ❤️";


    try {

        console.log("Firebase save শুরু...");


        // ===============================
        // SAVE TO FIREBASE
        // ===============================

        const docRef = await addDoc(
            collection(db, "dateBookings"),
            {
                name: name,
                place: place,
                flower: flower,
                food: food,
                date: date,
                message: message,
                createdAt: serverTimestamp(),
                status: "new"
            }
        );


        console.log("Firebase SUCCESS!");
        console.log("Document ID:", docRef.id);


        // ===============================
        // COPY MESSAGE
        // ===============================

        try {

            await navigator.clipboard.writeText(message);

            console.log("Message copied!");

        } catch (copyError) {

            console.log("Clipboard failed:", copyError);

        }


        // ===============================
        // CLOSE MODAL
        // ===============================

        dateModal.classList.remove("show");


        // ===============================
        // SUCCESS MESSAGE
        // ===============================

        successMessage.classList.add("show");


        // ===============================
        // OPEN FACEBOOK
        // ===============================

        setTimeout(function () {

            window.open(
                "https://https://www.facebook.com/",
                "_blank"
            );

        }, 1000);


        // ===============================
        // RESET FORM
        // ===============================

        dateForm.reset();


    } catch (error) {

        console.error("FIREBASE ERROR:", error);

        alert(
            "Firebase-এ data save হয়নি। Browser Console খুলে FIREBASE ERROR দেখো।"
        );

    }


    bookBtn.disabled = false;

    bookBtn.textContent =
        "💌 Book Date With Your Love (Riju)";

});


// ===============================
// SUCCESS CLOSE
// ===============================

successClose.addEventListener("click", function () {

    successMessage.classList.remove("show");

});


// ===============================
// FLOATING HEARTS
// ===============================

function createHeart() {

    const heart = document.createElement("span");

    const icons = [
        "❤️",
        "💗",
        "💖",
        "💕",
        "💘"
    ];

    heart.textContent =
        icons[Math.floor(Math.random() * icons.length)];

    heart.style.left =
        Math.random() * 100 + "vw";

    heart.style.fontSize =
        12 + Math.random() * 25 + "px";

    heart.style.animationDuration =
        5 + Math.random() * 7 + "s";

    document
        .getElementById("hearts")
        .appendChild(heart);

    setTimeout(function () {

        heart.remove();

    }, 13000);

}

setInterval(createHeart, 600);


// ===============================
// HEART BURST
// ===============================

function createHeartBurst() {

    for (let i = 0; i < 30; i++) {

        setTimeout(
            createHeart,
            i * 60
        );

    }

}
