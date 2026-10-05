import { motion } from "motion/react";
import { ShieldCheck, Users, Zap, Laptop, Award, Headphones } from "lucide-react";

const features = [
  {
    title: "Govt. Recognized",
    desc: "All our courses are recognized by the government, ensuring your certificate holds value.",
    icon: ShieldCheck
  },
  {
    title: "Expert Faculty",
    desc: "Learn from instructors who are experts in their fields and passionate about teaching.",
    icon: Users
  },
  {
    title: "Fast Learning",
    desc: "Our curriculum is designed for quick understanding and maximum retention.",
    icon: Zap
  },
  {
    title: "Modern Lab",
    desc: "Access to high-end computers and the latest software tools for practicals.",
    icon: Laptop
  },
  {
    title: "Job Assistance",
    desc: "We help our students find the right career opportunities after course completion.",
    icon: Award
  },
  {
    title: "24/7 Support",
    desc: "Got a doubt? Our team is always here to help you even after class hours.",
    icon: Headphones
  }
];

export default function Features() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-blue/5 rounded-full blur-[120px]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            The <span className="text-neon-purple">Amol Infotech</span> Advantage
          </motion.h2>
          <p className="text-muted-foreground text-lg">
            We provide more than just education; we provide an environment where 
            innovation meets learning.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel p-8 rounded-3xl hover:neon-glow-purple transition-all duration-500 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-neon-purple/10 flex items-center justify-center mb-6 group-hover:bg-neon-purple/20 transition-colors">
                <feature.icon className="w-8 h-8 text-neon-purple" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
