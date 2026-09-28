/**
 * PAK INTERIORS — Lahore
 * Pure Architectural Minimalism & Cinematic Two-Sided Text Walkthrough
 */

(function () {
  'use strict';

  const TOTAL_FRAMES = 300;
  const INITIAL_BATCH = 15;
  const FRAME_PREFIX = 'frames/ezgif-frame-';
  const FRAME_EXT = '.jpg';

  // 5 Story Beats (Staggered two-sided reveals)
  // 5 Story Beats (Company Story & Architectural Expertise)
  const ZONES = [
    {
      id: 1,
      num: '01',
      title: 'The Atelier',
      tag: 'PAK INTERIORS • LAHORE',
      prose: 'A bespoke architectural & interior design atelier curating monumental private residences with quiet luxury and timeless material honesty.',
      frameStart: 1,
      frameEnd: 60
    },
    {
      id: 2,
      num: '02',
      title: 'Architectural Mastery',
      tag: 'EXPERTISE • PRIVATE RESIDENCES',
      prose: 'Specializing in turnkey 1-to-8 Kanal luxury commissions across DHA, Gulberg, and Bedian. We sculpt light, space, and volume into living art.',
      frameStart: 61,
      frameEnd: 125
    },
    {
      id: 3,
      num: '03',
      title: 'Haute Joinery & Millwork',
      tag: 'EXPERTISE • BESPOKE CRAFTSMANSHIP',
      prose: 'Precision smoked oak cabinetry, Italian travertine masonry, and custom furniture tailored in our dedicated artisan workshops.',
      frameStart: 126,
      frameEnd: 185
    },
    {
      id: 4,
      num: '04',
      title: 'Atmospheric Lighting',
      tag: 'EXPERTISE • INVISIBLE ENGINEERING',
      prose: 'Concealed smart climate systems and museum-grade architectural lighting design that quietly choreographs ambient mood through every hour.',
      frameStart: 186,
      frameEnd: 245
    },
    {
      id: 5,
      num: '05',
      title: 'Courtyard & Aquatics',
      tag: 'EXPERTISE • INDOOR-OUTDOOR INTEGRATION',
      prose: 'Seamless fluid transitions into tranquil private courtyards, heated lap pools, and curated indigenous botanical gardens under the Lahore sky.',
      frameStart: 246,
      frameEnd: 300
    }
  ];

  // Default Branding
  const DEFAULT_CONFIG = {
    companyName: 'PAK INTERIORS',
    tagline: 'LAHORE',
    phone: '+92 42 3578 9900',
    whatsapp: '923008457700',
    email: 'atelier@pakinteriors.com',
    address: 'Suite 402, Al-Hafeez Heights, Ghalib Rd, Gulberg III, Lahore, Pakistan',
    logoUrl: '',
    notifyWhatsapp: '923008457700',
    notifyEmail: 'atelier@pakinteriors.com',
    whatsappApiKey: '',
    notifyWebhook: '',
    passcode: 'pakinteriors2026'
  };

  // Seed Projects
  const SEED_PROJECTS = [
    {
      id: 'proj-1',
      title: 'The Courtyard Villa',
      category: 'villas',
      location: 'DHA Phase 6, Lahore',
      area: '2 Kanal',
      coverImage: 'assets/projects/dha_phase6_villa.jpg',
      desc: 'Double-height travertine living spaces, custom teak slat paneling, sunken majlis lounge, and uninterrupted vistas of the private swimming pool and courtyard garden.'
    },
    {
      id: 'proj-2',
      title: 'The Skyline Penthouse',
      category: 'penthouses',
      location: 'Gulberg III, Lahore',
      area: '4,500 sq ft',
      coverImage: 'assets/projects/gulberg_penthouse.jpg',
      desc: 'Floor-to-ceiling glass wrapping around a suspended Calacatta marble fireplace, low-profile charcoal velvet seating, and illuminated smoked oak joinery.'
    },
    {
      id: 'proj-3',
      title: 'Bedian Serenity Farmhouse',
      category: 'farmhouses',
      location: 'Bedian Road, Lahore',
      area: '8 Kanal Estate',
      coverImage: 'assets/projects/bedian_farmhouse.jpg',
      desc: 'A minimalist modern farmhouse pavilion framed by exposed timber trusses, polished microcement floors, and a tranquil 25m courtyard reflection pool.'
    }
  ];

  // Seed Testimonials
  const SEED_TESTIMONIALS = [
    {
      id: 'test-1',
      name: 'Hamza Malik',
      title: 'Malik Textiles',
      location: 'DHA Phase 6, Lahore',
      quote: 'PAK Interiors transformed our 2-Kanal villa into an absolute sanctuary. The synergy between imported Italian travertine and custom teak joinery executed in Lahore is world-class.'
    },
    {
      id: 'test-2',
      name: 'Dr. Ayesha Tariq',
      title: 'Consultant Surgeon',
      location: 'Gulberg III, Lahore',
      quote: 'The precision in their architectural lighting and pocket sliding systems on our Raya Fairways penthouse exceeded international standards.'
    }
  ];

  // App State
  let config = JSON.parse(localStorage.getItem('pak_config')) || DEFAULT_CONFIG;
  let projects = JSON.parse(localStorage.getItem('pak_projects')) || SEED_PROJECTS;
  let testimonials = JSON.parse(localStorage.getItem('pak_testimonials')) || SEED_TESTIMONIALS;
  let leads = JSON.parse(localStorage.getItem('pak_leads')) || [];

  // Canvas & Frame Cache
  const images = new Array(TOTAL_FRAMES + 1);
  let loadedCount = 0;
  let currentFrame = 1;
  let targetFrame = 1;
  let lastDrawnFrame = -1;
  let currentZoneId = 1;

  // DOM Elements
  const heroSection = document.getElementById('hero');
  const canvas = document.getElementById('animation-canvas');
  const ctx = canvas.getContext('2d', { alpha: false });

  const loaderScreen = document.getElementById('loader-screen');
  const progressBarFill = document.getElementById('progress-bar-fill');

  // Hero Split Text Elements
  const heroLeft = document.getElementById('hero-left');
  const heroRight = document.getElementById('hero-right');
  const heroNum = document.getElementById('hero-num');
  const heroTitle = document.getElementById('hero-title');
  const heroTag = document.getElementById('hero-tag');
  const heroProse = document.getElementById('hero-prose');

  // Projects Grid
  const projectsGrid = document.getElementById('projects-grid');
  const testimonialsGrid = document.getElementById('testimonials-grid');

  // Modals
  const modalProject = document.getElementById('modal-project');
  const btnCloseProject = document.getElementById('btn-close-project');

  const adminModal = document.getElementById('admin-modal');
  const adminAuthCard = document.getElementById('admin-auth-card');
  const adminDashboardCard = document.getElementById('admin-dashboard-card');
  const adminPasscode = document.getElementById('admin-passcode');
  const adminAuthError = document.getElementById('admin-auth-error');
  const btnFooterAdmin = document.getElementById('btn-footer-admin');
  const btnCloseAdminAuth = document.getElementById('btn-close-admin-auth');
  const btnCloseAdmin = document.getElementById('btn-close-admin');
  const btnAdminLogout = document.getElementById('btn-admin-logout');

  const adminTabs = document.querySelectorAll('.dash-tab');
  const adminPanels = document.querySelectorAll('.dash-panel');

  const adminProjectEditorModal = document.getElementById('admin-project-editor-modal');
  const btnAddProjectModal = document.getElementById('btn-add-project-modal');
  const btnCloseProjectEditor = document.getElementById('btn-close-project-editor');
  const btnCancelProjectEditor = document.getElementById('btn-cancel-project-editor');
  const projectEditorForm = document.getElementById('project-editor-form');

  const editProjFile = document.getElementById('edit-proj-file');
  const editProjImageUrl = document.getElementById('edit-proj-image-url');
  const imagePreviewBox = document.getElementById('image-preview-box');
  const editProjPreviewImg = document.getElementById('edit-proj-preview-img');

  /**
   * 1. PRELOADER & FRAME CACHING
   */
  function formatFrameNumber(num) {
    return String(Math.min(Math.max(num, 1), TOTAL_FRAMES)).padStart(3, '0');
  }

  let loaderDismissed = false;
  let renderLoopStarted = false;

  function hideLoader() {
    if (loaderDismissed) return;
    loaderDismissed = true;
    if (loaderScreen) {
      loaderScreen.classList.add('loaded');
    }
    resizeCanvas();
    if (!renderLoopStarted) {
      renderLoopStarted = true;
      requestAnimationFrame(renderLoop);
    }
  }

  function startPreloading() {
    // 1. Initial immediate canvas setup
    resizeCanvas();

    // 2. Unconditional safety timer - site will NEVER hang on preloader
    setTimeout(() => {
      hideLoader();
    }, 1500);

    // 3. Load first frame and display immediately
    const firstImg = new Image();
    firstImg.src = `${FRAME_PREFIX}${formatFrameNumber(1)}${FRAME_EXT}`;
    images[1] = firstImg;

    firstImg.onload = () => {
      loadedCount++;
      drawFrame(firstImg);
      updateLoader();
      setTimeout(hideLoader, 150);

      // Stream the remaining frames in background chunks
      loadRemainingFrames();
    };

    firstImg.onerror = () => {
      console.warn('Frame 1 load error, revealing UI');
      hideLoader();
      loadRemainingFrames();
    };
  }

  function loadBatch(start, end, callback) {
    let batchLoaded = 0;
    const totalInBatch = end - start + 1;

    for (let i = start; i <= end; i++) {
      const img = new Image();
      img.src = `${FRAME_PREFIX}${formatFrameNumber(i)}${FRAME_EXT}`;
      images[i] = img;

      const onComplete = () => {
        loadedCount++;
        batchLoaded++;
        updateLoader();
        if (batchLoaded >= totalInBatch && callback) {
          callback();
        }
      };

      if ('decode' in img) {
        img.onload = () => {
          img.decode().then(onComplete).catch(onComplete);
        };
      } else {
        img.onload = onComplete;
      }
      img.onerror = onComplete;
    }
  }

  function loadRemainingFrames() {
    let index = 2;
    const CHUNK_SIZE = 15;

    function loadNextChunk() {
      if (index > TOTAL_FRAMES) return;
      const chunkEnd = Math.min(index + CHUNK_SIZE - 1, TOTAL_FRAMES);
      loadBatch(index, chunkEnd, () => {
        index = chunkEnd + 1;
        setTimeout(loadNextChunk, 20);
      });
    }

    loadNextChunk();
  }

  function updateLoader() {
    const percent = Math.min(Math.round((loadedCount / TOTAL_FRAMES) * 100), 100);
    if (progressBarFill) progressBarFill.style.width = `${percent}%`;
  }

  /**
   * 2. HIGH QUALITY CANVAS ENGINE
   */
  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    lastDrawnFrame = -1;
    drawFrame(images[Math.round(currentFrame)] || images[1]);
  }

  window.addEventListener('resize', resizeCanvas);

  function drawFrame(img) {
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cWidth = window.innerWidth;
    const cHeight = window.innerHeight;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = cWidth / cHeight;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
      drawWidth = cWidth;
      drawHeight = cWidth / imgRatio;
      offsetX = 0;
      offsetY = (cHeight - drawHeight) / 2;
    } else {
      drawHeight = cHeight;
      drawWidth = cHeight * imgRatio;
      offsetX = (cWidth - drawWidth) / 2;
      offsetY = 0;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.clearRect(0, 0, cWidth, cHeight);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }

  /**
   * 3. INERTIAL RENDER LOOP
   */
  function renderLoop() {
    const delta = targetFrame - currentFrame;
    if (Math.abs(delta) > 0.002) {
      currentFrame += delta * 0.12; // Silky mass
    } else {
      currentFrame = targetFrame;
    }

    const frameInt = Math.min(Math.max(Math.round(currentFrame), 1), TOTAL_FRAMES);

    if (frameInt !== lastDrawnFrame) {
      const img = images[frameInt];
      if (img && img.complete && img.naturalWidth > 0) {
        drawFrame(img);
        lastDrawnFrame = frameInt;
      }
      onFrameUpdate(frameInt);
    }

    requestAnimationFrame(renderLoop);
  }

  /**
   * 4. DOCUMENT & TRACKPAD SCROLL SYNC
   */
  function onScroll() {
    const heroRect = heroSection.getBoundingClientRect();
    const maxScroll = heroSection.offsetHeight - window.innerHeight;
    const scrollYInHero = -heroRect.top;

    if (scrollYInHero >= 0 && scrollYInHero <= maxScroll) {
      const progress = Math.max(0, Math.min(1, scrollYInHero / maxScroll));
      targetFrame = 1 + progress * (TOTAL_FRAMES - 1);
    } else if (scrollYInHero < 0) {
      targetFrame = 1;
    } else if (scrollYInHero > maxScroll) {
      targetFrame = TOTAL_FRAMES;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /**
   * 5. STAGGERED TWO-SIDED EDITORIAL TEXT REVEAL ("One by one")
   */
  function onFrameUpdate(frameNum) {
    // 1. Center Hero Intro: Visible during initial frames (1 to ~28), smoothly fades out between 28 and 55
    const centerIntro = document.getElementById('hero-center-intro');
    const splitText = document.getElementById('hero-split-text');

    if (centerIntro) {
      if (frameNum <= 28) {
        centerIntro.style.opacity = '1';
        centerIntro.style.transform = 'translate(-50%, -50%) scale(1)';
        centerIntro.style.pointerEvents = 'none';
        if (splitText) {
          splitText.style.opacity = '0';
          splitText.style.pointerEvents = 'none';
        }
      } else if (frameNum > 28 && frameNum <= 55) {
        const fadeOut = (55 - frameNum) / 27; // 1 down to 0
        centerIntro.style.opacity = String(Math.max(0, fadeOut));
        centerIntro.style.transform = `translate(-50%, calc(-50% - ${(1 - fadeOut) * 25}px)) scale(${0.96 + fadeOut * 0.04})`;
        if (splitText) {
          splitText.style.opacity = String(Math.max(0, 1 - fadeOut));
          splitText.style.pointerEvents = 'none';
        }
      } else {
        centerIntro.style.opacity = '0';
        if (splitText) {
          splitText.style.opacity = '1';
          splitText.style.pointerEvents = 'none';
        }
      }
    }

    // 2. Zone text update
    const activeZone = ZONES.find(z => frameNum >= z.frameStart && frameNum <= z.frameEnd) || ZONES[0];
    if (activeZone.id !== currentZoneId) {
      currentZoneId = activeZone.id;
      revealZoneTexts(activeZone);
    }
  }

  function revealZoneTexts(zone) {
    // 1. First fade out both sides
    heroLeft.style.opacity = '0';
    heroLeft.style.transform = 'translateY(14px)';
    heroRight.style.opacity = '0';
    heroRight.style.transform = 'translateY(14px)';

    // 2. Left side appears first
    setTimeout(() => {
      heroNum.textContent = zone.num;
      heroTitle.textContent = zone.title;
      heroTag.textContent = zone.tag;

      heroLeft.style.opacity = '1';
      heroLeft.style.transform = 'translateY(0)';
    }, 200);

    // 3. Right side appears 180ms after ("one by one")
    setTimeout(() => {
      heroProse.textContent = zone.prose;

      heroRight.style.opacity = '1';
      heroRight.style.transform = 'translateY(0)';
    }, 420);
  }

  /**
   * 6. PORTFOLIO GALLERY
   */
  function renderProjects() {
    if (!projectsGrid) return;
    projectsGrid.innerHTML = '';

    projects.forEach(p => {
      const item = document.createElement('div');
      item.className = 'portfolio-item';

      item.innerHTML = `
        <div class="portfolio-img-wrap">
          <img src="${p.coverImage}" alt="${p.title}" class="minimal-img" loading="lazy">
        </div>
        <h3 class="portfolio-title">${p.title}</h3>
        <span class="portfolio-meta">${p.location} • ${p.area}</span>
      `;

      item.addEventListener('click', () => openProjectModal(p));
      projectsGrid.appendChild(item);
    });
  }

  let currentModalMedia = [];
  let currentModalMediaIndex = 0;

  function setModalMedia(index) {
    if (!currentModalMedia || currentModalMedia.length === 0) return;
    currentModalMediaIndex = (index + currentModalMedia.length) % currentModalMedia.length;
    const item = currentModalMedia[currentModalMediaIndex];
    const imgEl = document.getElementById('modal-proj-img');
    const videoEl = document.getElementById('modal-proj-video');
    const stripEl = document.getElementById('modal-thumbs-strip');

    if (!imgEl || !videoEl) return;

    if (item.type === 'video') {
      imgEl.classList.add('hidden');
      videoEl.classList.remove('hidden');
      videoEl.src = item.url;
      videoEl.play().catch(() => {});
    } else {
      videoEl.pause();
      videoEl.classList.add('hidden');
      imgEl.classList.remove('hidden');
      imgEl.src = item.url;
    }

    if (stripEl) {
      const thumbs = stripEl.querySelectorAll('.modal-thumb-btn');
      thumbs.forEach((th, i) => {
        if (i === currentModalMediaIndex) th.classList.add('active');
        else th.classList.remove('active');
      });
    }
  }

  function openProjectModal(p) {
    document.getElementById('modal-proj-category').textContent = (p.category || 'RESIDENCE').toUpperCase();
    document.getElementById('modal-proj-title').textContent = p.title;
    document.getElementById('modal-proj-location').textContent = `${p.location} • ${p.area}`;
    document.getElementById('modal-proj-desc').textContent = p.desc;

    // Prepare media list
    currentModalMedia = Array.isArray(p.media) && p.media.length > 0
      ? p.media
      : [{ type: 'image', url: p.coverImage }];

    const stripEl = document.getElementById('modal-thumbs-strip');
    if (stripEl) {
      if (currentModalMedia.length > 1) {
        stripEl.classList.remove('hidden');
        stripEl.innerHTML = '';
        currentModalMedia.forEach((m, idx) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = `modal-thumb-btn ${idx === 0 ? 'active' : ''}`;
          if (m.type === 'video') {
            btn.innerHTML = `<video src="${m.url}"></video><span class="modal-thumb-badge">VID</span>`;
          } else {
            btn.innerHTML = `<img src="${m.url}" alt="thumb"><span class="modal-thumb-badge">IMG</span>`;
          }
          btn.addEventListener('click', () => setModalMedia(idx));
          stripEl.appendChild(btn);
        });
      } else {
        stripEl.classList.add('hidden');
        stripEl.innerHTML = '';
      }
    }

    setModalMedia(0);

    modalProject.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (modalProject) {
      modalProject.classList.remove('open');
      const videoEl = document.getElementById('modal-proj-video');
      if (videoEl) {
        videoEl.pause();
        videoEl.src = '';
      }
      document.body.style.overflow = '';
    }
  }

  if (btnCloseProject && modalProject) {
    btnCloseProject.addEventListener('click', closeProjectModal);
  }

  const btnModalInquire = document.getElementById('btn-modal-inquire');
  if (btnModalInquire && modalProject) {
    btnModalInquire.addEventListener('click', closeProjectModal);
  }

  /**
   * 7. TESTIMONIALS
   */
  function renderTestimonials() {
    if (!testimonialsGrid) return;
    testimonialsGrid.innerHTML = '';

    testimonials.forEach(t => {
      const row = document.createElement('div');
      row.className = 'quote-row';

      row.innerHTML = `
        <p class="quote-text">“${t.quote}”</p>
        <span class="quote-speaker">${t.name} — ${t.location}</span>
      `;

      testimonialsGrid.appendChild(row);
    });
  }

  /**
   * 8. LEADS SUBMISSION
   */
  window.submitLead = function () {
    const name = document.getElementById('contact-name').value;
    const phone = document.getElementById('contact-phone').value;
    const email = document.getElementById('contact-email').value;
    const location = document.getElementById('contact-location').value;
    const notes = document.getElementById('contact-notes').value;

    const newLead = {
      id: 'lead-' + Date.now(),
      name,
      phone,
      email,
      location,
      notes,
      timestamp: new Date().toLocaleDateString()
    };

    leads.unshift(newLead);
    localStorage.setItem('pak_leads', JSON.stringify(leads));

    if (window.PAK_DB) {
      window.PAK_DB.submitLead(newLead);
    }

    const form = document.getElementById('contact-form');
    const notice = document.getElementById('contact-success-msg');
    form.classList.add('hidden');
    notice.classList.remove('hidden');

    renderAdminLeads();

    // 1. Silent Background Automated WhatsApp Dispatch to Owner (CallMeBot or API)
    // NOTE: Does NOT pop up or redirect customer to WhatsApp! Customer stays on website.
    const targetWa = (config.notifyWhatsapp || config.whatsapp || '').replace(/[^0-9]/g, '');
    const apiKey = config.whatsappApiKey ? config.whatsappApiKey.trim() : '';

    const leadSummary = `*NEW CONSULTATION LEAD — ${config.companyName}*\n\n` +
      `• *Client Name:* ${name}\n` +
      `• *Phone:* ${phone}\n` +
      `• *Email:* ${email || 'N/A'}\n` +
      `• *Location:* ${location || 'Lahore'}\n` +
      `• *Notes:* ${notes || 'None'}\n` +
      `• *Time:* ${new Date().toLocaleString()}`;

    if (targetWa && apiKey) {
      const callmebotUrl = `https://api.callmebot.com/whatsapp.php?phone=${targetWa}&text=${encodeURIComponent(leadSummary)}&apikey=${encodeURIComponent(apiKey)}`;
      fetch(callmebotUrl, { mode: 'no-cors' }).catch(err => {
        console.warn('Background WhatsApp dispatch error:', err);
      });
    }

    // 2. Custom Webhook Dispatch (Make.com, Zapier, or WhatsApp bot)
    if (config.notifyWebhook && config.notifyWebhook.trim()) {
      fetch(config.notifyWebhook.trim(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'new_lead',
          company: config.companyName,
          lead: newLead
        })
      }).catch(err => {
        console.warn('Background webhook dispatch error:', err);
      });
    }

    setTimeout(() => {
      form.reset();
      form.classList.remove('hidden');
      notice.classList.add('hidden');
    }, 4500);
  };

  /**
   * 9. STUDIO CMS
   */
  function openAdminAuth() {
    adminModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    const isAuthed = sessionStorage.getItem('pak_admin_authed') === 'true';

    if (isAuthed) {
      showAdminDashboard();
    } else {
      adminAuthCard.classList.remove('hidden');
      adminDashboardCard.classList.add('hidden');
      adminPasscode.value = '';
      adminPasscode.focus();
    }
  }

  function closeAdmin() {
    adminModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (btnFooterAdmin) btnFooterAdmin.addEventListener('click', openAdminAuth);
  if (btnCloseAdminAuth) btnCloseAdminAuth.addEventListener('click', closeAdmin);
  if (btnCloseAdmin) btnCloseAdmin.addEventListener('click', closeAdmin);

  window.checkAdminAuth = function () {
    if (adminPasscode && adminPasscode.value === config.passcode) {
      sessionStorage.setItem('pak_admin_authed', 'true');
      if (adminAuthError) adminAuthError.classList.add('hidden');
      showAdminDashboard();
    } else {
      if (adminAuthError) adminAuthError.classList.remove('hidden');
    }
  };

  if (btnAdminLogout) {
    btnAdminLogout.addEventListener('click', () => {
      sessionStorage.removeItem('pak_admin_authed');
      if (adminDashboardCard) adminDashboardCard.classList.add('hidden');
      if (adminAuthCard) adminAuthCard.classList.remove('hidden');
    });
  }

  function showAdminDashboard() {
    adminAuthCard.classList.add('hidden');
    adminDashboardCard.classList.remove('hidden');
    renderAdminProjects();
    renderAdminTestimonials();
    renderAdminLeads();
    loadWhiteLabelForm();
    loadCloudConfigForm();
  }

  adminTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      adminTabs.forEach(t => t.classList.remove('active'));
      adminPanels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-tab');
      document.getElementById(targetId).classList.add('active');
    });
  });

  function renderAdminProjects() {
    const tbody = document.getElementById('admin-projects-tbody');
    const countEl = document.getElementById('admin-proj-count');
    if (!tbody) return;

    tbody.innerHTML = '';
    countEl.textContent = projects.length;

    projects.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><img src="${p.coverImage}" class="cms-thumb" alt="${p.title}"></td>
        <td><strong>${p.title}</strong></td>
        <td>${p.category}</td>
        <td>${p.location}</td>
        <td>
          <button class="btn-ghost btn-mini" onclick="window.editProject('${p.id}')">Edit</button>
          <button class="btn-ghost btn-mini" onclick="window.deleteProject('${p.id}')" style="color: #ff7070;">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  let currentEditorMedia = [];

  function renderEditorMediaList() {
    const listEl = document.getElementById('project-media-items-list');
    if (!listEl) return;
    listEl.innerHTML = '';

    if (currentEditorMedia.length === 0) {
      listEl.innerHTML = `<p style="font-size: 11px; color: var(--text-muted); padding: 6px 0;">No gallery media added yet. Click "+ Add Image / Video" to add slides.</p>`;
      return;
    }

    currentEditorMedia.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = 'media-item-row';

      row.innerHTML = `
        <select class="media-type-select" data-idx="${index}">
          <option value="image" ${item.type === 'image' ? 'selected' : ''}>Image</option>
          <option value="video" ${item.type === 'video' ? 'selected' : ''}>Video</option>
        </select>
        <input type="text" class="media-url-input" data-idx="${index}" placeholder="URL or file" value="${item.url || ''}">
        <label class="btn-ghost btn-mini file-label" style="padding: 4px 8px !important; font-size: 9px !important;">
          <span>Browse</span>
          <input type="file" class="hidden media-file-input" data-idx="${index}" accept="${item.type === 'video' ? 'video/*' : 'image/*'}">
        </label>
        <button type="button" class="btn-remove-media" data-idx="${index}" title="Remove media">✕</button>
      `;

      row.querySelector('.media-type-select').addEventListener('change', (e) => {
        currentEditorMedia[index].type = e.target.value;
        renderEditorMediaList();
      });

      row.querySelector('.media-url-input').addEventListener('input', (e) => {
        currentEditorMedia[index].url = e.target.value.trim();
      });

      row.querySelector('.media-file-input').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
          currentEditorMedia[index].url = evt.target.result;
          renderEditorMediaList();
        };
        reader.readAsDataURL(file);
      });

      row.querySelector('.btn-remove-media').addEventListener('click', () => {
        currentEditorMedia.splice(index, 1);
        renderEditorMediaList();
      });

      listEl.appendChild(row);
    });
  }

  const btnAddMediaRow = document.getElementById('btn-add-media-row');
  if (btnAddMediaRow) {
    btnAddMediaRow.addEventListener('click', () => {
      currentEditorMedia.push({ type: 'image', url: '' });
      renderEditorMediaList();
    });
  }

  if (btnAddProjectModal) {
    btnAddProjectModal.addEventListener('click', () => {
      if (projectEditorForm) projectEditorForm.reset();
      const editId = document.getElementById('edit-proj-id');
      if (editId) editId.value = '';
      const edTitle = document.getElementById('editor-project-title');
      if (edTitle) edTitle.textContent = 'Add Project';
      if (imagePreviewBox) imagePreviewBox.classList.add('hidden');
      currentEditorMedia = [];
      renderEditorMediaList();
      if (adminProjectEditorModal) adminProjectEditorModal.classList.add('open');
    });
  }

  if (btnCloseProjectEditor && adminProjectEditorModal) {
    btnCloseProjectEditor.addEventListener('click', () => adminProjectEditorModal.classList.remove('open'));
  }
  if (btnCancelProjectEditor && adminProjectEditorModal) {
    btnCancelProjectEditor.addEventListener('click', () => adminProjectEditorModal.classList.remove('open'));
  }

  if (editProjFile) {
    editProjFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (editProjImageUrl) editProjImageUrl.value = event.target.result;
          if (editProjPreviewImg) editProjPreviewImg.src = event.target.result;
          if (imagePreviewBox) imagePreviewBox.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
      }
    });
  }

  window.editProject = function (id) {
    const p = projects.find(item => item.id === id);
    if (!p) return;

    document.getElementById('edit-proj-id').value = p.id;
    document.getElementById('editor-project-title').textContent = 'Edit: ' + p.title;
    document.getElementById('edit-proj-title').value = p.title;
    document.getElementById('edit-proj-category').value = p.category;
    document.getElementById('edit-proj-location').value = p.location;
    document.getElementById('edit-proj-area').value = p.area;
    document.getElementById('edit-proj-image-url').value = p.coverImage;
    document.getElementById('edit-proj-desc').value = p.desc;

    editProjPreviewImg.src = p.coverImage;
    imagePreviewBox.classList.remove('hidden');

    currentEditorMedia = Array.isArray(p.media) && p.media.length > 0
      ? JSON.parse(JSON.stringify(p.media))
      : [{ type: 'image', url: p.coverImage }];
    renderEditorMediaList();

    adminProjectEditorModal.classList.add('open');
  };

  window.deleteProject = function (id) {
    if (confirm('Delete project?')) {
      projects = projects.filter(p => p.id !== id);
      localStorage.setItem('pak_projects', JSON.stringify(projects));
      if (window.PAK_DB) {
        window.PAK_DB.deleteProject(id);
      }
      renderAdminProjects();
      renderProjects();
    }
  };

  window.saveProjectForm = function () {
    const id = document.getElementById('edit-proj-id').value;
    const title = document.getElementById('edit-proj-title').value;
    const category = document.getElementById('edit-proj-category').value;
    const location = document.getElementById('edit-proj-location').value;
    const area = document.getElementById('edit-proj-area').value;
    const coverImage = document.getElementById('edit-proj-image-url').value || 'assets/projects/dha_phase6_villa.jpg';
    const desc = document.getElementById('edit-proj-desc').value;

    const validMedia = currentEditorMedia.filter(m => m.url && m.url.trim().length > 0);
    if (validMedia.length === 0) {
      validMedia.push({ type: 'image', url: coverImage });
    }

    const projPayload = {
      id: id || ('proj-' + Date.now()),
      title,
      category,
      location,
      area,
      coverImage,
      desc,
      media: validMedia
    };

    if (id) {
      const p = projects.find(item => item.id === id);
      if (p) {
        Object.assign(p, projPayload);
      }
    } else {
      projects.unshift(projPayload);
    }

    localStorage.setItem('pak_projects', JSON.stringify(projects));
    if (window.PAK_DB) {
      window.PAK_DB.saveProject(projPayload);
    }
    renderAdminProjects();
    renderProjects();
    adminProjectEditorModal.classList.remove('open');
  };

  // Testimonials Admin
  function renderAdminTestimonials() {
    const tbody = document.getElementById('admin-testimonials-tbody');
    const countEl = document.getElementById('admin-testim-count');
    if (!tbody) return;

    tbody.innerHTML = '';
    countEl.textContent = testimonials.length;

    testimonials.forEach(t => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${t.name}</strong></td>
        <td>${t.location}</td>
        <td>${t.quote.substring(0, 40)}...</td>
        <td>
          <button class="btn-ghost btn-mini" onclick="window.deleteTestimonial('${t.id}')">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  const btnAddTestModal = document.getElementById('btn-add-testimonial-modal');
  if (btnAddTestModal) {
    btnAddTestModal.addEventListener('click', () => {
      const name = prompt('Client:');
      const location = prompt('Location:');
      const quote = prompt('Quote:');

      if (name && quote) {
        const newTestim = {
          id: 'test-' + Date.now(),
          name,
          location: location || 'Lahore',
          quote
        };
        testimonials.push(newTestim);
        localStorage.setItem('pak_testimonials', JSON.stringify(testimonials));
        if (window.PAK_DB) {
          window.PAK_DB.saveTestimonial(newTestim);
        }
        renderAdminTestimonials();
        renderTestimonials();
      }
    });
  }

  window.deleteTestimonial = function (id) {
    if (confirm('Delete testimonial?')) {
      testimonials = testimonials.filter(t => t.id !== id);
      localStorage.setItem('pak_testimonials', JSON.stringify(testimonials));
      if (window.PAK_DB) {
        window.PAK_DB.deleteTestimonial(id);
      }
      renderAdminTestimonials();
      renderTestimonials();
    }
  };

  // Leads Admin
  async function renderAdminLeads() {
    const tbody = document.getElementById('admin-leads-tbody');
    const countEl = document.getElementById('admin-leads-count');
    if (!tbody) return;

    if (window.PAK_DB) {
      try {
        const cloudLeads = await window.PAK_DB.fetchLeads();
        if (Array.isArray(cloudLeads)) {
          leads = cloudLeads;
        }
      } catch (e) {}
    }

    tbody.innerHTML = '';
    if (countEl) countEl.textContent = leads.length;

    leads.forEach(l => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><small>${l.timestamp}</small></td>
        <td><strong>${l.name}</strong></td>
        <td>${l.phone}</td>
        <td>${l.location}</td>
        <td><small>${l.notes || ''}</small></td>
      `;
      tbody.appendChild(tr);
    });
  }

  const btnClearLeads = document.getElementById('btn-clear-leads');
  if (btnClearLeads) {
    btnClearLeads.addEventListener('click', () => {
      if (confirm('Clear inquiries?')) {
        leads = [];
        localStorage.removeItem('pak_leads');
        if (window.PAK_DB) {
          window.PAK_DB.clearLeads();
        }
        renderAdminLeads();
      }
    });
  }

  // White-Label & Branding Admin
  function loadWhiteLabelForm() {
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val || '';
    };
    setVal('cfg-company-logo', config.logoUrl);
    setVal('cfg-company-name', config.companyName);
    setVal('cfg-company-tagline', config.tagline);
    setVal('cfg-company-phone', config.phone);
    setVal('cfg-company-whatsapp', config.whatsapp);
    setVal('cfg-company-address', config.address);
    setVal('cfg-notify-whatsapp', config.notifyWhatsapp || config.whatsapp);
    setVal('cfg-notify-email', config.notifyEmail || config.email);
    setVal('cfg-whatsapp-apikey', config.whatsappApiKey || '');
    setVal('cfg-notify-webhook', config.notifyWebhook || '');

    const logoPreviewBox = document.getElementById('cfg-logo-preview-box');
    const logoPreviewImg = document.getElementById('cfg-logo-preview-img');
    if (config.logoUrl && logoPreviewBox && logoPreviewImg) {
      logoPreviewImg.src = config.logoUrl;
      logoPreviewBox.classList.remove('hidden');
    } else if (logoPreviewBox) {
      logoPreviewBox.classList.add('hidden');
    }
  }

  const cfgLogoFile = document.getElementById('cfg-logo-file');
  const cfgLogoInput = document.getElementById('cfg-company-logo');
  const cfgLogoPreviewBox = document.getElementById('cfg-logo-preview-box');
  const cfgLogoPreviewImg = document.getElementById('cfg-logo-preview-img');

  if (cfgLogoFile && cfgLogoInput) {
    cfgLogoFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        cfgLogoInput.value = evt.target.result;
        if (cfgLogoPreviewImg && cfgLogoPreviewBox) {
          cfgLogoPreviewImg.src = evt.target.result;
          cfgLogoPreviewBox.classList.remove('hidden');
        }
      };
      reader.readAsDataURL(file);
    });

    cfgLogoInput.addEventListener('input', () => {
      if (cfgLogoInput.value.trim() && cfgLogoPreviewImg && cfgLogoPreviewBox) {
        cfgLogoPreviewImg.src = cfgLogoInput.value.trim();
        cfgLogoPreviewBox.classList.remove('hidden');
      } else if (cfgLogoPreviewBox) {
        cfgLogoPreviewBox.classList.add('hidden');
      }
    });
  }

  window.saveWhiteLabel = function () {
    const getVal = (id, fallback) => {
      const el = document.getElementById(id);
      return el ? el.value : fallback;
    };
    config.logoUrl = getVal('cfg-company-logo', config.logoUrl || '');
    config.companyName = getVal('cfg-company-name', config.companyName);
    config.tagline = getVal('cfg-company-tagline', config.tagline);
    config.phone = getVal('cfg-company-phone', config.phone);
    config.whatsapp = getVal('cfg-company-whatsapp', config.whatsapp);
    config.address = getVal('cfg-company-address', config.address);
    config.notifyWhatsapp = getVal('cfg-notify-whatsapp', config.notifyWhatsapp || config.whatsapp);
    config.notifyEmail = getVal('cfg-notify-email', config.notifyEmail || config.email);
    config.whatsappApiKey = getVal('cfg-whatsapp-apikey', config.whatsappApiKey || '');
    config.notifyWebhook = getVal('cfg-notify-webhook', config.notifyWebhook || '');

    localStorage.setItem('pak_config', JSON.stringify(config));
    if (window.PAK_DB) {
      window.PAK_DB.saveStudioConfig(config);
    }
    applyBranding();
    alert('Branding updated & saved to cloud.');
  };

  window.changeAdminPasscode = function () {
    const currEl = document.getElementById('cfg-curr-passcode');
    const newEl = document.getElementById('cfg-new-passcode');
    if (!currEl || !newEl) return;

    const currentEntered = currEl.value.trim();
    const newPasscode = newEl.value.trim();

    if (!currentEntered || !newPasscode) {
      alert('Please fill out both current and new passcodes.');
      return;
    }

    if (currentEntered !== config.passcode) {
      alert('Incorrect current passcode. Please enter the valid passcode to make changes.');
      currEl.value = '';
      currEl.focus();
      return;
    }

    if (newPasscode.length < 4) {
      alert('New passcode must be at least 4 characters long.');
      return;
    }

    config.passcode = newPasscode;
    localStorage.setItem('pak_config', JSON.stringify(config));
    if (window.PAK_DB) {
      window.PAK_DB.saveStudioConfig(config);
    }

    currEl.value = '';
    newEl.value = '';
    alert('Admin passcode successfully updated and synced to cloud!');
  };

  function applyBranding() {
    const navLogo = document.getElementById('nav-brand-logo');
    const navBrand = document.getElementById('nav-brand-name');
    if (config.logoUrl && config.logoUrl.trim()) {
      if (navLogo) {
        navLogo.src = config.logoUrl;
        navLogo.classList.remove('hidden');
      }
    } else {
      if (navLogo) navLogo.classList.add('hidden');
    }
    if (navBrand) navBrand.textContent = config.companyName;

    // Center Stage Hero Branding
    const heroCenterLogo = document.getElementById('hero-center-logo');
    const heroCenterTitle = document.getElementById('hero-center-title');
    const heroCenterSub = document.getElementById('hero-center-sub');

    if (heroCenterTitle) heroCenterTitle.textContent = config.companyName;
    if (heroCenterSub && config.tagline) {
      heroCenterSub.textContent = `ARCHITECTURE & BESPOKE INTERIOR ATELIER • ${config.tagline.toUpperCase()}`;
    }
    if (heroCenterLogo) {
      if (config.logoUrl && config.logoUrl.trim()) {
        heroCenterLogo.src = config.logoUrl;
        heroCenterLogo.classList.remove('hidden');
      } else {
        heroCenterLogo.classList.add('hidden');
      }
    }

    const aboutAddr = document.getElementById('about-studio-address');
    if (aboutAddr) aboutAddr.textContent = config.address;

    const aboutPhone = document.getElementById('about-studio-phone');
    if (aboutPhone) aboutPhone.textContent = config.phone;

    const contactPhone = document.getElementById('contact-phone-val');
    if (contactPhone) contactPhone.textContent = config.phone;

    const btnWa = document.getElementById('btn-whatsapp-large');
    if (btnWa) {
      const waLink = `https://wa.me/${config.whatsapp}?text=Hello%20${encodeURIComponent(config.companyName)},%20I%20would%20like%20to%20inquire%20about%20a%20private%20architectural%20commission.`;
      btnWa.href = waLink;
    }
  }

  // Cloud Config (Supabase)
  function loadCloudConfigForm() {
    if (!window.PAK_DB) return;
    const creds = window.PAK_DB.getCredentials();
    const urlInput = document.getElementById('cfg-supabase-url');
    const keyInput = document.getElementById('cfg-supabase-key');
    if (urlInput) urlInput.value = creds.url || '';
    if (keyInput) keyInput.value = creds.key || '';
  }

  window.saveCloudConfig = function () {
    const urlInput = document.getElementById('cfg-supabase-url');
    const keyInput = document.getElementById('cfg-supabase-key');
    const url = urlInput ? urlInput.value.trim() : '';
    const key = keyInput ? keyInput.value.trim() : '';

    if (!url || !key) {
      alert('Please provide both Supabase Project URL and Anon Key.');
      return;
    }
    if (window.PAK_DB) {
      window.PAK_DB.setCredentials(url, key);
      alert('Supabase credentials updated! Syncing data...');
      syncCloudData();
    }
  };

  const btnTestCloud = document.getElementById('btn-test-cloud');
  if (btnTestCloud) {
    btnTestCloud.addEventListener('click', async () => {
      btnTestCloud.textContent = 'Connecting...';
      try {
        if (window.PAK_DB) {
          const projs = await window.PAK_DB.fetchProjects();
          alert(`Connection Successful!\n\nConnected to Supabase PostgreSQL.\nFound ${projs.length} project(s) in the database.`);
        }
      } catch (err) {
        alert('Connection test failed: ' + err.message);
      } finally {
        btnTestCloud.textContent = 'Test Connection';
      }
    });
  }

  const btnResetCloud = document.getElementById('btn-reset-cloud');
  if (btnResetCloud) {
    btnResetCloud.addEventListener('click', () => {
      if (confirm('Reset to default connected project knywumwbvwawvykxregm?')) {
        if (window.PAK_DB) {
          window.PAK_DB.resetCredentials();
          loadCloudConfigForm();
          syncCloudData();
          alert('Reset to default connected Supabase project.');
        }
      }
    });
  }

  // Async Background Cloud Sync
  async function syncCloudData() {
    if (!window.PAK_DB) return;
    try {
      const [cloudCfg, cloudProjs, cloudTestim] = await Promise.allSettled([
        window.PAK_DB.fetchStudioConfig(),
        window.PAK_DB.fetchProjects(),
        window.PAK_DB.fetchTestimonials()
      ]);

      if (cloudCfg.status === 'fulfilled' && cloudCfg.value) {
        config = cloudCfg.value;
        applyBranding();
        loadWhiteLabelForm();
      }
      if (cloudProjs.status === 'fulfilled' && cloudProjs.value && cloudProjs.value.length > 0) {
        projects = cloudProjs.value;
        renderProjects();
        renderAdminProjects();
      }
      if (cloudTestim.status === 'fulfilled' && cloudTestim.value && cloudTestim.value.length > 0) {
        testimonials = cloudTestim.value;
        renderTestimonials();
        renderAdminTestimonials();
      }
    } catch (err) {
      console.warn('Cloud sync error, falling back to local storage:', err);
    }
  }

  // Export / Import
  const btnExport = document.getElementById('btn-export-config');
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      const pkg = { version: '1.0', config, projects, testimonials };
      const str = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(pkg, null, 2));
      const dl = document.createElement('a');
      dl.setAttribute('href', str);
      dl.setAttribute('download', `${config.companyName.toLowerCase().replace(/\s+/g, '_')}_config.json`);
      document.body.appendChild(dl);
      dl.click();
      dl.remove();
    });
  }

  const fileImport = document.getElementById('file-import-config');
  const btnImport = document.getElementById('btn-import-config');
  if (btnImport && fileImport) {
    btnImport.addEventListener('click', () => fileImport.click());
  }

  if (fileImport) {
    fileImport.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          if (imported.config && imported.projects) {
            config = imported.config;
            projects = imported.projects;
            if (imported.testimonials) testimonials = imported.testimonials;

            localStorage.setItem('pak_config', JSON.stringify(config));
            localStorage.setItem('pak_projects', JSON.stringify(projects));
            localStorage.setItem('pak_testimonials', JSON.stringify(testimonials));

            applyBranding();
            renderProjects();
            renderTestimonials();
            renderAdminProjects();
            renderAdminTestimonials();
            loadWhiteLabelForm();

            alert('Configuration imported.');
          }
        } catch (err) {
          alert('Invalid JSON file.');
        }
      };
      reader.readAsText(file);
    });
  }

  // Escape to close
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (modalProject) modalProject.classList.remove('open');
      if (adminProjectEditorModal) adminProjectEditorModal.classList.remove('open');
      if (adminModal) adminModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // Init
  applyBranding();
  renderProjects();
  renderTestimonials();
  startPreloading();
  syncCloudData();

})();
