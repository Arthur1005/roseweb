import { db, auth } from './src/firebase.js';
import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { collection, getDocs, addDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
const pdfViewer = document.querySelector(".pdfviewer");

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
    const inFullscreen = !!document.fullscreenElement;

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
const CENTER_INDEX = Math.floor(MAX_THUMBS / 2); // 3 => slot index 3 (4th slot)
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

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      contacts.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  function closeContacts() {
    contacts.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeContacts);
  overlay.addEventListener('click', closeContacts);
}













// 1. ALL imports at the top (Only once!)

// 2. Select your HTML elements
const addBtn = document.getElementById('add-project-btn');
const modal = document.getElementById('project-modal');
const saveBtn = document.getElementById('save-project');
const loginBtn = document.getElementById('auth-btn');

// 3. UI Logic: Show/Hide Add Project Form
if (addBtn) {
    addBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });
}

// 4. Action: Save New Project to Database
if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
        const title = document.getElementById('proj-title').value;
        const desc = document.getElementById('proj-desc').value;


        try {
            await addDoc(collection(db, "projects"), {
                title: title,
                description: desc,
                createdAt: new Date()
            });
            alert("Project Added!");
            modal.style.display = 'none';
        } catch (error) {
            console.error("Error saving project: ", error);
        }
        // Inside your saveBtn.addEventListener...
    alert("Project Added!");
    modal.style.display = 'none';
    displayProjects(); // <--- Add this line here!
    });
}

// 5. Action: Handle Login
if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
        const email = document.getElementById('login-email').value;
        const pass = document.getElementById('login-pass').value;

        try {
            await signInWithEmailAndPassword(auth, email, pass);
            document.getElementById('login-modal').style.display = 'none';
            alert("Welcome back, Owner.");
        } catch (error) {
            alert("Access Denied: " + error.message);
        }
    });
}

// 6. Security Guard: Toggle interface based on login status
onAuthStateChanged(auth, (user) => {
    const adminElements = document.querySelectorAll('.owner-only');
    const loginStatus = document.getElementById('login-status');

    if (user) {
        adminElements.forEach(el => el.style.display = 'block');
        console.log("Logged in as:", user.email);
        if (loginStatus) {
            loginStatus.textContent = `Logged in as ${user.email} · Click to logout`;
            loginStatus.onclick = () => {
                auth.signOut();
            };
        }
    } else {
        adminElements.forEach(el => el.style.display = 'none');
        console.log("Not logged in");
        if (loginStatus) {
            loginStatus.textContent = '© 2026 Your Portfolio · Click to login';
            loginStatus.onclick = () => {
                document.getElementById('login-modal').style.display = 'flex';
            };
        }
    }
});







// Function to fetch and display projects
async function displayProjects() {
    const projectGrid = document.getElementById('projects-grid');
    
    // 1. Clear the grid (in case there's old data)
    projectGrid.innerHTML = "Loading projects...";

    try {
        // 2. Get the collection, ordered by the newest first
        const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        projectGrid.innerHTML = ""; // Clear the loading text

        // 3. Loop through each project in Firebase
        querySnapshot.forEach((doc) => {
            const project = doc.data();
            
            // 4. Create the HTML for each project card
            const projectHTML = `
                <div class="project-card" id="${doc.id}">
                    <div class="project-info">
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                    </div>
                    <button class="owner-only delete-btn" style="display:none;" onclick="deleteProject('${doc.id}')">Delete</button>
                </div>
            `;
            
            projectGrid.innerHTML += projectHTML;
        });
    } catch (error) {
        console.error("Error loading projects: ", error);
        projectGrid.innerHTML = "Failed to load projects.";
    }
}

// Run this function immediately when the page loads
displayProjects();