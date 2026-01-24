import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Shield, Receipt } from "lucide-react";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 -left-40 w-80 h-80 rounded-full bg-secondary/20 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-20 right-1/3 w-72 h-72 rounded-full bg-accent/15 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="container relative z-10 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
              <Shield className="w-4 h-4" />
              Haramaya Subcity Digital Services
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          >
            <span className="text-foreground">Land & Tax</span>
            <br />
            <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              Management System
            </span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            A modern digital platform for land registration, property valuation, 
            tax assessment, and citizen services in Haramaya Subcity.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            <Button asChild size="lg" className="px-8 py-6 text-lg group">
              <Link to="/citizen-portal">
                Citizen Portal
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg border-primary/30 hover:bg-primary/5">
              <Link to="/auth">
                Staff Login
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Floating 3D stat cards */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <motion.div
            className="relative group"
            initial={{ opacity: 0, y: 50, rotateX: -15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            whileHover={{ 
              y: -10, 
              rotateY: 5,
              transition: { duration: 0.3 } 
            }}
            style={{ perspective: "1000px" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-50" />
            <div className="relative bg-card/80 backdrop-blur-xl border border-primary/20 rounded-2xl p-6 shadow-2xl">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-1">12,847</h3>
              <p className="text-muted-foreground">Registered Parcels</p>
            </div>
          </motion.div>

          <motion.div
            className="relative group"
            initial={{ opacity: 0, y: 50, rotateX: -15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            whileHover={{ 
              y: -10, 
              rotateY: 5,
              transition: { duration: 0.3 } 
            }}
            style={{ perspective: "1000px" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-50" />
            <div className="relative bg-card/80 backdrop-blur-xl border border-secondary/20 rounded-2xl p-6 shadow-2xl">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-1">8,934</h3>
              <p className="text-muted-foreground">Property Owners</p>
            </div>
          </motion.div>

          <motion.div
            className="relative group"
            initial={{ opacity: 0, y: 50, rotateX: -15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
            whileHover={{ 
              y: -10, 
              rotateY: 5,
              transition: { duration: 0.3 } 
            }}
            style={{ perspective: "1000px" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-accent/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-50" />
            <div className="relative bg-card/80 backdrop-blur-xl border border-accent/20 rounded-2xl p-6 shadow-2xl">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
                <Receipt className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-1">ETB 18.6M</h3>
              <p className="text-muted-foreground">Tax Collected (YTD)</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
