
import * as fc from 'fast-check';
import { generateSite } from '../site-builder';
import { generators } from '@/test-utils';

describe('Site Generation Property-Based Tests', () => {
  /**
   * Property 13: Site Generation from Brand Identity
   * Validates: Requirements 6.1, 9.1
   */
  it('Property 13: Site Generation from Brand Identity - should generate a valid HTML site from a brand identity', async () => {
    await fc.assert(
      fc.asyncProperty(generators.brandIdentity(), async (brand) => {
        const html = generateSite(brand, 'template1');
        expect(html).toContain(`<title>${brand.brandName}</title>`);
        expect(html).toContain(`<h1>${brand.brandName}</h1>`);
        expect(html).toContain(`<p>${brand.tagline}</p>`);
      })
    );
  });

  /**
   * Property 14: Template Selection
   * Validates: Requirements 9.3
   */
  it('Property 14: Template Selection - should use the specified template or a default', async () => {
    await fc.assert(
      fc.asyncProperty(generators.brandIdentity(), fc.string(), async (brand, templateId) => {
        const html = generateSite(brand, templateId);
        // In a more advanced scenario, we'd check for template-specific features.
        // For now, we just ensure it generates valid HTML.
        expect(html).toContain('<html');
      })
    );
  });

  /**
   * Property 15: Template Customization
   * Validates: Requirements 6.1, 9.1, 9.3
   */
  it('Property 15: Template Customization - should customize the template with brand colors', async () => {
    await fc.assert(
      fc.asyncProperty(generators.brandIdentity(), async (brand) => {
        const html = generateSite(brand, 'template1');
        expect(html).toContain(`background-color: ${brand.colors.neutral}`);
        expect(html).toContain(`color: ${brand.colors.primary}`);
        expect(html).toContain(`color: ${brand.colors.accent}`);
      })
    );
  });
});
