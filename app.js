class NeuronNavigation {
    constructor() {
        this.currentSection = 'hero';
        this.isZoomed = false;
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
        this.setupCreditInteractions();
        this.animate();
    }

    setupCanvas() {
        this.canvas = document.getElementById('neuronCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setupNodes() {
        this.nodes = document.querySelectorAll('.neuron-node');
        this.sections = document.querySelectorAll('.content-section');
        this.glitchOverlay = document.querySelector('.glitch-overlay');
        
        this.nodes.forEach(node => {
            node.addEventListener('click', (e) => {
                e.stopImmediatePropagation();
                const targetSection = node.getAttribute('data-section');
                this.navigateToSection(targetSection, node);
            }, true);
        });

        document.querySelectorAll('[data-node]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetNode = e.target.getAttribute('data-node');
                this.navigateToSection(targetNode);
            });
        });
    }

    navigateToSection(sectionId, clickedNode = null) {
        if (this.currentSection === sectionId && this.isZoomed) return;

        // Efecto glitch especial para Contexto 2040
        if (sectionId === 'contexto') {
            this.triggerGlitchEffect();
        }

        if (!clickedNode) {
            clickedNode = document.querySelector(`[data-section="${sectionId}"]`);
        }

        this.currentSection = sectionId;
        this.isZoomed = true;

        document.querySelector('.neuron-main').classList.add('zoomed');
        document.getElementById('backButton').classList.add('visible');

        this.nodes.forEach(node => {
            node.classList.remove('active-node');
            if (node.getAttribute('data-section') === sectionId) {
                node.classList.add('active-node');
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

        this.playNavigationSound();
    }

    triggerGlitchEffect() {
        this.glitchOverlay.classList.add('active');
        setTimeout(() => {
            this.glitchOverlay.classList.remove('active');
        }, 500);
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
        }
    }

    animateContextoSection() {
        const storyItems = document.querySelectorAll('.story-item');
        storyItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('active');
            }, index * 500);
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

    setupStoryInteractions() {
        // Interacción con items de la línea de tiempo
        const storyItems = document.querySelectorAll('.story-item');
        storyItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const year = item.getAttribute('data-year');
                this.highlightTimelineYear(year);
            });
        });

        // Interacción con tarjetas de historias
        const storyCards = document.querySelectorAll('.story-card');
        storyCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const person = card.getAttribute('data-person');
                this.activatePersonEffect(person);
            });
        });
    }

    highlightTimelineYear(year) {
        const storyItems = document.querySelectorAll('.story-item');
        storyItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-year') === year) {
                item.classList.add('active');
            }
        });
    }

    activatePersonEffect(person) {
        // Activar efectos visuales específicos para cada persona
        const effects = {
            valeria: () => this.pulseProsthesis('leg'),
            guadalupe: () => this.beatHeart(),
            fermin: () => this.scanArm()
        };

        if (effects[person]) {
            effects[person]();
        }
    }

    pulseProsthesis(limb) {
        console.log(`Activando efecto de pulso para ${limb}`);
        // El efecto visual se maneja via CSS
    }

    beatHeart() {
        console.log('Activando efecto de latido cardíaco');
        // El efecto visual se maneja via CSS
    }

    scanArm() {
        console.log('Activando efecto de escaneo de brazo');
        // El efecto visual se maneja via CSS
    }

    setupTechInteractions() {
        // Interacción con items de tecnología
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
        // Los efectos se manejan principalmente via CSS
    }

    setup3DModel() {
        this.heartModel = document.querySelector('.heart-3d');
        this.heartParts = document.querySelectorAll('.heart-part');
        this.infoPanels = document.querySelectorAll('.info-panel');
        this.controls = document.querySelectorAll('.control-btn');
        
        let rotation = 0;
        let scale = 1;

        this.controls.forEach(control => {
            control.addEventListener('click', (e) => {
                const action = e.target.getAttribute('data-action');

                switch(action) {
                    case 'rotate':
                        rotation += 45;
                        break;
                    case 'zoom-in':
                        scale = Math.min(scale + 0.1, 2);
                        break;
                    case 'reset':
                        rotation = 0;
                        scale = 1;
                        break;
                }

                this.heartModel.style.transform = `rotateY(${rotation}deg) scale(${scale})`;
            });
        });

        // Interacción con partes del corazón
        this.heartParts.forEach(part => {
            part.addEventListener('click', (e) => {
                const partInfo = e.target.getAttribute('data-info');
                this.showPartInfo(partInfo);

                // Resaltar la parte clickeada
                this.heartParts.forEach(p => p.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    }

    showPartInfo(partInfo) {
        this.infoPanels.forEach(panel => {
            panel.classList.remove('active');
            if (panel.getAttribute('data-info') === partInfo) {
                panel.classList.add('active');
            }
        });
    }

    setupCreditInteractions() {
        const creditNodes = document.querySelectorAll('.credit-node');
        creditNodes.forEach(node => {
            node.addEventListener('mouseenter', () => {
                const person = node.getAttribute('data-person');
                this.highlightTeamMember(person);
            });
        });
    }

    highlightTeamMember(person) {
        console.log(`Destacando miembro del equipo: ${person}`);
        // Podrías añadir efectos adicionales aquí
    }

    navigateBack() {
        this.isZoomed = false;
        this.currentSection = 'hero';

        document.querySelector('.neuron-main').classList.remove('zoomed');
        document.getElementById('backButton').classList.remove('visible');

        this.nodes.forEach(node => {
            node.classList.remove('active-node');
        });

        this.sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === 'hero-content') {
                setTimeout(() => {
                    section.classList.add('active');
                }, 300);
            }
        });
    }

    setupBackButton() {
        const backBtn = document.getElementById('backButton');
        backBtn.addEventListener('click', () => {
            this.navigateBack();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isZoomed) {
                this.navigateBack();
            }
        });
    }

    setupAudio() {
        this.audio = document.getElementById('ambientAudio');
        this.audioToggle = document.getElementById('audioToggle');
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

    playNavigationSound() {
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
    }

    drawNeuronalConnections() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.isZoomed) return;

        this.ctx.strokeStyle = 'rgba(147, 185, 224, 0.2)';
        this.ctx.lineWidth = 1;

        this.nodes.forEach((node1, i) => {
            const rect1 = node1.getBoundingClientRect();
            const x1 = rect1.left + rect1.width / 2;
            const y1 = rect1.top + rect1.height / 2;
            
            this.nodes.forEach((node2, j) => {
                if (i < j) {
                    const rect2 = node2.getBoundingClientRect();
                    const x2 = rect2.left + rect2.width / 2;
                    const y2 = rect2.top + rect2.height / 2;

                    const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

                    if (distance < 400) {
                        this.ctx.beginPath();
                        this.ctx.moveTo(x1, y1);
                        this.ctx.lineTo(x2, y2);
                        this.ctx.stroke();

                        const pulseSpeed = 0.001;
                        const pulse = (Date.now() * pulseSpeed) % distance;

                        this.ctx.fillStyle = 'rgba(196, 162, 252, 0.8)';
                        this.ctx.beginPath();
                        this.ctx.arc(
                            x1 + (x2 - x1) * (pulse / distance),
                            y1 + (y2 - y1) * (pulse / distance),
                            3, 0, Math.PI * 2
                        );
                        this.ctx.fill();
                    }
                }
            });
        });
    }

    animate() {
        this.drawNeuronalConnections();
        requestAnimationFrame(() => this.animate());
    }
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    new NeuronNavigation();
});