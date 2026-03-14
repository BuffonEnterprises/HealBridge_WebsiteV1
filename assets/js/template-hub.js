// Theme Switcher
document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // Check for saved theme preference or use device preference
    const savedTheme = localStorage.getItem('theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    // Apply saved theme
    if (savedTheme === 'dark') {
        htmlElement.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        htmlElement.removeAttribute('data-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
    
    // Theme toggle click event
    themeToggle.addEventListener('click', function() {
        if (htmlElement.getAttribute('data-theme') === 'dark') {
            htmlElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            htmlElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    });
    
    // Mobile menu
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Initialize Swiper
    if (typeof Swiper !== 'undefined' && document.querySelector('.testimonial-swiper')) {
        const testimonialSwiper = new Swiper('.testimonial-swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                },
            },
        });
        
        // Testimonial tabs
        const testimonialTabs = document.querySelectorAll('.testimonial-tab');
        const testimonialSlides = document.querySelectorAll('.swiper-slide');
        
        testimonialTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Update active tab
                testimonialTabs.forEach(t => {
                    t.classList.remove('active');
                    t.style.backgroundColor = 'var(--bg-color)';
                    t.style.color = 'var(--text-color)';
                });
                tab.classList.add('active');
                tab.style.backgroundColor = 'var(--primary-color)';
                tab.style.color = 'white';
                
                const category = tab.dataset.tab;
                
                // Filter testimonials
                if (category === 'all') {
                    testimonialSlides.forEach(slide => {
                        slide.style.display = 'block';
                    });
                } else {
                    testimonialSlides.forEach(slide => {
                        if (slide.dataset.category === category) {
                            slide.style.display = 'block';
                        } else {
                            slide.style.display = 'none';
                        }
                    });
                }
                
                // Update swiper
                testimonialSwiper.update();
                testimonialSwiper.slideTo(0);
            });
        });
    }
    
    // FAQ accordions
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const icon = question.querySelector('i');
            
            answer.classList.toggle('hidden');
            icon.classList.toggle('rotate-180');
        });
    });
    
    // Chatbot toggle
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotPanel = document.getElementById('chatbot-panel');
    
    if (chatbotToggle && chatbotPanel) {
        chatbotToggle.addEventListener('click', () => {
            chatbotPanel.style.display = chatbotPanel.style.display === 'block' ? 'none' : 'block';
        });
    }
    
    // Initialize AOS if available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });
    }
    
    // 3D Visualization
    try {
        if (typeof THREE !== 'undefined') {
            initCanvas();
        }
    } catch (e) {
        console.log('Three.js initialization skipped');
    }
});

// Three.js Canvas Initialization
function initCanvas() {
    if (!document.getElementById('canvas-container')) return;
    
    const container = document.getElementById('canvas-container');
    
    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f9fa);
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Add cubes for each template
    const templates = [
        { name: 'Residência', color: 0x42b983, position: new THREE.Vector3(-3, 1, 0) },
        { name: 'Vestibular', color: 0x4e63d7, position: new THREE.Vector3(-1.8, -1, 0) },
        { name: 'Liberdade', color: 0xf59e0b, position: new THREE.Vector3(-0.6, 1, 0) },
        { name: 'R+', color: 0xef4444, position: new THREE.Vector3(0.6, -1, 0) },
        { name: 'Faculdade', color: 0x8b5cf6, position: new THREE.Vector3(1.8, 1, 0) },
        { name: 'Notion', color: 0x10b981, position: new THREE.Vector3(3, -1, 0) }
    ];
    
    const cubes = [];
    templates.forEach(template => {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshLambertMaterial({ color: template.color });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.copy(template.position);
        scene.add(cube);
        cubes.push(cube);
    });
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Add connections between templates
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xcccccc, opacity: 0.6, transparent: true });
    
    for (let i = 0; i < cubes.length - 1; i++) {
        const points = [];
        points.push(cubes[i].position);
        points.push(cubes[i + 1].position);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, lineMaterial);
        scene.add(line);
    }
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        cubes.forEach(cube => {
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
        });
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
    
    // Update canvas theme when theme changes
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.attributeName === 'data-theme') {
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                scene.background = new THREE.Color(isDark ? 0x1e1e1e : 0xf8f9fa);
            }
        });
    });
    
    observer.observe(document.documentElement, { attributes: true });
}

// Recommender steps navigation
let currentStep = 1;

function nextStep() {
    const currentStepElement = document.getElementById(`step-${currentStep}`);
    if (currentStepElement) {
        currentStepElement.classList.remove('active');
        currentStepElement.style.display = 'none';
        currentStep++;
        const nextStepElement = document.getElementById(`step-${currentStep}`);
        if (nextStepElement) {
            nextStepElement.classList.add('active');
            nextStepElement.style.display = 'block';
        }
    }
}

function prevStep() {
    const currentStepElement = document.getElementById(`step-${currentStep}`);
    if (currentStepElement) {
        currentStepElement.classList.remove('active');
        currentStepElement.style.display = 'none';
        currentStep--;
        const prevStepElement = document.getElementById(`step-${currentStep}`);
        if (prevStepElement) {
            prevStepElement.classList.add('active');
            prevStepElement.style.display = 'block';
        }
    }
}

function showResults() {
    const currentStepElement = document.getElementById(`step-${currentStep}`);
    if (currentStepElement) {
        currentStepElement.classList.remove('active');
        currentStepElement.style.display = 'none';
        const resultsElement = document.getElementById('recommender-results');
        if (resultsElement) {
            resultsElement.classList.add('active');
            resultsElement.style.display = 'block';
        }
    }
}

function resetRecommender() {
    const resultsElement = document.getElementById('recommender-results');
    if (resultsElement) {
        resultsElement.classList.remove('active');
        resultsElement.style.display = 'none';
    }
    
    currentStep = 1;
    
    const firstStepElement = document.getElementById('step-1');
    if (firstStepElement) {
        firstStepElement.classList.add('active');
        firstStepElement.style.display = 'block';
    }
}

// Chatbot functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get chatbot elements
    const chatbotToggle = document.querySelector('.chatbot-toggle');
    const chatbotContainer = document.querySelector('.chatbot-container');
    const chatbotClose = document.querySelector('.chatbot-close');
    
    if (chatbotToggle && chatbotContainer) {
        // Toggle chatbot visibility
        chatbotToggle.addEventListener('click', function() {
            chatbotContainer.classList.toggle('hidden');
        });
        
        // Close chatbot
        if (chatbotClose) {
            chatbotClose.addEventListener('click', function() {
                chatbotContainer.classList.add('hidden');
            });
        }
    }
    
    // Template selection in interactive viewer
    const templateButtons = document.querySelectorAll('.md\\:w-1\\/4 button');
    const templateName = document.querySelector('.md\\:w-3\\/4 h3');
    const templatePreview = document.querySelector('.template-preview img');
    
    if (templateButtons.length && templateName && templatePreview) {
        templateButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Reset all buttons
                templateButtons.forEach(btn => {
                    btn.classList.remove('text-white', 'bg-green-500', 'hover:bg-green-600');
                    btn.classList.add('text-color', 'bg-light');
                    btn.style.color = 'var(--text-color)';
                    btn.style.backgroundColor = 'var(--bg-light)';
                });
                
                // Highlight selected button
                this.classList.remove('text-color', 'bg-light');
                this.classList.add('text-white', 'bg-green-500', 'hover:bg-green-600');
                this.style.color = 'white';
                this.style.backgroundColor = 'var(--primary-color)';
                
                // Update template details based on selection
                const templateTitle = this.textContent.trim();
                templateName.textContent = templateTitle;
                
                // Update preview image based on selection
                let previewImage = 'assets/img/portfolio/notion-template-r-plus.jpg';
                
                switch (templateTitle) {
                    case 'Projeto Vestibular':
                        previewImage = 'assets/img/masonry-portfolio/masonry-portfolio-5.jpg';
                        break;
                    case 'Liberdade para Criar':
                        previewImage = 'assets/img/portfolio/criar.jpg';
                        break;
                    case 'Projeto R+':
                        previewImage = 'assets/img/portfolio/rplus.jpg';
                        break;
                    case 'Projeto Faculdade':
                        previewImage = 'assets/img/portfolio/faculdade.jpg';
                        break;
                    case 'R+ Tainá para Notion':
                        previewImage = 'assets/img/PRINTtemplatenotion.png';
                        break;
                }
                
                templatePreview.src = previewImage;
            });
        });
    }
    
    // Initialize recommender steps
    const recommenderSteps = document.querySelectorAll('.recommender-step');
    
    if (recommenderSteps.length > 0) {
        recommenderSteps.forEach((step, index) => {
            if (index === 0) {
                step.classList.add('active');
                step.style.display = 'block';
            } else {
                step.classList.remove('active');
                step.style.display = 'none';
            }
        });
    }
    
    // Initialize recommender options
    const recommenderOptions = document.querySelectorAll('.recommender-option');
    
    if (recommenderOptions.length > 0) {
        recommenderOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Get parent step
                const step = this.closest('.recommender-step');
                
                // Reset all options in this step
                const options = step.querySelectorAll('.recommender-option');
                options.forEach(opt => {
                    opt.classList.remove('selected');
                    opt.style.backgroundColor = 'var(--bg-light)';
                    opt.style.border = 'none';
                });
                
                // Highlight selected option
                this.classList.add('selected');
                this.style.backgroundColor = 'rgba(66, 185, 131, 0.1)';
                this.style.border = '2px solid var(--primary-color)';
            });
        });
    }
}