document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close menu when clicking on a nav link
        document.querySelectorAll('.nav-link, .nav-btn').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }
    
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Navbar scroll effect
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .testimonial-card, .pricing-card, .faq-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Form validation helper
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Generic form handler
    function handleFormSubmit(form, callback) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                const errorElement = input.parentElement.querySelector('.error-message');
                
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                    if (errorElement) {
                        errorElement.textContent = 'This field is required';
                        errorElement.style.display = 'block';
                    }
                } else if (input.type === 'email' && !validateEmail(input.value)) {
                    isValid = false;
                    input.classList.add('error');
                    if (errorElement) {
                        errorElement.textContent = 'Please enter a valid email address';
                        errorElement.style.display = 'block';
                    }
                } else {
                    input.classList.remove('error');
                    if (errorElement) {
                        errorElement.style.display = 'none';
                    }
                }
            });
            
            if (isValid && callback) {
                callback(new FormData(form));
            }
        });
    }
    
    // Audio recording functionality for dashboard
    let mediaRecorder;
    let audioChunks = [];
    let isRecording = false;
    
    window.audioRecording = {
        start: function(onDataAvailable, onStop) {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('Audio recording not supported in this browser');
            }
            
            return navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    mediaRecorder = new MediaRecorder(stream);
                    audioChunks = [];
                    
                    mediaRecorder.ondataavailable = function(event) {
                        audioChunks.push(event.data);
                        if (onDataAvailable) onDataAvailable(event.data);
                    };
                    
                    mediaRecorder.onstop = function() {
                        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                        if (onStop) onStop(audioBlob);
                        
                        // Stop all tracks to release microphone
                        stream.getTracks().forEach(track => track.stop());
                    };
                    
                    mediaRecorder.start();
                    isRecording = true;
                    
                    return mediaRecorder;
                })
                .catch(error => {
                    console.error('Error accessing microphone:', error);
                    throw error;
                });
        },
        
        stop: function() {
            if (mediaRecorder && isRecording) {
                mediaRecorder.stop();
                isRecording = false;
            }
        },
        
        isRecording: function() {
            return isRecording;
        }
    };
    
    // Client management helpers
    window.clientManager = {
        clients: JSON.parse(localStorage.getItem('clients') || '[]'),
        
        initializeSampleData: function() {
            if (this.clients.length === 0) {
                const sampleClients = [
                    {
                        id: '1',
                        name: 'Sarah Johnson',
                        email: 'sarah.j@example.com',
                        phone: '(555) 123-4567',
                        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
                    },
                    {
                        id: '2',
                        name: 'Michael Chen',
                        email: 'mchen@example.com',
                        phone: '(555) 234-5678',
                        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
                    },
                    {
                        id: '3',
                        name: 'Emily Davis',
                        email: 'emily.davis@example.com',
                        phone: '(555) 345-6789',
                        createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString()
                    }
                ];
                this.clients = sampleClients;
                this.save();
            }
        },
        
        save: function() {
            localStorage.setItem('clients', JSON.stringify(this.clients));
        },
        
        add: function(client) {
            client.id = Date.now().toString();
            client.createdAt = new Date().toISOString();
            this.clients.push(client);
            this.save();
            return client;
        },
        
        update: function(id, updates) {
            const index = this.clients.findIndex(c => c.id === id);
            if (index !== -1) {
                this.clients[index] = { ...this.clients[index], ...updates };
                this.save();
                return this.clients[index];
            }
            return null;
        },
        
        delete: function(id) {
            this.clients = this.clients.filter(c => c.id !== id);
            this.save();
        },
        
        get: function(id) {
            return this.clients.find(c => c.id === id);
        },
        
        getAll: function() {
            return this.clients;
        }
    };
    
    // Notes management helpers
    window.notesManager = {
        notes: JSON.parse(localStorage.getItem('notes') || '[]'),
        
        initializeSampleData: function() {
            if (this.notes.length === 0) {
                const sampleNotes = [
                    {
                        id: '1',
                        clientId: '1',
                        clientName: 'Sarah Johnson',
                        sessionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                        noteType: 'SOAP',
                        status: 'completed',
                        duration: '50 mins',
                        content: 'Sample SOAP note content...',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    },
                    {
                        id: '2',
                        clientId: '2',
                        clientName: 'Michael Chen',
                        sessionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                        noteType: 'BIRP',
                        status: 'draft',
                        duration: '45 mins',
                        content: 'Sample BIRP note content...',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    },
                    {
                        id: '3',
                        clientId: '3',
                        clientName: 'Emily Davis',
                        sessionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                        noteType: 'DAP',
                        status: 'processing',
                        duration: '60 mins',
                        content: 'Sample DAP note content...',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    }
                ];
                this.notes = sampleNotes;
                this.save();
            }
        },
        
        save: function() {
            localStorage.setItem('notes', JSON.stringify(this.notes));
        },
        
        add: function(note) {
            note.id = Date.now().toString();
            note.createdAt = new Date().toISOString();
            note.updatedAt = new Date().toISOString();
            this.notes.push(note);
            this.save();
            return note;
        },
        
        update: function(id, updates) {
            const index = this.notes.findIndex(n => n.id === id);
            if (index !== -1) {
                this.notes[index] = { ...this.notes[index], ...updates, updatedAt: new Date().toISOString() };
                this.save();
                return this.notes[index];
            }
            return null;
        },
        
        delete: function(id) {
            this.notes = this.notes.filter(n => n.id !== id);
            this.save();
        },
        
        get: function(id) {
            return this.notes.find(n => n.id === id);
        },
        
        getByClient: function(clientId) {
            return this.notes.filter(n => n.clientId === clientId);
        },
        
        getAll: function() {
            return this.notes;
        }
    };
    
    // Utility functions
    window.utils = {
        formatDate: function(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },
        
        formatTime: function(dateString) {
            const date = new Date(dateString);
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
        },
        
        generateId: function() {
            return Date.now().toString() + Math.random().toString(36).substr(2, 9);
        },
        
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        exportToCSV: function(data, filename) {
            const csv = this.convertToCSV(data);
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
        },
        
        convertToCSV: function(data) {
            if (!data.length) return '';
            
            const headers = Object.keys(data[0]);
            const csvRows = [headers.join(',')];
            
            data.forEach(row => {
                const values = headers.map(header => {
                    const value = row[header];
                    return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
                });
                csvRows.push(values.join(','));
            });
            
            return csvRows.join('\n');
        }
    };
    
    // Authentication helpers (for demonstration)
    window.auth = {
        isLoggedIn: function() {
            return localStorage.getItem('authToken') !== null;
        },
        
        login: function(email, password) {
            // Simulate authentication
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    // Check for demo credentials or any email/password combination
                    if ((email === 'demo@chaletnotes.com' && password === 'demo123') || (email && password)) {
                        localStorage.setItem('authToken', 'demo-token-' + Date.now());
                        localStorage.setItem('userEmail', email);
                        
                        // Set demo user data
                        const userData = {
                            firstName: 'Dr. Gisele',
                            lastName: 'Nzeukou',
                            email: email,
                            title: 'Caregiver'
                        };
                        localStorage.setItem('userData', JSON.stringify(userData));
                        
                        resolve({ email, token: 'demo-token' });
                    } else {
                        reject(new Error('Invalid credentials'));
                    }
                }, 500);
            });
        },
        
        logout: function() {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userData');
            window.location.href = 'index.html';
        },
        
        getCurrentUser: function() {
            if (this.isLoggedIn()) {
                return {
                    email: localStorage.getItem('userEmail'),
                    token: localStorage.getItem('authToken'),
                    userData: JSON.parse(localStorage.getItem('userData') || '{}')
                };
            }
            return null;
        }
    };
});

// Global error handler
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
});

// Global unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
});