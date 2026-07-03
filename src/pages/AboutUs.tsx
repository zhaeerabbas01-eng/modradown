import React from "react";
import SEO from "../components/SEO";
import { motion } from "motion/react";
import { 
  ShieldCheck, Target, Heart, Award, CheckCircle, 
  Linkedin, Twitter, Github, Mail, ArrowRight,
  Briefcase, Cpu, Globe, Lock, Users, Zap, Layout, User
} from "lucide-react";
import AdPlacement from "../components/AdPlacement";

export default function AboutUs() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-gray-100 py-20 relative overflow-hidden font-sans">
      <SEO 
        title="About Us - Muhammad Usman Zhaeer & MuTechBaar Developing Company"
        description="Learn about MuTechBaar Developing Company, our mission to build premium SaaS tools, and our founder Muhammad Usman Zhaeer."
        canonicalUrl="https://modradown.com/about"
      />
      
      {/* Premium Dark Theme Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[800px] h-[800px] rounded-full bg-brand-primary/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full bg-brand-secondary/10 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10">
        
        {/* Header Ad Slot */}
        <div className="mb-12 flex justify-center">
          <AdPlacement type="horizontal" title="Premium Header Ad" />
        </div>

        {/* 1. Founder Section */}
        <motion.div 
          initial="initial"
          animate="animate"
          variants={fadeIn}
          className="mb-24"
        >
          <div className="relative p-[1px] rounded-[2.5rem] bg-gradient-to-b from-white/10 to-transparent overflow-hidden">
            <div className="bg-[#0a0f25]/80 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-12 border border-white/5 shadow-2xl">
              <div className="flex flex-col md:flex-row gap-12 items-center md:items-start">
                
                {/* Dedicated Founder Image Section */}
                <div className="shrink-0 flex flex-col items-center">
                  <div className="w-48 h-48 md:w-56 md:h-56 rounded-full p-2 bg-gradient-to-tr from-brand-primary to-brand-secondary shadow-[0_0_40px_rgba(102,80,255,0.3)]">
                    <div className="w-full h-full rounded-full bg-[#050816] flex items-center justify-center overflow-hidden border-4 border-[#0a0f25] relative">
                      {/* Using the attached image or placeholder */}
                      {/* You can replace this src with your actual founder image path */}
                      <img 
                        src="/founder.jpg" 
                        alt="Muhammad Usman Zhaeer" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback if image doesn't exist yet
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement?.classList.add('fallback-icon');
                        }}
                      />
                      {/* Fallback Icon */}
                      <User className="w-20 h-20 text-gray-600 hidden fallback-icon:block absolute" />
                    </div>
                  </div>
                  <div className="mt-6 flex items-center gap-4">
                    <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors border border-white/5">
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors border border-white/5">
                      <Twitter className="w-4 h-4" />
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors border border-white/5">
                      <Github className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Founder Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-primary/30 bg-brand-primary/10 text-brand-primary text-xs font-semibold uppercase tracking-widest mb-4">
                    <span className="h-2 w-2 rounded-full bg-brand-primary animate-pulse" />
                    CEO & Founder
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-2">
                    Muhammad Usman Zhaeer
                  </h1>
                  
                  <h2 className="text-xl text-gray-400 font-medium tracking-wide mb-6">
                    Founder of <span className="text-white">MuTechBaar Developing Company</span>
                  </h2>
                  
                  <div className="prose prose-invert prose-p:text-gray-400 prose-p:leading-relaxed max-w-none mb-8">
                    <p>
                      Muhammad Usman Zhaeer is the Founder and CEO of MuTechBaar Developing Company. He focuses on AI-powered web applications, modern SaaS platforms, automation tools, SEO solutions, social media productivity tools, and user-friendly digital experiences.
                    </p>
                    <p>
                      His mission is to build fast, reliable, secure, and innovative web products that help creators and businesses worldwide scale their digital operations without friction.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center hover:bg-white/10 transition-colors">
                      <Layout className="w-5 h-5 text-brand-primary mx-auto mb-2" />
                      <span className="text-xs font-medium text-gray-300">SaaS Design</span>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center hover:bg-white/10 transition-colors">
                      <Cpu className="w-5 h-5 text-brand-secondary mx-auto mb-2" />
                      <span className="text-xs font-medium text-gray-300">AI Apps</span>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center hover:bg-white/10 transition-colors">
                      <Globe className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                      <span className="text-xs font-medium text-gray-300">SEO & Web</span>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center hover:bg-white/10 transition-colors">
                      <Zap className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
                      <span className="text-xs font-medium text-gray-300">Automation</span>
                    </div>
                  </div>

                  <a href="mailto:contact@modradown.com" className="inline-flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-xl font-bold text-sm transition-transform hover:scale-[1.02] active:scale-[0.98]">
                    <Mail className="w-4 h-4" />
                    Contact Muhammad
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 2. Company Section */}
        <motion.div 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeIn}
          className="mb-24"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">MuTechBaar Developing Company</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              A premium software agency dedicated to crafting world-class digital products, focusing on performance, security, and exceptional user experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Vision & Mission */}
            <div className="bg-[#0a0f25]/50 border border-white/5 rounded-3xl p-8 hover:bg-[#0a0f25]/80 transition-colors">
              <Target className="w-8 h-8 text-brand-primary mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
              <p className="text-gray-400 leading-relaxed mb-8">
                To build fast, reliable, secure, and innovative web products that empower creators, businesses, and everyday users to achieve their digital goals effortlessly.
              </p>
              
              <Globe className="w-8 h-8 text-brand-secondary mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
              <p className="text-gray-400 leading-relaxed">
                To be the globally recognized standard for digital productivity tools and modern SaaS platforms, continuously pushing the boundaries of web technologies and AI automation.
              </p>
            </div>

            {/* Core Values */}
            <div className="bg-[#0a0f25]/50 border border-white/5 rounded-3xl p-8 hover:bg-[#0a0f25]/80 transition-colors">
              <h3 className="text-2xl font-bold text-white mb-8">Core Values</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
                    <Heart className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">Customer First Approach</h4>
                    <p className="text-sm text-gray-400 mt-1">Every feature we build is designed with the end-user in mind, ensuring a seamless and intuitive experience.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
                    <Lock className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">Security & Privacy</h4>
                    <p className="text-sm text-gray-400 mt-1">We implement enterprise-grade security protocols to ensure user data and privacy are never compromised.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">Performance Excellence</h4>
                    <p className="text-sm text-gray-400 mt-1">Our products are engineered for speed, utilizing modern architectures to deliver blazing fast load times.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 3. Why Choose Us / Technologies */}
        <motion.div 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeIn}
          className="mb-16"
        >
          <div className="bg-gradient-to-r from-[#0a0f25] to-[#121633] border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-brand-primary/20 blur-[100px] pointer-events-none" />
            
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-white mb-6">Why Choose Us?</h3>
                <p className="text-gray-400 leading-relaxed mb-8">
                  At MuTechBaar Developing Company, we don't just write code; we engineer solutions. Our commitment to utilizing the latest technologies ensures that our products are not only future-proof but also highly scalable.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-brand-primary" />
                    Premium SaaS Architecture
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-brand-primary" />
                    AI-Driven Innovation
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-brand-primary" />
                    Global CDN Infrastructure
                  </li>
                </ul>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center">
                  <div className="text-3xl font-black text-white mb-2">1M+</div>
                  <div className="text-sm text-gray-400">Users Served</div>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center">
                  <div className="text-3xl font-black text-white mb-2">99.9%</div>
                  <div className="text-sm text-gray-400">Uptime SLA</div>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center">
                  <div className="text-3xl font-black text-white mb-2">24/7</div>
                  <div className="text-sm text-gray-400">Support</div>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center">
                  <div className="text-3xl font-black text-white mb-2">10+</div>
                  <div className="text-sm text-gray-400">Products</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer Ad Slot */}
        <div className="flex justify-center mt-12">
          <AdPlacement type="horizontal" title="Footer Ad Area" />
        </div>

      </div>
    </div>
  );
}

// Ensure the User icon is imported from lucide-react at the top
