<script setup>
import * as THREE from 'three'
import { useWindowSize, useMouse, useFps } from '@vueuse/core'
import { onMounted, onUnmounted, ref, watch } from 'vue'

const { width, height } = useWindowSize()
const { x, y } = useMouse()
const fps = useFps()

const funkeetown = ref(null)
const themeColor = ref(0x171D1C)

const colorArray = [0xD8FFDD, 0xF02050, 0xFFE734, 0xD9FFF8, 0xFF0037, 0xBB00FF, 0x40FF00, 0xFF0000, 0xF700FF, 0xFF00D4, 0x1900FF, 0x00E5FF, 0x00FFAE, 0xF3FCF0, 0xFF0022, 0x41EAD4, 0xFDFFFC]

const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1)
const lightFront = new THREE.SpotLight(0xFFFFFF, 20, 10)
const speedMultiplier = 0.0001

const camera = new THREE.PerspectiveCamera(28, width.value / height.value, 1, 8000)
const scene = new THREE.Scene()
const building = new THREE.Object3D()
const city = new THREE.Object3D()
const renderer = ref(null)

const setThemeColor = () => {
  themeColor.value = colorArray[rngNum()]
}

const randomInt = (num = 8) => {
  const randomNumber = - Math.random() * num + Math.random() * num
  return randomNumber
}

const cameraInit = () => {
  camera.position.x = -0.5 
  camera.position.y = 0
  camera.position.z = 22
  scene.add(camera)
}

const initializeTown = (population = 100) => {
  for (let i = 0; i < population; i++) {
    const geometry = new THREE.BoxGeometry()

    const material = new THREE.MeshPhysicalMaterial({
      color: themeColor.value,
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
  scene.fog = new THREE.Fog('#171D1C', 2, 23)
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
    antialias: true,
    alpha: true
    // precision: 'mediump'
  })
  renderer.value.setSize(width.value, height.value)
  renderer.value.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.value.setClearColor(0x171D1C, 1)
  renderer.value.render(scene, camera)
}

const animate = () => {
  window.requestAnimationFrame(animate, 50)
  city.rotation.y = (x.value * speedMultiplier) + 0.45
  city.rotation.x = (y.value * speedMultiplier) + 0.45
  renderer.value.render(scene, camera)
}

const refreshScene = () => {
  scene.clear()
  city.clear()
  building.clear()
  setThemeColor()
  initializeTown()
  sceneInit()
}

const keyPressListener = (bool) => {
  if (bool) {
    window.addEventListener('keypress', (e) => {
      if (e.code === 'Space') {
        refreshScene()
      }
    })
  } else {
    window.removeEventListener('keypress', (e) => {
      if (e.code === 'Space') {
        refreshScene()
      }
    })
  }
}

const rngNum = (max = 17) => Math.round(Math.random() * (max - 1)) + 1

const listeners = (bool) => {
  responsiveListener(bool)
  keyPressListener(bool)
}

const playing = ref(false)
let intervalId = null

const play = () => {
  playing.value = !playing.value
  if (playing.value) {
    intervalId = setInterval(refreshScene, 3000)
  } else {
    clearInterval(intervalId)
    intervalId = null
  }
}

onMounted(() => {
  setThemeColor()
  initializeTown() 
  cameraInit()
  sceneInit()
  rendererInit()
  lightFrontInit()
  animate()
  listeners(true)
  console.log(city)
})

onUnmounted(() => {
  listeners(false)
})
</script>

<template>
  <canvas ref="funkeetown"></canvas>
  <div class="fps">
    FPS: {{ fps }}
  </div>
  <div class="controls">
    <div class="interval" @click="play()">
      <svg v-if="!playing" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        width="33" height="33" viewBox="0 0 163.861 163.861" style="enable-background:new 0 0 163.861 163.861;"
        xml:space="preserve">
        <path d="M34.857,3.613C20.084-4.861,8.107,2.081,8.107,19.106v125.637c0,17.042,11.977,23.975,26.75,15.509L144.67,97.275
          c14.778-8.477,14.778-22.211,0-30.686L34.857,3.613z" fill="#FFFFFF"/>
      </svg>
      <svg v-if="playing" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        viewBox="0 0 47.607 47.607" width="30" style="enable-background:new 0 0 47.607 47.607;" xml:space="preserve">
        <path d="M17.991,40.976c0,3.662-2.969,6.631-6.631,6.631l0,0c-3.662,0-6.631-2.969-6.631-6.631V6.631C4.729,2.969,7.698,0,11.36,0
          l0,0c3.662,0,6.631,2.969,6.631,6.631V40.976z" fill="#FFFFFF"/>
        <path d="M42.877,40.976c0,3.662-2.969,6.631-6.631,6.631l0,0c-3.662,0-6.631-2.969-6.631-6.631V6.631
          C29.616,2.969,32.585,0,36.246,0l0,0c3.662,0,6.631,2.969,6.631,6.631V40.976z" fill="#FFFFFF"/>
      </svg>
    </div>
    <div class="refresh" @click="refreshScene()">
      <svg version="1.1" id="Layer_1" width="50" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
	 viewBox="0 0 496.156 496.156" style="enable-background:new 0 0 496.156 496.156; cursor: pointer;" xml:space="preserve">
        <path style="fill:#FFFFFF;" d="M428.243,172.149c-10.348,0.023-20.694,0.054-31.042,0.077
          c-23.272-52.177-68.95-89.871-126.649-98.91c-64.287-10.071-125.816,19.788-162.504,72.312
          c-16.296,23.326,22.003,45.165,38.16,22.034c50.317-72.037,157.757-65.527,201.907,4.686c-9.559,0.022-19.118,0.046-28.678,0.068
          c-2.674,0.008-4.574,1.197-5.749,2.877c-1.92,2.058-2.65,5.072-0.639,8.186c18.204,28.25,36.408,56.499,54.616,84.745
          c3.061,4.747,9.663,4.708,12.696-0.046c18.062-28.338,36.126-56.675,54.188-85.013C437.538,178.48,433.602,172.135,428.243,172.149
          z"/>
        <path style="fill:#FFFFFF;" d="M350.353,327.224c-49.927,71.49-156.108,65.63-200.886-3.049c9.161-0.022,18.322-0.046,27.484-0.068
          c2.666-0.008,4.563-1.19,5.741-2.865c1.924-2.059,2.658-5.072,0.646-8.197c-18.2-28.246-36.405-56.499-54.609-84.741
          c-3.056-4.751-9.662-4.712-12.695,0.046c-18.063,28.334-36.13,56.671-54.196,85.009c-2.987,4.689,0.948,11.032,6.308,11.017
          c10.669-0.027,21.337-0.054,32.006-0.08c23.498,51.319,68.777,88.332,125.865,97.275c64.287,10.072,125.816-19.784,162.496-72.312
          C404.806,325.928,366.508,304.09,350.353,327.224z"/>
      </svg>
    </div>
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
  font-size: 12px;
  pointer-events: none;
}
.controls {
  display: flex;
  align-items: center;
  gap: 20px;
  position: absolute;
  top: 20px;
  right: 20px;
}
.interval {
  display: inline;
  cursor: pointer;
}

.interval, .refresh {
  opacity: 0.3;
  transition: opacity 0.3s;
}

.interval:hover, .refresh:hover {
  opacity: 0.8;
}
</style>
