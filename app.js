// Initialize Lucide Icons safely with retry mechanism to prevent CDN race conditions
function initLucide() {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  } else {
    setTimeout(initLucide, 50);
  }
}
initLucide();

// Register GSAP ScrollTrigger if available
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ==========================================================================
   ACTIVE NAVIGATION ROUTE HIGHLIGHT
   ========================================================================== */
function highlightActiveRoute() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('header nav a, footer ul a');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    // Check if current URL ends with the link href
    const isHomePage = currentPath.endsWith('/') || currentPath.endsWith('index.html');
    const isMatch = currentPath.endsWith(href) || (isHomePage && href === 'index.html');
    
    if (isMatch) {
      link.classList.add('nav-link-active');
    } else {
      link.classList.remove('nav-link-active');
    }
  });
}
highlightActiveRoute();

/* ==========================================================================
   CANVAS PARTICLE BACKGROUND
   ========================================================================== */
const canvas = document.getElementById('particle-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  const particleCount = window.innerWidth < 768 ? 15 : 60;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height + canvas.height; // Start from bottom
      this.size = Math.random() * 2 + 0.5;
      this.speedY = -(Math.random() * 0.8 + 0.2); // Slowly rise up
      this.speedX = (Math.random() - 0.5) * 0.4;  // Slight drift
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.4 
        ? `rgba(140, 230, 0, ${this.opacity})` 
        : `rgba(255, 255, 255, ${this.opacity})`;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;

      if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
        this.reset();
        this.y = canvas.height + 10;
      }
    }

    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
    particles[i].y = Math.random() * canvas.height;
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

/* ==========================================================================
   3D MOUSE PARALLAX TILT EFFECT (Aperture Node)
   ========================================================================== */
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
const heroNode = document.getElementById('hero-3d-node');

if (heroNode && !isTouchDevice && window.innerWidth >= 1024) {
  window.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    const px = dx / cx;
    const py = dy / cy;

    gsap.to(heroNode, {
      rotationY: px * 20,
      rotationX: -py * 20,
      x: px * 15,
      y: py * 15,
      duration: 0.5,
      ease: "power2.out"
    });
  });
}

// 3D Glass Card mouse tilts
const cards = document.querySelectorAll('.glass-panel-glow');
if (!isTouchDevice && window.innerWidth >= 1024) {
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const xc = rect.width / 2;
      const yc = rect.height / 2;
      
      const tiltX = -(y - yc) / 12;
      const tiltY = (x - xc) / 12;

      gsap.to(card, {
        rotationX: tiltX,
        rotationY: tiltY,
        transformPerspective: 800,
        ease: "power1.out",
        duration: 0.3
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        ease: "power2.out",
        duration: 0.5
      });
    });
  });
}

/* ==========================================================================
   GSAP INTERACTION & SCROLL ENTRANCE ANIMATIONS
   ========================================================================== */
if (typeof gsap !== 'undefined') {
  window.addEventListener('load', () => {
    const tl = gsap.timeline();

    // Slide header down
    const headerNav = document.querySelector('header nav');
    if (headerNav) {
      tl.from(headerNav, {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: "elastic.out(1, 0.75)"
      });
    }

    // Hero content animations
    const heroTag = document.querySelector('#hero .inline-flex');
    if (heroTag) {
      tl.from(heroTag, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out"
      }, "-=0.6");
    }

    const heroH1 = document.querySelector('#hero h1');
    if (heroH1) {
      tl.from(heroH1, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.4");
    }

    const heroP = document.querySelector('#hero p');
    if (heroP) {
      tl.from(heroP, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out"
      }, "-=0.6");
    }

    const heroCTAs = document.querySelector('#hero .flex.pt-4, #hero .flex.gap-5');
    if (heroCTAs) {
      tl.from(heroCTAs, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out"
      }, "-=0.4");
    }

    if (heroNode) {
      tl.from(heroNode, {
        scale: 0.8,
        opacity: 0,
        duration: 1.2,
        ease: "back.out(1.5)"
      }, "-=1.0");
    }
  });

  // Services page/section grid scroll reveal
  const servicesGrid = document.querySelector('#services-grid, #services .grid');
  if (servicesGrid) {
    gsap.from(servicesGrid.children, {
      scrollTrigger: {
        trigger: servicesGrid,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 50,
      opacity: 0,
      stagger: 0.08,
      duration: 0.8,
      ease: "power3.out"
    });
  }

  // Universe Columns (home page/section)
  const universeSection = document.getElementById('universe');
  if (universeSection) {
    const columns = universeSection.querySelectorAll('.lg\\:col-span-5, .lg\\:col-span-3, .lg\\:col-span-4, .grid > div');
    gsap.from(columns, {
      scrollTrigger: {
        trigger: universeSection,
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      y: 45,
      opacity: 0,
      stagger: 0.1,
      duration: 0.9,
      ease: "power3.out"
    });
  }

  // Proof Counter Numbers
  const proofSection = document.getElementById('proof');
  if (proofSection) {
    const counters = [
      { id: 'counter-views', target: 3, format: (val) => `${Math.floor(val)}M+` },
      { id: 'counter-roi', target: 10, format: (val) => `${Math.floor(val)}x` },
      { id: 'counter-brands', target: 50, format: (val) => `${Math.floor(val)}+` }
    ];

    counters.forEach(counter => {
      const el = document.getElementById(counter.id);
      if (!el) return;

      gsap.fromTo(el, {
        textContent: 0
      }, {
        textContent: counter.target,
        duration: 2.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: proofSection,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        snap: { textContent: 1 },
        onUpdate: function() {
          el.textContent = counter.format(parseFloat(this.targets()[0].textContent));
        }
      });
    });
  }
}

/* ==========================================================================
   YOUTUBE SLIDESHOW CAROUSEL (Home / Portfolios)
   ========================================================================== */
const ytCarousel = {
  slides: [
    {
      title: "Your Marketing Is Failing Because of These 10 Mistakes!",
      image: "yt_showreel_thumbnail.png",
      subCount: "8.0K+",
      videoId: "-kh1ZDAizro"
    },
    {
      title: "Reused Content Ki Tension Khatam: Chinese Videos Se Earning",
      image: "yt_slide2.png",
      subCount: "8.0K+",
      videoId: "QZ2O6_EMU9I"
    },
    {
      title: "Fastest Instagram Growth Ever 🚀 Only 7 Days to 3M Followers",
      image: "yt_slide3.png",
      subCount: "8.0K+",
      videoId: "Htc0R66WPY4"
    }
  ],
  currentIndex: 0
};


const showreelCard = document.getElementById('yt-showreel-card');
const prevBtn = document.getElementById('carousel-prev-btn');
const nextBtn = document.getElementById('carousel-next-btn');
const ytSub = document.getElementById('yt-sub-count');

function updateCarousel(direction) {
  if (!showreelCard) return;

  gsap.to(showreelCard, {
    opacity: 0,
    y: direction === 'next' ? -15 : 15,
    duration: 0.3,
    onComplete: () => {
      const current = ytCarousel.slides[ytCarousel.currentIndex];
      const cardImg = showreelCard.querySelector('.absolute.inset-0.bg-cover');
      const cardTitle = showreelCard.querySelector('h4');

      if (cardImg) cardImg.style.backgroundImage = `url('${current.image}')`;
      if (cardTitle) cardTitle.textContent = current.title;
      if (ytSub) ytSub.textContent = current.subCount;
      
      const slideText = `SLIDE 0${ytCarousel.currentIndex + 1} // 03`;
      const slideLabel = document.querySelector('#universe span.text-gray-500, .carousel-slide-label');
      if (slideLabel) slideLabel.textContent = slideText;

      gsap.fromTo(showreelCard, {
        y: direction === 'next' ? 15 : -15,
        opacity: 0
      }, {
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: "power2.out"
      });
    }
  });
}

if (prevBtn && nextBtn) {
  prevBtn.addEventListener('click', () => {
    ytCarousel.currentIndex = (ytCarousel.currentIndex - 1 + ytCarousel.slides.length) % ytCarousel.slides.length;
    updateCarousel('prev');
  });

  nextBtn.addEventListener('click', () => {
    ytCarousel.currentIndex = (ytCarousel.currentIndex + 1) % ytCarousel.slides.length;
    updateCarousel('next');
  });
}

if (showreelCard) {
  showreelCard.addEventListener('click', () => {
    const current = ytCarousel.slides[ytCarousel.currentIndex];
    if (current && current.videoId) {
      window.open(`https://www.youtube.com/watch?v=${current.videoId}`, '_blank');
    }
  });
}

/* ==========================================================================
   ENTERPRISE FEEDBACK MANAGEMENT SYSTEM (Feedback Page)
   ========================================================================== */
const defaultFeedbacks = [
  {
    id: 'fb-1',
    name: 'Aman V.',
    title: 'Founder, Alpha Tech',
    category: 'video-editing',
    categoryLabel: 'VIDEO EDITING',
    rating: 5,
    text: 'MMG transformed our YouTube channel! We gained 50k subscribers in 3 months. Highly professional editing. Their pacing and hook design changed our average watchtime ratios completely.',
    featured: true,
    verified: true,
    date: '2026-07-15'
  },
  {
    id: 'fb-2',
    name: 'Jessica K.',
    title: 'Marketing Dir, Apex Retail',
    category: 'meta-ads',
    categoryLabel: 'META ADS',
    rating: 5,
    text: 'Their Meta Ads strategy gave us a 12x ROI. Kept the CPC incredibly low while driving actual sales. Extremely data-driven team that sends daily metrics sheets.',
    featured: true,
    verified: true,
    date: '2026-07-14'
  },
  {
    id: 'fb-3',
    name: 'Rajiv D.',
    title: 'COO, FitNation',
    category: 'web-dev',
    categoryLabel: 'WEB DEV',
    rating: 5,
    text: 'They built our website with custom elements. Fast load speeds, great interactive styling. Our conversion rate boosted by 40% within the first month of deployment. A+ agency.',
    featured: false,
    verified: true,
    date: '2026-07-10'
  },
  {
    id: 'fb-4',
    name: 'Sophia M.',
    title: 'Creator Growth Officer',
    category: 'smm',
    categoryLabel: 'SMM ORBIT',
    rating: 5,
    text: 'Content shoots are streamlined. Hook script optimization is fantastic. Best SMM agency out there. Shailesh Parashar and his team understand digital algorithms better than anyone.',
    featured: false,
    verified: true,
    date: '2026-07-08'
  },
  {
    id: 'fb-5',
    name: 'Vikram Sharma',
    title: 'MD, Pulse Media',
    category: 'smm',
    categoryLabel: 'INFLUENCER & SMM',
    rating: 5,
    text: 'Medimusicagrow connected us with top-tier creators for our product launch. Delivered over 2M impressions within 2 weeks. Seamless execution and campaign tracking!',
    featured: true,
    verified: true,
    date: '2026-07-05'
  },
  {
    id: 'fb-6',
    name: 'Neha Kapoor',
    title: 'Head of Growth, Elevate Studio',
    category: 'video-editing',
    categoryLabel: 'CONTENT CREATION',
    rating: 5,
    text: 'The team handled the end-to-end studio video shoot and reel editing. High retention hooks, cinematic color grading, and on-time deliveries. Outstanding quality.',
    featured: false,
    verified: true,
    date: '2026-07-02'
  },
  {
    id: 'fb-7',
    name: 'Siddharth Mehta',
    title: 'Founder, Nexus Commerce',
    category: 'meta-ads',
    categoryLabel: 'META ADS',
    rating: 5,
    text: 'Shailesh\'s team scaled our ad spend with zero fatigue. ROAS jumped from 2.4x to 8.1x in under a month. Their ad creatives and short-form video hooks convert exceptionally well.',
    featured: true,
    verified: true,
    date: '2026-06-28'
  },
  {
    id: 'fb-8',
    name: 'Ananya Roy',
    title: 'Brand Manager, Lumina Tech',
    category: 'web-dev',
    categoryLabel: 'WEB DEV',
    rating: 5,
    text: 'The futuristic web interface built by MMG exceeded our expectations. Clean animations, ultra-fast load times, and custom interaction nodes. High converting design!',
    featured: false,
    verified: true,
    date: '2026-06-25'
  }
];

let feedbackList = [];

function loadFeedbackDB() {
  try {
    const saved = localStorage.getItem('mmg_feedback_db');
    if (saved) {
      feedbackList = JSON.parse(saved);
    } else {
      feedbackList = [...defaultFeedbacks];
      localStorage.setItem('mmg_feedback_db', JSON.stringify(feedbackList));
    }
  } catch (e) {
    feedbackList = [...defaultFeedbacks];
  }
}

function saveFeedbackDB() {
  try {
    localStorage.setItem('mmg_feedback_db', JSON.stringify(feedbackList));
  } catch (e) {}
  renderAllFeedbackViews();
}

function renderPublicGrid(filter = 'all') {
  const grid = document.getElementById('reviews-grid');
  if (!grid) return;

  grid.innerHTML = '';
  const filtered = feedbackList.filter(item => filter === 'all' || item.category === filter);

  if (filtered.length === 0) {
    grid.innerHTML = `<p class="col-span-2 text-center text-gray-500 font-futuristic text-xs py-8">NO FEEDBACK ENTRIES FOUND IN THIS CATEGORY.</p>`;
    return;
  }

  filtered.forEach(item => {
    const initials = item.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    const card = document.createElement('div');
    card.className = `review-card glass-panel-glow rounded-2xl p-6 border ${item.featured ? 'border-limeGreen/40 shadow-lg shadow-limeGreen/5' : 'border-white/5'} space-y-4 relative overflow-hidden`;
    card.setAttribute('data-category', item.category);

    const starsHtml = Array(item.rating || 5).fill('<i data-lucide="star" class="w-3 h-3 fill-limeGreen text-limeGreen"></i>').join('');

    card.innerHTML = `
      ${item.featured ? '<div class="absolute -top-1 -right-1 bg-limeGreen text-brandBg text-[8px] font-futuristic font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest shadow-md">FEATURED</div>' : ''}
      <div class="flex justify-between items-start">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-full bg-zinc-850 border border-white/10 flex items-center justify-center font-bold text-white text-xs">${initials}</div>
          <div>
            <h4 class="text-xs font-bold text-white font-futuristic">${item.name}</h4>
            <p class="text-[9px] text-limeGreen uppercase font-futuristic">${item.title}</p>
          </div>
        </div>
        <div class="flex text-limeGreen">
          ${starsHtml}
        </div>
      </div>
      <p class="text-xs text-gray-300 leading-relaxed font-light">
        "${item.text}"
      </p>
      <div class="flex justify-between items-center text-[9px] text-gray-500 font-futuristic pt-2 border-t border-white/5">
        <span>SERVICE: ${item.categoryLabel || item.category.toUpperCase()}</span>
        <span>${item.verified ? 'VERIFIED ON GMB' : 'PENDING VERIFICATION'}</span>
      </div>
    `;

    grid.appendChild(card);
  });

  if (window.lucide) lucide.createIcons();
}

function renderAdminDashboard() {
  const tableBody = document.getElementById('admin-feedback-table-body');
  const totalStat = document.getElementById('stat-total-reviews');
  const avgStat = document.getElementById('stat-avg-rating');
  const featuredStat = document.getElementById('stat-featured-count');
  
  if (!tableBody) return;

  const total = feedbackList.length;
  const featured = feedbackList.filter(f => f.featured).length;
  const avg = total > 0 ? (feedbackList.reduce((acc, f) => acc + (f.rating || 5), 0) / total).toFixed(1) : '5.0';

  if (totalStat) totalStat.textContent = total;
  if (featuredStat) featuredStat.textContent = featured;
  if (avgStat) avgStat.textContent = `${avg} / 5.0`;

  const searchInput = document.getElementById('admin-search-input');
  const categoryFilter = document.getElementById('admin-category-filter');

  const query = (searchInput?.value || '').toLowerCase();
  const cat = categoryFilter?.value || 'all';

  const filtered = feedbackList.filter(item => {
    const matchesCat = cat === 'all' || item.category === cat;
    const matchesQuery = !query || 
      item.name.toLowerCase().includes(query) || 
      item.title.toLowerCase().includes(query) || 
      item.text.toLowerCase().includes(query);
    return matchesCat && matchesQuery;
  });

  tableBody.innerHTML = '';

  if (filtered.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-gray-500 py-8 font-futuristic text-xs">NO FEEDBACK MATCHES CURRENT SEARCH/FILTER CRITERIA.</td></tr>`;
    return;
  }

  filtered.forEach(item => {
    const tr = document.createElement('tr');
    tr.className = "hover:bg-white/[0.02] transition-colors";
    
    tr.innerHTML = `
      <td class="py-3 px-4">
        <p class="font-bold text-white font-futuristic text-xs">${item.name}</p>
        <p class="text-[10px] text-limeGreen uppercase">${item.title}</p>
      </td>
      <td class="py-3 px-4">
        <span class="text-[9px] font-futuristic bg-white/5 border border-white/10 px-2 py-1 rounded text-gray-300 uppercase">${item.categoryLabel || item.category}</span>
      </td>
      <td class="py-3 px-4 text-limeGreen font-bold font-futuristic">
        ${item.rating || 5} ★
      </td>
      <td class="py-3 px-4 text-gray-300 max-w-xs truncate">
        "${item.text}"
      </td>
      <td class="py-3 px-4">
        <div class="flex items-center gap-1.5">
          ${item.featured ? '<span class="text-[8px] bg-limeGreen/20 text-limeGreen border border-limeGreen/40 font-futuristic font-bold px-2 py-0.5 rounded">FEATURED</span>' : ''}
          <span class="text-[8px] bg-white/5 text-gray-400 border border-white/10 font-futuristic px-2 py-0.5 rounded">VERIFIED GMB</span>
        </div>
      </td>
      <td class="py-3 px-4 text-right">
        <div class="flex items-center justify-end gap-2">
          <button data-action="toggle-feature" data-id="${item.id}" class="p-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-limeGreen hover:border-limeGreen/50 transition-colors" title="Toggle Featured State">
            <i data-lucide="star" class="w-3.5 h-3.5 ${item.featured ? 'fill-limeGreen text-limeGreen' : ''}"></i>
          </button>
          <button data-action="delete" data-id="${item.id}" class="p-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors" title="Delete Review">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </td>
    `;

    tableBody.appendChild(tr);
  });

  if (window.lucide) lucide.createIcons();

  tableBody.querySelectorAll('button[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      const id = btn.getAttribute('data-id');

      if (action === 'toggle-feature') {
        const item = feedbackList.find(f => f.id === id);
        if (item) {
          item.featured = !item.featured;
          saveFeedbackDB();
        }
      } else if (action === 'delete') {
        if (confirm('Are you sure you want to purge this feedback entry?')) {
          feedbackList = feedbackList.filter(f => f.id !== id);
          saveFeedbackDB();
        }
      }
    });
  });
}

function renderAllFeedbackViews() {
  const activePublicFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
  renderPublicGrid(activePublicFilter);
  renderAdminDashboard();
}

// Mode Switcher Tabs
const tabPublicView = document.getElementById('tab-public-view');
const tabAdminView = document.getElementById('tab-admin-view');
const publicSection = document.getElementById('public-feedback-section');
const adminSection = document.getElementById('admin-management-system');

const ADMIN_PASSKEY = 'Shailesh@5609';

function showAdminSection() {
  if (tabPublicView && tabAdminView && publicSection && adminSection) {
    tabAdminView.className = "view-tab-btn px-6 py-3 rounded-xl font-futuristic font-bold text-xs tracking-wider transition-all bg-limeGreen text-brandBg shadow-lg shadow-limeGreen/20";
    tabPublicView.className = "view-tab-btn px-6 py-3 rounded-xl font-futuristic font-bold text-xs tracking-wider transition-all border border-white/10 text-gray-400 hover:text-white hover:border-limeGreen/50";
    
    adminSection.classList.remove('hidden');
    publicSection.classList.add('hidden');
    gsap.fromTo(adminSection, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4 });
  }
}

function showPublicSection() {
  if (tabPublicView && tabAdminView && publicSection && adminSection) {
    tabPublicView.className = "view-tab-btn px-6 py-3 rounded-xl font-futuristic font-bold text-xs tracking-wider transition-all bg-limeGreen text-brandBg shadow-lg shadow-limeGreen/20";
    tabAdminView.className = "view-tab-btn px-6 py-3 rounded-xl font-futuristic font-bold text-xs tracking-wider transition-all border border-white/10 text-gray-400 hover:text-white hover:border-limeGreen/50";
    
    publicSection.classList.remove('hidden');
    adminSection.classList.add('hidden');
    gsap.fromTo(publicSection, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4 });
  }
}

function promptAdminLogin() {
  let loginModal = document.getElementById('admin-login-modal-overlay');
  if (!loginModal) {
    loginModal = document.createElement('div');
    loginModal.id = 'admin-login-modal-overlay';
    loginModal.className = 'feedback-modal-overlay';
    loginModal.innerHTML = `
      <div class="feedback-modal-box w-full max-w-sm bg-zinc-950 border border-limeGreen/30 rounded-3xl p-8 shadow-2xl relative font-futuristic text-left" id="admin-login-box">
        <button id="close-admin-login-modal" class="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors" title="Cancel">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>

        <div class="space-y-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-limeGreen/10 border border-limeGreen/30 flex items-center justify-center text-limeGreen font-bold">
              <i data-lucide="lock" class="w-5 h-5"></i>
            </div>
            <div>
              <h3 class="font-bold text-lg text-white">ADMIN SECURITY</h3>
              <p class="text-[9px] text-limeGreen uppercase tracking-widest">ACCESS KEY REQUIRED</p>
            </div>
          </div>

          <form id="admin-login-form" class="space-y-4 font-sans text-xs">
            <div class="space-y-1.5">
              <label class="block font-futuristic text-[10px] font-semibold text-gray-300 tracking-wider">ENTER ACCESS PASSKEY</label>
              <input type="password" id="admin-passkey-input" placeholder="••••••••••••" required class="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-limeGreen transition-all text-center tracking-widest font-bold">
              <span id="admin-login-error" class="hidden text-[10px] text-red-400 font-futuristic pt-1">❌ INVALID ADMIN ACCESS KEY</span>
            </div>

            <div class="flex items-center gap-3 pt-2">
              <button type="submit" class="lime-glow-btn text-brandBg font-futuristic font-bold px-5 py-2.5 rounded-xl text-xs flex-1 text-center">
                DECRYPT ACCESS
              </button>
              <button type="button" id="cancel-admin-login-btn" class="metallic-border text-white font-futuristic font-bold px-4 py-2.5 rounded-xl text-xs">
                CANCEL
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.body.appendChild(loginModal);
    if (window.lucide) lucide.createIcons();

    const form = document.getElementById('admin-login-form');
    const input = document.getElementById('admin-passkey-input');
    const errorMsg = document.getElementById('admin-login-error');
    const loginBox = document.getElementById('admin-login-box');
    const closeBtn = document.getElementById('close-admin-login-modal');
    const cancelBtn = document.getElementById('cancel-admin-login-btn');

    const closeModal = () => {
      loginModal.classList.remove('open');
      showPublicSection();
    };

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (input.value === ADMIN_PASSKEY) {
        sessionStorage.setItem('mmg_admin_authenticated', 'true');
        loginModal.classList.remove('open');
        input.value = '';
        errorMsg.classList.add('hidden');
        showAdminSection();
        showMakeNotification('Admin access granted', 'success');
      } else {
        errorMsg.classList.remove('hidden');
        input.value = '';
        input.focus();
        gsap.fromTo(loginBox, { x: -10 }, { x: 10, duration: 0.1, repeat: 5, yoyo: true, onComplete: () => {
          gsap.set(loginBox, { x: 0 });
        }});
      }
    });
  }

  loginModal.classList.add('open');
  const input = document.getElementById('admin-passkey-input');
  if (input) {
    input.focus();
    const errorMsg = document.getElementById('admin-login-error');
    if (errorMsg) errorMsg.classList.add('hidden');
  }
}

if (tabPublicView && tabAdminView && publicSection && adminSection) {
  tabPublicView.addEventListener('click', showPublicSection);

  tabAdminView.addEventListener('click', () => {
    if (sessionStorage.getItem('mmg_admin_authenticated') === 'true') {
      showAdminSection();
    } else {
      promptAdminLogin();
    }
  });
}

// Public Filter Buttons
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');
    renderPublicGrid(filter);
  });
});

// Admin Controls
const adminSearchInput = document.getElementById('admin-search-input');
const adminCategoryFilter = document.getElementById('admin-category-filter');
const adminExportCsv = document.getElementById('admin-export-csv');
const adminResetDb = document.getElementById('admin-reset-db');

if (adminSearchInput) {
  adminSearchInput.addEventListener('input', () => renderAdminDashboard());
}
if (adminCategoryFilter) {
  adminCategoryFilter.addEventListener('change', () => renderAdminDashboard());
}
if (adminResetDb) {
  adminResetDb.addEventListener('click', () => {
    if (confirm('Reset feedback database to default telemetry items?')) {
      feedbackList = [...defaultFeedbacks];
      saveFeedbackDB();
    }
  });
}

if (adminExportCsv) {
  adminExportCsv.addEventListener('click', () => {
    if (feedbackList.length === 0) {
      alert('No review data available for CSV export.');
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,ID,Client Name,Title,Category,Rating,Feedback Text,Featured,Date\n";
    feedbackList.forEach(f => {
      const row = [
        f.id,
        `"${f.name}"`,
        `"${f.title}"`,
        f.categoryLabel || f.category,
        f.rating || 5,
        `"${f.text.replace(/"/g, '""')}"`,
        f.featured ? "YES" : "NO",
        f.date || "2026-07-20"
      ].join(",");
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `mmg_gmb_feedback_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}

// Modal Form Submit
const openModalBtn = document.getElementById('open-feedback-modal');
const closeModalBtn = document.getElementById('close-feedback-modal');
const modalOverlay = document.getElementById('feedback-modal-overlay');
const reviewForm = document.getElementById('review-submit-form');

if (openModalBtn && modalOverlay) {
  openModalBtn.addEventListener('click', () => modalOverlay.classList.add('open'));
}
if (closeModalBtn && modalOverlay) {
  closeModalBtn.addEventListener('click', () => modalOverlay.classList.remove('open'));
}

if (reviewForm && modalOverlay) {
  reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('review-name')?.value || 'Verified Client';
    const title = document.getElementById('review-title')?.value || 'Client';
    const service = document.getElementById('review-service')?.value || 'smm';
    const text = document.getElementById('review-text')?.value || 'Great experience working with Medimusicagrow!';

    const serviceLabels = {
      'video-editing': 'VIDEO EDITING',
      'web-dev': 'WEB DEV',
      'meta-ads': 'META ADS',
      'smm': 'SMM ORBIT'
    };

    const newItem = {
      id: `fb-${Date.now()}`,
      name,
      title,
      category: service,
      categoryLabel: serviceLabels[service] || service.toUpperCase(),
      rating: 5,
      text,
      featured: true,
      verified: true,
      date: new Date().toISOString().split('T')[0]
    };

    feedbackList.unshift(newItem);
    saveFeedbackDB();

    // Dispatch payload to Make.com Webhook
    sendToMakeWebhook({
      event: 'gmb_review_submitted',
      timestamp: new Date().toISOString(),
      source: 'Medimusicagrow Website - Feedback Portal',
      reviewer_name: name,
      reviewer_title: title,
      service_rated: serviceLabels[service] || service,
      rating: 5,
      review_text: text
    });

    modalOverlay.classList.remove('open');
    alert('Thank you! Your verified GMB feedback has been published to the system.');
    reviewForm.reset();
  });
}

// Initialize on page load
loadFeedbackDB();
renderAllFeedbackViews();

/* ==========================================================================
   TRAINING CURRICULUM ACCORDION (Training Page)
   ========================================================================== */
const curriculumTriggers = document.querySelectorAll('.curriculum-trigger');
curriculumTriggers.forEach(trigger => {
  trigger.addEventListener('click', () => {
    const content = trigger.nextElementSibling;
    const icon = trigger.querySelector('.lucide-chevron-down');
    
    // Close other triggers
    const openContents = document.querySelectorAll('.curriculum-content.open');
    openContents.forEach(openContent => {
      if (openContent !== content) {
        openContent.classList.remove('open');
        const siblingIcon = openContent.previousElementSibling.querySelector('.lucide-chevron-down');
        if (siblingIcon) gsap.to(siblingIcon, { rotation: 0, duration: 0.3 });
      }
    });

    content.classList.toggle('open');
    if (content.classList.contains('open')) {
      gsap.to(icon, { rotation: 180, duration: 0.3 });
    } else {
      gsap.to(icon, { rotation: 0, duration: 0.3 });
    }
  });
});

/* ==========================================================================
   CONTACT FORM DISCOVERY CALL HANDLER
   ========================================================================== */
const form = document.getElementById('discovery-form');
const successScreen = document.getElementById('success-screen');
const successResetBtn = document.getElementById('success-reset-btn');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('contact-name')?.value || '';
    const email = document.getElementById('contact-email')?.value || '';
    const service = document.getElementById('contact-service')?.value || '';
    const channel = document.getElementById('contact-channel')?.value || '';
    const message = document.getElementById('contact-message')?.value || '';

    // Dispatch payload to Make.com Webhook
    sendToMakeWebhook({
      event: 'contact_lead_submitted',
      timestamp: new Date().toISOString(),
      source: 'Medimusicagrow Website - Discovery Call',
      client_name: name,
      email: email,
      service_required: service,
      channel_link: channel,
      message_summary: message
    });

    // Save lead details locally in localStorage
    try {
      const savedLeads = JSON.parse(localStorage.getItem('mmg_leads_db') || '[]');
      savedLeads.unshift({
        id: `lead-${Date.now()}`,
        name,
        email,
        service,
        channel,
        message,
        date: new Date().toISOString().split('T')[0]
      });
      localStorage.setItem('mmg_leads_db', JSON.stringify(savedLeads));
    } catch(err) {}

    if (successScreen) {
      successScreen.classList.remove('pointer-events-none');
      gsap.fromTo(successScreen, {
        y: '100%',
        opacity: 0
      }, {
        y: '0%',
        opacity: 1,
        duration: 0.6,
        ease: "power3.out"
      });
    }
  });
}

if (successResetBtn && successScreen && form) {
  successResetBtn.addEventListener('click', () => {
    form.reset();
    gsap.to(successScreen, {
      y: '100%',
      opacity: 0,
      duration: 0.4,
      ease: "power3.in",
      onComplete: () => {
        successScreen.classList.add('pointer-events-none');
      }
    });
  });
}

/* ==========================================================================
   MAKE.COM WEBHOOK INTEGRATION ENGINE
   ========================================================================== */
const DEFAULT_MAKE_WEBHOOK_URL = 'https://hook.us2.make.com/4qstg7a9y8z89536mqxgdq4gjfcm4uys';

function getMakeWebhookUrl() {
  return localStorage.getItem('mmg_make_webhook_url') || DEFAULT_MAKE_WEBHOOK_URL;
}

function saveMakeWebhookUrl(url) {
  if (url) {
    localStorage.setItem('mmg_make_webhook_url', url.trim());
  }
}

async function sendToMakeWebhook(payload) {
  const webhookUrl = getMakeWebhookUrl();
  console.log('[Make.com Integration] Dispatching payload to Make.com:', webhookUrl, payload);
  
  showMakeNotification('Dispatched lead payload to Make.com Scenario...', 'sending');

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    console.log('[Make.com Integration] Webhook Response Status:', res.status);
    showMakeNotification(`Make.com Webhook Received Payload (Status: ${res.status})`, 'success');
    return true;
  } catch (err) {
    console.warn('[Make.com Integration Note] Network dispatch notice:', err.message);
    showMakeNotification('Form saved locally & payload queued for Make.com', 'info');
    return false;
  }
}

function showMakeNotification(msg, type = 'info') {
  let toast = document.getElementById('make-toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'make-toast-notification';
    toast.className = 'fixed bottom-6 right-6 z-50 bg-zinc-950/95 border border-limeGreen/40 text-white font-futuristic text-xs px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 transition-all duration-300 transform translate-y-10 opacity-0 pointer-events-none';
    document.body.appendChild(toast);
  }

  const iconClass = type === 'success' ? 'text-limeGreen' : (type === 'sending' ? 'text-yellow-400 animate-spin' : 'text-limeGreen');
  const icon = type === 'sending' ? 'refresh-cw' : 'zap';

  toast.innerHTML = `
    <span class="w-7 h-7 rounded-xl bg-limeGreen/10 border border-limeGreen/30 flex items-center justify-center ${iconClass}">
      <i data-lucide="${icon}" class="w-4 h-4"></i>
    </span>
    <div>
      <p class="font-bold text-white tracking-wider text-[11px]">MAKE.COM INTEGRATION</p>
      <p class="text-[10px] text-gray-300 font-sans font-light">${msg}</p>
    </div>
  `;

  if (window.lucide) lucide.createIcons();

  toast.classList.remove('translate-y-10', 'opacity-0', 'pointer-events-none');
  
  setTimeout(() => {
    toast.classList.add('translate-y-10', 'opacity-0', 'pointer-events-none');
  }, 4000);
}

function initMakeModal() {
  if (!document.getElementById('make-config-modal-overlay')) {
    const modal = document.createElement('div');
    modal.id = 'make-config-modal-overlay';
    modal.className = 'feedback-modal-overlay';
    modal.innerHTML = `
      <div class="feedback-modal-box w-full max-w-md bg-zinc-950 border border-limeGreen/30 rounded-3xl p-8 shadow-2xl relative font-futuristic text-left">
        <button id="close-make-modal" class="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors" title="Close Modal">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>

        <div class="space-y-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-limeGreen/10 border border-limeGreen/30 flex items-center justify-center text-limeGreen font-bold">
              ⚡
            </div>
            <div>
              <h3 class="font-bold text-lg text-white">MAKE.COM WEBHOOK</h3>
              <p class="text-[9px] text-limeGreen uppercase tracking-widest">LIVE FORM PAYLOAD DISPATCHER</p>
            </div>
          </div>

          <div class="space-y-4 font-sans text-xs">
            <div class="space-y-1.5">
              <label class="block font-futuristic text-[10px] font-semibold text-gray-300 tracking-wider">YOUR MAKE.COM WEBHOOK URL</label>
              <input type="text" id="make-url-input" placeholder="https://hook.eu1.make.com/your_webhook_id" class="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-limeGreen transition-all font-mono text-[11px]">
            </div>

            <p class="text-[10px] text-gray-400 font-light leading-relaxed">
              When visitors submit the Contact Discovery Form or GMB Reviews, real-time JSON payloads will be posted to this Make.com URL to trigger your automated scenarios.
            </p>

            <div class="flex items-center gap-3 pt-2">
              <button id="save-make-url-btn" class="lime-glow-btn text-brandBg font-futuristic font-bold px-5 py-2.5 rounded-xl text-xs flex-1 text-center">
                SAVE WEBHOOK URL
              </button>
              <button id="test-make-url-btn" class="metallic-border text-white font-futuristic font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1">
                TEST PING
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    if (window.lucide) lucide.createIcons();
  }

  const input = document.getElementById('make-url-input');
  if (input) {
    input.value = getMakeWebhookUrl();
  }

  document.querySelectorAll('.open-make-modal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const overlay = document.getElementById('make-config-modal-overlay');
      if (overlay) overlay.classList.add('open');
    });
  });

  const closeBtn = document.getElementById('close-make-modal');
  const overlay = document.getElementById('make-config-modal-overlay');
  const saveBtn = document.getElementById('save-make-url-btn');
  const testBtn = document.getElementById('test-make-url-btn');

  if (closeBtn && overlay) {
    closeBtn.addEventListener('click', () => overlay.classList.remove('open'));
  }

  if (saveBtn && input) {
    saveBtn.addEventListener('click', () => {
      saveMakeWebhookUrl(input.value);
      alert('Make.com Webhook URL saved successfully!');
      if (overlay) overlay.classList.remove('open');
    });
  }

  if (testBtn && input) {
    testBtn.addEventListener('click', () => {
      const url = input.value || getMakeWebhookUrl();
      saveMakeWebhookUrl(url);
      sendToMakeWebhook({
        event: 'test_webhook_ping',
        timestamp: new Date().toISOString(),
        source: 'Medimusicagrow Webhook Setup Test',
        message: 'Hello from Medimusicagrow website! Integration active.'
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initMakeModal();
});

/* ==========================================================================
   BOOKED LEADS TELEMETRY MODULE
   ========================================================================== */
function renderAdminLeads() {
  const tableBody = document.getElementById('admin-leads-table-body');
  if (!tableBody) return;

  let leads = [];
  try {
    leads = JSON.parse(localStorage.getItem('mmg_leads_db') || '[]');
  } catch(e) {
    leads = [];
  }

  tableBody.innerHTML = '';

  if (leads.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-gray-500 py-8 font-futuristic text-xs">NO LEAD AUDITS REGISTERED IN LOCAL STORAGE DATABASE.</td></tr>`;
    return;
  }

  leads.forEach(lead => {
    const tr = document.createElement('tr');
    tr.className = "hover:bg-white/[0.02] transition-colors";
    
    tr.innerHTML = `
      <td class="py-3 px-4 font-bold text-white font-futuristic text-xs">
        ${lead.name}
      </td>
      <td class="py-3 px-4 text-limeGreen font-mono">
        ${lead.email}
      </td>
      <td class="py-3 px-4">
        <span class="text-[9px] font-futuristic bg-white/5 border border-white/10 px-2 py-1 rounded text-gray-300 uppercase">${lead.service}</span>
      </td>
      <td class="py-3 px-4 text-gray-400 max-w-xs truncate" title="${lead.channel || ''}">
        ${lead.channel || 'N/A'}
      </td>
      <td class="py-3 px-4 text-gray-300 max-w-md truncate" title="${lead.message || ''}">
        "${lead.message || 'N/A'}"
      </td>
      <td class="py-3 px-4 text-right">
        <button data-action="delete-lead" data-id="${lead.id}" class="p-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors" title="Delete Lead">
          <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
        </button>
      </td>
    `;

    tableBody.appendChild(tr);
  });

  if (window.lucide) lucide.createIcons();

  tableBody.querySelectorAll('button[data-action="delete-lead"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      if (confirm('Purge this booked form detail?')) {
        let currentLeads = JSON.parse(localStorage.getItem('mmg_leads_db') || '[]');
        currentLeads = currentLeads.filter(l => l.id !== id);
        localStorage.setItem('mmg_leads_db', JSON.stringify(currentLeads));
        renderAdminLeads();
      }
    });
  });
}

function initAdminSubtabs() {
  const btnReviews = document.getElementById('admin-subtab-reviews');
  const btnLeads = document.getElementById('admin-subtab-leads');
  const secReviews = document.getElementById('admin-reviews-section');
  const secLeads = document.getElementById('admin-leads-section');

  if (btnReviews && btnLeads && secReviews && secLeads) {
    btnReviews.addEventListener('click', () => {
      btnReviews.className = "text-xs font-futuristic font-bold px-4 py-2 border-b-2 border-limeGreen text-white transition-all";
      btnLeads.className = "text-xs font-futuristic font-bold px-4 py-2 border-b-2 border-transparent text-gray-500 hover:text-white transition-all";
      
      secReviews.classList.remove('hidden');
      secLeads.classList.add('hidden');
      gsap.fromTo(secReviews, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 });
    });

    btnLeads.addEventListener('click', () => {
      btnLeads.className = "text-xs font-futuristic font-bold px-4 py-2 border-b-2 border-limeGreen text-white transition-all";
      btnReviews.className = "text-xs font-futuristic font-bold px-4 py-2 border-b-2 border-transparent text-gray-500 hover:text-white transition-all";
      
      secLeads.classList.remove('hidden');
      secReviews.classList.add('hidden');
      renderAdminLeads();
      gsap.fromTo(secLeads, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 });
    });

    const btnLock = document.getElementById('admin-lock-btn');
    if (btnLock) {
      btnLock.addEventListener('click', () => {
        if (confirm('Lock admin panel access?')) {
          sessionStorage.removeItem('mmg_admin_authenticated');
          showPublicSection();
          showMakeNotification('Admin access locked', 'info');
        }
      });
    }
  }

  const btnExportLeads = document.getElementById('admin-export-leads-csv');
  if (btnExportLeads) {
    btnExportLeads.addEventListener('click', () => {
      const currentLeads = JSON.parse(localStorage.getItem('mmg_leads_db') || '[]');
      if (currentLeads.length === 0) {
        alert('No leads data available for CSV export.');
        return;
      }

      let csvContent = "data:text/csv;charset=utf-8,ID,Client Name,Email,Service,Channel Link,Objectives,Date Booked\n";
      currentLeads.forEach(l => {
        const row = [
          l.id,
          `"${l.name}"`,
          `"${l.email}"`,
          l.service,
          `"${(l.channel || '').replace(/"/g, '""')}"`,
          `"${(l.message || '').replace(/"/g, '""')}"`,
          l.date || ""
        ].join(",");
        csvContent += row + "\n";
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `medimusicagrow_booked_leads_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  const btnClearLeads = document.getElementById('admin-clear-leads');
  if (btnClearLeads) {
    btnClearLeads.addEventListener('click', () => {
      if (confirm('WARNING: Are you sure you want to permanently purge all booked lead records?')) {
        localStorage.setItem('mmg_leads_db', '[]');
        renderAdminLeads();
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initAdminSubtabs();
  if (document.getElementById('admin-leads-table-body')) {
    renderAdminLeads();
  }
});
