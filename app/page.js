"use client";
import { motion } from "framer-motion";
import { ClipboardCheck, BookOpen, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/Hero";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  ArrowRight,
  Trophy,
  Target,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { features } from "@/data/features";
import { faqs } from "@/data/faqs";
import { howItWorks } from "@/data/howItWorks";
import Features from "@/components/Features";

export default function Home() {
  const steps = [
    {
      number: "1",
      title: "Take Assessment",
      description: "Complete an initial assessment to understand your current knowledge level and learning style.",
      icon: ClipboardCheck,
    },
    {
      number: "2",
      title: "Get Personalized Plan",
      description: "Our AI creates a customized learning plan with quizzes and resources tailored to your needs.",
      icon: BookOpen,
    },
    {
      number: "3",
      title: "Track Progress",
      description: "Monitor your improvement with detailed analytics and adjust your learning path as you grow.",
      icon: LineChart,
    },
  ];

  const stepVariants = {
    initial: { opacity: 0, y: 30, scale: 0.95 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    hover: {
      scale: 1.03,
      boxShadow: "0px 4px 12px rgba(255, 255, 255, 0.08)",
      transition: { duration: 0.2, type: "spring", stiffness: 100 },
    },
  };

  const iconContainerVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1, transition: { duration: 0.2 } },
  };

  const glowVariants = {
    initial: { opacity: 0, blur: "5px" },
    hover: { opacity: 0.8, blur: "20px", transition: { duration: 0.3 } },
  };

  return (
    <>
      <div className="w-full grid-background"></div>
      {/* HeroSection */}
      <HeroSection />

      <section className="py-20" id="how-it-works">
        <div className="container mx-auto px-4">
          {/* Heading */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4  text-purple-600">
              How It Works
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Our AI-powered platform makes learning personalized, efficient, and tailored to your needs.
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
                variants={stepVariants}
                transition={{ delay: index * 0.15, duration: 0.4, type: "tween", ease: "easeOut" }}
                whileHover="hover"
                className="relative bg-white/5 rounded-xl border border-white/10 hover:border-purple-600 p-6 md:p-8 text-center cursor-pointer group overflow-hidden transition-all duration-300"
              >
                <motion.div
                  variants={iconContainerVariants}
                  className="relative z-10 flex items-center justify-center w-14 h-14 md:w-16 md:h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-600 to-purple-400 shadow-md group-hover:scale-110 transition-transform"
                >
                  {/* Lucide Icon here */}
                  {step.icon && <step.icon className="text-white w-7 h-7 md:w-8 md:h-8" />}
                </motion.div>
                <h3 className="text-xl md:text-2xl font-bold mb-2 text-purple-400 group-hover:text-purple-300 transition-colors">
                  {step.title}
                </h3>
                <p className="text-white/70 text-sm md:text-base">{step.description}</p>

                {/* Glow background on hover */}
                <motion.div
                  variants={glowVariants}
                  className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-purple-400/5 opacity-0 group-hover:opacity-80 transition duration-300 blur-lg"
                />
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-12 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold text-purple-600">50+</h3>
              <p className="text-muted-foreground">Industries Covered</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold text-purple-600">1000+</h3>
              <p className="text-muted-foreground">Interview Questions</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold text-purple-600">95%</h3>
              <p className="text-muted-foreground">Success Rate</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold text-purple-600">24/7</h3>
              <p className="text-muted-foreground">AI Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <Features />

      {/* FAQ Section */}
      <section className="w-full py-12 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4 text-purple-600">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Find answers to common questions about our platform
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-purple-200">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="transition-all duration-500 ease-in-out overflow-hidden">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-muted/50 ">
        <div className="mx-auto py-24 rounded-lg backdrop-blur-lg bg-opacity-30">
          <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter gradient-title sm:text-4xl md:text-5xl">
              Ready to Accelerate Your Knowledge? {/* Lighter purple for heading */}
            </h2>
            <p className="mx-auto max-w-[600px] text-white/90 md:text-xl">
              Join thousands of professionals who are advancing their careers
              with AI-powered guidance. {/* Slightly lighter text */}
            </p>
            <Link href="/dashboard" passHref>
              <Button
                size="lg"
                variant="secondary"
                className="h-11 mt-5 animate-bounce text-purple-600 hover:text-white border-2 border-purple-600 hover:bg-purple-600 hover:border-transparent transition duration-300 ease-in-out"
              >
                Discover Your Potential Today
                <ArrowRight className="ml-2 h-4 w-4 text-purple-600 group-hover:text-white" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </>
  );
}
