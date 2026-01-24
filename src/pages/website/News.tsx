import React, { useState, useEffect } from 'react';
import { Calendar, Image, Bell, Info, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/website/ui/Card';
import { Badge } from '@/components/website/ui/Badge';
import { SectionHeader } from '@/components/website/ui/SectionHeader';
import CosmicBackground from '@/components/ui/CosmicBackground';

const News = ({ lang }: { lang: string }) => {
    const [newsItems, setNewsItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const mockNews = [
        {
            id: '1',
            title_en: 'Digital Land Portal Launch',
            title_or: 'Eebba Poortaalii Lafaa Dijitaalaa',
            content_en: 'We are proud to announce the official launch of the Haramaya digital land management portal, simplifying services for all citizens.',
            content_or: 'Baga gammaddan! Poortaaliin bulchiinsa lafaa dijitaalaa Haramayaa ifatti banameera, tajaajila lammiilee hundaaf salphisa.',
            category: 'System',
            created_at: new Date().toISOString()
        },
        {
            id: '2',
            title_en: 'New Tax Regulations 2026',
            title_or: 'Qajeelfama Gibiraa Haarawa 2026',
            content_en: 'Updated guidelines for property tax assessment and collection are now in effect. Please visit the nearest office for details.',
            content_or: 'Qajeelfamni kaffaltii gibiraa haaromfame hojiirra ooleera. Odeeffannoo dabalataatiif waajjira dhiyoo jiru daawwadhaa.',
            category: 'Policy',
            created_at: new Date(Date.now() - 86400000).toISOString()
        }
    ];

    useEffect(() => {
        const fetchNews = async () => {
            try {
                // Safe cast to any to bypass the immediate Postgrest error until types are regenerated
                const { data, error } = await (supabase as any)
                    .from('news')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) {
                    console.warn('Real-time news fetch failed, falling back to mock data:', error.message);
                    setNewsItems(mockNews);
                } else {
                    setNewsItems(data && data.length > 0 ? data : mockNews);
                }
            } catch (err) {
                console.error('Error fetching news:', err);
                setNewsItems(mockNews);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

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
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return lang === 'en'
            ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : date.toLocaleDateString('or-ET', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="min-h-screen pb-20 relative bg-brand-dark overflow-hidden">
            <CosmicBackground />

            {/* Hero Section */}
            <div className="pt-32 pb-20 mb-12 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/20 border border-brand-gold/30 text-brand-gold text-sm font-bold mb-6"
                    >
                        <Bell size={18} />
                        ANNOUNCEMENTS
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-brand-light/50"
                    >
                        {lang === 'en' ? 'News & Gallery' : 'Oduu fi Galarii'}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-brand-light/60 max-w-2xl mx-auto font-light leading-relaxed"
                    >
                        {lang === 'en'
                            ? 'Stay informed with the latest developments, announcements, and municipal events.'
                            : 'Waa\'ee misoomaa, beeksisaafi taateewwan magaalaa dhihoo jiran hordofaa.'}
                    </motion.p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* News Section */}
                <div className="mb-20">
                    <div className="flex items-center justify-between mb-12 border-b border-white/10 pb-6">
                        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Info className="text-brand-green" />
                            {lang === 'en' ? 'Latest Updates' : 'Beeksisa Haarawa'}
                        </h2>
                    </div>

                    {loading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-64 bg-white/5 rounded-3xl animate-pulse border border-white/10"></div>
                            ))}
                        </div>
                    )}

                    {!loading && newsItems.length === 0 && (
                        <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/20 text-brand-light/40 italic">
                            {lang === 'en' ? 'No news updates available.' : 'Oduun argamu hin jiru.'}
                        </div>
                    )}

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {newsItems.map((item) => (
                            <motion.div key={item.id} variants={itemVariants}>
                                <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 h-full flex flex-col hover:bg-white/10 transition-all border-t-2 border-t-brand-green/20">
                                    <div className="flex justify-between items-center mb-6">
                                        <Badge className="bg-brand-green/20 text-brand-green border-brand-green/30">
                                            {item.category}
                                        </Badge>
                                        <div className="flex items-center gap-1 text-xs text-brand-light/40 font-mono">
                                            <Calendar className="w-3 h-3" />
                                            {formatDate(item.created_at)}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold mb-4 text-white line-clamp-2 group-hover:text-brand-gold transition-colors">
                                        {lang === 'en' ? item.title_en : item.title_or}
                                    </h3>
                                    <p className="text-brand-light/60 mb-8 flex-grow line-clamp-3 leading-relaxed text-sm">
                                        {lang === 'en' ? item.content_en : item.content_or}
                                    </p>

                                    <button className="flex items-center gap-2 text-brand-gold font-bold text-sm uppercase tracking-wider hover:gap-3 transition-all pt-4 border-t border-white/5 group-hover:text-white">
                                        {lang === 'en' ? 'Read Full Report' : 'Gabaasa Guutuu Dubbisi'}
                                        <ArrowRight size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Gallery Section */}
                <div className="mb-20">
                    <div className="flex items-center justify-between mb-12 border-b border-white/10 pb-6">
                        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Image className="text-brand-gold" />
                            {lang === 'en' ? 'Photo Gallery' : 'Galarii Suuraa'}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title_en: "Digital Center", title_or: "Wiirtuu Dijitaalaa", color: "from-blue-500/20 to-indigo-500/20" },
                            { title_en: "Woreda Office", title_or: "Waajjira Woredaa", color: "from-emerald-500/20 to-teal-500/20" },
                            { title_en: "Kebele Girdho", title_or: "Ganda Girdhoo", color: "from-amber-500/20 to-orange-500/20" },
                            { title_en: "Sub-City Maya", title_or: "Magaalaa Maya", color: "from-rose-500/20 to-pink-500/20" },
                            { title_en: "Mapping Project", title_or: "Pirojeektii Kaartaa", color: "from-cyan-500/20 to-blue-500/20" },
                            { title_en: "Public Forum", title_or: "Marii Hawaasaa", color: "from-violet-500/20 to-fuchsia-500/20" }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ y: -5 }}
                                className="group relative aspect-video rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm cursor-pointer"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                                    <Image className="w-16 h-16 text-white/10 group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                    <h4 className="text-white font-bold text-lg mb-1">{lang === 'en' ? item.title_en : item.title_or}</h4>
                                    <div className="w-12 h-1 bg-brand-gold transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default News;
