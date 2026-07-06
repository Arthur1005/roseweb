// Hamburger menu — handler set up below after contact panel is initialized
const hamburger = document.getElementById('hamburger');
const pageNav = document.querySelector('.pageNav');


const contactOpen = document.getElementById('contactOpen');
const contactClose = document.getElementById('contactClose');
const contacts = document.getElementById('contacts');

if (contactOpen) {
  contactOpen.addEventListener('click', () => {
    contacts.classList.add('active');
  });
}

if (contactClose) {
  contactClose.addEventListener('click', () => {
    contacts.classList.remove('active');
  });
}




const form = document.getElementById("myForm");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // remove this if you want actual form submission

    const fields = form.querySelectorAll("input[required], textarea[required]");

    fields.forEach(field => {
      if (!field.value.trim()) {
        // add shake + red placeholder
        field.classList.add("error", "shake");

        // restart shake animation if needed
        field.style.animation = "none";
        field.offsetHeight; // trigger reflow
        field.style.animation = null;

        // after 1s, fade back to normal placeholder
        setTimeout(() => {
          field.classList.remove("error");
        }, 600);

        // remove shake class after animation ends
        field.addEventListener("animationend", () => {
          field.classList.remove("shake");
        }, { once: true });
      }
    });
  });
}







const video = document.getElementById('myVideo');

if (video) {
  const playPauseBtn = document.getElementById('playPause');
  const progressContainer = document.getElementById('progressContainer');
  const progress = document.getElementById('progress');
  const volume = document.getElementById('volume');

  const playIcon = "/assets/icon/play.svg";
  const pauseIcon = "/assets/icon/pause.svg";

  playPauseBtn.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      playPauseBtn.src = pauseIcon;
      playPauseBtn.alt = "Pause button";
    } else {
      video.pause();
      playPauseBtn.src = playIcon;
      playPauseBtn.alt = "Play button";
    }
  });

  const soundsOn = "/assets/icon/soundsOn.svg";
  const soundsOff = "/assets/icon/soundsOff.svg";

  volume.addEventListener('click', () => {
      video.muted = !video.muted;
    if (video.muted) {
      volume.src = soundsOn;
      volume.alt = "Sounds On";
    } else {
      volume.src = soundsOff;
      volume.alt = "Sounds Off";
    }
  });

  video.addEventListener('timeupdate', () => {
    const percent = (video.currentTime / video.duration) * 100;
    progress.style.width = percent + '%';
  });

  const timeDisplay = document.getElementById('timeDisplay');

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' + secs : secs}`;
  }

  video.addEventListener('timeupdate', () => {
    const percent = (video.currentTime / video.duration) * 100;
    progress.style.width = percent + '%';
    if (!isNaN(video.duration)) {
      timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
    }
  });

  progressContainer.addEventListener('click', (e) => {
    const rect = progressContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    video.currentTime = (clickX / rect.width) * video.duration;
  });

  const videoContainer = document.querySelector('.video-container');
  const fullscreenBtn = document.getElementById('fullscreen');
  const exitFullscreenicon = "/assets/icon/Exit_Fullscreen.svg";
  const enterFullscreenicon = "/assets/icon/Enter_Fullscreen.svg";

  fullscreenBtn.addEventListener('click', () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      fullscreenBtn.src = enterFullscreenicon;
    } else {
      videoContainer.requestFullscreen();
      fullscreenBtn.src = exitFullscreenicon;
    }
  });

  const controls = document.querySelector('.controls');
  let hideControlsTimeout;

  videoContainer.addEventListener('mouseenter', () => {
    if (!document.fullscreenElement) {
      controls.style.opacity = '1';
      controls.style.transition = 'opacity 0.3s ease';
      controls.style.pointerEvents = 'auto';
    }
  });

  videoContainer.addEventListener('mouseleave', () => {
    if (!document.fullscreenElement) {
      controls.style.opacity = '0';
      controls.style.pointerEvents = 'none';
    }
  });

  document.addEventListener('mousemove', () => {
    if (document.fullscreenElement) {
      controls.style.opacity = '1';
      controls.style.transition = 'opacity 0.3s ease';
      controls.style.pointerEvents = 'auto';
      clearTimeout(hideControlsTimeout);
      hideControlsTimeout = setTimeout(() => {
        controls.style.opacity = '0';
        controls.style.pointerEvents = 'none';
      }, 2500);
    }
  });

  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
      fullscreenBtn.src = enterFullscreenicon;
      clearTimeout(hideControlsTimeout);
      controls.style.opacity = '1';
      controls.style.pointerEvents = 'auto';
    }
  });

  document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
      video.style.width = "100%";
      video.style.height = "100%";
      video.style.objectFit = "contain";
      video.style.display = "block";
      video.style.margin = "0 auto";
    } else {
      video.style.width = "100%";
      video.style.height = "auto";
      video.style.objectFit = "";
      video.style.margin = "";
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      if (video.paused) {
        video.play();
        playPauseBtn.src = pauseIcon;
        playPauseBtn.alt = "Pause button";
      } else {
        video.pause();
        playPauseBtn.src = playIcon;
        playPauseBtn.alt = "Play button";
      }
    }
  });

  video.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      playPauseBtn.src = pauseIcon;
      playPauseBtn.alt = "Pause button";
    } else {
      video.pause();
      playPauseBtn.src = playIcon;
      playPauseBtn.alt = "Play button";
    }
  });
} // end video






// --- PDF --- //
const canvasCurrent = document.getElementById("pdf-canvas-current");

if (canvasCurrent) {
const url = "/assets/files/test.pdf";
let pdfDoc = null;
let currentPage = 1;
let isTransitioning = false;

const canvasNext = document.getElementById("pdf-canvas-next");
const ctxCurrent = canvasCurrent.getContext("2d");
const ctxNext = canvasNext.getContext("2d");

const prevPageBtn = document.getElementById("prev-page");
const nextPageBtn = document.getElementById("next-page");
const fullscreenBtnpdf = document.getElementById("fullscreen-pdf");
const downloadBtn = document.getElementById("download-pdf");

// ✅ Load PDF
pdfjsLib.getDocument(url).promise.then(pdf => {
  pdfDoc = pdf;
  renderPage(currentPage, ctxCurrent, canvasCurrent);
  updatePageButtons(); // ✅ add here

  if (!thumbsInitialized) initThumbnails();
  updateThumbnails(currentPage);
});

// ✅ Render page (stable + centered)
function renderPage(num, ctx, canvas) {
  pdfDoc.getPage(num).then(page => {
    const pdfContainer = document.querySelector(".pdfviewer");
    // ✅ Use dynamic sizing
    const displayWidth = pdfContainer.clientWidth;

    const displayHeight = displayWidth * 9 / 16;

    const unscaledViewport = page.getViewport({ scale: 1 });
    const scale = Math.min(
      displayWidth / unscaledViewport.width,
      displayHeight / unscaledViewport.height
    );

    const deviceScale = scale * (window.devicePixelRatio || 1);
    const viewport = page.getViewport({ scale: deviceScale });


    
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    const renderCtx = {
      canvasContext: ctx,
      viewport: viewport,
      background: "#000"
    };

    canvas.style.opacity = 0;
    canvas.style.transition = "opacity 0.4s ease";

    const renderTask = page.render(renderCtx);
    renderTask.promise.then(() => {
      canvas.style.opacity = 1;
    }).catch(err => console.error("Render error:", err));
  }).catch(err => console.error("Page render failed:", err));
}


function updatePageButtons() {
    if (currentPage === 1) {
    prevPageBtn.classList.add("disabled");
  } else {
    prevPageBtn.classList.remove("disabled");
    prevPageBtn.style.transition = "none"; // instantly reset
    void prevPageBtn.offsetWidth; // 🔄 force reflow to apply instantly
    prevPageBtn.style.transition = ""; // restore transition after
  }

  // Next button
  if (currentPage === pdfDoc.numPages) {
    nextPageBtn.classList.add("disabled");
  } else {
    nextPageBtn.classList.remove("disabled");
    nextPageBtn.style.transition = "none";
    void nextPageBtn.offsetWidth;
    nextPageBtn.style.transition = "";
  }
}


// ✅ Page transitions
function transitionToPage(nextPage) {
  if (isTransitioning || nextPage < 1 || nextPage > pdfDoc.numPages) return;
  isTransitioning = true;

  renderPage(nextPage, ctxNext, canvasNext);

  setTimeout(() => {
    ctxCurrent.drawImage(canvasNext, 0, 0);
    canvasNext.style.opacity = 0;
      currentPage = nextPage;
      updatePageButtons();
      updateThumbnails(currentPage);
    updateActiveThumb(currentPage);
    updatePageButtons();
  
  isTransitioning = false;
}, 500);
}

// ✅ Buttons
nextPageBtn.addEventListener("click", () => transitionToPage(currentPage + 1));
prevPageBtn.addEventListener("click", () => transitionToPage(currentPage - 1));

// ✅ Keyboard (only in fullscreen)
document.addEventListener("keydown", e => {
  if (!document.fullscreenElement) return;
  if (e.key === "ArrowRight") transitionToPage(currentPage + 1);
  if (e.key === "ArrowLeft") transitionToPage(currentPage - 1);
});


// ✅ Re-render the current page when entering or exiting fullscreen
document.addEventListener("fullscreenchange", () => {
  if (pdfDoc) {
    renderPage(currentPage, ctxCurrent, canvasCurrent);
  }
});


// ✅ Download button
downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.href = url;
  link.download = "document.pdf";
  link.click();
});

// ✅ PDF Fullscreen toggle button
fullscreenBtnpdf.addEventListener("click", () => {
  const viewer = document.querySelector(".pdfviewer");

  if (!document.fullscreenElement) {
    viewer.requestFullscreen(); // enter fullscreen on the PDF viewer
  } else {
    document.exitFullscreen(); // exit fullscreen
  }
});




// ---------- Thumbnails (fixed 7 slots, instant highlight, center clicked) ----------

const MAX_THUMBS = 7;
let thumbsContainer = document.getElementById("pdf-thumbnails");
let thumbsInitialized = false;
let thumbSlots = []; // array of <img> elements used as fixed slots

function initThumbnails() {
  if (!thumbsContainer) return;
  thumbsContainer.innerHTML = "";
  thumbSlots = [];
  for (let i = 0; i < MAX_THUMBS; i++) {
    const img = document.createElement("img");
    img.className = "pdf-thumb";
    img.dataset.slotIndex = i; // helpful for debugging
    img.style.visibility = "hidden"; // initially hidden until filled
    thumbsContainer.appendChild(img);
    thumbSlots.push(img);
  }
  thumbsInitialized = true;
}

// compute a 7-page window centered (when possible) on centerPage
function getVisiblePages(centerPage) {
  const half = Math.floor(MAX_THUMBS / 2);
  let startPage = centerPage - half;
  let endPage = centerPage + half;

  if (startPage < 1) {
    endPage += 1 - startPage;
    startPage = 1;
  }
  if (endPage > pdfDoc.numPages) {
    startPage -= (endPage - pdfDoc.numPages);
    endPage = pdfDoc.numPages;
  }
  if (startPage < 1) startPage = 1;

  const pages = [];
  for (let p = startPage; p <= endPage; p++) pages.push(p);
  return pages;
}

// update the visible images in the fixed slots (no slot DOM additions/removals)
function updateThumbnails(centerPage = currentPage) {
  if (!pdfDoc || !thumbsInitialized) return;
  const pages = getVisiblePages(centerPage);

  // fill slots with pages (or hide if no page for that slot)
  for (let slot = 0; slot < MAX_THUMBS; slot++) {
    const img = thumbSlots[slot];
    const pageNum = pages[slot];

    if (!pageNum) {
      img.style.visibility = "hidden";
      img.removeAttribute("data-page-number");
      img.onclick = null;
      img.classList.remove("active");
      continue;
    }

    img.style.visibility = "visible";
    img.dataset.pageNumber = pageNum;

    // immediate visual highlight if this is the current page
    img.classList.toggle("active", pageNum === currentPage);

    // click handler: set currentPage immediately, update highlight, center window, and navigate
    img.onclick = (() => {
      const pn = pageNum;
      return () => {
        if (pn === currentPage) return;
        // 1) Immediately update currentPage & UI so the clicked thumb is highlighted at once
        currentPage = pn;
        updateActiveThumb(currentPage);

        // 2) Rebuild thumbnails centered on the clicked page (so clicked thumb moves to center slot if possible)
        updateThumbnails(currentPage);

        // 3) Trigger page transition (render & crossfade)
        transitionToPage(pn);
      };
    })();

    // render preview image for this page into the slot (async)
    // we render small thumbnails — this overwrites src when done (no layout changes)
    pdfDoc.getPage(pageNum).then(page => {
      const viewport = page.getViewport({ scale: 0.18 });
      const c = document.createElement("canvas");
      const ctx = c.getContext("2d");
      c.width = viewport.width;
      c.height = viewport.height;

      page.render({ canvasContext: ctx, viewport }).promise.then(() => {
        // set src only when ready (prevents flashing)
        // preserve selection class immediately, then set img
        img.src = c.toDataURL();
        img.classList.toggle("active", pageNum === currentPage);
      });
    }).catch(err => {
      // if page render failed, hide slot gracefully
      img.style.visibility = "hidden";
      img.removeAttribute("data-page-number");
      img.onclick = null;
      img.classList.remove("active");
      console.error("Thumbnail render failed for page", pageNum, err);
    });
  }
}

// quick helper to mark the active thumbnail (visual highlight only)
function updateActiveThumb(pageNum) {
  thumbSlots.forEach(img => {
    const p = Number(img.dataset.pageNumber);
    img.classList.toggle("active", p === pageNum);
  });
}


/* === PDF thumbnail hover + fullscreen behavior (clean, working version) === */
/* === PDF thumbnail hover + fullscreen behavior (final verified version) === */
(function () {
 // === Thumbnail visibility control (fullscreen-only) ===
const pdfThumbnails = document.getElementById("pdf-thumbnails");
const hoverZone = document.getElementById("thumb-hover-zone");
let hideTimeout;

// Only show temporarily when entering fullscreen
document.addEventListener("fullscreenchange", () => {
  if (document.fullscreenElement) {
    showThumbnailsTemp();
  } else {
    pdfThumbnails.classList.remove("show");
    // ensure both thumbnails and hover zone ignore pointer events outside fullscreen
    pdfThumbnails.style.pointerEvents = "none";
    hoverZone.style.pointerEvents = "none";
  }
});

function showThumbnailsTemp() {
  clearTimeout(hideTimeout);
  pdfThumbnails.classList.add("show");
  pdfThumbnails.style.pointerEvents = "auto";
  hoverZone.style.pointerEvents = "auto";

  hideTimeout = setTimeout(() => {
    if (!pdfThumbnails.matches(":hover")) {
      pdfThumbnails.classList.remove("show");
    }
  }, 2000);
}

// ✅ Hover zone triggers show (only works in fullscreen)
hoverZone.addEventListener("mouseenter", () => {
  if (!document.fullscreenElement) return;
  clearTimeout(hideTimeout);
  pdfThumbnails.classList.add("show");
});

hoverZone.addEventListener("mouseleave", () => {
  if (!document.fullscreenElement) return;
  clearTimeout(hideTimeout);
  hideTimeout = setTimeout(() => {
    if (!pdfThumbnails.matches(":hover")) {
      pdfThumbnails.classList.remove("show");
    }
  }, 1000);
});

// ✅ Thumbnails stay visible while hovered (only fullscreen)
pdfThumbnails.addEventListener("mouseenter", () => {
  if (!document.fullscreenElement) return;
  clearTimeout(hideTimeout);
  pdfThumbnails.classList.add("show");
});

pdfThumbnails.addEventListener("mouseleave", () => {
  if (!document.fullscreenElement) return;
  clearTimeout(hideTimeout);
  hideTimeout = setTimeout(() => {
    pdfThumbnails.classList.remove("show");
  }, 1000);
});


})();

} // end PDF





const overlay = document.getElementById('overlay');

if (overlay) {
  const closeBtn = document.getElementById('contactClose');
  const openBtn = document.getElementById('contactOpen');

  function setNavTitle(text) {
    let navTitle = document.querySelector('.nav-page-title');
    if (!navTitle && text) {
      navTitle = document.createElement('span');
      navTitle.className = 'nav-page-title';
      const hamburgerBtn = document.getElementById('hamburger');
      if (hamburgerBtn) hamburgerBtn.parentNode.insertBefore(navTitle, hamburgerBtn);
    }
    if (navTitle) navTitle.textContent = text;
  }

  const nav = document.querySelector('nav');

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      contacts.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';

      if (window.matchMedia('(max-width: 860px)').matches) {
        const navTitle = document.querySelector('.nav-page-title');
        if (navTitle) navTitle._origText = navTitle.textContent;
        setNavTitle('Contact');
        if (nav) nav.classList.add('contact-open');
        if (hamburger) hamburger.classList.add('open'); // animate to ×
      }

      // Let contact slide in, then quietly close the pageNav overlay behind it
      if (pageNav) {
        setTimeout(() => {
          pageNav.classList.remove('open');
        }, 400);
      }
    });
  }

  function closeContacts() {
    contacts.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.6, 1), visibility 0s 0.8s';
    contacts.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';

    if (window.matchMedia('(max-width: 860px)').matches) {
      const navTitle = document.querySelector('.nav-page-title');
      if (navTitle) setNavTitle(navTitle._origText || '');

      // Snap nav bg dark immediately — page content is already dark behind the sliding panel
      if (nav) {
        nav.style.transition = 'none';
        nav.classList.remove('contact-open');
        void nav.offsetHeight;
      }

      // Snap span colour transitions so they don't go through a mid-tone
      if (hamburger) {
        hamburger.querySelectorAll('span').forEach(s => {
          s.style.transition = 'transform 0.25s ease, opacity 0.25s ease';
        });
        setTimeout(() => { hamburger.classList.remove('open'); }, 560);
      }
    }

    setTimeout(() => {
      contacts.style.transition = '';
      if (nav) nav.style.transition = '';
      if (hamburger) {
        hamburger.querySelectorAll('span').forEach(s => { s.style.transition = ''; });
      }
    }, 880);
  }

  if (closeBtn) closeBtn.addEventListener('click', closeContacts);
  overlay.addEventListener('click', closeContacts);

  // Hamburger: closes contact panel if open, otherwise toggles nav overlay
  if (hamburger && pageNav) {
    hamburger.addEventListener('click', () => {
      if (contacts.classList.contains('active')) {
        closeContacts();
        return;
      }
      hamburger.classList.toggle('open');
      pageNav.classList.toggle('open');
    });
  }

  // Animate pageNav closed before navigating (mobile only)
  if (pageNav) {
    pageNav.querySelectorAll('button[onclick]').forEach(btn => {
      const match = btn.getAttribute('onclick').match(/location\.href=['"](.+)['"]/);
      if (!match) return;
      const href = match[1];
      btn.removeAttribute('onclick');
      btn.addEventListener('click', () => {
        if (!window.matchMedia('(max-width: 860px)').matches) {
          location.href = href;
          return;
        }
        // Navigate immediately — nav stays open as a curtain via sessionStorage
        sessionStorage.setItem('nav-curtain', '1');
        location.href = href;
      });
    });
  }
}


// Page transition: nav was held open as curtain, now slide it away
if (document.documentElement.classList.contains('nav-curtain')) {
  if (pageNav && hamburger) {
    // Sync JS state with the already-open CSS state
    pageNav.classList.add('open');
    hamburger.classList.add('open');
    // Re-enable transition, then slide closed
    setTimeout(() => {
      document.documentElement.classList.remove('nav-curtain');
      hamburger.classList.remove('open');
      pageNav.classList.remove('open');
    }, 150);
  }
}

// Category reordering — selected category items move to front
const categoriesBar = document.querySelector('.categories');
const gallery = document.querySelector('.gallery');

// Fix categories position on desktop — wait for fonts/images to load for accurate coords
if (categoriesBar && gallery && !window.matchMedia('(max-width: 860px)').matches) {
  window.addEventListener('load', () => {
    const rect = categoriesBar.getBoundingClientRect();
    const width = categoriesBar.offsetWidth;
    categoriesBar.style.position = 'fixed';
    categoriesBar.style.top = rect.top + 'px';
    categoriesBar.style.left = rect.left + 'px';
    categoriesBar.style.width = width + 'px';
    gallery.style.marginLeft = (width + 24) + 'px';
  });
}

if (categoriesBar && gallery) {
  const catButtons = categoriesBar.querySelectorAll('button');
  const CATS = ['illustration', 'animation', 'design'];

  const navTitle = document.querySelector('.nav-page-title');
  let hasScrolled = false;

  function updateActiveCat() {
    const viewportCenter = window.innerHeight / 2;
    let closestItem = null;
    let minDist = Infinity;

    Array.from(gallery.children).forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.bottom <= 0 || r.top >= window.innerHeight) return;
      const dist = Math.abs((r.top + r.bottom) / 2 - viewportCenter);
      if (dist < minDist) { minDist = dist; closestItem = el; }
    });

    const cat = closestItem ? CATS.find(c => closestItem.classList.contains(c)) : null;

    catButtons.forEach(btn => {
      btn.classList.toggle('active', !!cat && btn.textContent.trim().toLowerCase() === cat);
    });

    // Only update nav title after user has started scrolling
    if (hasScrolled && navTitle) {
      navTitle.textContent = cat
        ? 'Project – ' + cat.charAt(0).toUpperCase() + cat.slice(1)
        : 'Project';
    }
  }

  // Scroll drives bold and title
  window.addEventListener('scroll', () => {
    hasScrolled = true;
    updateActiveCat();
  }, { passive: true });
  updateActiveCat(); // set correct bold state on page load (title stays "Project")

  catButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.textContent.trim().toLowerCase();
      const first = gallery.querySelector('.' + category);
      if (first) {
        const top = first.getBoundingClientRect().top + window.scrollY;
        const navH = window.matchMedia('(max-width: 860px)').matches
          ? (document.querySelector('nav')?.offsetHeight || 56) : 0;
        window.scrollTo({ top: top - navH, behavior: 'smooth' });
      }

      // Update title immediately on click
      hasScrolled = true;
      if (navTitle) navTitle.textContent = 'Project – ' + btn.textContent.trim();
    });
  });
}

// Mobile category: show on scroll up / at top, hide on scroll down
const categoriesSidebar = document.querySelector('.categories');
const projectsSection = document.querySelector('.projects');

if (categoriesSidebar && window.matchMedia('(max-width: 860px)').matches) {
  // Lock sticky top to the categories' initial position on screen
  const initialTop = categoriesSidebar.getBoundingClientRect().top;
  categoriesSidebar.style.top = initialTop + 'px';

  let lastY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentY = window.scrollY;

    if (currentY <= 10 || currentY < lastY) {
      categoriesSidebar.classList.remove('cats-hidden');
      if (projectsSection) projectsSection.classList.add('sidebar-on');
    } else {
      categoriesSidebar.classList.add('cats-hidden');
      if (projectsSection) projectsSection.classList.remove('sidebar-on');
    }

    lastY = currentY;
  }, { passive: true });
}


// Gallery scroll-enlarge on mobile
const galleryItems = document.querySelectorAll('.gallery > div');
if (galleryItems.length && window.matchMedia('(max-width: 860px)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      entry.target.classList.toggle('in-view', entry.isIntersecting);
    });
  }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });

  galleryItems.forEach(item => observer.observe(item));
}













