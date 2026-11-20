import re,pathlib
root=pathlib.Path(__file__).resolve().parent.parent
h=(root/'index.html').read_text()
# hero bg -> video
h=re.sub(r'<picture class="hero__bg">.*?</picture>',
'''<div class="hero__bg hero__bg--video">
    <img class="hero__poster" src="images/hero-video-desktop-poster.jpg" alt="A tutor teaching a student at home" fetchpriority="high" width="1280" height="720">
    <video id="heroVideo" muted loop playsinline preload="metadata" aria-hidden="true" tabindex="-1"
      data-desktop="videos/hero-desktop.mp4" data-mobile="videos/hero-mobile.mp4"
      data-poster-desktop="images/hero-video-desktop-poster.jpg" data-poster-mobile="images/hero-video-mobile-poster.jpg"></video>
  </div>
  <button type="button" class="hero__pause" id="heroPause" aria-label="Pause background video" aria-pressed="false">&#10074;&#10074;</button>''',h,count=1,flags=re.S)
# prefix relative paths
def fix(m):
    a,q,v=m.group(1),m.group(2),m.group(3)
    if re.match(r'(#|https?:|tel:|mailto:|data:|\.\./|//)',v): return m.group(0)
    return f'{a}={q}../{v}{q}'
h=re.sub(r'\b(href|src|srcset|data-desktop|data-mobile|data-poster-desktop|data-poster-mobile|content)=(["\'])(.*?)\2',
         lambda m: m.group(0) if m.group(1)=='content' else fix(m),h)
h=h.replace('content="index, follow, max-image-preview:large"','content="noindex, follow"')
h=h.replace('<link rel="canonical" href="https://timesenterprisers.vercel.app/">','<link rel="canonical" href="https://timesenterprisers.vercel.app/">')
h=re.sub(r'<script type="application/ld\+json">.*?</script>\n?','',h,flags=re.S)
(root/'video'/'index.html').write_text(h)
print('ok',len(h))
