// --- NAVIGATION & MENU ---
function toggleMenu() {
    const nav = document.getElementById("sideNav");
    const overlay = document.getElementById("overlay");
    const btnIcon = document.querySelector("#menuBtn i");

    nav.classList.toggle("nav-active");
    overlay.classList.toggle("show");

    if (nav.classList.contains("nav-active")) {
        btnIcon.classList.remove("fa-bars");
        btnIcon.classList.add("fa-times");
    } else {
        btnIcon.classList.remove("fa-times");
        btnIcon.classList.add("fa-bars");
    }
}

// Close menu when a link is clicked
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
        const nav = document.getElementById("sideNav");
        if(nav.classList.contains("nav-active")) {
            toggleMenu();
        }
    });
});

// --- OPEN INVITATION & MUSIC ---
const openBtn = document.getElementById("openBtn");
const invitationOverlay = document.getElementById("invitationOverlay");
const music = document.getElementById("weddingMusic");
const musicBtn = document.getElementById("musicToggle");

if (openBtn) {
    openBtn.addEventListener("click", () => {
        invitationOverlay.style.opacity = "0";
        setTimeout(() => {
            invitationOverlay.style.display = "none";
            document.getElementById("home").scrollIntoView({ behavior: "smooth" });
        }, 800);

        if (music) {
            music.play().catch(error => console.log("Autoplay prevented."));
            if (musicBtn) {
                const musicIcon = musicBtn.querySelector("i");
                musicIcon.classList.replace("fa-music", "fa-pause");
                musicBtn.classList.add("music-playing");
            }
        }
    });
}

if (musicBtn && music) {
    musicBtn.addEventListener("click", () => {
        const musicIcon = musicBtn.querySelector("i");
        if (music.paused) {
            music.play();
            musicIcon.classList.replace("fa-music", "fa-pause");
            musicBtn.classList.add("music-playing");
        } else {
            music.pause();
            musicIcon.classList.replace("fa-pause", "fa-music");
            musicBtn.classList.remove("music-playing");
        }
    });
}

// --- COUNTDOWN ---
const targetDate = new Date("May 13, 2026 09:00:00").getTime();
function updateCountdown() {
    const now = new Date().getTime();
    const diff = targetDate - now;
    const d = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
    const h = Math.max(0, Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    const m = Math.max(0, Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
    const s = Math.max(0, Math.floor((diff % (1000 * 60)) / 1000)); 
    
    document.getElementById("days").innerText = d < 10 ? "0" + d : d;
    document.getElementById("hours").innerText = h < 10 ? "0" + h : h;
    document.getElementById("mins").innerText = m < 10 ? "0" + m : m;
    document.getElementById("secs").innerText = s < 10 ? "0" + s : s;
}
setInterval(updateCountdown, 1000);
updateCountdown();

// --- SLIDER ---
let idx = 0;
function moveSlide(n) {
    const slides = document.querySelectorAll("#slider img");
    slides[idx].classList.remove("active");
    idx = (idx + n + slides.length) % slides.length;
    slides[idx].classList.add("active");
}

// --- RSVP LOGIC ---
// --- UPDATED RSVP LOGIC ---
const rsvpForm = document.getElementById("rsvpForm");
if (rsvpForm) {
    rsvpForm.onsubmit = function(e) {
        e.preventDefault();
        const btn = document.getElementById("submitBtn");
        const name = document.getElementById("guestName").value;
        const status = document.getElementById("status").value;
        const formContainer = document.getElementById("rsvpFormContainer");
        const fullMessage = document.getElementById("rsvpFullMessage");
        
        const scriptURL = "https://script.google.com/macros/s/AKfycbxn5qLQE9_bBFlHQ2WYfLVfaMZPEzgqSLQLK25LhyyXFuoaPYHv2gHx87bNqfSUsY17/exec"; 

        btn.innerText = "⌛ Sending...";
        btn.disabled = true;

        // Use URLSearchParams for better compatibility with Google Apps Script
        const formData = new URLSearchParams();
        formData.append("GuestName", name);
        formData.append("Attendance", status);

        fetch(scriptURL, { 
            method: "POST", 
            body: formData,
            mode: "no-cors" // Adding no-cors can help with some Google Script redirections
        })
        .then(() => {
            // Since "no-cors" doesn't return the JSON body, we handle the UI update here
            // To be safe for all mobile browsers, we show a generic success 
            // unless you have a specific way to check capacity without CORS issues.
            
            formContainer.innerHTML = `
                <div style="padding: 20px; color: var(--deep-teal); font-weight: 600;">
                    <i class="fas fa-check-circle" style="font-size: 2rem; color: #23807e;"></i><br><br>
                    Thank you, ${name}!<br>Your RSVP has been sent.
                </div>`;
        })
        .catch(error => {
            console.error('Error!', error.message);
            btn.innerText = "Error! Try Again";
            btn.disabled = false;
        });
    };
}