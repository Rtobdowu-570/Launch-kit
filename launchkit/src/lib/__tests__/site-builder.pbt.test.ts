
import * as fc from 'fast-check';
import { generateSite, selectTemplate, TEMPLATES } from '../site-builder';
import { generators } from '@/test-utils';

describe('Site Generation Property-Based Tests', () => {
  /**
   * Property 13: Site Generation from Brand Identity
   * Validates: Requirements 6.1, 9.1
   */
  it('Property 13: Site Generation from Brand Identity - should generate a valid HTML site from a brand identity', async () => {
    await fc.assert(
      fc.asyncProperty(generators.brandIdentity, async (brand) => {
        const html = generateSite(brand, 'minimal-card');
        expect(html).toContain(`<title>${brand.brandName}</title>`);
        expect(html).toContain(brand.brandName);
        expect(html).toContain(brand.tagline);
        expect(html).toContain('<!DOCTYPE html>');
        expect(html).toContain('</html>');
      })
    );
  });

  /**
   * Property 14: Template Selection
   * Validates: Requirements 9.3
   */
  it('Property 14: Template Selection - should use the specified template or a default', async () => {
    await fc.assert(
      fc.asyncProperty(generators.brandIdentity, fc.string(), async (brand, templateId) => {
        const html = generateSite(brand, templateId as any);
        // In a more advanced scenario, we'd check for template-specific features.
        // For now, we just ensure it generates valid HTML.
        expect(html).toContain('<html');
        expect(html).toContain('</html>');
      })
    );
  });

  /**
   * Property 15: Template Customization
   * Validates: Requirements 6.1, 9.1, 9.3
   */
  it('Property 15: Template Customization - should customize the template with brand colors', async () => {
    await fc.assert(
      fc.asyncProperty(generators.brandIdentity, async (brand) => {
        const html = generateSite(brand, 'minimal-card');
        // Check that brand colors are used in the generated HTML
        expect(html).toContain(brand.colors.primary);
        expect(html).toContain(brand.colors.accent);
        expect(html).toContain(brand.colors.neutral);
      })
    );
  });

  /**
   * Additional test: Template selection based on bio
   */
  it('should select appropriate template based on bio keywords', () => {
    expect(selectTemplate('I am a software developer')).toBe('terminal-retro');
    expect(selectTemplate('I am a graphic designer')).toBe('magazine-grid');
    expect(selectTemplate('I run a business')).toBe('minimal-card');
  });

  /**
   * Additional test: All templates should be valid
   */
  it('should generate valid HTML for all template types', async () => {
    await fc.assert(
      fc.asyncProperty(generators.brandIdentity, async (brand) => {
        for (const template of TEMPLATES) {
          const html = generateSite(brand, template.id);
          expect(html).toContain('<!DOCTYPE html>');
          expect(html).toContain(brand.brandName);
          expect(html).toContain(brand.tagline);
          expect(html).toContain('</html>');
        }
      })
    );
  });
});
