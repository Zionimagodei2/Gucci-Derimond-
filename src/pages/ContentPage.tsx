import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Info, Shield, Truck, FileText, HelpCircle, Mail, MapPin, Phone, Users } from 'lucide-react';

const pageContent: Record<string, { title: string, icon: any, content: React.ReactNode }> = {
  'about-us': {
    title: 'About Marco Tac Life',
    icon: Info,
    content: (
      <div className="space-y-6">
        <p>Marco Tac Life was born from a passion for the trail. We are a team of off-road enthusiasts dedicated to providing the best parts and accessories for your Toyota Tacoma. Every product we sell is trail-tested and enthusiast-approved.</p>
        <p>Our mission is to help you build the ultimate adventure machine, whether you are tackling rock crawls or weekend camping trips. We believe in quality, durability, and a community-first approach to off-roading.</p>
        <p>From suspension lifts to lighting setups, we only stock brands we trust on our own rigs. Join the Marco Tac Life family and let's hit the trails together.</p>
      </div>
    )
  },
  'rewards': {
    title: 'Marco Points Rewards',
    icon: Shield,
    content: (
      <div className="space-y-6">
        <p>Join the most rewarding loyalty program in the Tacoma community. Earn 1 Marco Point for every $1 spent.</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Sign Up Bonus:</strong> 50 Points just for joining.</li>
          <li><strong>Birthday Reward:</strong> 100 Points on your special day.</li>
          <li><strong>Refer a Friend:</strong> Give $10, Get $10 in points.</li>
        </ul>
        <p>Redeem points for exclusive discounts, free gear, and early access to new releases. 100 Points = $10 Off your next order.</p>
      </div>
    )
  },
  'contact-us': {
    title: 'Contact Us',
    icon: Mail,
    content: (
      <div className="space-y-6">
        <p>Have questions about a build or a specific part? Our team of experts is here to help. Reach out to us via email, phone, or visit our showroom.</p>
        <p>We aim to respond to all inquiries within 24 hours during regular business days.</p>
      </div>
    )
  },
  'faq': {
    title: 'Frequently Asked Questions',
    icon: HelpCircle,
    content: (
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-bold mb-2">Do you ship internationally?</h3>
          <p>Currently, we ship to the US and Canada. For other international destinations, please contact our support team for a custom shipping quote.</p>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">What is your return policy?</h3>
          <p>We accept returns on unused, uninstalled items in their original packaging within 30 days of delivery. A 15% restocking fee may apply to certain oversized items.</p>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">Will this part fit my Tacoma?</h3>
          <p>We provide detailed fitment information on every product page. If you're still unsure, shoot us an email with your truck's year, make, and model, and our experts will verify fitment for you.</p>
        </div>
      </div>
    )
  },
  'shipping': {
    title: 'Shipping Policy',
    icon: Truck,
    content: (
      <div className="space-y-6">
        <h3 className="text-2xl font-bold">Order Processing</h3>
        <p>Most orders are processed within 24-48 hours. Custom fabricated parts (like bumpers and sliders) may have lead times of 4-8 weeks. Lead times are clearly stated on the product pages.</p>
        <h3 className="text-2xl font-bold">Shipping Methods</h3>
        <p>We use UPS, FedEx, and USPS for standard shipments. Oversized items like bumpers, roof racks, and tents will ship via LTL Freight.</p>
        <h3 className="text-2xl font-bold">Free Shipping</h3>
        <p>Free standard shipping is available on select orders over $199 within the contiguous 48 states. Oversized items are excluded from free shipping promotions.</p>
      </div>
    )
  },
  'privacy': {
    title: 'Privacy Policy',
    icon: Shield,
    content: (
      <div className="space-y-6">
        <p>Last Updated: March 2025</p>
        <h3 className="text-2xl font-bold">Information We Collect</h3>
        <p>We collect information you provide directly to us, such as when you create an account, make a purchase, sign up for our newsletter, or contact customer support. This may include your name, email address, shipping address, and payment information.</p>
        <h3 className="text-2xl font-bold">How We Use Your Information</h3>
        <p>We use the information we collect to process transactions, send order confirmations, provide customer support, and communicate with you about products, services, and promotions.</p>
        <h3 className="text-2xl font-bold">Data Security</h3>
        <p>Your privacy is important to us. We use industry-standard encryption and security measures to protect your personal information. We never sell your personal data to third parties.</p>
      </div>
    )
  },
  'terms': {
    title: 'Terms of Service',
    icon: FileText,
    content: (
      <div className="space-y-6">
        <p>Last Updated: March 2025</p>
        <h3 className="text-2xl font-bold">Agreement to Terms</h3>
        <p>By accessing or using the Marco Tac Life website, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
        <h3 className="text-2xl font-bold">Products and Pricing</h3>
        <p>All products are subject to availability. We reserve the right to discontinue any product at any time. Prices for our products are subject to change without notice.</p>
        <h3 className="text-2xl font-bold">Installation and Liability</h3>
        <p>Marco Tac Life is not responsible for any damage to your vehicle or personal injury resulting from the installation or use of the products we sell. We highly recommend professional installation for suspension components, electrical accessories, and armor.</p>
      </div>
    )
  },
  'dealer-program': {
    title: 'Dealer Program',
    icon: Users,
    content: (
      <div className="space-y-6">
        <p>Are you a shop owner or off-road outfitter? Join the Marco Tac Life dealer program and get access to wholesale pricing on our entire catalog.</p>
        <h3 className="text-2xl font-bold">Benefits</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Tiered wholesale pricing based on volume.</li>
          <li>Dedicated B2B support rep.</li>
          <li>Early access to new product releases.</li>
          <li>Drop-shipping available for select brands.</li>
        </ul>
        <p>To apply, please email your business license and reseller permit to dealers@marcotaclife.com.</p>
      </div>
    )
  }
};

export default function ContentPage() {
  const { slug } = useParams();
  
  let pageKey = slug || '';
  
  const page = pageContent[pageKey] || { title: 'Page Not Found', icon: Info, content: 'The page you are looking for does not exist.' };
  const Icon = page.icon;

  return (
    <div className="bg-white min-h-screen pb-24">
      <div className="bg-border/10 py-4">
        <div className="container-custom flex items-center gap-2 text-[12px] uppercase font-bold tracking-widest text-muted">
          <Link to="/" className="hover:text-dark">Home</Link>
          <ChevronRight size={12} />
          <span className="text-dark">{page.title}</span>
        </div>
      </div>

      <div className="container-custom pt-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-6 mb-12">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <Icon size={40} />
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
              {page.title}
            </h1>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="text-lg text-muted leading-relaxed mb-12">
              {page.content}
            </div>

            {slug === 'contact-us' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="p-8 bg-border/10 rounded-xl text-center">
                  <MapPin size={32} className="text-primary mx-auto mb-4" />
                  <h4 className="font-black uppercase tracking-widest text-sm mb-2">Visit Us</h4>
                  <p className="text-xs text-muted">123 Offroad Way<br />Adventure City, ST 12345</p>
                </div>
                <div className="p-8 bg-border/10 rounded-xl text-center">
                  <Phone size={32} className="text-primary mx-auto mb-4" />
                  <h4 className="font-black uppercase tracking-widest text-sm mb-2">Call Us</h4>
                  <p className="text-xs text-muted">(555) 123-4567<br />Mon-Fri: 9am - 6pm</p>
                </div>
                <div className="p-8 bg-border/10 rounded-xl text-center">
                  <Mail size={32} className="text-primary mx-auto mb-4" />
                  <h4 className="font-black uppercase tracking-widest text-sm mb-2">Email Us</h4>
                  <p className="text-xs text-muted">support@marcotaclife.com<br />24/7 Support</p>
                </div>
              </div>
            )}

            <div className="mt-16 pt-12 border-t border-border">
              <Link to="/" className="btn-primary px-12 py-4 inline-flex items-center gap-3">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
