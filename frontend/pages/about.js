import Head from 'next/head';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Target, 
  Users, 
  Shield, 
  Globe, 
  Award, 
  CheckCircle 
} from 'lucide-react';

export default function AboutPage() {
  const teamMembers = [
    {
      name: 'Adib Sadman',
      role: 'Founder & CEO',
      image: '/images/team/adib.jpg'
    }
    //,{
      //name: 'Sarah Khan',
      //role: 'Head of Product',
      //image: '/images/team/sarah.jpg'
    //}
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <Head>
        <title>About RentHouse BD - Revolutionizing Property Rentals</title>
      </Head>

      <main className="container mx-auto px-4 py-16">
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About RentHouse BD
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We are transforming the property rental landscape in Bangladesh by creating a transparent, efficient, and user-friendly platform that connects property owners and renters seamlessly.
          </p>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Target className="w-12 h-12 text-primary-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
            <p className="text-gray-600">
              To simplify property rentals by providing a reliable, transparent, and innovative digital platform.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <Users className="w-12 h-12 text-primary-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
            <p className="text-gray-600">
              Become the most trusted and comprehensive property rental ecosystem in Bangladesh.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <Shield className="w-12 h-12 text-primary-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Our Values</h3>
            <ul className="text-gray-600 space-y-2">
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                Transparency
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                Trust
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                Innovation
              </li>
            </ul>
          </div>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Our Team
          </h2>
          <div className="flex justify-center space-x-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden border-4 border-primary-100">
                  <Image 
                    src={member.image} 
                    alt={member.name} 
                    width={192} 
                    height={192} 
                    className="object-cover" 
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {member.name}
                </h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  );
}
