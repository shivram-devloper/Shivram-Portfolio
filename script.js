/* =========================================================
   ShivRam — PORTFOLIO SCRIPT
   1. Mobile navigation toggle
   2. Close mobile menu on link click / outside click
   3. Active navigation state on scroll
   4. Contact form validation
   5. Footer year
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- 1. Mobile navigation toggle ---------- */
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');

  function openMenu() {
    navMenu.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Close menu');
  }

  function closeMenu() {
    navMenu.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
  }

  navToggle.addEventListener('click', function () {
    var isOpen = navMenu.classList.contains('is-open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  /* ---------- 2. Close mobile menu on link click / outside click ---------- */
  var navLinks = navMenu.querySelectorAll('.nav-link');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      closeMenu();
    });
  });

  document.addEventListener('click', function (event) {
    var clickedInsideNav = navMenu.contains(event.target) || navToggle.contains(event.target);
    if (!clickedInsideNav && navMenu.classList.contains('is-open')) {
      closeMenu();
    }
  });

  // Close the mobile menu with the Escape key for keyboard users
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && navMenu.classList.contains('is-open')) {
      closeMenu();
      navToggle.focus();
    }
  });

  /* ---------- 3. Active navigation state on scroll ---------- */
  var sections = document.querySelectorAll('main section[id], main#home');
  var sectionLinkMap = {};

  navLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      sectionLinkMap[href.slice(1)] = link;
    }
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.getAttribute('id');
        var activeLink = sectionLinkMap[id];
        if (activeLink) {
          navLinks.forEach(function (link) {
            link.classList.remove('active-link');
          });
          activeLink.classList.add('active-link');
        }
      }
    });
  }, {
    rootMargin: '-45% 0px -50% 0px',
    threshold: 0
  });

  sections.forEach(function (section) {
    observer.observe(section);
  });

  /* ---------- 4. Contact form validation ---------- */
  var form = document.getElementById('contactForm');
  var formStatus = document.getElementById('formStatus');

  var fields = {
    name: {
      input: document.getElementById('name'),
      error: document.getElementById('nameError'),
      validate: function (value) {
        return value.trim().length > 0 ? '' : 'Please enter your name.';
      }
    },
    email: {
      input: document.getElementById('email'),
      error: document.getElementById('emailError'),
      validate: function (value) {
        var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value.trim().length === 0) return 'Please enter your email address.';
        if (!pattern.test(value.trim())) return 'Please enter a valid email address.';
        return '';
      }
    },
    message: {
      input: document.getElementById('message'),
      error: document.getElementById('messageError'),
      validate: function (value) {
        return value.trim().length >= 10 ? '' : 'Please enter a message of at least 10 characters.';
      }
    }
  };

  function showFieldError(fieldKey, message) {
    var field = fields[fieldKey];
    field.error.textContent = message;
    field.input.closest('.form-field').classList.toggle('has-error', Boolean(message));
    field.input.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  function validateField(fieldKey) {
    var field = fields[fieldKey];
    var message = field.validate(field.input.value);
    showFieldError(fieldKey, message);
    return message === '';
  }

  Object.keys(fields).forEach(function (fieldKey) {
    fields[fieldKey].input.addEventListener('blur', function () {
      validateField(fieldKey);
    });

    fields[fieldKey].input.addEventListener('input', function () {
      if (fields[fieldKey].input.closest('.form-field').classList.contains('has-error')) {
        validateField(fieldKey);
      }
    });
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var isFormValid = Object.keys(fields).every(function (fieldKey) {
      return validateField(fieldKey);
    });

    if (!isFormValid) {
      formStatus.textContent = 'Please fix the highlighted fields and try again.';
      formStatus.classList.remove('success');
      return;
    }

    // No backend is connected yet — this simply confirms the form works.
    // Replace this block with a real submission (e.g. fetch() to your
    // form endpoint or email service) when you're ready to go live.
    formStatus.textContent = 'Thanks — your message looks good and is ready to send once a form service is connected.';
    formStatus.classList.add('success');
    form.reset();
  });

  /* ---------- 5. Footer year ---------- */
  var yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

});