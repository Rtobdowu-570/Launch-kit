
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold font-display text-text-primary">LaunchKit</h3>
            <p className="mt-2 text-text-secondary">
              From bio to brand in 60 seconds.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-text-primary">Product</h4>
            <ul className="mt-4 space-y-2">
              <li><Link href="#features" className="text-text-secondary hover:text-text-primary">Features</Link></li>
              <li><Link href="/pricing" className="text-text-secondary hover:text-text-primary">Pricing</Link></li>
              <li><Link href="/templates" className="text-text-secondary hover:text-text-primary">Templates</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-text-primary">Company</h4>
            <ul className="mt-4 space-y-2">
              <li><Link href="/about" className="text-text-secondary hover:text-text-primary">About Us</Link></li>
              <li><Link href="/blog" className="text-text-secondary hover:text-text-primary">Blog</Link></li>
              <li><Link href="/contact" className="text-text-secondary hover:text-text-primary">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-text-primary">Legal</h4>
            <ul className="mt-4 space-y-2">
              <li><Link href="/privacy" className="text-text-secondary hover:text-text-primary">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-text-secondary hover:text-text-primary">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8 text-center">
          <p className="text-text-secondary">&copy; {new Date().getFullYear()} LaunchKit. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
