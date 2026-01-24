import React from 'react';
import { motion } from 'framer-motion';
import { Clock, User, ShieldCheck, History as HistoryIcon, Target } from 'lucide-react';
import { SectionHeader } from '@/components/website/ui/SectionHeader';
import { Card } from '@/components/website/ui/Card';
import CosmicBackground from '@/components/ui/CosmicBackground';

const History = ({ lang }: { lang: string }) => {
    const t: any = {
        en: {
            title: "History & Leadership",
            subtitle: "Tracing the path of land governance in Haramaya.",
            milestonesTitle: "Key Milestones",
            leadershipTitle: "Our Leadership",
            milestones: [
                { year: "2024", title: "Digital Transformation Initiated", desc: "Launched the satellite-integrated Land Management Portal." },
                { year: "2020", title: "New Woreda Office Built", desc: "Constructed the main administration hub for Woreda services." },
                { year: "2010", title: "Formal Land Registration Started", desc: "Began the transition from paper-based to systematic land catalogs." },
                { year: "2006", title: "Office Establishment", desc: "The Land Management offices were formally established to serve the community." }
            ],
            leaders: [
                { name: "Obbo Ahmed Ali", role: "Administrator", period: "2018 - Present" },
                { name: "Adde Fatuma Hassan", role: "Deputy Admin", period: "2020 - Present" },
                { name: "Obbo Bekele Tadesse", role: "Land Head", period: "2019 - Present" }
            ]
        },
        or: {
            title: "Seenaa fi Hoggana",
            subtitle: "Adeemsa bulchiinsa lafaa Haramayaa hordofuu.",
            milestonesTitle: "Taiteewwan Gurguddoo",
            leadershipTitle: "Leadership Keenya",
            milestones: [
                { year: "2024", title: "Tiraanisfoormeeshinii Dijitaalaa", desc: "Poortaalii Bulchiinsa Lafaa geessituu saatalaayitii waliin hojiitti galche." },
                { year: "2020", title: "Waajjira Haarawa Ijaarame", desc: "Wiirtuu bulchiinsa aanaa tajaajila adda addaatiif ijaarame." },
                { year: "2010", title: "Galmeessi Lafa Beekamtii Argate", desc: "Galmee waraqaatti fayyadamuu irraa gara sirna ammayyaatti ce'uu eegale." },
                { year: "2006", title: "Hundeeffama Waajjiraa", desc: "Waajjiraaleen Bulchiinsa Lafaa uummata tajaajiluuf ni hundaa'an." }
            ],
            leaders: [
                { name: "Obbo Ahmed Ali", role: "Bulchaa", period: "2018 - Amma" },
                { name: "Adde Fatuma Hassan", role: "I/A Bulchaa", period: "2020 - Amma" },
                { name: "Obbo Bekele Tadesse", role: "Itt-gaafatamaa Lafaa", period: "2019 - Amma" }
            ]
        }
    }[lang];

    return (
        <div className="min-h-screen pt-32 pb-20 relative overflow-hidden bg-brand-dark">
            <CosmicBackground />

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/20 border border-brand-gold/30 text-brand-gold text-sm font-bold mb-6"
                    >
                        <HistoryIcon size={18} />
                        LEGACY & PROGRESS
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
                        className="text-xl text-brand-light/60 max-w-2xl mx-auto"
                    >
                        {t.subtitle}
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Timeline */}
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-12 flex items-center gap-3">
                            <Clock size={32} className="text-brand-gold" />
                            {t.milestonesTitle}
                        </h2>

                        <div className="relative border-l-2 border-brand-gold/20 ml-4 space-y-12">
                            {t.milestones.map((item: any, idx: number) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="relative pl-10"
                                >
                                    <div className="absolute -left-[11px] top-1 bg-brand-gold w-5 h-5 rounded-full border-4 border-brand-dark shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
                                    <h3 className="text-2xl font-black text-brand-gold">{item.year}</h3>
                                    <h4 className="text-xl font-bold text-white mt-1">{item.title}</h4>
                                    <p className="text-brand-light/50 mt-2 italic">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Leaders */}
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-12 flex items-center gap-3">
                            <Target size={32} className="text-brand-green" />
                            {t.leadershipTitle}
                        </h2>

                        <div className="grid grid-cols-1 gap-6">
                            {t.leaders.map((leader: any, idx: number) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all flex items-center gap-6 group">
                                        <div className="w-20 h-20 rounded-full bg-brand-light/10 flex items-center justify-center text-brand-light/40 group-hover:bg-brand-gold/20 group-hover:text-brand-gold transition-colors">
                                            <User size={40} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-1">{leader.name}</h3>
                                            <p className="text-brand-green font-bold text-sm tracking-wide uppercase mb-2">{leader.role}</p>
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-brand-light/40 text-xs border border-white/5">
                                                <Clock size={12} />
                                                {leader.period}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-32 p-12 rounded-[4rem] bg-gradient-to-r from-brand-gold/10 to-brand-green/10 border border-white/10 text-center"
                >
                    <ShieldCheck className="text-brand-gold mx-auto mb-6" size={64} />
                    <h2 className="text-3xl font-bold text-white mb-4">Dedicated to Public Service</h2>
                    <p className="text-brand-light/50 max-w-2xl mx-auto text-lg leading-relaxed italic">
                        "For nearly two decades, our office has been the cornerstone of land governance in Haramaya, evolving from paper ledgers to satellite-backed digital systems."
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default History;
