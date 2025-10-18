// Small controllers using data-attributes
(function () {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Year in footer
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Sticky shrinking nav
  const header = document.querySelector('[data-nav]');
  const shrinkOn = 10;
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > shrinkOn) header.classList.add('is-shrunk');
    else header.classList.remove('is-shrunk');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Smooth scroll for anchors
  document.querySelectorAll('[data-scroll]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
    });
  });

  // Mobile menu
  const menu = document.querySelector('[data-menu]');
  const menuBtn = document.querySelector('[data-menu-toggle]');
  const setMenu = (open) => {
    if (!menu || !menuBtn) return;
    menu.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    if (open) menu.querySelector('a')?.focus();
  };
  menuBtn?.addEventListener('click', () => setMenu(!menu?.classList.contains('is-open')));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setMenu(false);
  });
  menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));

  // Accordions (services)
  document.querySelectorAll('[data-accordion-target]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const panel = btn.closest('.card')?.querySelector('[data-accordion-panel]');
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      if (!panel) return;
      btn.setAttribute('aria-expanded', String(!expanded));
      panel.hidden = expanded;
    });
  });

  // Carousel (simple)
  document.querySelectorAll('[data-carousel]').forEach((carousel) => {
    const track = carousel.querySelector('[data-carousel-track]');
    const prev = carousel.querySelector('[data-carousel-prev]');
    const next = carousel.querySelector('[data-carousel-next]');
    if (!track || !prev || !next) return;
    let index = 0;
    const items = Array.from(track.children);
    const to = (i) => {
      index = (i + items.length) % items.length;
      const width = items[0].getBoundingClientRect().width + 18; // gap
      track.scrollTo({ left: index * width, behavior: prefersReduced ? 'auto' : 'smooth' });
    };
    prev.addEventListener('click', () => to(index - 1));
    next.addEventListener('click', () => to(index + 1));
    // Auto-advance
    if (!prefersReduced) setInterval(() => to(index + 1), 6000);
  });

  // Enhanced Form validation
  document.querySelectorAll('[data-validate]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = form.querySelector('.form__status');
      const submitBtn = form.querySelector('.form__submit');
      const btnText = submitBtn?.querySelector('.btn-text');
      const btnLoading = submitBtn?.querySelector('.btn-loading');
      
      const fields = [
        { id: 'navn', rule: (v) => v.trim().length > 1, msg: 'Skriv navnet ditt' },
        { id: 'epost', rule: (v) => /.+@.+\..+/.test(v), msg: 'Skriv en gyldig e‑post' },
        { id: 'melding', rule: (v) => v.trim().length > 10, msg: 'Beskriv prosjektet ditt' },
      ];
      
      let valid = true;
      fields.forEach(({ id, rule, msg }) => {
        const input = form.querySelector('#' + id);
        const error = input?.closest('.form__row')?.querySelector('.form__error');
        const ok = input && rule(String(input.value || ''));
        if (!ok) {
          valid = false;
          if (error) error.textContent = msg;
        } else if (error) error.textContent = '';
      });
      
      if (!valid) {
        status && (status.textContent = 'Rett feil markert over.');
        status && (status.style.color = 'var(--danger)');
        return;
      }
      
      // Show loading state
      if (btnText && btnLoading) {
        btnText.style.display = 'none';
        btnLoading.style.display = 'flex';
        submitBtn.disabled = true;
      }
      
      // Simulate form submission
      setTimeout(() => {
        status && (status.textContent = 'Takk! Vi sender deg et tilbud innen 24 timer.');
        status && (status.style.color = 'var(--ok)');
        
        if (btnText && btnLoading) {
          btnText.style.display = 'flex';
          btnLoading.style.display = 'none';
          submitBtn.disabled = false;
        }
        
        form.reset();
      }, 2000);
    });
  });

  // Modal system for live chat and booking
  const modalTriggers = document.querySelectorAll('[data-modal-trigger]');
  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const modalType = trigger.getAttribute('data-modal-trigger');
      
      if (modalType === 'live-chat') {
        // Create live chat modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
          <div class="modal__overlay">
            <div class="modal__content">
              <div class="modal__header">
                <h3>Snakk med vår chatbot</h3>
                <button class="modal__close">&times;</button>
              </div>
              <div class="modal__body">
                <div class="chat-preview">
                  <div class="chat-message chat-message--bot">
                    <span>Hei! Jeg er GABRIELSEN AI sin chatbot. Hva kan jeg hjelpe deg med?</span>
                  </div>
                  <div class="chat-message chat-message--user">
                    <span>Jeg lurer på chatbot-løsninger</span>
                  </div>
                  <div class="chat-message chat-message--bot">
                    <span>Perfekt! Vi kan hjelpe deg med RAG-chatbot som automatiserer kundeservice. Hva slags bedrift driver du?</span>
                  </div>
                </div>
                <div class="chat-input">
                  <input type="text" placeholder="Skriv ditt spørsmål..." />
                  <button class="btn btn--primary">Send</button>
                </div>
              </div>
            </div>
          </div>
        `;
        document.body.appendChild(modal);
        
        // Close modal functionality
        modal.querySelector('.modal__close').addEventListener('click', () => modal.remove());
        modal.querySelector('.modal__overlay').addEventListener('click', (e) => {
          if (e.target === modal.querySelector('.modal__overlay')) modal.remove();
        });
      }
      
      if (modalType === 'booking') {
        // Create booking modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
          <div class="modal__overlay">
            <div class="modal__content">
              <div class="modal__header">
                <h3>Book 30 min gratis konsultasjon</h3>
                <button class="modal__close">&times;</button>
              </div>
              <div class="modal__body">
                <div class="booking-calendar">
                  <p>Velg en ledig tid for din gratis konsultasjon:</p>
                  <div class="calendar-placeholder">
                    <div class="calendar-day">
                      <span class="day-name">Man</span>
                      <span class="day-number">13</span>
                      <button class="time-slot">09:00</button>
                      <button class="time-slot">14:00</button>
                    </div>
                    <div class="calendar-day">
                      <span class="day-name">Tir</span>
                      <span class="day-number">14</span>
                      <button class="time-slot">10:00</button>
                      <button class="time-slot">15:00</button>
                    </div>
                    <div class="calendar-day">
                      <span class="day-name">Ons</span>
                      <span class="day-number">15</span>
                      <button class="time-slot">11:00</button>
                      <button class="time-slot">16:00</button>
                    </div>
                  </div>
                  <p class="booking-note">Vi kontakter deg for å bekrefte tiden og dele møtelink.</p>
                </div>
              </div>
            </div>
          </div>
        `;
        document.body.appendChild(modal);
        
        // Close modal functionality
        modal.querySelector('.modal__close').addEventListener('click', () => modal.remove());
        modal.querySelector('.modal__overlay').addEventListener('click', (e) => {
          if (e.target === modal.querySelector('.modal__overlay')) modal.remove();
        });
      }
    });
  });

  // In-view reveal
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add('in-view');
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('[data-observe]').forEach((el) => io.observe(el));

  // Enhanced magnetic hover for primary CTAs
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    const strength = 20;
    let isHovering = false;
    
    el.addEventListener('mousemove', (e) => {
      if (prefersReduced) return;
      isHovering = true;
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * strength;
      const y = ((e.clientY - r.top) / r.height - 0.5) * strength;
      el.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
      el.style.transition = 'transform 0.1s ease-out';
    });
    
    el.addEventListener('mouseleave', () => {
      if (prefersReduced) return;
      isHovering = false;
      el.style.transform = 'translate(0, 0) scale(1)';
      el.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
  });

  // Scroll progress indicator
  const scrollProgress = document.createElement('div');
  scrollProgress.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, var(--primary), var(--accent));
    z-index: 10001;
    transition: width 0.1s ease;
  `;
  document.body.appendChild(scrollProgress);

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = scrollPercent + '%';
  });

  // Enhanced particle/mesh background in hero
  const canvas = document.getElementById('mesh');
  if (canvas && !prefersReduced) {
    const ctx = canvas.getContext('2d');
    let w, h, t = 0, raf;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr);
    };
    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 0.75;
      
      // Enhanced neural network visualization
      for (let i = 0; i < 120; i++) {
        const x = (Math.sin(i * 0.21 + t * 0.8) * 0.4 + 0.5) * canvas.width;
        const y = (Math.cos(i * 0.17 + t * 0.6) * 0.3 + 0.5) * canvas.height;
        const r = 1.2 + (Math.sin(i + t) + 1) * 1.4;
        
        // Create more complex gradients
        const g1 = ctx.createRadialGradient(x, y, 0, x, y, r * 15 * dpr);
        g1.addColorStop(0, 'rgba(95,225,255,.25)');
        g1.addColorStop(0.5, 'rgba(125,95,255,.15)');
        g1.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g1;
        ctx.beginPath();
        ctx.arc(x, y, r * 15 * dpr, 0, Math.PI * 2);
        ctx.fill();
        
        // Add connecting lines for neural network effect
        if (i % 3 === 0) {
          const nextX = (Math.sin((i + 1) * 0.21 + t * 0.8) * 0.4 + 0.5) * canvas.width;
          const nextY = (Math.cos((i + 1) * 0.17 + t * 0.6) * 0.3 + 0.5) * canvas.height;
          ctx.strokeStyle = `rgba(95,225,255,${0.1 + Math.sin(t + i) * 0.05})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(nextX, nextY);
          ctx.stroke();
        }
      }
      t += 0.008;
      raf = requestAnimationFrame(draw);
    };
    resize();
    draw();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else draw();
    });
  }

  // Typing animation for demo messages
  document.querySelectorAll('[data-typing-text]').forEach((el) => {
    const text = el.textContent;
    el.textContent = '';
    let i = 0;
    const type = () => {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(type, 30);
      }
    };
    setTimeout(type, 1000);
  });

  // Enhanced counter animations
  const animateCounters = () => {
    document.querySelectorAll('[data-counter]').forEach((el) => {
      const target = parseFloat(el.getAttribute('data-counter'));
      const duration = 2000;
      const start = performance.now();
      const startValue = 0;
      
      const update = (currentTime) => {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const current = startValue + (target - startValue) * progress;
        
        if (target % 1 === 0) {
          el.textContent = Math.floor(current);
        } else {
          el.textContent = current.toFixed(1);
        }
        
        if (progress < 1) {
          requestAnimationFrame(update);
        }
      };
      
      requestAnimationFrame(update);
    });
  };

  // Trigger counter animations when in view
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounters();
        counterObserver.unobserve(entry.target);
      }
    });
  });
  
  document.querySelectorAll('[data-stat-animate], [data-metric-animate]').forEach((el) => {
    counterObserver.observe(el);
  });

  // Mouse parallax for hero elements
  const hero = document.querySelector('.hero');
  if (hero && !prefersReduced) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      const floatingBubble = document.querySelector('[data-floating-bubble]');
      const dataStream = document.querySelector('[data-data-stream]');
      const neuralNode = document.querySelector('[data-neural-node]');
      
      if (floatingBubble) {
        floatingBubble.style.transform = `translate(${(x - 0.5) * 20}px, ${(y - 0.5) * 20}px)`;
      }
      if (dataStream) {
        dataStream.style.transform = `translateX(${(x - 0.5) * 30}px)`;
      }
      if (neuralNode) {
        neuralNode.style.transform = `translate(${(x - 0.5) * 15}px, ${(y - 0.5) * 15}px)`;
      }
    });
  }

  // Typing animation for demo chat
  const typingElements = document.querySelectorAll('[data-typing-text]');
  if (typingElements.length && !prefersReduced) {
    const typeText = (element, text, speed = 30) => {
      element.textContent = '';
      let i = 0;
      const timer = setInterval(() => {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
        } else {
          clearInterval(timer);
        }
      }, speed);
    };

    // Start typing animations with delays
    setTimeout(() => {
      typingElements.forEach((el, index) => {
        const text = el.textContent;
        setTimeout(() => typeText(el, text), index * 2000);
      });
    }, 1000);
  }

  // Counter animations for hero stats
  const counterElements = document.querySelectorAll('[data-counter]');
  if (counterElements.length && !prefersReduced) {
    const animateCounter = (element, target, duration = 2000, isDecimal = false) => {
      const start = 0;
      const increment = target / (duration / 16);
      let current = start;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        if (isDecimal) {
          element.textContent = current.toFixed(1);
        } else {
          element.textContent = Math.floor(current);
        }
      }, 16);
    };

    // Start counter animations when hero comes into view
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          counterElements.forEach(el => {
            const target = parseInt(el.getAttribute('data-counter'));
            animateCounter(el, target);
          });
          heroObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    const heroSection = document.querySelector('.hero');
    if (heroSection) heroObserver.observe(heroSection);
  }

  // Social proof metrics counter animation
  const socialProofMetrics = document.querySelectorAll('.social-proof [data-counter]');
  if (socialProofMetrics.length && !prefersReduced) {
    const socialProofObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          socialProofMetrics.forEach(el => {
            const target = parseFloat(el.getAttribute('data-counter'));
            if (target < 10) {
              // For decimal numbers like 1.2
              animateCounter(el, target, 1500, true);
            } else {
              // For whole numbers
              animateCounter(el, target, 2000);
            }
          });
          socialProofObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    const socialProofSection = document.querySelector('.social-proof');
    if (socialProofSection) socialProofObserver.observe(socialProofSection);
  }

  // Enhanced Case Study Before/After tabs with smooth transitions
  document.querySelectorAll('.before-after__tab[data-tab]').forEach(tab => {
    tab.addEventListener('click', () => {
      const targetPanel = tab.getAttribute('data-tab');
      const caseStudy = tab.closest('.case-study');
      
      // Update tab states with animation
      caseStudy.querySelectorAll('.before-after__tab').forEach(t => {
        t.classList.remove('active');
        t.style.transform = 'scale(0.95)';
        setTimeout(() => t.style.transform = 'scale(1)', 150);
      });
      tab.classList.add('active');
      tab.style.transform = 'scale(1.05)';
      setTimeout(() => tab.style.transform = 'scale(1)', 150);
      
      // Update panel states with fade effect
      caseStudy.querySelectorAll('.before-after__panel').forEach(p => {
        p.style.opacity = '0';
        p.style.transform = 'translateY(20px)';
        setTimeout(() => {
          p.classList.remove('active');
          if (p.getAttribute('data-panel') === targetPanel) {
            p.classList.add('active');
            p.style.opacity = '1';
            p.style.transform = 'translateY(0)';
          }
        }, 150);
      });
    });
  });

  // Before/After Slider Logic
  const beforeAfterSliders = document.querySelectorAll('.before-after__content');
  beforeAfterSliders.forEach(slider => {
    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    
    const handleStart = (e) => {
      isDragging = true;
      startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
      slider.style.cursor = 'grabbing';
    };
    
    const handleMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      currentX = (e.type === 'mousemove' ? e.clientX : e.touches[0].clientX) - startX;
      const sliderWidth = slider.offsetWidth;
      const percentage = Math.max(0, Math.min(100, (currentX / sliderWidth) * 100));
      
      // Update slider position
      slider.style.setProperty('--slider-position', percentage + '%');
    };
    
    const handleEnd = () => {
      isDragging = false;
      slider.style.cursor = 'grab';
    };
    
    slider.addEventListener('mousedown', handleStart);
    slider.addEventListener('mousemove', handleMove);
    slider.addEventListener('mouseup', handleEnd);
    slider.addEventListener('mouseleave', handleEnd);
    slider.addEventListener('touchstart', handleStart);
    slider.addEventListener('touchmove', handleMove);
    slider.addEventListener('touchend', handleEnd);
  });

  // RAG Diagram Animation
  const ragSteps = document.querySelectorAll('[data-rag-step]');
  if (ragSteps.length && !prefersReduced) {
    const ragObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          ragSteps.forEach((step, index) => {
            setTimeout(() => {
              step.style.transform = 'translateY(-8px) scale(1.05)';
              step.style.boxShadow = '0 8px 32px rgba(95,225,255,0.3)';
              
              setTimeout(() => {
                step.style.transform = 'translateY(0) scale(1)';
                step.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
              }, 600);
            }, index * 300);
          });
          ragObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    const ragSection = document.querySelector('.rag-explanation');
    if (ragSection) ragObserver.observe(ragSection);
  }

  // Case Study Metrics Counter Animation
  const caseStudyMetrics = document.querySelectorAll('.case-study [data-counter]');
  if (caseStudyMetrics.length && !prefersReduced) {
    const caseStudyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          caseStudyMetrics.forEach(el => {
            const target = parseInt(el.getAttribute('data-counter'));
            animateCounter(el, target, 2000);
          });
          caseStudyObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    const caseStudySection = document.querySelector('.case-study');
    if (caseStudySection) caseStudyObserver.observe(caseStudySection);
  }

  // Comparison tabs (existing functionality)
  document.querySelectorAll('[data-tab]').forEach(tab => {
    tab.addEventListener('click', () => {
      const targetPanel = tab.getAttribute('data-tab');
      const comparison = tab.closest('.comparison');
      
      // Update tab states
      comparison.querySelectorAll('.comparison__tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Update panel states
      comparison.querySelectorAll('.comparison__panel').forEach(p => {
        p.classList.remove('active');
        if (p.getAttribute('data-panel') === targetPanel) {
          p.classList.add('active');
        }
      });
    });
  });

  // ROI Calculator
  const calculator = document.querySelector('.calculator');
  if (calculator) {
    const inputs = {
      emailsPerDay: calculator.querySelector('#emails-per-day'),
      timePerEmail: calculator.querySelector('#time-per-email'),
      hourlyRate: calculator.querySelector('#hourly-rate'),
      workDays: calculator.querySelector('#work-days')
    };
    
    const results = {
      hoursSaved: calculator.querySelector('[data-calc-result="hours-saved"]'),
      costSaved: calculator.querySelector('[data-calc-result="cost-saved"]'),
      roiMonths: calculator.querySelector('[data-calc-result="roi-months"]')
    };
    
    const chartBars = calculator.querySelectorAll('.chart__bar');
    const chatbotPrice = 14900; // Base price for chatbot
    
    const calculateROI = () => {
      const emailsPerDay = parseInt(inputs.emailsPerDay.value) || 0;
      const timePerEmail = parseInt(inputs.timePerEmail.value) || 0;
      const hourlyRate = parseInt(inputs.hourlyRate.value) || 0;
      const workDays = parseInt(inputs.workDays.value) || 0;
      
      // Calculate current monthly time spent
      const monthlyEmails = emailsPerDay * workDays;
      const monthlyMinutes = monthlyEmails * timePerEmail;
      const monthlyHours = monthlyMinutes / 60;
      const monthlyCost = monthlyHours * hourlyRate;
      
      // With chatbot: 80% reduction in manual work
      const reductionRate = 0.8;
      const hoursSaved = monthlyHours * reductionRate;
      const costSaved = monthlyCost * reductionRate;
      const roiMonths = chatbotPrice / costSaved;
      
      // Animate results
      animateValue(results.hoursSaved, 0, hoursSaved, 1500, 1);
      animateValue(results.costSaved, 0, costSaved, 1500, 0);
      animateValue(results.roiMonths, 0, roiMonths, 1500, 1);
      
      // Update chart bars
      updateChartBars(hoursSaved, monthlyHours);
    };
    
    const animateValue = (element, start, end, duration, decimals = 0) => {
      const startTime = performance.now();
      const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = start + (end - start) * progress;
        
        if (decimals === 0) {
          element.textContent = Math.floor(current).toLocaleString('nb-NO');
        } else {
          element.textContent = current.toFixed(decimals).toLocaleString('nb-NO');
        }
        
        if (progress < 1) {
          requestAnimationFrame(update);
        }
      };
      requestAnimationFrame(update);
    };
    
    const updateChartBars = (hoursSaved, monthlyHours) => {
      const savedPercentage = (hoursSaved / monthlyHours) * 100;
      const remainingPercentage = 100 - savedPercentage;
      
      // Animate chart bars
      chartBars.forEach(bar => {
        if (bar.classList.contains('chart__bar--after')) {
          bar.style.width = `${remainingPercentage}%`;
        }
      });
    };
    
    // Add event listeners to all inputs
    Object.values(inputs).forEach(input => {
      input.addEventListener('input', calculateROI);
    });
    
    // Initial calculation
    calculateROI();
  }

  // Enhanced Configurator price calculation with animations
  const configurator = document.querySelector('.configurator');
  if (configurator) {
    const basePrice = 14900;
    const priceDisplay = configurator.querySelector('[data-total-price]');
    const checkboxes = configurator.querySelectorAll('input[type="checkbox"]');
    
    const updatePrice = () => {
      let total = basePrice;
      checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
          total += parseInt(checkbox.getAttribute('data-price'));
        }
      });
      
      // Animate price change
      if (priceDisplay) {
        priceDisplay.style.transform = 'scale(1.1)';
        priceDisplay.style.color = 'var(--primary)';
        setTimeout(() => {
          priceDisplay.textContent = total.toLocaleString('nb-NO') + ' kr';
          priceDisplay.style.transform = 'scale(1)';
          priceDisplay.style.color = '';
        }, 150);
      }
    };
    
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', updatePrice);
      
      // Add visual feedback on change
      checkbox.addEventListener('change', () => {
        const option = checkbox.closest('.configurator__option');
        if (option) {
          option.style.transform = 'scale(0.98)';
          setTimeout(() => option.style.transform = 'scale(1)', 100);
        }
      });
    });
  }

  // Lazy loading animations for images
  const lazyImages = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.add('fade-in');
        imageObserver.unobserve(img);
      }
    });
  });

  lazyImages.forEach(img => imageObserver.observe(img));

  // Enhanced hover effects for all interactive elements
  document.querySelectorAll('.card, .feature-card, .pricing-card, .contact-option').forEach(card => {
    card.addEventListener('mouseenter', () => {
      if (prefersReduced) return;
      card.style.transform = 'translateY(-8px) scale(1.02)';
      card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3), 0 0 20px rgba(95,225,255,0.2)';
    });
    
    card.addEventListener('mouseleave', () => {
      if (prefersReduced) return;
      card.style.transform = 'translateY(0) scale(1)';
      card.style.boxShadow = '';
    });
  });

  // Staggered animation for feature cards
  const featureCards = document.querySelectorAll('.feature-card');
  const featureObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 100);
        featureObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  featureCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    featureObserver.observe(card);
  });

  // Enhanced typing effect with cursor
  const enhancedTypingElements = document.querySelectorAll('[data-typing-text]');
  enhancedTypingElements.forEach(el => {
    const text = el.textContent;
    el.textContent = '';
    el.style.borderRight = '2px solid var(--primary)';
    el.style.animation = 'blink 1s infinite';
    
    let i = 0;
    const type = () => {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(type, 50);
      } else {
        setTimeout(() => {
          el.style.borderRight = 'none';
          el.style.animation = 'none';
        }, 1000);
      }
    };
    
    setTimeout(type, 1000);
  });
})();

// Review Cards Animation
(function() {
  const reviewCards = document.querySelectorAll('[data-review-animate]');
  
  if (!reviewCards.length) return;
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  reviewCards.forEach(card => {
    card.style.animationPlayState = 'paused';
    observer.observe(card);
  });
})();


