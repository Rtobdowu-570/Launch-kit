
import { BrandIdentity } from "@/types";

export function generateSite(brand: BrandIdentity, templateId: string): string {
    // In a real application, this would be a more sophisticated template engine.
    const templates: Record<string, (brand: BrandIdentity) => string> = {
        "template1": (brand) => `
            <html>
                <head>
                    <title>${brand.brandName}</title>
                    <style>
                        body { font-family: sans-serif; background-color: ${brand.colors.neutral}; color: ${brand.colors.primary}; }
                        .container { max-width: 800px; margin: 40px auto; padding: 20px; text-align: center; }
                        h1 { color: ${brand.colors.accent}; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>${brand.brandName}</h1>
                        <p>${brand.tagline}</p>
                    </div>
                </body>
            </html>
        `,
        "template2": (brand) => `
        <html>
            <head>
                <title>${brand.brandName}</title>
                <style>
                    body { font-family: serif; background-color: ${brand.colors.primary}; color: ${brand.colors.neutral}; }
                    .container { max-width: 800px; margin: 40px auto; padding: 20px; text-align: left; }
                    h1 { color: ${brand.colors.accent}; border-bottom: 2px solid ${brand.colors.accent}; padding-bottom: 10px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>${brand.brandName}</h1>
                    <p>${brand.tagline}</p>
                </div>
            </body>
        </html>
    `,
    };

    const template = templates[templateId] || templates["template1"];
    return template(brand);
}
