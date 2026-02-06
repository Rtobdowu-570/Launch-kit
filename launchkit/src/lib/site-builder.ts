
import { BrandIdentity } from "@/types";

// Template types
export type TemplateId = 'minimal-card' | 'magazine-grid' | 'terminal-retro';

export interface Template {
  id: TemplateId;
  name: string;
  description: string;
  preview: string;
}

// Available templates
export const TEMPLATES: Template[] = [
  {
    id: 'minimal-card',
    name: 'Minimal Card',
    description: 'Clean, centered design with subtle animations',
    preview: '/templates/minimal-card.png',
  },
  {
    id: 'magazine-grid',
    name: 'Magazine Grid',
    description: 'Bold, editorial layout with dynamic sections',
    preview: '/templates/magazine-grid.png',
  },
  {
    id: 'terminal-retro',
    name: 'Terminal Retro',
    description: 'Nostalgic terminal aesthetic with monospace fonts',
    preview: '/templates/terminal-retro.png',
  },
];

/**
 * Select a template based on bio analysis
 * This is a simple heuristic - in production, you might use AI for better selection
 */
export function selectTemplate(bio: string): TemplateId {
  const bioLower = bio.toLowerCase();
  
  // Terminal Retro for tech/developer keywords
  if (bioLower.match(/developer|engineer|code|tech|software|programmer|hacker/)) {
    return 'terminal-retro';
  }
  
  // Magazine Grid for creative/design keywords
  if (bioLower.match(/design|creative|artist|writer|photographer|content|media/)) {
    return 'magazine-grid';
  }
  
  // Minimal Card as default
  return 'minimal-card';
}

/**
 * Generate a complete HTML site from a brand identity
 */
export function generateSite(brand: BrandIdentity, templateId: TemplateId = 'minimal-card'): string {
  const templates: Record<TemplateId, (brand: BrandIdentity) => string> = {
    'minimal-card': generateMinimalCard,
    'magazine-grid': generateMagazineGrid,
    'terminal-retro': generateTerminalRetro,
  };

  const template = templates[templateId] || templates['minimal-card'];
  return template(brand);
}

/**
 * Minimal Card Template
 * Clean, centered design with subtle animations
 */
function generateMinimalCard(brand: BrandIdentity): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${brand.brandName}</title>
    <meta name="description" content="${brand.tagline}">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, ${brand.colors.neutral} 0%, ${brand.colors.primary}15 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .card {
            background: white;
            border-radius: 24px;
            padding: 60px 40px;
            max-width: 600px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
            text-align: center;
            animation: fadeIn 0.8s ease-out;
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .logo {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, ${brand.colors.primary}, ${brand.colors.accent});
            border-radius: 20px;
            margin: 0 auto 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 36px;
            font-weight: bold;
            color: white;
        }
        
        h1 {
            font-size: 48px;
            font-weight: 700;
            color: ${brand.colors.primary};
            margin-bottom: 20px;
            letter-spacing: -0.02em;
        }
        
        .tagline {
            font-size: 20px;
            color: #666;
            line-height: 1.6;
            margin-bottom: 40px;
        }
        
        .cta {
            display: inline-block;
            background: ${brand.colors.accent};
            color: white;
            padding: 16px 32px;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 600;
            font-size: 16px;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .cta:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px ${brand.colors.accent}40;
        }
        
        @media (max-width: 640px) {
            .card {
                padding: 40px 24px;
            }
            
            h1 {
                font-size: 36px;
            }
            
            .tagline {
                font-size: 18px;
            }
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="logo">${brand.brandName.charAt(0).toUpperCase()}</div>
        <h1>${brand.brandName}</h1>
        <p class="tagline">${brand.tagline}</p>
        <a href="#contact" class="cta">Get in Touch</a>
    </div>
</body>
</html>`;
}

/**
 * Magazine Grid Template
 * Bold, editorial layout with dynamic sections
 */
function generateMagazineGrid(brand: BrandIdentity): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${brand.brandName}</title>
    <meta name="description" content="${brand.tagline}">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Georgia', serif;
            background: ${brand.colors.neutral};
            color: #1a1a1a;
        }
        
        .header {
            background: ${brand.colors.primary};
            color: white;
            padding: 80px 20px;
            text-align: center;
        }
        
        .brand-name {
            font-size: 72px;
            font-weight: 900;
            letter-spacing: -0.03em;
            margin-bottom: 20px;
            text-transform: uppercase;
        }
        
        .tagline {
            font-size: 24px;
            font-style: italic;
            opacity: 0.9;
        }
        
        .content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 60px 20px;
        }
        
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 40px;
            margin-top: 40px;
        }
        
        .card {
            background: white;
            padding: 40px;
            border-left: 4px solid ${brand.colors.accent};
            transition: transform 0.3s;
        }
        
        .card:hover {
            transform: translateX(8px);
        }
        
        .card h2 {
            font-size: 28px;
            margin-bottom: 16px;
            color: ${brand.colors.primary};
        }
        
        .card p {
            font-size: 16px;
            line-height: 1.8;
            color: #666;
        }
        
        .footer {
            background: #1a1a1a;
            color: white;
            text-align: center;
            padding: 40px 20px;
            margin-top: 80px;
        }
        
        @media (max-width: 768px) {
            .brand-name {
                font-size: 48px;
            }
            
            .tagline {
                font-size: 18px;
            }
            
            .grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <header class="header">
        <h1 class="brand-name">${brand.brandName}</h1>
        <p class="tagline">${brand.tagline}</p>
    </header>
    
    <main class="content">
        <div class="grid">
            <div class="card">
                <h2>About</h2>
                <p>Welcome to ${brand.brandName}. ${brand.tagline}</p>
            </div>
            <div class="card">
                <h2>Services</h2>
                <p>Discover what we can do for you.</p>
            </div>
            <div class="card">
                <h2>Contact</h2>
                <p>Get in touch to learn more.</p>
            </div>
        </div>
    </main>
    
    <footer class="footer">
        <p>&copy; 2024 ${brand.brandName}. All rights reserved.</p>
    </footer>
</body>
</html>`;
}

/**
 * Terminal Retro Template
 * Nostalgic terminal aesthetic with monospace fonts
 */
function generateTerminalRetro(brand: BrandIdentity): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${brand.brandName}</title>
    <meta name="description" content="${brand.tagline}">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Courier New', monospace;
            background: #0a0a0a;
            color: ${brand.colors.accent};
            padding: 20px;
            line-height: 1.6;
        }
        
        .terminal {
            max-width: 900px;
            margin: 0 auto;
            background: #1a1a1a;
            border: 2px solid ${brand.colors.primary};
            border-radius: 8px;
            box-shadow: 0 0 30px ${brand.colors.primary}40;
        }
        
        .terminal-header {
            background: ${brand.colors.primary};
            padding: 12px 20px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .terminal-button {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #ff5f56;
        }
        
        .terminal-button:nth-child(2) {
            background: #ffbd2e;
        }
        
        .terminal-button:nth-child(3) {
            background: #27c93f;
        }
        
        .terminal-body {
            padding: 40px;
        }
        
        .prompt {
            color: ${brand.colors.accent};
        }
        
        .command {
            color: ${brand.colors.primary};
        }
        
        h1 {
            font-size: 32px;
            margin: 20px 0;
            color: ${brand.colors.accent};
        }
        
        .ascii-art {
            color: ${brand.colors.primary};
            font-size: 12px;
            line-height: 1.2;
            margin: 20px 0;
        }
        
        .output {
            margin: 20px 0;
            padding-left: 20px;
            border-left: 2px solid ${brand.colors.primary};
        }
        
        .blink {
            animation: blink 1s infinite;
        }
        
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }
        
        a {
            color: ${brand.colors.accent};
            text-decoration: underline;
        }
        
        a:hover {
            color: ${brand.colors.primary};
        }
        
        @media (max-width: 640px) {
            body {
                padding: 10px;
            }
            
            .terminal-body {
                padding: 20px;
            }
            
            h1 {
                font-size: 24px;
            }
            
            .ascii-art {
                font-size: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="terminal">
        <div class="terminal-header">
            <div class="terminal-button"></div>
            <div class="terminal-button"></div>
            <div class="terminal-button"></div>
        </div>
        <div class="terminal-body">
            <div>
                <span class="prompt">$</span> <span class="command">cat welcome.txt</span>
            </div>
            
            <pre class="ascii-art">
 ${brand.brandName.split('').join(' ')}
            </pre>
            
            <h1>&gt; ${brand.brandName}</h1>
            
            <div class="output">
                <p>${brand.tagline}</p>
            </div>
            
            <div style="margin-top: 40px;">
                <span class="prompt">$</span> <span class="command">ls -la</span>
            </div>
            
            <div class="output">
                <p>drwxr-xr-x  about.md</p>
                <p>drwxr-xr-x  services.md</p>
                <p>drwxr-xr-x  contact.md</p>
            </div>
            
            <div style="margin-top: 40px;">
                <span class="prompt">$</span> <span class="blink">_</span>
            </div>
        </div>
    </div>
</body>
</html>`;
}

/**
 * Deploy a site (placeholder for actual deployment logic)
 * In production, this would integrate with Vercel, Netlify, or similar
 */
export async function deploySite(
  html: string,
  domain: string,
  brandId: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // TODO: Implement actual deployment logic
    // This would typically:
    // 1. Create a new deployment on Vercel/Netlify
    // 2. Upload the HTML file
    // 3. Configure custom domain
    // 4. Return the deployment URL
    
    // For now, return a mock success response
    const deploymentUrl = `https://${domain}`;
    
    return {
      success: true,
      url: deploymentUrl,
    };
  } catch (error) {
    console.error('Deployment error:', error);
    return {
      success: false,
      error: 'Failed to deploy site',
    };
  }
}
