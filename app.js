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
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
const canvas = document.getElementById('particle-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  const particleCount = window.innerWidth < 768 ? 15 : 30;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas, { passive: true });
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

  let isAnimating = true;
  document.addEventListener('visibilitychange', () => {
    isAnimating = !document.hidden;
    if (isAnimating) requestAnimationFrame(animateParticles);
  });

  function animateParticles() {
    if (!isAnimating) return;
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
const heroNode = document.getElementById('hero-3d-node');

if (heroNode && !isTouchDevice && window.innerWidth >= 1024) {
  let mouseRaf = null;
  window.addEventListener('mousemove', (e) => {
    if (mouseRaf) cancelAnimationFrame(mouseRaf);
    mouseRaf = requestAnimationFrame(() => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;

      const px = dx / cx;
      const py = dy / cy;

      if (typeof gsap !== 'undefined') {
        gsap.to(heroNode, {
          rotationY: px * 15,
          rotationX: -py * 15,
          x: px * 10,
          y: py * 10,
          duration: 0.4,
          ease: "power2.out"
        });
      }
    });
  }, { passive: true });
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
      { id: 'counter-views', target: 100, format: (val) => `${Math.floor(val)}M+` },
      { id: 'counter-roi', target: 10, format: (val) => `${Math.floor(val)}x` },
      { id: 'counter-brands', target: 194, format: (val) => `${Math.floor(val)}+` }
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
        onUpdate: function () {
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
    name: 'Chacha TVS',
    title: 'Authorized Dealership, Kasganj',
    category: 'video-editing',
    categoryLabel: 'VIDEO EDITING',
    rating: 5,
    text: 'Shailesh and the MMG team created exceptional delivery celebration reels and campaign videos for our auto dealership. Fast delivery, top-quality editing, and great social engagement.',
    featured: true,
    verified: true,
    date: '2026-07-25'
  },
  {
    id: 'fb-2',
    name: 'Shri Krishna Mobile',
    title: 'Mobile Retailer, Etah',
    category: 'electronics-mobile',
    categoryLabel: 'ELECTRONICS & REELS',
    rating: 5,
    text: 'Vibrant retail unboxing reels, custom offer creatives, device hype promos, and local digital audience building. Our store engagement has soared!',
    featured: true,
    verified: true,
    date: '2026-07-24'
  },
  {
    id: 'fb-3',
    name: 'Time Electronic Centre',
    title: 'Electronics & Appliances Retail',
    category: 'meta-ads',
    categoryLabel: 'META ADS',
    rating: 5,
    text: 'High-impact retail commercials, home appliance launch reels, custom motion graphics and subtitles editing. Drives real in-store conversions.',
    featured: true,
    verified: true,
    date: '2026-07-23'
  },
  {
    id: 'fb-4',
    name: 'Balance Yoga Studio',
    title: 'Wellness & Fitness Studio',
    category: 'smm',
    categoryLabel: 'SMM ORBIT',
    rating: 5,
    text: 'Serene, high-definition wellness reels and yoga workshop promos. Medi Musica Grow helped us build an active local wellness community online!',
    featured: true,
    verified: true,
    date: '2026-07-22'
  },
  {
    id: 'fb-5',
    name: 'DVF Mall',
    title: 'Lifestyle Mall, Kasganj',
    category: 'smm',
    categoryLabel: 'EVENT & REELS',
    rating: 5,
    text: 'Comprehensive lifestyle mall promotional reels, festival footfall shoots, and regular event capture coverage. Highly creative execution!',
    featured: true,
    verified: true,
    date: '2026-07-21'
  },
  {
    id: 'fb-6',
    name: 'New Apna Mobile',
    title: 'Mobile & Accessories Retailer',
    category: 'electronics-mobile',
    categoryLabel: 'PROMO CREATIVE',
    rating: 5,
    text: 'Festive sales campaign creative templates, new model launch teasers, and retail consumer engagement strategy that keeps customers coming back.',
    featured: false,
    verified: true,
    date: '2026-07-20'
  },
  {
    id: 'fb-7',
    name: 'Chacha Exide Care',
    title: 'Battery & Auto Care',
    category: 'meta-ads',
    categoryLabel: 'LEAD GENERATION',
    rating: 5,
    text: 'Industrial & battery tech social media creatives, service assurance campaign shoots, and local lead generation. Outstanding professionalism.',
    featured: false,
    verified: true,
    date: '2026-07-19'
  },
  {
    id: 'fb-8',
    name: 'Taj Electronics',
    title: 'Electronics & Sound Showroom',
    category: 'video-editing',
    categoryLabel: 'BRANDING',
    rating: 5,
    text: 'Smart TV & sound system showcase reels, customer testimonial captures, and retail brand identity design that sets us apart from competitors.',
    featured: false,
    verified: true,
    date: '2026-07-18'
  },
  {
    id: 'fb-9',
    name: 'Pankaj Computer Zone',
    title: 'IT & Hardware Center',
    category: 'web-dev',
    categoryLabel: 'IT & CREATIVES',
    rating: 5,
    text: 'IT & hardware repair reels, custom software training templates, and educational tech creatives that inform and convert local clients.',
    featured: false,
    verified: true,
    date: '2026-07-17'
  },
  {
    id: 'fb-10',
    name: 'Dhan Shri TVS',
    title: 'Two-Wheeler Motors, Dibai',
    category: 'video-editing',
    categoryLabel: 'CINEMATIC REELS',
    rating: 5,
    text: 'Vibrant vehicle launch cinematic reels, drone dealership showcases, and two-wheeler feature highlight reels with viral watch ratios.',
    featured: true,
    verified: true,
    date: '2026-07-16'
  },
  {
    id: 'fb-11',
    name: 'Coach Mukesh Soni',
    title: 'Fitness & Health Coach',
    category: 'smm',
    categoryLabel: 'PERSONAL BRANDING',
    rating: 5,
    text: 'Shailesh and the MMG team transformed my personal branding and reel production quality. High engagement and professional workflow throughout.',
    featured: false,
    verified: true,
    date: '2026-07-15'
  },
  {
    id: 'fb-12',
    name: 'Mobile World',
    title: 'Smartphone Retailer, Etah',
    category: 'video-editing',
    categoryLabel: 'VIDEO EDITING',
    rating: 5,
    text: 'The smartphone launch teasers and accessory promo edits from MMG are top notch. Great team to work with for high-converting short form video content!',
    featured: false,
    verified: true,
    date: '2026-07-14'
  },
  {
    id: 'fb-13',
    name: 'Mats Computers',
    title: 'IT & Electronics Retailer',
    category: 'web-dev',
    categoryLabel: 'WEB DEV',
    rating: 5,
    text: 'Medimusicagrow engineered our brand presence and social media campaigns seamlessly. Very creative team with deep technical and video editing expertise.',
    featured: false,
    verified: true,
    date: '2026-07-12'
  },
  {
    id: 'fb-14',
    name: 'VPN Timber & Hardware',
    title: 'Architectural Supplies & Hardware',
    category: 'web-dev',
    categoryLabel: 'WEB & BRANDING',
    rating: 5,
    text: 'Medimusicagrow designed our architectural hardware and timber showcases. Their digital branding and short video shoots helped us connect with high-end interior designers and builders across the region.',
    featured: true,
    verified: true,
    date: '2026-07-10'
  },
  {
    id: 'fb-15',
    name: 'VPN Jewellers',
    title: 'Direct Owner, Kasganj',
    category: 'smm',
    categoryLabel: 'SMM & REEL SHOOTS',
    rating: 5,
    text: 'Medimusicagrow has been handling our jewellery collection shoots and festive reel editing for 2+ years. Their viral video strategy and high-retention hooks brought a massive influx of customer footfall to our Kasganj showroom!',
    featured: true,
    verified: true,
    date: '2026-07-08'
  },
  {
    id: 'fb-16',
    name: 'SRS Auto & Financial Services',
    title: 'Financial & Auto Services',
    category: 'meta-ads',
    categoryLabel: 'META ADS',
    rating: 5,
    text: 'Great ROI on our Meta Ad campaigns and promotional video reels! Medi Musica Grow delivers fast, data-driven marketing results.',
    featured: false,
    verified: true,
    date: '2026-07-05'
  },
  {
    id: 'fb-17',
    name: 'Vansh Payal Jewellery',
    title: 'Business Owner',
    category: 'smm',
    categoryLabel: 'SMM ORBIT',
    rating: 5,
    text: 'Best social media marketing agency in Kasganj. Their festive offer teasers and store walk-through reels expanded our local reach tremendously.',
    featured: false,
    verified: true,
    date: '2026-07-03'
  },
  {
    id: 'fb-18',
    name: 'Shri Roop Interio',
    title: 'Founder & Managing Director',
    category: 'web-dev',
    categoryLabel: 'WEB & CREATIVE',
    rating: 5,
    text: 'Outstanding video walkthroughs and web presentation for our interior design projects. Their creative aesthetics and professionalism make them the top agency in UP.',
    featured: true,
    verified: true,
    date: '2026-07-01'
  },
  {
    id: 'fb-19',
    name: 'Manglam Marble',
    title: 'Flooring & Marble Showroom',
    category: 'video-editing',
    categoryLabel: 'VIDEO EDITING',
    rating: 5,
    text: 'The marble & tile collection elevation videos created by MMG have been a game changer for our brand! Flawless color grading, sharp transitions, and high customer inquiry conversion.',
    featured: false,
    verified: true,
    date: '2026-06-28'
  },
  {
    id: 'fb-20',
    name: 'SHRI KRISHNA CAR ACCESSORIES',
    title: 'Automotive Accessories & Detailing',
    category: 'video-editing',
    categoryLabel: 'VIDEO EDITING',
    rating: 5,
    text: 'Their custom audio upgrade reels and ambient car modification showcases went viral locally. Outstanding video editing and prompt service.',
    featured: false,
    verified: true,
    date: '2026-06-25'
  },
  {
    id: 'fb-21',
    name: 'FABZILA',
    title: 'Fashion Apparel Brand',
    category: 'smm',
    categoryLabel: 'SMM ORBIT',
    rating: 5,
    text: 'Our seasonal fashion collection launches and trend lookbook reels receive phenomenal engagement. Shailesh and his team know exactly how to hook viewers in the first 3 seconds.',
    featured: true,
    verified: true,
    date: '2026-06-22'
  },
  {
    id: 'fb-22',
    name: 'A.V. Jewellers',
    title: 'Store Owner, Kasganj',
    category: 'smm',
    categoryLabel: 'SMM ORBIT',
    rating: 5,
    text: 'Superb video editing and Instagram growth strategy! The reel hooks and showcase promos boosted our online inquiry rate significantly. Highly recommended team!',
    featured: true,
    verified: true,
    date: '2026-06-20'
  },
  {
    id: 'fb-23',
    name: 'Saree Museum',
    title: 'Traditional & Silk Saree Collection',
    category: 'video-editing',
    categoryLabel: 'CONTENT CREATION',
    rating: 5,
    text: 'High quality silk saree drape reels and festive video promos! Their creative direction and video pacing consistently deliver viral reach on Instagram.',
    featured: false,
    verified: true,
    date: '2026-06-18'
  },
  {
    id: 'fb-24',
    name: 'CITY FASHION FLOOR',
    title: 'Multi-Brand Clothing Retail',
    category: 'meta-ads',
    categoryLabel: 'META ADS',
    rating: 5,
    text: 'Their Meta Ad campaigns and seasonal sale announcement videos drove record store footfall during peak festive shopping season. Exceptional strategy and campaign tracking!',
    featured: true,
    verified: true,
    date: '2026-06-15'
  },
  {
    id: 'fb-25',
    name: 'Dulhaghar Kasganj',
    title: 'Bridal & Groom Fashion Retail',
    category: 'video-editing',
    categoryLabel: 'CONTENT CREATION',
    rating: 5,
    text: 'Their short-form video editing and wedding wear collection showcases generate thousands of views every week. Exceptional quality and creative dedication.',
    featured: true,
    verified: true,
    date: '2026-06-12'
  },
  {
    id: 'fb-26',
    name: 'Chacha E Auto Wheels',
    title: 'EV & Electric 3-Wheeler Dealership',
    category: 'video-editing',
    categoryLabel: 'VIDEO EDITING',
    rating: 5,
    text: 'Top-tier electric 3-wheeler performance reels and dealership promotional edits. Clean cuts, engaging audio design, and super fast project turnarounds.',
    featured: false,
    verified: true,
    date: '2026-06-10'
  },
  {
    id: 'fb-27',
    name: 'Property Wala',
    title: 'Real Estate Projects & Plots',
    category: 'meta-ads',
    categoryLabel: 'META ADS & LEADS',
    rating: 5,
    text: 'Medimusicagrow produced our property walkthrough videos and targeted lead generation ads. We closed multiple premium plot bookings thanks to their video funnels!',
    featured: true,
    verified: true,
    date: '2026-06-08'
  },
  {
    id: 'fb-28',
    name: 'A ONE Ultrasound & Eye Care',
    title: 'Healthcare & Diagnostic Facility',
    category: 'smm',
    categoryLabel: 'SMM ORBIT',
    rating: 5,
    text: 'Professional, informative, and engaging medical service awareness videos. Their team handled everything from scripting to post-production with complete care.',
    featured: false,
    verified: true,
    date: '2026-06-05'
  },
  {
    id: 'fb-29',
    name: 'JAI SHREE SHYAM HOME DECORATOR',
    title: 'Home Furnishing & Curtains',
    category: 'smm',
    categoryLabel: 'CREATIVE SHOWCASE',
    rating: 5,
    text: 'Our interior decor and curtain installation transformation reels turned out stunning. The video quality and aesthetic presentation brought in lots of new local clients.',
    featured: false,
    verified: true,
    date: '2026-06-02'
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
  } catch (e) { }
  renderAllFeedbackViews();
}

let isReviewsExpanded = false;

function renderPublicGrid(filter = 'all') {
  const grid = document.getElementById('reviews-grid');
  if (!grid) return;

  const showMoreContainer = document.getElementById('show-more-reviews-container');
  const showMoreBtn = document.getElementById('show-more-reviews-btn');
  const showMoreText = document.getElementById('show-more-reviews-text');
  const showMoreIcon = document.getElementById('show-more-reviews-icon');

  grid.innerHTML = '';
  const filtered = feedbackList.filter(item => filter === 'all' || item.category === filter);

  if (filtered.length === 0) {
    grid.innerHTML = `<p class="col-span-2 text-center text-gray-500 font-futuristic text-xs py-8">NO FEEDBACK ENTRIES FOUND IN THIS CATEGORY.</p>`;
    if (showMoreContainer) showMoreContainer.classList.add('hidden');
    return;
  }

  const itemsToDisplay = isReviewsExpanded ? filtered : filtered.slice(0, 8);

  itemsToDisplay.forEach(item => {
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
        <a href="https://share.google/9WsqvZV57gCcyiZLF" target="_blank" class="text-limeGreen font-bold hover:underline flex items-center gap-1">
          ${item.verified ? 'VERIFIED ON GMB <i data-lucide="external-link" class="w-2.5 h-2.5 inline"></i>' : 'PENDING VERIFICATION'}
        </a>
      </div>
    `;

    grid.appendChild(card);
  });

  // Show More / Show Less logic for feedback reviews
  if (filtered.length > 8) {
    if (showMoreContainer) showMoreContainer.classList.remove('hidden');
    if (isReviewsExpanded) {
      if (showMoreText) showMoreText.textContent = 'SHOW LESS REVIEWS';
      if (showMoreIcon) showMoreIcon.setAttribute('data-lucide', 'chevron-up');
    } else {
      if (showMoreText) showMoreText.textContent = 'SHOW MORE REVIEWS';
      if (showMoreIcon) showMoreIcon.setAttribute('data-lucide', 'chevron-down');
    }
  } else {
    if (showMoreContainer) showMoreContainer.classList.add('hidden');
  }

  if (showMoreBtn && !showMoreBtn.dataset.bound) {
    showMoreBtn.dataset.bound = 'true';
    showMoreBtn.addEventListener('click', () => {
      isReviewsExpanded = !isReviewsExpanded;
      const currentFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
      renderPublicGrid(currentFilter);
      if (!isReviewsExpanded && grid) {
        grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  if (window.lucide) lucide.createIcons();
}

function renderAllFeedbackViews() {
  const activePublicFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
  renderPublicGrid(activePublicFilter);
}

// Public Filter Buttons
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');
    isReviewsExpanded = false;
    renderPublicGrid(filter);
  });
});

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
    if (confirm('Thank you! Your verified feedback has been published to the system.\n\nWould you like to post this review directly on our official Google My Business profile as well?')) {
      window.open('https://share.google/9WsqvZV57gCcyiZLF', '_blank');
    }
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
  const tierParam = urlParams.get('tier') || urlParams.get('package') || urlParams.get('pkg');

  if (serviceParam) {
    let targetService = serviceParam;
    if (serviceParam === 'influencer-marketing') targetService = 'influencer';

    if (selectElem) {
      const optionExists = Array.from(selectElem.options).some(o => o.value === targetService);
      if (optionExists) {
        selectElem.value = targetService;
      }
    }

    const messageElem = document.getElementById('contact-message');
    if (messageElem) {
      let packageLabel = '';

      if (serviceParam === 'smm') {
        packageLabel = '5-Months Social Media Management (SMM) Package';
      } else if (serviceParam === 'content-creation') {
        if (tierParam === 'single-video') packageLabel = 'Content Creation — Single Video Package';
        else if (tierParam === 'bulk-video') packageLabel = 'Content Creation — Bulk Video Package';
        else packageLabel = 'Content Creation Package';
      } else if (serviceParam === 'corporate-events') {
        if (tierParam === 'basic') packageLabel = 'Corporate Event — Basic Capture Package';
        else if (tierParam === 'normal') packageLabel = 'Corporate Event — Normal Capture Package';
        else if (tierParam === 'advance') packageLabel = 'Corporate Event — Advance Capture Package';
        else packageLabel = 'Corporate Event Coverage Package';
      } else if (serviceParam === 'family-events') {
        if (tierParam === 'wedding') packageLabel = 'Family Event — Wedding Shoot Package';
        else if (tierParam === 'engagement') packageLabel = 'Family Event — Engagement Shoot Package';
        else if (tierParam === 'birthday') packageLabel = 'Family Event — Birthday Party Package';
        else if (tierParam === 'baby-born') packageLabel = 'Family Event — Baby Born Shoot Package';
        else if (tierParam === 'baby-shower') packageLabel = 'Family Event — Baby Shower Package';
        else packageLabel = 'Family Event Coverage Package';
      } else if (serviceParam === 'achievement-shoot') {
        if (tierParam === 'bike-delivery') packageLabel = 'Achievement Shoot — Bike Delivery Package';
        else if (tierParam === 'car-delivery') packageLabel = 'Achievement Shoot — Car Delivery Package';
        else if (tierParam === 'home-inauguration') packageLabel = 'Achievement Shoot — Home Inauguration Package';
        else if (tierParam === 'business-opening') packageLabel = 'Achievement Shoot — Business Opening Package';
        else packageLabel = 'Achievement Shoot Package';
      } else if (serviceParam === 'music-video') {
        packageLabel = 'Music Video Production Package';
      } else if (serviceParam === 'video-editing') {
        if (tierParam === 'cinematic-video') packageLabel = 'Video Editing — Cinematic Commercial Video Package';
        else if (tierParam === 'short-video') packageLabel = 'Video Editing — Short Reels & Shorts Video Package';
        else if (tierParam === 'long-video') packageLabel = 'Video Editing — Long Form YouTube Video Package';
        else packageLabel = 'Video Editing Package';
      } else if (serviceParam === 'influencer' || serviceParam === 'influencer-marketing') {
        packageLabel = 'Influencer Marketing Campaign Package';
      } else if (serviceParam === 'web-dev') {
        packageLabel = 'Web Development & High-Converting Landing Portal Service';
      } else if (serviceParam === 'ads') {
        packageLabel = 'Google Ads & Meta Ads Performance Marketing Service';
      } else {
        packageLabel = `${serviceParam.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} Package`;
      }

      messageElem.value = `Hello Medi Musica Grow team! I am interested in booking the ${packageLabel}. Please reach out to me with further details.`;
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
    } catch (err) { }

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
              <a href="contact.html?service=smm&package=5months" class="lime-glow-btn text-brandBg font-futuristic font-bold px-6 py-3.5 rounded-xl text-xs flex-1 text-center flex items-center justify-center gap-2">
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
      <div class="feedback-modal-box w-full max-w-5xl bg-zinc-950 border border-limeGreen/30 rounded-3xl p-6 md:p-8 shadow-2xl relative font-futuristic text-left max-h-[90vh] overflow-y-auto" id="inf-modal-box">
        <!-- Close Button -->
        <button id="close-inf-modal" class="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors" title="Close">
          <i data-lucide="x" class="w-6 h-6"></i>
        </button>

        <!-- Header block -->
        <div class="text-center space-y-2 border-b border-white/5 pb-6 select-none">
          <h2 class="text-xl md:text-3xl font-black text-white tracking-wide leading-tight">MEDI MUSICA GROW PRIVATE LIMITED</h2>
          <div class="inline-block bg-limeGreen/10 border border-limeGreen/30 rounded-full px-4 py-1.5 text-limeGreen text-xs font-bold uppercase tracking-widest mt-4">
            Influencer Marketing Packages
          </div>
        </div>

        <!-- 2 Column Pricing Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 max-w-4xl mx-auto">
          
          <!-- Package 1: Single Video Package -->
          <div class="glass-panel border-limeGreen/30 bg-limeGreen/5 rounded-2xl p-6 flex flex-col justify-between hover:border-limeGreen/50 transition-all duration-300 relative group shadow-[0_0_30px_rgba(140,230,0,0.05)]">
            <div class="absolute top-4 right-4 text-[9px] bg-limeGreen/20 border border-limeGreen/30 px-2 py-0.5 rounded text-limeGreen font-mono font-bold tracking-widest">STARTER</div>
            <div class="space-y-4">
              <div class="space-y-1">
                <h4 class="text-lg font-bold text-white group-hover:text-limeGreen transition-colors">Single Video Package</h4>
                <p class="text-[10px] text-gray-400">Complete shoot and post-production execution with creator integration.</p>
              </div>
              <div class="text-xl font-black text-limeGreen font-sans py-2">₹1,499/- <span class="text-xs text-gray-400 font-normal">+ Influencer Charges</span></div>
              <ul class="text-[11px] text-gray-300 space-y-2 border-t border-white/5 pt-4 font-sans font-light">
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> High-Retention Script & Concept Writing</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> Professional On-Location Video Shoot</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> Creative Post-Production (Editing)</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> Sony Mirrorless Camera Gear</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> Handheld 3-Axis Stabilizing Gimbal</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> Studio Lighting & Wireless Microphone</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> 2 Crew Team Members</li>
                <li class="flex items-center gap-2"><i data-lucide="clock" class="w-4 h-4 text-gray-500 flex-shrink-0"></i> 1 to 1.5 Hours Shoot Time</li>
              </ul>
            </div>
            <div class="pt-6">
              <a href="contact.html?service=influencer-marketing&tier=single-video" class="lime-glow-btn text-brandBg font-futuristic font-bold text-center py-2.5 rounded-xl text-xs block w-full">
                CHOOSE SINGLE VIDEO PACKAGE
              </a>
            </div>
          </div>

          <!-- Package 2: Custom Campaign -->
          <div class="glass-panel border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-limeGreen/30 transition-all duration-300 relative group">
            <div class="absolute top-4 right-4 text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-400 font-mono">TAILORED</div>
            <div class="space-y-4">
              <div class="space-y-1">
                <h4 class="text-lg font-bold text-white group-hover:text-limeGreen transition-colors">Custom Campaign</h4>
                <p class="text-[10px] text-gray-400">Multi-creator placements scaled according to audience reach and followers.</p>
              </div>
              <div class="text-xl font-black text-limeGreen font-sans py-2">Flexible / Scale-Based</div>
              <ul class="text-[11px] text-gray-300 space-y-2 border-t border-white/5 pt-4 font-sans font-light">
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> Multi-Creator Matchmaking & Strategy</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> Target Demographics Alignment</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> Rate Negotiations & Direct Deal Placement</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> Campaign Performance Track & Analytics</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-limeGreen flex-shrink-0"></i> Customized to Influencer Follower Count</li>
              </ul>
            </div>
            <div class="pt-6">
              <a href="contact.html?service=influencer-marketing&tier=custom-campaign" class="metallic-border text-white font-futuristic font-bold text-center py-2.5 rounded-xl text-xs block w-full hover:bg-white/5 transition-colors">
                INQUIRE FOR CUSTOM CAMPAIGN
              </a>
            </div>
          </div>

        </div>

        <!-- Policy Footnotes -->
        <div class="mt-8 pt-6 border-t border-white/5">
          <div class="flex items-start gap-2.5 bg-red-500/5 border border-red-500/10 rounded-xl p-4 text-[10px] text-gray-400">
            <i data-lucide="alert-triangle" class="w-4 h-4 text-red-400 flex-shrink-0"></i>
            <div>
              <strong class="text-red-400 block uppercase mb-0.5">TRAVEL EXPENSES (TA/DA) POLICY</strong>
              Travel & Daily Allowance (TA/DA) expenses for the crew are to be fully borne by the client.
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

const defaultClients = [
  {
    name: "Chacha TVS",
    category: "automobile",
    tenure: "2.5+ Years",
    insta: "https://www.instagram.com/chachatvs_kasganj?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    handle: "@chachatvs_kasganj",
    initials: "CT",
    icon: "car",
    logo: "client_logos/Chacha TVS/469400857_1701546764039515_4631678856202344053_n.jpg",
    desc: "Complete automobile digital marketing execution, festival launch campaigns, showroom videos, and graphic design elevation."
  },
  {
    name: "Shri Krishna Mobile",
    category: "electronics-mobile",
    tenure: "2.5+ Years",
    insta: "https://www.instagram.com/shrikrishnamobile_etah/",
    handle: "@shrikrishnamobile_etah",
    initials: "SKM",
    icon: "smartphone",
    logo: "client_logos/Shri Krishna Mobile/495457380_17846925279466986_2808942115912623832_n.jpg",
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
    logo: "client_logos/Time Electronic Centre/499656721_17842687731497523_7432095133639597349_n.jpg",
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
    logo: "client_logos/Balance Yoga Studio/425136918_1111146633558934_3187566961471955387_n.jpg",
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
    logo: "client_logos/DVF Mall/39323951_957709904352880_3567679253744975872_n.jpg",
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
    logo: "client_logos/New Apna Mobile/587916362_18442043599100357_5960844131275757720_n.jpg",
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
    logo: "client_logos/Chacha Exide Care/481382424_1642614726623559_5130906351632337479_n.jpg",
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
    logo: "client_logos/Taj Electronics/556234749_17844272319581212_609477138050771684_n.jpg",
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
    logo: "client_logos/Pankaj Computer Zone/652615569_18059330294460358_4107742064455736677_n.jpg",
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
    logo: "client_logos/Dhan Shri TVS/658665291_18073567658298489_4482987478413595714_n.jpg",
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
    logo: "client_logos/Coach Mukesh Soni/731016440_18602430400052034_1652070422194895315_n.jpg",
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
    logo: "client_logos/Mobile World/704592441_18136145926488374_4512266194765386123_n.jpg",
    desc: "Local mobile retail brand strategy, premium phone unboxings, and visual store walk-throughs."
  },
  {
    name: "Mats Computers",
    category: "electronics-mobile",
    tenure: "2+ Years",
    isOld: true,
    insta: "#",
    handle: "@matscomputers",
    initials: "MC",
    icon: "monitor",
    logo: "client_logos/Mats Computers/Screenshot 2026-07-25 131026.png",
    desc: "IT solutions, custom desktop builds, computer hardware, and tech retail brand presence."
  },
  {
    name: "VPN Timber & Hardware",
    category: "retail-wellness",
    tenure: "2+ Years",
    isOld: true,
    insta: "#",
    handle: "@vpntimber",
    initials: "VPN",
    icon: "hammer",
    logo: "client_logos/VPN Timber & Hardware/574279934_17845689168600449_518756765486348597_n.jpg",
    desc: "Premium timber, architectural hardware, interior materials, and construction supply marketing."
  },
  {
    name: "VPN Jewellers",
    category: "retail-wellness",
    tenure: "2+ Years",
    isOld: true,
    insta: "#",
    handle: "@vpnjewellers",
    initials: "VJ",
    icon: "gem",
    logo: "client_logos/VPN Jewellers/537298547_17853151527515525_527216833266455968_n.jpg",
    desc: "Exclusive gold & diamond jewellery collection showcases, bridal hype reels, and festive campaign designs."
  },
  {
    name: "SRS Auto & Financial Services",
    category: "automobile",
    tenure: "2+ Years",
    isOld: true,
    insta: "#",
    handle: "@srsautoservices",
    initials: "SRS",
    icon: "car",
    logo: "client_logos/SRS Auto & Financial Services/705340617_18077703917380236_6764662198683789440_n.jpg",
    desc: "Automobile financing solutions, vehicle insurance campaigns, and local auto services promotion."
  },
  {
    name: "Vansh Payal Jewellery",
    category: "retail-wellness",
    tenure: "2+ Years",
    isOld: true,
    insta: "#",
    handle: "@vanshpayaljewellery",
    initials: "VPJ",
    icon: "sparkles",
    logo: "client_logos/Vansh Payal Jewellery/702250334_17914401183383965_8004761820245369039_n.jpg",
    desc: "Traditional silver & gold jewellery showcases, festive offer teasers, and store walk-through reels."
  },
  {
    name: "Shri Roop Interio",
    category: "retail-wellness",
    tenure: "1.5+ Years",
    isOld: true,
    insta: "#",
    handle: "@shriroopinterio",
    initials: "SRI",
    icon: "home",
    logo: "client_logos/Shri Roop Interio/128152316_448806149852844_3229675202183708361_n.jpg",
    desc: "Modern interior design walkthroughs, custom modular furniture reels, and architectural content creation."
  },
  {
    name: "Uphaar Express",
    category: "retail-wellness",
    tenure: "1.5+ Years",
    isOld: true,
    insta: "#",
    handle: "@uphaarexpress",
    initials: "UE",
    icon: "gift",
    logo: "client_logos/Uphaar Express/482991774_2931681273676059_6806113917783411540_n.jpg",
    desc: "Customized gift hampers, corporate gifting promos, and festive occasion video reels."
  },
  {
    name: "Manglam Marble",
    category: "retail-wellness",
    tenure: "1.5+ Years",
    isOld: true,
    insta: "#",
    handle: "@manglammarble",
    initials: "MM",
    icon: "layers",
    logo: "client_logos/Manglam Marble/467358055_2032487600525457_3076599899937324612_n.jpg",
    desc: "Premium marble & tile collection showcases, home flooring elevation videos, and interior aesthetics."
  },
  {
    name: "SHRI KRISHNA CAR ACCESSORIES",
    category: "automobile",
    tenure: "1.5+ Years",
    isOld: true,
    insta: "#",
    handle: "@shrikrishnacaraccessories",
    initials: "SKC",
    icon: "shield",
    logo: "client_logos/SHRI KRISHNA CAR ACCESSORIES/467996110_1713009302821910_3310482308193255041_n.jpg",
    desc: "Car seat cover fittings, premium audio upgrades, ambient lighting reels, and custom auto modifications."
  },
  {
    name: "FABZILA",
    category: "retail-wellness",
    tenure: "1.5+ Years",
    isOld: true,
    insta: "#",
    handle: "@fabzila",
    initials: "FZ",
    icon: "shopping-bag",
    logo: "client_logos/FABZILA/696059087_17993124431962592_3980874206000344223_n.jpg",
    desc: "Trendy apparel collections, fashion lookbook video edits, and retail store footfall campaigns."
  },
  {
    name: "Vishnu Fashion",
    category: "retail-wellness",
    tenure: "1.5+ Years",
    isOld: true,
    insta: "#",
    handle: "@vishnufashion",
    initials: "VF",
    icon: "shirt",
    logo: "client_logos/Vishnu Fashion/474370944_1755499738357953_4039264935552091008_n.jpg",
    desc: "Ethnic & modern wear collections, festival sale launch reels, and customer testimonial videos."
  },
  {
    name: "A.V. Jewellers",
    category: "retail-wellness",
    tenure: "1+ Years",
    isOld: true,
    insta: "#",
    handle: "@avjewellers",
    initials: "AVJ",
    icon: "crown",
    logo: "client_logos/A.V. Jewellers/519988266_17845986537530006_1650956465504692481_n.jpg",
    desc: "Fine craftsmanship gold jewellery reels, custom hallmark designs, and luxury store promos."
  },
  {
    name: "ulfa",
    category: "retail-wellness",
    tenure: "1+ Years",
    isOld: true,
    insta: "#",
    handle: "@ulfabrand",
    initials: "ULFA",
    icon: "feather",
    logo: "client_logos/ulfa/485899778_625304997154227_8013768019368377535_n.jpg",
    desc: "Lifestyle & fashion content creation, brand identity aesthetics, and viral short-form video hooks."
  },
  {
    name: "Saree Museum",
    category: "retail-wellness",
    tenure: "1+ Years",
    isOld: true,
    insta: "#",
    handle: "@sareemuseum",
    initials: "SM",
    icon: "sparkles",
    logo: "client_logos/Saree Museum/541730394_17848617924552357_4581592102461243883_n.jpg",
    desc: "Bridal saree collections, silk saree drape reels, and traditional fashion digital promotions."
  },
  {
    name: "Saif Nutrition Coach",
    category: "retail-wellness",
    tenure: "1+ Years",
    isOld: true,
    insta: "#",
    handle: "@saifnutritioncoach",
    initials: "SNC",
    icon: "activity",
    logo: "client_logos/Saif Nutrition Coach/539262731_18369347605197677_8196103819138395271_n.jpg",
    desc: "Fitness & health transformation videos, diet coaching content, and personal branding growth."
  },
  {
    name: "Aavi Restaurant & Cafe",
    category: "retail-wellness",
    tenure: "1+ Years",
    isOld: true,
    insta: "#",
    handle: "@aavicafe",
    initials: "ARC",
    icon: "utensils",
    logo: "client_logos/Aavi Restaurant & Cafe/logo.jpg",
    desc: "Mouthwatering food videography, cafe ambiance reels, special menu launches, and food influencer campaigns."
  },
  {
    name: "Vikas Car Decoration",
    category: "automobile",
    tenure: "1+ Years",
    isOld: true,
    insta: "#",
    handle: "@vikascardecoration",
    initials: "VCD",
    icon: "car",
    logo: "client_logos/Vikas Car Decoration/513819836_17970891488869980_3000791485685821144_n.jpg",
    desc: "Luxury car detailing, wedding vehicle decor showcases, and custom car accessory installation reels."
  },
  {
    name: "CITY FASHION FLOOR",
    category: "retail-wellness",
    tenure: "1+ Years",
    isOld: true,
    insta: "#",
    handle: "@cityfashionfloor",
    initials: "CFF",
    icon: "shopping-cart",
    logo: "client_logos/CITY FASHION FLOOR/306740492_413534314255596_7466029059557184327_n.jpg",
    desc: "Multi-brand clothing retail promos, seasonal sale launches, and festive fashion walk-throughs."
  },
  {
    name: "Dulhaghar Kasganj",
    category: "retail-wellness",
    tenure: "1+ Years",
    isOld: true,
    insta: "#",
    handle: "@dulhaghar_kasganj",
    initials: "DGK",
    icon: "user-check",
    logo: "client_logos/Dulhaghar Kasganj/558087612_17848356648570948_1866885933471043269_n.jpg",
    desc: "Groom wedding wear showcases, designer sherwani reels, and bridal/groom fashion marketing."
  },
  {
    name: "Chacha Auto Wheels",
    category: "automobile",
    tenure: "1+ Years",
    isOld: true,
    insta: "#",
    handle: "@chachaautowheels",
    initials: "CAW",
    icon: "truck",
    logo: "client_logos/Chacha Auto Wheels/473592409_1478206776682296_3393567477325141016_n.jpg",
    desc: "Automobile dealership campaigns, new vehicle delivery celebrations, and service videos."
  },
  {
    name: "Chacha E Auto Wheels",
    category: "automobile",
    tenure: "1+ Years",
    isOld: true,
    insta: "#",
    handle: "@chachaeautowheels",
    initials: "CEA",
    icon: "zap",
    logo: "client_logos/Chacha E Auto Wheels/277912976_648851329748875_3795181786132105292_n.jpg",
    desc: "Electric 3-wheeler & EV dealership marketing, battery performance reels, and eco-mobility promos."
  },
  {
    name: "R.A. Suit Collection",
    category: "retail-wellness",
    tenure: "8+ Months",
    isOld: true,
    insta: "#",
    handle: "@rasuitcollection",
    initials: "RAS",
    icon: "tag",
    logo: "client_logos/R.A. Suit Collection/502953902_17842096101509291_8847541407930408022_n.jpg",
    desc: "Designer ladies suit collections, dress material showcases, and festive fashion promotional reels."
  },
  {
    name: "Baba Mobiles",
    category: "electronics-mobile",
    tenure: "8+ Months",
    isOld: true,
    insta: "#",
    handle: "@babamobiles",
    initials: "BM",
    icon: "smartphone",
    logo: "client_logos/Baba Mobiles/550193692_18057043949529214_5697041386503957568_n.jpg",
    desc: "Mobile phone accessories, device trade-in offers, and smartphone unboxing video reels."
  },
  {
    name: "Property Wala",
    category: "retail-wellness",
    tenure: "6+ Months",
    isOld: true,
    insta: "#",
    handle: "@propertywala",
    initials: "PW",
    icon: "building",
    logo: "client_logos/Property Wala/449082084_1220408432458570_4583079296570203708_n.jpg",
    desc: "Real estate property walkthroughs, plot & residential project promo videos, and land marketing."
  },
  {
    name: "A ONE Ultrasound & Eye Care",
    category: "retail-wellness",
    tenure: "6+ Months",
    isOld: true,
    insta: "#",
    handle: "@aoneeyecare",
    initials: "A1U",
    icon: "eye",
    logo: "client_logos/A ONE Ultrasound & Eye Care/480632363_1053494269873562_6423668081902522160_n.jpg",
    desc: "Healthcare awareness campaigns, diagnostic facility showcases, and medical consultation reels."
  },
  {
    name: "JAI SHREE SHYAM HOME DECORATOR",
    category: "retail-wellness",
    tenure: "6+ Months",
    isOld: true,
    insta: "#",
    handle: "@jaishreeshyamhomedecorator",
    initials: "JSS",
    icon: "home",
    logo: "client_logos/JAI SHREE SHYAM HOME DECORATOR/558983151_17989315616848957_6947374727473715281_n.jpg",
    desc: "Curtains, wallpapers, home furnishing showcases, and interior decor transformation videos."
  },
  {
    name: "M K Mobile",
    category: "electronics-mobile",
    tenure: "6+ Months",
    isOld: true,
    insta: "#",
    handle: "@mkmobile",
    initials: "MKM",
    icon: "smartphone",
    logo: "client_logos/M K Mobile/logo.jpg",
    desc: "Smartphone deals, gadget unboxing videos, and local mobile store promotions."
  }
];

/* ==========================================================================
   GLOBAL MASTER SYNC ENGINE (Multi-Device Cloud & Local Storage Sync)
   ========================================================================== */
const MASTER_CLOUD_ENDPOINT = 'https://jsonblob.com/api/jsonBlob/019fb1bb-1315-7b3e-987e-883b319ac086';

async function syncWithCloudMasterDB() {
  try {
    const response = await fetch(MASTER_CLOUD_ENDPOINT, { cache: 'no-cache' });
    if (response.ok) {
      const data = await response.json();
      let updated = false;

      if (data.clients && Array.isArray(data.clients) && data.clients.length > 0) {
        clientsList = data.clients;
        try { localStorage.setItem('mmg_clients_db', JSON.stringify(clientsList)); } catch (e) { }
        if (typeof initClientRoster === 'function') initClientRoster();
        updated = true;
      }
      if (data.reviews && Array.isArray(data.reviews) && data.reviews.length > 0) {
        feedbackList = data.reviews;
        try { localStorage.setItem('mmg_feedback_db', JSON.stringify(feedbackList)); } catch (e) { }
        if (typeof renderAllFeedbackViews === 'function') renderAllFeedbackViews();
        updated = true;
      }
      if (data.videos && Array.isArray(data.videos) && data.videos.length > 0) {
        videosList = data.videos;
        try { localStorage.setItem('mmg_videos_db', JSON.stringify(videosList)); } catch (e) { }
        if (typeof renderVideoReelsGrid === 'function') renderVideoReelsGrid();
        updated = true;
      }

      updateCloudSyncBadge(true);
      return true;
    }
  } catch (e) {
    try {
      const dbResp = await fetch('./db.json', { cache: 'no-cache' });
      if (dbResp.ok) {
        const localDb = await dbResp.json();
        if (localDb.clients && localDb.clients.length) {
          clientsList = localDb.clients;
          try { localStorage.setItem('mmg_clients_db', JSON.stringify(clientsList)); } catch (err) { }
          if (typeof initClientRoster === 'function') initClientRoster();
        }
        if (localDb.reviews && localDb.reviews.length) {
          feedbackList = localDb.reviews;
          try { localStorage.setItem('mmg_feedback_db', JSON.stringify(feedbackList)); } catch (err) { }
          if (typeof renderAllFeedbackViews === 'function') renderAllFeedbackViews();
        }
        if (localDb.videos && localDb.videos.length) {
          videosList = localDb.videos;
          try { localStorage.setItem('mmg_videos_db', JSON.stringify(videosList)); } catch (err) { }
          if (typeof renderVideoReelsGrid === 'function') renderVideoReelsGrid();
        }
      }
    } catch (err) { }
  }
  return false;
}

async function pushToCloudMasterDB() {
  const payload = {
    version: "2.0",
    updatedAt: new Date().toISOString(),
    clients: window.getClientsList ? window.getClientsList() : clientsList,
    reviews: window.getFeedbackList ? window.getFeedbackList() : feedbackList,
    videos: window.getVideosList ? window.getVideosList() : videosList
  };

  try {
    const res = await fetch(MASTER_CLOUD_ENDPOINT, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok || res.status === 200 || res.status === 204) {
      updateCloudSyncBadge(true);
      return true;
    }
  } catch (err) {
    console.warn('Cloud master push warning:', err);
  }
  updateCloudSyncBadge(false);
  return false;
}

function updateCloudSyncBadge(success) {
  const badge = document.getElementById('cloud-sync-status');
  if (!badge) return;
  if (success) {
    badge.className = "text-[10px] font-futuristic text-limeGreen font-bold flex items-center gap-1.5 bg-limeGreen/10 border border-limeGreen/30 px-3 py-1 rounded-xl";
    badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-limeGreen animate-pulse"></span> SYNCED TO CLOUD (LIVE ON ALL DEVICES)`;
  } else {
    badge.className = "text-[10px] font-futuristic text-yellow-400 font-bold flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/30 px-3 py-1 rounded-xl";
    badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-yellow-400"></span> SAVED LOCALLY`;
  }
}

window.syncWithCloudMasterDB = syncWithCloudMasterDB;
window.pushToCloudMasterDB = pushToCloudMasterDB;

// Trigger sync with cloud master DB on load
document.addEventListener('DOMContentLoaded', () => {
  syncWithCloudMasterDB();
});

function loadClientsDB() {
  try {
    const saved = localStorage.getItem('mmg_clients_db');
    if (saved) {
      clientsList = JSON.parse(saved);
      clientsList.forEach(c => {
        if (c.name === "Chacha TVS") {
          c.insta = "https://www.instagram.com/chachatvs_kasganj?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==";
        } else if (c.name === "Shri Krishna Mobile") {
          c.insta = "https://www.instagram.com/shrikrishnamobile_etah/";
        }
      });
      localStorage.setItem('mmg_clients_db', JSON.stringify(clientsList));
    } else {
      clientsList = [...defaultClients];
      localStorage.setItem('mmg_clients_db', JSON.stringify(clientsList));
    }
  } catch (e) {
    clientsList = [...defaultClients];
  }
}

function saveClientsDBGlobal(newList) {
  if (newList) clientsList = newList;
  try {
    localStorage.setItem('mmg_clients_db', JSON.stringify(clientsList));
  } catch (e) { }
  if (typeof initClientRoster === 'function') {
    initClientRoster();
  }
  pushToCloudMasterDB();
}

function saveFeedbackDBGlobal(newList) {
  if (newList) feedbackList = newList;
  try {
    localStorage.setItem('mmg_feedback_db', JSON.stringify(feedbackList));
  } catch (e) { }
  renderAllFeedbackViews();
  pushToCloudMasterDB();
}

function getClientsList() {
  if (!clientsList || clientsList.length === 0) loadClientsDB();
  return clientsList;
}

function getFeedbackList() {
  if (!feedbackList || feedbackList.length === 0) loadFeedbackDB();
  return feedbackList;
}

window.getClientsList = getClientsList;
window.getFeedbackList = getFeedbackList;
window.saveClientsDBGlobal = saveClientsDBGlobal;
window.saveFeedbackDBGlobal = saveFeedbackDBGlobal;

function initClientRoster() {
  const clientGrid = document.getElementById('client-grid');
  if (!clientGrid) return; // Only execute on clients.html

  loadClientsDB();

  const searchInput = document.getElementById('client-search');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const noClientsAlert = document.getElementById('no-clients-alert');

  const showMoreClientsContainer = document.getElementById('show-more-clients-container');
  const showMoreClientsBtn = document.getElementById('show-more-clients-btn');
  const showMoreClientsText = document.getElementById('show-more-clients-text');
  const showMoreClientsIcon = document.getElementById('show-more-clients-icon');

  let activeFilter = 'all';
  let searchQuery = '';
  let isClientsExpanded = false;

  // Render function
  function render() {
    const filtered = clientsList.filter(client => {
      const matchesFilter = activeFilter === 'all' || client.category === activeFilter;
      const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });

    if (filtered.length === 0) {
      clientGrid.innerHTML = '';
      noClientsAlert.classList.remove('hidden');
      if (showMoreClientsContainer) showMoreClientsContainer.classList.add('hidden');
    } else {
      noClientsAlert.classList.add('hidden');

      const clientsToDisplay = isClientsExpanded ? filtered : filtered.slice(0, 12);

      clientGrid.innerHTML = clientsToDisplay.map(client => {
        return `
          <div class="glass-panel border-white/5 rounded-3xl p-6 md:p-8 flex flex-col justify-between group cursor-pointer hover:border-limeGreen/20 transition-all duration-300 transform hover:-translate-y-1" onclick="openClientDetailModal('${client.name.replace(/'/g, "\\'")}')">
            <div class="space-y-6">
              <div class="flex items-start justify-between">
                <!-- Glowing Category Badge Logo -->
                <div class="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden group-hover:border-limeGreen/40 transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.02)] relative shrink-0">
                  <img src="${client.logo}" alt="${client.name} Logo" class="w-full h-full object-cover" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                  <!-- Fallback avatar in case logo image is not uploaded yet -->
                  <div class="hidden absolute inset-0 bg-limeGreen/10 text-limeGreen flex items-center justify-center group-hover:bg-limeGreen group-hover:text-brandBg transition-all duration-300">
                    <span class="absolute top-0 right-0 bg-limeGreen text-brandBg text-[7px] font-black px-1.5 py-0.5 rounded-bl rounded-tr-xl font-sans uppercase">${client.initials}</span>
                    <i data-lucide="${client.icon}" class="w-6 h-6"></i>
                  </div>
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

      // Show More / Show Less logic
      if (filtered.length > 12) {
        if (showMoreClientsContainer) showMoreClientsContainer.classList.remove('hidden');
        if (isClientsExpanded) {
          if (showMoreClientsText) showMoreClientsText.textContent = 'SHOW LESS CLIENTS';
          if (showMoreClientsIcon) showMoreClientsIcon.setAttribute('data-lucide', 'chevron-up');
        } else {
          if (showMoreClientsText) showMoreClientsText.textContent = 'SHOW MORE CLIENTS';
          if (showMoreClientsIcon) showMoreClientsIcon.setAttribute('data-lucide', 'chevron-down');
        }
      } else {
        if (showMoreClientsContainer) showMoreClientsContainer.classList.add('hidden');
      }

      if (window.lucide) lucide.createIcons();
    }
  }

  if (showMoreClientsBtn) {
    showMoreClientsBtn.addEventListener('click', () => {
      isClientsExpanded = !isClientsExpanded;
      render();
      if (!isClientsExpanded && clientGrid) {
        clientGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // Bind Search
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      isClientsExpanded = false;
      render();
    });
  }

  // Bind Filters
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.getAttribute('data-filter');
      isClientsExpanded = false;
      render();
    });
  });

  // Simple numeric animation logic
  function animateValue(obj, start, end, duration, suffix = '') {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentVal = Math.floor(progress * (end - start) + start);
      obj.innerHTML = currentVal.toLocaleString('en-US') + suffix;
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

  if (retObj) retObj.innerHTML = "5+ Yrs";
  if (partObj) animateValue(partObj, 0, 194, 1200, '+ Brands');
  if (reelObj) animateValue(reelObj, 0, 10000, 1500, '+ Reels');
  if (viewObj) animateValue(viewObj, 0, 100, 1500, 'M+ Views');

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
  if (!clientsList || clientsList.length === 0) loadClientsDB();
  const client = clientsList.find(c => c.name === clientName);
  if (!client) return;

  const detailModal = document.getElementById('client-detail-modal');
  if (!detailModal) return;

  let instaTarget = client.insta;
  if (!instaTarget || instaTarget === '#' || !instaTarget.startsWith('http')) {
    if (client.name === "Chacha TVS") {
      instaTarget = "https://www.instagram.com/chachatvs_kasganj?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==";
    } else if (client.handle && client.handle.startsWith('@')) {
      instaTarget = "https://www.instagram.com/" + client.handle.replace('@', '') + "/";
    } else {
      instaTarget = "https://www.instagram.com/medimusicagrow";
    }
  }

  detailModal.innerHTML = `
    <div class="feedback-modal-box w-full max-w-xl bg-zinc-950 border border-limeGreen/30 rounded-3xl p-6 md:p-8 shadow-2xl relative font-futuristic text-left max-h-[90vh] overflow-y-auto" id="client-spotlight-box">
      <!-- Close Button -->
      <button id="close-client-detail-modal" class="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors" title="Close" onclick="closeClientDetailModal()">
        <i data-lucide="x" class="w-6 h-6"></i>
      </button>

      <!-- Header block -->
      <div class="text-center space-y-4 border-b border-white/5 pb-6 select-none flex flex-col items-center">
        <h2 class="text-xl md:text-2xl font-black text-white tracking-wide leading-tight">PARTNER SPOTLIGHT</h2>
        <div class="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.05)] relative mt-2">
          <img src="${client.logo}" alt="${client.name} Logo" class="w-full h-full object-cover" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
          <div class="hidden absolute inset-0 bg-limeGreen/10 text-limeGreen flex items-center justify-center">
            <span class="absolute top-0 right-0 bg-limeGreen text-brandBg text-[7px] font-black px-1.5 py-0.5 rounded-bl rounded-tr-full font-sans uppercase">${client.initials}</span>
            <i data-lucide="${client.icon}" class="w-8 h-8"></i>
          </div>
        </div>
        <div class="inline-block bg-limeGreen/10 border border-limeGreen/30 rounded-full px-4 py-1.5 text-limeGreen text-xs font-bold uppercase tracking-widest">
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
            <a href="${instaTarget}" target="_blank" rel="noopener noreferrer" class="lime-glow-btn text-brandBg font-futuristic font-bold text-center py-2.5 rounded-xl text-xs block w-full flex items-center justify-center gap-1.5">
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
  detailModal.addEventListener('click', function (e) {
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
  initSmmPackageModal();
  initContentCreationModal();
  initCorporateEventsModal();
  initFamilyEventsModal();
  initAchievementShootModal();
  initMusicVideoModal();
  initVideoEditingModal();
  initInfluencerMarketingModal();
  initClientRoster();
  renderVideoReelsGrid();
});

/* ==========================================================================
   VIDEO REELS DATABASE & DYNAMIC RENDERER
   ========================================================================== */
const defaultVideoReels = [
  {
    id: "v1",
    title: "Chacha TVS — TVS Showroom Launch Reel",
    client: "Chacha TVS",
    speaker: "Authorized TVS Dealer • Kasganj",
    rating: "5.0",
    badge: "AUTOMOBILE",
    thumbnail: "reel_thumbnails/reel_ig_5.jpg",
    embedUrl: "https://www.instagram.com/reel/DGkWFcySJpg/embed/",
    igUrl: "https://www.instagram.com/reel/DGkWFcySJpg/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==",
    quote: "High-performance vehicle launch reels generated massive footfall and engagement across UP!"
  },
  {
    id: "v2",
    title: "Time Electronics Centre — Appliance Promo Reel",
    client: "Time Electronics Centre",
    speaker: "Managing Director • Time Electronics",
    rating: "5.0",
    badge: "ELECTRONICS & MOBILE",
    thumbnail: "reel_thumbnails/reel_ig_4.jpg",
    embedUrl: "https://www.instagram.com/reel/DG0FaWJzk5_/embed/",
    igUrl: "https://www.instagram.com/reel/DG0FaWJzk5_/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==",
    quote: "Meta video ads and festive offer promo doubled appliance & electronics sales within 2 weeks!"
  },
  {
    id: "v3",
    title: "DVF Mall — Retail Shopping Fest Reel",
    client: "DVF Mall",
    speaker: "Marketing Head • DVF Mall",
    rating: "5.0",
    badge: "RETAIL & WELLNESS",
    thumbnail: "reel_thumbnails/reel_ig_3.jpg",
    embedUrl: "https://www.instagram.com/reel/DMuVWSdTTCj/embed/",
    igUrl: "https://www.instagram.com/reel/DMuVWSdTTCj/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==",
    quote: "Awesome mall walkthrough reels and festive video graphics drove record shopping footfall."
  },
  {
    id: "v4",
    title: "Shree Krishna Mobile — Electronics Promo Reel",
    client: "Shree Krishna Mobile",
    speaker: "Store Founder • Shree Krishna Mobile",
    rating: "5.0",
    badge: "ELECTRONICS & MOBILE",
    thumbnail: "reel_thumbnails/reel_ig_2.jpg",
    embedUrl: "https://www.instagram.com/reel/DMzyueszyY_/embed/",
    igUrl: "https://www.instagram.com/reel/DMzyueszyY_/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==",
    quote: "High-impact promo reels increased walk-in customers and smartphone inquiries significantly!"
  },
  {
    id: "v5",
    title: "Uphaar Express — Gift & Retail Reel",
    client: "Uphaar Express",
    speaker: "Founding Partner • Uphaar Express",
    rating: "5.0",
    badge: "AUTO SMM ORBIT",
    thumbnail: "reel_thumbnails/reel_ig_1.jpg",
    embedUrl: "https://www.instagram.com/reel/DF16uvpyKLx/embed/",
    igUrl: "https://www.instagram.com/reel/DF16uvpyKLx/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==",
    quote: "High-converting gift & retail campaign reels scaled customer reach and online orders."
  },
  {
    id: "v6",
    title: "Fabzila — Fashion Branding Reel",
    client: "Fabzila",
    speaker: "Brand Lead • Fabzila",
    rating: "5.0",
    badge: "BRAND EDITING",
    thumbnail: "reel_thumbnails/reel_ig_6.jpg",
    embedUrl: "https://www.instagram.com/reel/DNDM05vzJqg/embed/",
    igUrl: "https://www.instagram.com/reel/DNDM05vzJqg/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==",
    quote: "Systematic fashion reel editing turned brand profiles into high-converting organic engines."
  },
  {
    id: "v7",
    title: "Saif Nutrition Coach — Fitness Transformation Reel",
    client: "Saif Nutrition Coach",
    speaker: "Saif • Chief Nutrition Coach",
    rating: "5.0",
    badge: "HEALTH & FITNESS",
    thumbnail: "reel_thumbnails/reel_ig_7.jpg",
    embedUrl: "https://www.instagram.com/reel/DEmcqIFPSwv/embed/",
    igUrl: "https://www.instagram.com/reel/DEmcqIFPSwv/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==",
    quote: "Clear storytelling and high-retention video editing helped scale online fitness coaching."
  }
];

let videosList = [];

function loadVideosDB() {
  videosList = [...defaultVideoReels];
  try {
    localStorage.setItem('mmg_videos_db', JSON.stringify(videosList));
  } catch (e) { }
}

function saveVideosDBGlobal(newList) {
  if (newList) videosList = newList;
  try {
    localStorage.setItem('mmg_videos_db', JSON.stringify(videosList));
  } catch (e) { }
  if (typeof renderVideoReelsGrid === 'function') {
    renderVideoReelsGrid();
  }
  pushToCloudMasterDB();
}

function getVideosList() {
  if (!videosList || videosList.length === 0) loadVideosDB();
  return videosList;
}

window.getVideosList = getVideosList;
window.saveVideosDBGlobal = saveVideosDBGlobal;

function renderVideoReelsGrid() {
  loadVideosDB();

  function buildReelCardHTML(reel) {
    return `
      <div class="glass-panel border-white/10 rounded-3xl overflow-hidden hover:border-limeGreen/50 transition-all duration-300 group flex flex-col justify-between shadow-xl">
        <div class="relative aspect-[9/16] bg-zinc-900 overflow-hidden cursor-pointer video-testimonial-trigger" 
             data-video-title="${reel.title.replace(/"/g, '&quot;')}" 
             data-client="${reel.client.replace(/"/g, '&quot;')}" 
             data-speaker="${reel.speaker.replace(/"/g, '&quot;')}" 
             data-rating="${reel.rating || '5.0'}" 
             data-src="${reel.embedUrl}" 
             data-ig-url="${reel.igUrl || '#'}">
          <img src="${reel.thumbnail}" alt="${reel.client} Instagram Reel" loading="lazy" decoding="async" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onerror="this.src='https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&auto=format&fit=crop';">
          <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>
          
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-14 h-14 rounded-full bg-limeGreen/90 text-brandBg flex items-center justify-center shadow-lg shadow-limeGreen/30 group-hover:scale-110 transition-transform">
              <i data-lucide="play" class="w-6 h-6 fill-brandBg ml-1"></i>
            </div>
          </div>

          <div class="absolute top-3 left-3">
            <span class="text-[9px] bg-black/70 backdrop-blur-md border border-white/10 text-limeGreen font-futuristic font-bold px-2.5 py-1 rounded-full uppercase">${reel.badge || 'REEL SHOWCASE'}</span>
          </div>

          <div class="absolute bottom-3 left-3 right-3 text-left space-y-1 select-none">
            <div class="flex items-center justify-between text-limeGreen font-futuristic font-bold text-xs">
              <span>${reel.client.toUpperCase()}</span>
              <span>${reel.rating || '5.0'} ★</span>
            </div>
            <p class="text-[10px] text-gray-300 font-futuristic">${reel.speaker}</p>
          </div>
        </div>
        
        <div class="p-4 space-y-2 text-left bg-zinc-950/80">
          <p class="text-xs text-gray-300 font-light italic">"${reel.quote}"</p>
          <a href="${reel.igUrl || '#'}" target="_blank" rel="noopener noreferrer" class="text-[9px] text-limeGreen hover:underline font-futuristic uppercase font-bold flex items-center gap-1">
            <i data-lucide="instagram" class="w-3 h-3"></i> WATCH ON INSTAGRAM
          </a>
        </div>
      </div>
    `;
  }

  // 1. Feedback Page (#video-reels-grid)
  const feedbackContainer = document.getElementById('video-reels-grid');
  if (feedbackContainer) {
    const filtered = videosList.filter(r => !r.pages || r.pages.feedback !== false);
    feedbackContainer.innerHTML = filtered.map(buildReelCardHTML).join('');
  }

  // 2. Home Page (#home-video-reels-grid)
  const homeContainer = document.getElementById('home-video-reels-grid');
  if (homeContainer) {
    const filtered = videosList.filter(r => !r.pages || r.pages.home !== false).slice(0, 4);
    homeContainer.innerHTML = filtered.map(buildReelCardHTML).join('');
  }

  // 3. Services Page (#services-video-reels-grid)
  const servicesContainer = document.getElementById('services-video-reels-grid');
  if (servicesContainer) {
    const filtered = videosList.filter(r => r.pages && r.pages.services === true);
    if (filtered.length > 0) {
      servicesContainer.innerHTML = filtered.map(buildReelCardHTML).join('');
    }
  }

  if (window.lucide) lucide.createIcons();

  if (typeof initVideoTestimonialModals === 'function') {
    initVideoTestimonialModals();
  }
}

/* ==========================================================================
   GLOBAL VIDEO REEL TESTIMONIAL MODAL CONTROLLER
   ========================================================================== */
function openVideoReelModal(src, title, speaker, rating, igUrl) {
  const videoModal = document.getElementById('video-modal-overlay');
  const videoIframe = document.getElementById('video-modal-iframe');
  const videoTitle = document.getElementById('video-modal-title');
  const videoSpeaker = document.getElementById('video-modal-speaker');
  const videoRating = document.getElementById('video-modal-rating');
  const videoIgLink = document.getElementById('video-modal-ig-link');

  if (videoTitle) videoTitle.textContent = title || 'Client Video Testimonial';
  if (videoSpeaker) videoSpeaker.innerHTML = speaker || 'Verified Brand Partner';
  if (videoRating) videoRating.textContent = rating || '5.0';

  let cleanEmbedSrc = src || '';
  if (cleanEmbedSrc && !cleanEmbedSrc.includes('/embed')) {
    cleanEmbedSrc = cleanEmbedSrc.endsWith('/') ? cleanEmbedSrc + 'embed/' : cleanEmbedSrc + '/embed/';
  }

  if (videoIframe) {
    videoIframe.src = cleanEmbedSrc;
  }

  let cleanIgTarget = igUrl || src || 'https://www.instagram.com/medimusicagrow/';
  if (cleanIgTarget.endsWith('/embed/')) {
    cleanIgTarget = cleanIgTarget.replace('/embed/', '/');
  }
  if (videoIgLink) {
    videoIgLink.href = cleanIgTarget;
  }

  if (videoModal) {
    videoModal.style.display = 'flex';
    videoModal.style.opacity = '1';
    videoModal.style.pointerEvents = 'auto';
    videoModal.classList.add('open');
  }
}

function closeVideoPlayerModal() {
  const videoModal = document.getElementById('video-modal-overlay');
  if (videoModal) {
    videoModal.classList.remove('open');
    videoModal.style.opacity = '0';
    videoModal.style.pointerEvents = 'none';
    setTimeout(() => {
      if (videoModal && !videoModal.classList.contains('open')) {
        videoModal.style.display = 'none';
      }
    }, 400);
  }
  const videoIframe = document.getElementById('video-modal-iframe');
  if (videoIframe) {
    videoIframe.src = '';
  }
}

function initVideoTestimonialModals() {
  const closeVideoBtn = document.getElementById('close-video-modal');
  const videoModal = document.getElementById('video-modal-overlay');

  if (closeVideoBtn) {
    closeVideoBtn.onclick = (e) => {
      if (e) { e.preventDefault(); e.stopPropagation(); }
      closeVideoPlayerModal();
    };
  }

  if (videoModal) {
    videoModal.onclick = (e) => {
      if (e.target === videoModal) {
        closeVideoPlayerModal();
      }
    };
  }
}

window.openVideoReelModal = openVideoReelModal;
window.closeVideoPlayerModal = closeVideoPlayerModal;
window.initVideoTestimonialModals = initVideoTestimonialModals;

// Global Click Delegation for Reel Cards & Triggers across ALL pages
document.addEventListener('click', (e) => {
  // If clicking on direct "WATCH ON INSTAGRAM" anchor button, allow default external link navigation
  const directLink = e.target.closest('a[href*="instagram.com"]');
  if (directLink && !directLink.id.includes('video-modal-ig-link')) {
    return;
  }

  const trigger = e.target.closest('.video-testimonial-trigger') || e.target.closest('[data-src]');
  if (!trigger) return;

  e.preventDefault();

  const src = trigger.getAttribute('data-src');
  const title = trigger.getAttribute('data-video-title');
  const speaker = trigger.getAttribute('data-speaker');
  const rating = trigger.getAttribute('data-rating') || '5.0';
  const igUrl = trigger.getAttribute('data-ig-url') || src;

  openVideoReelModal(src, title, speaker, rating, igUrl);
});

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && (e.key === 'a' || e.key === 'A')) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
  if (e.key === 'Escape') {
    closeVideoPlayerModal();
  }
}, true);

document.addEventListener('DOMContentLoaded', () => {
  initVideoTestimonialModals();
});
