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
    // Girlfriend's name (case-insensitive)
    girlfriendName: "Sadalika",

    // Her panda's name (case-insensitive)
    pandaName: "Bubu",

    // First letter of your name (case-insensitive)
    hisNameLetter: "A",

    // Main birthday celebration header message
    birthdayMessage: "Happy Birthday Chuti Manikeeeee💕😘😘🫶",

    // Path to background music file
    music: "assets/music/our-song.mp3",

    // Love Letter text content
    // Replace "MY_LOVE_LETTER_HERE" or edit the string below to insert your own letter
    loveLetter: `My dearest Chuti Manikeee 💕,

Happy Birthday to the most wonderful, adorable, and special person in my whole world! 🐼💗

From the very first moment you walked into my life, every day has become sweeter, happier, and filled with so much magic. Your beautiful smile, your warm loving heart, and your cute panda energy bring so much light into my life.

This secret little surprise is just a tiny token of how deeply I treasure you. I built this special place so you will always have a reminder of how much you are loved and cherished today, tomorrow, and forever.

Thank you for being my dream come true, my best friend, and my panda forever. I wish you a birthday filled with endless laughter, gentle hugs, delicious treats, and all the love in the universe!

Forever & Always Yours,
Your Bubu ❤️`,

    // Multi-Step Question Configuration
    questions: [
        {
            id: 1,
            question: "What is your name? 💕",
            answer: "Sadalika",
            errorMsg: "Hmmmm... try again Chuti Manikeee 🥺💕",
            pandaEmoji: "🐼"
        },
        {
            id: 2,
            question: "What is your panda's name? 🐼💗",
            answer: "Bubu",
            errorMsg: "Are you sure you're my Chuti Manikeee? 🥺🐼",
            pandaEmoji: "🐼💖"
        },
        {
            id: 3,
            question: "What is the first letter of his name? ❤️",
            answer: "A",
            errorMsg: "One last little thought... try again 🥺💕",
            pandaEmoji: "🐼🥰"
        }
    ],

    // Memory Gallery Configuration (Photos & Videos)
    memories: [
        {
            type: "image",
            src: "assets/photos/photo1.jpg",
            caption: "Our happy moments together ❤️"
        },
        {
            type: "image",
            src: "assets/photos/photo2.jpg",
            caption: "That sweet, beautiful smile 💕"
        },
        {
            type: "video",
            src: "assets/videos/video1.mp4",
            caption: "A precious video memory 🐼✨"
        },
        {
            type: "image",
            src: "assets/photos/photo3.jpg",
            caption: "Making memories with my Chuti Manikeee 💖"
        },
        {
            type: "image",
            src: "assets/photos/photo4.jpg",
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
    elements.pandaEmoji.textContent = qData.pandaEmoji;
    
    setTimeout(() => {
        elements.answerInput.focus();
    }, 300);
}

function handleAnswerSubmit(e) {
    if (e) e.preventDefault();

    const userInput = elements.answerInput.value.trim().toLowerCase();
    const currentQData = CONFIG.questions[currentQuestionIndex];
    const expectedAnswer = currentQData.answer.trim().toLowerCase();

    if (userInput === expectedAnswer) {
        // Correct Answer
        elements.errorMessage.classList.add('hidden');
        elements.answerInput.blur();

        if (currentQuestionIndex < CONFIG.questions.length - 1) {
            // Success micro-feedback and slide to next question
            elements.questionCard.style.transform = "scale(1.03)";
            setTimeout(() => {
                elements.questionCard.style.transform = "scale(1)";
                loadQuestion(currentQuestionIndex + 1);
            }, 300);
        } else {
            // Final Answer Correct -> Unlock Birthday Celebration
            triggerConfetti();
            elements.celebrationTitle.textContent = CONFIG.birthdayMessage;
            showStep(elements.stepQuestions, elements.stepCelebration);
        }
    } else {
        // Incorrect Answer -> Shake animation & show cute error toast
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
