// script.js – Interactivity for MTSAGA Portfolio

// Smooth scroll to section
const navLinks = document.querySelectorAll('.nav-links a');
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const section = document.querySelector(link.getAttribute('href'));
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  });
});

// Tab switching logic
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tabButtons.forEach(b => b.classList.remove('active'));
    tabContents.forEach(tc => tc.classList.remove('active'));

    btn.classList.add('active');
    const target = btn.getAttribute('data-tab');
    document.getElementById(target).classList.add('active');
  });
});

// terminal intro bounce effect on load
window.addEventListener('load', () => {
  const terminal = document.querySelector('.terminal-wrapper');
  if (terminal) terminal.classList.add('bounce');
});
