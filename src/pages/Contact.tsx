import React, { useState } from 'react';
import { db } from '../config/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

import AnimatedText from '../components/AnimatedText';
import FloatingElements from '../components/FloatingElements';
import { Mail, Phone, MapPin, Instagram } from 'lucide-react';
import { hasMinLen, isEmail } from '../utils/validation';

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

const initialForm: ContactForm = {
  name: '',
  email: '',
  message: '',
};

const Contact: React.FC = () => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!hasMinLen(form.name, 2)) {
      setError('Please enter your name (min 2 characters).');
      return;
    }
    if (!isEmail(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!hasMinLen(form.message, 10)) {
      setError('Message must be at least 10 characters.');
      return;
    }
    setLoading(true);
    try {
      
      await addDoc(collection(db, 'contactMessages'), {
        name: form.name,
        email: form.email,
        message: form.message,
        createdAt: Timestamp.now(),
      });
      setSuccess(true);
      setForm(initialForm);
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <section
        className="hero-section"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/210265/pexels-photo-210265.jpeg)',
        }}
      >
        <div className="overlay-dark"></div>
        <FloatingElements />
        <div className="text-overlay">
          <div className="container-minimal flex flex-col items-center justify-center w-full">
            <div className="max-w-3xl mx-auto text-center">
              <div className="section-subtitle mb-2">
                <AnimatedText text="CONTACT US" type="fade-in" delay={500} />
              </div>
              <h1 className="section-title text-5xl md:text-6xl font-display font-light mb-6">
                <AnimatedText text="Let's Connect" type="slide-up" delay={800} />
              </h1>
              <p className="text-xl leading-relaxed mb-8 max-w-2xl mx-auto text-gray-300">
                <AnimatedText
                  text="Have a project in mind or want to collaborate? Reach out to us and our team will get back to you soon."
                  type="slide-up"
                  delay={1200}
                />
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="section-padding bg-black">
        <div className="container-minimal">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {}
            <div className="space-y-10">
              <div className="card-elevated rounded-none p-10 md:p-12">
                <div className="section-subtitle mb-3 text-center">Reach Out</div>
                <h2 className="section-title text-center mb-8">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-5 max-w-xl mx-auto">
                  <div>
                    <label className="block text-xs text-white/60 mb-1 uppercase tracking-wide">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className={`w-full bg-black/20 border border-white/15 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/40 ${error && !form.name.trim() ? 'border-red-400' : ''}`}
                      placeholder="Your Name"
                      required
                      aria-invalid={!!error && !form.name.trim()}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/60 mb-1 uppercase tracking-wide">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className={`w-full bg-black/20 border border-white/15 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/40 ${error && !form.email.trim() ? 'border-red-400' : ''}`}
                      placeholder="you@example.com"
                      required
                      aria-invalid={!!error && !form.email.trim()}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/60 mb-1 uppercase tracking-wide">Message</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      className={`w-full bg-black/20 border border-white/15 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/40 min-h-[140px] ${error && !form.message.trim() ? 'border-red-400' : ''}`}
                      placeholder="Your Message..."
                      required
                      aria-invalid={!!error && !form.message.trim()}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-primary btn-compact w-full mt-4 disabled:opacity-60"
                    disabled={loading}
                  >
                    {loading ? 'Sending…' : 'Send Message'}
                  </button>
                  {error && <div className="text-red-300 text-xs text-center">{error}</div>}
                  {success && <div className="text-green-300 text-xs text-center">Thank you for reaching out! We'll get back to you soon.</div>}
                </form>
              </div>

              {/* FAQ */}
              <div className="card-minimal rounded-none p-8">
                <div className="section-subtitle mb-2">FAQ</div>
                <h3 className="text-title uppercase tracking-[0.2em] font-light mb-6">Common Questions</h3>
                <ul className="space-y-4 text-white/70 text-sm md:text-base">
                  <li>
                    <span className="text-white/90 block mb-1 font-light">How soon will I get a response?</span>
                    We aim to reply to all messages within 1 business day.
                  </li>
                  <li>
                    <span className="text-white/90 block mb-1 font-light">Can I visit your office?</span>
                    Yes, please schedule an appointment in advance.
                  </li>
                  <li>
                    <span className="text-white/90 block mb-1 font-light">Do you offer remote consultations?</span>
                    Absolutely—video calls and collaborative online workshops are available.
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column: Contact Details & Map */}
            <div className="space-y-10">
              <div className="card-minimal rounded-none p-10">
                <div className="section-subtitle mb-3">Contact</div>
                <h2 className="text-title uppercase tracking-[0.2em] font-light mb-8">Get In Touch</h2>
                <div className="space-y-5 text-white/80 text-sm md:text-base">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-white/40 mt-0.5" />
                    <span>145, Roongta Signature, Opp. Shyam mandir, New Citylight Road, Surat-395007</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone className="w-5 h-5 text-white/40" />
                    <a href="tel:+919727563075" className="hover:text-white transition-colors">+91 97275 63075</a>
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone className="w-5 h-5 text-white/40" />
                    <a href="tel:+917048230010" className="hover:text-white transition-colors">+91 70482 30010</a>
                  </div>
                  <div className="flex items-center gap-4">
                    <Mail className="w-5 h-5 text-white/40" />
                    <a href="mailto:RRADesignArchitects@gmail.com" className="hover:text-white transition-colors">RRADesignArchitects@gmail.com</a>
                  </div>
                </div>
                <div className="flex gap-6 mt-10">
                  <a href="https://www.instagram.com/rra_designarchitects" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors"><Instagram className="w-6 h-6" /></a>
                </div>
              </div>

              <div className="card-minimal rounded-none p-0 overflow-hidden">
                <div className="p-6 pb-4">
                  <div className="section-subtitle mb-2">Location</div>
                  <h3 className="text-title uppercase tracking-[0.2em] font-light">Our Office</h3>
                </div>
                <div className="border-t border-white/10">
                  <iframe
                    title="Google Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.179849489093!2d72.79640047597191!3d21.145239783766367!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be051f127007e9b%3A0x915fc314125df7d8!2sRoongta%20Signature!5e0!3m2!1sen!2sin!4v1757163553811!5m2!1sen!2sin"
                    width="100%"
                    height="320"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
