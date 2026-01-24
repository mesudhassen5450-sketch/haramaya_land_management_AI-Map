import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Home as HomeIcon, CheckCircle, ChevronRight, MapPin, Phone, Mail, Calendar, Target, ShieldCheck, Database, Landmark, MousePointer2, Bot } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { Card } from '@/components/website/ui/Card';
import { SectionHeader } from '@/components/website/ui/SectionHeader';
import CosmicBackground from '@/components/ui/CosmicBackground';
import { MagneticButton } from '@/components/website/ui/MagneticButton';
import { NumberTicker } from '@/components/website/ui/NumberTicker';

const Home = ({ lang }: any) => {
    const t: any = {
        en: {
            heroTitle: "Haramaya Subcity Land Management Portal",
            heroSubtitle: "Ensuring secure, transparent, and efficient land administration through modern technology.",
            ctaPrimary: "Explore Services",
            ctaSecondary: "About Bureau",
            historyTitle: "Institutional History",
            established: "Established to serve the growing needs of our community.",
            woredaHistory: "Woreda Land Bureau",
            subCityHistory: "Sub-city Land Office",
            workingDaysTitle: "Working Days",
            workingDays: "Monday - Friday (8:30 AM - 5:30 PM)",
            locationsTitle: "Our Strategic Locations",
            locationsSubtitle: "Accessible offices serving all sectors of Haramaya.",
            kebele01: "Kebele 01 Office",
            kebele02: "Kebele 02 Office",
            kebele03: "Kebele 03 Office",
            responsibilitiesTitle: "Core Responsibilities",
            resp1: "Property Registration",
            resp1Desc: "Secure digital registration of all land parcels and property rights.",
            resp2: "Conflict Resolution",
            resp2Desc: "Transparent mediation and legal resolution of land disputes.",
            resp3: "Valuation & Taxation",
            resp3Desc: "Fair property assessment and efficient tax collection systems.",
            resp4: "GIS & Data Management",
            resp4Desc: "Maintain accurate spatial records and geographic information systems.",
            objectivesTitle: "Our Objectives",
            obj1: "Streamlined Management",
            obj2: "Legal Security",
            obj3: "Urban Modernization",
            obj3Desc1: "Standardized land use planning",
            obj3Desc2: "Certified ownership records",
            contactTitle: "Contact Information",
            address: "Haramaya Sub-city Administration",
            phone: "0911792303",
            email: "fayoambo2017@gmail.com",
            announcementsTitle: "Latest Announcements",
            announcementsSubtitle: "Stay updated with land policies and public notices",
            policyUpdate: "Land Policy Update 2026",
            policyDesc: "Revised guidelines for rural land allocation and urban development projects.",
            publicNotice: "Public Consultation",
            noticeDesc: "Join our next town hall meeting regarding Kebele 01 boundary refinements.",
            deadlinesTitle: "Important Deadlines",
            deadline1: "Tax Payment Due: Jan 30",
            deadline2: "Parcel Survey Window",
            gisTitle: "Advanced GIS Visualization",
            gisSubtitle: "Precise land tracking and boundary management using satellite data.",
            trustTitle: "Voices of Trust",
            trustSubtitle: "Emphasizing transparency and efficiency in every transaction.",
            quote1: "The digital transition has eliminated delays and ensured my land rights are secure.",
            quote1Author: "- Local Farmer, Haramaya",
            quote2: "Transparency is our foundation. We serve with integrity and speed.",
            quote2Author: "- Woreda Land Bureau Head",
            visionQuote: "A city built on transparency and trust is a city that thrives. We are proud to serve the people of Haramaya.",
            visionAuthor: "- Municipal Vision 2030",
        },
        or: {
            heroTitle: "Portalii Bulchiinsa Lafaa Kutaa Magaalaa Mayaa",
            heroSubtitle: "Teeknoolojii ammayyaatti fayyadamuun bulchiinsa lafaa amansiisaa, iftoomina qabuufi saffisaa ta'e akka mirkanaa'u gochuu.",
            ctaPrimary: "Tajaajila Keenya",
            ctaSecondary: "Waa'ee Biiroo",
            historyTitle: "Seenaa Dhaabbatichaa",
            established: "Fedhii hawaasa keenya gama lafaatiin jiru guutuuf kaayyoon hundeeffame.",
            woredaHistory: "Biiroo Lafaa Woredaa",
            subCityHistory: "Biiroo Lafaa Kutaa Magaalaa",
            workingDaysTitle: "Guyyoota Hojii",
            workingDays: "Wiixata - Jimaata (8:30 AM - 5:30 PM)",
            locationsTitle: "Bakkeewwan Keenya",
            locationsSubtitle: "Kutaaleen Haramayaa hundi tajaajila argachuu danda'u.",
            kebele01: "Waajjira Ganda 01",
            kebele02: "Waajjira Ganda 02",
            kebele03: "Waajjira Ganda 03",
            responsibilitiesTitle: "Itti Gaafatamummaa Keenya",
            resp1: "Galmee Qabeenyaa",
            resp1Desc: "Ragaa qabeenya lafaa hunda sirna karrayyaatiin galmeessuu.",
            resp2: "Fura Wal-dhabdee",
            resp2Desc: "Wal-dhabdee lafaa iftoominaafi haala seera qabeessa ta'een hiikuu.",
            resp3: "Gatii fi Gibira",
            resp3Desc: "Gatii qabeenyaa madaaluufi kaffaltii gibiraa sirnaan sassaabuu.",
            resp4: "GIS fi Bulchiinsa Ragaa",
            resp4Desc: "Ragaa lafaa kaartaa (GIS) kan ammayyaatti fayyadamuun bulchuun.",
            objectivesTitle: "Kaayyoo fi Rakkoo Furuu",
            obj1: "Rakkoo Lafaa Furuu",
            obj2: "Rakkoo Daangaa Furuu",
            obj3: "Bulchiinsa Lafaa Ammayyeessu",
            obj3Desc1: "Karaa ammayaatiin lafa bulchuuf.",
            obj3Desc2: "Ragaa lafaa ammayyeessuuf.",
            contactTitle: "Odeeffannoo Qunnamtii",
            address: "Kutaa Magaalaa Haramayaa",
            phone: "0911792303",
            email: "fayoambo2017@gmail.com",
            announcementsTitle: "Beeksisa Dhihoo",
            announcementsSubtitle: "Imaammata lafaa fi beeksisa uummataa dhihoo hordofaa",
            policyUpdate: "Odeeffannoo Imaammata Lafaa 2026",
            policyDesc: "Qajeelfama haaromfame qoodinsa lafa baadiyaa fi pirojeektota misooma magaalaa.",
            publicNotice: "Mari Hawaasaa",
            noticeDesc: "Mari hawaasaa dhimma daangaa Kebele 01 irratti mari'achuuf taasifamu irratti hirmaadhaa.",
            deadlinesTitle: "Beellama Barbaachisoo",
            deadline1: "Gibira Kaffaluuf: Muddee 30",
            deadline2: "Yeroo Sakatta'iinsa Lafaa",
            gisTitle: "Agarsiisa GIS Ammayyaa",
            gisSubtitle: "Hordoffii lafaa fi bulchiinsa daangaa sirrii odeeffannoo saatalaayitiitiin deeggarame.",
            trustTitle: "Sagalee Amanamummaa",
            trustSubtitle: "Xiyyeeffannoo iftoominaa fi dandeettii irratti goonee hojjenna.",
            quote1: "Teeknoolojiitti ce'uun keenya kaffaltii ragaa lafaa kiyyaa saffisiisee jira.",
            quote1Author: "- Qotee Bulaa, Haramaya",
            quote2: "Iftoominni bu'uura keenya. Amanamummaa fi saffisaan tajaajilla.",
            quote2Author: "- Hoogganaa Biiroo Lafaa Woredaa",
            visionQuote: "Magaalaan iftoominaa fi amanamummaa irratti ijaaramte ni dandeessi. Uummata Haramayaat tajaajiluu keenyatti boonna.",
            visionAuthor: "- Mul'ata Magaalaa 2030",
        }
    }[lang];

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);
    const opacityHero = useTransform(scrollY, [0, 300], [1, 0]);
    const scaleHero = useTransform(scrollY, [0, 300], [1, 0.8]);

    // Mouse Follow Spotlight Logic
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        mouseX.set(clientX);
        mouseY.set(clientY);
    };

    return (
        <div
            className="bg-transparent min-h-screen relative selection:bg-brand-gold selection:text-brand-dark"
            onMouseMove={handleMouseMove}
        >
            <CosmicBackground />

            {/* Interactive Mouse Spotlight Overlay */}
            <motion.div
                className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
                style={{
                    background: useTransform(
                        [springX, springY],
                        ([x, y]) => `radial-gradient(600px circle at ${x}px ${y}px, rgba(212, 175, 55, 0.05), transparent 80%)`
                    )
                }}
            />

            {/* Hero Section */}
            <div className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
                <motion.div
                    style={{ y: y1 }}
                    className="absolute inset-0 z-0 bg-cover bg-center"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5 }}
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}
                    />
                    <div className="absolute inset-0 bg-brand-green/40 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent"></div>
                </motion.div>

                <motion.div
                    style={{ y: y2, opacity: opacityHero, scale: scaleHero }}
                    className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white"
                >
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                    >
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-5xl md:text-8xl font-black mb-8 tracking-tighter drop-shadow-2xl"
                        >
                            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
                                {t.heroTitle}
                            </span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-xl md:text-3xl mb-12 text-brand-light/70 max-w-4xl mx-auto font-medium leading-tight"
                        >
                            {t.heroSubtitle}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="flex flex-col sm:flex-row justify-center items-center gap-6"
                        >
                            <Link to="/services">
                                <MagneticButton>
                                    <span className="flex items-center gap-3">
                                        {t.ctaPrimary}
                                        <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </MagneticButton>
                            </Link>
                            <Link
                                to="/about"
                                className="px-10 py-5 rounded-full font-black text-lg border-2 border-white/10 hover:border-white/40 hover:bg-white/5 backdrop-blur-md transition-all text-white/80 hover:text-white"
                            >
                                {t.ctaSecondary}
                            </Link>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Scrolldown Indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
                >
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
                        <div className="w-1 h-2 bg-white/70 rounded-full"></div>
                    </div>
                </motion.div>
            </div>

            {/* Stats / Quick Info Strip */}
            <div className="relative z-20 -mt-24 mx-4 md:mx-auto max-w-6xl">
                <div className="bg-brand-dark/30 backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-2xl p-12 grid grid-cols-1 md:grid-cols-3 gap-12 text-center overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 via-transparent to-brand-green/5" />
                    <div className="relative p-4">
                        <div className="text-6xl font-black text-white mb-2 tracking-tighter">
                            <NumberTicker value={50000} />+
                        </div>
                        <div className="text-brand-gold font-black uppercase text-xs tracking-[0.2em]">Residents Served</div>
                    </div>
                    <div className="relative p-4 md:border-x border-white/10">
                        <div className="text-6xl font-black text-white mb-2 tracking-tighter">
                            <NumberTicker value={15000} />+
                        </div>
                        <div className="text-brand-gold font-black uppercase text-xs tracking-[0.2em]">Land Certificates</div>
                    </div>
                    <div className="relative p-4">
                        <div className="text-6xl font-black text-white mb-2 tracking-tighter">
                            <NumberTicker value={100} />%
                        </div>
                        <div className="text-brand-gold font-black uppercase text-xs tracking-[0.2em]">Digital Transition</div>
                    </div>
                </div>
            </div>

            {/* Announcements & Deadlines Section */}
            <section className="py-24 bg-transparent relative z-10 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className="lg:col-span-2"
                        >
                            <SectionHeader title={<span className="text-white">{t.announcementsTitle}</span>} subtitle={<span className="text-brand-light/70">{t.announcementsSubtitle}</span>} align="left" />
                            <div className="space-y-6">
                                {[
                                    { title: t.policyUpdate, desc: t.policyDesc, date: "Jan 15, 2026", type: "Policy" },
                                    { title: t.publicNotice, desc: t.noticeDesc, date: "Jan 12, 2026", type: "Notice" }
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.2, duration: 0.5 }}
                                        className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 hover:border-brand-gold/30 transition-all cursor-pointer group relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 left-0 w-1 h-full bg-brand-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="px-3 py-1 bg-brand-gold/20 text-brand-gold text-[10px] font-black rounded-full uppercase tracking-widest border border-brand-gold/30">{item.type}</span>
                                            <span className="text-white/40 text-xs font-bold">{item.date}</span>
                                        </div>
                                        <h3 className="text-2xl font-black text-white mb-2 group-hover:text-brand-gold transition-colors">{item.title}</h3>
                                        <p className="text-brand-light/60 leading-relaxed font-medium">{item.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className="lg:col-span-1"
                        >
                            <Card className="bg-gradient-to-br from-brand-gold/10 to-brand-gold/5 backdrop-blur-3xl border border-white/10 p-10 h-full rounded-[3rem] shadow-2xl">
                                <h3 className="text-2xl font-black text-brand-gold mb-8 flex items-center gap-3">
                                    <Calendar className="animate-bounce" size={28} />
                                    {t.deadlinesTitle}
                                </h3>
                                <div className="space-y-10">
                                    <div className="relative pl-10 border-l-2 border-brand-gold/20">
                                        <div className="absolute left-[-6px] top-0 w-3 h-3 rounded-full bg-brand-gold shadow-[0_0_15px_#D4AF37]"></div>
                                        <h4 className="text-white text-lg font-black mb-2">{t.deadline1}</h4>
                                        <p className="text-brand-light/50 text-sm font-medium italic">Avoid 5% late penalty.</p>
                                    </div>
                                    <div className="relative pl-10 border-l-2 border-brand-gold/20">
                                        <div className="absolute left-[-6px] top-0 w-3 h-3 rounded-full bg-white/20"></div>
                                        <h4 className="text-white text-lg font-black mb-2">{t.deadline2}</h4>
                                        <p className="text-brand-light/50 text-sm font-medium italic">Running through Feb 15.</p>
                                    </div>
                                </div>
                                <div className="mt-16 rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 group">
                                    <img src="/images/home/market_area.png" alt="Market area" className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-1000" />
                                </div>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* History & Establishment Section */}
            <section className="py-24 bg-transparent relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <SectionHeader title={t.historyTitle} align="left" subtitle={t.established} />
                            <div className="space-y-6">
                                <div className="flex gap-4 items-start">
                                    <div className="mt-1 bg-brand-gold/10 p-3 rounded-xl text-brand-gold">
                                        <Landmark size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-2">{t.woredaHistory}</h4>
                                        <p className="text-brand-light/70 leading-relaxed">
                                            Serving the Woreda with excellence, ensuring every piece of land is properly managed and documented.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="mt-1 bg-brand-green/10 p-3 rounded-xl text-brand-green">
                                        <HomeIcon size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-2">{t.subCityHistory}</h4>
                                        <p className="text-brand-light/70 leading-relaxed">
                                            Bringing specialized land services closer to the residents of Haramaya Sub-city.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="mt-1 bg-blue-100/10 p-3 rounded-xl text-blue-400">
                                        <Calendar size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-2">{t.workingDaysTitle}</h4>
                                        <p className="text-brand-light/70 leading-relaxed font-medium">
                                            {t.workingDays}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="aspect-square bg-gray-200 rounded-2xl overflow-hidden shadow-2xl relative z-10 border-8 border-white">
                                <img src="/public/images/home/office.jpg" alt="Office building" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute -right-4 -bottom-4 w-64 h-64 bg-brand-gold/20 rounded-2xl -z-0"></div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Visionary Quote Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="/images/home/modern_city.png" alt="Modern city" className="w-full h-full object-cover opacity-30" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-dark/80 to-transparent"></div>
                </div>
                <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-5xl font-serif text-white italic leading-tight mb-8">
                            "{t.visionQuote}"
                        </h2>
                        <div className="h-1 bg-brand-gold w-24 mx-auto rounded-full mb-6"></div>
                        <p className="text-brand-gold font-bold tracking-widest uppercase">{t.visionAuthor}</p>
                    </motion.div>
                </div>
            </section>

            {/* Our Locations Section */}
            <section className="py-24 bg-transparent relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <SectionHeader title={<span className="text-white">{t.locationsTitle}</span>} subtitle={<span className="text-brand-light/70">{t.locationsSubtitle}</span>} />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        {[
                            { name: t.kebele01, icon: MapPin, color: "text-brand-green", bg: "bg-green-50/10" },
                            { name: t.kebele02, icon: MapPin, color: "text-brand-gold", bg: "bg-yellow-50/10" },
                            { name: t.kebele03, icon: MapPin, color: "text-blue-400", bg: "bg-blue-50/10" }
                        ].map((kebele, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:shadow-xl transition-all">
                                    <div className={`${kebele.bg} ${kebele.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6`}>
                                        <kebele.icon size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-4">{kebele.name}</h3>
                                    <p className="text-brand-light/50 text-sm italic">Core branch providing full registration services.</p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Core Responsibilities Section */}
            <section className="py-24 bg-brand-dark text-white overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">{t.responsibilitiesTitle}</h2>
                        <div className="h-1 bg-brand-gold w-24 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { title: t.resp1, desc: t.resp1Desc, icon: ShieldCheck },
                            { title: t.resp2, desc: t.resp2Desc, icon: FileText },
                            { title: t.resp3, desc: t.resp3Desc, icon: Landmark },
                            { title: t.resp4, desc: t.resp4Desc, icon: Database }
                        ].map((resp, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:bg-white/20 transition-all group"
                            >
                                <resp.icon size={40} className="text-brand-gold mb-6 group-hover:scale-110 transition-transform" />
                                <h3 className="text-xl font-bold mb-3">{resp.title}</h3>
                                <p className="text-white/70 text-sm leading-relaxed">{resp.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* GIS Showcase Section */}
            <section className="py-24 bg-transparent relative z-10 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-brand-dark/40 backdrop-blur-2xl border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                            <div className="p-12 lg:p-20 flex flex-col justify-center">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                >
                                    <div className="inline-flex items-center gap-2 text-brand-gold font-bold tracking-widest uppercase text-sm mb-6">
                                        <div className="w-8 h-[2px] bg-brand-gold"></div>
                                        Innovating Land Management
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8 leading-tight">
                                        {t.gisTitle}
                                    </h2>
                                    <p className="text-xl text-brand-light/60 mb-10 leading-relaxed">
                                        {t.gisSubtitle} Our system utilizes high-precision spatial data to ensure every parcel is accounted for with absolute accuracy.
                                    </p>

                                    {/* Future Innovation Section */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        className="mt-12 p-8 bg-brand-gold/10 border border-brand-gold/20 rounded-2xl backdrop-blur-md relative overflow-hidden group"
                                    >
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <Bot size={64} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-brand-gold mb-4 flex items-center gap-3">
                                            <Bot className="animate-pulse" size={28} />
                                            Future Innovation in our Organisation: AI + GIS System
                                        </h3>
                                        <p className="text-brand-light/70 font-medium italic leading-relaxed">
                                            "Integrating advanced Artificial Intelligence with Geographic Information Systems to predict urban growth, automate property valuation, and enhance citizen engagement. Coming soon."
                                        </p>
                                        <div className="mt-4 flex items-center gap-2 text-brand-gold font-bold text-xs uppercase tracking-widest">
                                            <div className="w-2 h-2 rounded-full bg-brand-gold animate-ping"></div>
                                            Active R&D Phase
                                        </div>
                                    </motion.div>
                                    <div className="flex flex-wrap gap-8">
                                        <div className="flex items-center gap-3">
                                            <ShieldCheck className="text-brand-green" size={28} />
                                            <span className="text-white font-medium">Verified Boundaries</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Target className="text-brand-gold" size={28} />
                                            <span className="text-white font-medium">Satellite Precision</span>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                            <div className="relative min-h-[400px] lg:min-h-[600px]">
                                <img
                                    src="/images/home/gis_map.png"
                                    alt="GIS Visualization"
                                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/60 via-transparent to-transparent"></div>
                                <motion.div
                                    animate={{ top: ['0%', '100%', '0%'] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                                    className="absolute left-0 right-0 h-[2px] bg-brand-green/30 shadow-[0_0_15px_rgba(16,185,129,0.5)] z-20"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Objectives & Problems Section */}
            <section className="py-24 bg-transparent relative z-10 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <SectionHeader title={<span className="text-white">{t.objectivesTitle}</span>} />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="bg-white/5 backdrop-blur-md border-l-4 border-red-500 text-white">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Target className="text-red-500" />
                                {t.obj1}
                            </h3>
                            <p className="text-brand-light/70">Addressing and streamlining overall land management challenges for efficiency.</p>
                        </Card>
                        <Card className="bg-white/5 backdrop-blur-md border-l-4 border-brand-gold text-white">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Target className="text-brand-gold" />
                                {t.obj2}
                            </h3>
                            <p className="text-brand-light/70">Fair and legal resolution of boundary and ownership conflicts.</p>
                        </Card>
                        <Card className="bg-white/5 backdrop-blur-md border-l-4 border-brand-green text-white">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Target className="text-brand-green" />
                                {t.obj3}
                            </h3>
                            <ul className="text-brand-light/70 space-y-2 list-disc pl-5">
                                <li>{t.obj3Desc1}</li>
                                <li>{t.obj3Desc2}</li>
                            </ul>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Trust & Testimonials Section */}
            <section className="py-24 bg-transparent relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <SectionHeader title={<span className="text-white">{t.trustTitle}</span>} subtitle={<span className="text-brand-light/70">{t.trustSubtitle}</span>} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-white/5 backdrop-blur-xl p-10 rounded-[2rem] border-t border-white/20 relative shadow-2xl"
                        >
                            <div className="absolute -top-6 -left-6 w-12 h-12 bg-brand-gold rounded-full flex items-center justify-center text-brand-dark font-serif text-3xl">"</div>
                            <p className="text-xl text-white italic leading-relaxed mb-8">
                                {t.quote1}
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-green to-brand-gold"></div>
                                <div>
                                    <h4 className="text-white font-bold">{t.quote1Author}</h4>
                                    <p className="text-brand-light/40 text-sm">Residencial Parcel Owner</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-white/5 backdrop-blur-xl p-10 rounded-[2rem] border-t border-white/20 relative shadow-2xl"
                        >
                            <div className="absolute -top-6 -left-6 w-12 h-12 bg-brand-green rounded-full flex items-center justify-center text-white font-serif text-3xl">"</div>
                            <p className="text-xl text-white italic leading-relaxed mb-8">
                                {t.quote2}
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-dark to-brand-green"></div>
                                <div>
                                    <h4 className="text-white font-bold">{t.quote2Author}</h4>
                                    <p className="text-brand-light/40 text-sm">Administrative Authority</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Branding Concept Image Overlay */}
                    <div className="mt-20 flex justify-center">
                        <div className="relative group max-w-4xl w-full">
                            <div className="absolute inset-0 bg-brand-gold/10 rounded-3xl blur-3xl group-hover:bg-brand-gold/20 transition-all"></div>
                            <img
                                src="/images/home/trust_concept.png"
                                alt="Trust Concept"
                                className="relative z-10 rounded-3xl shadow-2xl border border-white/10 opacity-90 group-hover:opacity-100 transition-opacity"
                            />
                            <div className="absolute bottom-10 left-10 z-20 bg-brand-dark/40 backdrop-blur-md p-6 rounded-2xl border border-white/10 max-w-sm">
                                <h3 className="text-brand-gold font-bold text-xl mb-2">Built on Integrity</h3>
                                <p className="text-white/70 text-sm">Our 3D digital land models ensure that transparency isn't just a promise—it's a verifiable reality for every citizen.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Details & Final CTA */}
            <section id="contact" className="py-24 bg-transparent relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-r from-brand-green/20 to-brand-dark/40 backdrop-blur-xl border border-white/10 p-12 rounded-3xl shadow-2xl relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div className="text-white">
                                <h2 className="text-3xl md:text-4xl font-bold mb-6">{t.contactTitle}</h2>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-brand-gold">
                                            <MapPin size={24} />
                                        </div>
                                        <div>
                                            <p className="text-white/60 text-sm uppercase tracking-wider">Address</p>
                                            <p className="text-lg font-medium">{t.address}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-brand-gold">
                                            <Phone size={24} />
                                        </div>
                                        <div>
                                            <p className="text-white/60 text-sm uppercase tracking-wider">Phone</p>
                                            <p className="text-lg font-medium">{t.phone}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-brand-gold">
                                            <Mail size={24} />
                                        </div>
                                        <div>
                                            <p className="text-white/60 text-sm uppercase tracking-wider">Email</p>
                                            <p className="text-lg font-medium">{t.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-8 rounded-2xl shadow-xl">
                                <h3 className="text-2xl font-bold text-brand-dark mb-4">Registration of Records</h3>
                                <p className="text-gray-600 mb-8 leading-relaxed">Submit your land records for digital registration. Our team will verify and certify your property status within working days.</p>
                                <Link to="/auth" className="block w-full text-center bg-brand-gold text-brand-dark font-bold py-4 rounded-xl hover:bg-yellow-400 transition-colors shadow-lg">
                                    Portal Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
