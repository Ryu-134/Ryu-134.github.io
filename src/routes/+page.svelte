<script lang="ts">
    import { onMount } from 'svelte';

    onMount(() => {
        const canvas = document.getElementById('stars') as HTMLCanvasElement | null;
        if (!canvas) {
            throw new Error('Canvas element with ID "stars" not found.');
        }
    
        const context = canvas.getContext('2d');
        if (!context) {
            throw new Error('Failed to get 2D context from canvas.');
        }
    
        // Declare local scoped constants for non-null usage
        const localCanvas = canvas;
        const localContext = context;
    
        let scale = 1; // Adjust device pixel ratio for sharper render
        let width: number;
        let height: number;
    
        // Star property constants
        const stars: { x: number; y: number; z: number }[] = [];
        const STAR_COUNT = (window.innerWidth + window.innerHeight) / 8; // Number of stars
        const STAR_COLOR = '#fff'; // Star color
        const STAR_SIZE = 3; // Base size of stars
        const STAR_MIN_SCALE = 0.2; // Minimum scale factor
        const OVERFLOW_THRESHOLD = 50; // Threshold for recycling stars
    
        let pointerX: number | null = null;
        let pointerY: number | null = null;

        // Attach event listener to `window` for global mouse tracking
        window.addEventListener('mousemove', (event: MouseEvent) => {
            movePointer(event.clientX, event.clientY);
        });

        const velocity = {
            x: 0, // Current x-direction velocity
            y: 0, // Current y-direction velocity
            tx: 0, // Target x-direction velocity
            ty: 0, // Target y-direction velocity
            z: 0.0005, // Base speed for stars
        };
    
        let touchInput = false;
    
        // Resizes the canvas to fit the window
        function resize() {
            scale = window.devicePixelRatio || 1;
            width = window.innerWidth * scale;
            height = window.innerHeight * scale;
            localCanvas.width = width; // Use localCanvas, guaranteed to be non-null
            localCanvas.height = height;
            stars.forEach(placeStar); // Recalculate star positions
        }
    
        // Assigns random positions to stars
        function placeStar(star: { x: number; y: number; z: number }) {
            star.x = Math.random() * width; // Random horizontal position
            star.y = Math.random() * height; // Random vertical position
        }
    
        // Adjusts velocity based on pointer movement
        function movePointer(x: number, y: number) {
            if (pointerX !== null && pointerY !== null) {
            const deltaX = x - pointerX;
            const deltaY = y - pointerY;
    
            velocity.tx += (deltaX / 8) * (touchInput ? 1 : -1);
            velocity.ty += (deltaY / 8) * (touchInput ? 1 : -1);
            }
            pointerX = x;
            pointerY = y;
        }
    
        // Event handlers for pointer interaction
        function onMouseMove(event: MouseEvent) {
            touchInput = false;
            movePointer(event.clientX, event.clientY);
        }
    
        function onTouchMove(event: TouchEvent) {
            touchInput = true;
            const touch = event.touches[0];
            movePointer(touch.clientX, touch.clientY);
            event.preventDefault();
        }
    
        function onMouseLeave() {
            pointerX = null;
            pointerY = null;
        }
    
        function generateStars() {
            for (let i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x: 0,
                y: 0,
                z: STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE),
            });
            }
        }

    // Renders the stars on the canvas
    function renderStars() {
        localContext.clearRect(0, 0, width, height); // Clear the canvas
        stars.forEach((star) => {
        localContext.beginPath();
        localContext.lineCap = 'round';
        localContext.lineWidth = STAR_SIZE * star.z * scale; // Line width scales with star depth
        localContext.globalAlpha = 0.5 + 0.5 * Math.random(); // Random transparency
        localContext.strokeStyle = STAR_COLOR; // Star color
        localContext.moveTo(star.x, star.y);

        let tailX = velocity.x * 2; // Length of the star's "tail" in x-direction
        let tailY = velocity.y * 2; // Length of the star's "tail" in y-direction

        if (Math.abs(tailX) < 0.1) tailX = 0.5;
        if (Math.abs(tailY) < 0.1) tailY = 0.5;

        localContext.lineTo(star.x + tailX, star.y + tailY);
        localContext.stroke();
        });
    }

    // Main animation loop
    function animate() {
        velocity.tx *= 0.96; // Damping for smoother velocity changes
        velocity.ty *= 0.96;

        velocity.x += (velocity.tx - velocity.x) * 0.8;
        velocity.y += (velocity.ty - velocity.y) * 0.8;

        stars.forEach((star) => {
        star.x += velocity.x * star.z; // Adjust x-position based on velocity and depth
        star.y += velocity.y * star.z; // Adjust y-position based on velocity and depth

        star.x += (star.x - width / 2) * velocity.z * star.z; // Radial motion effect
        star.y += (star.y - height / 2) * velocity.z * star.z;
        star.z += velocity.z; // Stars "move closer" with z-speed

        // Recycle stars that go off-screen
        if (
            star.x < -OVERFLOW_THRESHOLD ||
            star.x > width + OVERFLOW_THRESHOLD ||
            star.y < -OVERFLOW_THRESHOLD ||
            star.y > height + OVERFLOW_THRESHOLD
        ) {
            recycleStar(star);
        }
        });

        renderStars(); // Draw updated star positions
        requestAnimationFrame(animate); // Continue animation loop
    }

    // Repositions stars that leave the canvas
    function recycleStar(star: { x: number; y: number; z: number }) {
        star.z = STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE); // Reset depth
        star.x = Math.random() * width; // Random horizontal position
        star.y = Math.random() * height; // Random vertical position
    }

    generateStars(); // Create initial stars
    resize(); // Set initial canvas size
    animate(); // Start animation loop

    // Event listeners for interactivity and resizing
    window.addEventListener('resize', resize);
    localCanvas.addEventListener('mousemove', onMouseMove);
    localCanvas.addEventListener('touchmove', onTouchMove);
    localCanvas.addEventListener('mouseleave', onMouseLeave);
    });
</script>
  


  <div class="min-h-screen relative bg-black overflow-hidden">
    <canvas id="stars" class="absolute inset-0 pointer-events-none"></canvas>
    <div class="flex flex-col items-center justify-center text-center text-white relative z-10 min-h-screen">
        <!-- Text Section -->
        <div class="space-y-4">
            <h2 class="text-2xl sm:text-3xl md:text-4xl font-light"> Hi, my name is</h2>
            <h1 class="text-6xl sm:text-7xl md:text-8xl font-bold">Casey Dane</h1>
            <h3 class="text-lg sm:text-xl md:text-2xl font-medium"> I am a </h3>
            <h3 class="text-lg sm:text-xl md:text-2xl font-light">
                Currently I am a student at CSUF
            </h3>
        </div>

        <!-- Buttons Section -->
        <div class="mt-8 space-x-4">
            <a
                href="your_resume_link_here"
                target="_blank"
                class="px-6 py-3 bg-gray-700 text-white  font-bold rounded-lg shadow-lg hover:bg-white hover:text-gray-700 transition"
            >
                Resume
            </a>
            <a
                href="your_linkedin_link_here"
                target="_blank"
                class="px-6 py-3 bg-gray-700 text-white   font-bold rounded-lg shadow-lg hover:bg-white hover:text-gray-700 transition"
            >
                LinkedIn
            </a>
            <a
                href="your_github_link_here"
                target="_blank"
                class="px-6 py-3 bg-gray-700 text-white  font-bold rounded-lg shadow-lg hover:bg-white hover:text-gray-700 transition"
            >
                GitHub
            </a>
            <a
                href="mailto:your_email_here"
                class="px-6 py-3 bg-gray-700 text-white  font-bold rounded-lg shadow-lg hover:bg-white hover:text-gray-700 transition"
            >
                Email
            </a>
        </div>
    </div>
</div>



<!-- <div class="min-h-screen overflow-hidden">
    <canvas id="stars"></canvas>
    <div class= "flex flex-col">
        <div class="flex text-white">
            <h2>Hi my name is,</h2>
            <h1>Casey Dane</h1>
            <h3>I am an aspiring CS student at CSUF</h3>
        </div>
        <div> -->
            <!-- Buttons to link to resume, linkdIn, GitHub, and open default email application of system with my email listed -->
            <!-- <button on:click goto{() => }>Resume</button>   
            <button on:click goto{() => }>LinkdIn</button>
            <button on:click goto{() => }>GitHub</button>
            <button on:click goto{() => }>Email</button>   </div> -->
      

        <!-- Project Section: TDL at a later time, dont have enough projects to list
            <div>
            Place projects created down below
                Add arrow when clicked takes you to lower part of home page with cards for each project
            </div> -->
            
    <!-- </div>
</div> -->



