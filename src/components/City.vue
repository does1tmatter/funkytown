<script setup>
import * as THREE from 'three'
import { useWindowSize, useMouse, useFps } from '@vueuse/core'
import { onMounted, onUnmounted, ref } from 'vue'

const { width, height } = useWindowSize()
const { x, y } = useMouse()
const fps = useFps()

const funkeetown = ref(null)

const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1)
const lightFront = new THREE.SpotLight(0xFFFFFF, 20, 10)
const speedMultiplier = 0.0001

const camera = new THREE.PerspectiveCamera(28, width.value / height.value, 1, 8000)
const scene = new THREE.Scene()
const building = new THREE.Object3D()
const city = new THREE.Object3D()
const renderer = ref(null)

const setThemeColor = (_color = 0xF02050) => {
  scene.background = new THREE.Color(0x171d1c)
  scene.fog = new THREE.Fog(_color, 10, 20)
}

const randomInt = (num = 8) => {
  const randomNumber = - Math.random() * num + Math.random() * num
  return randomNumber
}

const cameraInit = () => {
  camera.position.x = 0 
  camera.position.y = -0.5
  camera.position.z = 22
  scene.add(camera)
}

const initializeTown = (population = 100, _color = 0xF02050) => {
  for (let i = 0; i < population; i++) {
    const geometry = new THREE.BoxGeometry()

    const material = new THREE.MeshPhysicalMaterial({
      color: _color,
      roughness: 1,
      metalness: 1,
      clearcoat: 1,
      side: THREE.DoubleSide
    })

    const wmaterial = new THREE.MeshPhongMaterial({
      color: 0xFFFFFF,
      transparent: true,
      opacity: 0.1
    })

    const cubeWidth = 0.9
    const cube = new THREE.Mesh(geometry, material)
    const wfloor = new THREE.Mesh(geometry, wmaterial)
    
    cube.add(wfloor)
    cube.receiveShadow = true

    cube.scale.y = 0.1 + Math.abs(randomInt(10))
    cube.scale.x = cubeWidth+randomInt(1-cubeWidth)
    cube.scale.z = cubeWidth+randomInt(1-cubeWidth)

    cube.position.x = Math.round(randomInt(10))
    cube.position.z = Math.round(randomInt(10))

    building.add(cube)
  }
}

const lightFrontInit = () => {
  lightFront.position.set(-4, 10, 3)
  lightFront.castShadow = true
  lightFront.shadow.mapSize.width = 1024
  lightFront.shadow.mapSize.height = lightFront.shadow.mapSize.width
  lightFront.penumbra = 1
}

const sceneInit = () => {
  scene.add(ambientLight)
  scene.add(city)
  city.add(building)
  city.add(lightFront)
}

const responsiveListener = (bool) => {
  if (bool) {
    window.addEventListener('resize', () => {
      camera.aspect = width.value / height.value
      camera.updateProjectionMatrix()
      
      renderer.value.setSize(width.value, height.value)
      renderer.value.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })
  } else {
    window.removeEventListener('resize', () => {
      camera.aspect = width.value / height.value
      camera.updateProjectionMatrix()
      
      renderer.value.setSize(width.value, height.value)
      renderer.value.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })
  }
}

const rendererInit = () => {
  renderer.value = new THREE.WebGLRenderer({
    canvas: funkeetown.value,
    antialias: true
    // precision: 'mediump'
  })
  renderer.value.setSize(width.value, height.value)
  renderer.value.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.value.render(scene, camera)
}

const animate = () => {
  window.requestAnimationFrame(animate, 50)
  city.rotation.y = (x.value * speedMultiplier) + 0.45
  city.rotation.x = (y.value * speedMultiplier) + 0.45
  renderer.value.render(scene, camera)
}

onMounted(() => {
  setThemeColor(0x171D1C)
  initializeTown(125) 
  cameraInit()
  sceneInit()
  rendererInit()
  lightFrontInit()
  animate()
  responsiveListener(true)
})

onUnmounted(() => {
  responsiveListener(false)
})
</script>

<template>
  <canvas ref="funkeetown"></canvas>
  <div class="fps">
    FPS: {{ fps }}
  </div>
</template>

<style scoped>
canvas {
  position: absolute;
  top: 0;
  left: 0;
}
.fps {
  position: absolute;
  top: 10px;
  left: 10px;
  opacity: 0.3;
  font-weight: 100;
  pointer-events: none;
}
</style>
