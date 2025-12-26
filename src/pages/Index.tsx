import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { PropertyFilters } from '@/components/property/PropertyFilters';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { useProperties } from '@/hooks/useProperties';
import { Building2, Sparkles, Home, Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from 'lucide-react';

const Index = () => {
  const [filters, setFilters] = useState({});
  const { data: properties, isLoading } = useProperties({ ...filters, status: 'active' });
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 gradient-dark opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(38_92%_50%/0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(38_92%_50%/0.05),transparent_40%)]" />
        
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6" style={{ animationDelay: '0.1s' }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm animate-fade-in">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">Premium Real Estate Listings</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Find Your
              <span className="gradient-text"> Dream Property</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.3s' }}>
              Discover exceptional properties that match your lifestyle. 
              From luxury homes to modern apartments, your perfect space awaits.
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center glow-primary">
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold">Browse Properties</h2>
              <p className="text-sm text-muted-foreground">
                {properties?.length || 0} properties available
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <PropertyFilters onFiltersChange={setFilters} />
        </div>

        <PropertyGrid properties={properties} isLoading={isLoading} />
      </main>

      {/* Footer */}

      <footer className="border-t border-border py-8 mt-16 bg-gray-900">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="flex flex-col md:flex-row justify-between items-start gap-8">
      {/* About Section - Left */}
      <div className="w-full md:w-auto">
        <div className="flex items-center space-x-2 mb-4">
          <Home className="w-6 h-6 text-blue-500" />
          <span className="text-xl font-bold text-white">PropMarket</span>
        </div>
        <p className="text-sm text-gray-400 mb-4 max-w-sm">
          Your trusted platform for buying, selling, and discovering properties. 
          Find your dream home with ease.
        </p>
        <div className="flex space-x-4">
          <a href="www.facebook.com" className="text-gray-400 hover:text-blue-500 transition">
            <Facebook className="w-5 h-5" />
          </a>
          <a href="www.x.com" className="text-gray-400 hover:text-blue-500 transition">
            <Twitter className="w-5 h-5" />
          </a>
          <a href="www.instagram.com" className="text-gray-400 hover:text-pink-500 transition">
            <Instagram className="w-5 h-5" />
          </a>
          <a href="www.linkedin.com" className="text-gray-400 hover:text-blue-500 transition">
            <Linkedin className="w-5 h-5" />
          </a>
        </div>
      </div>
     
      {/* Contact - Right */}
      <div className="w-full md:w-auto">
        <h3 className="text-white font-semibold mb-4">Contact Us</h3>
        <ul className="space-y-3">
          <li className="flex items-center space-x-2 text-sm text-gray-400">
            <Mail className="w-4 h-4 text-blue-500" />
            <a href="mailto:info@propmarket.com" className="hover:text-blue-500 transition">
              info@propmarket.com
            </a>
          </li>
          <li className="flex items-center space-x-2 text-sm text-gray-400">
            <Phone className="w-4 h-4 text-blue-500" />
            <a href="tel:+94234567890" className="hover:text-blue-500 transition">
              +94 (234) 567-890
            </a>
          </li>
          <li className="text-sm text-gray-400">
            123 Main Street<br />
            Colombo, 10001<br />
            Sri Lanka
          </li>
        </ul>
      </div>
    </div>

    {/* Bottom Bar */}
    <div className="border-t border-gray-800 mt-8 pt-8">
      <p className="text-sm text-gray-400 text-center">
        © {currentYear} PropMarket. All rights reserved.
      </p>
    </div>
  </div>
</footer>

    </div>
  );
};

export default Index;
