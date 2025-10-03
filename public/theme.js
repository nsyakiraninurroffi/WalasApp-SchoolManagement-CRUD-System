document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggle-dark");
  const body = document.body;

  if (!toggleBtn) return; // kalau halaman nggak ada tombol, stop

  // cek preferensi dark mode yang tersimpan
  if (localStorage.getItem("darkMode") === "enabled") {
    body.classList.add("dark");
    toggleBtn.textContent = "☀️ Light Mode";
  }

  toggleBtn.addEventListener("click", () => {
    body.classList.toggle("dark");

    if (body.classList.contains("dark")) {
      localStorage.setItem("darkMode", "enabled");
      toggleBtn.textContent = "☀️ Light Mode";
    } else {
      localStorage.setItem("darkMode", "disabled");
      toggleBtn.textContent = "🌙 Dark Mode";
    }
  });
});
