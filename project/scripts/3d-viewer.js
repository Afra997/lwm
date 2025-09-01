// 3D Viewer and Artifact Interaction

class Artifact3DViewer {
    constructor() {
        this.artifacts = new Map();
        this.currentArtifact = null;
        this.rotationSpeed = 0.01;
        this.isRotating = false;
        this.rotationX = 0;
        this.rotationY = 0;
        this.scale = 1;
        this.isDragging = false;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        
        this.init();
    }

    init() {
        this.createArtifactModels();
        this.setupViewerControls();
        this.setupHeroArtifact();
        this.setupGalleryArtifacts();
    }

    createArtifactModels() {
        // Simulated 3D artifact data
        this.artifacts.set('rifle', {
            name: 'Liberation War Rifle',
            description: 'Standard issue rifle used by Mukti Bahini forces',
            year: '1971',
            category: 'weapons',
            dimensions: '76.2 × 5.1 × 15.2 cm',
            material: 'Steel, Wood',
            vertices: this.generateRifleVertices(),
            textures: ['#8B4513', '#2F4F4F', '#696969']
        });

        this.artifacts.set('document', {
            name: 'Independence Declaration',
            description: 'Original proclamation of independence document',
            year: 'March 1971',
            category: 'documents',
            dimensions: '21.0 × 29.7 cm',
            material: 'Paper, Ink',
            vertices: this.generateDocumentVertices(),
            textures: ['#F5F5DC', '#8B4513', '#2F4F4F']
        });

        this.artifacts.set('uniform', {
            name: 'Freedom Fighter Uniform',
            description: 'Complete uniform worn during liberation operations',
            year: '1971',
            category: 'uniforms',
            dimensions: 'Size Medium',
            material: 'Cotton, Leather',
            vertices: this.generateUniformVertices(),
            textures: ['#556B2F', '#8B4513', '#2F4F4F']
        });

        this.artifacts.set('medal', {
            name: 'Bir Sreshtho Medal',
            description: 'Highest military honor for exceptional bravery',
            year: '1973',
            category: 'medals',
            dimensions: '5.0 × 5.0 cm',
            material: 'Gold, Brass',
            vertices: this.generateMedalVertices(),
            textures: ['#FFD700', '#B8860B', '#DAA520']
        });
    }

    generateRifleVertices() {
        // Simplified rifle geometry
        return {
            barrel: { length: 60, width: 2, height: 2 },
            stock: { length: 20, width: 8, height: 15 },
            trigger: { size: 3 },
            sight: { height: 5 }
        };
    }

    generateDocumentVertices() {
        // Document geometry
        return {
            page: { width: 21, height: 29.7, thickness: 0.1 },
            text: { lines: 25, fontSize: 1.2 },
            seal: { diameter: 3, thickness: 0.2 }
        };
    }

    generateUniformVertices() {
        // Uniform geometry
        return {
            jacket: { chest: 100, length: 60 },
            pants: { waist: 80, length: 100 },
            buttons: { count: 8, diameter: 1.5 },
            insignia: { width: 5, height: 3 }
        };
    }

    generateMedalVertices() {
        // Medal geometry
        return {
            disc: { diameter: 4, thickness: 0.3 },
            ribbon: { width: 3, length: 8 },
            inscription: { depth: 0.1 },
            star: { points: 5, radius: 1.5 }
        };
    }

    setupHeroArtifact() {
        const heroArtifact = document.getElementById('artifact3D');
        if (!heroArtifact) return;

        this.renderArtifact(heroArtifact, 'rifle');
        this.setupArtifactInteraction(heroArtifact);
        
        // Auto-rotate hero artifact
        setInterval(() => {
            if (!this.isDragging) {
                this.rotationY += this.rotationSpeed;
                this.updateArtifactRotation(heroArtifact);
            }
        }, 16);
    }

    setupGalleryArtifacts() {
        const galleryArtifacts = document.querySelectorAll('.artifact-3d');
        galleryArtifacts.forEach((artifact, index) => {
            const models = ['rifle', 'document', 'uniform', 'medal'];
            const modelType = artifact.dataset.model || models[index % models.length];
            this.renderArtifact(artifact, modelType);
            this.setupArtifactInteraction(artifact);
        });
    }

    renderArtifact(container, artifactType) {
        const artifact = this.artifacts.get(artifactType);
        if (!artifact) return;

        // Clear existing content
        container.innerHTML = '';

        // Create 3D representation
        const artifactElement = document.createElement('div');
        artifactElement.className = 'artifact-3d-model';
        artifactElement.style.cssText = `
            width: 100%;
            height: 100%;
            position: relative;
            transform-style: preserve-3d;
            transition: transform 0.3s ease;
        `;

        // Create geometric shapes based on artifact type
        this.createArtifactGeometry(artifactElement, artifact);
        
        container.appendChild(artifactElement);
        container.dataset.artifactType = artifactType;
    }

    createArtifactGeometry(container, artifact) {
        const { vertices, textures } = artifact;
        
        // Create main shape
        const mainShape = document.createElement('div');
        mainShape.className = 'artifact-shape';
        mainShape.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotateX(15deg) rotateY(25deg);
            background: linear-gradient(45deg, ${textures[0]}, ${textures[1]});
            border-radius: 8px;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
            transition: transform 0.3s ease;
        `;

        // Set dimensions based on artifact type
        switch (artifact.name.toLowerCase()) {
            case 'liberation war rifle':
                mainShape.style.width = '80%';
                mainShape.style.height = '20px';
                mainShape.style.background = `linear-gradient(45deg, ${textures[0]}, ${textures[1]})`;
                break;
            case 'independence declaration':
                mainShape.style.width = '60%';
                mainShape.style.height = '80%';
                mainShape.style.background = `linear-gradient(45deg, ${textures[0]}, ${textures[1]})`;
                break;
            case 'freedom fighter uniform':
                mainShape.style.width = '70%';
                mainShape.style.height = '85%';
                mainShape.style.borderRadius = '15px';
                break;
            case 'bir sreshtho medal':
                mainShape.style.width = '40%';
                mainShape.style.height = '40%';
                mainShape.style.borderRadius = '50%';
                mainShape.style.background = `radial-gradient(circle, ${textures[0]}, ${textures[1]})`;
                break;
            default:
                mainShape.style.width = '60%';
                mainShape.style.height = '60%';
        }

        container.appendChild(mainShape);

        // Add detail elements
        this.addArtifactDetails(container, artifact);
    }

    addArtifactDetails(container, artifact) {
        // Add small detail elements for realism
        for (let i = 0; i < 3; i++) {
            const detail = document.createElement('div');
            detail.className = 'artifact-detail';
            detail.style.cssText = `
                position: absolute;
                width: ${Math.random() * 10 + 5}px;
                height: ${Math.random() * 10 + 5}px;
                background: ${artifact.textures[2]};
                border-radius: 50%;
                top: ${Math.random() * 80 + 10}%;
                left: ${Math.random() * 80 + 10}%;
                opacity: 0.7;
                animation: float ${Math.random() * 3 + 2}s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
            `;
            container.appendChild(detail);
        }
    }

    setupArtifactInteraction(container) {
        let isMouseDown = false;
        let startX = 0;
        let startY = 0;
        let currentRotationX = 15;
        let currentRotationY = 25;

        container.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            this.isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            container.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isMouseDown) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            currentRotationY += deltaX * 0.5;
            currentRotationX -= deltaY * 0.5;
            
            // Limit rotation
            currentRotationX = Math.max(-60, Math.min(60, currentRotationX));
            
            const model = container.querySelector('.artifact-shape');
            if (model) {
                model.style.transform = `translate(-50%, -50%) rotateX(${currentRotationX}deg) rotateY(${currentRotationY}deg)`;
            }
        });

        document.addEventListener('mouseup', () => {
            isMouseDown = false;
            this.isDragging = false;
            container.style.cursor = 'grab';
        });

        // Touch events for mobile
        container.addEventListener('touchstart', (e) => {
            isMouseDown = true;
            this.isDragging = true;
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
        });

        document.addEventListener('touchmove', (e) => {
            if (!isMouseDown) return;
            e.preventDefault();
            
            const touch = e.touches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;
            
            currentRotationY += deltaX * 0.5;
            currentRotationX -= deltaY * 0.5;
            
            currentRotationX = Math.max(-60, Math.min(60, currentRotationX));
            
            const model = container.querySelector('.artifact-shape');
            if (model) {
                model.style.transform = `translate(-50%, -50%) rotateX(${currentRotationX}deg) rotateY(${currentRotationY}deg)`;
            }
        });

        document.addEventListener('touchend', () => {
            isMouseDown = false;
            this.isDragging = false;
        });

        // Zoom functionality
        container.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY * -0.001;
            this.scale = Math.max(0.5, Math.min(2, this.scale + delta));
            
            const model = container.querySelector('.artifact-shape');
            if (model) {
                model.style.transform += ` scale(${this.scale})`;
            }
        });
    }

    updateArtifactRotation(container) {
        const model = container.querySelector('.artifact-shape');
        if (model && !this.isDragging) {
            model.style.transform = `translate(-50%, -50%) rotateX(15deg) rotateY(${this.rotationY}rad) scale(${this.scale})`;
        }
    }

    setupViewerControls() {
        const controlBtns = document.querySelectorAll('.control-btn');
        controlBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.dataset.action;
                this.handleViewerAction(action, btn.closest('.artifact-viewer') || btn.closest('.artifact-3d-viewer'));
            });
        });
    }

    handleViewerAction(action, container) {
        switch (action) {
            case 'rotate':
                this.toggleAutoRotation(container);
                break;
            case 'zoom':
                this.zoomArtifact(container);
                break;
            case 'fullscreen':
                this.toggleFullscreen(container);
                break;
            case 'info':
                this.showArtifactInfo(container);
                break;
        }
    }

    toggleAutoRotation(container) {
        const model = container.querySelector('.artifact-shape');
        if (!model) return;

        this.isRotating = !this.isRotating;
        
        if (this.isRotating) {
            const rotateInterval = setInterval(() => {
                if (!this.isRotating) {
                    clearInterval(rotateInterval);
                    return;
                }
                this.rotationY += this.rotationSpeed;
                this.updateArtifactRotation(container);
            }, 16);
        }
    }

    zoomArtifact(container) {
        const model = container.querySelector('.artifact-shape');
        if (!model) return;

        this.scale = this.scale === 1 ? 1.5 : 1;
        model.style.transform += ` scale(${this.scale})`;
    }

    toggleFullscreen(container) {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            container.requestFullscreen().catch(err => {
                console.log('Fullscreen not supported');
            });
        }
    }

    showArtifactInfo(container) {
        const artifactType = container.dataset.artifactType;
        if (artifactType) {
            const artifact = this.artifacts.get(artifactType);
            this.displayArtifactModal(artifact);
        }
    }

    displayArtifactModal(artifact) {
        const modal = document.getElementById('artifactModal');
        const modalTitle = document.getElementById('modalTitle');
        const detailsTab = document.getElementById('detailsTab');
        
        if (modal && modalTitle && detailsTab) {
            modalTitle.textContent = artifact.name;
            
            // Update details
            const detailGrid = detailsTab.querySelector('.detail-grid');
            if (detailGrid) {
                detailGrid.innerHTML = `
                    <div class="detail-item">
                        <label>Period:</label>
                        <span>${artifact.year}</span>
                    </div>
                    <div class="detail-item">
                        <label>Category:</label>
                        <span>${artifact.category}</span>
                    </div>
                    <div class="detail-item">
                        <label>Material:</label>
                        <span>${artifact.material}</span>
                    </div>
                    <div class="detail-item">
                        <label>Dimensions:</label>
                        <span>${artifact.dimensions}</span>
                    </div>
                `;
            }
            
            // Render 3D model in modal
            const modalViewer = document.getElementById('modal3DViewer');
            if (modalViewer) {
                this.renderModalArtifact(modalViewer, artifact);
            }
            
            modal.classList.add('active');
        }
    }

    renderModalArtifact(container, artifact) {
        const artifactElement = document.createElement('div');
        artifactElement.className = 'modal-artifact-3d';
        artifactElement.style.cssText = `
            width: 300px;
            height: 300px;
            position: relative;
            transform-style: preserve-3d;
            cursor: grab;
        `;

        this.createArtifactGeometry(artifactElement, artifact);
        this.setupArtifactInteraction(artifactElement);
        
        container.innerHTML = '';
        container.appendChild(artifactElement);
    }

    createArtifactGeometry(container, artifact) {
        const mainShape = document.createElement('div');
        mainShape.className = 'artifact-shape';
        mainShape.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotateX(15deg) rotateY(25deg);
            background: linear-gradient(45deg, ${artifact.textures[0]}, ${artifact.textures[1]});
            border-radius: 8px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            transition: transform 0.3s ease;
        `;

        // Set dimensions and specific styling based on artifact
        this.setArtifactDimensions(mainShape, artifact);
        
        container.appendChild(mainShape);
        this.addArtifactDetails(container, artifact);
    }

    setArtifactDimensions(element, artifact) {
        switch (artifact.name.toLowerCase()) {
            case 'liberation war rifle':
                element.style.width = '200px';
                element.style.height = '30px';
                element.style.borderRadius = '15px';
                break;
            case 'independence declaration':
                element.style.width = '150px';
                element.style.height = '200px';
                element.style.borderRadius = '5px';
                break;
            case 'freedom fighter uniform':
                element.style.width = '120px';
                element.style.height = '180px';
                element.style.borderRadius = '20px';
                break;
            case 'bir sreshtho medal':
                element.style.width = '80px';
                element.style.height = '80px';
                element.style.borderRadius = '50%';
                break;
            default:
                element.style.width = '100px';
                element.style.height = '100px';
        }
    }

    addArtifactDetails(container, artifact) {
        // Add surface details and textures
        const detailCount = artifact.name.includes('rifle') ? 5 : 3;
        
        for (let i = 0; i < detailCount; i++) {
            const detail = document.createElement('div');
            detail.className = 'surface-detail';
            detail.style.cssText = `
                position: absolute;
                width: ${Math.random() * 8 + 3}px;
                height: ${Math.random() * 8 + 3}px;
                background: ${artifact.textures[2]};
                border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
                top: ${Math.random() * 70 + 15}%;
                left: ${Math.random() * 70 + 15}%;
                opacity: ${Math.random() * 0.5 + 0.3};
                animation: subtleFloat ${Math.random() * 4 + 3}s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
            `;
            container.appendChild(detail);
        }
    }

    // Simulate lighting effects
    addLightingEffects(container) {
        const lighting = document.createElement('div');
        lighting.className = 'artifact-lighting';
        lighting.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, 
                rgba(255, 255, 255, 0.3) 0%, 
                transparent 30%, 
                transparent 70%, 
                rgba(0, 0, 0, 0.2) 100%);
            pointer-events: none;
            border-radius: inherit;
        `;
        container.appendChild(lighting);
    }

    // Enhanced interaction for premium feel
    enhanceArtifactHover(container) {
        container.addEventListener('mouseenter', () => {
            const shape = container.querySelector('.artifact-shape');
            if (shape) {
                shape.style.transform += ' scale(1.05)';
                shape.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.4)';
            }
        });

        container.addEventListener('mouseleave', () => {
            const shape = container.querySelector('.artifact-shape');
            if (shape) {
                shape.style.transform = shape.style.transform.replace(' scale(1.05)', '');
                shape.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
            }
        });
    }
}

// CSS animations for 3D effects
const style3D = document.createElement('style');
style3D.textContent = `
    @keyframes subtleFloat {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        25% { transform: translateY(-2px) rotate(1deg); }
        50% { transform: translateY(-1px) rotate(0deg); }
        75% { transform: translateY(-3px) rotate(-1deg); }
    }
    
    .artifact-3d-model {
        perspective: 1000px;
    }
    
    .artifact-shape {
        transform-style: preserve-3d;
        will-change: transform;
    }
    
    .artifact-shape::before {
        content: '';
        position: absolute;
        top: 100%;
        left: 10%;
        right: 10%;
        height: 10px;
        background: radial-gradient(ellipse, rgba(0, 0, 0, 0.3), transparent);
        border-radius: 50%;
        transform: rotateX(90deg) translateZ(-10px);
    }
`;
document.head.appendChild(style3D);

// Initialize 3D viewer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Artifact3DViewer();
});

// Export for use in other modules
window.Artifact3DViewer = Artifact3DViewer;