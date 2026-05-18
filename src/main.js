import './style.css'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'

gsap.registerPlugin(ScrollTrigger)

// --- Dynamic Scanline Injection for Premium Card Sweep Materialization ---
document.querySelectorAll('.feature-card, .result-card, .price-card').forEach(card => {
  const scanline = document.createElement('div')
  scanline.className = 'scanline'
  card.appendChild(scanline)
})



// --- Signal-to-Noise Text Decoding (Elegant Typographic Cipher) ---
function decryptText(element) {
  if (element.classList.contains('decrypted')) return
  element.classList.add('decrypted')
  
  const originalText = element.getAttribute('data-original-text') || element.innerText.trim()
  if (!element.getAttribute('data-original-text')) {
    element.setAttribute('data-original-text', originalText)
  }
  
  // Fade in the element container smoothly while scrambling
  gsap.to(element, { opacity: 1, duration: 0.4, ease: "power2.out" })
  
  // High-end elegant editorial symbols and mathematical glyphs
  const luxuryGlyphs = "†‡§¶øæœX*•°AΘΞΦΨΩ".split("")
  const letters = originalText.split("")
  let frame = 0
  const totalFrames = 25 // Snappy and ultra-premium duration
  
  const interval = setInterval(() => {
    element.innerHTML = letters.map((char, index) => {
      if (char === " " || char === "\n") return char
      
      const progress = frame / totalFrames
      const charIndex = index / letters.length
      
      if (progress > charIndex) {
        return char // Fully resolved character in pristine editorial typography!
      } else if (progress > charIndex - 0.2) {
        // Active decrypting state - using elegant, luxury typographic symbols in medium-grey
        const randomGlyph = luxuryGlyphs[Math.floor(Math.random() * luxuryGlyphs.length)]
        return `<span style="color: #a0a0a0; font-weight: 300;">${randomGlyph}</span>`
      } else {
        // Unrevealed state - completely invisible, keeping it ultra-clean and zero noise!
        return `<span style="opacity: 0;">&nbsp;</span>`
      }
    }).join("")
    
    if (frame >= totalFrames) {
      clearInterval(interval)
      element.innerText = originalText // Fully restored pristine semantic text!
    }
    frame++
  }, 35)
}

// --- Lenis Smooth Scroll ---
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
})

// Sync ScrollTrigger and Navbar Toggle/Autohide with Lenis
const navbar = document.querySelector('.navbar')
let lastScrollY = 0

lenis.on('scroll', (e) => {
  ScrollTrigger.update()
  
  const currentScroll = e.scroll
  
  // Toggle scrolled transparent glassmorphic state
  if (currentScroll > 50) {
    navbar.classList.add('scrolled')
  } else {
    navbar.classList.remove('scrolled')
  }
  
  // Ultra-responsive Autohide with physical recoil/backlash filter (1.5px threshold)
  const scrollDelta = currentScroll - lastScrollY
  
  if (currentScroll <= 0) {
    // Only force show at the absolute top (0 or negative pull)
    navbar.classList.remove('hidden')
  } else if (scrollDelta > 1.5) {
    // Hide immediately on deliberate scroll down (filtering out recoil jitters <= 1.5px)
    navbar.classList.add('hidden')
  } else if (scrollDelta < -1.5) {
    // Reveal immediately on deliberate scroll up
    navbar.classList.remove('hidden')
  }
  
  lastScrollY = currentScroll
})

// Smooth Section Scrolling
document.querySelectorAll('.nav-link, .nav-logo').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault()
    const targetId = link.getAttribute('href')
    const targetSection = document.querySelector(targetId)
    if (targetSection) {
      lenis.scrollTo(targetSection, {
        offset: -80, // Offset for sticky navbar height
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      })
    }
  })
})

// Use GSAP's ticker to drive Lenis (more robust, avoids double loops)
gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})
gsap.ticker.lagSmoothing(0, 0)

// --- Custom Cursor ---
const cursor = document.querySelector('.cursor')
const follower = document.querySelector('.cursor-follower')
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX
  mouseY = e.clientY
  
  gsap.to(cursor, {
    x: mouseX,
    y: mouseY,
    duration: 0.1,
    ease: "power2.out"
  })
})

gsap.ticker.add(() => {
  followerX += (mouseX - followerX) * 0.15
  followerY += (mouseY - followerY) * 0.15
  gsap.set(follower, { x: followerX, y: followerY })
})

// Magnetic buttons hover
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    
    gsap.to(btn, { x: x * 0.4, y: y * 0.4, duration: 0.3, ease: "power2.out" })
    gsap.to(follower, { width: 80, height: 80, borderColor: 'rgba(0, 255, 136, 0.5)' })
  })
  
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" })
    gsap.to(follower, { width: 40, height: 40, borderColor: 'rgba(255, 255, 255, 0.5)' })
  })
})

// --- Three.js WebGL Background ---
const canvas = document.querySelector('#webgl-canvas')
const scene = new THREE.Scene()
scene.fog = new THREE.FogExp2(0x030303, 0.04)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Create a wireframe grid/terrain representing data/market
// We define the geometry without pre-displacing Z. All movement and displacement 
// is done dynamically in the animation loop to ensure a 100% fluid, endless scrolling flow.
const geometry = new THREE.PlaneGeometry(120, 120, 60, 60)

const material = new THREE.MeshBasicMaterial({ 
  color: 0x00ff88, 
  wireframe: true,
  transparent: true,
  opacity: 0.08
})

const plane = new THREE.Mesh(geometry, material)
plane.rotation.x = -Math.PI / 2
plane.position.y = -5
scene.add(plane)

// Particles
const particlesGeometry = new THREE.BufferGeometry()
const particlesCount = 800
const posArray = new Float32Array(particlesCount * 3)

for(let i=0; i < particlesCount * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 50
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.05,
  color: 0x00ff88,
  transparent: true,
  opacity: 0.6
})
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particlesMesh)

camera.position.z = 5
camera.position.y = 2

// WebGL Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

// WebGL Animation Loop
const clock = new THREE.Clock()
function renderThree() {
  const elapsedTime = clock.getElapsedTime()
  const currentScroll = lenis.scroll || 0
  
  // Continuously flow the wave offset based on time and scroll position.
  // This creates an interactive flow: scrolling naturally speeds up the wave propagation.
  const waveOffset = elapsedTime * 0.6 + currentScroll * 0.004
  
  // Update grid vertices dynamically for a perfectly fluid, infinite flowing wave.
  // This completely eliminates modulo jumps, wrapping seams, or "video clip cuts".
  const pos = geometry.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    
    // Wave formula that moves along depth (y) and width (x) seamlessly and smoothly over time.
    const z = Math.sin(x * 0.12 + waveOffset) * Math.cos(y * 0.12 + waveOffset) * 2.2 + Math.sin(x * 0.04) * 1.5
    pos.setZ(i, z)
  }
  pos.needsUpdate = true
  
  particlesMesh.rotation.y = elapsedTime * 0.02
  
  // Camera scroll effect (tied to Lenis scroll instead of window.scrollY to prevent layout thrashing)
  camera.position.y = 2 - currentScroll * 0.002
  camera.position.z = 5 - currentScroll * 0.001
  
  renderer.render(scene, camera)
  requestAnimationFrame(renderThree)
}
renderThree()

// --- GSAP Animations ---

// Loader Sequence
const tlLoader = gsap.timeline()
tlLoader.to('.loader-text .char', {
  y: 0,
  opacity: 1,
  stagger: 0.05,
  duration: 1,
  ease: "power4.out",
  delay: 0.2
})
.to('.loader-text .char', {
  y: -100,
  opacity: 0,
  stagger: 0.05,
  duration: 0.8,
  ease: "power4.in"
}, "+=0.5")
.to('.loader', {
  yPercent: -100,
  duration: 1,
  ease: "power4.inOut"
})
.call(() => {
  // Kinetic signal-to-noise materialization on Hero title!
  const heroTitle = document.querySelector('.hero-title')
  if (heroTitle) decryptText(heroTitle)
})
.from('.hero-cta', {
  y: 40,
  opacity: 0,
  duration: 1.2,
  ease: "power4.out"
}, "-=0.5")


// Scroll-Linked Text Decryption Trigger (Strategic Titles)
document.querySelectorAll('[data-split-text]').forEach(el => {
  if (el.classList.contains('hero-title')) return // already handled by loader
  
  ScrollTrigger.create({
    trigger: el,
    start: "top 85%",
    onEnter: () => decryptText(el),
    once: true // trigger only once per load
  })
})

// Scroll-Linked Text Elegant Fade-In Trigger (Body Copy & Paragraphs)
document.querySelectorAll('[data-fade-text]').forEach(el => {
  gsap.fromTo(el, 
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        once: true
      }
    }
  )
})

// Holographic Scanline Card Sweeping (Elite Awwwards Materialization)
const animateCardGroup = (gridSelector, cardSelector) => {
  const cards = document.querySelectorAll(cardSelector)
  if (cards.length === 0) return
  
  ScrollTrigger.create({
    trigger: gridSelector,
    start: "top 80%",
    onEnter: () => {
      cards.forEach((card, index) => {
        const scanline = card.querySelector('.scanline')
        
        // Staggered reveal for cards
        gsap.timeline({ delay: index * 0.2 })
          // 1. Reveal scanline and start sweeping down
          .fromTo(scanline, 
            { top: "0%", opacity: 0 },
            { top: "0%", opacity: 1, duration: 0.1 }
          )
          // 2. Animate clip-path to open up as scanline sweeps
          .fromTo(card, 
            { clipPath: "inset(0 0 100% 0)", opacity: 0 },
            { clipPath: "inset(0 0 0% 0)", opacity: 1, duration: 1.5, ease: "power3.inOut" },
            "<" // start simultaneously
          )
          // 3. Sweep scanline to 100% height and fade out at the bottom
          .fromTo(scanline,
            { top: "0%" },
            { top: "100%", duration: 1.5, ease: "power3.inOut" },
            "<"
          )
          .to(scanline, { opacity: 0, duration: 0.2 })
      })
    },
    once: true
  })
}

animateCardGroup('.features-grid', '.feature-card')
animateCardGroup('.results-grid', '.result-card')
animateCardGroup('.pricing-grid', '.price-card')

// Vision Paragraph (Non-split elements)
gsap.from('.vision-body', {
  scrollTrigger: {
    trigger: '.vision',
    start: "top 70%",
  },
  y: 30,
  opacity: 0,
  duration: 1.2,
  ease: "power3.out"
})

// Footer Signature
gsap.from('.signature > *', {
  scrollTrigger: {
    trigger: '.signature',
    start: "top 90%",
  },
  y: 20,
  opacity: 0,
  duration: 1,
  stagger: 0.15,
  ease: "power3.out"
})
