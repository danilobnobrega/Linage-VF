import './style.css'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'

gsap.registerPlugin(ScrollTrigger)

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

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// Sync ScrollTrigger with Lenis
lenis.on('scroll', ScrollTrigger.update)

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
const geometry = new THREE.PlaneGeometry(100, 100, 60, 60)
const pos = geometry.attributes.position
for (let i = 0; i < pos.count; i++) {
  const x = pos.getX(i)
  const y = pos.getY(i)
  // Perlin noise-like simple displacement
  const z = Math.sin(x * 0.2) * Math.cos(y * 0.2) * 1.5 + Math.sin(x * 0.05) * 2
  pos.setZ(i, z)
}
geometry.computeVertexNormals()

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
  
  plane.position.z = (elapsedTime * 0.5) % 2 
  particlesMesh.rotation.y = elapsedTime * 0.02
  
  // Camera scroll effect (tied to Lenis scroll)
  camera.position.y = 2 - window.scrollY * 0.002
  camera.position.z = 5 - window.scrollY * 0.001
  
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
.from('.hero-title', {
  y: 50,
  opacity: 0,
  duration: 1,
  ease: "power4.out"
}, "-=0.2")
.from('.hero-subtitle, .hero-cta', {
  y: 30,
  opacity: 0,
  duration: 1,
  stagger: 0.2,
  ease: "power4.out"
}, "-=0.8")


// Scroll Animations
gsap.utils.toArray('.section-title').forEach(title => {
  gsap.from(title, {
    scrollTrigger: {
      trigger: title,
      start: "top 85%",
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
  })
})

gsap.from('.ps-card', {
  scrollTrigger: {
    trigger: '.problem-solution',
    start: "top 75%",
  },
  y: 50,
  opacity: 0,
  duration: 1,
  stagger: 0.2,
  ease: "power3.out"
})

gsap.from('.persona-card', {
  scrollTrigger: {
    trigger: '.personas',
    start: "top 75%",
  },
  y: 40,
  opacity: 0,
  duration: 0.8,
  stagger: 0.1,
  ease: "power3.out"
})

gsap.from('.step-item', {
  scrollTrigger: {
    trigger: '.how-it-works',
    start: "top 75%",
  },
  x: -50,
  opacity: 0,
  duration: 0.8,
  stagger: 0.2,
  ease: "power3.out"
})

gsap.from('.tech-item', {
  scrollTrigger: {
    trigger: '.technical',
    start: "top 75%",
  },
  y: 30,
  opacity: 0,
  duration: 0.8,
  stagger: 0.15,
  ease: "power3.out"
})

gsap.from('.price-card', {
  scrollTrigger: {
    trigger: '.pricing',
    start: "top 75%",
  },
  y: 50,
  opacity: 0,
  duration: 0.8,
  stagger: 0.2,
  ease: "power3.out"
})

// Accordion Logic
document.querySelectorAll('.accordion-header').forEach(header => {
  header.addEventListener('click', () => {
    const item = header.parentElement
    const isActive = item.classList.contains('active')
    
    // Close all
    document.querySelectorAll('.accordion-item').forEach(acc => {
      acc.classList.remove('active')
    })
    
    // Open clicked if it wasn't active
    if (!isActive) {
      item.classList.add('active')
    }
  })
})
