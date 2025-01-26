// Function to toggle the website's theme between 'light' and 'dark'
export const toggleTheme = () => {
    // Get the current theme
    const currentTheme = document.documentElement.getAttribute('data-theme');
    // Determine the new theme
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    // Update the theme
    document.documentElement.setAttribute('data-theme', newTheme);
    // Save the new theme to localStorage
    localStorage.setItem('theme', newTheme);
  };
  
  // Function to load and apply the saved theme
  export const loadSavedTheme = () => {
    // Retrieve the saved theme from localStorage, defaulting to 'light' if not set
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  };