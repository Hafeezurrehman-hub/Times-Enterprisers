import re,pathlib
root=pathlib.Path(__file__).resolve().parent.parent
h=(root/'index.html').read_text()
# hero background -> scroll-scrubbed video
h=re.sub(r'<picture class="hero__bg">.*?</picture>',
'''<div class="hero__bg hero__bg--video hero__bg--scrub">
    <img class="hero__poster" src="images/hero-video-desktop-poster.jpg" alt="A tutor teaching a student at home" fetchpriority="high" width="1280" height="720">
    <video id="scrubVideo" muted playsinline preload="auto" aria-hidden="true" tabindex="-1"
      data-desktop="videos/scrub-desktop.mp4" data-mobile="videos/scrub-mobile.mp4"
      data-poster-desktop="images/hero-video-desktop-poster.jpg" data-poster-mobile="images/hero-video-mobile-poster.jpg"></video>
  </div>''',h,count=1,flags=re.S)
h=h.replace('<section class="hero" id="home"','<div class="scrub" id="scrub">\n<section class="hero hero--scrub" id="home"',1)
# close wrapper after the hero section + add scroll hint inside hero
i=h.index('id="home"'); j=h.index('</section>',i)
caps='<div class="scrub__caps" id="scrubCaps"><div class="cap"><span class="cap__n">01 / 07</span><h2>Home Tutors</h2><p>One-to-one tutoring at your home, at a time that suits the family.</p></div><div class="cap"><span class="cap__n">02 / 07</span><h2>Male &amp; Female Tutors</h2><p>Choose a male or female tutor, whichever suits your child best.</p></div><div class="cap"><span class="cap__n">03 / 07</span><h2>Online Tutors</h2><p>Live online lessons from the comfort of home, wherever you are.</p></div><div class="cap"><span class="cap__n">04 / 07</span><h2>Quran Teaching</h2><p>Respectful, patient Quran learning. Contact us for details and timings.</p></div><div class="cap"><span class="cap__n">05 / 07</span><h2>Language &amp; Entry Test Preparation</h2><p>Preparation for language and entry tests with a focused tutor.</p></div><div class="cap"><span class="cap__n">06 / 07</span><h2>Senior &amp; Junior Classes</h2><p>Tutoring for junior and senior classes, from first steps to board years.</p></div><div class="cap"><span class="cap__n">07 / 07</span><h2>More Than Tutoring</h2><p>Matrimonial services, domestic staffing and patient care staffing. Call 0345-7888017.</p></div></div>\n'
hint='<div class="scrub__hint" id="scrubHint" aria-hidden="true"><span>Scroll</span><i></i></div>\n'
h=h[:j]+caps+hint+h[j:j+len('</section>')]+'\n</div>'+h[j+len('</section>'):]
h=h.replace('</body>','<div class="scrub__bar" id="scrubBar" aria-hidden="true"></div>\n</body>',1)
def fix(m):
    a,q,v=m.group(1),m.group(2),m.group(3)
    if re.match(r'(#|https?:|tel:|mailto:|data:|\.\./|//)',v): return m.group(0)
    return f'{a}={q}../{v}{q}'
h=re.sub(r'\b(href|src|srcset|data-desktop|data-mobile|data-poster-desktop|data-poster-mobile)=(["\'])(.*?)\2',fix,h)
h=h.replace('content="index, follow, max-image-preview:large"','content="noindex, follow"')
h=re.sub(r'<script type="application/ld\+json">.*?</script>\n?','',h,flags=re.S)
(root/'scroll'/'index.html').write_text(h)
print('ok',len(h))
