import { motion } from "framer-motion";
import { 
  MapPin, 
  Receipt, 
  Scale, 
  FileText, 
  Users, 
  BarChart3,
  Shield,
  Clock
} from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Land Registration",
    description: "Register and manage land parcels with precise GPS coordinates and detailed ownership records.",
    color: "primary"
  },
  {
    icon: Receipt,
    title: "Tax Assessment",
    description: "Automated tax calculations based on property valuations, land use, and current rates.",
    color: "secondary"
  },
  {
    icon: Scale,
    title: "Property Valuation",
    description: "Professional property valuations using market analysis and infrastructure scoring.",
    color: "accent"
  },
  {
    icon: FileText,
    title: "Dispute Resolution",
    description: "Structured process for handling land disputes with evidence management and tracking.",
    color: "primary"
  },
  {
    icon: Users,
    title: "Citizen Portal",
    description: "Self-service portal for citizens to view properties, pay taxes, and submit requests.",
    color: "secondary"
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description: "Comprehensive dashboards and reports for informed decision-making.",
    color: "accent"
  },
  {
    icon: Shield,
    title: "Secure & Compliant",
    description: "Role-based access control and complete audit trails for all transactions.",
    color: "primary"
  },
  {
    icon: Clock,
    title: "Real-time Updates",
    description: "Instant notifications and real-time status updates for all processes.",
    color: "secondary"
  }
];

const colorClasses = {
  primary: {
    bg: "bg-primary/10",
    border: "border-primary/20",
    icon: "text-primary",
    glow: "from-primary/20 to-primary/5"
  },
  secondary: {
    bg: "bg-secondary/10",
    border: "border-secondary/20",
    icon: "text-secondary",
    glow: "from-secondary/20 to-secondary/5"
  },
  accent: {
    bg: "bg-accent/10",
    border: "border-accent/20",
    icon: "text-accent",
    glow: "from-accent/20 to-accent/5"
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export function FeaturesSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 px-4">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm font-medium mb-4">
            Core Features
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Everything You Need for
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Land Management</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A comprehensive suite of tools designed to streamline land administration, 
            tax collection, and citizen services.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => {
            const colors = colorClasses[feature.color as keyof typeof colorClasses];
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3 }
                }}
                className="group relative"
                style={{ perspective: "1000px" }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${colors.glow} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className={`relative h-full bg-card/50 backdrop-blur-sm border ${colors.border} rounded-2xl p-6 hover:bg-card/80 transition-all duration-300`}>
                  <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`w-6 h-6 ${colors.icon}`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
