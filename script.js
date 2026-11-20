(function () {
  'use strict';

  /* ------------------------------------------------------------------
     TESTIMONIALS: add REAL, approved feedback here. The section stays
     hidden until at least one entry exists. Never add invented reviews.
     Format: { quote: "…", name: "…", role: "Parent" | "Student" | "Tutor" }
     ------------------------------------------------------------------ */
  var TESTIMONIALS = [];

  var WA_NUMBER = '923457888017';

  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');

  /* navbar solid on scroll */
  function onScroll() { nav.classList.toggle('is-solid', window.scrollY > 40); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* mobile menu */
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

  /* testimonials (only if real ones were added above) */
  if (TESTIMONIALS.length) {
    var grid = document.getElementById('testiGrid');
    TESTIMONIALS.forEach(function (t) {
      var card = document.createElement('article'); card.className = 'tcard';
      var q = document.createElement('blockquote'); q.textContent = t.quote;
      var f = document.createElement('footer');
      var n = document.createElement('strong'); n.textContent = t.name;
      var r = document.createElement('span'); r.className = 'role'; r.textContent = t.role;
      f.appendChild(n); f.appendChild(r); card.appendChild(q); card.appendChild(f); grid.appendChild(card);
    });
    document.getElementById('testimonials').hidden = false;
  }

  /* entrance animation (fade up, staggered inside grids) */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els = document.querySelectorAll('.sec__head, .split__txt, .split__media, .card, .subject, .tcard, .programs > *, .faq details, .form, .contact__txt');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var t = en.target;
        t.classList.add('in'); io.unobserve(t);
        setTimeout(function () { t.classList.add('settled'); }, 1200);
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) {
      var idx = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.setProperty('--d', Math.min(idx % 4, 3) * 90 + 'ms');
      el.classList.add('rv'); io.observe(el);
    });
  }

  /* scroll progress bar */
  var bar = document.createElement('div'); bar.className = 'progress'; bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  function prog() {
    var h = document.documentElement, max = h.scrollHeight - h.clientHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ')';
  }
  prog(); window.addEventListener('scroll', prog, { passive: true });

  /* very light tilt on service cards (mouse only) */
  if (window.matchMedia('(hover: hover)').matches && !reduce) {
    document.querySelectorAll('.card').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        if (e.pointerType && e.pointerType !== 'mouse') return;
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        el.classList.add('tilting');
        el.style.transform = 'perspective(1000px) rotateX(' + ((0.5 - y) * 2) + 'deg) rotateY(' + ((x - 0.5) * 2.5) + 'deg) translateY(-4px)';
      });
      el.addEventListener('pointerleave', function () { el.classList.remove('tilting'); el.style.transform = ''; });
    });
  }

  /* ------------------------------------------------------------------
     ENQUIRY FORM: builds a formatted WhatsApp message (no backend)
     ------------------------------------------------------------------ */
  var form = document.getElementById('form');
  var msg = document.getElementById('formMsg');
  var f = {
    service: document.getElementById('f-service'), name: document.getElementById('f-name'),
    phone: document.getElementById('f-phone'), level: document.getElementById('f-level'),
    subject: document.getElementById('f-subject'), tutor: document.getElementById('f-tutor'),
    city: document.getElementById('f-city'), msg: document.getElementById('f-msg')
  };

  /* show only the fields that make sense for the chosen service */
  function updateFields() {
    var svc = f.service.value;
    form.querySelectorAll('[data-show]').forEach(function (el) {
      var on = el.getAttribute('data-show').split(',').indexOf(svc) !== -1;
      el.hidden = !on;
      el.querySelectorAll('select, input, textarea').forEach(function (c) { c.disabled = !on; });
    });
  }
  f.service.addEventListener('change', updateFields);
  updateFields();

  function setSelect(sel, value) {
    for (var i = 0; i < sel.options.length; i++) {
      if (sel.options[i].value === value || sel.options[i].text === value) { sel.selectedIndex = i; return; }
    }
  }

  /* service / subject / class buttons pre-fill the enquiry form */
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('[data-service]') : null;
    if (!a) return;
    setSelect(f.service, a.getAttribute('data-service'));
    f.level.selectedIndex = 0; f.subject.selectedIndex = 0; f.tutor.selectedIndex = 0;
    if (a.hasAttribute('data-level')) setSelect(f.level, a.getAttribute('data-level'));
    if (a.hasAttribute('data-subject')) setSelect(f.subject, a.getAttribute('data-subject'));
    if (a.hasAttribute('data-tutor')) setSelect(f.tutor, a.getAttribute('data-tutor'));
    updateFields();
  });

  function val(el) { return el && !el.disabled ? el.value.trim() : ''; }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    msg.className = 'form__msg'; msg.textContent = '';
    var digits = f.phone.value.replace(/\D/g, '');
    var okName = f.name.value.trim().length > 1, okPhone = digits.length >= 10;
    f.name.classList.toggle('invalid', !okName); f.phone.classList.toggle('invalid', !okPhone);
    f.name.setAttribute('aria-invalid', String(!okName)); f.phone.setAttribute('aria-invalid', String(!okPhone));
    if (!okName || !okPhone) {
      msg.textContent = 'Please enter your name and a valid phone number.';
      (okName ? f.phone : f.name).focus();
      return;
    }
    var lines = ['Assalam o Alaikum, I would like to enquire about Times Home Tutors.', ''];
    lines.push('*Service:* ' + f.service.value);
    lines.push('*Name:* ' + f.name.value.trim());
    lines.push('*Phone:* ' + f.phone.value.trim());
    if (val(f.level)) lines.push('*Academic Level:* ' + val(f.level));
    if (val(f.subject)) lines.push('*Subject:* ' + val(f.subject));
    if (val(f.tutor)) lines.push('*Preferred Tutor Type:* ' + val(f.tutor));
    if (val(f.city)) lines.push('*City / Area:* ' + val(f.city));
    if (val(f.msg)) lines.push('*Additional Requirements:* ' + val(f.msg));
    var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));

    var a = document.createElement('a');
    a.href = url; a.target = '_blank'; a.rel = 'noopener';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);

    msg.className = 'form__msg ok';
    msg.innerHTML = 'Opening WhatsApp. Press send there to submit. If it did not open, <a href="' + url + '" target="_blank" rel="noopener">tap here</a>.';
    form.reset(); updateFields();
  });
})();

/* Video hero (only active on /video/) */
(function(){
  var v=document.getElementById('heroVideo'); if(!v) return;
  var wrap=v.parentElement, btn=document.getElementById('heroPause'), poster=wrap.querySelector('.hero__poster');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mq=window.matchMedia('(max-width: 700px)'), userPaused=false, cur='';
  function load(){
    var k=mq.matches?'mobile':'desktop'; if(k===cur) return; cur=k;
    v.src=v.dataset[k]; if(poster) poster.src=v.dataset[k==='mobile'?'posterMobile':'posterDesktop'];
    wrap.classList.remove('is-playing'); if(!reduce&&!userPaused) play();
  }
  function play(){ var p=v.play(); if(p&&p.catch) p.catch(function(){}); }
  v.addEventListener('playing',function(){wrap.classList.add('is-playing');});
  if(reduce){ if(btn) btn.hidden=true; return; }
  load();
  (mq.addEventListener?mq.addEventListener('change',load):mq.addListener(load));
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(e){ if(userPaused) return; e[0].isIntersecting?play():v.pause(); },{threshold:.1}).observe(wrap);
  }
  if(btn) btn.addEventListener('click',function(){
    userPaused=!userPaused; btn.setAttribute('aria-pressed',userPaused);
    btn.innerHTML=userPaused?'&#9654;':'&#10074;&#10074;';
    btn.setAttribute('aria-label',userPaused?'Play background video':'Pause background video');
    userPaused?v.pause():play();
  });
})();
