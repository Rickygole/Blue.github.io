// Global script: page transitions, reveals, timeline toggles, modal, gallery, confetti
(function(){
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

    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, {threshold:0.12});
    document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

    // Gallery modal setup
    const modal = document.querySelector('.modal');
    const modalImg = modal && modal.querySelector('.modal-img');
    const modalCaption = modal && modal.querySelector('.modal-caption');
    const modalClose = modal && modal.querySelector('.modal-close');

    // Updated Photo List & Captions for ALL pictures
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
      'IMG_7562.JPG':'I caught myself smiling later and knew why.',
      'IMG_7563.JPG':'The world felt quiet when we were just existing together.',
      'IMG_7739.jpeg':'Proof that the simplest days are often the best ones.',
      'IMG_7740.jpeg':'I carry this version of you in my head everywhere I go.',
      'IMG_7741.jpeg':'A quiet chapter in our long-distance story.',
      'IMG_7742.jpeg':'Every mile between us felt smaller in this moment.',
      'IMG_7743.jpeg':'The kind of light that only follows you.',
      'IMG_7744.jpeg':'Soft as a dream, yet real enough to hold onto.',
      'IMG_7745.jpeg':'Just us, finding our way through the silence.',
      'IMG_7746.jpeg':'You made this day feel like a Studio Ghibli scene.',
      'IMG_7765.jpeg':'I look at this and I can still hear your laugh.',
      'IMG_7766.jpeg':'Tucked away in my heart for a rainy day.',
      'IMG_7767.jpeg':'A memory that makes the distance feel like nothing.',
      'IMG_7768.JPG':'The kind of day I never want to forget.',
      'IMG_8353.jpeg':'Every laugh felt like a victory against the miles.',
      'IMG_8355.jpeg':'Just us, being exactly who we are.',
      'IMG_8360.jpeg':'I caught a glimpse of forever in this moment.',
      'IMG_8361.jpeg':'Proof that the best moments aren’t planned.',
      'IMG_8362.jpeg':'Holding onto this feeling as long as I can.',
      'IMG_8363.jpeg':'You, me, and a thousand miles made small.'
    };

    const film = document.getElementById('filmstrip');
    if(film){
      PHOTOS.forEach(src=>{
        const name = src.split('/').pop();
        const caption = CAPTIONS[name] || 'A beautiful memory.';
        const btn = document.createElement('button');
        btn.className = 'photo-card reveal polaroid';
        btn.setAttribute('data-src', src);
        btn.setAttribute('data-caption', caption);

        const rot = (Math.random()-0.5) * 6;
        btn.style.transform = `rotate(${rot}deg)`;

        const img = document.createElement('img'); img.src = src; img.alt = caption;
        btn.appendChild(img);

        const cap = document.createElement('div'); cap.className = 'polaroid-caption'; cap.textContent = caption;
        btn.appendChild(cap);

        film.appendChild(btn);
      });
    }

    // Modal behavior
    document.querySelectorAll('.photo-card').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const src = btn.dataset.src;
        const caption = btn.dataset.caption || '';
        if(modal && modalImg){
          modalImg.src = src; modalImg.alt = caption; modalCaption.textContent = caption;
          modal.setAttribute('aria-hidden','false');
          document.body.style.overflow = 'hidden';
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

    // Valentine Logic
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
        const colors = ['#f8ad9d', '#fbc4ab', '#ffdab9', '#ff9a8b'];
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
        runConfetti();
        if(yes) yes.style.display = "none"; 
        if(obvious) obvious.style.display = "none";
        if(result) {
            result.textContent = "Okay. It’s you. 💙";
            result.style.fontFamily = "'Pacifico', cursive";
            result.style.fontSize = "2rem";
            result.style.color = "#c2185b";
        }
      }
      yes && yes.addEventListener('click', handleChoice);
      obvious && obvious.addEventListener('click', handleChoice);
    }
  });
})();