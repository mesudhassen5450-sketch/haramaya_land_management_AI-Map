import React from 'react';
import { BarChart3, TrendingUp, PieChart, Info, ShieldCheck, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import CosmicBackground from '@/components/ui/CosmicBackground';
import { Card } from '@/components/ui/card';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { LandUseChart } from '@/components/dashboard/LandUseChart';

const Transparency = ({ lang }: { lang: string }) => {
    const t: any = {
        en: {
            title: "Transparency & Performance",
            subtitle: "Public metrics showcasing the efficiency and financial accountability of the Haramaya Land Bureau.",
            stats: [
                { title: "Total Revenue Collected", value: "ETB 42.5M", growth: "+12.5%", icon: TrendingUp, color: "text-brand-green" },
                { title: "Lease Titles Issued", value: "1,248", growth: "Active", icon: ShieldCheck, color: "text-brand-gold" },
                { title: "Land Disputes Resolved", value: "92%", growth: "Success Rate", icon: Target, color: "text-blue-400" }
            ],
            chartsTitle: "Annual Performance Metrics",
            revenueDesc: "Track how property taxes and lease revenues are collected to support municipal infrastructure.",
            distributionDesc: "A breakdown of land utilization across Haramaya's urban and rural clusters.",
            note: "All data shown is updated monthly and verified by the Regional Auditor General."
        },
        or: {
            title: "Iftoomummaa fi Hojii",
            subtitle: "Safartuuwwan hojii fi itti gaafatamummaa faayinaansii Biiroo Lafa Haramayaa ifa ta'an.",
            stats: [
                { title: "Galii Waliigalaa Sassaabame", value: "ETB 42.5M", growth: "+12.5%", icon: TrendingUp, color: "text-brand-green" },
                { title: "Waraqaa Ragaa Kenname", value: "1,248", growth: "Hojii Irra", icon: ShieldCheck, color: "text-brand-gold" },
                { title: "Falmiilee Hiikaman", value: "92%", growth: "Milkaa'ina", icon: Target, color: "text-blue-400" }
            ],
            chartsTitle: "Safartuuwwan Hojii Waggaa",
            revenueDesc: "Gibira manaa fi galiiwwan lafaa akkamitti misooma magaalaatiif akka sassaabaman hordofaa.",
            distributionDesc: "Qoodinsa fayyadama lafaa koottaalee magaalaa fi baadiyaa Haramayaa gidduutti.",
            note: "Odeeffannoon kun ji'a ji'aan kan haaromfamuufi Oditara Jeneraala Naannootiin kan mirkanaa'edha."
        }
    }[lang];

    return (
        <div className="min-h-screen pt-32 pb-20 relative overflow-hidden bg-brand-dark">
            <CosmicBackground />

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-green/20 border border-brand-green/30 text-brand-green text-sm font-bold mb-6"
                    >
                        <BarChart3 size={18} />
                        FINANCIAL ACCOUNTABILITY
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-extrabold text-white mb-6"
                    >
                        {t.title}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xl text-brand-light/60 max-w-3xl mx-auto"
                    >
                        {t.subtitle}
                    </motion.p>
                </div>

                {/* Top Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {t.stats.map((stat: any, i: number) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-8 rounded-[2rem] hover:bg-white/10 transition-all group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`p-4 rounded-2xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                                        <stat.icon size={32} />
                                    </div>
                                    <span className="text-xs font-bold text-brand-green bg-brand-green/10 px-3 py-1 rounded-full uppercase">
                                        {stat.growth}
                                    </span>
                                </div>
                                <h3 className="text-brand-light/40 text-sm font-bold uppercase tracking-widest mb-2">{stat.title}</h3>
                                <p className="text-4xl font-black text-white">{stat.value}</p>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Card className="bg-white/5 backdrop-blur-3xl border-white/10 p-10 rounded-[3rem] h-full">
                            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                                <TrendingUp className="text-brand-green" />
                                Revenue Growth
                            </h2>
                            <p className="text-brand-light/40 text-sm mb-10">{t.revenueDesc}</p>
                            <div className="h-[400px]">
                                <RevenueChart />
                            </div>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Card className="bg-white/5 backdrop-blur-3xl border-white/10 p-10 rounded-[3rem] h-full">
                            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                                <PieChart className="text-brand-gold" />
                                Land Utilization
                            </h2>
                            <p className="text-brand-light/40 text-sm mb-10">{t.distributionDesc}</p>
                            <div className="h-[400px]">
                                <LandUseChart />
                            </div>
                        </Card>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-20 p-10 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center gap-4 text-brand-light/40 italic text-sm justify-center"
                >
                    <Info size={20} />
                    {t.note}
                </motion.div>
            </div>
        </div>
    );
};

export default Transparency;
