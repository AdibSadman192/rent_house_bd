import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerNavigation = {
    company: [
      { name: 'About', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Agents', href: '/agents' },
      { name: 'Contact', href: '/contact' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Contact Support', href: '/contact' },
    ],
    legal: [
      { name: 'Terms', href: '/terms' },
      { name: 'Privacy', href: '/privacy' },
      { name: 'Cookie Policy', href: '/privacy#cookies' },
    ],
    services: [
      { name: 'Property Search', href: '/search' },
      { name: 'My Favorites', href: '/favorites' },
      { name: 'Property Listing', href: '/properties' },
      { name: 'Agent Directory', href: '/agents' },
    ],
  };

  const contactInfo = [
    { icon: Mail, text: 'support@renthousebd.com' },
    { icon: Phone, text: '+880 1234-567890' },
    { icon: MapPin, text: 'Dhaka, Bangladesh' },
  ];

  return (
    <footer className="bg-secondary-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-display font-bold tracking-tight text-white">
                Rent<span className="text-primary-400">House</span>
                <span className="font-medium">BD</span>
              </span>
            </Link>
            <p className="text-secondary-400 text-sm leading-relaxed">
              Your trusted platform for finding and listing rental properties in Bangladesh.
              We make the process of finding your next home simple and enjoyable.
            </p>
            <div className="flex items-center space-x-5">
              <a 
                href="#" 
                className="text-secondary-400 hover:text-white transition-all duration-200 
                         transform hover:scale-110"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-secondary-400 hover:text-white transition-all duration-200 
                         transform hover:scale-110"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-secondary-400 hover:text-white transition-all duration-200 
                         transform hover:scale-110"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation Sections */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {footerNavigation.company.map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href} 
                    className="text-secondary-400 hover:text-white text-sm 
                             transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              {footerNavigation.support.map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href} 
                    className="text-secondary-400 hover:text-white text-sm 
                             transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase mb-4">
              Services
            </h3>
            <ul className="space-y-3">
              {footerNavigation.services.map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href} 
                    className="text-secondary-400 hover:text-white text-sm 
                             transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              {contactInfo.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center space-x-3 text-secondary-400">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="py-6 border-t border-secondary-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-secondary-400 text-sm">
              {currentYear} RentHouseBD. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              {footerNavigation.legal.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-secondary-400 hover:text-white text-sm transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
