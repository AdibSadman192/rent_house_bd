import Head from 'next/head';
import { useState } from 'react';
import { FiChevronRight } from 'react-icons/fi';

const PrivacyPage = () => {
  const [activeSection, setActiveSection] = useState('introduction');

  const sections = [
    { id: 'introduction', title: 'Introduction' },
    { id: 'collection', title: 'Information Collection' },
    { id: 'use', title: 'Use of Information' },
    { id: 'sharing', title: 'Information Sharing' },
    { id: 'security', title: 'Data Security' },
    { id: 'cookies', title: 'Cookies & Tracking' },
    { id: 'rights', title: 'Your Rights' },
    { id: 'children', title: 'Children\'s Privacy' },
    { id: 'updates', title: 'Policy Updates' },
    { id: 'contact', title: 'Contact Us' }
  ];

  const content = {
    introduction: {
      title: 'Introduction',
      content: `Welcome to RentHouseBD's Privacy Policy. This policy explains how we collect, use, disclose, and safeguard your information when you use our platform.

We are committed to protecting your personal information and your right to privacy. If you have any questions about our privacy practices, please contact us using the information provided at the end of this policy.`
    },
    collection: {
      title: 'Information Collection',
      content: `We collect several types of information for various purposes:

Personal Information:
• Name and contact details
• National ID or passport information
• Profile pictures
• Email address and phone number
• Payment information

Property Information:
• Property photos and details
• Location data
• Rental history
• Property preferences

Technical Data:
• IP address
• Browser type and version
• Device information
• Usage patterns
• Login information`
    },
    use: {
      title: 'Use of Information',
      content: `We use your information for the following purposes:

Essential Operations:
• Facilitating property rentals
• Processing payments
• Verifying identities
• Managing user accounts

Service Improvement:
• Analyzing user behavior
• Improving user experience
• Developing new features
• Personalizing content

Communications:
• Sending service updates
• Marketing communications (with consent)
• Responding to inquiries
• Providing support`
    },
    sharing: {
      title: 'Information Sharing',
      content: `We share your information with:

Service Providers:
• Payment processors
• Identity verification services
• Cloud storage providers
• Analytics services

Other Users:
• Property owners see tenant information
• Tenants see owner information
• Public profile information

Legal Requirements:
• Court orders
• Legal obligations
• Law enforcement requests
• Protection of rights

We never sell your personal information to third parties.`
    },
    security: {
      title: 'Data Security',
      content: `We implement security measures to protect your data:

Technical Measures:
• Encryption in transit and at rest
• Secure server infrastructure
• Regular security audits
• Access controls

Organizational Measures:
• Employee training
• Access restrictions
• Security policies
• Incident response plans

However, no method of transmission over the internet is 100% secure. We strive to protect your data but cannot guarantee absolute security.`
    },
    cookies: {
      title: 'Cookies & Tracking',
      content: `We use cookies and similar tracking technologies:

Types of Cookies:
• Essential cookies for site functionality
• Analytics cookies for performance
• Preference cookies for user settings
• Marketing cookies for targeted ads

You can control cookies through your browser settings. Blocking some types of cookies may impact your experience of our site.

We also use:
• Web beacons
• Tracking pixels
• Local storage
• Session storage`
    },
    rights: {
      title: 'Your Rights',
      content: `You have the following rights regarding your data:

Access Rights:
• View your personal data
• Request data copies
• Check data accuracy

Control Rights:
• Update information
• Delete your account
• Restrict processing
• Object to processing

Additional Rights:
• Withdraw consent
• Data portability
• Lodge complaints
• Opt-out of marketing

Contact us to exercise these rights.`
    },
    children: {
      title: 'Children\'s Privacy',
      content: `Our service is not intended for children under 18:

• We do not knowingly collect data from children
• Parents should supervise children's online activities
• We will delete any inadvertently collected children's data
• Contact us if you believe we have collected children's data

Users must be 18 or older to create an account and use our services.`
    },
    updates: {
      title: 'Policy Updates',
      content: `We may update this privacy policy:

• Changes will be posted on this page
• Significant changes will be notified via email
• Continued use constitutes acceptance
• Previous versions will be archived

Last Updated: February 20, 2024

Check this page regularly for updates.`
    },
    contact: {
      title: 'Contact Us',
      content: `For privacy-related inquiries:

Email: privacy@renthousebd.com
Phone: +880 1234-567890
Address: [Your Address], Bangladesh

Data Protection Officer:
Email: dpo@renthousebd.com

We aim to respond to all privacy requests within 48 hours.`
    }
  };

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Head>
        <title>Privacy Policy | RentHouseBD</title>
        <meta name="description" content="Privacy Policy for RentHouseBD's property rental platform" />
      </Head>

      <div className="pt-24 pb-16">
        {/* Hero Section */}
        <div className="container mx-auto px-4 text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your privacy is important to us. Learn how we protect and manage your data.
          </p>
        </div>

        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Navigation Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-xl shadow-soft p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Contents</h2>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left px-4 py-2 rounded-lg flex items-center justify-between group transition-colors duration-200 ${
                        activeSection === section.id
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{section.title}</span>
                      <FiChevronRight
                        className={`w-4 h-4 transition-transform duration-200 ${
                          activeSection === section.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        }`}
                      />
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="lg:w-3/4">
              <div className="bg-white rounded-xl shadow-soft p-8">
                {sections.map((section) => (
                  <div
                    key={section.id}
                    id={section.id}
                    className={`mb-12 last:mb-0 scroll-mt-24`}
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {content[section.id].title}
                    </h2>
                    <div className="prose prose-lg max-w-none">
                      {content[section.id].content.split('\n\n').map((paragraph, index) => (
                        <p key={index} className="text-gray-600 mb-4 last:mb-0">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPage;
