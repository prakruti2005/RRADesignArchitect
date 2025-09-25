import React, { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { collection, addDoc, getDocs, Timestamp, query, orderBy } from 'firebase/firestore';

import AnimatedText from '../components/AnimatedText';
import FloatingElements from '../components/FloatingElements';
import { Quote, Linkedin, Instagram, Twitter } from 'lucide-react';
import { team, TeamMember } from '../data/team';
import { hasMinLen } from '../utils/validation';

interface Review {
  id?: string;
  name: string;
  review: string;
  createdAt?: any;
}

const About: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState('');
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  
  useEffect(() => {
    const fetchReviews = async () => {
      const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setReviews(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Review));
    };
    fetchReviews();
  }, [success]);

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!hasMinLen(name, 2)) {
      setError('Please enter your name (min 2 characters).');
      return;
    }
    if (!hasMinLen(review, 10)) {
      setError('Review must be at least 10 characters.');
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        name,
        review,
        createdAt: Timestamp.now(),
      });
      setName('');
      setReview('');
      setSuccess(true);
    } catch (err) {
      setError('Failed to add review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
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
          <div className="container-minimal flex flex-col items-center justify-center w-full">
            <div className="max-w-3xl mx-auto text-center">
              <div className="section-subtitle mb-2">
                <AnimatedText text="ABOUT US" type="fade-in" delay={500} />
              </div>
              <h1 className="section-title">
                <AnimatedText text="ABOUT US" type="slide-up" delay={800} />
              </h1>
              <p className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto text-white/80">
                <AnimatedText
                  text="We are a passionate team of architects and designers dedicated to creating meaningful, beautiful spaces. Our mission is to blend creativity, functionality, and sustainability in every project we undertake."
                  type="slide-up"
                  delay={1200}
                />
              </p>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="section-padding bg-black">
        <div className="container-minimal">
          <div className="max-w-5xl mx-auto text-center mb-16">
            <div className="section-subtitle mb-2">Studio</div>
            <h2 className="section-title mb-6">Who We Are</h2>
            <p className="text-body text-white/80 mb-8 max-w-3xl mx-auto">
              At RRA DESIGN ARCHITECTS, we believe that great design is about more than just aesthetics—it's about creating spaces that inspire, function beautifully, and stand the test of time. Our team brings together diverse backgrounds in architecture, interior design, and engineering to deliver holistic solutions for every client.
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-left mb-12">
              <div className="card-minimal rounded-none p-8">
                <h3 className="text-title uppercase tracking-[0.2em] font-light mb-3">Our Philosophy</h3>
                <p className="text-body text-white/70">We approach every project with curiosity, creativity, and a commitment to excellence. We listen deeply to our clients and strive to reflect their vision in every detail. We believe in sustainable, people-centric design that stands the test of time.</p>
              </div>
              <div className="card-minimal rounded-none p-8">
                <h3 className="text-title uppercase tracking-[0.2em] font-light mb-3">Our Values</h3>
                <ul className="list-disc list-inside text-white/70 text-base space-y-1">
                  <li>Creativity & Innovation</li>
                  <li>Integrity & Transparency</li>
                  <li>Sustainability & Responsibility</li>
                  <li>Client-Centric Approach</li>
                  <li>Collaboration & Respect</li>
                  <li>Continuous Learning</li>
                </ul>
              </div>
              <div className="card-minimal rounded-none p-8">
                <h3 className="text-title uppercase tracking-[0.2em] font-light mb-3">What We Offer</h3>
                <ul className="list-disc list-inside text-white/70 text-base space-y-1">
                  <li>Architecture & Interior Design</li>
                  <li>Project Engineering</li>
                  <li>Consulting & Planning</li>
                  <li>Green Building Solutions</li>
                </ul>
              </div>
            </div>

            {/* Dynamic Team Section */}
            <div className="section-subtitle mb-2">Team</div>
            <h2 className="section-title mb-8">Meet the Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto justify-items-center">
              {team.map((member: TeamMember) => (
                <div key={member.name} className="card-minimal rounded-none p-8 flex flex-col items-center text-center">
                  <img src={member.image} alt={`${member.name} headshot`} className="w-24 h-24 rounded-full object-cover mb-4 border border-white/20" />
                  <div className="text-title uppercase tracking-[0.1em] font-light mb-1">{member.name}</div>
                  <div className="text-xs text-white/60 mb-3 uppercase tracking-[0.2em]">{member.role}</div>
                  <div className="text-body text-white/80 mb-4">{member.bio}</div>
                  <div className="flex gap-4 justify-center text-white/70">
                    {member.socials?.linkedin && (
                      <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
                    )}
                    {member.socials?.instagram && (
                      <a href={member.socials.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
                    )}
                    {member.socials?.twitter && (
                      <a href={member.socials.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews & Form Section */}
      <section className="section-padding bg-black">
        <div className="container-minimal">
          <div className="max-w-3xl mx-auto card-elevated rounded-none px-6 py-12 md:px-12 md:py-16">
            <h2 className="section-title text-center mb-6">Client Reviews</h2>
            <div className="space-y-6 mb-10">
              {reviews.length === 0 && <div className="text-white/60 text-center">No reviews yet.</div>}
              {reviews.map(r => (
                <div key={r.id} className="card-minimal rounded-none p-6 flex flex-col items-center">
                  <Quote className="w-8 h-8 text-white/30 mb-2" />
                  <div className="text-white/90 text-lg italic mb-2 text-center">{r.review}</div>
                  <div className="text-xs text-white/50">— {r.name}</div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="card-minimal rounded-none p-8 space-y-4 max-w-lg mx-auto">
              <h3 className="text-title uppercase tracking-[0.2em] font-light mb-4 text-center">Add Your Review</h3>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-black/20 border border-white/15 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/40"
                placeholder="Your Name"
                required
              />
              <textarea
                value={review}
                onChange={e => setReview(e.target.value)}
                className="w-full bg-black/20 border border-white/15 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/40 min-h-[72px]"
                placeholder="Your review..."
                required
              />
              <button
                type="submit"
                className="btn-primary btn-compact w-full mt-2 disabled:opacity-60"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Review'}
              </button>
              {error && <div className="text-red-200 text-xs mt-2 text-center">{error}</div>}
              {success && <div className="text-green-200 text-xs mt-2 text-center">Thank you for your review!</div>}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
