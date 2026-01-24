import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, Landmark, FileSearch, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Building2,
    title: "Property Registration",
    description: "Register new land parcels, transfer ownership, and obtain official title deeds through our streamlined digital process.",
    link: "/land-registration",
    gradient: "from-primary to-primary/60"
  },
  {
    icon: Landmark,
    title: "Tax Payment",
    description: "View your tax obligations, calculate dues, and make secure online payments with instant receipt generation.",
    link: "/payments",
    gradient: "from-secondary to-secondary/60"
  },
  {
    icon: FileSearch,
    title: "Property Lookup",
    description: "Search property records, view ownership history, and access valuation details for any registered parcel.",
    link: "/citizen-portal",
    gradient: "from-accent to-accent/60"
  },
  {
    icon: CreditCard,
    title: "Payment History",
    description: "Access complete payment records, download receipts, and track your tax payment history over the years.",
    link: "/payments",
    gradient: "from-primary to-accent"
  }
];

export function ServicesSection() {
  return (
    <section className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container px-4 relative z-10">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Citizen Services
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Quick Access to
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Government Services</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Access all land-related services from the comfort of your home. 
            No queues, no paperwork—just simple digital services.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group"
            >
              <div className="relative h-full bg-card border border-border/50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                    <service.icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 text-foreground">{service.title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{service.description}</p>
                  
                  <Button asChild variant="ghost" className="group/btn p-0 h-auto text-primary hover:text-primary hover:bg-transparent">
                    <Link to={service.link}>
                      Learn More
                      <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
