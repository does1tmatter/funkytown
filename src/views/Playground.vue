<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader' 
import { useWindowSize, useParallax } from '@vueuse/core'

const { width, height } = useWindowSize()
const canvasEl = ref(null)

const parallaxCont = ref(null)
const { roll, tilt } = useParallax(parallaxCont)
const wheel = ref(150)


const renderer = ref(null)
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(20, width.value / height.value, 1, 1000)
const lightFront = new THREE.SpotLight(0xFFFFFF, 20, 10)
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1)
const speedMultiplier = 0.0001
const animMixer = []

let model

const rendererInit = () => {
  renderer.value = new THREE.WebGLRenderer({
    canvas: canvasEl.value,
    antialias: true,
    alpha: true
  })
  renderer.value.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.value.setSize(width.value, height.value)
  renderer.value.render(scene, camera)
}

const cameraInit = () => {
  camera.position.set(0.3, 10, 150)
  scene.add(camera)
}

const floorInit = () => {
  const geometry = new THREE.PlaneGeometry(50, 50, 1, 1)
  const material = new THREE.MeshBasicMaterial({
    color: 0xFFFFFF,
    side: THREE.DoubleSide
  })
  const floor = new THREE.Mesh(geometry, material)
  floor.castShadow = false
  floor.receiveShadow = true
  floor.rotation.x = 1.55555
  scene.add(floor)
}

const lightsInit = () => {
  lightFront.position.set(-4, 10, 3)
  lightFront.castShadow = true
  lightFront.shadow.mapSize.width = 1024
  lightFront.shadow.mapSize.height = lightFront.shadow.mapSize.width
  lightFront.penumbra = 1
  scene.add(ambientLight)
}

const listeners = (bool) => {
  if (bool) {
    window.addEventListener('resize', resizeCallback)
    window.addEventListener('wheel', scrollCallback)
  } else {
    window.removeEventListener('resize', resizeCallback)
    window.removeEventListener('wheel', scrollCallback)
  }
}

const resizeCallback = () => {
  camera.aspect = width.value / height.value
  camera.updateProjectionMatrix()
  
  renderer.value.setSize(width.value, height.value)
  renderer.value.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}
const scrollCallback = (e) => {
  if (e.deltaY < 0) {
    wheel.value -= 10
  } else {
    wheel.value += 10
  }
}

const loadModel = () => {
  const loader = new FBXLoader()
  loader.load('./Ch34_nonPBR.fbx', (obj) => {
    model = obj
    model.scale.setScalar(0.1)
    model.traverse(c => {
      c.castShadow = true
    })
    console.log('Model loaded')
    const animation = new FBXLoader()
    animation.load('./walk.fbx', (a) => {
      const m = new THREE.AnimationMixer(model)
      animMixer.push(m)
      const idle = m.clipAction(a.animations[0])
      idle.play()
      console.log('Animation loaded')
      console.log(m)
    })
    scene.add(model)
  })
}

const prevFrame = ref(null)
const time = new THREE.Clock

const animate = (t) => {
  window.requestAnimationFrame(animate)
  if (!prevFrame.value) {
    prevFrame.value = t
  }
  if (model) {
    model.rotation.y = tilt.value * 6
  }
  if (animMixer.length > 0) {
    animMixer[0].update(time.getDelta())
  }
  camera.position.z = wheel.value
  renderer.value.render(scene, camera)
}

onMounted(() => {
  cameraInit()
  floorInit()
  lightsInit()
  loadModel()
  rendererInit()
  animate()
  console.log(scene)
  listeners(true)
  console.log(time.getDelta())
})

onUnmounted(() => {
  listeners(false)
})
</script>

<template>
  <div>
    <canvas ref="canvasEl"></canvas>
    <div class="parallax" ref="parallaxCont">
      veikia: scroll to zoom / model spin
    </div>
  </div>
</template>


<style scoped>
canvas {
  position: absolute;
  top: 0;
  left: 0;
}
.parallax {
  position: absolute;
  top: 0;
  left: 0;
  min-width: 100vw;
  min-height: 100vh;
}
</style>