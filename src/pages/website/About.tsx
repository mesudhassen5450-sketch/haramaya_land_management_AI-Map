import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, History, MapPin, ClipboardList, ShieldCheck, Mail, Phone, Calendar, Clock, Building2 } from 'lucide-react';
import { SectionHeader } from '@/components/website/ui/SectionHeader';
import { Card } from '@/components/website/ui/Card';
import CosmicBackground from '@/components/ui/CosmicBackground';

const About = ({ lang }: { lang: string }) => {
    const t: any = {
        en: {
            heroTitle: "About Haramaya Land Bureau",
            heroSubtitle: "A legacy of secure land administration and modern urban planning.",
            missionTitle: "Our Mission",
            missionDesc: "To ensure a transparent, fair, and efficient land administration system that promotes sustainable development, secures land rights, and fosters economic growth for the community of Haramaya Woreda.",
            visionTitle: "Our Vision",
            visionDesc: "To see a model woreda where every citizen enjoys secure land tenure, efficient land use, and a minimized land-related dispute environment by 2030.",
            historyTitle: "Our History",
            histories: [
                { title: "History of Haramaya Woreda Land Management System", desc: "Serving the broader woreda region with integrated rural and urban land governance structures." },
                { title: "History of Haramaya Sub-City Land Management Office", desc: "Dedicated urban office established to manage the rapid growth and modernization of Haramaya town." }
            ],
            branchesTitle: "Our Branches",
            branchesSubtitle: "The office has three branches established in 2006:",
            branches: [
                "01 Maya Laman Kebele",
                "02 Girdho Kebele",
                "03 Beta Kebele"
            ],
            servicesTitle: "Services We Provide",
            services: [
                { title: "Record Registration", desc: "Official entry of land holdings into legal databases." },
                { title: "Land Ownership Verification", desc: "We verify land ownership documents for legal security." },
                { title: "Land Surveying", desc: "We conduct land surveying through formal registration processes." },
                { title: "Land Registration", desc: "Comprehensive registration of urban and rural holdings." },
                { title: "Tax Collection", desc: "We collect land tax to fund municipal development." },
                { title: "Digital Registration", desc: "We register land records through a state-of-the-art digital system." },
                { title: "Issue Resolution", desc: "Resolving complex land and processing issues." }
            ],
            resTitle: "Responsibilities",
            responsibilities: [
                "Resolving boundary conflicts and disputes",
                "Solving land ownership disputes",
                "Managing land using a modern administration system",
                "Managing land through a secure digital system",
                "Issuing official land ownership certificates",
                "Updating and modernizing land records",
                "Modernizing land administration workflows"
            ],
            contactTitle: "Contact Information",
            workingDays: "Working Days",
            phone: "Phone: 0911792303",
            email: "Email: fayoambo2017@gmail.com",
            address: "Address: Haramaya Sub-City"
        },
        or: {
            heroTitle: "Waajjira Bulchiinsaa Lafaa",
            heroSubtitle: "Maalummaa fi seenaa bulchiinsa lafaa Aanaa Haramayaa.",
            missionTitle: "Ergama Keenya",
            missionDesc: "Sirna bulchiinsa lafaa ifa, haqa qabeessa fi si'ataa ta'e mirkaneessuun misooma itti fufiinsa qabu jajjabeessuu, mirga abbaa qabiyyummaa lafaa kabachiisuu fi guddina dinagdee hawaasa Aanaa Haramayaaf uumuu.",
            visionTitle: "Mul'ata Keenya",
            visionDesc: "Bara 2030tti aanaa fakkeenya ta'e kan lammiin hundi wabii qabiyyee lafaa qabu, itti fayyadama lafaa bu'a qabeessa ta'e fi walitti bu'iinsi lafaan walqabatu xiqqaa ta'e keessatti arguudha.",
            historyTitle: "Seenaa Keenya",
            histories: [
                { title: "Seenaa Sirna Bulchiinsa Lafaa Aanaa Haramayaa", desc: "Bulchiinsa lafaa baadiyaa fi magaalaa aanaa hunda walitti qabuun tajaajilaa jira." },
                { title: "Seenaa Waajjira Bulchiinsa Lafaa Kutaa Magaalaa Haramayaa", desc: "Guddina magaalaa Haramayaa saffisiisuu fi sirna ammayyaatiin bulchuuf kan hundaa'edha." }
            ],
            branchesTitle: "Dameewwan Keenya",
            branchesSubtitle: "Waajjirri damee sadii qaba, bara 2006tti hundaa’e:",
            branches: [
                "01 Maayaa Lamaan Kebelee",
                "02 Girdhoo Kebelee",
                "03 Beeta Kebelee"
            ],
            servicesTitle: "Tajaajiloota Nuti Kenninu",
            services: [
                { title: "Galmeessa Ragaalee", desc: "Ragaalee lafaa karaa seeraa galmeessuu." },
                { title: "Mirkaneessaa Abbummaa", desc: "Ragaa Abbaa Qabiyyummaa Lafaa ni Mirkaneessina." },
                { title: "Safaraa Lafaa", desc: "Safarii Lafaa karaa Galmee (Registration) ni Raawwatna." },
                { title: "Galmee Lafaa", desc: "Galmee lafa magaalaa fi baadiyaa guutuu." },
                { title: "Gibira Sassaabuu", desc: "Gibira Lafaa ni Sassaabna." },
                { title: "Sirna Dijitaalaa", desc: "Ragaa Lafaa karaa Sirna Dijitaalaa ni Galmeessina." },
                { title: "Rakkoo Lafaa Furuu", desc: "Rakkoo lafaa fi adeemsa isaa irratti mudatu furuu." }
            ],
            resTitle: "Gahee fi Itti Gaafatamummaa",
            responsibilities: [
                "Rakkoo Daangaa furuuf",
                "Rakkoo Lafaa Furuu",
                "Kara Ammayyaatiin Lafaa Bulchuu",
                "Sirna Dijitaalaa fayyadamuun Lafaa Bulchuu",
                "Ragaa Abbaa Qabiyyummaa Kennuu",
                "Rakkoo Daangaa Furuu (Conflicts)",
                "Ragaa Lafaa Ammayyeessuu",
                "Bulchiinsa Lafaa Ammayyeessuu"
            ],
            contactTitle: "Odeeffannoo Quunnamtii",
            workingDays: "Guyyoota Hojii",
            phone: "Lakkoofsa Bilbilaa: 0911792303",
            email: "Imeelii: fayoambo2017@gmail.com",
            address: "Teessoo: Kutaa Magaalaa Haramayaa"
        }
    }[lang];

    return (
        <div className="min-h-screen pt-32 pb-20 relative overflow-hidden bg-brand-dark">
            <CosmicBackground />

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                {/* Hero */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/20 border border-brand-gold/30 text-brand-gold text-sm font-bold mb-6"
                    >
                        <Building2 size={18} />
                        OFFICIAL BUREAU PORTAL
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-extrabold text-white mb-6"
                    >
                        {t.heroTitle}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xl text-brand-light/60 max-w-2xl mx-auto"
                    >
                        {t.heroSubtitle}
                    </motion.p>
                </div>

                {/* Mission & Vision */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="bg-brand-green/10 backdrop-blur-xl border border-brand-green/30 p-10 rounded-[3rem] h-full relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Target size={120} />
                            </div>
                            <div className="bg-brand-green/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 text-brand-green border border-brand-green/30">
                                <Target size={32} />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-6">{t.missionTitle}</h2>
                            <p className="text-brand-light/70 text-lg leading-relaxed">{t.missionDesc}</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="bg-brand-gold/10 backdrop-blur-xl border border-brand-gold/30 p-10 rounded-[3rem] h-full relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Eye size={120} />
                            </div>
                            <div className="bg-brand-gold/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 text-brand-gold border border-brand-gold/30">
                                <Eye size={32} />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-6">{t.visionTitle}</h2>
                            <p className="text-brand-light/70 text-lg leading-relaxed">{t.visionDesc}</p>
                        </div>
                    </motion.div>
                </div>

                {/* History & Establishment */}
                <div className="mb-32">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="p-4 rounded-3xl bg-white/5 border border-white/10 text-brand-gold">
                            <History size={32} />
                        </div>
                        <h2 className="text-4xl font-bold text-white">{t.historyTitle}</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {t.histories.map((h: any, i: number) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="lg:col-span-1 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl"
                            >
                                <h3 className="text-xl font-bold text-white mb-4 leading-tight">{h.title}</h3>
                                <p className="text-brand-light/50 text-sm leading-relaxed">{h.desc}</p>
                            </motion.div>
                        ))}

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="lg:col-span-1 bg-gradient-to-br from-brand-gold/20 to-brand-green/20 backdrop-blur-xl border border-white/20 p-8 rounded-3xl flex flex-col justify-center text-center"
                        >
                            <Calendar className="text-brand-gold mx-auto mb-4" size={48} />
                            <h3 className="text-2xl font-black text-white mb-2">{t.branchesSubtitle}</h3>
                            <div className="space-y-2">
                                {t.branches.map((b: string, i: number) => (
                                    <p key={i} className="text-brand-light font-bold flex items-center justify-center gap-2">
                                        <MapPin size={16} className="text-brand-gold" />
                                        {b}
                                    </p>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Services & Responsibilities */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-10 flex items-center gap-3">
                            <ClipboardList className="text-brand-gold" />
                            {t.servicesTitle}
                        </h2>
                        <div className="grid grid-cols-1 gap-4">
                            {t.services.map((s: any, i: number) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-white/5 border border-white/5 p-6 rounded-2xl flex items-start gap-4 hover:bg-white/10 transition-all group"
                                >
                                    <div className="bg-brand-gold/10 p-2 rounded-xl text-brand-gold group-hover:scale-110 transition-transform">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold mb-1">{s.title}</h4>
                                        <p className="text-brand-light/40 text-xs">{s.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-3xl font-bold text-white mb-10 flex items-center gap-3">
                            <Target className="text-brand-green" />
                            {t.resTitle}
                        </h2>
                        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 space-y-6">
                            {t.responsibilities.map((r: string, i: number) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="flex items-center gap-4 text-brand-light/70"
                                >
                                    <div className="w-2 h-2 rounded-full bg-brand-green shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                    <p className="text-lg font-medium">{r}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Contact & Footer Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-brand-dark/40 backdrop-blur-xl border border-white/10 p-10 rounded-[3rem] flex flex-col items-center justify-center text-center group"
                    >
                        <div className="p-5 rounded-full bg-brand-gold/10 text-brand-gold mb-6 group-hover:scale-110 transition-transform">
                            <Phone size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">{t.contactTitle}</h3>
                        <div className="space-y-2 text-brand-light/60">
                            <p className="flex items-center justify-center gap-2 text-xl font-mono text-white">
                                <Phone size={18} className="text-brand-gold" />
                                0911792303
                            </p>
                            <p className="flex items-center justify-center gap-2">
                                <Mail size={18} className="text-brand-gold" />
                                fayoambo2017@gmail.com
                            </p>
                            <p className="flex items-center justify-center gap-2">
                                <MapPin size={18} className="text-brand-gold" />
                                Haramaya Sub-City
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="bg-brand-dark/40 backdrop-blur-xl border border-white/10 p-10 rounded-[3rem] flex flex-col items-center justify-center text-center group"
                    >
                        <div className="p-5 rounded-full bg-brand-green/10 text-brand-green mb-6 group-hover:scale-110 transition-transform">
                            <Clock size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">{t.workingDays}</h3>
                        <div className="bg-brand-green/10 px-6 py-2 rounded-full text-brand-green font-black uppercase tracking-widest text-sm border border-brand-green/30">
                            Available: Mon - Fri
                        </div>
                        <p className="mt-4 text-brand-light/40 italic">
                            Official government working hours.
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default About;
