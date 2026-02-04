# LaunchKit — Instant Brand Presence MVP

**Tagline:** From bio to brand in 60 seconds

## 🎯 Product Vision

LaunchKit transforms a simple one-sentence bio into a complete brand identity with a live website — no technical knowledge required. It's the anti-Shopify: instead of overwhelming users with complexity, we make going online feel like magic.

**Core Promise:** Anyone can launch a professional web presence in under 2 minutes.

## 🧬 The Rebrand: Why "LaunchKit"?

### Problems with "Minimal Brand Space":
- Too vague and corporate-sounding
- Doesn't convey the speed/simplicity
- "Space" implies complexity (hosting, domains, etc.)

### Why "LaunchKit" works:
- Launch = Action, speed, excitement
- Kit = Everything you need, nothing you don't
- Memorable, one-word recall
- Developer-friendly but accessible

### Alternative names to consider:
- Instant.cv (domain-first branding)
- BrandSnap (emphasizes speed)
- QuickPresence (clear value prop)
- OneLink Studio (link-in-bio focus)

## 🚀 MVP Core Workflow (3-Step Magic)

### Step 1: The Spark (15 seconds)

**Interface:** Clean, centered input form with subtle gradient background

**User inputs:**
1. Full Name (auto-suggest from browser)
2. One-sentence bio
   - Placeholder: "I design fintech apps that don't suck"
   - Character limit: 120
3. Email (for domain registration + launch notification)

**UI Details:**
- Auto-save to localStorage as they type
- Smart bio suggestions based on detected keywords
- "See an example →" tooltip showing 3 real LaunchKit sites

### Step 2: AI Generation (20 seconds)

**What happens behind the scenes:**

The AI agent executes this workflow:

```
AGENT WORKFLOW:
1. Parse bio → Extract [profession, location, specialty, tone]
2. Generate 3 brand identities in parallel:
   - Brand Name (based on name/specialty)
   - Color Palette (3 colors: primary, accent, neutral)
   - Tagline (10-word max, punchy)
3. Check .cv domain availability for all 3 options
4. Rank by: domain availability + aesthetic coherence
5. Present top option with 2 alternatives
```

**User sees:**
- Animated "Building your brand..." loader (not boring spinner)
- Live preview cards appearing one by one
- Each card shows:
  - Domain name (brandname.cv)
  - Color palette (3 swatches)
  - Tagline
  - "Availability: ✓" badge

**Interaction:**
- Default selects #1, user can click alternatives
- "Customize colors" expander (advanced users only)
- "Regenerate" button if they hate all 3

### Step 3: One-Click Launch (25 seconds)

**User clicks:** "Launch My Site 🚀"

**Backend magic:**
1. Call Ola.CV API to register domain
2. Generate site from template with their data
3. Deploy to edge (Vercel/Cloudflare)
4. Configure DNS automatically
5. Send email: "Your site is live at [domain]"

**User sees:**
- Progress bar with steps:
  - ✓ Securing domain...
  - ✓ Building site...
  - ✓ Going live...
- Confetti animation on completion
- Big preview of their new site
- "Visit My Site" CTA + "Edit Dashboard" secondary button

**First-visit experience:**
- QR code to share instantly
- "Next steps" checklist:
  - Add a profile photo
  - Link your first service
  - Share on social media

## 🛠 Technical Architecture

### Frontend Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + CSS Variables for theming
- **Animations:** Framer Motion
- **State:** React Context + localStorage sync
- **Fonts:** Load from Bunny Fonts (privacy-friendly)

### Backend Stack
- **API:** Next.js API Routes (serverless)
- **Database:** Supabase (Postgres)
  - Users table
  - Brands table (identity JSON)
  - Sites table (deployment metadata)
- **Auth:** Supabase Auth (magic link)
- **Jobs:** Inngest (async domain registration + deployment)

### Third-Party APIs

**1. Claude API (Sonnet 4.5)**
- Brand name generation
- Color palette creation
- Tagline writing

**2. Ola.CV Domain API**
- Check availability: `GET /api/domains/check?name={brand}`
- Register domain: `POST /api/domains/register`
- Configure DNS: `POST /api/domains/{id}/dns`

**3. Deployment Platform (Vercel or Cloudflare Pages)**
- Programmatic site deployment
- Edge caching for fast loads

### Database Schema

```sql
-- brands table
CREATE TABLE brands (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  domain TEXT UNIQUE NOT NULL,
  tagline TEXT,
  bio TEXT,
  colors JSONB, -- {primary, accent, neutral}
  logo_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- sites table
CREATE TABLE sites (
  id UUID PRIMARY KEY,
  brand_id UUID REFERENCES brands(id),
  deployment_url TEXT,
  status TEXT, -- 'building' | 'live' | 'failed'
  services JSONB, -- [{name, price, link}]
  analytics_enabled BOOLEAN DEFAULT false,
  last_deployed TIMESTAMP
);
```

## 🎨 Design System (Themeable)

### CSS Variables Structure

```css
:root {
  /* Brand colors (AI-generated) */
  --brand-primary: #2563eb;
  --brand-accent: #f59e0b;
  --brand-neutral: #f3f4f6;
  
  /* Semantic colors */
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --bg-base: #ffffff;
  --bg-surface: #f9fafb;
  
  /* Typography */
  --font-display: 'Cabinet Grotesk', sans-serif;
  --font-body: 'Satoshi', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  /* Spacing scale */
  --space-xs: 0.5rem;
  --space-sm: 1rem;
  --space-md: 1.5rem;
  --space-lg: 2.5rem;
  --space-xl: 4rem;
}
```

### Site Templates

Users get one of 3 auto-selected templates:

**1. Minimal Card (Default)**
- Centered card layout
- Large profile image
- 3 service links max
- Best for: Freelancers, consultants

**2. Magazine Grid**
- Asymmetric 2-column layout
- Featured work section
- 5 service links max
- Best for: Creatives, designers

**3. Terminal Retro**
- Monospace typography
- Command-line aesthetic
- Code snippet embeds
- Best for: Developers, hackers

**Selection logic:**
- AI analyzes bio for profession keywords
- Template matches detected vibe
- User can switch in dashboard later

## 🔗 The "Link-in-Bio Store" Feature

### Minimal Store Section

Instead of full e-commerce, focus on service listings:

**Structure:**

```json
{
  "services": [
    {
      "id": "svc_001",
      "name": "1-Hour Design Consultation",
      "price": "₦50,000",
      "link": "https://paystack.com/pay/design-consult",
      "emoji": "💡"
    },
    {
      "name": "Logo Design Package",
      "price": "₦200,000",
      "link": "https://paystack.com/pay/logo-package",
      "emoji": "🎨"
    }
  ]
}
```

**UI Components:**
- Service cards with hover effects
- "Pay Now" buttons that open Paystack/Stripe links
- Social proof: "12 people bought this week"
- Sold out badge option

**Dashboard Management:**
- Drag-and-drop reordering
- Toggle visibility per service
- Analytics: click-through rates

## 🧠 AI Agent Implementation

### Goal Decomposition Workflow

```python
# Pseudocode for the AI agent logic
class LaunchKitAgent:
    def process_bio(self, user_bio: str, user_name: str):
        # Step 1: Validate & Parse
        validated = self.validate_input(user_bio)
        context = self.extract_context(validated)
        
        # Step 2: Generate Identities
        identities = await self.generate_identities(
            name=user_name,
            context=context,
            count=3
        )
        
        # Step 3: Check Domains
        for identity in identities:
            identity['domain_available'] = await self.check_domain(
                identity['brand_name']
            )
        
        # Step 4: Rank & Return
        return self.rank_identities(identities)
    
    def generate_identities(self, name, context, count):
        prompt = f"""
        Generate {count} brand identities for:
        Name: {name}
        Context: {context}
        
        For each, provide:
        1. Brand name (domain-friendly, 1-2 words)
        2. Color palette (primary hex, accent hex, neutral hex)
        3. Tagline (max 10 words, punchy)
        
        Return as JSON array.
        """
        
        response = await claude_api.complete(prompt)
        return json.loads(response)
    
    def check_domain(self, brand_name):
        # Sanitize for .cv domain
        domain = f"{brand_name.lower().replace(' ', '')}.cv"
        response = await ola_cv_api.check(domain)
        return response['available']
```

### Prompt Engineering for Brand Generation

**System Prompt:**
```
You are a world-class brand strategist. Given a person's bio, 
generate brand identities that are:
- Memorable (easy to say and spell)
- Domain-friendly (no special characters)
- Culturally aware (respect user's location/context)
- Visually distinct (unique color palettes)

Avoid generic tech startup vibes. Be bold and specific.
```

**Few-shot Examples:**

```json
[
  {
    "input": "I'm a freelance UI designer from Lagos specializing in fintech",
    "output": {
      "brand_name": "PulseWorks",
      "domain": "pulseworks.cv",
      "colors": {
        "primary": "#00D9A3",
        "accent": "#FF6B35",
        "neutral": "#1A1A2E"
      },
      "tagline": "Financial interfaces that feel alive"
    }
  }
]
```

## 🎯 MVP Feature Priority (MoSCoW)

### Must Have (Week 1-2)
- [ ] Step 1: Bio input form
- [ ] Step 2: AI brand generation (3 options)
- [ ] Step 3: One-click launch flow
- [ ] Ola.CV API integration
- [ ] Basic site template (Minimal Card)
- [ ] Service links (max 3)
- [ ] Dashboard: Edit bio, colors, services

### Should Have (Week 3-4)
- [ ] Email notifications (site ready)
- [ ] 2 additional templates (Magazine, Terminal)
- [ ] Profile photo upload
- [ ] Custom domain mapping (bring your own)
- [ ] Basic analytics (page views)

### Could Have (Post-MVP)
- [ ] AI-generated social preview images
- [ ] Blog integration (Notion sync)
- [ ] Testimonials section
- [ ] Waitlist/Newsletter signup form
- [ ] Dark mode toggle

### Won't Have (Not in scope)
- Full e-commerce cart
- Payment processing (we just link to Paystack)
- Multi-user teams
- Advanced SEO tools
- Email marketing

## 📊 Success Metrics (North Star KPIs)

1. **Time to Launch (TTL):** < 120 seconds average
2. **Completion Rate:** > 70% of users who start finish
3. **Domain Registration Success:** > 95%
4. **7-day Retention:** > 40% return to edit site
5. **Viral Coefficient:** 0.3 (referrals per user)

### Analytics Events to Track:

```javascript
// Segment/Mixpanel events
track('Bio Submitted')
track('Brand Option Selected')
track('Site Launched', {domain, template})
track('Service Link Added')
track('Dashboard Revisited')
track('Share Button Clicked')
```

## 💰 Monetization Strategy (Post-MVP)

### Free Tier
- 1 brand/site
- .cv subdomain only
- 3 service links
- LaunchKit branding footer

### Pro Tier ($9/month)
- Unlimited brands
- Custom domain mapping
- 10 service links
- Remove LaunchKit branding
- Analytics dashboard
- Priority support

### Business Tier ($29/month)
- Everything in Pro
- Team collaboration (3 users)
- White-label option
- API access
- Webhooks for integrations

## 🔧 Implementation Roadmap

### Week 1: Foundation
- [ ] Set up Next.js project with Tailwind
- [ ] Design landing page (pre-signup)
- [ ] Build Step 1 form component
- [ ] Integrate Supabase auth + database

### Week 2: AI + Domains
- [ ] Implement Claude API integration
- [ ] Build brand generation logic
- [ ] Integrate Ola.CV API (check + register)
- [ ] Create Step 2 preview cards

### Week 3: Deployment
- [ ] Build site template generator
- [ ] Set up Vercel deployment pipeline
- [ ] Create Step 3 launch flow
- [ ] Test end-to-end workflow

### Week 4: Dashboard + Polish
- [ ] Build user dashboard
- [ ] Add service link management
- [ ] Implement color customization
- [ ] Write docs + onboarding

## 🎨 UI/UX Mockup Structure

### Landing Page (Pre-Launch)

```
+--------------------------------------------------+
|           LaunchKit              [Start Free]    |
+--------------------------------------------------+
|                                                  |
|         From bio to brand in 60 seconds          |
|         =====================================    |
|                                                  |
|              [See How It Works ↓]                |
|                                                  |
|  +-----------------+  +-----------------+        |
|  |    Step 1       |  |    Step 2       |        |
|  | Enter your bio  |  |  AI creates     |        |
|  |                 |  |  your brand     |        |
|  +-----------------+  +-----------------+        |
|                                                  |
|  +-----------------+                             |
|  |    Step 3       |                             |
|  |   Go live       |                             |
|  +-----------------+                             |
|                                                  |
|           [Start Building →]                     |
|                                                  |
+--------------------------------------------------+
```

### Step 2: Brand Preview Cards

```
+--------------------------------------------------+
|         Choose your brand identity               |
+--------------------------------------------------+
|                                                  |
| +--------------+ +--------------+ +----------+  |
| | PulseWorks   | | NaijaTech    | | DesignFix|  |
| | Available ✓  | | Available ✓  | | Taken ✗  |  |
| |              | |              | |          |  |
| | [■][■][■]    | | [■][■][■]    | | [■][■][■]|  |
| |              | |              | |          |  |
| | "Financial   | | "Building    | | "Fixing  |  |
| | interfaces   | | Nigeria's    | | digital  |  |
| | that feel    | | digital      | | products"|  |
| | alive"       | | future"      | |          |  |
| |              | |              | |          |  |
| | [Select]     | | [Select]     | | [Skip]   |  |
| +--------------+ +--------------+ +----------+  |
|                                                  |
|      [← Regenerate]        [Customize →]        |
+--------------------------------------------------+
```

### Dashboard (Post-Launch)

```
+--------------------------------------------------+
|   LaunchKit          [Preview] [Logout]          |
+--------------------------------------------------+
|                                                  |
| Your Sites                                       |
| -----------                                      |
|                                                  |
| pulseworks.cv      [Edit] [Analytics] [⚙️]      |
| ✓ Live                                           |
|                                                  |
| Brand Identity                                   |
| ---------------                                  |
| [Profile Photo]  Name: Chidi Okonkwo            |
|                  Bio: I design fintech apps...   |
|                  [Edit]                          |
|                                                  |
| Colors: [■ Primary] [■ Accent] [■ Neutral]      |
|         [Customize Palette]                      |
|                                                  |
| Services                                         |
| ---------                                        |
| 💡 1-Hour Consultation    ₦50,000    [Edit]     |
| 🎨 Logo Design Package    ₦200,000   [Edit]     |
|                          [+ Add Service]         |
|                                                  |
| Quick Actions                                    |
| --------------                                   |
| [Share Site] [Download QR] [Upgrade to Pro]     |
+--------------------------------------------------+
```

## 🚨 Potential Pitfalls & Solutions

### Problem 1: Domain Registration Failures
**Risk:** Ola.CV API goes down or rate-limits us

**Solution:**
- Implement retry logic with exponential backoff
- Cache domain availability checks (5 min TTL)
- Show user "Registration queued" instead of failing
- Email when domain is ready (async job)

### Problem 2: AI Generates Bad Brand Names
**Risk:** Generic names, trademark conflicts, unpronounceable

**Solution:**
- Maintain a blocklist of generic terms (e.g., "MyBrand", "BizHub")
- Add prompt constraint: "Avoid names with 'Tech', 'Hub', 'Pro'"
- Let users manually input fallback name
- Show "Regenerate" prominently

### Problem 3: Users Abandon During Generation
**Risk:** 20-second wait feels too long

**Solution:**
- Add engaging loader (show mini brand tips)
- Implement optimistic UI (show skeleton cards immediately)
- Send email with recovery link if they close tab
- A/B test: pre-generate common profession templates

### Problem 4: Color Palettes Look Bad Together
**Risk:** AI picks clashing colors

**Solution:**
- Use proven color harmony rules (complementary, triadic)
- Validate contrast ratios (WCAG AA minimum)
- Offer "Use a preset palette" escape hatch
- Learn from user edits to improve prompts

## 🎤 Pitch Deck Outline (For Investors/Collaborators)

### Slide 1: The Problem
- 73% of freelancers in Nigeria don't have a web presence
- Why? Complexity. Shopify has 200+ settings. WordPress requires hosting.
- Building from scratch takes weeks.

### Slide 2: The Solution
**LaunchKit: Your brand in 60 seconds**
1. Type your bio
2. AI generates your brand
3. Click "Launch"

No code. No design skills. No DNS headaches.

### Slide 3: The Magic (Demo Video)
[Screen recording of full workflow]
"Watch Chidi go from idea to live site in 47 seconds."

### Slide 4: Market Opportunity
- 12M freelancers in Africa (2024)
- $2B creator economy in Nigeria alone
- Our wedge: .cv domains (underserved TLD)

### Slide 5: Business Model
- Free tier → Pro ($9/mo) → Business ($29/mo)
- Revenue projection: 10K users = $50K MRR (assuming 50% conversion)

### Slide 6: Traction (Post-MVP)
- 500 beta signups in 2 weeks
- 73% completion rate (industry avg: 40%)
- Avg TTL: 58 seconds 🔥

### Slide 7: The Ask
Seeking $100K seed to:
- Scale infrastructure (1M users target)
- Hire designer + backend eng
- Run growth campaigns in Nigeria + Kenya

## 🧪 Testing Checklist (Pre-Launch QA)

### Functional Tests
- [ ] Bio input validates correctly (no XSS)
- [ ] AI generates 3 distinct options every time
- [ ] Domain availability check works for edge cases
- [ ] Site deploys successfully across all templates
- [ ] DNS propagation completes within 2 hours
- [ ] Email notifications send reliably
- [ ] Dashboard edits save & reflect on live site

### Edge Cases
- What if all 3 domains are taken? (Show manual input)
- What if Ola.CV API times out? (Graceful fallback)
- What if user enters emoji in bio? (Strip or allow?)
- What if Claude API returns invalid JSON? (Retry + log)
- What if user's email bounces? (Show in-app notification)

### Cross-Browser Testing
- [ ] Chrome (latest)
- [ ] Safari (iOS + macOS)
- [ ] Firefox
- [ ] Edge
- [ ] Mobile responsive (375px - 1920px)

### Performance Tests
- [ ] Lighthouse score > 90 (desktop)
- [ ] Time to Interactive < 3s
- [ ] API response time < 500ms (p95)
- [ ] Image optimization (WebP with fallbacks)

## 📚 Documentation Needs

### For Users

**1. Getting Started Guide (5 min read)**
- What LaunchKit is
- How to launch your first site
- How to add service links

**2. FAQ Page**
- Can I use my own domain?
- How do I update my site later?
- Is my data secure?

**3. Video Tutorials (< 2 min each)**
- "Launch Your Brand in 60 Seconds"
- "Customize Your Colors"
- "Add Payment Links"

### For Developers (If Opening API)

**1. API Reference**
- Authentication
- Endpoints (brands, sites, deployments)
- Webhooks

**2. Integration Guides**
- Embed LaunchKit in your app
- White-label setup
- Custom templates

## 🎉 Go-to-Market Strategy

### Pre-Launch (2 weeks before)
- Build waitlist landing page
- Post on Twitter/X: "Building something cool..."
- Reach out to 50 freelancers for beta access
- Create teaser video (15 sec)

### Launch Day
- Product Hunt launch (aim for #1 Product of the Day)
- Post on Nigerian tech forums (Nairaland, TechCabal)
- Email beta users: "You're in! 🚀"
- Twitter thread: "How we built LaunchKit in 4 weeks"

### Week 1 Post-Launch
- Share user success stories (with permission)
- Run Instagram ads targeting "freelance designer Lagos"
- Guest post on Indie Hackers
- Podcast tour (request features on 3 shows)

### Month 1 Post-Launch
- Launch referral program (give 1 month Pro for every 3 signups)
- Partner with co-working spaces (offer group discounts)
- Create "LaunchKit of the Week" showcase
- Iterate based on user feedback

## 🔮 Future Vision (12-24 Months)

### Phase 2: LaunchKit Ecosystem
- **App Store:** Users can install plugins (booking, newsletter, shop)
- **Template Marketplace:** Designers sell custom themes
- **AI Copilot:** Chat interface to edit site ("Add a testimonials section")

### Phase 3: Beyond Web Presence
- **LaunchKit Print:** Generate business cards from your brand
- **LaunchKit Social:** Auto-create social media graphics
- **LaunchKit Pitch:** Turn your site into a pitch deck

## 🙏 Credits & Inspiration

This MVP design draws inspiration from:
- Carrd (simplicity focus)
- Linktree (link-in-bio model)
- Super (Notion-to-website magic)
- Gumroad (creator-first approach)

But with a unique twist: AI-generated brand identity + instant domain setup.

