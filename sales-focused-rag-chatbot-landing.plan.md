<!-- c1e2062d-4430-435b-9cb1-f6cc11ba56d0 11f3cf84-db17-4596-8fe1-eb8407bcdf6e -->
# Transform to Sales-Focused RAG Chatbot Landing Page

## 1. Hero Section Redesign
**File: `index.html` (lines 56-77)**
- Replace passive intro with powerful sales pitch focused on RAG chatbot
- Add animated demo preview (mock chat interface showing live interaction)
- Primary CTA: "Se demo" or "Få din chatbot" → modal/section
- Secondary: "Prøv selv" → interactive demo
- Background: Add AI-themed visual placeholders (neural network, data streams)

**New animations in `script.js`:**
- Typing animation for demo messages
- Morphing gradients and particle effects (expand existing canvas)
- 3D floating elements (chat bubbles, data nodes)
- Mouse-following spotlight effect

## 2. Social Proof Banner

**New section after hero**

- Prominent "Askerfotball.no bruker vår chatbot" badge with logo
- Animated counter showing messages handled, response time, etc.
- Scrolling ticker with fake/real customer messages
- Add image placeholder: screenshot of chatbot in action

## 3. Interactive Product Showcase

**Replace static services section (lines 80-169)**

- Focus primarily on RAG chatbot, other services as upsells
- Before/After comparison slider (with/without chatbot)
- Live configurator: "Hva vil du at chatbotten skal gjøre?" → builds price
- Feature cards with hover animations revealing benefits
- Add placeholders: dashboard mockups, analytics graphs, workflow diagrams

**Animations:**

- Card flip effects on hover
- Animated statistics (counting numbers)
- Morphing icons
- Parallax layers on scroll
- Glow pulses on interactive elements

## 4. ROI Calculator / Interactive Tool

**New section**

- "Regn ut hvor mye tid du sparer" calculator
- Input: emails/inquiries per day → Output: hours saved, cost savings
- Animated visualization of results
- Instant CTA: "Få dette for din bedrift"

## 5. Case Study: Asker Fotball

**Replace or enhance "Vårt arbeid" (lines 172-190)**

- Detailed walkthrough with before/after metrics
- Image placeholders: chat interface, analytics dashboard, happy customer
- Video placeholder mockup
- Pull quote with animation
- "Vi vil ha det samme" CTA button

## 6. Trust & Technical Details

**New section**

- Animated explanation: "Hva er RAG?" with visual diagram
- Security badges, GDPR compliance
- Tech stack visualization (animated icons)
- Integration partners (placeholder logos)

## 7. Pricing & Packages

**Redesign pricing**

- Single focus: Chatbot packages (Starter, Pro, Enterprise)
- "Most popular" badge with animation
- Feature comparison table with smooth reveals
- "Start i dag" buttons with magnetic + glow effects

## 8. Final Conversion Push

**Enhanced contact section (lines 237-277)**

- Urgency messaging: "Ledige plasser denne måneden: 3"
- Embedded calendar for booking (placeholder)
- Live chat preview: "Snakk med vår chatbot nå"
- Form prefill with smart suggestions

## 9. Visual Enhancements Throughout

**New images/placeholders to add:**

- Hero: Futuristic dashboard, holographic interface
- Neural network visualization
- Chat interface screenshots (3-4 variations)
- Analytics/metrics dashboard
- Customer testimonial photos/avatars
- Tech stack logos
- Abstract AI patterns as section dividers

**CSS additions in `styles.css`:**

- Gradient animations (shifting colors)
- Glass morphism on multiple elements
- Animated borders and glows
- Hover scale + tilt on all CTAs
- Parallax backgrounds
- Shimmer effects on text
- Floating animation keyframes

**JavaScript additions in `script.js`:**

- Intersection observer triggers for staggered animations
- Mouse parallax on hero elements
- Typing effect for demo messages
- Number counter animations
- Canvas upgrades: neural network visualization, data particles
- Modal system for demo
- Before/after slider logic
- Calculator logic with smooth transitions
- Magnetic buttons (expand existing)
- Scroll progress indicator
- Lazy-load animations for images

## 10. Content Rewrite

- All copy shifts from "we do this" → "you get this result"
- Action verbs, urgency, specificity
- Remove generic AI mentions, focus on RAG chatbot benefits
- Add concrete numbers and timeframes
- Remove owner bio, replace with team/tech credibility signals

## Implementation Notes

- Maintain accessibility (ARIA labels, keyboard nav)
- Keep mobile responsive
- Preserve existing animation respect for `prefers-reduced-motion`
- Use SVG placeholders with data URIs for tech graphics
- Add loading states for interactive elements

### To-dos

- [ ] Redesign hero section with sales pitch, animated demo preview, and AI-themed visuals
- [ ] Add social proof banner featuring Asker Fotball with animated metrics
- [ ] Replace services section with interactive RAG chatbot showcase and configurator
- [ ] Build interactive ROI calculator with animated results visualization
- [ ] Create detailed Asker Fotball case study section with metrics and visuals
- [ ] Add animated 'What is RAG?' section with visual diagram and trust signals
- [ ] Redesign pricing focused on chatbot packages with comparison table
- [ ] Enhance contact section with urgency, booking calendar, and live chat preview
- [ ] Add placeholder images for dashboards, interfaces, neural networks, and tech visuals
- [ ] Add gradient animations, glass morphism, parallax, shimmer effects to CSS
- [ ] Implement 15+ new animations: typing effects, number counters, neural network canvas, mouse parallax, modals, sliders
- [ ] Rewrite all copy to be sales-focused with action verbs and concrete benefits