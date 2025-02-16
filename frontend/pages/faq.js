import Head from 'next/head';
import { useState } from 'react';
import { FiChevronDown, FiHelpCircle } from 'react-icons/fi';

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: 'General',
      questions: [
        {
          q: 'What is RentHouseBD?',
          a: 'RentHouseBD is a comprehensive property rental platform in Bangladesh that connects property owners with potential tenants. We provide a secure and efficient way to list, search, and rent properties.'
        },
        {
          q: 'Is RentHouseBD free to use?',
          a: 'Basic property search and browsing is free for all users. Property owners may need to pay a small fee to list their properties with additional features.'
        },
        {
          q: 'How do I contact support?',
          a: 'You can reach our support team through the Contact page, by email at support@renthousebd.com, or by phone at +880 1234-567890.'
        }
      ]
    },
    {
      category: 'For Tenants',
      questions: [
        {
          q: 'How do I search for properties?',
          a: 'Use our search feature to filter properties by location, price range, number of rooms, and other amenities. You can also save your favorite properties and set up alerts.'
        },
        {
          q: 'Is the listed price negotiable?',
          a: 'Price negotiation depends on individual property owners. You can discuss the price directly with them through our messaging system.'
        },
        {
          q: 'How can I schedule a property viewing?',
          a: 'Once you find a property you\'re interested in, you can request a viewing through the property listing page. The owner will then contact you to arrange a suitable time.'
        }
      ]
    },
    {
      category: 'For Property Owners',
      questions: [
        {
          q: 'How do I list my property?',
          a: 'Sign up for an owner account, verify your identity, and use our "Add Property" feature to create your listing. Make sure to include clear photos and accurate details.'
        },
        {
          q: 'What are the listing fees?',
          a: 'We offer different listing packages starting from free basic listings to premium featured listings. Visit our pricing page for detailed information.'
        },
        {
          q: 'How are tenants verified?',
          a: 'We verify tenant identities through a combination of phone verification, email verification, and optional NID verification. Premium owners can also request additional verification.'
        }
      ]
    },
    {
      category: 'Security & Privacy',
      questions: [
        {
          q: 'How do you protect my personal information?',
          a: 'We use industry-standard encryption and security measures to protect your data. Your personal information is never shared without your consent.'
        },
        {
          q: 'Are the listed properties verified?',
          a: 'We encourage property verification and mark verified properties with a badge. However, we recommend users to exercise due diligence and verify properties in person.'
        },
        {
          q: 'What should I do if I suspect fraud?',
          a: 'Report suspicious activities immediately using the "Report" button on listings or contact our support team. We take fraud very seriously and investigate all reports.'
        }
      ]
    }
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Head>
        <title>FAQ | RentHouseBD</title>
        <meta name="description" content="Frequently asked questions about RentHouseBD's property rental services" />
      </Head>

      <div className="pt-24 pb-16">
        {/* Hero Section */}
        <div className="container mx-auto px-4 text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about using RentHouseBD. Can't find what you're looking for? Contact our support team.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {faqs.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-8">
                <div className="flex items-center space-x-3 mb-6">
                  <FiHelpCircle className="w-6 h-6 text-primary-600" />
                  <h2 className="text-2xl font-bold text-gray-900">{category.category}</h2>
                </div>
                <div className="space-y-4">
                  {category.questions.map((faq, faqIndex) => {
                    const index = `${categoryIndex}-${faqIndex}`;
                    const isOpen = openIndex === index;

                    return (
                      <div
                        key={faqIndex}
                        className="bg-white rounded-xl shadow-soft overflow-hidden"
                      >
                        <button
                          onClick={() => toggleAccordion(index)}
                          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                        >
                          <span className="text-lg font-medium text-gray-900">{faq.q}</span>
                          <FiChevronDown
                            className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                              isOpen ? 'transform rotate-180' : ''
                            }`}
                          />
                        </button>
                        <div
                          className={`px-6 overflow-hidden transition-all duration-200 ${
                            isOpen ? 'py-4' : 'max-h-0'
                          }`}
                        >
                          <p className="text-gray-600">{faq.a}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Still Have Questions */}
          <div className="max-w-4xl mx-auto mt-16 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Have Questions?</h2>
            <p className="text-gray-600 mb-8">
              Can't find the answer you're looking for? Please chat to our friendly team.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQPage;
