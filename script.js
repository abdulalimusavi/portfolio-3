/* ── HAMBURGER MENU ─────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('menu');

function closeMenu() {
    hamburger.classList.remove('open');
    menu.classList.remove('open');
    document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    hamburger.classList.toggle('open');
    document.body.style.overflow = isOpen ? 'hidden' : '';
});

hamburger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') hamburger.click();
});

document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !menu.contains(e.target)) {
        closeMenu();
    }
});

/* ── DIGITAL RAIN / HACKER BACKGROUND ──────────── */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H;

function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+{}:<>?~";
const fontSize = Math.min(16, W / 60);
const columns = Math.floor(W / fontSize);
const drops = [];
for (let i = 0; i < columns; i++) {
    drops[i] = Math.random() * -100;
}

function drawRain() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, W, H);
    ctx.font = `${fontSize}px 'Courier New', monospace`;

    for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize + fontSize / 2;
        const y = drops[i] * fontSize;

        if (drops[i] > 0 && drops[i] < 10) {
            ctx.fillStyle = '#4ade80';
            ctx.shadowColor = '#4ade80';
            ctx.shadowBlur = 15;
        } else if (drops[i] > 10 && drops[i] < 20) {
            ctx.fillStyle = '#22c55e';
            ctx.shadowColor = '#22c55e';
            ctx.shadowBlur = 8;
        } else {
            const opacity = Math.max(0, 0.3 - (drops[i] - 20) * 0.01);
            ctx.fillStyle = `rgba(34, 197, 94, ${opacity})`;
            ctx.shadowBlur = 0;
        }

        ctx.fillText(char, x, y);

        if (drops[i] * fontSize > H && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i] += 0.5 + Math.random() * 0.3;
    }

    ctx.shadowBlur = 0;
    requestAnimationFrame(drawRain);
}
drawRain();

/* ── TYPING EFFECT ───────────────────────────────── */
const typedText = document.getElementById('typed-text');
const roles = ['Full Stack Developer', 'AI Expert', 'Web Developer', 'Problem Solver'];
let roleIndex = 0, charIndex = 0, isDeleting = false;

function typeEffect() {
    const currentRole = roles[roleIndex];
    if (isDeleting) {
        typedText.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typedText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        setTimeout(typeEffect, 1500);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typeEffect, 300);
    } else {
        setTimeout(typeEffect, isDeleting ? 50 : 100);
    }
}
typeEffect();

/* ── SCROLL FADE-IN ───────────────────────────────── */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.project-card, .skill-category').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const storyText = entry.target.querySelector('.story-text');
            const storyAuthor = entry.target.querySelector('.story-author');
            if (storyText) {
                storyText.style.animation = 'none';
                setTimeout(() => {
                    storyText.style.animation = 'storyReveal 1.2s ease 0.3s forwards';
                }, 10);
            }
            if (storyAuthor) {
                storyAuthor.style.animation = 'none';
                setTimeout(() => {
                    storyAuthor.style.animation = 'storyReveal 1s ease 0.8s forwards';
                }, 10);
            }
        }
    });
}, { threshold: 0.2 });

const storyContainer = document.querySelector('.story-container');
if (storyContainer) {
    aboutObserver.observe(storyContainer);
}

/* ── CONTACT FORM — Web3Forms ────────────────────── */
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !subject || !message) {
        formStatus.textContent = '⚠️ Please fill in all fields.';
        formStatus.style.color = '#f87171';
        return;
    }

    formStatus.textContent = '⏳ Sending...';
    formStatus.style.color = '#22c55e';

    const formData = new FormData(contactForm);

    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();

        if (result.success) {
            formStatus.textContent = '✅ Message sent successfully! I\'ll get back to you soon.';
            formStatus.style.color = '#4ade80';
            contactForm.reset();
        } else {
            formStatus.textContent = '❌ Something went wrong. Please try again.';
            formStatus.style.color = '#f87171';
        }
    } catch (error) {
        formStatus.textContent = '❌ Network error. Please check your connection.';
        formStatus.style.color = '#f87171';
    }
});