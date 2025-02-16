import Head from 'next/head';
import { useState } from 'react';
import { FiChevronRight } from 'react-icons/fi';

const TermsPage = () => {
  const [activeSection, setActiveSection] = useState('introduction');

  const sections = [
    { id: 'introduction', title: 'Introduction' },
    { id: 'definitions', title: 'Definitions' },
    { id: 'account', title: 'Account Terms' },
    { id: 'services', title: 'Services' },
    { id: 'responsibilities', title: 'User Responsibilities' },
    { id: 'content', title: 'Content Guidelines' },
    { id: 'payments', title: 'Payments & Fees' },
    { id: 'termination', title: 'Account Termination' },
    { id: 'liability', title: 'Limitation of Liability' },
    { id: 'privacy', title: 'Privacy & Data' },
    { id: 'changes', title: 'Changes to Terms' },
    { id: 'contact', title: 'Contact Us' }
  ];

  const content = {
    introduction: {
      title: 'Introduction',
      content: `Welcome to RentHouseBD. These Terms of Service ("Terms") govern your access to and use of RentHouseBD's website, services, and applications. By using our services, you agree to be bound by these terms. Please read them carefully.

RentHouseBD provides a platform for property owners and potential tenants to connect and facilitate property rentals in Bangladesh. These terms outline the rules and regulations for the use of our platform.`
    },
    definitions: {
      title: 'Definitions',
      content: `Throughout these Terms, we use certain terms with specific meanings:

• "Service" refers to RentHouseBD's website, applications, and related services
• "User" means any individual who accesses or uses the Service
• "Property Owner" refers to users who list properties for rent
• "Tenant" refers to users who seek to rent properties
• "Content" includes text, images, photos, audio, video, and all other forms of data or communication
• "Property Listing" means any rental property advertised on our platform`
    },
    account: {
      title: 'Account Terms',
      content: `To access certain features of our Service, you must register for an account. When you register, you agree to:

• Provide accurate, current, and complete information
• Maintain and update your information
• Keep your password secure and confidential
• Notify us immediately of any unauthorized use
• Be responsible for all activities under your account
• Be at least 18 years old to create an account`
    },
    services: {
      title: 'Services',
      content: `RentHouseBD provides the following services:

• Property listing and browsing
• Search and filter capabilities
• Messaging between users
• Booking and viewing scheduling
• Payment processing
• Verification services

We reserve the right to modify or discontinue any service at any time. We will notify users of significant changes to our services.`
    },
    responsibilities: {
      title: 'User Responsibilities',
      content: `As a user of RentHouseBD, you agree to:

• Comply with all applicable laws and regulations
• Not misuse our services for illegal purposes
• Not interfere with the proper working of the service
• Not attempt to gain unauthorized access
• Not harass or abuse other users
• Provide accurate information in listings and communications
• Respect the privacy and rights of other users`
    },
    content: {
      title: 'Content Guidelines',
      content: `When posting content on RentHouseBD, you must follow these guidelines:

• Only post accurate and truthful information
• Include clear and recent photos of properties
• Not post discriminatory or offensive content
• Not infringe on others' intellectual property rights
• Not post spam or misleading information
• Not include personal contact information in public areas`
    },
    payments: {
      title: 'Payments & Fees',
      content: `RentHouseBD's payment terms include:

• Service fees for property listings
• Security deposit handling
• Payment processing fees
• Refund policies
• Cancellation fees
• Premium service charges

All fees are non-refundable unless otherwise specified. We reserve the right to change our fee structure with notice to users.`
    },
    termination: {
      title: 'Account Termination',
      content: `We may terminate or suspend your account if you:

• Violate these Terms
• Provide false information
• Engage in fraudulent activity
• Harass other users
• Misuse our services

You may also terminate your account at any time. Upon termination, you lose access to our services.`
    },
    liability: {
      title: 'Limitation of Liability',
      content: `RentHouseBD is not liable for:

• Disputes between users
• Property conditions or misrepresentations
• Financial losses
• Data loss or security breaches
• Service interruptions
• Third-party actions

We provide our service "as is" without any express or implied warranties.`
    },
    privacy: {
      title: 'Privacy & Data',
      content: `We collect and process user data as described in our Privacy Policy. By using our service, you agree to:

• Our data collection practices
• Cookie usage
• Information sharing policies
• Data storage and protection measures
• Your privacy rights and choices

Please review our Privacy Policy for complete details.`
    },
    changes: {
      title: 'Changes to Terms',
      content: `We may modify these Terms at any time. We will notify users of significant changes through:

• Email notifications
• Website announcements
• App notifications

Continued use of our service after changes constitutes acceptance of new terms.`
    },
    contact: {
      title: 'Contact Us',
      content: `For questions about these Terms, contact us at:

• Email: legal@renthousebd.com
• Phone: +880 1234-567890
• Address: [Your Address], Bangladesh

We aim to respond to all inquiries within 2 business days.`
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
        <title>Terms of Service | RentHouseBD</title>
        <meta name="description" content="Terms of Service for RentHouseBD's property rental platform" />
      </Head>

      <div className="pt-24 pb-16">
        {/* Hero Section */}
        <div className="container mx-auto px-4 text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Please read these terms carefully before using RentHouseBD
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

export default TermsPage;
