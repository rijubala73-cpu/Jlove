import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    getFirestore,
    collection,
    query,
    orderBy,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


// =====================================================
// FIREBASE CONFIG
// SAME CONFIG AS script.js
// =====================================================

const firebaseConfig = {
  apiKey: "AIzaSyA9jASXFkIHzuDM3yXLM7nItVmlxAFQGWs",
    
  authDomain: "jlove-88897.firebaseapp.com",
    
  projectId: "jlove-88897",
    
  storageBucket: "jlove-88897.firebasestorage.app",
    
  messagingSenderId: "977214027902",
    
  appId: "1:977214027902:web:9ea0d3a891d9db4da3002f",
    
  measurementId: "G-H4MS9EJKVM"
};


const app =
    initializeApp(firebaseConfig);


const auth =
    getAuth(app);


const db =
    getFirestore(app);


// =====================================================
// ELEMENTS
// =====================================================

const loginPage =
    document.getElementById(
        "loginPage"
    );


const adminPage =
    document.getElementById(
        "adminPage"
    );


const loginForm =
    document.getElementById(
        "loginForm"
    );


const loginError =
    document.getElementById(
        "loginError"
    );


const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


const bookingList =
    document.getElementById(
        "bookingList"
    );


const totalBookings =
    document.getElementById(
        "totalBookings"
    );


const newBookings =
    document.getElementById(
        "newBookings"
    );


// =====================================================
// LOGIN
// =====================================================

loginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const email =
            document
                .getElementById(
                    "adminEmail"
                )
                .value
                .trim();


        const password =
            document
                .getElementById(
                    "adminPassword"
                )
                .value;


        loginError.textContent =
            "Logging in...";


        try {

            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            loginError.textContent =
                "";

        } catch (error) {

            console.error(error);

            loginError.textContent =
                "Invalid email or password.";

        }

    }
);


// =====================================================
// AUTH STATE
// =====================================================

onAuthStateChanged(
    auth,
    function (user) {

        if (user) {

            loginPage.classList.add(
                "hidden"
            );

            adminPage.classList.remove(
                "hidden"
            );

            loadBookings();

        } else {

            loginPage.classList.remove(
                "hidden"
            );

            adminPage.classList.add(
                "hidden"
            );

        }

    }
);


// =====================================================
// LOGOUT
// =====================================================

logoutBtn.addEventListener(
    "click",
    async function () {

        await signOut(auth);

    }
);


// =====================================================
// LOAD BOOKINGS
// =====================================================

function loadBookings() {

    const bookingsQuery =
        query(
            collection(
                db,
                "dateBookings"
            ),
            orderBy(
                "createdAt",
                "desc"
            )
        );


    onSnapshot(
        bookingsQuery,
        function (snapshot) {

            bookingList.innerHTML =
                "";


            totalBookings.textContent =
                snapshot.size;


            let newCount =
                0;


            if (
                snapshot.empty
            ) {

                bookingList.innerHTML = `

                    <div class="loading">

                        No bookings yet ❤️

                    </div>

                `;

                newBookings.textContent =
                    "0";

                return;

            }


            snapshot.forEach(
                function (doc) {

                    const data =
                        doc.data();


                    if (
                        data.status ===
                        "new"
                    ) {

                        newCount++;

                    }


                    const card =
                        document.createElement(
                            "div"
                        );


                    card.className =
                        "booking-card";


                    const createdDate =
                        data.createdAt
                            ?.toDate
                            ? data.createdAt
                                .toDate()
                                .toLocaleString()
                            : "Just now";


                    card.innerHTML = `

                        <div class="booking-top">

                            <h2>
                                💌 ${escapeHTML(data.name)}
                            </h2>

                            ${
                                data.status === "new"
                                ?
                                '<span class="new-badge">NEW</span>'
                                :
                                ""
                            }

                        </div>


                        <div class="booking-info">


                            <div class="info">

                                <span>
                                    📍 PLACE
                                </span>

                                <strong>
                                    ${escapeHTML(data.place)}
                                </strong>

                            </div>


                            <div class="info">

                                <span>
                                    🌹 FLOWER
                                </span>

                                <strong>
                                    ${escapeHTML(data.flower)}
                                </strong>

                            </div>


                            <div class="info">

                                <span>
                                    🍕 FOOD
                                </span>

                                <strong>
                                    ${escapeHTML(data.food)}
                                </strong>

                            </div>


                            <div class="info">

                                <span>
                                    📅 DATE
                                </span>

                                <strong>
                                    ${escapeHTML(data.date)}
                                </strong>

                            </div>


                        </div>


                        <div class="booking-time">

                            Received:
                            ${createdDate}

                        </div>

                    `;


                    bookingList.appendChild(
                        card
                    );

                }
            );


            newBookings.textContent =
                newCount;

        },
        function (error) {

            console.error(
                "Booking loading error:",
                error
            );


            bookingList.innerHTML = `

                <div class="loading">

                    Unable to load bookings.

                </div>

            `;

        }
    );

}


// =====================================================
// SECURITY: ESCAPE HTML
// =====================================================

function escapeHTML(value) {

    if (!value) {
        return "";
    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}
