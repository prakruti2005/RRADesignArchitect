import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import AnimatedText from '../components/AnimatedText';
import ParallaxSection from '../components/ParallaxSection';
import ServiceCard from '../components/ServiceCard';
import StatsSection from '../components/StatsSection';
import FloatingElements from '../components/FloatingElements';
import ScrollProgress from '../components/ScrollProgress';
import MouseTrail from '../components/MouseTrail';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <ScrollProgress />
      <MouseTrail />
      {}
      <section 
        className="hero-section"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg)',
        }}
      >
        <div className="overlay-dark"></div>
        <FloatingElements />
        <div className="text-overlay">
          <div className="container-minimal">
            <div className="max-w-4xl">
              <div className="section-subtitle">
                <AnimatedText text="COMMERCIAL" type="fade-in" delay={500} />
              </div>
              <h1 className="section-title">
                <AnimatedText text="ARCHITECTURAL DESIGN" type="slide-up" delay={800} />
              </h1>
              <p className="text-lg md:text-xl leading-relaxed mb-8 md:mb-12 max-w-2xl text-gray-300">
                <AnimatedText 
                  text="Design is about a way of living, be it at home, in the workplace, relaxing, or entertaining. It is our duty as designers to enhance and encourage social interaction through good design."
                  type="slide-up"
                  delay={1200}
                />
              </p>
              <div className="transition-all duration-1000 delay-1500 opacity-0 animate-fade-in">
                <Link to="/projects" className="btn-primary inline-flex items-center group">
                  READ MORE
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="section-padding bg-black">
        <div className="container-minimal">
          <div className="content-grid">
            <div className="space-y-8">
              <div>
                <div className="section-subtitle">
                  <AnimatedText text="ARCHITECTURAL DESIGN" type="fade-in" />
                </div>
                <h2 className="text-5xl font-light mb-8">
                  <AnimatedText text="Commercial Architects" type="slide-up" delay={300} />
                </h2>
              </div>
              <div className="space-y-6 text-gray-300">
                <p>
                  <AnimatedText 
                    text="Our core design philosophy behind all commercial projects is to achieve the right balance between productivity enhancement, and an efficient use of space. We also provide creative solutions that encourage social interaction and stimulation."
                    type="slide-up"
                    delay={600}
                  />
                </p>
                <p>
                  <AnimatedText 
                    text="A key strength of our commercial team is an ability to transcend brand and business identity into architectural and interior design elements. Our commercial architects bring a wealth of experience working with business owners, delivering innovative small to medium scale commercial projects across the UK."
                    type="slide-up"
                    delay={900}
                  />
                </p>
              </div>
            </div>
            <div className="lg:pl-16">
              <ParallaxSection speed={0.3}>
                <div className="image-container">
                  <img
                    src="https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg"
                    alt="Commercial Architecture"
                    className="w-full h-96 object-cover"
                  />
                </div>
              </ParallaxSection>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="section-padding bg-black">
        <div className="container-minimal">
          <div className="content-grid">
            <div className="order-2 lg:order-1">
              <ParallaxSection speed={0.3} direction="up">
                <div className="image-container">
                  <img
                    src="https://images.pexels.com/photos/1571457/pexels-photo-1571457.jpeg"
                    alt="Workplace Design"
                    className="w-full h-96 object-cover"
                  />
                </div>
              </ParallaxSection>
            </div>
            <div className="order-1 lg:order-2 lg:pl-16 space-y-8">
              <div>
                <h2 className="text-5xl font-light mb-8">
                  <AnimatedText text="Workplace" type="slide-up" />
                </h2>
              </div>
              <div className="space-y-6 text-gray-300">
                <p>
                  <AnimatedText 
                    text="We strive to create workplace environments that are inclusive and inspiring with people at its core."
                    type="slide-up"
                    delay={300}
                  />
                </p>
                <p>
                  <AnimatedText 
                    text="Successful commercial architectural designs require in-depth analysis and research in order to align creative thought with business objectives. From the outset, we aspire to understand the particular needs of a business, advising clients on how creative contribution can enhance the working environment, facilitating collaborative communication and making a work space a more engaging place to be."
                    type="slide-up"
                    delay={600}
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="section-padding bg-black">
        <div className="container-minimal">
          <div className="text-center mb-20">
            <div className="section-subtitle">
              <AnimatedText text="OUR SERVICES" type="fade-in" />
            </div>
            <h2 className="text-5xl font-light">
              <AnimatedText text="What We Do" type="slide-up" delay={300} />
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Architectural Design',
                description: 'Complete architectural solutions from concept to completion.',
                image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg'
              },
              {
                title: 'Interior Design',
                description: 'Sophisticated interior spaces that reflect your vision.',
                image: 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg'
              },
              {
                title: 'Project Management',
                description: 'End-to-end project coordination and execution.',
                image: 'https://images.pexels.com/photos/1571457/pexels-photo-1571457.jpeg'
              }
            ].map((service, index) => (
              <ServiceCard
                key={index}
                title={service.title}
                description={service.description}
                image={service.image}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {}
      <StatsSection
        stats={[
          { value: 150, label: 'Projects Completed', suffix: '+' },
          { value: 25, label: 'Years Experience', suffix: '+' },
          { value: 50, label: 'Happy Clients', suffix: '+' },
          { value: 15, label: 'Awards Won', suffix: '+' }
        ]}
        title="Our Impact"
        subtitle="NUMBERS THAT MATTER"
      />

      {}
      <section className="section-padding bg-black border-t border-white/10">
        <div className="container-minimal text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-light mb-8">
              <AnimatedText text="Ready to Start Your Project?" type="slide-up" />
            </h2>
            <p className="text-gray-400 mb-12 text-lg">
              <AnimatedText 
                text="Let's discuss how we can bring your vision to life through thoughtful design and expert execution."
                type="slide-up"
                delay={300}
              />
            </p>
            <div className="transition-all duration-1000 delay-600 opacity-0 animate-fade-in">
              <Link to="/contact" className="btn-primary group inline-flex items-center justify-center">
                <span>GET IN TOUCH</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;