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
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); (function (t) { setTimeout(function () { t.classList.add('settled'); }, 1400); })(en.target); } });
    }, { threshold: 0.12 });
    els.forEach(function (el) {
      var sib = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.setProperty('--d', Math.min(sib, 5) * 110 + 'ms');
      el.classList.add('rv'); io.observe(el);
    });
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

  // scroll progress bar
  var bar = document.createElement('div'); bar.className = 'progress'; bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  function prog() {
    var h = document.documentElement; var max = h.scrollHeight - h.clientHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ')';
  }
  prog(); window.addEventListener('scroll', prog, { passive: true });

  // 3D tilt + moving spotlight on cards and big photos (mouse only, not on reduced-motion)
  if (window.matchMedia('(hover: hover)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.card, .split__media').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        if (e.pointerType && e.pointerType !== 'mouse') return;
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        el.style.setProperty('--mx', (x * 100) + '%'); el.style.setProperty('--my', (y * 100) + '%');
        el.classList.add('tilting');
        el.style.transform = 'perspective(900px) rotateX(' + ((0.5 - y) * 6) + 'deg) rotateY(' + ((x - 0.5) * 8) + 'deg) translateY(-5px)';
      });
      el.addEventListener('pointerleave', function () { el.classList.remove('tilting'); el.style.transform = ''; });
    });
  }
})();
