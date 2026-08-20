/* ==========================================================================
   ROMANTIC BIRTHDAY SURPRISE — APPLICATION CONFIGURATION & LOGIC
   ========================================================================== */

/**
 * ==========================================================================
 * EASY CONFIGURATION AREA
 * Edit your personalized answers, text, love letter, and media items here!
 * ==========================================================================
 */
const CONFIG = {
    // Secret Access Passcode
    passcode: "723254",

    // Girlfriend's name (case-insensitive)
    girlfriendName: "Sadalika",

    // Her panda's name (case-insensitive)
    pandaName: "Bubu",

    // First letter of your name (case-insensitive)
    hisNameLetter: "A",

    // Main birthday celebration header message
    birthdayMessage: "<span class=\"title-main\">Happy Birthday My Love...</span><br><span class=\"title-sub\">i love you more than my world 🌍💕😘🫶</span>",

    // Path to background music file
    music: "assets/musics/looplove.mp3?v=2.0",

    // Love Letter text content
    // Replace "MY_LOVE_LETTER_HERE" or edit the string below to insert your own letter
    loveLetter: `Love Youu Pinkyyy 💕

Happy Birthday to the most wonderful, adorable, and special person in my whole world! 🐼💗

From the very first moment you walked into my life, every day has become sweeter, happier, and filled with so much magic. Your beautiful smile, your warm loving heart, and your cute panda energy bring so much light into my life. ✨💕

This secret little surprise is just a tiny token of how deeply I treasure you. I built this special place so you will always have a reminder of how much you are loved and cherished — today, tomorrow, and forever. ❤️

Thank you for being my dream come true, my best friend, and my panda forever. 🐼💗

I wish you a birthday filled with endless laughter, gentle hugs, delicious treats, beautiful memories, and all the love in the universe! 🎂✨💕

Forever & Always Yours,
Your Bubu ❤️`,

    // Multi-Step Question Configuration
    questions: [
        {
            id: 1,
            question: "What is your name? 💕",
            answer: ["sadalika", "tharushi", "jayasinghe"],
            errorMsg: "Hmmmm... try again pandoo 🥺💕",
            pandaEmoji: "🐼"
        },
        {
            id: 2,
            question: "What is your panda's name? 🐼💗",
            answer: "Bubu",
            errorMsg: "Are you sure you're my panda? 🥺🐼",
            pandaEmoji: "🐼💖"
        },
        {
            id: 3,
            question: "What is the first letter of the name of the person you love most in the world? 💕",
            answer: "A",
            errorMsg: "One last little thought... try again 🥺💕",
            pandaEmoji: "🐼🥰"
        }
    ],

    // Memory Gallery Configuration (Photos & Videos)
    memories: [
        {
            type: "image",
            src: "assets/photos/photo1.png",
            caption: "Our happy moments together ❤️"
        },
        {
            type: "image",
            src: "assets/photos/photo2.jpeg",
            caption: "That sweet, beautiful smile 💕"
        },
        {
            type: "image",
            src: "assets/photos/photo3.jpeg",
            caption: "Making memories together 💖"
        },
        {
            type: "image",
            src: "assets/photos/photo4.jpeg",
            caption: "Forever & Always 💕"
        }
    ]
};


/* ==========================================================================
   STATE MANAGEMENT & DOM ELEMENTS
   ========================================================================== */

let currentQuestionIndex = 0;
let savedScrollPosition = 0;
let isAudioPlaying = false;
let audioContext = null;
let fallbackAudioTimer = null;
let bgAudio = null;

// DOM Selectors
const elements = {
    particleCanvas: document.getElementById('particle-canvas'),
    confettiCanvas: document.getElementById('confetti-canvas'),
    musicControl: document.getElementById('music-control'),
    musicIcon: document.getElementById('music-icon'),

    // Passcode Gate Elements
    stepPasscode: document.getElementById('step-passcode'),
    passcodeCard: document.getElementById('passcode-card'),
    passcodeError: document.getElementById('passcode-error'),
    passcodeErrorText: document.getElementById('passcode-error-text'),
    pinDots: [
        document.getElementById('pin-dot-0'),
        document.getElementById('pin-dot-1'),
        document.getElementById('pin-dot-2'),
        document.getElementById('pin-dot-3'),
        document.getElementById('pin-dot-4'),
        document.getElementById('pin-dot-5')
    ],

    // Intro Elements
    stepIntro: document.getElementById('step-intro'),
    introSpeechBubble: document.getElementById('intro-speech-bubble'),
    speechText: document.getElementById('speech-text'),
    introHeartWidget: document.getElementById('intro-heart-widget'),
    liquidFillRect: document.getElementById('liquid-fill-rect'),
    liquidWave: document.getElementById('liquid-wave'),
    unlockedBadge: document.getElementById('unlocked-badge'),
    introPandaWrapper: document.getElementById('intro-panda-wrapper'),
    introHoldContainer: document.getElementById('intro-hold-container'),
    btnHoldEnter: document.getElementById('btn-hold-enter'),
    btnHoldFill: document.getElementById('btn-hold-fill'),

    // Steps
    stepWelcome: document.getElementById('step-welcome'),
    stepQuestions: document.getElementById('step-questions'),
    stepCelebration: document.getElementById('step-celebration'),
    stepLetter: document.getElementById('step-letter'),
    stepPandaGateway: document.getElementById('step-panda-gateway'),
    stepGallery: document.getElementById('step-gallery'),

    // Welcome
    btnStart: document.getElementById('btn-start'),

    // Questions
    questionCard: document.getElementById('question-card'),
    questionProgressText: document.getElementById('question-progress-text'),
    questionTitle: document.getElementById('question-title'),
    questionForm: document.getElementById('question-form'),
    answerInput: document.getElementById('answer-input'),
    btnSubmitAnswer: document.getElementById('btn-submit-answer'),
    errorMessage: document.getElementById('error-message'),
    errorText: document.getElementById('error-text'),
    pandaEmoji: document.getElementById('panda-emoji'),
    dots: [document.getElementById('dot-1'), document.getElementById('dot-2'), document.getElementById('dot-3')],

    // Celebration
    celebrationTitle: document.getElementById('celebration-title'),
    btnOpenHeart: document.getElementById('btn-open-heart'),

    // Letter
    letterHeading: document.getElementById('letter-heading'),
    letterContent: document.getElementById('letter-content'),
    btnContinueMemories: document.getElementById('btn-continue-memories'),

    // Panda Gateway
    interactivePanda: document.getElementById('interactive-panda'),
    clickMeBoard: document.getElementById('click-me-board'),

    // Gallery & Lightbox
    memoriesGrid: document.getElementById('memories-grid'),
    lightboxModal: document.getElementById('lightbox-modal'),
    lightboxOverlay: document.getElementById('lightbox-overlay'),
    lightboxClose: document.getElementById('lightbox-close'),
    lightboxImg: document.getElementById('lightbox-img'),
    lightboxVideo: document.getElementById('lightbox-video'),
    lightboxVideoSrc: document.getElementById('lightbox-video-src'),
    lightboxCaption: document.getElementById('lightbox-caption')
};


/* ==========================================================================
   INITIALIZATION
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initAudioEngine();
    initParticleCanvas();
    setupEventListeners();
    populateLetterContent();
    initPasscodeGate();
});


/* ==========================================================================
   AUDIO ENGINE (Audio File + Web Audio Fallback)
   ========================================================================== */

function initAudioEngine() {
    bgAudio = new Audio();
    bgAudio.src = CONFIG.music;
    bgAudio.loop = true;
    bgAudio.preload = "auto";

    // Handle music control tap
    elements.musicControl.addEventListener('click', toggleAudio);

    // Audio error handling: fallback to synthesized ambient synth tune if asset file isn't present
    bgAudio.addEventListener('error', () => {
        console.log('Local MP3 not found. Web Audio synthesizer fallback active.');
    });
}

function triggerPandaWrongAnimation() {
    const panda = elements.introPandaWrapper || document.querySelector('.question-panda-box');
    if (panda) {
        panda.classList.remove('panda-correct');
        void panda.offsetWidth;
        panda.classList.add('panda-wrong');
        setTimeout(() => panda.classList.remove('panda-wrong'), 800);
    }
}

function triggerPandaCorrectAnimation() {
    const panda = elements.introPandaWrapper || document.querySelector('.question-panda-box');
    if (panda) {
        panda.classList.remove('panda-wrong');
        void panda.offsetWidth;
        panda.classList.add('panda-correct');
        setTimeout(() => panda.classList.remove('panda-correct'), 1000);
    }
}

function startAudio() {
    if (isAudioPlaying) return;

    elements.musicControl.classList.remove('hidden');

    bgAudio.play().then(() => {
        isAudioPlaying = true;
        elements.musicControl.classList.remove('paused');
    }).catch(err => {
        console.log('Browser audio play deferred or fallback active:', err);
        startFallbackAudioSynthesizer();
        isAudioPlaying = true;
        elements.musicControl.classList.remove('paused');
    });
}

function toggleAudio() {
    if (isAudioPlaying) {
        pauseAudio();
    } else {
        startAudio();
    }
}

function pauseAudio() {
    if (bgAudio) bgAudio.pause();
    if (fallbackAudioTimer) clearInterval(fallbackAudioTimer);
    isAudioPlaying = false;
    elements.musicControl.classList.add('paused');
}

// Fallback synth tune generator using Web Audio API
function startFallbackAudioSynthesizer() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!audioContext) audioContext = new AudioContext();
        if (audioContext.state === 'suspended') audioContext.resume();

        const notes = [261.63, 329.63, 392.00, 523.25, 440.00, 349.23]; // C4, E4, G4, C5, A4, F4
        let noteIdx = 0;

        if (fallbackAudioTimer) clearInterval(fallbackAudioTimer);

        fallbackAudioTimer = setInterval(() => {
            if (!isAudioPlaying) return;
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(notes[noteIdx % notes.length], audioContext.currentTime);

            gain.gain.setValueAtTime(0.08, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1.8);

            osc.connect(gain);
            gain.connect(audioContext.destination);

            osc.start();
            osc.stop(audioContext.currentTime + 2);
            noteIdx++;
        }, 1200);
    } catch (e) {
        console.log('Web Audio API not supported', e);
    }
}


/* ==========================================================================
   PARTICLE CANVAS (Floating Hearts & Sparkles)
   ========================================================================== */

function initParticleCanvas() {
    const canvas = elements.particleCanvas;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const maxParticles = 28;

    class HeartParticle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = height + 20;
            this.size = Math.random() * 12 + 8;
            this.speedY = Math.random() * 1.2 + 0.6;
            this.speedX = Math.sin(Math.random() * Math.PI) * 0.8;
            this.opacity = Math.random() * 0.5 + 0.3;
            this.color = Math.random() > 0.5 ? '#FF6F91' : '#FFB7C5';
            this.angle = Math.random() * 360;
        }

        update() {
            this.y -= this.speedY;
            this.x += Math.sin(this.y / 30) * 0.6;
            if (this.y < -20) this.reset();
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;

            // Draw Heart Shape
            ctx.beginPath();
            const topCurveHeight = this.size * 0.3;
            ctx.moveTo(0, topCurveHeight);
            ctx.bezierCurveTo(0, 0, -this.size / 2, 0, -this.size / 2, topCurveHeight);
            ctx.bezierCurveTo(-this.size / 2, (this.size + topCurveHeight) / 2, 0, this.size, 0, this.size);
            ctx.bezierCurveTo(0, this.size, this.size / 2, (this.size + topCurveHeight) / 2, this.size / 2, topCurveHeight);
            ctx.bezierCurveTo(this.size / 2, 0, 0, 0, 0, topCurveHeight);
            ctx.closePath();
            ctx.fill();

            ctx.restore();
        }
    }

    for (let i = 0; i < maxParticles; i++) {
        particles.push(new HeartParticle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    animate();
}


/* ==========================================================================
   CONFETTI CELEBRATION ENGINE
   ========================================================================== */

function triggerConfetti() {
    const canvas = elements.confettiCanvas;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ['#FF4F81', '#FF6F91', '#FFD700', '#FFB7C5', '#FFFFFF', '#FF8CA3'];

    for (let i = 0; i < 120; i++) {
        pieces.push({
            x: Math.random() * width,
            y: Math.random() * height - height,
            size: Math.random() * 10 + 6,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedY: Math.random() * 3 + 2,
            speedX: Math.random() * 2 - 1,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 6 - 3
        });
    }

    let animationFrame;
    function render() {
        ctx.clearRect(0, 0, width, height);
        let activePieces = 0;

        pieces.forEach(p => {
            p.y += p.speedY;
            p.x += p.speedX;
            p.rotation += p.rotationSpeed;

            if (p.y < height) activePieces++;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();
        });

        if (activePieces > 0) {
            animationFrame = requestAnimationFrame(render);
        } else {
            ctx.clearRect(0, 0, width, height);
            cancelAnimationFrame(animationFrame);
        }
    }

    render();
}


/* ==========================================================================
   STEP NAVIGATION & EVENT LISTENERS
   ========================================================================== */

function setupEventListeners() {
    // Step 1 Welcome -> Questions
    elements.btnStart.addEventListener('click', () => {
        startAudio();
        showStep(elements.stepWelcome, elements.stepQuestions);
        loadQuestion(0);
    });

    // Step 2 Question Submit Form
    elements.questionForm.addEventListener('submit', handleAnswerSubmit);

    // Step 3 Celebration -> Love Letter
    elements.btnOpenHeart.addEventListener('click', () => {
        showStep(elements.stepCelebration, elements.stepLetter);
    });

    // Step 4 Love Letter -> Panda Gateway
    elements.btnContinueMemories.addEventListener('click', () => {
        showStep(elements.stepLetter, elements.stepPandaGateway);
    });

    // Step 5 Interactive Panda Gateway -> Memory Gallery
    elements.interactivePanda.addEventListener('click', handlePandaTap);

    // Lightbox Controls
    elements.lightboxClose.addEventListener('click', closeLightbox);
    elements.lightboxOverlay.addEventListener('click', closeLightbox);
}

function showStep(fromSection, toSection) {
    fromSection.classList.remove('active');
    fromSection.classList.add('hidden');

    toSection.classList.remove('hidden');
    // Trigger browser layout before adding active class for CSS transition
    void toSection.offsetWidth;
    toSection.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}


/* ==========================================================================
   QUESTION & ANSWER LOGIC
   ========================================================================== */

function loadQuestion(index) {
    currentQuestionIndex = index;
    const qData = CONFIG.questions[index];

    // Reset Form UI
    elements.answerInput.value = '';
    elements.errorMessage.classList.add('hidden');
    elements.questionCard.classList.remove('shake-card');

    // Update Progress Indicator
    elements.questionProgressText.textContent = `Question ${index + 1} of 3`;
    elements.dots.forEach((dot, i) => {
        if (i === index) dot.classList.add('active');
        else dot.classList.remove('active');
    });

    // Update Title & Emoji
    elements.questionTitle.textContent = qData.question;
    if (elements.pandaEmoji) elements.pandaEmoji.textContent = qData.pandaEmoji;

    // Ensure eating panda GIF loops continuously on step load
    const eatingPandaImg = document.getElementById('eating-panda-img');
    if (eatingPandaImg) {
        eatingPandaImg.src = 'assets/panda/eating_panda.gif?' + new Date().getTime();
    }

    setTimeout(() => {
        elements.answerInput.focus();
    }, 300);
}

function handleAnswerSubmit(e) {
    if (e) e.preventDefault();

    const userInput = elements.answerInput.value.trim().toLowerCase();
    const currentQData = CONFIG.questions[currentQuestionIndex];

    let isCorrect = false;
    if (Array.isArray(currentQData.answer)) {
        isCorrect = currentQData.answer.some(ans => userInput.includes(ans.toLowerCase().trim()));
    } else {
        isCorrect = userInput === currentQData.answer.trim().toLowerCase();
    }

    if (isCorrect) {
        // Correct Answer
        elements.errorMessage.classList.add('hidden');
        elements.answerInput.blur();

        if (currentQuestionIndex < CONFIG.questions.length - 1) {
            // Success micro-feedback
            triggerPandaCorrectAnimation();

            elements.questionCard.style.transform = "scale(1.03)";
            setTimeout(() => {
                elements.questionCard.style.transform = "scale(1)";
                loadQuestion(currentQuestionIndex + 1);
            }, 300);
        } else {
            // Final Answer Correct -> Unlock Birthday Celebration
            triggerPandaCorrectAnimation();
            triggerConfetti();
            elements.celebrationTitle.innerHTML = CONFIG.birthdayMessage;
            showStep(elements.stepQuestions, elements.stepCelebration);
        }
    } else {
        // Incorrect Answer -> Shake animation & show error toast
        triggerPandaWrongAnimation();

        elements.errorText.textContent = currentQData.errorMsg;
        elements.errorMessage.classList.remove('hidden');

        elements.questionCard.classList.remove('shake-card');
        void elements.questionCard.offsetWidth; // Reflow
        elements.questionCard.classList.add('shake-card');

        elements.answerInput.focus();
        elements.answerInput.select();
    }
}


/* ==========================================================================
   LOVE LETTER POPULATION
   ========================================================================== */

function populateLetterContent() {
    elements.letterHeading.textContent = `To My ${CONFIG.girlfriendName} 💕`;
    elements.letterContent.textContent = CONFIG.loveLetter;
}


/* ==========================================================================
   INTERACTIVE PANDA GATEWAY
   ========================================================================== */

function handlePandaTap() {
    // Panda tap animation
    elements.interactivePanda.style.transform = "scale(1.2) rotate(5deg)";

    // Heart burst effect
    triggerConfetti();

    setTimeout(() => {
        elements.interactivePanda.style.transform = "scale(1) rotate(0deg)";
        renderGallery();
        showStep(elements.stepPandaGateway, elements.stepGallery);
    }, 400);
}


/* ==========================================================================
   MEMORY GALLERY & LIGHTBOX VIEWER
   ========================================================================== */

function renderGallery() {
    const grid = elements.memoriesGrid;
    grid.innerHTML = '';

    CONFIG.memories.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');

        const thumbWrapper = document.createElement('div');
        thumbWrapper.className = 'media-thumb-wrapper';

        if (item.type === 'video') {
            const videoElement = document.createElement('video');
            videoElement.src = item.src;
            videoElement.className = 'memory-thumb';
            videoElement.muted = true;
            videoElement.preload = "metadata";

            const videoBadge = document.createElement('div');
            videoBadge.className = 'video-badge';
            videoBadge.innerHTML = '▶';

            thumbWrapper.appendChild(videoElement);
            thumbWrapper.appendChild(videoBadge);
        } else {
            const imgElement = document.createElement('img');
            imgElement.src = item.src;
            imgElement.alt = item.caption || 'Memory photo';
            imgElement.className = 'memory-thumb';
            imgElement.loading = 'lazy';

            // Fallback sample visual if photo file is not found
            imgElement.onerror = () => {
                imgElement.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="375" viewBox="0 0 300 375"><rect width="300" height="375" fill="%23FFE3E8"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="42" fill="%23FF4F81">🐼💖</text><text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="%234A2732">Our Memory ${index + 1}</text></svg>`;
            };

            thumbWrapper.appendChild(imgElement);
        }

        const caption = document.createElement('div');
        caption.className = 'card-caption';
        caption.textContent = item.caption || 'Our Precious Moment ❤️';

        card.appendChild(thumbWrapper);
        card.appendChild(caption);

        card.addEventListener('click', () => openLightbox(item));

        grid.appendChild(card);
    });
}

function openLightbox(item) {
    savedScrollPosition = window.scrollY;

    elements.lightboxImg.classList.add('hidden');
    elements.lightboxVideo.classList.add('hidden');
    elements.lightboxVideo.pause();

    if (item.type === 'video') {
        elements.lightboxVideoSrc.src = item.src;
        elements.lightboxVideo.load();
        elements.lightboxVideo.classList.remove('hidden');
        elements.lightboxVideo.play().catch(e => console.log('Autoplay blocked', e));
    } else {
        elements.lightboxImg.src = item.src;
        elements.lightboxImg.onerror = () => {
            elements.lightboxImg.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750"><rect width="600" height="750" fill="%23FFE3E8"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="70" fill="%23FF4F81">🐼💖</text><text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" font-weight="bold" fill="%234A2732">${encodeURIComponent(item.caption || 'Our Memory')}</text></svg>`;
        };
        elements.lightboxImg.classList.remove('hidden');
    }

    elements.lightboxCaption.textContent = item.caption || '';
    elements.lightboxModal.classList.remove('hidden');
    elements.lightboxModal.setAttribute('aria-hidden', 'false');
}

function closeLightbox() {
    elements.lightboxVideo.pause();
    elements.lightboxModal.classList.add('hidden');
    elements.lightboxModal.setAttribute('aria-hidden', 'true');
    window.scrollTo(0, savedScrollPosition);
}


/* ==========================================================================
   CINEMATIC INTRO SEQUENCE (WALK -> JUMP -> GREETING -> HOLD TO ENTER)
   ========================================================================== */

let isHolding = false;
let holdStartTime = 0;
let holdAnimationFrame = null;
let isIntroCompleted = false;

function startIntro() {
    isIntroCompleted = false;
    if (elements.introSpeechBubble) elements.introSpeechBubble.classList.add('hidden');
    if (elements.introHeartWidget) elements.introHeartWidget.classList.add('hidden');
    if (elements.introHoldContainer) elements.introHoldContainer.classList.add('hidden');
    if (elements.unlockedBadge) elements.unlockedBadge.classList.add('hidden');

    updateHeartProgress(0);
    startPandaWalk();
}

// Scene 1: Panda Walking Across Screen
function startPandaWalk() {
    const panda = elements.introPandaWrapper;
    if (!panda) return;

    panda.className = 'intro-panda-wrapper panda-walking-anim';

    let startTime = null;
    const walkDuration = 2200;

    function animateWalk(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min(1, (timestamp - startTime) / walkDuration);

        const startX = -120;
        const endX = window.innerWidth > 500 ? 100 : (window.innerWidth / 2 - 60);
        const currentX = startX + (endX - startX) * progress;

        panda.style.transform = `translateX(${currentX}px)`;

        if (progress < 1) {
            requestAnimationFrame(animateWalk);
        } else {
            setTimeout(() => {
                startPandaJump();
            }, 300);
        }
    }

    requestAnimationFrame(animateWalk);
}

// Scene 2: Panda Jump to Center
function startPandaJump() {
    const panda = elements.introPandaWrapper;
    if (!panda) return;

    panda.className = 'intro-panda-wrapper panda-jumping-anim';
    panda.style.transform = `translateX(0px)`;

    setTimeout(() => {
        triggerConfetti();
        showPandaGreeting();
    }, 700);
}

// Scene 3: Panda Speech Bubble Greetings
function showPandaGreeting() {
    const bubble = elements.introSpeechBubble;
    const textEl = elements.speechText;
    if (!bubble || !textEl) return;

    bubble.classList.remove('hidden');
    textEl.textContent = "Hi i am bubu! 🐼💕";

    setTimeout(() => {
        textEl.textContent = "I have a little surprise for you... 💗";

        setTimeout(() => {
            textEl.textContent = "But first, you have to do something for me 👀";

            setTimeout(() => {
                if (elements.introHeartWidget) elements.introHeartWidget.classList.remove('hidden');
                if (elements.introHoldContainer) elements.introHoldContainer.classList.remove('hidden');
                initHoldInteraction();
            }, 1200);

        }, 1400);

    }, 1200);
}

// Scene 4 & 5: Press & Hold Interaction with Liquid Heart Fill
function initHoldInteraction() {
    const btn = elements.btnHoldEnter;
    if (!btn) return;

    btn.addEventListener('pointerdown', handleHoldStart);
    btn.addEventListener('pointerup', handleHoldEnd);
    btn.addEventListener('pointercancel', handleHoldEnd);
    btn.addEventListener('pointerleave', handleHoldEnd);

    btn.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
}

function handleHoldStart(e) {
    if (isIntroCompleted) return;
    if (e) e.preventDefault();

    isHolding = true;
    if (elements.btnHoldEnter) elements.btnHoldEnter.classList.add('holding');
    holdStartTime = performance.now();

    startAudio();
    holdLoop();
}

function handleHoldEnd(e) {
    if (isIntroCompleted) return;
    if (isHolding) {
        isHolding = false;
        if (elements.btnHoldEnter) elements.btnHoldEnter.classList.remove('holding');
        if (holdAnimationFrame) cancelAnimationFrame(holdAnimationFrame);

        updateHeartProgress(0);
    }
}

function holdLoop() {
    if (!isHolding || isIntroCompleted) return;

    const elapsed = performance.now() - holdStartTime;
    const progress = Math.min(100, (elapsed / 3000) * 100);

    updateHeartProgress(progress);

    if (progress < 100) {
        holdAnimationFrame = requestAnimationFrame(holdLoop);
    } else {
        isHolding = false;
        isIntroCompleted = true;

        if (elements.btnHoldEnter) elements.btnHoldEnter.classList.remove('holding');
        if (elements.unlockedBadge) elements.unlockedBadge.classList.remove('hidden');

        triggerConfetti();

        setTimeout(() => {
            completeIntro();
        }, 900);
    }
}

function updateHeartProgress(percent) {
    if (elements.btnHoldFill) {
        elements.btnHoldFill.style.width = `${percent}%`;
    }

    if (elements.liquidFillRect && elements.liquidWave) {
        const fillY = 180 - (percent / 100) * 180;
        elements.liquidFillRect.setAttribute('y', fillY);
        elements.liquidWave.setAttribute('d', `M0,${fillY} Q50,${fillY - 6} 100,${fillY} T200,${fillY} L200,200 L0,200 Z`);
    }
}

function completeIntro() {
    showStep(elements.stepIntro, elements.stepWelcome);
}


/* ==========================================================================
   SECRET PASSCODE GATEWAY (CODE: 723254)
   ========================================================================== */

let enteredPasscode = "";

function initPasscodeGate() {
    enteredPasscode = "";
    updatePasscodeDots();

    // Attach touch, pointer, & click events to numpad buttons with mobile touch optimization
    const numpadButtons = document.querySelectorAll('.numpad-btn');
    numpadButtons.forEach(btn => {
        let lastTriggerTime = 0;

        const processPress = (e) => {
            if (e) {
                if (e.cancelable) e.preventDefault();
                e.stopPropagation();
            }

            const now = Date.now();
            if (now - lastTriggerTime < 150) return; // Prevent double triggers
            lastTriggerTime = now;

            const val = btn.getAttribute('data-val');
            const action = btn.getAttribute('data-action');

            if (val !== null) {
                appendPasscodeDigit(val);
            } else if (action === 'delete') {
                deletePasscodeDigit();
            } else if (action === 'submit') {
                verifyPasscode();
            }
        };

        btn.addEventListener('pointerdown', processPress, { passive: false });
        btn.addEventListener('touchstart', processPress, { passive: false });
        btn.addEventListener('click', processPress);
    });

    // Support physical keyboard typing
    document.addEventListener('keydown', (e) => {
        const stepPasscode = document.getElementById('step-passcode');
        if (!stepPasscode || stepPasscode.classList.contains('hidden')) return;

        if (e.key >= '0' && e.key <= '9') {
            appendPasscodeDigit(e.key);
        } else if (e.key === 'Backspace') {
            deletePasscodeDigit();
        } else if (e.key === 'Enter') {
            verifyPasscode();
        }
    });
}

function appendPasscodeDigit(digit) {
    if (enteredPasscode.length < 6) {
        enteredPasscode += digit;
        updatePasscodeDots();
        const passcodeError = document.getElementById('passcode-error');
        if (passcodeError) passcodeError.classList.add('hidden');

        // Auto verify when 6 digits entered
        if (enteredPasscode.length === 6) {
            setTimeout(() => {
                verifyPasscode();
            }, 150);
        }
    }
}

function deletePasscodeDigit() {
    if (enteredPasscode.length > 0) {
        enteredPasscode = enteredPasscode.slice(0, -1);
        updatePasscodeDots();
        const passcodeError = document.getElementById('passcode-error');
        if (passcodeError) passcodeError.classList.add('hidden');
    }
}

function updatePasscodeDots() {
    for (let i = 0; i < 6; i++) {
        const dot = document.getElementById(`pin-dot-${i}`);
        if (dot) {
            if (i < enteredPasscode.length) {
                dot.classList.add('filled');
            } else {
                dot.classList.remove('filled');
            }
        }
    }
}

function verifyPasscode() {
    const expectedPasscode = CONFIG.passcode || "723254";

    if (enteredPasscode === expectedPasscode) {
        // Correct Passcode!
        if (elements.passcodeError) elements.passcodeError.classList.add('hidden');
        triggerConfetti();

        // Start audio context on passcode entry
        startAudio();

        // Transition to Cinematic Panda Intro
        setTimeout(() => {
            showStep(elements.stepPasscode, elements.stepIntro);
            startIntro();
        }, 300);
    } else {
        // Incorrect Passcode -> Shake card & show error
        if (elements.passcodeError) elements.passcodeError.classList.remove('hidden');

        if (elements.passcodeCard) {
            elements.passcodeCard.classList.remove('shake-card');
            void elements.passcodeCard.offsetWidth; // Reflow
            elements.passcodeCard.classList.add('shake-card');
        }

        // Reset entered passcode digits
        enteredPasscode = "";
        setTimeout(() => {
            updatePasscodeDots();
        }, 400);
    }
}


