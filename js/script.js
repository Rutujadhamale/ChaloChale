document.addEventListener("DOMContentLoaded", function () {

  // ---------- Login / Signup view toggle ----------
  const loginView = document.getElementById("loginView");
  const signupView = document.getElementById("signupView");
  if (loginView && signupView) {
    const loginBtn = loginView.querySelector(".auth-submit");
    const signupBtn = signupView.querySelector(".auth-submit");
    const showView = (view) => {
      const isSignup = view === "signup";
      signupView.style.display = isSignup ? "" : "none";
      loginView.style.display = isSignup ? "none" : "";
      if (loginBtn) loginBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket me-2"></i>Login';
      if (signupBtn) signupBtn.innerHTML = '<i class="fa-solid fa-user-plus me-2"></i>Sign Up';
      document.title = isSignup
        ? "Sign Up — ChaloChale Travel"
        : "Login — ChaloChale Travel";
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    window.addEventListener("hashchange", () => {
      showView(location.hash === "#signup" ? "signup" : "login");
    });
    showView(location.hash === "#signup" ? "signup" : "login");
  }

  // ---------- Sticky navbar ----------
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  });

  // ---------- Scroll reveal ----------
  const revealEls = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => observer.observe(el));

  // ---------- Animated counters ----------
  const counters = document.querySelectorAll("[data-count]");
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || "";
        const duration = 1800;
        const start = performance.now();
        const step = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(target * eased).toLocaleString("en-IN") + suffix;
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        counterObserver.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((el) => counterObserver.observe(el));

  // ---------- Back to top ----------
  const backToTop = document.getElementById("backToTop");
  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("show", window.scrollY > 500);
  });
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // ---------- Search widget ----------
  const searchForm = document.getElementById("searchForm");
  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const dest = searchForm.querySelector("#searchDestination").value;
      const date = searchForm.querySelector("#searchDate").value;
      const people = searchForm.querySelector("#searchPeople").value;
      alert(
        `Searching trips to "${dest}"${date ? ` on ${date}` : ""}` +
          `${people ? ` for ${people} traveller(s)` : ""}.\n` +
          `Check out the Featured Packages below for great deals!`
      );
    });
  }

  // ---------- Smooth scroll for anchor links ----------
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // ---------- Destination filter ----------
  const filterBtns = document.querySelectorAll(".filter-btn");
  const destCards = document.querySelectorAll(".dest-filter-card");
  if (filterBtns.length && destCards.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const filter = btn.dataset.filter;
        let visible = 0;
        destCards.forEach((card) => {
          const show = filter === "all" || card.dataset.category === filter;
          card.style.display = show ? "" : "none";
          if (show) visible++;
        });
        const noResults = document.querySelector(".no-results");
        if (noResults) noResults.style.display = visible === 0 ? "block" : "none";
      });
    });
  }

  // ---------- Auth state (navbar) ----------
  const navGuest = document.getElementById("navGuest");
  const navUser = document.getElementById("navUser");
  const navUserName = document.getElementById("navUserName");
  const logoutBtn = document.getElementById("logoutBtn");

  const getUser = () => {
    try { return JSON.parse(localStorage.getItem("chalochale_user")); }
    catch { return null; }
  };
  const setUser = (user) => localStorage.setItem("chalochale_user", JSON.stringify(user));

  const user = getUser();
  if (navGuest && navUser) {
    if (user) {
      navGuest.style.display = "none";
      navUser.style.display = "";
      if (navUserName) navUserName.textContent = user.name || "User";
    } else {
      navUser.style.display = "none";
    }
  }
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("chalochale_user");
      window.location.href = "index.html";
    });
  }

  // ---------- Login / Signup forms ----------
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = loginForm.querySelector('input[type="email"]').value;
      setUser({ name: email.split("@")[0], email });
      alert("Welcome back! Logged in successfully.");
      window.location.href = "index.html";
    });
  }

  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (signupForm.password.value !== signupForm.confirmPassword.value) {
        alert("Passwords do not match. Please try again.");
        return;
      }
      setUser({ name: signupForm.fullName.value, email: signupForm.email.value });
      alert("Account created successfully! Welcome to ChaloChale.");
      window.location.href = "index.html";
    });
  }

  // ---------- Contact form ----------
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Thanks for reaching out! We'll get back to you within 24 hours.");
      contactForm.reset();
    });
  }

  // ---------- Booking form validation feedback ----------
  const bookingForm = document.querySelector("#bookingModal form");
  if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const modal = bootstrap.Modal.getInstance(document.getElementById("bookingModal"));
      modal.hide();
      alert("Booking request submitted successfully! Our team will contact you soon.");
      bookingForm.reset();
    });
  }
});
