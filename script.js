(function () {
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');

  function onScroll() { nav.classList.toggle('is-solid', window.scrollY > 40); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  function setMenu(open) {
    menu.classList.toggle('open', open);
    nav.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  burger.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
  menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  document.getElementById('yr').textContent = new Date().getFullYear();

  // gentle scroll reveal
  var els = document.querySelectorAll('.sec__head, .split__txt, .split__media, .card, .programs > *, .faq details, .form, .contact__txt');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    els.forEach(function (el) { el.classList.add('rv'); io.observe(el); });
  }

  // Contact form -> opens WhatsApp with the details (no backend needed).
  // To use a real backend later, replace this handler with a fetch() to your form endpoint.
  var WA_NUMBER = '923457888017';
  var form = document.getElementById('form');
  var msg = document.getElementById('formMsg');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    msg.className = 'form__msg'; msg.textContent = '';
    var bad = false;
    ['name', 'phone', 'interest'].forEach(function (n) {
      var f = form.elements[n]; var ok = f.value.trim().length > 0;
      f.classList.toggle('invalid', !ok); if (!ok) bad = true;
    });
    var digits = form.elements.phone.value.replace(/\D/g, '');
    if (!bad && digits.length < 10) { form.elements.phone.classList.add('invalid'); bad = true; }
    if (bad) { msg.textContent = 'Please fill in your name, a valid phone number and what you are looking for.'; return; }
    var t = 'Assalam o Alaikum, I need: ' + form.elements.interest.value +
      '\nName: ' + form.elements.name.value.trim() +
      '\nPhone: ' + form.elements.phone.value.trim() +
      (form.elements.city.value.trim() ? '\nCity/Area: ' + form.elements.city.value.trim() : '') +
      (form.elements.msg.value.trim() ? '\nDetails: ' + form.elements.msg.value.trim() : '');
    window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(t), '_blank', 'noopener');
    msg.className = 'form__msg ok'; msg.textContent = 'Opening WhatsApp. Please press send to submit your request.';
    form.reset();
  });
})();
