/* ============================================================
   EDIT THIS ONE LINE to turn on your email card, the footer
   email link and the contact form.
   Example:  const CONTACT_EMAIL = "yourname@example.com";
   ============================================================ */
const CONTACT_EMAIL = "";

(function () {
  "use strict";

  /* ---------- Footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");
  var toggleLabel = toggle ? toggle.querySelector(".sr-only") : null;

  function setMenu(open) {
    if (!toggle || !nav) return;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    if (toggleLabel) toggleLabel.textContent = open ? "Close menu" : "Open menu";
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setMenu(!nav.classList.contains("is-open"));
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenu(false);
    });
  }

  /* ---------- Highlight the current section in the nav ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".primary-nav a[href^='#']"));
  if ("IntersectionObserver" in window && navLinks.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          if (a.getAttribute("href") === "#" + entry.target.id) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    navLinks.forEach(function (a) {
      var section = document.getElementById(a.getAttribute("href").slice(1));
      if (section) spy.observe(section);
    });
  }

  /* ---------- Reveal on scroll (skipped if reduced motion is preferred) ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if ("IntersectionObserver" in window && !reduceMotion) {
    var reveal = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          reveal.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { reveal.observe(el); });
  }

  /* ---------- Email card + footer link (activated by CONTACT_EMAIL) ---------- */
  if (CONTACT_EMAIL) {
    var card = document.getElementById("email-card");
    if (card) {
      var a = document.createElement("a");
      a.className = "card card--hover channel";
      a.href = "mailto:" + CONTACT_EMAIL;
      a.innerHTML = card.innerHTML;
      var text = a.querySelector("[data-email-text]");
      if (text) { text.textContent = CONTACT_EMAIL; text.classList.remove("is-placeholder"); }
      card.replaceWith(a);
    }
    var footerEmail = document.getElementById("footer-email");
    if (footerEmail) {
      var fa = document.createElement("a");
      fa.className = "link";
      fa.href = "mailto:" + CONTACT_EMAIL;
      fa.innerHTML = footerEmail.innerHTML;
      footerEmail.replaceWith(fa);
    }
  }

  /* ---------- Contact form: opens the visitor's email app (no server needed) ---------- */
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");
  if (form && status) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!CONTACT_EMAIL) {
        status.className = "form-status form-status--error";
        status.textContent = "This form is not connected yet. Add your email in script.js.";
        return;
      }
      var data = new FormData(form);
      var name = data.get("name");
      var subject = data.get("subject") || "Message from " + name;
      var body = data.get("message") + "\n\n— " + name + " (" + data.get("email") + ")";
      window.location.href =
        "mailto:" + CONTACT_EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      status.className = "form-status form-status--success";
      status.textContent = "Opening your email app…";
    });
  }
})();
