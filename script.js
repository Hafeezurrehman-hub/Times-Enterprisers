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


/* WhatsApp buttons: open the WhatsApp app on desktop when installed, else WhatsApp Web */
(function(){
  var touch=/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  if(touch) return; /* wa.me opens the app directly on phones */
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[href*="wa.me/"]'); if(!a||e.metaKey||e.ctrlKey) return;
    var u; try{u=new URL(a.href);}catch(x){return;}
    e.preventDefault();
    var phone=u.pathname.replace(/\D/g,''), text=u.searchParams.get('text')||'';
    var left=false, onb=function(){left=true;}; window.addEventListener('blur',onb);
    window.location.href='whatsapp://send?phone='+phone+(text?'&text='+encodeURIComponent(text):'');
    setTimeout(function(){window.removeEventListener('blur',onb); if(!left&&!document.hidden) window.open(a.href,'_blank','noopener');},1800);
  });
  window.__waOpen=function(url){var a=document.createElement('a');a.href=url;document.body.appendChild(a);a.click();document.body.removeChild(a);};
})();

/* Typewriter headings (hero on load, others when scrolled into view) */
(function(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var sel=['#hero-title'];
  function nodes(el){var out=[],w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);while(w.nextNode())out.push(w.currentNode);return out;}
  function prep(el){
    var full=el.textContent.replace(/\s+/g,' ').trim();
    el.setAttribute('aria-label',full);
    el.style.minHeight=el.offsetHeight+'px';           /* no layout jump */
    var tn=nodes(el),texts=tn.map(function(n){return n.nodeValue;});
    tn.forEach(function(n){n.nodeValue='';});
    var caret=document.createElement('span');caret.className='tw-caret';caret.setAttribute('aria-hidden','true');
    el.classList.add('tw');
    return {tn:tn,texts:texts,caret:caret};
  }
  function run(el,st,delay){
    var i=0,j=0,speed=hero(el)?55:32;
    function hero(e){return e.id==='hero-title';}
    function tick(){
      if(i>=st.tn.length){setTimeout(function(){st.caret.remove();el.classList.remove('tw');el.style.minHeight='';},900);return;}
      var t=st.texts[i];
      if(j===0&&!st.caret.parentNode||j===0) st.tn[i].parentNode.insertBefore(st.caret,st.tn[i].nextSibling);
      if(j<t.length){j++;st.tn[i].nodeValue=t.slice(0,j);setTimeout(tick,speed);}
      else{i++;j=0;setTimeout(tick,i<st.tn.length?180:0);}
    }
    setTimeout(tick,delay||0);
  }
  var items=sel.map(function(s){return document.querySelector(s);}).filter(Boolean);
  items.forEach(function(el){
    var st=prep(el);
    if(el.id==='hero-title'){run(el,st,350);return;}
    if(!('IntersectionObserver' in window)){st.tn.forEach(function(n,k){n.nodeValue=st.texts[k];});return;}
    var io=new IntersectionObserver(function(e){if(e[0].isIntersecting){io.disconnect();run(el,st,100);}},{threshold:.6});
    io.observe(el);
  });
})();

/* Typewriter on hover: remaining section headings type when the pointer enters them */
(function(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var done={'hero-title':1,'about-title':1,'services-title':1,'how-title':1,'online-title':1,'contact-title':1};
  var busy=new WeakSet();
  function textNodes(el){var o=[],w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);while(w.nextNode())o.push(w.currentNode);return o;}
  function type(el){
    if(busy.has(el)) return; busy.add(el);
    var tn=textNodes(el),texts=tn.map(function(n){return n.nodeValue;});
    el.setAttribute('aria-label',el.textContent.replace(/\s+/g,' ').trim());
    el.style.minHeight=el.offsetHeight+'px';
    tn.forEach(function(n){n.nodeValue='';});
    var caret=document.createElement('span');caret.className='tw-caret';caret.setAttribute('aria-hidden','true');
    var i=0,j=0;
    (function tick(){
      if(i>=tn.length){setTimeout(function(){caret.remove();el.style.minHeight='';busy.delete(el);},500);return;}
      if(j===0) tn[i].parentNode.insertBefore(caret,tn[i].nextSibling);
      var t=texts[i];
      if(j<t.length){j++;tn[i].nodeValue=t.slice(0,j);setTimeout(tick,30);}
      else{i++;j=0;setTimeout(tick,i<tn.length?120:0);}
    })();
  }
  var noHover=window.matchMedia('(hover: none)').matches;
  document.querySelectorAll('h2').forEach(function(h){
    if(done[h.id]) return;
    h.classList.add('tw-hover');
    if(noHover && 'IntersectionObserver' in window){      /* touch screens: type automatically when scrolled into view */
      var io=new IntersectionObserver(function(e){if(e[0].isIntersecting){io.disconnect();type(h);}},{threshold:.7});
      io.observe(h);
    }else{h.addEventListener('pointerenter',function(){type(h);});}
  });
})();

/* Scroll-scrubbed hero video (only active on /scroll/) */
(function(){
  var v=document.getElementById('scrubVideo'),box=document.getElementById('scrub'); if(!v||!box) return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var wrap=v.parentElement,poster=wrap.querySelector('.hero__poster'),hero=box.querySelector('.hero__in'),
      hint=document.getElementById('scrubHint'),bar=document.getElementById('scrubBar'),
      mq=window.matchMedia('(max-width: 700px)'),cur='',dur=0,pos=0,target=0,raf=0;
  function load(){
    var k=mq.matches?'mobile':'desktop'; if(k===cur) return; cur=k; dur=0;
    v.src=v.dataset[k]; poster.src=v.dataset[k==='mobile'?'posterMobile':'posterDesktop']; v.load();
  }
  v.addEventListener('loadedmetadata',function(){dur=v.duration||0;update();});
  var clamp=function(x){return Math.max(0,Math.min(1,x));};
  function progress(){var r=box.getBoundingClientRect(),span=box.offsetHeight-window.innerHeight;return span>0?clamp(-r.top/span):0;}
  function update(){
    var p=progress();
    var t=1-clamp((p-.05)/.14);
    hero.style.opacity=t; hero.style.transform='translateY('+(-p*50)+'px)';
    hero.style.pointerEvents=t>.4?'auto':'none';
    var hs=box.querySelector('.hero--scrub'); hs.classList.toggle("is-open",p>.18);
    var caps=box.querySelectorAll('.cap'),n=caps.length,a=.24,b=.98,w=(b-a)/n,any=false;
    for(var k=0;k<n;k++){
      var s0=a+k*w,e0=s0+w,f=Math.min(clamp((p-s0)/(w*.22)),clamp((e0-p)/(w*.22)));
      caps[k].style.opacity=f; caps[k].style.transform='translateY('+((1-f)*24)+'px)'; if(f>.05) any=true;
    }
    hs.classList.toggle('caps-on',any);
    if(hint) hint.style.opacity=clamp(1-p*8);
    if(bar){var d=document.documentElement;bar.style.width=(window.scrollY/Math.max(1,d.scrollHeight-window.innerHeight)*100)+'%';}
    target=p*(dur||0);
    if(!raf) raf=requestAnimationFrame(step);
  }
  function step(){
    raf=0; var diff=target-pos;
    if(Math.abs(diff)>.004){
      pos+=diff*.18;
      if(dur&&Math.abs(v.currentTime-pos)>.01){try{v.currentTime=Math.min(pos,dur-.05);}catch(e){}}
      if(poster&&dur) poster.style.opacity=0;
      raf=requestAnimationFrame(step);
    }
  }
  window.addEventListener('scroll',update,{passive:true});
  window.addEventListener('resize',function(){update();});
  (mq.addEventListener?mq.addEventListener('change',load):mq.addListener(load));
  load(); update();
})();


/* WhatsApp: each section opens WhatsApp with its own ready-made message */
(function(){
  var NUM='923457888017', G='Assalam o Alaikum, ';
  var MSG={
    home:G+'I need a tutor. Please guide me.',
    about:G+'I read about Times Enterprises and would like to know more about your services.',
    owner:G+'I would like to speak with Malik Ali Shahnawaz about Times Enterprises.',
    services:G+'I am interested in your services. Please share the details.',
    programs:G+'I would like details about your tutoring programs and classes.',
    subjects:G+'I need a tutor for a subject (Science, Biology, Computer Science or Arts). Please guide me.',
    team:G+'I would like a male or female tutor. Please tell me what is available.',
    how:G+'I would like to start. What do you need from me to arrange a tutor?',
    success:G+'I would like to arrange a tutor for my child. Please guide me.',
    online:G+'I am interested in online tuition. Please share the details.',
    other:G+'I would like details about your other services (matrimonial, domestic or patient care staffing).',
    courses:G+'I would like details about your skill development courses (IELTS / PTE, E-Commerce, Digital Marketing, Graphic Designing).',
    gallery:G+'I saw your work on the website and would like to get in touch.',
    testimonials:G+'I would like to know more about your service.',
    faq:G+'I have a question about your service.',
    contact:G+'I would like to request a tutor. Please contact me.'
  };
  function url(id){return 'https://wa.me/'+NUM+'?text='+encodeURIComponent(MSG[id]||MSG.home);}
  document.querySelectorAll('a[data-wa]').forEach(function(a){a.href=url(a.getAttribute('data-wa'));});
  var f=document.getElementById('waFloat'); if(!f) return;
  var secs=[].slice.call(document.querySelectorAll('main section[id], section[id]')).filter(function(s){return MSG[s.id];});
  var cur='';
  function upd(){
    var mid=window.innerHeight*0.4, id='home';
    for(var i=0;i<secs.length;i++){var r=secs[i].getBoundingClientRect(); if(r.top<=mid&&r.bottom>mid){id=secs[i].id;break;}}
    if(id!==cur){cur=id;f.href=url(id);}
  }
  window.addEventListener('scroll',upd,{passive:true});window.addEventListener('resize',upd);upd();
})();


/* Courses: details modal + course-specific WhatsApp enquiry */
(function(){
  var NUM='923457888017';
  var D={
    ielts:{t:'IELTS / PTE Preparation',o:'Preparation for the IELTS and PTE English tests, covering all four skills.',l:['Listening','Reading','Speaking','Writing'],d:'6 Weeks'},
    ecommerce:{t:'E-Commerce',o:'Learn how online selling works, from setting up a store to running day-to-day operations.',l:['Online store management','Product listing','E-commerce operations','Digital selling'],d:'3 Months'},
    digital:{t:'Digital Marketing',o:'Understand how businesses reach customers online through search, social media and paid campaigns.',l:['SEO','Social Media Marketing','PPC / Paid Advertising','Digital Campaigns','Analytics'],d:'3 Months'},
    graphic:{t:'Graphic Designing',o:'Build creative design skills with the tools used for logos, social posts and brand visuals.',l:['Photoshop','Illustrator','Canva','Creative Design','Branding'],d:'3 Months'}
  };
  var m=document.getElementById('cmodal'); if(!m) return;
  var box=m.querySelector('.cmodal__box'), last=null;
  function open(k,btn){
    var c=D[k]; if(!c) return; last=btn;
    document.getElementById('cmodal-title').textContent=c.t;
    document.getElementById('cmodal-over').textContent=c.o;
    document.getElementById('cmodal-list').innerHTML=c.l.map(function(x){return '<li>'+x+'</li>';}).join('');
    document.getElementById('cmodal-dur').textContent=c.d;
    var msg='Assalam-o-Alaikum, I am interested in the '+c.t+' course at Times Enterprisers. Please share further details regarding enrollment.';
    document.getElementById('cmodal-cta').href='https://wa.me/'+NUM+'?text='+encodeURIComponent(msg);
    m.hidden=false; document.body.classList.add('cmodal-open');
    requestAnimationFrame(function(){m.classList.add('is-open');box.focus();});
  }
  function close(){
    if(m.hidden) return; m.classList.remove('is-open'); document.body.classList.remove('cmodal-open');
    setTimeout(function(){m.hidden=true;},260); if(last) last.focus();
  }
  document.querySelectorAll('[data-course]').forEach(function(b){b.addEventListener('click',function(){open(b.getAttribute('data-course'),b);});});
  m.addEventListener('click',function(e){if(e.target.hasAttribute('data-close'))close();});
  document.addEventListener('keydown',function(e){
    if(m.hidden) return;
    if(e.key==='Escape'){close();return;}
    if(e.key==='Tab'){
      var f=[].slice.call(m.querySelectorAll('button,a[href]')).filter(function(x){return x.offsetParent!==null;});
      if(!f.length) return; var a=f[0], z=f[f.length-1];
      if(e.shiftKey&&(document.activeElement===a||document.activeElement===box)){e.preventDefault();z.focus();}
      else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus();}
    }
  });
})();
