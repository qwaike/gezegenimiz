import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

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
        // positions[i3 +0 ] = (Math.random() - 0.5)  * 4
        // positions[i3 +1 ] = (Math.random() - 0.5)  * 4
        // positions[i3 +2 ] = (Math.random() - 0.5)  * 4

        const radius = Math.random()*parameters.radius
        const branchAngle = (i % parameters.branches)/parameters.branches * Math.PI * 2 

        if(i<240){console.log(i, branchAngle)}



        positions[i3 +0 ] = Math.cos(branchAngle) * radius
        positions[i3 +1 ] = 0
        positions[i3 +2 ] = Math.sin(branchAngle) * radius
        
        
    }

    geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions,3)
    )




//material 
material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
})


points = new THREE.Points(geometry,material)
scene.add(points)


}
generateGalaxy();

gui.add(parameters, 'count', 100,1000000, 250).onFinishChange(generateGalaxy)
gui.add(parameters, 'size', 0.001,0.1, 0.01).onFinishChange(generateGalaxy)
gui.add(parameters, 'radius', 0.01,20, 0.01).onFinishChange(generateGalaxy)
gui.add(parameters, 'branches', 2,20, 1).onFinishChange(generateGalaxy)




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