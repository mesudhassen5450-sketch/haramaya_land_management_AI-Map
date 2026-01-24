import React from 'react';
import { Map, Layers, Info, Navigation, Zap, Compass } from 'lucide-react';
import { motion } from 'framer-motion';
import CosmicBackground from '@/components/ui/CosmicBackground';
import { Card } from '@/components/ui/card';

const ZoningMap = ({ lang }: { lang: string }) => {
    const t: any = {
        en: {
            title: "Zoning & Master Plan",
            subtitle: "Explore the future of Haramaya's urban development and land use categories.",
            legendTitle: "Land Use Legend",
            visionTitle: "The Haramaya 2030 Vision",
            visionDesc: "Our master plan prioritizes sustainable agricultural preservation alongside modern urban expansion. We aim to create a balanced ecosystem where technology meets tradition.",
            zones: [
                { title: "Residential Sector (Blue)", desc: "High and medium density housing areas with integrated community services.", color: "bg-blue-500" },
                { title: "Commercial Sector (Orange)", desc: "Central business districts, markets, and retail hubs for economic growth.", color: "bg-orange-500" },
                { title: "Industrial Sector (Red)", desc: "Light and medium manufacturing zones located for optimal logistics.", color: "bg-red-500" },
                { title: "Green Belt (Green)", desc: "Protected agricultural lands, parks, and sustainable green corridors.", color: "bg-green-500" }
            ],
            interactiveNote: "Note: This is a conceptual visual of the 2030 Master Plan. For specific parcel details, please use the Verification Portal."
        },
        or: {
            title: "Karoora Qoodinsa Lafaa",
            subtitle: "Misooma magaalaa Haramayaa fi kootaa fayyadama lafaa egeree qoradhu.",
            legendTitle: "Ibsituu Mallattoo",
            visionTitle: "Mul'ata Haramayaa 2030",
            visionDesc: "Karoorri waliigalaa keenya misooma magaalaa ammayyaa waliin qonna guddachuu itti fufsiisuuf dursa kenna. Sirna teknolojii fi duudhaan wal-funaanu uumuuf hojjenna.",
            zones: [
                { title: "Kootaa Mana Jireenyaa (Bilaa)", desc: "Bakka jireenyaa uummataa tajaajiloota hawaasummaa waliin qabatu.", color: "bg-blue-500" },
                { title: "Kootaa Daldalaa (Burtukaana)", desc: "Wiirtuuwwan daldalaa, gabaa fi guddiina dinagdee magaalaa.", color: "bg-orange-500" },
                { title: "Kootaa Industirii (Diimaa)", desc: "Bakka warshaalee fi oomishaa lojistiiksiif mijataa ta'an.", color: "bg-red-500" },
                { title: "Kootaa Magariisaa (Magariisa)", desc: "Lafa qonnaa eegumsa qabu, paarkotaa fi karroora magariisaa.", color: "bg-green-500" }
            ],
            interactiveNote: "Hubachiisa: Kun mul'ata karoora waliigalaa 2030 ti. Odeeffannoo lafa dhuunfaatiif 'Verification Portal' fayyadamaa."
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
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-sm font-bold mb-6"
                    >
                        <Compass size={18} />
                        URBAN PLANNING
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left side - Information Cards */}
                    <div className="lg:col-span-1 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-8 rounded-3xl">
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Layers className="text-brand-gold" />
                                    {t.legendTitle}
                                </h2>
                                <div className="space-y-6">
                                    {t.zones.map((zone: any, i: number) => (
                                        <div key={i} className="flex gap-4">
                                            <div className={`w-4 h-4 rounded-full mt-1 shrink-0 ${zone.color} shadow-[0_0_10px_rgba(255,255,255,0.2)]`}></div>
                                            <div>
                                                <h3 className="text-white font-bold text-sm mb-1">{zone.title}</h3>
                                                <p className="text-brand-light/40 text-xs leading-relaxed">{zone.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card className="bg-brand-green/10 backdrop-blur-xl border border-brand-green/20 p-8 rounded-3xl">
                                <Zap className="text-brand-gold mb-4" size={32} />
                                <h2 className="text-xl font-bold text-white mb-4">{t.visionTitle}</h2>
                                <p className="text-brand-light/60 text-sm leading-relaxed mb-6">
                                    {t.visionDesc}
                                </p>
                                <div className="flex items-center gap-2 text-brand-green font-bold text-sm">
                                    <Navigation size={16} />
                                    Explore Detailed GIS Map
                                </div>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Right side - Main Map Visual */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="relative group"
                        >
                            <div className="absolute inset-0 bg-blue-500/10 rounded-[3rem] blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
                            <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-[3rem] overflow-hidden p-4 relative z-10">
                                <div className="relative aspect-video rounded-[2.5rem] overflow-hidden">
                                    <img
                                        src="/images/home/master_plan.png"
                                        alt="Master Plan Visual"
                                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                                    />
                                    {/* HUD Elements Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent pointer-events-none"></div>

                                    <div className="absolute top-6 right-6 flex flex-col gap-2">
                                        <div className="bg-brand-dark/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-white text-xs font-mono">
                                            COORD: 9.4128° N, 42.0211° E
                                        </div>
                                        <div className="bg-brand-dark/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-brand-green text-xs font-mono">
                                            STATUS: OPTIMIZED
                                        </div>
                                    </div>

                                    <div className="absolute bottom-6 left-6 right-6">
                                        <div className="bg-brand-dark/60 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                                            <div className="flex items-center gap-3 text-brand-gold mb-2">
                                                <Info size={18} />
                                                <span className="text-xs font-bold uppercase tracking-widest">Master Plan Concept</span>
                                            </div>
                                            <p className="text-white/70 text-sm">
                                                {t.interactiveNote}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-center gap-12 text-brand-light/30">
                                    <div className="text-center">
                                        <p className="text-2xl font-black text-white">2030</p>
                                        <p className="text-[10px] uppercase font-bold tracking-widest">Phase 1 Delivery</p>
                                    </div>
                                    <div className="w-px h-12 bg-white/10"></div>
                                    <div className="text-center">
                                        <p className="text-2xl font-black text-white">85%</p>
                                        <p className="text-[10px] uppercase font-bold tracking-widest">Zoning Accuracy</p>
                                    </div>
                                    <div className="w-px h-12 bg-white/10"></div>
                                    <div className="text-center">
                                        <p className="text-2xl font-black text-white">4k+</p>
                                        <p className="text-[10px] uppercase font-bold tracking-widest">Hectares Mapped</p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ZoningMap;
