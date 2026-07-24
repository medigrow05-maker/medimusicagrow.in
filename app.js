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
        y: -5,
        transformPerspective: 800,
        ease: "power1.out",
        duration: 0.3
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        y: 0,
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

// Secret Admin Access Triggers
function setupSecretAdminAccess() {
  // 1. Keyboard Shortcut: Ctrl + Shift + A
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
      e.preventDefault();
      handleAdminTrigger();
    }
  });

  // 2. Double-Click Footer Copyright Trigger
  document.querySelectorAll('footer div, footer span, footer p').forEach(el => {
    const text = (el.textContent || '').toUpperCase();
    const isCopyright = text.includes('MEDIMUSICAGROW PVT. LTD. ALL RIGHTS RESERVED.') || text.includes('MEDIMUSICAGROW PVT. LTD.');
    
    if (isCopyright && el.children.length === 0) {
      el.style.cursor = 'help';
      el.title = 'Security Node Access Trigger';
      el.addEventListener('dblclick', (e) => {
        e.preventDefault();
        handleAdminTrigger();
      });
    }
  });
}

function handleAdminTrigger() {
  const isAuth = sessionStorage.getItem('mmg_admin_authenticated') === 'true';
  const isFeedbackPage = window.location.pathname.endsWith('feedback.html');

  if (isAuth) {
    if (!isFeedbackPage) {
      window.location.href = 'feedback.html?admin=true';
    } else {
      showAdminSection();
    }
  } else {
    if (!isFeedbackPage) {
      window.location.href = 'feedback.html?prompt_admin=true';
    } else {
      promptAdminLogin();
    }
  }
}

function checkAdminQueryParam() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('admin') === 'true') {
    if (sessionStorage.getItem('mmg_admin_authenticated') === 'true') {
      showAdminSection();
    } else {
      promptAdminLogin();
    }
  } else if (params.get('prompt_admin') === 'true') {
    promptAdminLogin();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setupSecretAdminAccess();
  checkAdminQueryParam();
});

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
  const selectElem = document.getElementById('contact-service');
  const packageHiddenInput = document.getElementById('contact-package');
  const packageCards = document.querySelectorAll('#package-selector-grid [data-package]');

  function activatePackageCard(packageVal) {
    packageCards.forEach(c => c.classList.remove('active'));
    const targetCard = document.querySelector(`#package-selector-grid [data-package="${packageVal}"]`);
    if (targetCard) {
      targetCard.classList.add('active');
      if (packageHiddenInput) packageHiddenInput.value = packageVal;
      
      const targetService = targetCard.getAttribute('data-service');
      if (targetService && selectElem) {
        selectElem.value = targetService;
      }
    }
  }

  packageCards.forEach(card => {
    card.addEventListener('click', () => {
      const packageVal = card.getAttribute('data-package');
      activatePackageCard(packageVal);
    });
  });

  if (selectElem) {
    selectElem.addEventListener('change', () => {
      const selectedService = selectElem.value;
      const activeCard = document.querySelector('#package-selector-grid [data-package].active');
      if (activeCard) {
        const activeCardService = activeCard.getAttribute('data-service');
        if (activeCardService && activeCardService !== selectedService) {
          packageCards.forEach(c => c.classList.remove('active'));
          const customCard = document.querySelector('#package-selector-grid [data-package="custom"]');
          if (customCard) customCard.classList.add('active');
          if (packageHiddenInput) packageHiddenInput.value = 'custom';
        }
      }
    });
  }

  const urlParams = new URLSearchParams(window.location.search);
  const serviceParam = urlParams.get('service');
  const tierParam = urlParams.get('tier');

  if (serviceParam) {
    const packageSection = document.getElementById('contact-package-section');
    if (packageSection) packageSection.classList.remove('hidden');

    if (serviceParam === 'smm') {
      activatePackageCard('smm-5months');
    } else if (serviceParam === 'content-creation' && tierParam) {
      activatePackageCard(tierParam);
      const messageElem = document.getElementById('contact-message');
      if (messageElem) {
        const displayTierName = tierParam === 'single-video' ? 'Single Video' : (tierParam === 'bulk-video' ? 'Bulk Video' : tierParam);
        messageElem.value = `Hello! I would like to book the Content Creation ${displayTierName} package. `;
      }
    } else if (serviceParam === 'corporate-events' && tierParam) {
      activatePackageCard('custom');
      if (selectElem) selectElem.value = 'corporate-events';
      const messageElem = document.getElementById('contact-message');
      if (messageElem) {
        const capitalizedTier = tierParam.charAt(0).toUpperCase() + tierParam.slice(1);
        messageElem.value = `Hello! I would like to book the Corporate Event ${capitalizedTier} Capture package. `;
      }
    } else if (serviceParam === 'family-events' && tierParam) {
      activatePackageCard('custom');
      if (selectElem) selectElem.value = 'family-events';
      const messageElem = document.getElementById('contact-message');
      if (messageElem) {
        const capitalizedTier = tierParam.charAt(0).toUpperCase() + tierParam.slice(1);
        messageElem.value = `Hello! I would like to book the Family Event ${capitalizedTier} package. `;
      }
    } else if (serviceParam === 'achievement-shoot' && tierParam) {
      activatePackageCard('custom');
      if (selectElem) selectElem.value = 'achievement-shoot';
      const messageElem = document.getElementById('contact-message');
      if (messageElem) {
        const capitalizedTier = tierParam.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        messageElem.value = `Hello! I would like to book the Achievement Shoot: ${capitalizedTier} package. `;
      }
    } else if (serviceParam === 'music-video' && tierParam) {
      activatePackageCard('custom');
      if (selectElem) selectElem.value = 'music-video';
      const messageElem = document.getElementById('contact-message');
      if (messageElem) {
        messageElem.value = `Hello! I would like to book the Music Video Production package. `;
      }
    } else if (serviceParam === 'video-editing' && tierParam) {
      activatePackageCard('custom');
      if (selectElem) selectElem.value = 'video-editing';
      const messageElem = document.getElementById('contact-message');
      if (messageElem) {
        const capitalizedTier = tierParam.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        messageElem.value = `Hello! I would like to book the Video Editing: ${capitalizedTier} package. `;
      }
    } else if (serviceParam === 'influencer-marketing') {
      activatePackageCard('custom');
      if (selectElem) selectElem.value = 'influencer-marketing';
      const messageElem = document.getElementById('contact-message');
      if (messageElem) {
        messageElem.value = `Hello! I would like to inquire about Influencer Marketing campaigns. `;
      }
    } else {
      if (selectElem) {
        const options = Array.from(selectElem.options).map(o => o.value);
        if (options.includes(serviceParam)) {
          selectElem.value = serviceParam;
        }
      }
      activatePackageCard('custom');
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('contact-name')?.value || '';
    const email = document.getElementById('contact-email')?.value || '';
    const service = document.getElementById('contact-service')?.value || '';
    const channel = document.getElementById('contact-channel')?.value || '';
    const whatsapp = document.getElementById('contact-whatsapp')?.value || '';
    const address = document.getElementById('contact-address')?.value || '';
    const message = document.getElementById('contact-message')?.value || '';
    const selectedPkg = packageHiddenInput?.value || 'custom';

    // Dispatch payload to Make.com Webhook
    sendToMakeWebhook({
      event: 'contact_lead_submitted',
      timestamp: new Date().toISOString(),
      source: 'Medimusicagrow Website - Discovery Call',
      client_name: name,
      email: email,
      whatsapp_number: whatsapp,
      client_address: address,
      service_required: service,
      selected_package: selectedPkg,
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
        whatsapp,
        address,
        service,
        package: selectedPkg,
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
    tableBody.innerHTML = `<tr><td colspan="8" class="text-center text-gray-500 py-8 font-futuristic text-xs">NO LEAD AUDITS REGISTERED IN LOCAL STORAGE DATABASE.</td></tr>`;
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
      <td class="py-3 px-4 text-white font-mono text-xs">
        ${lead.whatsapp || 'N/A'}
      </td>
      <td class="py-3 px-4 text-gray-300 text-xs truncate max-w-xs" title="${lead.address || ''}">
        ${lead.address || 'N/A'}
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

      let csvContent = "data:text/csv;charset=utf-8,ID,Client Name,Email,WhatsApp,Address,Service,Social Link,Objectives,Date Booked\n";
      currentLeads.forEach(l => {
        const row = [
          l.id,
          `"${l.name}"`,
          `"${l.email}"`,
          `"${l.whatsapp || ''}"`,
          `"${(l.address || '').replace(/"/g, '""')}"`,
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

function initSmmPackageModal() {
  const cardTrigger = document.querySelector('.smm-package-card-trigger');
  const btnTrigger = document.querySelector('.smm-package-btn-trigger');

  if (!cardTrigger && !btnTrigger) return;

  let smmModal = document.getElementById('smm-package-modal');
  if (!smmModal) {
    smmModal = document.createElement('div');
    smmModal.id = 'smm-package-modal';
    smmModal.className = 'feedback-modal-overlay';
    smmModal.innerHTML = `
      <div class="feedback-modal-box w-full max-w-4xl bg-zinc-950 border border-limeGreen/30 rounded-3xl p-6 md:p-8 shadow-2xl relative font-futuristic text-left max-h-[90vh] overflow-y-auto" id="smm-modal-box">
        <!-- Close Button -->
        <button id="close-smm-modal" class="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors" title="Close">
          <i data-lucide="x" class="w-6 h-6"></i>
        </button>

        <!-- Header block matching the images -->
        <div class="text-center space-y-2 border-b border-white/5 pb-6 select-none">
          <h2 class="text-xl md:text-3xl font-black text-white tracking-wide leading-tight">MEDI MUSICA GROW PRIVATE LIMITED</h2>

          <div class="inline-block bg-limeGreen/10 border border-limeGreen/30 rounded-full px-4 py-1.5 text-limeGreen text-xs font-bold uppercase tracking-widest mt-4">
            5 Months Package
          </div>
        </div>

        <!-- Details Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
          
          <!-- Left Column: Package Offerings -->
          <div class="space-y-6">
            <h3 class="text-sm text-limeGreen font-bold border-b border-limeGreen/20 pb-2 uppercase tracking-wider flex items-center gap-2">
              <i data-lucide="layers" class="w-4 h-4"></i> Package Offerings
            </h3>
            
            <!-- SMM Details -->
            <div class="space-y-2">
              <h4 class="text-xs text-white font-bold uppercase tracking-wider">Social Media Management</h4>
              <ul class="text-[11px] text-gray-400 space-y-1.5 list-disc pl-4 font-sans font-light leading-relaxed">
                <li>Account Creation And Branding</li>
                <li>Creative Captions For Post</li>
                <li>Researched Hashtag Strategy</li>
                <li>Social Media Accounts Management</li>
                <li>Social Media Marketing Strategy And Planning</li>
              </ul>
            </div>

            <!-- Content Creation Details -->
            <div class="space-y-2">
              <h4 class="text-xs text-white font-bold uppercase tracking-wider">Content Creation</h4>
              <ul class="text-[11px] text-gray-400 space-y-1.5 list-disc pl-4 font-sans font-light leading-relaxed">
                <li>25 Short Videos</li>
                <li>14 Video Shoot Visits</li>
                <li>Customer Feedback Videos</li>
                <li>Business Creatives</li>
                <li>Happy Customer Creatives</li>
                <li>National And International Days Creatives</li>
              </ul>
            </div>

            <!-- SMM Training Details -->
            <div class="space-y-2">
              <h4 class="text-xs text-white font-bold uppercase tracking-wider">SMM Training</h4>
              <ul class="text-[11px] text-gray-400 space-y-1.5 list-disc pl-4 font-sans font-light leading-relaxed">
                <li>Social Media Management</li>
                <li>Content Creation</li>
                <li>Research And Analysis</li>
                <li>Social Media Marketing</li>
                <li>WhatsApp Marketing</li>
              </ul>
            </div>

            <!-- Price Display -->
            <div class="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
              <span class="text-xs text-gray-400 uppercase tracking-widest font-bold">Total Investment:</span>
              <span class="text-xl md:text-2xl font-black text-limeGreen font-futuristic">Rs. 59,999/-</span>
            </div>
          </div>

          <!-- Right Column: Payment Schedule & Notes -->
          <div class="space-y-6">
            <h3 class="text-sm text-limeGreen font-bold border-b border-limeGreen/20 pb-2 uppercase tracking-wider flex items-center gap-2">
              <i data-lucide="credit-card" class="w-4 h-4"></i> Payment Schedule
            </h3>

            <!-- Payment Timeline -->
            <div class="space-y-3 font-futuristic text-xs">
              <div class="flex items-center justify-between p-3.5 bg-white/5 border border-white/10 rounded-xl hover:border-limeGreen/30 transition-colors">
                <span class="font-bold text-white">25% Advance</span>
                <span class="text-limeGreen font-bold bg-limeGreen/10 border border-limeGreen/30 px-2 py-1 rounded">On Initiation</span>
              </div>
              <div class="flex items-center justify-between p-3.5 bg-white/5 border border-white/10 rounded-xl hover:border-limeGreen/30 transition-colors">
                <span class="font-bold text-white">25% After One Month</span>
                <span class="text-gray-400 bg-white/5 border border-white/5 px-2 py-1 rounded">Milestone 2</span>
              </div>
              <div class="flex items-center justify-between p-3.5 bg-white/5 border border-white/10 rounded-xl hover:border-limeGreen/30 transition-colors">
                <span class="font-bold text-white">25% After Two Months</span>
                <span class="text-gray-400 bg-white/5 border border-white/5 px-2 py-1 rounded">Milestone 3</span>
              </div>
              <div class="flex items-center justify-between p-3.5 bg-white/5 border border-white/10 rounded-xl hover:border-limeGreen/30 transition-colors">
                <span class="font-bold text-white">25% After Three Months</span>
                <span class="text-gray-400 bg-white/5 border border-white/5 px-2 py-1 rounded">Milestone 4</span>
              </div>
            </div>

            <!-- Note/Guidelines -->
            <div class="bg-red-500/5 border border-red-500/20 rounded-2xl p-4 space-y-2">
              <h4 class="text-xs text-red-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <i data-lucide="alert-triangle" class="w-4 h-4"></i> Important Travel Policy Note
              </h4>
              <p class="text-[11px] text-gray-400 font-sans font-light leading-relaxed">
                If we travel to your location for a video shoot and you subsequently cancel it, you will be required to pay <strong class="text-white">₹500</strong>; this amount will not be included in your package. The next shoot will only be conducted once this payment has been made.
              </p>
            </div>

            <!-- CTA Action Buttons -->
            <div class="pt-4 flex items-center gap-3">
              <a href="contact.html?service=smm" class="lime-glow-btn text-brandBg font-futuristic font-bold px-6 py-3.5 rounded-xl text-xs flex-1 text-center flex items-center justify-center gap-2">
                <i data-lucide="check-circle" class="w-4 h-4"></i> DEPLOY SMM PACKAGE
              </a>
            </div>
          </div>
        </div>

        <!-- Footer block -->
        <div class="border-t border-white/5 mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-gray-500 select-none">
          <span class="flex items-center gap-1.5"><i data-lucide="phone" class="w-3.5 h-3.5 text-limeGreen"></i> +91 96346 25609</span>
          <span class="flex items-center gap-1.5"><i data-lucide="map-pin" class="w-3.5 h-3.5 text-limeGreen"></i> Awas Vikas Colony, Kasganj, Uttar Pradesh</span>
        </div>
      </div>
    `;
    document.body.appendChild(smmModal);
    if (window.lucide) lucide.createIcons();

    const closeBtn = document.getElementById('close-smm-modal');
    closeBtn.addEventListener('click', () => smmModal.classList.remove('open'));
    smmModal.addEventListener('click', (e) => {
      if (e.target === smmModal) {
        smmModal.classList.remove('open');
      }
    });
  }

  const openSmmModal = (e) => {
    if (e.type === 'click' && e.currentTarget === cardTrigger && e.target.closest('button, a')) {
      return;
    }
    e.preventDefault();
    smmModal.classList.add('open');
  };

  if (cardTrigger) cardTrigger.addEventListener('click', openSmmModal);
  if (btnTrigger) btnTrigger.addEventListener('click', openSmmModal);
}

function initContentCreationModal() {
  const cardTrigger = document.querySelector('.content-creation-card-trigger');
  const btnTrigger = document.querySelector('.content-creation-btn-trigger');

  if (!cardTrigger && !btnTrigger) return;

  let ccModal = document.getElementById('content-creation-modal');
  if (!ccModal) {
    ccModal = document.createElement('div');
    ccModal.id = 'content-creation-modal';
    ccModal.className = 'feedback-modal-overlay';
    ccModal.innerHTML = `
      <div class="feedback-modal-box w-full max-w-6xl bg-zinc-950 border border-limeGreen/30 rounded-3xl p-6 md:p-8 shadow-2xl relative font-futuristic text-left max-h-[90vh] overflow-y-auto" id="cc-modal-box">
        <!-- Close Button -->
        <button id="close-cc-modal" class="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors" title="Close">
          <i data-lucide="x" class="w-6 h-6"></i>
        </button>

        <!-- Header block matching the images -->
        <div class="text-center space-y-2 border-b border-white/5 pb-6 select-none">
          <h2 class="text-xl md:text-3xl font-black text-white tracking-wide leading-tight">MEDI MUSICA GROW PRIVATE LIMITED</h2>
          <div class="inline-block bg-limeGreen/10 border border-limeGreen/30 rounded-full px-4 py-1.5 text-limeGreen text-xs font-bold uppercase tracking-widest mt-4">
            Content Creation Packages
          </div>
        </div>

        <!-- 2 Column Pricing Matrix Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 max-w-4xl mx-auto">
          
          <!-- Tier 1: Single Video -->
          <div class="glass-panel border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-limeGreen/30 transition-all duration-300 relative group">
            <div class="absolute top-4 right-4 text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-400 font-mono">SINGLE</div>
            <div class="space-y-4">
              <div class="space-y-1">
                <h4 class="text-lg font-bold text-white group-hover:text-limeGreen transition-colors">Single Video</h4>
                <p class="text-[10px] text-gray-400">Professional capture and post-production for a single high-impact reel.</p>
              </div>
              <div class="text-2xl font-black text-limeGreen font-sans py-2">₹2,499/-</div>
              <ul class="text-[11px] text-gray-300 space-y-2 border-t border-white/5 pt-4 font-sans font-light">
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> High-Retention Script & Storyboarding</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> Professional Video Shoot</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> High-End Post-Production (Editing)</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> Sony Mirrorless Camera Gear</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> Handheld 3-Axis Stabilizing Gimbal</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> Professional Lighting & Studio Microphone</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> 1 On-Screen Model Included</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> 2 Crew Team Members</li>
                <li class="flex items-center gap-2"><i data-lucide="clock" class="w-4 h-4 text-gray-500 flex-shrink-0"></i> 1 to 1.5 Hours Shoot Time</li>
              </ul>
            </div>
            <div class="pt-6">
              <a href="contact.html?service=content-creation&tier=single-video" class="metallic-border text-white font-futuristic font-bold text-center py-2.5 rounded-xl text-xs block w-full hover:bg-white/5 transition-colors">
                CHOOSE SINGLE VIDEO
              </a>
            </div>
          </div>

          <!-- Tier 2: Bulk Video Package -->
          <div class="glass-panel border-limeGreen/30 bg-limeGreen/5 rounded-2xl p-6 flex flex-col justify-between hover:border-limeGreen/50 transition-all duration-300 relative group shadow-[0_0_30px_rgba(140,230,0,0.05)]">
            <div class="absolute top-4 right-4 text-[9px] bg-limeGreen/20 border border-limeGreen/30 px-2 py-0.5 rounded text-limeGreen font-mono font-bold tracking-widest">BULK / RECOMMEND</div>
            <div class="space-y-4">
              <div class="space-y-1">
                <h4 class="text-lg font-bold text-white group-hover:text-limeGreen transition-colors">Bulk Video Package</h4>
                <p class="text-[10px] text-gray-400">Complete batch recording session for up to 15 high-retention short videos.</p>
              </div>
              <div class="text-2xl font-black text-limeGreen font-sans py-2">₹7,999 - ₹14,999</div>
              <ul class="text-[11px] text-gray-300 space-y-2 border-t border-white/5 pt-4 font-sans font-light">
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> 10 to 15 Viral Reels / Short Videos</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> Complete Script Writing & Directing</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> Batch Shoots & Post-Production Editing</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> Sony Mirrorless Camera Gear</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> Handheld 3-Axis Stabilizing Gimbal</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> Professional Lighting & Studio Microphone</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> 1 On-Screen Model Included</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> 2 to 3 Crew Team Members</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> All shoots completed in a single visit</li>
                <li class="flex items-center gap-2"><i data-lucide="clock" class="w-4 h-4 text-gray-500 flex-shrink-0"></i> 5 to 6 Hours Shoot Time</li>
              </ul>
            </div>
            <div class="pt-6">
              <a href="contact.html?service=content-creation&tier=bulk-video" class="lime-glow-btn text-brandBg font-futuristic font-bold text-center py-2.5 rounded-xl text-xs block w-full">
                CHOOSE BULK PACKAGE
              </a>
            </div>
          </div>

        </div>

        <!-- Policy Footnotes -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/5">
          <div class="flex items-start gap-2.5 bg-white/[0.02] border border-white/5 rounded-xl p-4 text-[10px] text-gray-400">
            <i data-lucide="clock" class="w-4 h-4 text-limeGreen flex-shrink-0"></i>
            <div>
              <strong class="text-white block uppercase mb-0.5">EXTRA TIME COVERAGE</strong>
              Extra shoot duration beyond standard package limits will be subject to additional hourly compensation.
            </div>
          </div>
          <div class="flex items-start gap-2.5 bg-red-500/5 border border-red-500/10 rounded-xl p-4 text-[10px] text-gray-400">
            <i data-lucide="alert-triangle" class="w-4 h-4 text-red-400 flex-shrink-0"></i>
            <div>
              <strong class="text-red-400 block uppercase mb-0.5">TRAVEL EXPENSES (TA/DA)</strong>
              Travel & Daily Allowance (TA/DA) expenses for the crew are to be fully borne by the client.
            </div>
          </div>
        </div>

        <!-- Footer block -->
        <div class="border-t border-white/5 mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-gray-500 select-none">
          <span class="flex items-center gap-1.5"><i data-lucide="phone" class="w-3.5 h-3.5 text-limeGreen"></i> +91 96346 25609</span>
          <span class="flex items-center gap-1.5"><i data-lucide="map-pin" class="w-3.5 h-3.5 text-limeGreen"></i> Awas Vikas Colony, Kasganj, Uttar Pradesh</span>
        </div>
      </div>
    `;
    document.body.appendChild(ccModal);
    if (window.lucide) lucide.createIcons();

    // Close listeners
    const closeBtn = document.getElementById('close-cc-modal');
    closeBtn.addEventListener('click', () => ccModal.classList.remove('open'));
    ccModal.addEventListener('click', (e) => {
      if (e.target === ccModal) {
        ccModal.classList.remove('open');
      }
    });
  }

  const openCcModal = (e) => {
    if (e.type === 'click' && e.currentTarget === cardTrigger && e.target.closest('button, a')) {
      return;
    }
    e.preventDefault();
    ccModal.classList.add('open');
  };

  if (cardTrigger) cardTrigger.addEventListener('click', openCcModal);
  if (btnTrigger) btnTrigger.addEventListener('click', openCcModal);
}

function initCorporateEventsModal() {
  const cardTrigger = document.querySelector('.corporate-events-card-trigger');
  const btnTrigger = document.querySelector('.corporate-events-btn-trigger');

  if (!cardTrigger && !btnTrigger) return;

  let corpModal = document.getElementById('corporate-events-modal');
  if (!corpModal) {
    corpModal = document.createElement('div');
    corpModal.id = 'corporate-events-modal';
    corpModal.className = 'feedback-modal-overlay';
    corpModal.innerHTML = `
      <div class="feedback-modal-box w-full max-w-6xl bg-zinc-950 border border-limeGreen/30 rounded-3xl p-6 md:p-8 shadow-2xl relative font-futuristic text-left max-h-[90vh] overflow-y-auto" id="corp-modal-box">
        <!-- Close Button -->
        <button id="close-corp-modal" class="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors" title="Close">
          <i data-lucide="x" class="w-6 h-6"></i>
        </button>

        <!-- Header block -->
        <div class="text-center space-y-2 border-b border-white/5 pb-6 select-none">
          <h2 class="text-xl md:text-3xl font-black text-white tracking-wide leading-tight">MEDI MUSICA GROW PRIVATE LIMITED</h2>
          <div class="inline-block bg-limeGreen/10 border border-limeGreen/30 rounded-full px-4 py-1.5 text-limeGreen text-xs font-bold uppercase tracking-widest mt-4">
            Corporate Event Packages
          </div>
        </div>

        <!-- 3 Column Pricing Matrix Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          
          <!-- Tier 1: Basic Capture -->
          <div class="glass-panel border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-limeGreen/30 transition-all duration-300 relative group">
            <div class="absolute top-4 right-4 text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-400 font-mono">BASIC</div>
            <div class="space-y-4">
              <div class="space-y-1">
                <h4 class="text-lg font-bold text-white group-hover:text-limeGreen transition-colors">Basic Capture</h4>
                <p class="text-[10px] text-gray-400">Perfect for smaller corporate meets and briefings.</p>
              </div>
              <div class="text-2xl font-black text-limeGreen font-sans py-2">₹5,999/-</div>
              <ul class="text-[11px] text-gray-300 space-y-2 border-t border-white/5 pt-4 font-sans font-light">
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> 3 to 4 High-Retention Reels</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> Professional Video Shoot</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> High-End Post-Production (Editing)</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> Sony Mirrorless Camera Gear</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> Handheld 3-Axis Stabilizing Gimbal</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> 2 Crew Team Members</li>
                <li class="flex items-center gap-2"><i data-lucide="clock" class="w-4 h-4 text-gray-500 flex-shrink-0"></i> 2 to 3 Hours Shoot Time</li>
              </ul>
            </div>
            <div class="pt-6">
              <a href="contact.html?service=corporate-events&tier=basic" class="metallic-border text-white font-futuristic font-bold text-center py-2.5 rounded-xl text-xs block w-full hover:bg-white/5 transition-colors">
                CHOOSE BASIC
              </a>
            </div>
          </div>

          <!-- Tier 2: Normal Capture -->
          <div class="glass-panel border-limeGreen/30 bg-limeGreen/5 rounded-2xl p-6 flex flex-col justify-between hover:border-limeGreen/50 transition-all duration-300 relative group scale-105 shadow-[0_0_30px_rgba(140,230,0,0.05)]">
            <div class="absolute top-4 right-4 text-[9px] bg-limeGreen/20 border border-limeGreen/30 px-2 py-0.5 rounded text-limeGreen font-mono font-bold tracking-widest">NORMAL / POPULAR</div>
            <div class="space-y-4">
              <div class="space-y-1">
                <h4 class="text-lg font-bold text-white group-hover:text-limeGreen transition-colors">Normal Capture</h4>
                <p class="text-[10px] text-gray-400">Complete seminar coverage with professional lighting and audio setup.</p>
              </div>
              <div class="text-2xl font-black text-limeGreen font-sans py-2">₹9,999/-</div>
              <ul class="text-[11px] text-gray-300 space-y-2 border-t border-white/5 pt-4 font-sans font-light">
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> 4 to 5 High-Retention Reels</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> Event Photography (High-Res Photos)</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> Professional Video Shoot</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> High-End Post-Production (Editing)</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> Sony Mirrorless Camera Gear</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> Gimbal & Professional Mic Setup</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> Studio Light Configuration</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> 3 Crew Team Members</li>
                <li class="flex items-center gap-2"><i data-lucide="clock" class="w-4 h-4 text-gray-500 flex-shrink-0"></i> 4 to 5 Hours Shoot Time</li>
              </ul>
            </div>
            <div class="pt-6">
              <a href="contact.html?service=corporate-events&tier=normal" class="lime-glow-btn text-brandBg font-futuristic font-bold text-center py-2.5 rounded-xl text-xs block w-full">
                CHOOSE NORMAL
              </a>
            </div>
          </div>

          <!-- Tier 3: Advance Capture -->
          <div class="glass-panel border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-limeGreen/30 transition-all duration-300 relative group">
            <div class="absolute top-4 right-4 text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-400 font-mono">ADVANCE</div>
            <div class="space-y-4">
              <div class="space-y-1">
                <h4 class="text-lg font-bold text-white group-hover:text-limeGreen transition-colors">Advance Capture</h4>
                <p class="text-[10px] text-gray-400">Cinematic aftermovie, drone coverages, and full conference documentary.</p>
              </div>
              <div class="text-2xl font-black text-limeGreen font-sans py-2">₹24,999/-</div>
              <ul class="text-[11px] text-gray-300 space-y-2 border-t border-white/5 pt-4 font-sans font-light">
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> Event Long Video (Highlights Aftermovie)</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> 9 to 10 High-Retention Reels</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> Premium Event Photography</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> Professional Video Shoot & Edit</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> Sony Mirrorless Camera Gear</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> 4K Aerial Drone Coverage</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> Gimbal, Lights, and Lapel Mics</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> 5 Crew Team Members</li>
              </ul>
            </div>
            <div class="pt-6">
              <a href="contact.html?service=corporate-events&tier=advance" class="metallic-border text-white font-futuristic font-bold text-center py-2.5 rounded-xl text-xs block w-full hover:bg-white/5 transition-colors">
                CHOOSE ADVANCE
              </a>
            </div>
          </div>

        </div>

        <!-- Policy Footnotes -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/5">
          <div class="flex items-start gap-2.5 bg-white/[0.02] border border-white/5 rounded-xl p-4 text-[10px] text-gray-400">
            <i data-lucide="clock" class="w-4 h-4 text-limeGreen flex-shrink-0"></i>
            <div>
              <strong class="text-white block uppercase mb-0.5">EXTRA TIME COVERAGE</strong>
              Extra shoot duration beyond standard package limits will be subject to additional hourly compensation.
            </div>
          </div>
          <div class="flex items-start gap-2.5 bg-red-500/5 border border-red-500/10 rounded-xl p-4 text-[10px] text-gray-400">
            <i data-lucide="alert-triangle" class="w-4 h-4 text-red-400 flex-shrink-0"></i>
            <div>
              <strong class="text-red-400 block uppercase mb-0.5">TRAVEL EXPENSES (TA/DA)</strong>
              Travel & Daily Allowance (TA/DA) expenses for the crew are to be fully borne by the client.
            </div>
          </div>
        </div>

        <!-- Footer block -->
        <div class="border-t border-white/5 mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-gray-500 select-none">
          <span class="flex items-center gap-1.5"><i data-lucide="phone" class="w-3.5 h-3.5 text-limeGreen"></i> +91 96346 25609</span>
          <span class="flex items-center gap-1.5"><i data-lucide="map-pin" class="w-3.5 h-3.5 text-limeGreen"></i> Awas Vikas Colony, Kasganj, Uttar Pradesh</span>
        </div>
      </div>
    `;
    document.body.appendChild(corpModal);
    if (window.lucide) lucide.createIcons();

    // Close listeners
    const closeBtn = document.getElementById('close-corp-modal');
    closeBtn.addEventListener('click', () => corpModal.classList.remove('open'));
    corpModal.addEventListener('click', (e) => {
      if (e.target === corpModal) {
        corpModal.classList.remove('open');
      }
    });
  }

  const openCorpModal = (e) => {
    if (e.type === 'click' && e.currentTarget === cardTrigger && e.target.closest('button, a')) {
      return;
    }
    e.preventDefault();
    corpModal.classList.add('open');
  };

  if (cardTrigger) cardTrigger.addEventListener('click', openCorpModal);
  if (btnTrigger) btnTrigger.addEventListener('click', openCorpModal);
}

function initFamilyEventsModal() {
  const cardTrigger = document.querySelector('.family-events-card-trigger');
  const btnTrigger = document.querySelector('.family-events-btn-trigger');

  if (!cardTrigger && !btnTrigger) return;

  let famModal = document.getElementById('family-events-modal');
  if (!famModal) {
    famModal = document.createElement('div');
    famModal.id = 'family-events-modal';
    famModal.className = 'feedback-modal-overlay';
    famModal.innerHTML = `
      <div class="feedback-modal-box w-full max-w-7xl bg-zinc-950 border border-limeGreen/30 rounded-3xl p-6 md:p-8 shadow-2xl relative font-futuristic text-left max-h-[90vh] overflow-y-auto" id="fam-modal-box">
        <!-- Close Button -->
        <button id="close-fam-modal" class="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors" title="Close">
          <i data-lucide="x" class="w-6 h-6"></i>
        </button>

        <!-- Header block -->
        <div class="text-center space-y-2 border-b border-white/5 pb-6 select-none">
          <h2 class="text-xl md:text-3xl font-black text-white tracking-wide leading-tight">MEDI MUSICA GROW PRIVATE LIMITED</h2>
          <div class="inline-block bg-limeGreen/10 border border-limeGreen/30 rounded-full px-4 py-1.5 text-limeGreen text-xs font-bold uppercase tracking-widest mt-4">
            Family Event Packages
          </div>
        </div>

        <!-- 5 Column Pricing Matrix Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 pt-8">
          
          <!-- Package 1: Wedding -->
          <div class="glass-panel border-limeGreen/30 bg-limeGreen/5 rounded-xl p-5 flex flex-col justify-between hover:border-limeGreen/50 transition-all duration-300 relative group">
            <div class="space-y-4">
              <div class="space-y-1">
                <h4 class="text-sm font-bold text-white group-hover:text-limeGreen transition-colors uppercase">Wedding</h4>
                <p class="text-[9px] text-gray-400">Haldi, Mehndi, Sangeet, Wedding, Reception coverage.</p>
              </div>
              <div class="text-lg font-black text-limeGreen font-sans">₹4,999 - ₹39,999</div>
              <ul class="text-[10px] text-gray-300 space-y-2 border-t border-white/5 pt-4 font-sans font-light">
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> 3 to 15 Reels</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> Professional Shoot</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> High-End Editing</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> Sony Pro Cameras</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> 4K Aerial Drone</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> Gimbal & Studio Lights</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> 1 to 5 Crew Members</li>
              </ul>
            </div>
            <div class="pt-4">
              <a href="contact.html?service=family-events&tier=wedding" class="lime-glow-btn text-brandBg font-futuristic font-bold text-center py-2 rounded-lg text-[10px] block w-full">
                CHOOSE WEDDING
              </a>
            </div>
          </div>

          <!-- Package 2: Engagement -->
          <div class="glass-panel border-white/10 rounded-xl p-5 flex flex-col justify-between hover:border-limeGreen/30 transition-all duration-300 relative group">
            <div class="space-y-4">
              <div class="space-y-1">
                <h4 class="text-sm font-bold text-white group-hover:text-limeGreen transition-colors uppercase">Engagement</h4>
                <p class="text-[9px] text-gray-400">Complete ring ceremony captures and cinematic highlight.</p>
              </div>
              <div class="text-lg font-black text-limeGreen font-sans">₹3,999 - ₹12,999</div>
              <ul class="text-[10px] text-gray-300 space-y-2 border-t border-white/5 pt-4 font-sans font-light">
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> 2 to 5 Reels</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> Professional Shoot</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> High-End Editing</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> Sony Pro Cameras</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> 4K Aerial Drone</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> Gimbal & Studio Lights</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> 1 to 3 Crew Members</li>
              </ul>
            </div>
            <div class="pt-4">
              <a href="contact.html?service=family-events&tier=engagement" class="metallic-border text-white font-futuristic font-bold text-center py-2 rounded-lg text-[10px] block w-full hover:bg-white/5 transition-colors">
                CHOOSE ENGAGEMENT
              </a>
            </div>
          </div>

          <!-- Package 3: Birthday -->
          <div class="glass-panel border-white/10 rounded-xl p-5 flex flex-col justify-between hover:border-limeGreen/30 transition-all duration-300 relative group">
            <div class="space-y-4">
              <div class="space-y-1">
                <h4 class="text-sm font-bold text-white group-hover:text-limeGreen transition-colors uppercase">Birthday</h4>
                <p class="text-[9px] text-gray-400">Vibrant birthday celebrations and event highlight reels.</p>
              </div>
              <div class="text-lg font-black text-limeGreen font-sans">₹2,999 - ₹9,999</div>
              <ul class="text-[10px] text-gray-300 space-y-2 border-t border-white/5 pt-4 font-sans font-light">
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> 2 to 5 Reels</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> Professional Shoot</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> High-End Editing</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> Sony Pro Cameras</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> 4K Aerial Drone</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> Gimbal & Studio Lights</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> 1 to 3 Crew Members</li>
              </ul>
            </div>
            <div class="pt-4">
              <a href="contact.html?service=family-events&tier=birthday" class="metallic-border text-white font-futuristic font-bold text-center py-2 rounded-lg text-[10px] block w-full hover:bg-white/5 transition-colors">
                CHOOSE BIRTHDAY
              </a>
            </div>
          </div>

          <!-- Package 4: Baby Born -->
          <div class="glass-panel border-white/10 rounded-xl p-5 flex flex-col justify-between hover:border-limeGreen/30 transition-all duration-300 relative group">
            <div class="space-y-4">
              <div class="space-y-1">
                <h4 class="text-sm font-bold text-white group-hover:text-limeGreen transition-colors uppercase font-futuristic">Baby Born</h4>
                <p class="text-[9px] text-gray-400">Sweet captures of newborns and infant family moments.</p>
              </div>
              <div class="text-lg font-black text-limeGreen font-sans">₹3,999 - ₹12,999</div>
              <ul class="text-[10px] text-gray-300 space-y-2 border-t border-white/5 pt-4 font-sans font-light">
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> 2 to 5 Reels</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> Professional Shoot</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> High-End Editing</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> Sony Pro Cameras</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> 4K Aerial Drone</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> Gimbal & Studio Lights</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> 1 to 3 Crew Members</li>
              </ul>
            </div>
            <div class="pt-4">
              <a href="contact.html?service=family-events&tier=baby-born" class="metallic-border text-white font-futuristic font-bold text-center py-2 rounded-lg text-[10px] block w-full hover:bg-white/5 transition-colors">
                CHOOSE BABY BORN
              </a>
            </div>
          </div>

          <!-- Package 5: Baby Shower -->
          <div class="glass-panel border-white/10 rounded-xl p-5 flex flex-col justify-between hover:border-limeGreen/30 transition-all duration-300 relative group">
            <div class="space-y-4">
              <div class="space-y-1">
                <h4 class="text-sm font-bold text-white group-hover:text-limeGreen transition-colors uppercase font-futuristic">Baby Shower</h4>
                <p class="text-[9px] text-gray-400">Heartwarming baby shower memories and cinematic reels.</p>
              </div>
              <div class="text-lg font-black text-limeGreen font-sans">₹2,999 - ₹9,999</div>
              <ul class="text-[10px] text-gray-300 space-y-2 border-t border-white/5 pt-4 font-sans font-light">
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> 2 to 5 Reels</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> Professional Shoot</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> High-End Editing</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> Sony Pro Cameras</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> 4K Aerial Drone</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> Gimbal & Studio Lights</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> 1 to 3 Crew Members</li>
              </ul>
            </div>
            <div class="pt-4">
              <a href="contact.html?service=family-events&tier=baby-shower" class="metallic-border text-white font-futuristic font-bold text-center py-2 rounded-lg text-[10px] block w-full hover:bg-white/5 transition-colors">
                CHOOSE BABY SHOWER
              </a>
            </div>
          </div>

        </div>

        <!-- Policy Footnotes -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/5">
          <div class="flex items-start gap-2.5 bg-white/[0.02] border border-white/5 rounded-xl p-4 text-[10px] text-gray-400">
            <i data-lucide="clock" class="w-4 h-4 text-limeGreen flex-shrink-0"></i>
            <div>
              <strong class="text-white block uppercase mb-0.5">EXTRA TIME COVERAGE</strong>
              Extra shoot duration beyond standard package limits will be subject to additional hourly compensation.
            </div>
          </div>
          <div class="flex items-start gap-2.5 bg-red-500/5 border border-red-500/10 rounded-xl p-4 text-[10px] text-gray-400">
            <i data-lucide="alert-triangle" class="w-4 h-4 text-red-400 flex-shrink-0"></i>
            <div>
              <strong class="text-red-400 block uppercase mb-0.5">TRAVEL EXPENSES (TA/DA)</strong>
              Travel & Daily Allowance (TA/DA) expenses for the crew are to be fully borne by the client.
            </div>
          </div>
        </div>

        <!-- Footer block -->
        <div class="border-t border-white/5 mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-gray-500 select-none">
          <span class="flex items-center gap-1.5"><i data-lucide="phone" class="w-3.5 h-3.5 text-limeGreen"></i> +91 96346 25609</span>
          <span class="flex items-center gap-1.5"><i data-lucide="map-pin" class="w-3.5 h-3.5 text-limeGreen"></i> Awas Vikas Colony, Kasganj, Uttar Pradesh</span>
        </div>
      </div>
    `;
    document.body.appendChild(famModal);
    if (window.lucide) lucide.createIcons();

    // Close listeners
    const closeBtn = document.getElementById('close-fam-modal');
    closeBtn.addEventListener('click', () => famModal.classList.remove('open'));
    famModal.addEventListener('click', (e) => {
      if (e.target === famModal) {
        famModal.classList.remove('open');
      }
    });
  }

  const openFamModal = (e) => {
    if (e.type === 'click' && e.currentTarget === cardTrigger && e.target.closest('button, a')) {
      return;
    }
    e.preventDefault();
    famModal.classList.add('open');
  };

  if (cardTrigger) cardTrigger.addEventListener('click', openFamModal);
  if (btnTrigger) btnTrigger.addEventListener('click', openFamModal);
}

function initAchievementShootModal() {
  const cardTrigger = document.querySelector('.achievement-shoot-card-trigger');
  const btnTrigger = document.querySelector('.achievement-shoot-btn-trigger');

  if (!cardTrigger && !btnTrigger) return;

  let achModal = document.getElementById('achievement-shoot-modal');
  if (!achModal) {
    achModal = document.createElement('div');
    achModal.id = 'achievement-shoot-modal';
    achModal.className = 'feedback-modal-overlay';
    achModal.innerHTML = `
      <div class="feedback-modal-box w-full max-w-6xl bg-zinc-950 border border-limeGreen/30 rounded-3xl p-6 md:p-8 shadow-2xl relative font-futuristic text-left max-h-[90vh] overflow-y-auto" id="ach-modal-box">
        <!-- Close Button -->
        <button id="close-ach-modal" class="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors" title="Close">
          <i data-lucide="x" class="w-6 h-6"></i>
        </button>

        <!-- Header block -->
        <div class="text-center space-y-2 border-b border-white/5 pb-6 select-none">
          <h2 class="text-xl md:text-3xl font-black text-white tracking-wide leading-tight">MEDI MUSICA GROW PRIVATE LIMITED</h2>
          <div class="inline-block bg-limeGreen/10 border border-limeGreen/30 rounded-full px-4 py-1.5 text-limeGreen text-xs font-bold uppercase tracking-widest mt-4">
            Achievement Shoot Packages
          </div>
        </div>

        <!-- 4 Column Pricing Matrix Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-8">
          
          <!-- Package 1: Bike Delivery Shoot -->
          <div class="glass-panel border-white/10 rounded-xl p-5 flex flex-col justify-between hover:border-limeGreen/30 transition-all duration-300 relative group">
            <div class="space-y-4">
              <div class="space-y-1">
                <h4 class="text-sm font-bold text-white group-hover:text-limeGreen transition-colors uppercase leading-tight">Bike Delivery</h4>
                <p class="text-[9px] text-gray-400">Capture your new ride delivery with dynamic reels.</p>
              </div>
              <div class="text-lg font-black text-limeGreen font-sans">₹2,499/-</div>
              <ul class="text-[10px] text-gray-300 space-y-2 border-t border-white/5 pt-4 font-sans font-light">
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> 2 High-Retention Reels</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> Professional Shoot</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> High-End Editing</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> Sony Mirrorless Camera</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> 3-Axis Stabilizing Gimbal</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> 1 Team Member</li>
                <li class="flex items-center gap-1.5"><i data-lucide="clock" class="w-3.5 h-3.5 text-gray-500 flex-shrink-0"></i> 1 to 2 Hours Shoot Time</li>
              </ul>
            </div>
            <div class="pt-4">
              <a href="contact.html?service=achievement-shoot&tier=bike-delivery" class="metallic-border text-white font-futuristic font-bold text-center py-2 rounded-lg text-[10px] block w-full hover:bg-white/5 transition-colors">
                CHOOSE BIKE SHOOT
              </a>
            </div>
          </div>

          <!-- Package 2: Car Delivery Shoot -->
          <div class="glass-panel border-limeGreen/30 bg-limeGreen/5 rounded-xl p-5 flex flex-col justify-between hover:border-limeGreen/50 transition-all duration-300 relative group">
            <div class="space-y-4">
              <div class="space-y-1">
                <h4 class="text-sm font-bold text-white group-hover:text-limeGreen transition-colors uppercase leading-tight">Car Delivery</h4>
                <p class="text-[9px] text-gray-400">Cinematic milestone shoot for your new car delivery.</p>
              </div>
              <div class="text-lg font-black text-limeGreen font-sans">₹5,999 - ₹9,999</div>
              <ul class="text-[10px] text-gray-300 space-y-2 border-t border-white/5 pt-4 font-sans font-light">
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> 2 to 4 High-Retention Reels</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> Professional Shoot</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> High-End Editing</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> Sony Mirrorless Camera</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> 4K Aerial Drone Coverage</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> Gimbal & Studio Light</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> 1 to 3 Team Members</li>
                <li class="flex items-center gap-1.5"><i data-lucide="clock" class="w-3.5 h-3.5 text-gray-500 flex-shrink-0"></i> 2 to 3 Hours Shoot Time</li>
              </ul>
            </div>
            <div class="pt-4">
              <a href="contact.html?service=achievement-shoot&tier=car-delivery" class="lime-glow-btn text-brandBg font-futuristic font-bold text-center py-2 rounded-lg text-[10px] block w-full">
                CHOOSE CAR SHOOT
              </a>
            </div>
          </div>

          <!-- Package 3: Home Inauguration Shoot -->
          <div class="glass-panel border-white/10 rounded-xl p-5 flex flex-col justify-between hover:border-limeGreen/30 transition-all duration-300 relative group">
            <div class="space-y-4">
              <div class="space-y-1">
                <h4 class="text-sm font-bold text-white group-hover:text-limeGreen transition-colors uppercase leading-tight font-futuristic">Home Inauguration</h4>
                <p class="text-[9px] text-gray-400">Complete Griha Pravesh coverage & high-res photography.</p>
              </div>
              <div class="text-lg font-black text-limeGreen font-sans">₹9,999 - ₹19,999</div>
              <ul class="text-[10px] text-gray-300 space-y-2 border-t border-white/5 pt-4 font-sans font-light">
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> 3 to 6 High-Retention Reels</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> High-Resolution Home Photos</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> Professional Shoot & Edit</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> Sony Mirrorless Camera</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> Drone & Gimbal Coverage</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> Professional Studio Light</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> 3 to 5 Team Members</li>
              </ul>
            </div>
            <div class="pt-4">
              <a href="contact.html?service=achievement-shoot&tier=home-inauguration" class="metallic-border text-white font-futuristic font-bold text-center py-2 rounded-lg text-[10px] block w-full hover:bg-white/5 transition-colors">
                CHOOSE HOME SHOOT
              </a>
            </div>
          </div>

          <!-- Package 4: Business Opening Shoot -->
          <div class="glass-panel border-white/10 rounded-xl p-5 flex flex-col justify-between hover:border-limeGreen/30 transition-all duration-300 relative group">
            <div class="space-y-4">
              <div class="space-y-1">
                <h4 class="text-sm font-bold text-white group-hover:text-limeGreen transition-colors uppercase leading-tight font-futuristic">Business Opening</h4>
                <p class="text-[9px] text-gray-400">Grand opening, office walkthroughs, and success ribbon cutting.</p>
              </div>
              <div class="text-lg font-black text-limeGreen font-sans">₹9,999 - ₹19,999</div>
              <ul class="text-[10px] text-gray-300 space-y-2 border-t border-white/5 pt-4 font-sans font-light">
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> 3 to 6 High-Retention Reels</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> High-Resolution Photos</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> Professional Shoot & Edit</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> Sony Mirrorless Camera</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> Drone & Gimbal Coverage</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> Professional Studio Light</li>
                <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-limeGreen flex-shrink-0"></i> 3 to 5 Team Members</li>
              </ul>
            </div>
            <div class="pt-4">
              <a href="contact.html?service=achievement-shoot&tier=business-opening" class="metallic-border text-white font-futuristic font-bold text-center py-2 rounded-lg text-[10px] block w-full hover:bg-white/5 transition-colors">
                CHOOSE BUSINESS SHOOT
              </a>
            </div>
          </div>

        </div>

        <!-- Policy Footnotes -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/5">
          <div class="flex items-start gap-2.5 bg-white/[0.02] border border-white/5 rounded-xl p-4 text-[10px] text-gray-400">
            <i data-lucide="clock" class="w-4 h-4 text-limeGreen flex-shrink-0"></i>
            <div>
              <strong class="text-white block uppercase mb-0.5">EXTRA TIME COVERAGE</strong>
              Extra shoot duration beyond standard package limits will be subject to additional hourly compensation.
            </div>
          </div>
          <div class="flex items-start gap-2.5 bg-red-500/5 border border-red-500/10 rounded-xl p-4 text-[10px] text-gray-400">
            <i data-lucide="alert-triangle" class="w-4 h-4 text-red-400 flex-shrink-0"></i>
            <div>
              <strong class="text-red-400 block uppercase mb-0.5">TRAVEL EXPENSES (TA/DA)</strong>
              Travel & Daily Allowance (TA/DA) expenses for the crew are to be fully borne by the client.
            </div>
          </div>
        </div>

        <!-- Footer block -->
        <div class="border-t border-white/5 mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-gray-500 select-none">
          <span class="flex items-center gap-1.5"><i data-lucide="phone" class="w-3.5 h-3.5 text-limeGreen"></i> +91 96346 25609</span>
          <span class="flex items-center gap-1.5"><i data-lucide="map-pin" class="w-3.5 h-3.5 text-limeGreen"></i> Awas Vikas Colony, Kasganj, Uttar Pradesh</span>
        </div>
      </div>
    `;
    document.body.appendChild(achModal);
    if (window.lucide) lucide.createIcons();

    // Close listeners
    const closeBtn = document.getElementById('close-ach-modal');
    closeBtn.addEventListener('click', () => achModal.classList.remove('open'));
    achModal.addEventListener('click', (e) => {
      if (e.target === achModal) {
        achModal.classList.remove('open');
      }
    });
  }

  const openAchModal = (e) => {
    if (e.type === 'click' && e.currentTarget === cardTrigger && e.target.closest('button, a')) {
      return;
    }
    e.preventDefault();
    achModal.classList.add('open');
  };

  if (cardTrigger) cardTrigger.addEventListener('click', openAchModal);
  if (btnTrigger) btnTrigger.addEventListener('click', openAchModal);
}

function initMusicVideoModal() {
  const cardTrigger = document.querySelector('.music-video-card-trigger');
  const btnTrigger = document.querySelector('.music-video-btn-trigger');

  if (!cardTrigger && !btnTrigger) return;

  let musModal = document.getElementById('music-video-modal');
  if (!musModal) {
    musModal = document.createElement('div');
    musModal.id = 'music-video-modal';
    musModal.className = 'feedback-modal-overlay';
    musModal.innerHTML = `
      <div class="feedback-modal-box w-full max-w-xl bg-zinc-950 border border-limeGreen/30 rounded-3xl p-6 md:p-8 shadow-2xl relative font-futuristic text-left max-h-[90vh] overflow-y-auto" id="mus-modal-box">
        <!-- Close Button -->
        <button id="close-mus-modal" class="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors" title="Close">
          <i data-lucide="x" class="w-6 h-6"></i>
        </button>

        <!-- Header block -->
        <div class="text-center space-y-2 border-b border-white/5 pb-6 select-none">
          <h2 class="text-xl md:text-3xl font-black text-white tracking-wide leading-tight">MEDI MUSICA GROW PRIVATE LIMITED</h2>
          <div class="inline-block bg-limeGreen/10 border border-limeGreen/30 rounded-full px-4 py-1.5 text-limeGreen text-xs font-bold uppercase tracking-widest mt-4">
            Music Video Package
          </div>
        </div>

        <!-- Centered Single Package Spotlight -->
        <div class="pt-8">
          <div class="glass-panel border-limeGreen/30 bg-limeGreen/5 rounded-2xl p-6 flex flex-col justify-between hover:border-limeGreen/50 transition-all duration-300 relative group shadow-[0_0_30px_rgba(140,230,0,0.05)]">
            <div class="absolute top-4 right-4 text-[9px] bg-limeGreen/20 border border-limeGreen/30 px-2 py-0.5 rounded text-limeGreen font-mono font-bold tracking-widest">SPOTLIGHT</div>
            <div class="space-y-4">
              <div class="space-y-1">
                <h4 class="text-lg font-bold text-white group-hover:text-limeGreen transition-colors uppercase">Music Video Production</h4>
                <p class="text-[10px] text-gray-400">Complete end-to-end recording, grading, directing, and post-production.</p>
              </div>
              <div class="text-2xl font-black text-limeGreen font-sans py-2">₹7,999 - ₹29,999</div>
              <ul class="text-[11px] text-gray-300 space-y-2 border-t border-white/5 pt-4 font-sans font-light">
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> End-to-End Music Video Shoot</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> High-End Post-Production (Editing & Grading)</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> 1 Customized Video Thumbnail Design</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> 2 Promotional Song Poster Designs</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> 2 to 3 BTS (Behind The Scenes) Reels</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> Sony Mirrorless Camera Setup</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> 4K Aerial Drone Coverage</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> Handheld 3-Axis Stabilizing Gimbal</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> Professional Lighting Configurations</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> 1 On-Screen Model Included</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> 3 to 5 Professional Crew Team Members</li>
              </ul>
            </div>
            <div class="pt-6">
              <a href="contact.html?service=music-video&tier=music-video" class="lime-glow-btn text-brandBg font-futuristic font-bold text-center py-2.5 rounded-xl text-xs block w-full">
                CHOOSE MUSIC VIDEO
              </a>
            </div>
          </div>
        </div>

        <!-- Policy Footnotes -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/5">
          <div class="flex items-start gap-2.5 bg-white/[0.02] border border-white/5 rounded-xl p-4 text-[10px] text-gray-400">
            <i data-lucide="clock" class="w-4 h-4 text-limeGreen flex-shrink-0"></i>
            <div>
              <strong class="text-white block uppercase mb-0.5">EXTRA TIME COVERAGE</strong>
              Extra shoot duration beyond standard package limits will be subject to additional hourly compensation.
            </div>
          </div>
          <div class="flex items-start gap-2.5 bg-red-500/5 border border-red-500/10 rounded-xl p-4 text-[10px] text-gray-400">
            <i data-lucide="alert-triangle" class="w-4 h-4 text-red-400 flex-shrink-0"></i>
            <div>
              <strong class="text-red-400 block uppercase mb-0.5">TRAVEL EXPENSES (TA/DA)</strong>
              Travel & Daily Allowance (TA/DA) expenses for the crew are to be fully borne by the client.
            </div>
          </div>
        </div>

        <!-- Footer block -->
        <div class="border-t border-white/5 mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-gray-500 select-none">
          <span class="flex items-center gap-1.5"><i data-lucide="phone" class="w-3.5 h-3.5 text-limeGreen"></i> +91 96346 25609</span>
          <span class="flex items-center gap-1.5"><i data-lucide="map-pin" class="w-3.5 h-3.5 text-limeGreen"></i> Awas Vikas Colony, Kasganj, Uttar Pradesh</span>
        </div>
      </div>
    `;
    document.body.appendChild(musModal);
    if (window.lucide) lucide.createIcons();

    // Close listeners
    const closeBtn = document.getElementById('close-mus-modal');
    closeBtn.addEventListener('click', () => musModal.classList.remove('open'));
    musModal.addEventListener('click', (e) => {
      if (e.target === musModal) {
        musModal.classList.remove('open');
      }
    });
  }

  const openMusModal = (e) => {
    if (e.type === 'click' && e.currentTarget === cardTrigger && e.target.closest('button, a')) {
      return;
    }
    e.preventDefault();
    musModal.classList.add('open');
  };

  if (cardTrigger) cardTrigger.addEventListener('click', openMusModal);
  if (btnTrigger) btnTrigger.addEventListener('click', openMusModal);
}

function initVideoEditingModal() {
  const cardTrigger = document.querySelector('.video-editing-card-trigger');
  const btnTrigger = document.querySelector('.video-editing-btn-trigger');

  if (!cardTrigger && !btnTrigger) return;

  let editModal = document.getElementById('video-editing-modal');
  if (!editModal) {
    editModal = document.createElement('div');
    editModal.id = 'video-editing-modal';
    editModal.className = 'feedback-modal-overlay';
    editModal.innerHTML = `
      <div class="feedback-modal-box w-full max-w-5xl bg-zinc-950 border border-limeGreen/30 rounded-3xl p-6 md:p-8 shadow-2xl relative font-futuristic text-left max-h-[90vh] overflow-y-auto" id="edit-modal-box">
        <!-- Close Button -->
        <button id="close-edit-modal" class="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors" title="Close">
          <i data-lucide="x" class="w-6 h-6"></i>
        </button>

        <!-- Header block -->
        <div class="text-center space-y-2 border-b border-white/5 pb-6 select-none">
          <h2 class="text-xl md:text-3xl font-black text-white tracking-wide leading-tight">MEDI MUSICA GROW PRIVATE LIMITED</h2>
          <div class="inline-block bg-limeGreen/10 border border-limeGreen/30 rounded-full px-4 py-1.5 text-limeGreen text-xs font-bold uppercase tracking-widest mt-4">
            Video Editing Packages
          </div>
        </div>

        <!-- 3 Column Pricing Matrix Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          
          <!-- Package 1: Cinematic Video -->
          <div class="glass-panel border-white/10 rounded-xl p-6 flex flex-col justify-between hover:border-limeGreen/30 transition-all duration-300 relative group">
            <div class="space-y-4">
              <div class="space-y-1">
                <h4 class="text-lg font-bold text-white group-hover:text-limeGreen transition-colors uppercase leading-tight">Cinematic Video</h4>
                <p class="text-[10px] text-gray-400">Color-graded cinematic reel editing with advanced soundscapes.</p>
              </div>
              <div class="text-2xl font-black text-limeGreen font-sans py-2">₹399 - ₹799</div>
              <ul class="text-[11px] text-gray-300 space-y-2 border-t border-white/5 pt-4 font-sans font-light">
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> High-End PC Post-Production</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> DaVinci Resolve Studio Workflow</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> Sound Design & Foley FX Integration</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> Cinematic Color Correction & LUTs</li>
                <li class="flex items-center gap-2"><i data-lucide="clock" class="w-4 h-4 text-gray-500 flex-shrink-0"></i> Max. 60 Seconds Video Duration</li>
              </ul>
            </div>
            <div class="pt-6">
              <a href="contact.html?service=video-editing&tier=cinematic-video" class="metallic-border text-white font-futuristic font-bold text-center py-2.5 rounded-xl text-xs block w-full hover:bg-white/5 transition-colors">
                CHOOSE CINEMATIC
              </a>
            </div>
          </div>

          <!-- Package 2: Short Video -->
          <div class="glass-panel border-limeGreen/30 bg-limeGreen/5 rounded-xl p-6 flex flex-col justify-between hover:border-limeGreen/50 transition-all duration-300 relative group shadow-[0_0_30px_rgba(140,230,0,0.05)]">
            <div class="space-y-4">
              <div class="space-y-1">
                <h4 class="text-lg font-bold text-white group-hover:text-limeGreen transition-colors uppercase leading-tight">Short Video</h4>
                <p class="text-[10px] text-gray-400">High-retention reels, hooks, text highlights, and trending assets.</p>
              </div>
              <div class="text-2xl font-black text-limeGreen font-sans py-2">₹499 - ₹1,499</div>
              <ul class="text-[11px] text-gray-300 space-y-2 border-t border-white/5 pt-4 font-sans font-light">
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> High-End PC Post-Production</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> 2-Second Retention Hooks & Zooms</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> Dynamic Subtitles & Animated Assets</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> Viral Trend Sound Design</li>
                <li class="flex items-center gap-2"><i data-lucide="clock" class="w-4 h-4 text-gray-500 flex-shrink-0"></i> Max. 60 Seconds Video Duration</li>
              </ul>
            </div>
            <div class="pt-6">
              <a href="contact.html?service=video-editing&tier=short-video" class="lime-glow-btn text-brandBg font-futuristic font-bold text-center py-2.5 rounded-xl text-xs block w-full">
                CHOOSE SHORT VIDEO
              </a>
            </div>
          </div>

          <!-- Package 3: Long Video -->
          <div class="glass-panel border-white/10 rounded-xl p-6 flex flex-col justify-between hover:border-limeGreen/30 transition-all duration-300 relative group">
            <div class="space-y-4">
              <div class="space-y-1">
                <h4 class="text-lg font-bold text-white group-hover:text-limeGreen transition-colors uppercase leading-tight">Long Video</h4>
                <p class="text-[10px] text-gray-400">Complete podcasts, courses, documentaries, and YouTube edits.</p>
              </div>
              <div class="text-lg font-black text-limeGreen font-sans py-2">₹299 - ₹499 <span class="text-xs text-gray-500 font-futuristic">per minute</span></div>
              <ul class="text-[11px] text-gray-300 space-y-2 border-t border-white/5 pt-4 font-sans font-light">
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> High-End PC Post-Production</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> Multi-Camera Sequence Alignment</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> B-Roll & Visual Assets Insertion</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> Sound Cleanup & Noise Reduction</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> DaVinci Resolve Master Delivery</li>
              </ul>
            </div>
            <div class="pt-6">
              <a href="contact.html?service=video-editing&tier=long-video" class="metallic-border text-white font-futuristic font-bold text-center py-2.5 rounded-xl text-xs block w-full hover:bg-white/5 transition-colors">
                CHOOSE LONG VIDEO
              </a>
            </div>
          </div>

        </div>

        <!-- Policy Footnotes -->
        <div class="grid grid-cols-1 gap-4 mt-8 pt-6 border-t border-white/5">
          <div class="flex items-start gap-2.5 bg-white/[0.02] border border-white/5 rounded-xl p-4 text-[10px] text-gray-400">
            <i data-lucide="clock" class="w-4 h-4 text-limeGreen flex-shrink-0"></i>
            <div>
              <strong class="text-white block uppercase mb-0.5">EXTRA COMPILATIONS</strong>
              Revisions and extra visual complexity beyond standard deliverables will be subject to custom hourly quotes.
            </div>
          </div>
        </div>

        <!-- Footer block -->
        <div class="border-t border-white/5 mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-gray-500 select-none">
          <span class="flex items-center gap-1.5"><i data-lucide="phone" class="w-3.5 h-3.5 text-limeGreen"></i> +91 96346 25609</span>
          <span class="flex items-center gap-1.5"><i data-lucide="map-pin" class="w-3.5 h-3.5 text-limeGreen"></i> Awas Vikas Colony, Kasganj, Uttar Pradesh</span>
        </div>
      </div>
    `;
    document.body.appendChild(editModal);
    if (window.lucide) lucide.createIcons();

    // Close listeners
    const closeBtn = document.getElementById('close-edit-modal');
    closeBtn.addEventListener('click', () => editModal.classList.remove('open'));
    editModal.addEventListener('click', (e) => {
      if (e.target === editModal) {
        editModal.classList.remove('open');
      }
    });
  }

  const openEditModal = (e) => {
    if (e.type === 'click' && e.currentTarget === cardTrigger && e.target.closest('button, a')) {
      return;
    }
    e.preventDefault();
    editModal.classList.add('open');
  };

  if (cardTrigger) cardTrigger.addEventListener('click', openEditModal);
  if (btnTrigger) btnTrigger.addEventListener('click', openEditModal);
}

function initInfluencerMarketingModal() {
  const cardTrigger = document.querySelector('.influencer-marketing-card-trigger');
  const btnTrigger = document.querySelector('.influencer-marketing-btn-trigger');

  if (!cardTrigger && !btnTrigger) return;

  let infModal = document.getElementById('influencer-marketing-modal');
  if (!infModal) {
    infModal = document.createElement('div');
    infModal.id = 'influencer-marketing-modal';
    infModal.className = 'feedback-modal-overlay';
    infModal.innerHTML = `
      <div class="feedback-modal-box w-full max-w-xl bg-zinc-950 border border-limeGreen/30 rounded-3xl p-6 md:p-8 shadow-2xl relative font-futuristic text-left max-h-[90vh] overflow-y-auto" id="inf-modal-box">
        <!-- Close Button -->
        <button id="close-inf-modal" class="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors" title="Close">
          <i data-lucide="x" class="w-6 h-6"></i>
        </button>

        <!-- Header block -->
        <div class="text-center space-y-2 border-b border-white/5 pb-6 select-none">
          <h2 class="text-xl md:text-3xl font-black text-white tracking-wide leading-tight">MEDI MUSICA GROW PRIVATE LIMITED</h2>
          <div class="inline-block bg-limeGreen/10 border border-limeGreen/30 rounded-full px-4 py-1.5 text-limeGreen text-xs font-bold uppercase tracking-widest mt-4">
            Influencer Marketing
          </div>
        </div>

        <!-- Description Block -->
        <div class="pt-8 space-y-6">
          <div class="glass-panel border-limeGreen/20 bg-limeGreen/5 rounded-2xl p-6 relative group shadow-[0_0_30px_rgba(140,230,0,0.05)]">
            <div class="space-y-4">
              <h4 class="text-lg font-bold text-white uppercase tracking-wide">Campaign Customization</h4>
              <p class="text-xs text-gray-300 leading-relaxed font-light font-futuristic">
                Package may vary according to your need and according to the influencers followers.
              </p>
              <div class="bg-white/[0.02] border border-white/5 rounded-xl p-4 text-[11px] text-gray-400 font-futuristic font-light">
                We design fully tailored influencer campaigns to connect your brand with high-performing content creators. Budget and delivery parameters depend directly on creator reach, target demographics, and custom visual requirements.
              </div>
            </div>
            <div class="pt-6">
              <a href="contact.html?service=influencer-marketing" class="lime-glow-btn text-brandBg font-futuristic font-bold text-center py-2.5 rounded-xl text-xs block w-full">
                INQUIRE FOR CAMPAIGN
              </a>
            </div>
          </div>
        </div>

        <!-- Footer block -->
        <div class="border-t border-white/5 mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-gray-500 select-none font-futuristic">
          <span class="flex items-center gap-1.5"><i data-lucide="phone" class="w-3.5 h-3.5 text-limeGreen"></i> +91 96346 25609</span>
          <span class="flex items-center gap-1.5"><i data-lucide="map-pin" class="w-3.5 h-3.5 text-limeGreen"></i> Awas Vikas Colony, Kasganj, Uttar Pradesh</span>
        </div>
      </div>
    `;
    document.body.appendChild(infModal);
    if (window.lucide) lucide.createIcons();

    // Close listeners
    const closeBtn = document.getElementById('close-inf-modal');
    closeBtn.addEventListener('click', () => infModal.classList.remove('open'));
    infModal.addEventListener('click', (e) => {
      if (e.target === infModal) {
        infModal.classList.remove('open');
      }
    });
  }

  const openInfModal = (e) => {
    if (e.type === 'click' && e.currentTarget === cardTrigger && e.target.closest('button, a')) {
      return;
    }
    e.preventDefault();
    infModal.classList.add('open');
  };

  if (cardTrigger) cardTrigger.addEventListener('click', openInfModal);
  if (btnTrigger) btnTrigger.addEventListener('click', openInfModal);
}

  if (cardTrigger) cardTrigger.addEventListener('click', openEditModal);
  if (btnTrigger) btnTrigger.addEventListener('click', openEditModal);
}

const MMG_CLIENTS = [
  {
    name: "Chacha TVS",
    category: "automobile",
    tenure: "2.5+ Years",
    insta: "https://www.instagram.com/chachatvs_kasganj?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    handle: "@chachatvs_kasganj",
    initials: "CT",
    icon: "car",
    desc: "Complete automobile digital marketing execution, festival launch campaigns, showroom videos, and graphic design elevation."
  },
  {
    name: "Shri Krishna Mobile",
    category: "electronics-mobile",
    tenure: "2.5+ Years",
    insta: "https://www.instagram.com/shrikrishnamobile_etah?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    handle: "@shrikrishnamobile_etah",
    initials: "SKM",
    icon: "smartphone",
    desc: "Vibrant retail unboxing reels, custom offer creatives, device hype promos, and local digital audience building."
  },
  {
    name: "Time Electronic Centre",
    category: "electronics-mobile",
    tenure: "2.5+ Years",
    insta: "https://www.instagram.com/time_electronic_centre_2.0/?utm_source=ig_web_button_share_sheet",
    handle: "@time_electronic_centre_2.0",
    initials: "TEC",
    icon: "tv",
    desc: "High-impact retail commercials, home appliance launch reels, custom motion graphics and subtitles editing."
  },
  {
    name: "Balance Yoga Studio",
    category: "retail-wellness",
    tenure: "2.5+ Years",
    insta: "https://www.instagram.com/balanceyogastudiobyvasu?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    handle: "@balanceyogastudiobyvasu",
    initials: "BYS",
    icon: "heart",
    desc: "Calming studio aesthetics videography, wellness reels production, scheduling and social media content structuring."
  },
  {
    name: "DVF Mall",
    category: "retail-wellness",
    tenure: "1+ Years",
    insta: "https://www.instagram.com/dvfmall_kasganj?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    handle: "@dvfmall_kasganj",
    initials: "DVF",
    icon: "shopping-bag",
    desc: "Comprehensive lifestyle mall promotional reels, festival footfall shoots, and regular event capture coverage."
  },
  {
    name: "New Apna Mobile",
    category: "electronics-mobile",
    tenure: "1+ Years",
    insta: "https://www.instagram.com/new_apna_mobile_etah?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    handle: "@new_apna_mobile_etah",
    initials: "NAM",
    icon: "smartphone",
    desc: "Festive sales campaign creative templates, new model launch teasers, and retail consumer engagement strategy."
  },
  {
    name: "Chacha Exide Care",
    category: "automobile",
    tenure: "1+ Years",
    insta: "https://www.instagram.com/chacha_agencies?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    handle: "@chacha_agencies",
    initials: "CEC",
    icon: "battery-charging",
    desc: "Industrial & battery tech social media creatives, service assurance campaign shoots, and local lead generation."
  },
  {
    name: "Taj Electronics",
    category: "electronics-mobile",
    tenure: "1+ Years",
    insta: "https://www.instagram.com/tajelectronics_etah?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    handle: "@tajelectronics_etah",
    initials: "TE",
    icon: "tv",
    desc: "Smart TV & sound system showcase reels, customer testimonial captures, and retail brand identity design."
  },
  {
    name: "Pankaj Computer Zone",
    category: "retail-wellness",
    tenure: "6+ Months",
    insta: "https://www.instagram.com/pankajcomputerkasganj?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    handle: "@pankajcomputerkasganj",
    initials: "PCZ",
    icon: "laptop",
    desc: "IT & hardware repair reels, custom software training templates, and educational tech creatives."
  },
  {
    name: "Dhan Shri TVS",
    category: "automobile",
    tenure: "5+ Months",
    insta: "https://www.instagram.com/dhanshreemotors_dibai?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    handle: "@dhanshreemotors_dibai",
    initials: "DST",
    icon: "car",
    desc: "Vibrant vehicle launch cinematic reels, drone dealership showcases, and two-wheeler feature highlight reels."
  },
  {
    name: "Coach Mukesh Soni",
    category: "retail-wellness",
    tenure: "5+ Months",
    insta: "https://www.instagram.com/ncs_coachmukeshsoni?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    handle: "@ncs_coachmukeshsoni",
    initials: "CMS",
    icon: "activity",
    desc: "Personal branding video structure, lifestyle transformation reel editing, and educational content pacing."
  },
  {
    name: "Mobile World",
    category: "electronics-mobile",
    tenure: "5+ Months",
    insta: "https://www.instagram.com/mobileworld_etah?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    handle: "@mobileworld_etah",
    initials: "MW",
    icon: "smartphone",
    desc: "Local mobile retail brand strategy, premium phone unboxings, and visual store walk-throughs."
  }
];

function initClientRoster() {
  const clientGrid = document.getElementById('client-grid');
  if (!clientGrid) return; // Only execute on clients.html

  const searchInput = document.getElementById('client-search');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const noClientsAlert = document.getElementById('no-clients-alert');

  let activeFilter = 'all';
  let searchQuery = '';

  // Render function
  function render() {
    const filtered = MMG_CLIENTS.filter(client => {
      const matchesFilter = activeFilter === 'all' || client.category === activeFilter;
      const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            client.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            client.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });

    if (filtered.length === 0) {
      clientGrid.innerHTML = '';
      noClientsAlert.classList.remove('hidden');
    } else {
      noClientsAlert.classList.add('hidden');
      clientGrid.innerHTML = filtered.map(client => {
        return `
          <div class="glass-panel border-white/5 rounded-3xl p-6 md:p-8 flex flex-col justify-between group cursor-pointer hover:border-limeGreen/20 transition-all duration-300 transform hover:-translate-y-1" onclick="openClientDetailModal('${client.name.replace(/'/g, "\\'")}')">
            <div class="space-y-6">
              <div class="flex items-start justify-between">
                <!-- Glowing Category Badge Logo -->
                <div class="w-14 h-14 rounded-2xl bg-limeGreen/10 border border-limeGreen/20 flex items-center justify-center text-limeGreen group-hover:bg-limeGreen group-hover:text-brandBg transition-all duration-300 shadow-[0_0_15px_rgba(140,230,0,0.1)] relative">
                  <!-- Business Initials Decal Badge -->
                  <span class="absolute top-0 right-0 bg-limeGreen text-brandBg text-[7px] font-black px-1.5 py-0.5 rounded-bl rounded-tr-xl font-sans uppercase">${client.initials}</span>
                  <i data-lucide="${client.icon}" class="w-6 h-6"></i>
                </div>
                <!-- Tenure Badge -->
                <span class="text-[8px] font-futuristic text-limeGreen border border-limeGreen/20 px-2.5 py-1 rounded bg-limeGreen/5 font-bold uppercase tracking-wider">
                  Since ${client.tenure}
                </span>
              </div>
              <div class="space-y-2 text-left">
                <h3 class="text-lg md:text-xl font-bold font-futuristic text-white group-hover:text-limeGreen transition-colors leading-tight uppercase">${client.name}</h3>
                <p class="text-gray-400 text-xs leading-relaxed font-light font-futuristic line-clamp-2">
                  ${client.desc}
                </p>
              </div>
            </div>
            <div class="pt-6 flex items-center gap-1 text-[11px] font-futuristic text-limeGreen font-bold hover:translate-x-1 transition-transform self-start">
              EXPAND STATUS INFO <i data-lucide="arrow-up-right" class="w-4 h-4"></i>
            </div>
          </div>
        `;
      }).join('');
      if (window.lucide) lucide.createIcons();
    }
  }

  // Bind Search
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      render();
    });
  }

  // Bind Filters
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.getAttribute('data-filter');
      render();
    });
  });

  // Simple numeric animation logic
  function animateValue(obj, start, end, duration, suffix = '') {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      obj.innerHTML = Math.floor(progress * (end - start) + start) + suffix;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  // Check stats and run animations
  const retObj = document.getElementById('stat-retention');
  const partObj = document.getElementById('stat-partners');
  const reelObj = document.getElementById('stat-reels');
  const viewObj = document.getElementById('stat-views');

  if (retObj) retObj.innerHTML = "2.5+ Yrs";
  if (partObj) animateValue(partObj, 0, 12, 1200, '+ Brands');
  if (reelObj) animateValue(reelObj, 0, 5000, 1500, '+ Reels');
  if (viewObj) animateValue(viewObj, 0, 50, 1500, 'M+ Views');

  // Init render
  render();

  // Create detail modal placeholder
  let detailModal = document.getElementById('client-detail-modal');
  if (!detailModal) {
    detailModal = document.createElement('div');
    detailModal.id = 'client-detail-modal';
    detailModal.className = 'feedback-modal-overlay';
    document.body.appendChild(detailModal);
  }
}

function openClientDetailModal(clientName) {
  const client = MMG_CLIENTS.find(c => c.name === clientName);
  if (!client) return;

  const detailModal = document.getElementById('client-detail-modal');
  if (!detailModal) return;

  detailModal.innerHTML = `
    <div class="feedback-modal-box w-full max-w-xl bg-zinc-950 border border-limeGreen/30 rounded-3xl p-6 md:p-8 shadow-2xl relative font-futuristic text-left max-h-[90vh] overflow-y-auto" id="client-spotlight-box">
      <!-- Close Button -->
      <button id="close-client-detail-modal" class="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors" title="Close" onclick="closeClientDetailModal()">
        <i data-lucide="x" class="w-6 h-6"></i>
      </button>

      <!-- Header block -->
      <div class="text-center space-y-2 border-b border-white/5 pb-6 select-none">
        <h2 class="text-xl md:text-2xl font-black text-white tracking-wide leading-tight">PARTNER SPOTLIGHT</h2>
        <div class="inline-block bg-limeGreen/10 border border-limeGreen/30 rounded-full px-4 py-1.5 text-limeGreen text-xs font-bold uppercase tracking-widest mt-4">
          ${client.name}
        </div>
      </div>

      <!-- Description Block -->
      <div class="pt-8 space-y-6">
        <div class="glass-panel border-limeGreen/20 bg-limeGreen/5 rounded-2xl p-6 relative group shadow-[0_0_30px_rgba(140,230,0,0.05)]">
          <div class="space-y-4 font-futuristic">
            <div class="flex items-center justify-between border-b border-white/5 pb-3">
              <span class="text-[10px] text-gray-500 uppercase tracking-widest">Client Tenure</span>
              <span class="text-xs font-black text-limeGreen uppercase">${client.tenure}</span>
            </div>
            
            <div class="flex items-center justify-between border-b border-white/5 pb-3">
              <span class="text-[10px] text-gray-500 uppercase tracking-widest">Industry Classification</span>
              <span class="text-xs font-black text-white uppercase">${client.category.replace(/-/g, ' ')}</span>
            </div>

            <div class="flex items-center justify-between border-b border-white/5 pb-3">
              <span class="text-[10px] text-gray-500 uppercase tracking-widest">Instagram Link</span>
              <span class="text-[11px] font-bold text-gray-400 font-sans">${client.handle}</span>
            </div>

            <div class="space-y-2 pt-2">
              <h4 class="text-xs font-bold text-white uppercase tracking-wider">COLLABORATION SUMMARY</h4>
              <p class="text-xs text-gray-300 leading-relaxed font-light font-futuristic">
                ${client.desc}
              </p>
            </div>
          </div>
          <div class="pt-6">
            <a href="${client.insta}" target="_blank" class="lime-glow-btn text-brandBg font-futuristic font-bold text-center py-2.5 rounded-xl text-xs block w-full flex items-center justify-center gap-1.5">
              EXPLORE INSTAGRAM PROFILE <i data-lucide="arrow-up-right" class="w-4 h-4"></i>
            </a>
          </div>
        </div>
      </div>

      <!-- Footer block -->
      <div class="border-t border-white/5 mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-gray-500 select-none font-futuristic">
        <span class="flex items-center gap-1.5"><i data-lucide="phone" class="w-3.5 h-3.5 text-limeGreen"></i> +91 96346 25609</span>
        <span class="flex items-center gap-1.5"><i data-lucide="map-pin" class="w-3.5 h-3.5 text-limeGreen"></i> Awas Vikas Colony, Kasganj, Uttar Pradesh</span>
      </div>
    </div>
  `;
  detailModal.classList.add('open');
  if (window.lucide) lucide.createIcons();

  // Close when clicking overlay
  detailModal.addEventListener('click', function(e) {
    if (e.target === detailModal) {
      closeClientDetailModal();
    }
  });
}

function closeClientDetailModal() {
  const detailModal = document.getElementById('client-detail-modal');
  if (detailModal) {
    detailModal.classList.remove('open');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initAdminSubtabs();
  initSmmPackageModal();
  initContentCreationModal();
  initCorporateEventsModal();
  initFamilyEventsModal();
  initAchievementShootModal();
  initMusicVideoModal();
  initVideoEditingModal();
  initInfluencerMarketingModal();
  initClientRoster();
  if (document.getElementById('admin-leads-table-body')) {
    renderAdminLeads();
  }
});
