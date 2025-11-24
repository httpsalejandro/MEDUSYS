// Animación de intro con logo y pulso
const introTL = gsap.timeline();

// Inicial: mostrar el logo y el fondo
introTL.to(".logo-pulse", { opacity: 1, duration: 1 })
       .to(".intro-background", { opacity: 1, duration: 1 }, "-=1")

// Crear pulsos: hacemos 3 pulsos
.to(".logo-pulse", { 
    scale: 1.1, 
    duration: 0.5, 
    repeat: 3, 
    yoyo: true 
})
.to(".pulse-glow", { 
    opacity: 0.6, 
    scale: 1.2, 
    duration: 0.5, 
    repeat: 3, 
    yoyo: true 
}, "-=1.5")

// Pulso final más intenso
.to(".logo-pulse", { 
    scale: 1.5, 
    opacity: 0, 
    duration: 0.8 
})
.to(".pulse-glow", { 
    scale: 2, 
    opacity: 0, 
    duration: 0.8 
}, "-=0.8")
.to(".intro-background", { 
    opacity: 0, 
    duration: 0.8 
}, "-=0.8")

// Ocultar intro y mostrar contenido
.to("#intro", { 
    opacity: 0, 
    duration: 0.5, 
    onComplete: function() {
        document.getElementById("intro").style.display = "none";
        new NeuronNavigation();
    } 
});

class NeuronNavigation {
    constructor() {
        this.currentSection = 'hero';
        this.isZoomed = false;
        this.heartRotation = 0;
        this.heartScale = 1;
        this.connections = [];
        this.pulsePositions = new Map();
        this.connectionIntensity = 0.8;
        this.pulseSize = 6;
        this.init();
    }

    init() {
        this.setupCanvas();
        this.setupNodes();
        this.setupAudio();
        this.setupBackButton();
        this.setup3DModel();
        this.setupStoryInteractions();
        this.setupTechInteractions();
        this.setupScanner();
        this.setupTimeline();
        this.calculateConnections();
        this.animate();
    }

    setupCanvas() {
        this.canvas = document.getElementById('neuronCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.calculateConnections();
        });
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    calculateConnections() {
        this.connections = [];
        this.pulsePositions.clear();
        
        const nodes = Array.from(this.nodes);
        
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const node1 = nodes[i];
                const node2 = nodes[j];
                
                const rect1 = node1.getBoundingClientRect();
                const rect2 = node2.getBoundingClientRect();
                
                const x1 = rect1.left + rect1.width / 2;
                const y1 = rect1.top + rect1.height / 2;
                const x2 = rect2.left + rect2.width / 2;
                const y2 = rect2.top + rect2.height / 2;
                
                const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
                
                const connection = {
                    x1, y1, x2, y2, distance,
                    pulse: Math.random() * distance
                };
                this.connections.push(connection);
                this.pulsePositions.set(connection, connection.pulse);
            }
        }
    }

    setupNodes() {
        this.nodes = document.querySelectorAll('.neuron-node');
        this.sections = document.querySelectorAll('.content-section');
        this.glitchOverlay = document.querySelector('.glitch-overlay');
        
        this.nodes.forEach(node => {
            node.addEventListener('click', (e) => {
                e.stopPropagation();
                const targetSection = node.getAttribute('data-section');
                this.navigateToSection(targetSection, node);
            });
        });

        document.querySelectorAll('[data-node]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetNode = e.target.getAttribute('data-node');
                this.navigateToSection(targetNode);
            });
        });

        const observer = new MutationObserver(() => {
            setTimeout(() => this.calculateConnections(), 100);
        });

        this.nodes.forEach(node => {
            observer.observe(node, { 
                attributes: true, 
                attributeFilter: ['style'] 
            });
        });
    }

    navigateToSection(sectionId, clickedNode = null) {
        if (this.currentSection === sectionId && this.isZoomed) return;

        if (sectionId === 'contexto') {
            this.triggerGlitchEffect();
        }

        if (!clickedNode) {
            clickedNode = document.querySelector(`[data-section="${sectionId}"]`);
        }

        this.currentSection = sectionId;
        this.isZoomed = true;

        document.querySelector('.neuron-main').classList.add('zoomed');
        // ocultar control de audio cuando se abre un panel de nodo
        if (this.audioControl) this.audioControl.classList.add('hidden');
        document.getElementById('backButton').classList.add('visible');

        // limpiar clases previas
        this.nodes.forEach(node => {
            node.classList.remove('active-node', 'selected-node', 'dimmed');
        });

        // aplicar: solo el nodo seleccionado se marca y el resto se atenúa
        this.nodes.forEach(node => {
            if (node === clickedNode) {
                node.classList.add('active-node', 'selected-node');
            } else {
                node.classList.add('dimmed');
            }
        });

        this.sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === `${sectionId}-content`) {
                setTimeout(() => {
                    section.classList.add('active');
                    this.triggerSectionAnimations(sectionId);
                }, 300);
            }
        });

        // recalcular después de reposicionar
        setTimeout(() => this.calculateConnections(), 600);
        this.playNavigationSound();
    }

    triggerGlitchEffect() {
        if (this.glitchOverlay) {
            this.glitchOverlay.classList.add('active');
            setTimeout(() => {
                this.glitchOverlay.classList.remove('active');
            }, 500);
        }
    }

    triggerSectionAnimations(sectionId) {
        switch(sectionId) {
            case 'contexto':
                this.animateContextoSection();
                break;
            case 'tecnologia':
                this.animateTecnologiaSection();
                break;
            case 'historias':
                this.animateHistoriasSection();
                break;
            case 'corazon':
                this.animateCorazonSection();
                break;
        }
    }

    animateContextoSection() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('active');
            }, index * 600);
        });
    }

    animateTecnologiaSection() {
        const techItems = document.querySelectorAll('.tech-item');
        techItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 300);
        });
    }

    animateHistoriasSection() {
        const storyCards = document.querySelectorAll('.story-card');
        storyCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 400);
        });
    }

    animateCorazonSection() {
        const heartParts = document.querySelectorAll('.heart-part');
        heartParts.forEach((part, index) => {
            setTimeout(() => {
                part.style.opacity = '1';
                part.style.transform = 'scale(1)';
            }, index * 200);
        });
    }

    setupTimeline() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach(item => {
            item.addEventListener('click', () => {
                const year = item.getAttribute('data-year');
                this.activateTimelineItem(year);
            });
        });
    }

    activateTimelineItem(year) {
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-year') === year) {
                item.classList.add('active');
            }
        });
    }

    setupStoryInteractions() {
        const storyCards = document.querySelectorAll('.story-card');
        storyCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const person = card.getAttribute('data-person');
                this.activatePersonEffect(person);
            });
            
            card.addEventListener('mouseleave', () => {
                this.deactivatePersonEffects();
            });
        });
    }

    activatePersonEffect(person) {
        const effects = {
            valeria: () => this.highlightConnections('historias'),
            guadalupe: () => this.highlightConnections('corazon'),
            fermin: () => this.highlightConnections('tecnologia')
        };

        if (effects[person]) {
            effects[person]();
        }
    }

    deactivatePersonEffects() {
        this.connections.forEach(conn => {
            conn.highlighted = false;
        });
    }

    highlightConnections(targetSection) {
        this.connections.forEach(conn => {
            conn.highlighted = true;
        });
    }

    setupTechInteractions() {
        const techItems = document.querySelectorAll('.tech-item');
        techItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const type = Array.from(item.classList).find(cls => 
                    cls.includes('connectivity') || 
                    cls.includes('functionality') || 
                    cls.includes('aesthetic')
                );
                this.activateTechEffect(type);
            });
        });
    }

    activateTechEffect(type) {
        console.log(`Activando efecto tecnológico: ${type}`);
    }

    setup3DModel() {
        this.heartModel = document.querySelector('.heart-3d');
        this.heartParts = document.querySelectorAll('.heart-part');
        this.infoPanels = document.querySelectorAll('.info-panel');
        this.controls = document.querySelectorAll('.control-btn');
        
        if (this.heartModel) {
            this.controls.forEach(control => {
                control.addEventListener('click', (e) => {
                    const action = e.target.getAttribute('data-action');
                    
                    switch(action) {
                        case 'rotate':
                            this.heartRotation += 45;
                            break;
                        case 'zoom-in':
                            this.heartScale = Math.min(this.heartScale + 0.1, 2);
                            break;
                        case 'reset':
                            this.heartRotation = 0;
                            this.heartScale = 1;
                            break;
                    }
                    
                    this.heartModel.style.transform = `rotateY(${this.heartRotation}deg) scale(${this.heartScale})`;
                });
            });

            this.heartParts.forEach(part => {
                part.addEventListener('click', (e) => {
                    const partInfo = e.target.getAttribute('data-info');
                    this.showPartInfo(partInfo);
                    
                    this.heartParts.forEach(p => p.classList.remove('active'));
                    e.target.classList.add('active');
                });
            });
        }
    }

    showPartInfo(partInfo) {
        this.infoPanels.forEach(panel => {
            panel.classList.remove('active');
            if (panel.getAttribute('data-info') === partInfo) {
                panel.classList.add('active');
            }
        });
    }

    setupScanner() {
        const startScanBtn = document.getElementById('startScan');
        const scanProgress = document.querySelector('.scan-progress');
        const scanResults = document.getElementById('scanResults');
        const organMarkers = document.querySelectorAll('.organ-marker');

        if (startScanBtn) {
            startScanBtn.addEventListener('click', () => {
                startScanBtn.disabled = true;
                startScanBtn.textContent = 'Escaneando...';
                if (scanProgress) scanProgress.classList.add('scanning');

                setTimeout(() => {
                    startScanBtn.disabled = false;
                    startScanBtn.textContent = 'Iniciar Escaneo';
                    if (scanProgress) scanProgress.classList.remove('scanning');
                    
                    if (scanResults) {
                        scanResults.innerHTML = `
                            <h4>✅ Compatibilidad Confirmada</h4>
                            <p>Perfil biológico compatible con nuestras soluciones:</p>
                            <ul>
                                <li>Corazón Artificial: 98% de compatibilidad</li>
                                <li>Prótesis de Brazo: 95% de compatibilidad</li>
                                <li>Prótesis de Pierna: 92% de compatibilidad</li>
                            </ul>
                            <p><strong>Recomendación:</strong> Contactar con nuestro equipo médico</p>
                        `;
                        scanResults.classList.add('visible');
                    }
                }, 3000);
            });
        }

        organMarkers.forEach(marker => {
            marker.addEventListener('click', (e) => {
                const organ = e.target.getAttribute('data-organ');
                this.highlightOrgan(organ);
            });
        });
    }

    highlightOrgan(organ) {
        console.log(`Órgano seleccionado: ${organ}`);
        const markers = document.querySelectorAll('.organ-marker');
        markers.forEach(marker => {
            marker.style.background = 'var(--primary)';
            marker.style.transform = 'scale(1)';
            if (marker.getAttribute('data-organ') === organ) {
                marker.style.background = 'var(--lilac)';
                marker.style.transform = 'scale(1.5)';
            }
        });
    }

    navigateBack() {
        this.isZoomed = false;
        this.currentSection = 'hero';

        document.querySelector('.neuron-main').classList.remove('zoomed');
        document.getElementById('backButton').classList.remove('visible');

        // mostrar control de audio de nuevo
        if (this.audioControl) this.audioControl.classList.remove('hidden');

        // eliminar clases específicas aplicadas
        this.nodes.forEach(node => {
            node.classList.remove('active-node', 'selected-node', 'dimmed');
        });

        this.sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === 'hero-content') {
                setTimeout(() => {
                    section.classList.add('active');
                    this.calculateConnections();
                }, 300);
            }
        });
    }

    setupBackButton() {
        const backBtn = document.getElementById('backButton');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.navigateBack();
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isZoomed) {
                this.navigateBack();
            }
        });
    }

    setupAudio() {
        this.audio = document.getElementById('ambientAudio');
        this.audioToggle = document.getElementById('audioToggle');
        this.audioControl = document.querySelector('.audio-control'); // <-- referencia usada para ocultar/mostrar
        
        if (this.audio && this.audioToggle) {
            this.isAudioPlaying = false;

            this.audioToggle.addEventListener('click', () => {
                if (this.isAudioPlaying) {
                    this.audio.pause();
                    this.audioToggle.style.background = 'var(--glass)';
                } else {
                    this.audio.play().catch(e => console.log('Audio play failed:', e));
                    this.audioToggle.style.background = 'var(--primary)';
                }
                this.isAudioPlaying = !this.isAudioPlaying;
            });

            this.audio.volume = 0.3;
        }
    }

    playNavigationSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (e) {
            console.log('Audio context not supported:', e);
        }
    }

    drawNeuronalConnections() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.lineCap = 'round';
        this.ctx.shadowBlur = 15;

        this.connections.forEach(connection => {
            if (connection.highlighted) {
                this.ctx.strokeStyle = 'rgba(196, 162, 252, 0.9)';
                this.ctx.lineWidth = 6;
                this.ctx.shadowColor = 'rgba(196, 162, 252, 0.8)';
            } else {
                this.ctx.strokeStyle = 'rgba(147, 185, 224, 0.8)';
                this.ctx.lineWidth = 4;
                this.ctx.shadowColor = 'rgba(147, 185, 224, 0.6)';
            }
            
            this.ctx.beginPath();
            this.ctx.moveTo(connection.x1, connection.y1);
            this.ctx.lineTo(connection.x2, connection.y2);
            this.ctx.stroke();

            const pulseSpeed = 0.004;
            let currentPulse = this.pulsePositions.get(connection) || 0;
            currentPulse = (currentPulse + pulseSpeed * connection.distance) % connection.distance;
            this.pulsePositions.set(connection, currentPulse);

            const pulseX = connection.x1 + (connection.x2 - connection.x1) * (currentPulse / connection.distance);
            const pulseY = connection.y1 + (connection.y2 - connection.y1) * (currentPulse / connection.distance);

            if (connection.highlighted) {
                this.ctx.fillStyle = 'rgba(196, 162, 252, 0.4)';
                this.ctx.beginPath();
                this.ctx.arc(pulseX, pulseY, 12, 0, Math.PI * 2);
                this.ctx.fill();

                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                this.ctx.beginPath();
                this.ctx.arc(pulseX, pulseY, 8, 0, Math.PI * 2);
                this.ctx.fill();

                this.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
                this.ctx.beginPath();
                this.ctx.arc(pulseX, pulseY, 4, 0, Math.PI * 2);
                this.ctx.fill();
            } else {
                this.ctx.fillStyle = 'rgba(147, 185, 224, 0.5)';
                this.ctx.beginPath();
                this.ctx.arc(pulseX, pulseY, 10, 0, Math.PI * 2);
                this.ctx.fill();

                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                this.ctx.beginPath();
                this.ctx.arc(pulseX, pulseY, 6, 0, Math.PI * 2);
                this.ctx.fill();

                this.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
                this.ctx.beginPath();
                this.ctx.arc(pulseX, pulseY, 3, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });

        this.ctx.shadowBlur = 0;
    }

    animate() {
        this.drawNeuronalConnections();
        requestAnimationFrame(() => this.animate());
    }
}

// Agregar estilos CSS dinámicos para animaciones
const dynamicStyles = `
    @keyframes neuronPulse {
        0% { transform: scale(1); opacity: 0.7; }
        50% { transform: scale(1.1); opacity: 1; }
        100% { transform: scale(1); opacity: 0.7; }
    }
    
    .neuron-node.connection-highlight .node-core {
        animation: neuronPulse 1.5s ease-in-out infinite;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);