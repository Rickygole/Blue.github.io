// Global script: page transitions, reveals, timeline toggles, modal, gallery, confetti
(function(){
  // Page transition: fade-out on link click, fade-in on load
  document.addEventListener('DOMContentLoaded', ()=>{
    requestAnimationFrame(()=>document.body.classList.add('visible'));

    document.querySelectorAll('a[data-link]').forEach(a=>{
      a.addEventListener('click', (e)=>{
        const href = a.getAttribute('href');
        if(!href || href.startsWith('#')) return;
        e.preventDefault();
        document.body.classList.add('fade-out');
        setTimeout(()=>{ window.location = href; }, 280);
      });
    });

    // Reveal on scroll
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, {threshold:0.12});
    document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

    // Timeline progress fill
    const progressFill = document.querySelector('.timeline-progress .fill');
    if(progressFill){
      const total = document.querySelectorAll('.cards .card').length;
      const update = ()=>{
        const cards = Array.from(document.querySelectorAll('.cards .card'));
        const seen = cards.filter(c=>{
          const r = c.getBoundingClientRect();
          return r.top < window.innerHeight*0.6;
        }).length;
        const pct = Math.min(1, Math.max(0, seen / Math.max(1,total)));
        progressFill.style.height = (pct * 100) + '%';
      };
      update();
      window.addEventListener('scroll', update);
      window.addEventListener('resize', update);
    }

    // Timeline card toggle
    document.querySelectorAll('.card').forEach(card=>{
      const btn = card.querySelector('.toggle');
      if(!btn) return;
      const extra = card.querySelector('.extra');
      btn.addEventListener('click', ()=>{
        const expanded = card.classList.toggle('expanded');
        btn.setAttribute('aria-expanded', expanded?'true':'false');
      });
      card.addEventListener('keypress', (e)=>{ if(e.key==='Enter' || e.key===' ') btn.click(); });
    });

    // Gallery modal
    const modal = document.querySelector('.modal');
    const modalImg = modal && modal.querySelector('.modal-img');
    const modalCaption = modal && modal.querySelector('.modal-caption');
    const modalClose = modal && modal.querySelector('.modal-close');

    // Photo list (populated from assets/photos folder)
    const PHOTOS = [
      'assets/photos/IMG_7560.JPG','assets/photos/IMG_7561.JPG','assets/photos/IMG_7562.JPG','assets/photos/IMG_7563.JPG',
      'assets/photos/IMG_7739.jpeg','assets/photos/IMG_7740.jpeg','assets/photos/IMG_7741.jpeg','assets/photos/IMG_7742.jpeg',
      'assets/photos/IMG_7743.jpeg','assets/photos/IMG_7744.jpeg','assets/photos/IMG_7745.jpeg','assets/photos/IMG_7746.jpeg',
      'assets/photos/IMG_7765.jpeg','assets/photos/IMG_7766.jpeg','assets/photos/IMG_7767.jpeg','assets/photos/IMG_7768.JPG',
      'assets/photos/IMG_8353.jpeg','assets/photos/IMG_8355.jpeg','assets/photos/IMG_8360.jpeg','assets/photos/IMG_8361.jpeg',
      'assets/photos/IMG_8362.jpeg','assets/photos/IMG_8363.jpeg'
    ];

    const CAPTIONS = {
      'IMG_7560.JPG':'I did not know this moment would stay with me, but it did.',
      'IMG_7561.JPG':'This looked ordinary and somehow became important.',
      'IMG_7562.JPG':'I caught myself smiling later and knew why.'
    };

    const film = document.getElementById('filmstrip');
    if(film){
      PHOTOS.forEach(src=>{
        const name = src.split('/').pop();
        const caption = CAPTIONS[name] || '';
        const btn = document.createElement('button');
        btn.className = 'photo-card reveal';
        btn.setAttribute('data-src', src);
        btn.setAttribute('data-caption', caption);
        const img = document.createElement('img'); img.src = src; img.alt = caption || name;
        btn.appendChild(img);
        film.appendChild(btn);
      });
    }

    // wire modal open events after adding buttons
    document.querySelectorAll('.photo-card').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const src = btn.dataset.src;
        const caption = btn.dataset.caption || '';
        if(modal && modalImg){
          modalImg.src = src; modalImg.alt = caption; modalCaption.textContent = caption;
          modal.setAttribute('aria-hidden','false');
          document.body.style.overflow = 'hidden';
          modalClose && modalClose.focus();
        }
      });
    });
    function closeModal(){
      if(!modal) return;
      modal.setAttribute('aria-hidden','true');
      document.body.style.overflow = '';
      modalImg && (modalImg.src='');
    }
    if(modalClose) modalClose.addEventListener('click', closeModal);
    if(modal){
      modal.addEventListener('click', (e)=>{ if(e.target===modal) closeModal(); });
      document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeModal(); });
    }

    // Valentine buttons -> confetti
    const yes = document.getElementById('yesBtn');
    const obvious = document.getElementById('obviousBtn');
    const result = document.getElementById('result');
    const canvas = document.getElementById('confettiCanvas');
    if((yes || obvious) && canvas){
      const ctx = canvas.getContext('2d');
      let running = false;
      function resize(){ canvas.width = innerWidth; canvas.height = innerHeight; }
      resize(); window.addEventListener('resize', resize);

      function runConfetti(){
        if(running) return; running = true;
        const pieces = [];
        const colors = ['#4ea8ff','#1e3a8a','#88c7ff','#3b82f6'];
        for(let i=0;i<120;i++){
          pieces.push({x:Math.random()*canvas.width,y:Math.random()*-canvas.height,dx:(Math.random()-0.5)*2,dy:Math.random()*3+2,size:6+Math.random()*8,color:colors[Math.floor(Math.random()*colors.length)],rot:Math.random()*360,dr:Math.random()*6-3});
        }
        let t=0;
        function frame(){
          t++; ctx.clearRect(0,0,canvas.width,canvas.height);
          pieces.forEach(p=>{
            p.x += p.dx; p.y += p.dy; p.rot += p.dr;
            ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot*Math.PI/180);
            ctx.fillStyle = p.color; ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size);
            ctx.restore();
          });
          if(t<220) requestAnimationFrame(frame); else { ctx.clearRect(0,0,canvas.width,canvas.height); running=false; }
        }
        frame();
      }

      function handleChoice(){
        // Play the user-provided song on user click (no autoplay)
        const song = document.getElementById('song');
        if(song){
          song.volume = 0.9;
          const p = song.play();
          if(p && p.catch){
            p.catch(()=>{
              // ignore playback exceptions (file missing or browser blocked)
            });
          }
        }

        runConfetti();
        if(yes) yes.disabled = true; if(obvious) obvious.disabled = true;
        if(result) result.textContent = "Okay. It’s you. 💙";
      }
      yes && yes.addEventListener('click', handleChoice);
      obvious && obvious.addEventListener('click', handleChoice);
    }
  });
})();
