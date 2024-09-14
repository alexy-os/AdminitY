// Dark mode toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const htmlElement = document.documentElement;

darkModeToggle.addEventListener('click', () => {
  htmlElement.classList.toggle('dark');
  localStorage.setItem('darkMode', htmlElement.classList.contains('dark'));
});

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
  htmlElement.classList.add('dark');
  darkModeToggle.checked = true;
}

lucide.createIcons();

// Implement other frontend functionality (e.g., API calls, pagination, sorting)