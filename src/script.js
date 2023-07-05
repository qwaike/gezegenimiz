import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI({width:400})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


// galaxy 
const parameters = {}
parameters.count = 50000
parameters.size = 0.01
parameters.radius = 5
parameters.branches = 3
parameters.spin = 1
parameters.randomness = 0.2
parameters.randomnessPower = 2
parameters.insideColor = '#ff6030'
parameters.outsideColor = '#ff3060' 

let geometry = null
let material = null
let points = null



const generateGalaxy = () => {

    if (geometry !== null || material !== null || points !== null){
        // bunu geometry.dispose() ile de yapabiliyoruz
        scene.remove(geometry,material,points)
    }


    geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(parameters.count*3)
    for (let i = 0; i < parameters.count; i++) {
        const i3 = i*3
        
        
        const radius = Math.random()*parameters.radius
        const spinAngle = radius * parameters.spin

        const branchAngle = (i % parameters.branches)/parameters.branches * Math.PI * 2 

        const randomX = Math.pow(Math.random() , parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
        const randomY = Math.pow(Math.random() , parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
        const randomZ = Math.pow(Math.random() , parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)

        // if(i<240){console.log(i, branchAngle)}



        positions[i3 +0 ] = Math.cos(branchAngle + spinAngle) * radius + randomX
        positions[i3 +1 ] = randomY
        positions[i3 +2 ] = Math.sin(branchAngle + spinAngle) * radius + randomZ
        
        
    }

    const test = 0;
    geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions,3)
    )




//material 
material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    // vertexColors:true
    
    
})

points = new THREE.Points(geometry,material)
scene.add(points)


}
generateGalaxy();

gui.add(parameters, 'count', 100,1000000, 250).onFinishChange(generateGalaxy).name('adet')
gui.add(parameters, 'size', 0.001,0.1, 0.01).onFinishChange(generateGalaxy).name('boyut')
gui.add(parameters, 'radius', 0.01,20, 0.01).onFinishChange(generateGalaxy).name('çap')
gui.add(parameters, 'branches', 2,20, 1).onFinishChange(generateGalaxy).name('dal')
gui.add(parameters, 'spin', -5 , 5 , 0.001).onFinishChange(generateGalaxy).name('dönüş')
gui.add(parameters, 'randomness', 0 , 2 , 0.001).onFinishChange(generateGalaxy).name('rastgelelik')
gui.add(parameters, 'randomnessPower', 1 , 10 , 0.01).onFinishChange(generateGalaxy).name('rastgelelik-düzenleyici')
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy)
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy)

parameters.material = material;
// gui.add(parameters, 'material', 0.1 , 1 , 0.01 ).onFinishChange(generateGalaxy).name('görünürlük')
console.log(parameters.material)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 25000)
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()