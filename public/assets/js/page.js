/* Blog pages: theme toggle only (no shader, cursor or boot screen) */
(function bindThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const isLight = document.documentElement.classList.toggle('light');
    try {
      localStorage.setItem('mcc-theme', isLight ? 'light' : 'dark');
    } catch (err) {}
  });
})();
