// ==========================================
// STATE MACHINE & VARIABLES
// ==========================================
let workshopState = 'WAITING';
let currentGlobalStep = 1;
let isTransitioning = false;
let globalMuted = false;
let hudData = { depth: 0, temp: 24.0, press: 1.0 };
let typewriterStep = 0;
let hullStep = 0;
let materialStep = 0;
let buoyancyStep = 0;
let ballastStep = 0;
let stabilityStep = 0;
let movementStep = 0;
let supportingStep = 0;

const videoBg = document.getElementById('bg-video');
const faderBlack = document.getElementById('fade-to-black');
const hud = document.getElementById('sub-hud');
const hudD = document.getElementById('hud-depth');
const hudT = document.getElementById('hud-temp');
const hudP = document.getElementById('hud-press');
const scanner = document.getElementById('ai-scanner');

const thematicIcons = {
    pressure: `<svg class="reveal-icon challenge-icon" viewBox="0 0 24 24"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v6l4 2"/></svg>`,
    structure: `<svg class="reveal-icon requirement-icon" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18 M15 3v18 M3 9h18 M3 15h18"/></svg>`,
    movement: `<svg class="reveal-icon challenge-icon" viewBox="0 0 24 24"><path d="M13 5l7 7-7 7 M4 12h15"/></svg>`,
    propulsion: `<svg class="reveal-icon requirement-icon" viewBox="0 0 24 24"><path d="M12 2v20 M17 5H7 M19 12H5 M17 19H7"/></svg>`,
    gps: `<svg class="reveal-icon challenge-icon" viewBox="0 0 24 24"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg>`,
    navigation: `<svg class="reveal-icon requirement-icon" viewBox="0 0 24 24"><polygon points="12 2 22 22 12 17 2 22 12 2"/></svg>`,
    darkness: `<svg class="reveal-icon challenge-icon" viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707"/></svg>`,
    sensor: `<svg class="reveal-icon requirement-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
    signal: `<svg class="reveal-icon challenge-icon" viewBox="0 0 24 24"><path d="M1 1l22 22 M16.72 11.06A10.94 10.94 0 0 1 19 12.5 M5 12.5a10.94 10.94 0 0 1 5.83-2.84 M8.5 16a4.5 4.5 0 0 1 7 0 M12 20h.01"/></svg>`,
    communication: `<svg class="reveal-icon requirement-icon" viewBox="0 0 24 24"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M8 12h8 M12 8v8"/></svg>`,
    energy: `<svg class="reveal-icon challenge-icon" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    power: `<svg class="reveal-icon requirement-icon" viewBox="0 0 24 24"><rect x="2" y="7" width="16" height="10" rx="2" ry="2"/><line x1="22" y1="11" x2="22" y2="13"/><line x1="6" y1="11" x2="12" y2="11"/><line x1="9" y1="8" x2="9" y2="14"/></svg>`,
    decision: `<svg class="reveal-icon challenge-icon" viewBox="0 0 24 24"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44L5.18 13H2v-2h3.18l1.86-6.06A2.5 2.5 0 0 1 9.5 2z M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44L18.82 13H22v-2h-3.18l-1.86-6.06A2.5 2.5 0 0 0 14.5 2z"/></svg>`,
    control: `<svg class="reveal-icon requirement-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 2v20 M2 12h20 M12 12m-4 0a4 4 0 1 0 8 0 4 4 0 1 0-8 0"/></svg>`
};

const cinematicFlow = [
    { type: 'CHALLENGE', text: 'Pressure', icon: 'pressure', containerId: 'row-1' },
    { type: 'SOLUTION', text: 'Structure System', icon: 'structure', containerId: 'row-1' },
    { type: 'CHALLENGE', text: 'Movement', icon: 'movement', containerId: 'row-2' },
    { type: 'SOLUTION', text: 'Propulsion System', icon: 'propulsion', containerId: 'row-2' },
    { type: 'CHALLENGE', text: 'No GPS', icon: 'gps', containerId: 'row-3' },
    { type: 'SOLUTION', text: 'Navigation System', icon: 'navigation', containerId: 'row-3' },
    { type: 'CHALLENGE', text: 'Darkness', icon: 'darkness', containerId: 'row-4' },
    { type: 'SOLUTION', text: 'Sensor System', icon: 'sensor', containerId: 'row-4' },
    { type: 'CHALLENGE', text: 'No Signal', icon: 'signal', containerId: 'row-5' },
    { type: 'SOLUTION', text: 'Communication System', icon: 'communication', containerId: 'row-5' },
    { type: 'CHALLENGE', text: 'Need Energy', icon: 'energy', containerId: 'row-6' },
    { type: 'SOLUTION', text: 'Power System', icon: 'power', containerId: 'row-6' },
    { type: 'CHALLENGE', text: 'Need Decision Making', icon: 'decision', containerId: 'row-7' },
    { type: 'SOLUTION', text: 'Control System', icon: 'control', containerId: 'row-7' }
];

// ==========================================
// CORE HUD ANIMATION ENGINES
// ==========================================
function updateHUD(tDepth, tTemp, tPress, durationSec) {
    gsap.to(hudData, {
        depth: tDepth, temp: tTemp, press: tPress, duration: durationSec, ease: "none",
        onUpdate: () => {
            if(hudD) hudD.innerText = Math.round(hudData.depth);
            if(hudT) hudT.innerText = hudData.temp.toFixed(1);
            if(hudP) hudP.innerText = hudData.press.toFixed(1);
        }
    });
}

function flashCenterText(selector, textArray) {
    let tl = gsap.timeline();
    let el = document.querySelector(selector);
    if (!el) return;
   
    textArray.forEach((txt) => {
        tl.call(() => { el.innerText = txt; })
          .to(el, { opacity: 1, duration: 1 })
          .to(el, { opacity: 0, duration: 1 }, "+=0.5");
    });
}

// ==========================================
// TIMELINE HUD MENU & REWIND LOGIC
// ==========================================
const menuToggleBtn = document.getElementById('menu-toggle');
if (menuToggleBtn) {
    menuToggleBtn.addEventListener('click', (e) => {
        const nav = document.getElementById('timeline-nav');
        if(nav) nav.classList.toggle('open');
        e.currentTarget.blur();
    });
}

function updateTimelineNav(stepNum) {
    currentGlobalStep = stepNum;
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    let activeItem = document.querySelector(`.nav-item[data-step="${stepNum}"]`);
    if(activeItem) {
        activeItem.classList.add('active');
        activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    const audioBtn = document.getElementById('audio-toggle');
    const backBtn = document.getElementById('back-toggle');
    const menuBtn = document.getElementById('menu-toggle');

    if (stepNum < 6) {
        if(audioBtn) audioBtn.style.display = 'flex';
        if(backBtn) backBtn.style.display = 'none';
        if(menuBtn) menuBtn.style.display = 'flex';
    } else if (stepNum === 6) {
        if(audioBtn) audioBtn.style.display = 'none';
        if(backBtn) backBtn.style.display = 'none';
        if(menuBtn) menuBtn.style.display = 'flex';
    } else {
        if(audioBtn) audioBtn.style.display = 'none';
        if(backBtn) backBtn.style.display = 'flex';
        if(menuBtn) menuBtn.style.display = 'flex';
    }

    // Explicitly handle sub-hud visibility during descent only
    if (stepNum >= 4 && stepNum <= 5) {
        if(hud) gsap.to(hud, { opacity: 1, x: 0, duration: 0.5 });
    } else {
        if(hud) gsap.to(hud, { opacity: 0, x: -50, duration: 0.5 });
    }
}

const backToggleBtn = document.getElementById('back-toggle');
if (backToggleBtn) {
    backToggleBtn.addEventListener('click', () => {
        if(!isTransitioning && currentGlobalStep > 6) {
            rewindToMap(currentGlobalStep);
        }
    });
}

function rewindToMap(startStep) {
    isTransitioning = true;
    let step = startStep;
   
    if(hud) gsap.to(hud, {opacity: 0, duration: 0.2});

    let rewindTimer = setInterval(() => {
        step--;
       
        document.querySelectorAll('.view-layer').forEach(el => el.classList.remove('active'));
       
        const layerMap = {
            30: 'autonomous-nav-page', 29: 'sensor-fusion-page',
            28: 'acoustic-page', 27: 'acoustic-page', 26: 'dvl-page', 25: 'ins-page', 24: 'dead-reckoning-page', 23: 'nav-topics-page',
            22: 'nav-intro-page', 21: 'hybrid-page', 20: 'auv-page', 19: 'rov-page', 18: 'hov-page', 17: 'category-page',
            16: 'supporting-page', 15: 'movement-page', 14: 'stability-page', 13: 'ballast-page',
            12: 'buoyancy-page', 11: 'material-page', 10: 'hull-page',
            9: 'analysis-page', 8: 'question-page', 7: 'uv-page', 6: 'map-page'
        };
       
        if(layerMap[step]) {
            let stepEl = document.getElementById(layerMap[step]);
            if(stepEl) stepEl.classList.add('active');
           
            document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
            let activeItem = document.querySelector(`.nav-item[data-step="${step}"]`);
            if(activeItem) {
                activeItem.classList.add('active');
                activeItem.scrollIntoView({ behavior: 'auto', block: 'nearest' });
            }
        }

        let clunk = document.getElementById('clunk-sound');
        if(clunk && !globalMuted) {
            clunk.currentTime = 0;
            clunk.play().catch(e=>{});
        }

        if (step <= 6) {
            clearInterval(rewindTimer);
            jumpToSection(6);
            isTransitioning = false;
        }
    }, 120);
}

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        if(isTransitioning) return;
        e.currentTarget.blur();
        const targetStep = parseInt(item.getAttribute('data-step'));
        jumpToSection(targetStep);
    });
});

function jumpToSection(stepNum) {
    document.querySelectorAll('.view-layer').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('video').forEach(media => { media.pause(); media.currentTime = 0; });
   
    let qmDot = document.getElementById('qm-dot');
    if(qmDot) qmDot.classList.remove('active-dot-blink');
   
    document.querySelectorAll('.vid-wrapper').forEach(w => w.classList.remove('playing'));
   
    gsap.killTweensOf("*");
   
    // Completely wipe all dynamic states to prevent cross-contamination
    gsap.set('#ballast-videos-container .shape-card, #stability-videos-container .shape-card, #movement-videos-container .shape-card, #supporting-videos-container .shape-card, #baseline-matrix .shape-card', { clearProps: "all", display: 'none' });
    gsap.set('.dynamic-title', { clearProps: "all" });
    gsap.set('#acoustic-blur-overlay', { opacity: 0 });
    gsap.set('#baseline-matrix', { display: 'none' });

    updateTimelineNav(stepNum);

    if(stepNum === 1) {
        document.getElementById('waiting-page').classList.add('active');
        let bg = document.getElementById('bg-video');
        if(bg) { bg.muted = true; bg.currentTime = 0; bg.play().catch(e=>{}); }
        workshopState = 'WAITING';
    }
    else if(stepNum === 2) {
        document.getElementById('landing-page').classList.add('active');
        gsap.set('#text-container', { opacity: 1, y: 0 });
        gsap.set('#begin-btn', { opacity: 1, y: 0 });
        gsap.set('#aquaman-img', { opacity: 1, y: 0, filter: "drop-shadow(0px 0px 50px rgba(0, 255, 255, 0.7))", xPercent: -50 });
        gsap.set('#cinematic-container', { scale: 1, opacity: 1 });
        workshopState = 'LANDING';
    }
    else if(stepNum === 3) {
        document.getElementById('agenda-page').classList.add('active');
        let vid = document.getElementById('vid-agenda');
        if(vid) { vid.muted = true; vid.currentTime = vid.duration || 999; }
        gsap.set('#agenda-overlay', {opacity: 1});
        workshopState = 'FINISHED_AGENDA';
    }
   else if(stepNum === 4) {
        // Clear old active layouts
        document.querySelectorAll('.view-layer').forEach(el => el.classList.remove('active'));
       
        // 1. Activate Earth Descent Part 1 Layer instantly
        let ed1Page = document.getElementById('ed1-page');
        let ed2Page = document.getElementById('ed2-page');
        if(ed1Page) ed1Page.classList.add('active');
       
        // Clear out any old textual agenda overlays
        let agendaOverlay = document.getElementById('agenda-overlay');
        if(agendaOverlay) gsap.to(agendaOverlay, { opacity: 0, duration: 0.3 });

        // Initialize HUD metrics
        if(hudD) hudD.innerText = "CALIBRATING...";
        if(hudT) hudT.innerText = "--.-";
        if(hudP) hudP.innerText = "--.-";

        // 2. Play Video 1
        let v1 = document.getElementById('vid-ed-1');
        let v2 = document.getElementById('vid-ed-2');
       
        if (v1) {
            v1.muted = true;
            v1.currentTime = 0;
            v1.play().catch(e => console.warn("Video 1 playback halted:", e));
           
            // 3. Chain Event: When video 1 ends, transition seamlessly to video 2
            v1.onended = () => {
                if(faderBlack) {
                    faderBlack.style.opacity = '1';
                   
                    setTimeout(() => {
                        if(ed1Page) ed1Page.classList.remove('active');
                        if(ed2Page) ed2Page.classList.add('active');
                        if(faderBlack) faderBlack.style.opacity = '0';
                       
                        if(v2) {
                            v2.muted = true;
                            v2.currentTime = 0;
                            v2.play().catch(e => console.warn("Video 2 playback halted:", e));
                           
                            // 4. Set state to finished only when video 2 concludes
                            v2.onended = () => {
                                workshopState = 'FINISHED_ED2';
                            };
                        } else {
                            workshopState = 'FINISHED_ED2';
                        }
                    }, 400);
                }
            };
        } else {
            // Safety fallback if video elements aren't present
            if(ed2Page) ed2Page.classList.add('active');
            workshopState = 'FINISHED_ED2';
        }
    }
    else if(stepNum === 5) {
        document.getElementById('dive-page-1').classList.add('active');
        let vid = document.getElementById('vid-dive-1');
        if(vid) { vid.muted = true; vid.currentTime = 0; vid.play().catch(e=>{}); vid.onended = () => { workshopState = 'FINISHED_DIVE_1'; }; }
        hudData = { depth: 0, temp: 24.0, press: 1.0 };
        updateHUD(0, 24.0, 1.0, 0);
        workshopState = 'PLAYING_DIVE_1';
    }
    else if(stepNum === 6) {
        document.getElementById('map-page').classList.add('active');
        workshopState = 'ON_MAP';
    }
    else if(stepNum === 7) {
        document.getElementById('uv-page').classList.add('active');
        let vid = document.getElementById('vid-uv-intro');
        if (vid) { vid.muted = true; vid.currentTime = vid.duration || 999; }
        gsap.set('#uv-title', { opacity: 1, y: 0 });
        workshopState = 'FINISHED_UV_REVEAL';
    }
    else if(stepNum === 8) {
        document.getElementById('question-page').classList.add('active');
        gsap.set('#qm-path', { strokeDashoffset: 0 });
        gsap.set('#qm-dot', { opacity: 1, scale: 1.0 });
        let qmDot = document.getElementById('qm-dot');
        if(qmDot) qmDot.classList.add('active-dot-blink');
        workshopState = 'FINISHED_QUESTION_MARK';
    }
    else if(stepNum === 9) {
        document.getElementById('analysis-page').classList.add('active');
        let fc = document.getElementById('flow-container');
        if(fc) fc.innerHTML = '';
        typewriterStep = 0;
        workshopState = 'PLAYING_ANALYSIS';
    }
    else if(stepNum === 10) {
        document.getElementById('hull-page').classList.add('active');
        gsap.set('#hull-title-container', { clearProps: "all", marginTop: '35vh' });
        gsap.set('#hull-main-title', { clearProps: "all", fontSize: '6rem', letterSpacing: '12px' });
        gsap.set('#hull-sub-title', { clearProps: "all", fontSize: '1.3rem', marginTop: '15px' });
        gsap.set('.cross-overlay', { opacity: 0, scale: 2 });
        let cylView = document.getElementById('cylinder-full-view');
        if(cylView) cylView.style.visibility = 'hidden';
        gsap.set('#cylinder-full-view', { opacity: 0 });
        hullStep = 1;
        workshopState = 'PLAYING_HULL_STEPS';
    }
    else if(stepNum === 11) {
        document.getElementById('material-page').classList.add('active');
        gsap.set('#material-title-container', { clearProps: "all", marginTop: '35vh' });
        gsap.set('#material-main-title', { clearProps: "all", fontSize: '6rem', letterSpacing: '12px' });
        gsap.set('#material-sub-title', { clearProps: "all", fontSize: '1.3rem', marginTop: '15px' });
        gsap.set('.cross-overlay', { opacity: 0, scale: 2 });
        materialStep = 1;
        workshopState = 'PLAYING_MATERIAL_STEPS';
    }
    else if(stepNum === 12) {
        document.getElementById('buoyancy-page').classList.add('active');
        gsap.set('#buoyancy-title-container', { clearProps: "all", marginTop: '35vh' });
        gsap.set('#buoyancy-main-title', { clearProps: "all", fontSize: '6rem', letterSpacing: '12px' });
        gsap.set('#buoyancy-sub-title', { clearProps: "all", fontSize: '1.3rem', marginTop: '15px' });
        gsap.set('#archimedes-container', { display: 'none', opacity: 0 });
        gsap.set('#buoyancy-videos-container', { display: 'none', opacity: 0 });
        buoyancyStep = 1;
        workshopState = 'PLAYING_BUOYANCY_STEPS';
    }
    else if(stepNum === 13) {
        document.getElementById('ballast-page').classList.add('active');
        gsap.set('#ballast-title-container', { clearProps: "all", marginTop: '35vh' });
        gsap.set('#ballast-main-title', { clearProps: "all", fontSize: '6rem', letterSpacing: '12px' });
        gsap.set('#ballast-sub-title', { clearProps: "all", fontSize: '1.3rem', marginTop: '15px' });
        gsap.set('#ballast-videos-container', { display: 'none', opacity: 0 });
        gsap.set('.card-b1', { clearProps: "all", display: 'none' });
        gsap.set('.card-b2', { clearProps: "all", display: 'none' });
        ballastStep = 1;
        workshopState = 'PLAYING_BALLAST_STEPS';
    }
    else if(stepNum === 14) {
        document.getElementById('stability-page').classList.add('active');
        gsap.set('#stability-title-container', { clearProps: "all", marginTop: '35vh' });
        gsap.set('#stability-main-title', { clearProps: "all", fontSize: '6rem', letterSpacing: '12px' });
        gsap.set('#stability-sub-title', { clearProps: "all", opacity: 0, fontSize: '1.3rem', marginTop: '15px' });
        gsap.set('#stability-videos-container', { display: 'none', opacity: 0 });
        gsap.set('.card-s1', { clearProps: "all", display: 'none' });
        gsap.set('.card-s2', { clearProps: "all", display: 'none' });
        stabilityStep = 1;
        workshopState = 'PLAYING_STABILITY_STEPS';
    }
    else if(stepNum === 15) {
        document.getElementById('movement-page').classList.add('active');
        gsap.set('#movement-title-container', { clearProps: "all", marginTop: '35vh' });
        gsap.set('#movement-main-title', { clearProps: "all", fontSize: '6rem', letterSpacing: '12px' });
        gsap.set('#movement-sub-title', { clearProps: "all", opacity: 0, fontSize: '1.3rem', marginTop: '15px' });
        gsap.set('.card-m1, .card-m2, .card-m3', { clearProps: "all", display: 'none' });
        movementStep = 1;
        workshopState = 'PLAYING_MOVEMENT_STEPS';
    }
    else if(stepNum === 16) {
        document.getElementById('supporting-page').classList.add('active');
        gsap.set('#supporting-title-container', { clearProps: "all", marginTop: '35vh' });
        gsap.set('#supporting-main-title', { clearProps: "all", fontSize: '5rem', letterSpacing: '10px' });
        gsap.set('#supporting-sub-title', { clearProps: "all", opacity: 0, fontSize: '1.3rem', marginTop: '15px' });
        gsap.set('.card-sup1, .card-sup2, .card-sup3, .card-sup4, .card-sup5', { clearProps: "all", display: 'none' });
        supportingStep = 1;
        workshopState = 'PLAYING_SUPPORTING_STEPS';
    }
    else if(stepNum === 17) {
        document.getElementById('category-page').classList.add('active');
        workshopState = 'FINISHED_CATEGORY_INTRO';
    }
    else if(stepNum === 18) {
        document.getElementById('hov-page').classList.add('active');
        let vid = document.getElementById('vid-hov');
        if (vid) { vid.muted = true; vid.currentTime = 0; vid.play().catch(e=>{}); }
        gsap.set('#hov-page .vehicle-title', { opacity: 1 });
        workshopState = 'HOV_LOOPING';
    }
    else if(stepNum === 19) {
        document.getElementById('rov-page').classList.add('active');
        let vid = document.getElementById('vid-rov');
        if (vid) { vid.muted = true; vid.currentTime = 0; vid.play().catch(e=>{}); }
        gsap.set('#rov-page .vehicle-title', { opacity: 1 });
        workshopState = 'ROV_LOOPING';
    }
    else if(stepNum === 20) {
        document.getElementById('auv-page').classList.add('active');
        let vid = document.getElementById('vid-auv');
        if (vid) { vid.muted = true; vid.currentTime = 0; vid.play().catch(e=>{}); }
        gsap.set('#auv-page .vehicle-title', { opacity: 1 });
        workshopState = 'AUV_LOOPING';
    }
    else if(stepNum === 21) {
        document.getElementById('hybrid-page').classList.add('active');
        let vid = document.getElementById('vid-hybrid');
        if (vid) { vid.muted = true; vid.currentTime = 0; vid.play().catch(e=>{}); }
        gsap.set('#hybrid-page .vehicle-title', { opacity: 1 });
        workshopState = 'HYBRID_LOOPING';
    }
    else if(stepNum === 22) {
        document.getElementById('nav-intro-page').classList.add('active');
        let vid = document.getElementById('vid-nav-intro');
        if (vid) { vid.muted = true; vid.currentTime = 0; vid.play().catch(e=>{}); }
        gsap.set('#nav-intro-title', { opacity: 1 });
        workshopState = 'NAV_INTRO_DONE';
    }
    else if(stepNum === 23) {
        document.getElementById('nav-topics-page').classList.add('active');
        gsap.set('.nav-topic-line', { opacity: 1, y: 0 });
        workshopState = 'NAV_TOPICS_DONE';
    }
    else if(stepNum === 24) {
        document.getElementById('dead-reckoning-page').classList.add('active');
        let vid = document.getElementById('vid-dead-reckoning');
        if (vid) { vid.muted = true; vid.currentTime = 0; vid.play().catch(e=>{}); }
        gsap.set('#title-dr', { top: '12%', left: '50%', xPercent: -50, fontSize: '2.5rem' });
        workshopState = 'DEAD_RECKONING_LOOPING';
    }
    else if(stepNum === 25) {
        document.getElementById('ins-page').classList.add('active');
        let vid = document.getElementById('vid-ins');
        if (vid) { vid.muted = true; vid.currentTime = 0; vid.play().catch(e=>{}); }
        gsap.set('#title-ins', { top: '12%', left: '50%', xPercent: -50, fontSize: '2.5rem' });
        workshopState = 'INS_LOOPING';
    }
    else if(stepNum === 26) {
        document.getElementById('dvl-page').classList.add('active');
        let vid = document.getElementById('vid-dvl');
        if (vid) { vid.muted = true; vid.currentTime = 0; vid.play().catch(e=>{}); }
        gsap.set('#title-dvl', { top: '12%', left: '50%', xPercent: -50, fontSize: '2.5rem' });
        workshopState = 'DVL_LOOPING';
    }
    else if(stepNum === 27) {
        document.getElementById('acoustic-page').classList.add('active');
        let vid = document.getElementById('vid-acoustic');
        if (vid) { vid.muted = true; vid.currentTime = 0; vid.play().catch(e=>{}); }
        gsap.set('#title-acoustic', { top: '12%', left: '50%', xPercent: -50, fontSize: '2.5rem' });
        workshopState = 'ACOUSTIC_LOOPING';
    }
    else if(stepNum === 28) {
        document.getElementById('acoustic-page').classList.add('active');
        let vid = document.getElementById('vid-acoustic');
        if (vid) { vid.muted = true; vid.play().catch(e=>{}); }
        gsap.set('#title-acoustic', { top: '12%', left: '50%', xPercent: -50, fontSize: '2.5rem' });
        gsap.set('#acoustic-blur-overlay', { opacity: 1, pointerEvents: 'auto' });
        gsap.set('#baseline-matrix', { display: 'flex' });
        gsap.set('.card-lbl, .card-sbl, .card-usbl', { opacity: 1, display: 'flex' });
        workshopState = 'BASELINE_MATRIX';
    }
    else if(stepNum === 29) {
        document.getElementById('sensor-fusion-page').classList.add('active');
        let vid = document.getElementById('vid-sensor-fusion');
        if (vid) { vid.muted = true; vid.currentTime = 0; vid.play().catch(e=>{}); }
        gsap.set('#title-sensor-fusion', { top: '85%', left: '50%', xPercent: -50, fontSize: '2.5rem' });
        workshopState = 'SENSOR_FUSION_LOOPING';
    }
    else if(stepNum === 30) {
        document.getElementById('autonomous-nav-page').classList.add('active');
        let vid = document.getElementById('vid-autonomous-nav');
        if (vid) { vid.muted = true; vid.currentTime = 0; vid.play().catch(e=>{}); }
        gsap.set('#title-autonomous-nav', { top: '12%', left: '50%', xPercent: -50, fontSize: '2.5rem' });
        workshopState = 'AUTONOMOUS_NAV_LOOPING';
    }
}

// ==========================================
// AUDIO LOGIC
// ==========================================
const audioToggleBtn = document.getElementById('audio-toggle');
if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', (e) => {
        globalMuted = !globalMuted;
        e.currentTarget.innerText = globalMuted ? '🔇' : '🔊';
        // STRICTLY ONLY MUTE AUDIO TAGS, LEAVE VIDEOS MUTED PERMANENTLY
        document.querySelectorAll('audio').forEach(media => { media.muted = globalMuted; });
        e.currentTarget.blur();
    });
}

// ==========================================
// MAP NODE CLICK HANDLERS
// ==========================================
function launchNode1() {
    if(isTransitioning) return;
    isTransitioning = true;
    if(faderBlack) faderBlack.style.opacity = '1';
   
    setTimeout(() => {
        document.querySelectorAll('.view-layer').forEach(el => el.classList.remove('active'));
        let uvPage = document.getElementById('uv-page');
        if(uvPage) uvPage.classList.add('active');
        updateTimelineNav(7);
        if(faderBlack) faderBlack.style.opacity = '0';
       
        let vid = document.getElementById('vid-uv-intro');
        if (vid) {
            vid.muted = true;
            vid.loop = false;
            vid.currentTime = 0;
            let p = vid.play();
            if (p !== undefined) p.catch(e => console.log(e));
           
            let titleRevealed = false;
            vid.addEventListener('timeupdate', () => {
                if (vid.currentTime >= 8.0 && !titleRevealed) {
                    titleRevealed = true;
                    gsap.set('#uv-title', { y: -20 });
                    gsap.to('#uv-title', { opacity: 1, y: 0, duration: 2, ease: "power2.out" });
                }
            });

            vid.onended = () => { workshopState = 'FINISHED_UV_REVEAL'; };
        }
        isTransitioning = false;
    }, 800);
}

function launchNode2() {
    if(isTransitioning) return;
    isTransitioning = true;
    if(faderBlack) faderBlack.style.opacity = '1';
   
    setTimeout(() => {
        document.querySelectorAll('.view-layer').forEach(el => el.classList.remove('active'));
        let navPage = document.getElementById('nav-intro-page');
        if(navPage) navPage.classList.add('active');
        updateTimelineNav(22);
        if(faderBlack) faderBlack.style.opacity = '0';
       
        let vid = document.getElementById('vid-nav-intro');
        if (vid) {
            vid.muted = true;
            vid.loop = false;
            vid.currentTime = 0;
            let p = vid.play();
            if (p !== undefined) p.catch(e => console.log(e));
           
            let titleRevealed = false;
            vid.addEventListener('timeupdate', () => {
                if (vid.currentTime >= 8.0 && !titleRevealed) {
                    titleRevealed = true;
                    gsap.to('#nav-intro-title', { opacity: 1, duration: 2, ease: "power2.out" });
                }
            });
            vid.onended = () => { workshopState = 'NAV_INTRO_DONE'; };
        }
        isTransitioning = false;
    }, 800);
}

// ==========================================
// LOOPING CATEGORY TRANSITION HELPER
// ==========================================
function transitionAndPlayLooping(nextLayerId, nextVideoId, nextStateName, callback) {
    isTransitioning = true;
    if(faderBlack) faderBlack.style.opacity = '1';
    setTimeout(() => {
        document.querySelectorAll('.view-layer.active').forEach(el => el.classList.remove('active'));
        let nextElement = document.getElementById(nextLayerId);
        if(nextElement) nextElement.classList.add('active');
        if(faderBlack) faderBlack.style.opacity = '0';
       
        let vid = document.getElementById(nextVideoId);
        if (vid) {
            vid.muted = true;
            vid.loop = true;
            vid.currentTime = 0;
            let p = vid.play();
            if (p !== undefined) p.catch(e => console.log(e));
        }
        if (callback) callback();
       
        workshopState = nextStateName;
        isTransitioning = false;
    }, 800);
}

// ==========================================
// VIDEO PLAY CLICK HANDLERS (BUOYANCY & MATRIX)
// ==========================================
document.querySelectorAll('.vid-wrapper').forEach(wrapper => {
    wrapper.addEventListener('click', () => {
        const video = wrapper.querySelector('video');
        if (video) {
            if (video.paused) {
                video.muted = true;
                video.play().catch(e=>{});
                wrapper.classList.add('playing');
            } else {
                video.pause();
                wrapper.classList.remove('playing');
            }
        }
    });
});

// ==========================================
// GLOBAL SPACEBAR HANDLER (The Director)
// ==========================================
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        event.preventDefault();
       
        if (!isTransitioning) {
            switch(workshopState) {
               
             
                case 'WAITING':
                    isTransitioning = true;
                    if (faderBlack) faderBlack.style.opacity = '1';
                   
                    setTimeout(() => {
                        // Clears active layers and transitions directly to Step 2 (Landing Page)
                        jumpToSection(2);
                       
                        if (faderBlack) faderBlack.style.opacity = '0';
                        isTransitioning = false;
                    }, 500);
                    break;
                case 'FINISHED_AGENDA':
                isTransitioning = true;
                if (faderBlack) faderBlack.style.opacity = '1';
                setTimeout(() => {
                    // This kicks off our double-video system built above
                    jumpToSection(4);
                    if (faderBlack) faderBlack.style.opacity = '0';
                    isTransitioning = false;
                }, 600);
                break;
               
                case 'FINISHED_ED2':
                    isTransitioning = true;
                   
                    // 1. Activate the fader to hide the layer transition
                    if (faderBlack) faderBlack.style.opacity = '1';
                   
                    setTimeout(() => {
                        jumpToSection(5);
                       
                        // Sync your timeline side navigation
                        updateTimelineNav(5);
                       
                        if (faderBlack) faderBlack.style.opacity = '0';
                        isTransitioning = false;
                       
                        // 3. Set the state machine context for your telemetry engine
                        workshopState = 'PLAYING_DIVE_1';
                       
                     
                    });
                    break;

                case 'FINISHED_ED2':
                    transitionAndPlay('dive-page-1', 'vid-dive-1', 'DIVE_1', () => {
                        updateTimelineNav(5);
                        hudData = { depth: 0, temp: 24.0, press: 1.0 };
                        updateHUD(0, 24.0, 1.0, 0);
                    });
                    break;
                   
                case 'FINISHED_DIVE_1':
                    transitionAndPlay('dive-page-2', 'vid-dive-2', 'DIVE_2', () => {
                        updateHUD(300, 15.0, 31.0, 5); flashCenterText('#center-text-2', ['100 METERS', '200 METERS', '300 METERS']);
                    });
                    break;
                   
                case 'FINISHED_DIVE_2':
                    transitionAndPlay('dive-page-3', 'vid-dive-3', 'DIVE_3', () => {
                        updateHUD(1000, 4.0, 101.0, 6); flashCenterText('#center-text-3', ['500 METERS', '700 METERS', '1000 METERS']);
                    });
                    break;
                   
                case 'FINISHED_DIVE_3':
                    transitionAndPlay('dive-page-4-1', 'vid-dive-4-1', 'DIVE_4_1', () => {
                        updateHUD(4000, 2.0, 401.0, 4); flashCenterText('#center-text-4-1', ['4000 METERS']);
                    });
                    break;
                   
                case 'FINISHED_DIVE_4_1':
                    transitionAndPlay('dive-page-4-2', 'vid-dive-4-2', 'DIVE_4_2', () => {
                        gsap.to(scanner, { opacity: 1, duration: 0.5, yoyo: true, repeat: 5 });
                    });
                    break;
                   
                case 'FINISHED_DIVE_4_2':
                    transitionAndPlay('dive-page-5', 'vid-dive-5', 'DIVE_5', () => {
                        playDive5Logic(); updateHUD(11000, 1.0, 1100.0, 7);
                    });
                    break;

                case 'FINISHED_DIVE_5': transitionToMapPage(); break;
               
                case 'FINISHED_UV_REVEAL': initiateQuestionMarkPage(); break;
                case 'FINISHED_QUESTION_MARK': transitionToStreamingAnalysis(); break;

                case 'PLAYING_ANALYSIS':
                    if (typewriterStep < cinematicFlow.length) {
                        executeStrategicTypewriterStep();
                    } else {
                        transitionToHullDesignPage();
                    }
                    break;

                case 'PLAYING_HULL_STEPS': executeNextHullSubStep(); break;
                case 'HULL_SCENE_COMPLETE': transitionToMaterialPage(); break;
                case 'PLAYING_MATERIAL_STEPS': executeNextMaterialSubStep(); break;
                case 'MATERIAL_SCENE_COMPLETE': transitionToBuoyancyPage(); break;
                case 'PLAYING_BUOYANCY_STEPS': executeNextBuoyancySubStep(); break;
                case 'BUOYANCY_SCENE_COMPLETE': transitionToBallastPage(); break;
                case 'PLAYING_BALLAST_STEPS': executeNextBallastSubStep(); break;
                case 'BALLAST_SCENE_COMPLETE': transitionToStabilityPage(); break;
                case 'PLAYING_STABILITY_STEPS': executeNextStabilitySubStep(); break;
                case 'STABILITY_SCENE_COMPLETE': transitionToMovementPage(); break;
                case 'PLAYING_MOVEMENT_STEPS': executeNextMovementSubStep(); break;
                case 'MOVEMENT_SCENE_COMPLETE': transitionToSupportingPage(); break;
                case 'PLAYING_SUPPORTING_STEPS': executeNextSupportingSubStep(); break;

                case 'SUPPORTING_SCENE_COMPLETE': transitionToCategoryIntro(); break;
                case 'FINISHED_CATEGORY_INTRO':
                    transitionAndPlayLooping('hov-page', 'vid-hov', 'HOV_LOOPING', () => {
                        updateTimelineNav(18);
                        gsap.to('#hov-page .vehicle-title', { opacity: 1, duration: 2, delay: 0.5 });
                    });
                    break;
                case 'HOV_LOOPING':
                    transitionAndPlayLooping('rov-page', 'vid-rov', 'ROV_LOOPING', () => {
                        updateTimelineNav(19);
                        gsap.to('#rov-page .vehicle-title', { opacity: 1, duration: 2, delay: 0.5 });
                    });
                    break;
                case 'ROV_LOOPING':
                    transitionAndPlayLooping('auv-page', 'vid-auv', 'AUV_LOOPING', () => {
                        updateTimelineNav(20);
                        gsap.to('#auv-page .vehicle-title', { opacity: 1, duration: 2, delay: 0.5 });
                    });
                    break;
                case 'AUV_LOOPING':
                    transitionAndPlayLooping('hybrid-page', 'vid-hybrid', 'HYBRID_LOOPING', () => {
                        updateTimelineNav(21);
                        gsap.to('#hybrid-page .vehicle-title', { opacity: 1, duration: 2, delay: 0.5 });
                    });
                    break;
                case 'HYBRID_LOOPING':
                    transitionToMapPage();
                    break;
           
                case 'HYBRID_LOOPING':
                isTransitioning = true;
                if (faderBlack) faderBlack.style.opacity = '1';
                setTimeout(() => {
                    // Safely slide back to the Mission Map (Step 6)
                    jumpToSection(6);
                    updateTimelineNav(6);
                    if (faderBlack) faderBlack.style.opacity = '0';
                    isTransitioning = false;
                    workshopState = 'ON_MAP';
                }, 500);
                break;
                   
                // ===================================================
                // NAVIGATION SYSTEM LOGIC FLOW
                // ===================================================
                case 'NAV_INTRO_DONE':
                    transitionToNavTopics();
                    break;
                case 'NAV_TOPICS_DONE':
                    transitionToDeadReckoningTitle();
                    break;
                case 'DEAD_RECKONING_TITLE':
                    playDeadReckoningVideo();
                    break;
                case 'DEAD_RECKONING_LOOPING':
                    transitionToINSTitle();
                    break;
                case 'INS_TITLE':
                    playINSVideo();
                    break;
                case 'INS_LOOPING':
                    transitionToDVLTitle();
                    break;
                case 'DVL_TITLE':
                    playDVLVideo();
                    break;
                case 'DVL_LOOPING':
                    transitionToAcousticTitle();
                    break;
                case 'ACOUSTIC_TITLE':
                    playAcousticVideo();
                    break;
                case 'ACOUSTIC_LOOPING':
                    revealBaselineMatrix();
                    break;
                case 'BASELINE_MATRIX':
                    transitionToSensorFusionTitle();
                    break;
                case 'SENSOR_FUSION_TITLE':
                    playSensorFusionVideo();
                    break;
                case 'SENSOR_FUSION_LOOPING':
                    transitionToAutonomousNavTitle();
                    break;
                case 'AUTONOMOUS_NAV_TITLE':
                    playAutonomousNavVideo();
                    break;
                case 'AUTONOMOUS_NAV_LOOPING':
                    transitionToMapPage();
                    break;
            }
        }
    }
});

// ==========================================
// TRANSITIONS
// ==========================================
function transitionAndPlay(nextLayerId, nextVideoId, nextStateName, callback) {
    isTransitioning = true;
    if(faderBlack) faderBlack.style.opacity = '1';
    setTimeout(() => {
        document.querySelectorAll('.view-layer.active').forEach(el => el.classList.remove('active'));
        let nextElement = document.getElementById(nextLayerId);
        if(nextElement) nextElement.classList.add('active');
        if(faderBlack) faderBlack.style.opacity = '0';
       
        let vid = document.getElementById(nextVideoId);
        if (vid) {
            vid.muted = true;
            vid.loop = false;
            let p = vid.play();
            if (p !== undefined) p.catch(e => console.log(e));
            vid.onended = () => { workshopState = 'FINISHED_' + nextStateName; };
        } else {
            workshopState = 'FINISHED_' + nextStateName;
        }
       
        if (callback) callback();
        if (workshopState !== 'ON_MAP') {
            workshopState = 'PLAYING_' + nextStateName;
        }
        isTransitioning = false;
    }, 800);
}

function playDive5Logic() {
    const vid = document.getElementById('vid-dive-5');
    if (!vid) return;
    let titleRevealed = false;
    vid.addEventListener('timeupdate', () => {
        if (vid.currentTime >= 5.0 && !titleRevealed) {
            titleRevealed = true;
            gsap.to('#mariana-title', { opacity: 1, y: 0, duration: 3, ease: "power2.out" });
        }
    });
}

function transitionToMapPage() {
    isTransitioning = true;
    updateTimelineNav(6);
    if(faderBlack) faderBlack.style.opacity = '1';
   
    setTimeout(() => {
        let actLayer = document.querySelector('.view-layer.active');
        if(actLayer) actLayer.classList.remove('active');
        let mPage = document.getElementById('map-page');
        if(mPage) mPage.classList.add('active');
        if(faderBlack) faderBlack.style.opacity = '0';
        workshopState = 'ON_MAP';
        isTransitioning = false;
    }, 800);
}

function initiateQuestionMarkPage() {
    isTransitioning = true;
    updateTimelineNav(8);
    if(faderBlack) faderBlack.style.opacity = '1';
    setTimeout(() => {
        let actLayer = document.querySelector('.view-layer.active');
        if(actLayer) actLayer.classList.remove('active');
        let qPage = document.getElementById('question-page');
        if(qPage) qPage.classList.add('active');
        if(faderBlack) faderBlack.style.opacity = '0';
       
        const path = document.getElementById('qm-path');
        if(path) {
            const length = path.getTotalLength();
            path.style.strokeDasharray = length; path.style.strokeDashoffset = length;
            let tl = gsap.timeline();
            tl.to(path, { strokeDashoffset: 0, duration: 3.5, ease: "power2.inOut" })
              .to('#qm-dot', { opacity: 1, scale: 1.3, duration: 0.4, ease: "bounce.out" })
              .to('#qm-dot', { scale: 1.0, duration: 0.1 })
              .call(() => {
                  let qDot = document.getElementById('qm-dot');
                  if(qDot) qDot.classList.add('active-dot-blink');
                  workshopState = 'FINISHED_QUESTION_MARK';
                  isTransitioning = false;
              });
        }
    }, 800);
}

function transitionToStreamingAnalysis() {
    isTransitioning = true;
    updateTimelineNav(9);
    let qDot = document.getElementById('qm-dot');
    if(qDot) qDot.classList.remove('active-dot-blink');
    gsap.to('#question-mark-svg', { opacity: 0, duration: 0.6, ease: "power2.out" });
    if(faderBlack) faderBlack.style.opacity = '1';
   
    setTimeout(() => {
        let qPage = document.getElementById('question-page');
        if(qPage) qPage.classList.remove('active');
        let aPage = document.getElementById('analysis-page');
        if(aPage) aPage.classList.add('active');
        if(faderBlack) faderBlack.style.opacity = '0';
        workshopState = 'PLAYING_ANALYSIS';
        isTransitioning = false;
    }, 800);
}

function executeStrategicTypewriterStep() {
    isTransitioning = true;
    const currentStepData = cinematicFlow[typewriterStep];
    const flowContainer = document.getElementById('flow-container');
    if(!flowContainer) return;
   
    let targetSpanId = `span-txt-${typewriterStep}`;

    if (currentStepData.type === 'CHALLENGE') {
        const row = document.createElement('div');
        row.className = 'flow-row'; row.id = currentStepData.containerId;
        row.innerHTML = `
            <div class="text-wrapper">
                ${thematicIcons[currentStepData.icon]}
                <span class="challenge-text float-bobbing" id="${targetSpanId}" style="display:inline-block;"></span>
                <span class="flow-row-arrow" id="arrow-${currentStepData.containerId}">--------&gt;</span>
            </div>`;
        flowContainer.appendChild(row);
        flowContainer.scrollTop = flowContainer.scrollHeight;
        gsap.to(row, { opacity: 1, y: 0, duration: 0.5, onComplete: () => {
            triggerCharacterByCharacterTypewriter(currentStepData.text, targetSpanId, currentStepData.icon);
        }});
    } else {
        const activeRow = document.getElementById(currentStepData.containerId);
        if(!activeRow) return;
        activeRow.classList.add('resolved-row');
        const wrapper = activeRow.querySelector('.text-wrapper');
        const arrow = activeRow.querySelector('.flow-row-arrow');
        if(arrow) gsap.to(arrow, { opacity: 0.8, duration: 0.4 });
       
        const solutionWrapper = document.createElement('div');
        solutionWrapper.style.display = 'contents';
        solutionWrapper.innerHTML = `
            <span class="requirement-text float-bobbing" id="${targetSpanId}" style="display:inline-block; margin-left:auto;"></span>
            ${thematicIcons[currentStepData.icon]}`;
        if(wrapper) wrapper.appendChild(solutionWrapper);
        triggerCharacterByCharacterTypewriter(currentStepData.text, targetSpanId, currentStepData.icon);
    }
}

function triggerCharacterByCharacterTypewriter(fullText, targetSpanId, iconClass) {
    const textSpan = document.getElementById(targetSpanId);
    if(!textSpan) return;
    let cumulativeStr = ""; let charPtr = 0;
    const internalTimer = setInterval(() => {
        cumulativeStr += fullText[charPtr];
        textSpan.innerText = cumulativeStr;
        charPtr++;
        if (charPtr >= fullText.length) {
            clearInterval(internalTimer);
            let icons = textSpan.parentElement.querySelectorAll('.reveal-icon');
            let targetIcon = icons[icons.length - 1];
            if (targetIcon) gsap.to(targetIcon, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" });
            typewriterStep++;
            isTransitioning = false;
        }
    }, 60);
}

function transitionToHullDesignPage() {
    isTransitioning = true;
    updateTimelineNav(10);
    if(faderBlack) faderBlack.style.opacity = '1';
    setTimeout(() => {
        let aPage = document.getElementById('analysis-page');
        if(aPage) aPage.classList.remove('active');
        let hPage = document.getElementById('hull-page');
        if(hPage) hPage.classList.add('active');
        if(faderBlack) faderBlack.style.opacity = '0';
        workshopState = 'PLAYING_HULL_STEPS';
        hullStep = 1;
        isTransitioning = false;
    }, 800);
}

function executeNextHullSubStep() {
    isTransitioning = true;
    switch(hullStep) {
        case 1:
            const titleContainer = document.getElementById('hull-title-container');
            gsap.to('#hull-main-title', { fontSize: '4rem', letterSpacing: '6px', duration: 1.2, ease: "power3.inOut" });
            gsap.to('#hull-sub-title', { fontSize: '1rem', marginTop: '5px', duration: 1.2, ease: "power3.inOut" });
            if(titleContainer) gsap.to(titleContainer, { marginTop: '5vh', y: 0, duration: 1.2, ease: "power3.inOut" });
            setTimeout(() => { hullStep = 2; isTransitioning = false; }, 1200);
            break;
        case 2:
            gsap.set('#hull-page .shape-card', { display: 'flex' });
            gsap.to('.card-square, .card-rectangle, .card-triangle', {
                opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "back.out(1.2)",
                onComplete: () => { hullStep = 3; isTransitioning = false; }
            });
            break;
        case 3:
            let clunk = document.getElementById('clunk-sound');
            if(clunk && !globalMuted) clunk.play().catch(e=>{});
            gsap.to('.cross-sq, .cross-rect, .cross-tri', {
                opacity: 1, scale: 1, duration: 0.6, ease: "power2.out", stagger: 0.1,
                onComplete: () => { hullStep = 4; isTransitioning = false; }
            });
            break;
        case 4:
            gsap.to('.card-sphere', {
                opacity: 1, y: 0, duration: 1.2, ease: "power4.out",
                onComplete: () => { hullStep = 5; isTransitioning = false; }
            });
            break;
        case 5:
            let clunk2 = document.getElementById('clunk-sound');
            if(clunk2 && !globalMuted) clunk2.play().catch(e=>{});
            gsap.to('.cross-sph', {
                opacity: 1, scale: 1, duration: 0.6, ease: "bounce.out",
                onComplete: () => { hullStep = 6; isTransitioning = false; }
            });
            break;
        case 6:
            const cylinderContainer = document.getElementById('cylinder-full-view');
            if(cylinderContainer) cylinderContainer.style.visibility = 'visible';
           
            let cylVid = document.getElementById('cylinder-vid-bg');
            if (cylVid) {
                cylVid.muted = true;
                cylVid.play().catch(e => console.log(e));
            }

            let impact = document.getElementById('impact-sound');
            if(impact && !globalMuted) impact.play().catch(e=>{});
           
            if(cylinderContainer) {
                gsap.to(cylinderContainer, {
                    opacity: 1, duration: 1.5, ease: "power2.inOut",
                    onComplete: () => { workshopState = 'HULL_SCENE_COMPLETE'; isTransitioning = false; }
                });
            } else {
                workshopState = 'HULL_SCENE_COMPLETE'; isTransitioning = false;
            }
            break;
    }
}

function transitionToMaterialPage() {
    isTransitioning = true;
    updateTimelineNav(11);
    if(faderBlack) faderBlack.style.opacity = '1';
   
    setTimeout(() => {
        let cylVid = document.getElementById('cylinder-vid-bg');
        if (cylVid) { cylVid.pause(); }
       
        let hPage = document.getElementById('hull-page');
        if(hPage) hPage.classList.remove('active');
        let mPage = document.getElementById('material-page');
        if(mPage) mPage.classList.add('active');
        if(faderBlack) faderBlack.style.opacity = '0';
        workshopState = 'PLAYING_MATERIAL_STEPS';
        materialStep = 1;
        isTransitioning = false;
    }, 800);
}

function executeNextMaterialSubStep() {
    isTransitioning = true;
    switch(materialStep) {
        case 1:
            const titleContainer = document.getElementById('material-title-container');
            gsap.to('#material-main-title', { fontSize: '4rem', letterSpacing: '6px', duration: 1.2, ease: "power3.inOut" });
            gsap.to('#material-sub-title', { fontSize: '1rem', marginTop: '5px', duration: 1.2, ease: "power3.inOut" });
            if(titleContainer) gsap.to(titleContainer, { marginTop: '5vh', y: 0, duration: 1.2, ease: "power3.inOut" });
            setTimeout(() => { materialStep = 2; isTransitioning = false; }, 1200);
            break;
        case 2:
            gsap.set('#material-page .shape-card', { display: 'flex' });
            gsap.to('.card-plastic', {
                opacity: 1, y: 0, duration: 1, ease: "back.out(1.2)",
                onComplete: () => { materialStep = 3; isTransitioning = false; }
            });
            break;
        case 3:
            let clunk = document.getElementById('clunk-sound');
            if(clunk && !globalMuted) clunk.play().catch(e=>{});
            gsap.to('.cross-plas', {
                opacity: 1, scale: 1, duration: 0.6, ease: "power2.out",
                onComplete: () => { materialStep = 4; isTransitioning = false; }
            });
            break;
        case 4:
            gsap.to('.card-steel', {
                opacity: 1, y: 0, duration: 1, ease: "back.out(1.2)",
                onComplete: () => { materialStep = 5; isTransitioning = false; }
            });
            break;
        case 5:
            gsap.to('.card-alum', {
                opacity: 1, y: 0, duration: 1, ease: "back.out(1.2)",
                onComplete: () => { materialStep = 6; isTransitioning = false; }
            });
            break;
        case 6:
            gsap.to('.card-titanium', {
                opacity: 1, y: 0, duration: 1, ease: "back.out(1.2)",
                onComplete: () => { materialStep = 7; isTransitioning = false; }
            });
            break;
        case 7:
            gsap.to('.card-carbon', {
                opacity: 1, y: 0, duration: 1, ease: "back.out(1.2)",
                onComplete: () => {
                    workshopState = 'MATERIAL_SCENE_COMPLETE';
                    isTransitioning = false;
                }
            });
            break;
    }
}

function transitionToBuoyancyPage() {
    isTransitioning = true;
    updateTimelineNav(12);
    if(faderBlack) faderBlack.style.opacity = '1';
   
    setTimeout(() => {
        let mPage = document.getElementById('material-page');
        if(mPage) mPage.classList.remove('active');
        let bPage = document.getElementById('buoyancy-page');
        if(bPage) bPage.classList.add('active');
        if(faderBlack) faderBlack.style.opacity = '0';
        workshopState = 'PLAYING_BUOYANCY_STEPS';
        buoyancyStep = 1;
        isTransitioning = false;
    }, 800);
}

function executeNextBuoyancySubStep() {
    isTransitioning = true;
    switch(buoyancyStep) {
        case 1:
            const titleContainer = document.getElementById('buoyancy-title-container');
            gsap.to('#buoyancy-main-title', { fontSize: '4rem', letterSpacing: '6px', duration: 1.2, ease: "power3.inOut" });
            gsap.to('#buoyancy-sub-title', { fontSize: '1rem', marginTop: '5px', duration: 1.2, ease: "power3.inOut" });
            if(titleContainer) gsap.to(titleContainer, { marginTop: '5vh', y: 0, duration: 1.2, ease: "power3.inOut" });
            setTimeout(() => { buoyancyStep = 2; isTransitioning = false; }, 1200);
            break;
        case 2:
            gsap.set('#archimedes-container', { display: 'block', opacity: 0 });
            gsap.to('#archimedes-container', {
                opacity: 1, duration: 1, ease: "power2.out",
                onComplete: () => { buoyancyStep = 3; isTransitioning = false; }
            });
            break;
        case 3:
            gsap.to('#archimedes-container', {
                opacity: 0, duration: 0.8, ease: "power2.in",
                onComplete: () => {
                    gsap.set('#archimedes-container', { display: 'none' });
                    gsap.set('#buoyancy-videos-container', { display: 'flex', opacity: 1 });
                    gsap.set('#buoyancy-videos-container .shape-card', { display: 'flex' });
                   
                    gsap.to('.vid-card', {
                        opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "back.out(1.2)",
                        onComplete: () => {
                            workshopState = 'BUOYANCY_SCENE_COMPLETE';
                            isTransitioning = false;
                        }
                    });
                }
            });
            break;
    }
}

function transitionToBallastPage() {
    isTransitioning = true;
    updateTimelineNav(13);
    if(faderBlack) faderBlack.style.opacity = '1';
   
    setTimeout(() => {
        let bPage = document.getElementById('buoyancy-page');
        if(bPage) bPage.classList.remove('active');
        let balPage = document.getElementById('ballast-page');
        if(balPage) balPage.classList.add('active');
        if(faderBlack) faderBlack.style.opacity = '0';
        workshopState = 'PLAYING_BALLAST_STEPS';
        ballastStep = 1;
        isTransitioning = false;
    }, 800);
}

function executeNextBallastSubStep() {
    isTransitioning = true;
    let v1 = document.getElementById('vid-ballast-1');
    let v2 = document.getElementById('vid-ballast-2');

    switch(ballastStep) {
        case 1:
            const titleContainer = document.getElementById('ballast-title-container');
            gsap.to('#ballast-main-title', { fontSize: '4rem', letterSpacing: '6px', duration: 1.2, ease: "power3.inOut" });
            gsap.to('#ballast-sub-title', { fontSize: '1rem', marginTop: '5px', duration: 1.2, ease: "power3.inOut" });
            if(titleContainer) gsap.to(titleContainer, { marginTop: '5vh', y: 0, duration: 1.2, ease: "power3.inOut" });
           
            setTimeout(() => {
                gsap.set('#ballast-videos-container', { display: 'flex', opacity: 1 });
                gsap.set('.card-b1', { display: 'block', opacity: 0 });
                gsap.set('.card-b2', { display: 'none', opacity: 0 });
               
                gsap.to('.card-b1', { opacity: 1, duration: 1, ease: "power2.out", onComplete: () => {
                    if (v1) { v1.muted = true; v1.playbackRate = 0.5; v1.loop = false; v1.currentTime = 0; v1.play().catch(e=>{}); }
                    ballastStep = 2;
                    isTransitioning = false;
                }});
            }, 1200);
            break;

        case 2:
            gsap.to('.card-b1', { opacity: 0, duration: 0.5, onComplete: () => {
                if (v1) v1.pause();
                gsap.set('.card-b1', { display: 'none' });
                gsap.set('.card-b2', { display: 'block' });
               
                gsap.to('.card-b2', { opacity: 1, duration: 0.5, onComplete: () => {
                    if (v2) { v2.muted = true; v2.playbackRate = 1.0; v2.loop = false; v2.currentTime = 0; v2.play().catch(e=>{}); }
                    ballastStep = 3;
                    isTransitioning = false;
                }});
            }});
            break;

        case 3:
            gsap.to('.card-b2', { opacity: 0, duration: 0.5, onComplete: () => {
                if (v2) v2.pause();
                gsap.set('.card-b1', { display: 'block', opacity: 0 });
                gsap.set('.card-b2', { display: 'block', opacity: 0 });
               
                gsap.to(['.card-b1', '.card-b2'], { opacity: 1, duration: 1, stagger: 0.2, ease: "back.out(1.2)", onComplete: () => {
                    if (v1) { v1.muted = true; v1.playbackRate = 1.0; v1.loop = true; v1.play().catch(e=>{}); }
                    if (v2) { v2.muted = true; v2.playbackRate = 1.0; v2.loop = true; v2.play().catch(e=>{}); }
                    workshopState = 'BALLAST_SCENE_COMPLETE';
                    isTransitioning = false;
                }});
            }});
            break;
    }
}

function transitionToStabilityPage() {
    isTransitioning = true;
    updateTimelineNav(14);
    if(faderBlack) faderBlack.style.opacity = '1';
   
    setTimeout(() => {
        let balPage = document.getElementById('ballast-page');
        if(balPage) balPage.classList.remove('active');
        let sPage = document.getElementById('stability-page');
        if(sPage) sPage.classList.add('active');
        if(faderBlack) faderBlack.style.opacity = '0';
        workshopState = 'PLAYING_STABILITY_STEPS';
        stabilityStep = 1;
        isTransitioning = false;
    }, 800);
}

function executeNextStabilitySubStep() {
    isTransitioning = true;
    let v1 = document.getElementById('vid-stability-1');
    let v2 = document.getElementById('vid-stability-2');

    switch(stabilityStep) {
        case 1:
            const titleContainer = document.getElementById('stability-title-container');
            gsap.to('#stability-main-title', { fontSize: '4rem', letterSpacing: '6px', duration: 1.2, ease: "power3.inOut" });
            if(titleContainer) gsap.to(titleContainer, { marginTop: '5vh', y: 0, duration: 1.2, ease: "power3.inOut" });
            setTimeout(() => { stabilityStep = 2; isTransitioning = false; }, 1200);
            break;

        case 2:
            gsap.to('#stability-sub-title', { opacity: 1, duration: 1, ease: "power2.inOut", onComplete: () => {
                stabilityStep = 3; isTransitioning = false;
            }});
            break;

        case 3:
            gsap.set('#stability-videos-container', { display: 'flex', opacity: 1 });
            gsap.set('.card-s1', { display: 'block', opacity: 0 });
           
            gsap.to('.card-s1', { opacity: 1, y: 0, duration: 1, ease: "power2.out", onComplete: () => {
                if (v1) { v1.muted = true; v1.play().catch(e=>{}); }
                stabilityStep = 4;
                isTransitioning = false;
            }});
            break;

        case 4:
            gsap.set('.card-s2', { display: 'block', opacity: 0 });
            gsap.to('.card-s2', { opacity: 1, y: 0, duration: 1, ease: "power2.out", onComplete: () => {
                if (v2) { v2.muted = true; v2.play().catch(e=>{}); }
                workshopState = 'STABILITY_SCENE_COMPLETE';
                isTransitioning = false;
            }});
            break;
    }
}

function transitionToMovementPage() {
    isTransitioning = true;
    updateTimelineNav(15);
    if(faderBlack) faderBlack.style.opacity = '1';
   
    setTimeout(() => {
        let sPage = document.getElementById('stability-page');
        if(sPage) sPage.classList.remove('active');
        let mPage = document.getElementById('movement-page');
        if(mPage) mPage.classList.add('active');
        if(faderBlack) faderBlack.style.opacity = '0';
        workshopState = 'PLAYING_MOVEMENT_STEPS';
        movementStep = 1;
        isTransitioning = false;
    }, 800);
}

function executeNextMovementSubStep() {
    isTransitioning = true;
    let v1 = document.getElementById('vid-mov-1');
    let v2 = document.getElementById('vid-mov-2');
    let v3 = document.getElementById('vid-mov-3');

    switch(movementStep) {
        case 1:
            const titleContainer = document.getElementById('movement-title-container');
            gsap.to('#movement-main-title', { fontSize: '4rem', letterSpacing: '6px', duration: 1.2, ease: "power3.inOut" });
            gsap.to('#movement-sub-title', { opacity: 1, duration: 1.2, ease: "power3.inOut" });
            if(titleContainer) gsap.to(titleContainer, { marginTop: '5vh', y: 0, duration: 1.2, ease: "power3.inOut" });
            setTimeout(() => { movementStep = 2; isTransitioning = false; }, 1200);
            break;
        case 2:
            gsap.set('.card-m1', { display: 'block', opacity: 0 });
            gsap.to('.card-m1', { opacity: 1, y: 0, duration: 1, ease: "back.out(1.2)", onComplete: () => {
                if (v1) { v1.muted = true; v1.play().catch(e=>{}); }
                movementStep = 3; isTransitioning = false;
            }});
            break;
        case 3:
            gsap.set('.card-m2', { display: 'block', opacity: 0 });
            gsap.to('.card-m2', { opacity: 1, y: 0, duration: 1, ease: "back.out(1.2)", onComplete: () => {
                if (v2) { v2.muted = true; v2.play().catch(e=>{}); }
                movementStep = 4; isTransitioning = false;
            }});
            break;
        case 4:
            gsap.set('.card-m3', { display: 'block', opacity: 0 });
            gsap.to('.card-m3', { opacity: 1, y: 0, duration: 1, ease: "back.out(1.2)", onComplete: () => {
                if (v3) { v3.muted = true; v3.play().catch(e=>{}); }
                workshopState = 'MOVEMENT_SCENE_COMPLETE'; isTransitioning = false;
            }});
            break;
    }
}

function transitionToSupportingPage() {
    isTransitioning = true;
    updateTimelineNav(16);
    if(faderBlack) faderBlack.style.opacity = '1';
   
    setTimeout(() => {
        let mPage = document.getElementById('movement-page');
        if(mPage) mPage.classList.remove('active');
        let supPage = document.getElementById('supporting-page');
        if(supPage) supPage.classList.add('active');
        if(faderBlack) faderBlack.style.opacity = '0';
        workshopState = 'PLAYING_SUPPORTING_STEPS';
        supportingStep = 1;
        isTransitioning = false;
    }, 800);
}

function executeNextSupportingSubStep() {
    isTransitioning = true;
    let v1 = document.getElementById('vid-sup-1');
    let v2 = document.getElementById('vid-sup-2');
    let v3 = document.getElementById('vid-sup-3');
    let v4 = document.getElementById('vid-sup-4');
    let v5 = document.getElementById('vid-sup-5');

    switch(supportingStep) {
        case 1:
            const titleContainer = document.getElementById('supporting-title-container');
            gsap.to('#supporting-main-title', { fontSize: '3.5rem', letterSpacing: '6px', duration: 1.2, ease: "power3.inOut" });
            gsap.to('#supporting-sub-title', { opacity: 1, duration: 1.2, ease: "power3.inOut" });
            if(titleContainer) gsap.to(titleContainer, { marginTop: '2vh', y: 0, duration: 1.2, ease: "power3.inOut" });
            setTimeout(() => { supportingStep = 2; isTransitioning = false; }, 1200);
            break;
        case 2:
            gsap.set('.card-sup1', { display: 'block', opacity: 0 });
            gsap.to('.card-sup1', { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", onComplete: () => {
                if (v1) { v1.muted = true; v1.play().catch(e=>{}); }
                supportingStep = 3; isTransitioning = false;
            }});
            break;
        case 3:
            gsap.set('.card-sup2', { display: 'block', opacity: 0 });
            gsap.to('.card-sup2', { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", onComplete: () => {
                if (v2) { v2.muted = true; v2.play().catch(e=>{}); }
                supportingStep = 4; isTransitioning = false;
            }});
            break;
        case 4:
            gsap.set('.card-sup3', { display: 'block', opacity: 0 });
            gsap.to('.card-sup3', { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", onComplete: () => {
                if (v3) { v3.muted = true; v3.play().catch(e=>{}); }
                supportingStep = 5; isTransitioning = false;
            }});
            break;
        case 5:
            gsap.set('.card-sup4', { display: 'block', opacity: 0 });
            gsap.to('.card-sup4', { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", onComplete: () => {
                if (v4) { v4.muted = true; v4.play().catch(e=>{}); }
                supportingStep = 6; isTransitioning = false;
            }});
            break;
        case 6:
            gsap.set('.card-sup5', { display: 'block', opacity: 0 });
            gsap.to('.card-sup5', { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", onComplete: () => {
                if (v5) { v5.muted = true; v5.play().catch(e=>{}); }
                workshopState = 'SUPPORTING_SCENE_COMPLETE'; isTransitioning = false;
            }});
            break;
    }
}

function transitionToCategoryIntro() {
    isTransitioning = true;
    updateTimelineNav(17);
    if(faderBlack) faderBlack.style.opacity = '1';
   
    setTimeout(() => {
        let sPage = document.getElementById('supporting-page');
        if(sPage) sPage.classList.remove('active');
        let cPage = document.getElementById('category-page');
        if(cPage) cPage.classList.add('active');
        if(faderBlack) faderBlack.style.opacity = '0';
        workshopState = 'FINISHED_CATEGORY_INTRO';
        isTransitioning = false;
    }, 800);
}
function launchNavigationSystemNode() {
    // Prevent overlapping triggers
    if (isTransitioning) return;
    isTransitioning = true;
   
    // Play transition sound effect if active
   // Ensure this block exists at the bottom of script.js to wire your navigation node:
const navBtn = document.getElementById('map-node-navigation'); // Make sure this matches your map button HTML ID!
if (navBtn) {
    navBtn.addEventListener('click', launchNode2);
}

    // 1. Flash the black screen transition layer
    if (faderBlack) faderBlack.style.opacity = '1';
   
    setTimeout(() => {
        // 2. Erase the map page classes and launch Step 22 (Navigation Intro)
        jumpToSection(22);
        updateTimelineNav(22);
       
        if (faderBlack) faderBlack.style.opacity = '0';
        isTransitioning = false;
       
        // 3. Update the state machine context to prime the subsea nav presentation
        workshopState = 'NAV_INTRO_ACTIVE';
    }, 600);
}

// Ensure this function is bound to your HTML map button node via an event listener:
const navNodeBtn = document.getElementById('map-node-navigation'); // Check your exact HTML ID here
if (navNodeBtn) {
    navNodeBtn.addEventListener('click', launchNavigationSystemNode);
}

// ==========================================
// NEW NAVIGATION SYSTEM LOGIC FLOW
// ==========================================

function transitionToNavTopics() {
    isTransitioning = true;
    updateTimelineNav(23);
    if(faderBlack) faderBlack.style.opacity = '1';
   
    setTimeout(() => {
        let iPage = document.getElementById('nav-intro-page');
        if(iPage) iPage.classList.remove('active');
        let tPage = document.getElementById('nav-topics-page');
        if(tPage) tPage.classList.add('active');
        if(faderBlack) faderBlack.style.opacity = '0';
       
        gsap.to('.nav-topic-line', {
            opacity: 1, y: 0, duration: 1, stagger: 0.3, ease: "power2.out",
            onComplete: () => {
                workshopState = 'NAV_TOPICS_DONE';
                isTransitioning = false;
            }
        });
    }, 800);
}

function transitionToDeadReckoningTitle() {
    isTransitioning = true;
    updateTimelineNav(24);
    if(faderBlack) faderBlack.style.opacity = '1';
   
    setTimeout(() => {
        let nPage = document.getElementById('nav-topics-page');
        if(nPage) nPage.classList.remove('active');
        let dPage = document.getElementById('dead-reckoning-page');
        if(dPage) dPage.classList.add('active');
        if(faderBlack) faderBlack.style.opacity = '0';
       
        gsap.set('#title-dr', { clearProps: "all" });
        workshopState = 'DEAD_RECKONING_TITLE';
        isTransitioning = false;
    }, 800);
}

function playDeadReckoningVideo() {
    isTransitioning = true;
    let vid = document.getElementById('vid-dead-reckoning');
   
    gsap.to('#title-dr', { top: '12%', left: '50%', xPercent: -50, fontSize: '2.5rem', duration: 1.5, ease: "power3.inOut" });
   
    if (vid) {
        vid.muted = true;
        vid.loop = true;
        vid.currentTime = 0;
        let p = vid.play();
        if (p !== undefined) p.catch(e => console.log(e));
    }
   
    setTimeout(() => {
        workshopState = 'DEAD_RECKONING_LOOPING';
        isTransitioning = false;
    }, 1500);
}

function transitionToINSTitle() {
    isTransitioning = true;
    updateTimelineNav(25);
    if(faderBlack) faderBlack.style.opacity = '1';
   
    setTimeout(() => {
        let dPage = document.getElementById('dead-reckoning-page');
        if(dPage) dPage.classList.remove('active');
        let oldVid = document.getElementById('vid-dead-reckoning');
        if(oldVid) oldVid.pause();
       
        let iPage = document.getElementById('ins-page');
        if(iPage) iPage.classList.add('active');
        if(faderBlack) faderBlack.style.opacity = '0';
       
        gsap.set('#title-ins', { clearProps: "all" });
        workshopState = 'INS_TITLE';
        isTransitioning = false;
    }, 800);
}

function playINSVideo() {
    isTransitioning = true;
    let vid = document.getElementById('vid-ins');
   
    gsap.to('#title-ins', { top: '12%', left: '50%', xPercent: -50, fontSize: '2.5rem', duration: 1.5, ease: "power3.inOut" });
   
    if (vid) {
        vid.muted = true;
        vid.loop = true;
        vid.currentTime = 0;
        let p = vid.play();
        if (p !== undefined) p.catch(e => console.log(e));
    }
   
    setTimeout(() => {
        workshopState = 'INS_LOOPING';
        isTransitioning = false;
    }, 1500);
}

function transitionToDVLTitle() {
    isTransitioning = true;
    updateTimelineNav(26);
    if(faderBlack) faderBlack.style.opacity = '1';
   
    setTimeout(() => {
        let iPage = document.getElementById('ins-page');
        if(iPage) iPage.classList.remove('active');
        let oldVid = document.getElementById('vid-ins');
        if(oldVid) oldVid.pause();
       
        let dPage = document.getElementById('dvl-page');
        if(dPage) dPage.classList.add('active');
        if(faderBlack) faderBlack.style.opacity = '0';
       
        gsap.set('#title-dvl', { clearProps: "all" });
        workshopState = 'DVL_TITLE';
        isTransitioning = false;
    }, 800);
}

function playDVLVideo() {
    isTransitioning = true;
    let vid = document.getElementById('vid-dvl');
   
    gsap.to('#title-dvl', { top: '12%', left: '50%', xPercent: -50, fontSize: '2.5rem', duration: 1.5, ease: "power3.inOut" });
   
    if (vid) {
        vid.muted = true;
        vid.loop = true;
        vid.currentTime = 0;
        let p = vid.play();
        if (p !== undefined) p.catch(e => console.log(e));
    }
   
    setTimeout(() => {
        workshopState = 'DVL_LOOPING';
        isTransitioning = false;
    }, 1500);
}

function transitionToAcousticTitle() {
    isTransitioning = true;
    updateTimelineNav(27);
    if(faderBlack) faderBlack.style.opacity = '1';
   
    setTimeout(() => {
        let dPage = document.getElementById('dvl-page');
        if(dPage) dPage.classList.remove('active');
        let oldVid = document.getElementById('vid-dvl');
        if(oldVid) oldVid.pause();
       
        let aPage = document.getElementById('acoustic-page');
        if(aPage) aPage.classList.add('active');
        if(faderBlack) faderBlack.style.opacity = '0';
       
        gsap.set('#title-acoustic', { clearProps: "all" });
        workshopState = 'ACOUSTIC_TITLE';
        isTransitioning = false;
    }, 800);
}

function playAcousticVideo() {
    isTransitioning = true;
    let vid = document.getElementById('vid-acoustic');
   
    gsap.to('#title-acoustic', { top: '12%', left: '50%', xPercent: -50, fontSize: '2.5rem', duration: 1.5, ease: "power3.inOut" });
   
    if (vid) {
        vid.muted = true;
        vid.loop = true;
        vid.currentTime = 0;
        let p = vid.play();
        if (p !== undefined) p.catch(e => console.log(e));
    }
   
    setTimeout(() => {
        workshopState = 'ACOUSTIC_LOOPING';
        isTransitioning = false;
    }, 1500);
}

function revealBaselineMatrix() {
    isTransitioning = true;
    updateTimelineNav(28);
   
    gsap.to('#acoustic-blur-overlay', { opacity: 1, pointerEvents: 'auto', duration: 1, ease: "power2.inOut" });
   
    gsap.set('#baseline-matrix', { display: 'flex' });
    gsap.set('.card-lbl, .card-sbl, .card-usbl', { opacity: 0, y: 40, display: 'flex' });
   
    gsap.to('.card-lbl, .card-sbl, .card-usbl', {
        opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "back.out(1.2)", delay: 0.5,
        onComplete: () => {
            workshopState = 'BASELINE_MATRIX';
            isTransitioning = false;
        }
    });
}

function transitionToSensorFusionTitle() {
    isTransitioning = true;
    updateTimelineNav(29);
    if(faderBlack) faderBlack.style.opacity = '1';
   
    setTimeout(() => {
        let aPage = document.getElementById('acoustic-page');
        if(aPage) aPage.classList.remove('active');
       
        let sfPage = document.getElementById('sensor-fusion-page');
        if(sfPage) sfPage.classList.add('active');
        if(faderBlack) faderBlack.style.opacity = '0';
       
        gsap.set('#title-sensor-fusion', { clearProps: "all" });
        workshopState = 'SENSOR_FUSION_TITLE';
        isTransitioning = false;
    }, 800);
}

function playSensorFusionVideo() {
    isTransitioning = true;
    let vid = document.getElementById('vid-sensor-fusion');
   
    gsap.to('#title-sensor-fusion', { top: '85%', left: '50%', xPercent: -50, fontSize: '2.5rem', duration: 1.5, ease: "power3.inOut" });
   
    if (vid) {
        vid.muted = true;
        vid.loop = true;
        vid.currentTime = 0;
        let p = vid.play();
        if (p !== undefined) p.catch(e => console.log(e));
    }
   
    setTimeout(() => {
        workshopState = 'SENSOR_FUSION_LOOPING';
        isTransitioning = false;
    }, 1500);
}

function transitionToAutonomousNavTitle() {
    isTransitioning = true;
    updateTimelineNav(30);
    if(faderBlack) faderBlack.style.opacity = '1';
   
    setTimeout(() => {
        let sfPage = document.getElementById('sensor-fusion-page');
        if(sfPage) sfPage.classList.remove('active');
        let oldVid = document.getElementById('vid-sensor-fusion');
        if(oldVid) oldVid.pause();
       
        let anPage = document.getElementById('autonomous-nav-page');
        if(anPage) anPage.classList.add('active');
        if(faderBlack) faderBlack.style.opacity = '0';
       
        gsap.set('#title-autonomous-nav', { clearProps: "all" });
        workshopState = 'AUTONOMOUS_NAV_TITLE';
        isTransitioning = false;
    }, 800);
}

function playAutonomousNavVideo() {
    isTransitioning = true;
    let vid = document.getElementById('vid-autonomous-nav');
   
    gsap.to('#title-autonomous-nav', { top: '12%', left: '50%', xPercent: -50, fontSize: '2.5rem', duration: 1.5, ease: "power3.inOut" });
   
    if (vid) {
        vid.muted = true;
        vid.loop = true;
        vid.currentTime = 0;
        let p = vid.play();
        if (p !== undefined) p.catch(e => console.log(e));
    }
   
    setTimeout(() => {
        workshopState = 'AUTONOMOUS_NAV_LOOPING';
        isTransitioning = false;
    }, 1500);
}

// ==========================================
// BUBBLES GRAPHICS AMBIENCE ENGINE & INIT
// ==========================================
const canvas = document.getElementById('bubble-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    const bubbles = [];

    function resizeCanvas() { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    for (let i = 0; i < 100; i++) bubbles.push({ x: Math.random() * width, y: Math.random() * height, radius: Math.random() * 3 + 1, speed: Math.random() * 2 + 0.5, sway: Math.random() * 0.05 });

    function animateBubbles() {
        ctx.clearRect(0, 0, width, height); ctx.fillStyle = 'rgba(150, 230, 255, 0.4)';
        bubbles.forEach((b, index) => {
            b.y -= b.speed; b.x += Math.sin(Date.now() * b.sway + index) * 0.5;
            if (b.y < -10) b.y = height + 10;
            ctx.beginPath(); ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2); ctx.fill();
        });
        requestAnimationFrame(animateBubbles);
    }
    animateBubbles();
}

function startLandingPageSequence() {
    const tl = gsap.timeline();
    const impactAudio = document.getElementById('impact-sound');
    tl.to('.light-rays', { opacity: 0.7, duration: 2 }, 0.5)
      .to('#aquaman-img', { opacity: 1, y: 0, xPercent: -50, duration: 1.5, ease: "power3.out" }, 1.0)
      .to('#aquaman-img', { filter: "drop-shadow(0px 0px 50px rgba(0, 255, 255, 0.7))", duration: 1 }, 2.0)
      .to('#cinematic-container', { x: -10, y: 8, duration: 0.05, yoyo: true, repeat: 5 }, 3.0)
      .call(() => { if(impactAudio && !globalMuted) impactAudio.play().catch(e=>{}); }, null, 3.2)
      .to('#text-container', { opacity: 1, y: 0, duration: 1.5, ease: "power4.out" }, 3.5)
      .to('#begin-btn', { opacity: 1, y: 0, duration: 1 }, 4.5);
}

if (document.getElementById('aquaman-img')) {
    Draggable.create("#aquaman-img", { type: "x,y", edgeResistance: 0.65, bounds: "#cinematic-container" });
}

const beginBtn = document.getElementById('begin-btn');
if (beginBtn) {
    beginBtn.addEventListener('click', () => {
        isTransitioning = true;
        updateTimelineNav(3);
        gsap.to(['#text-container', '#begin-btn', '#aquaman-img'], { opacity: 0, duration: 1 });
       
        gsap.to('#cinematic-container', {
            scale: 3, opacity: 0, duration: 1.5, ease: "power2.in", delay: 0.5,
            onComplete: () => {
                let lPage = document.getElementById('landing-page');
                if(lPage) lPage.classList.remove('active');
                let aPage = document.getElementById('agenda-page');
                if(aPage) aPage.classList.add('active');
                let vidAgenda = document.getElementById('vid-agenda');
                if(vidAgenda) {
                    vidAgenda.muted = true;
                    vidAgenda.playbackRate = 0.5; vidAgenda.play().catch(e => console.log(e));
                    vidAgenda.onended = () => {
                        gsap.to('#agenda-overlay', {opacity: 1, duration: 1});
                        workshopState = 'FINISHED_AGENDA';
                    };
                } else {
                    workshopState = 'FINISHED_AGENDA';
                }
                isTransitioning = false;
            }
        });
    });
}