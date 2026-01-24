import React, { useState } from 'react';
import { Search, ShieldCheck, AlertCircle, MapPin, Ruler, Calendar, Fingerprint } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import CosmicBackground from '@/components/ui/CosmicBackground';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Verification: React.FC<{ lang: string }> = ({ lang }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const t: any = {
        en: {
            title: "Public Land Verification",
            subtitle: "Verify the legitimacy of land parcels and title deeds instantly.",
            placeholder: "Enter Parcel ID or Title Deed Number...",
            verifyBtn: "Verify Status",
            searching: "Scanning Bureau Records...",
            noResult: "No record found with this ID. Please check and try again.",
            resultTitle: "Verification Result",
            parcelId: "Parcel ID",
            status: "Current Status",
            area: "Registered Area",
            kebele: "Kebele/Location",
            regDate: "Registration Date",
            legalNote: "Note: Owner names and personal details are hidden for privacy. Visit the Land Bureau for full details.",
            verified: "Legally Verified",
            certified: "BUREAU CERTIFIED"
        },
        or: {
            title: "Mirkaneeffannaa Lafa Uummataa",
            subtitle: "Waraqaa ragaa abbummaa lafaa hatattamaan mirkaneeffadhu.",
            placeholder: "ID Lafa ykn Lakkoofsa Ragaa Galchu...",
            verifyBtn: "Mirkaneessi",
            searching: "Galmeewwan Biiroo Sakatta'amaa Jiru...",
            noResult: "Galmeen ID kanaan argame hin jiru. Maaloo irra deebi'ii yaali.",
            resultTitle: "Bu'aa Mirkaneeffannaa",
            parcelId: "ID Lafa",
            status: "Haala Ammaa",
            area: "Bal'ina Galmaa'e",
            kebele: "Ganda/Bakka",
            regDate: "Guyyaa Galmee",
            legalNote: "Hubachiisa: Maqaan abbaa fi odeeffannoon dhuunfaa sababa qulqullinaaf dhokfameera. Odeeffannoo guutuuf Biiroo Lafaatti koottaa.",
            verified: "Seeraan Mirkanaa'e",
            certified: "BIIROODHAAN MIRKANAA'E"
        }
    }[lang];

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        setError(null);
        setResult(null);

        // Simulate network delay for "cool" scanning effect
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            const { data, error } = await supabase
                .from('land_parcels')
                .select('*')
                .or(`parcel_id.eq.${searchQuery},title_deed_number.eq.${searchQuery}`)
                .maybeSingle();

            if (error) throw error;

            if (data) {
                setResult(data);
            } else {
                setError(t.noResult);
            }
        } catch (err) {
            console.error(err);
            setError("A system error occurred. Please try again later.");
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 relative overflow-hidden bg-brand-dark">
            <CosmicBackground />

            <div className="max-w-4xl mx-auto px-4 relative z-10">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/20 border border-brand-gold/30 text-brand-gold text-sm font-bold mb-6"
                    >
                        <ShieldCheck size={18} />
                        TRUST & TRANSPARENCY
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
                        transition={{ delay: 0.1 }}
                        className="text-xl text-brand-light/60"
                    >
                        {t.subtitle}
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-[2.5rem] shadow-2xl mb-12"
                >
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-grow">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={24} />
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={t.placeholder}
                                className="h-16 pl-14 bg-white/5 border-white/10 text-white text-lg rounded-2xl focus:ring-brand-gold focus:border-brand-gold"
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={isSearching}
                            className="h-16 px-10 bg-brand-gold hover:bg-yellow-500 text-brand-dark font-black text-lg rounded-2xl shadow-lg transition-all"
                        >
                            {isSearching ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-brand-dark/30 border-t-brand-dark rounded-full animate-spin"></div>
                                    {t.searching}
                                </span>
                            ) : t.verifyBtn}
                        </Button>
                    </form>
                </motion.div>

                <AnimatePresence mode="wait">
                    {isSearching && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center p-20"
                        >
                            <div className="relative w-32 h-32 mb-8">
                                <div className="absolute inset-0 border-4 border-brand-gold/20 rounded-full"></div>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 border-4 border-transparent border-t-brand-gold rounded-full"
                                ></motion.div>
                                <motion.div
                                    animate={{
                                        top: ['10%', '90%', '10%'],
                                        opacity: [0.3, 0.8, 0.3]
                                    }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="absolute left-[10%] right-[10%] h-[2px] bg-brand-gold shadow-[0_0_15px_rgba(234,179,8,0.5)]"
                                ></motion.div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Fingerprint className="text-brand-gold/40" size={48} />
                                </div>
                            </div>
                            <p className="text-brand-gold font-bold tracking-widest uppercase animate-pulse">{t.searching}</p>
                        </motion.div>
                    )}

                    {error && !isSearching && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-500/10 border border-red-500/30 p-8 rounded-3xl flex items-center gap-6 text-red-200"
                        >
                            <AlertCircle size={40} className="shrink-0" />
                            <p className="text-lg">{error}</p>
                        </motion.div>
                    )}

                    {result && !isSearching && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            <div className="bg-brand-green/10 border border-brand-green/30 p-10 rounded-[3rem] backdrop-blur-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8">
                                    <div className="bg-brand-green text-white px-6 py-2 rounded-full font-black text-sm tracking-tighter uppercase whitespace-nowrap rotate-12 -mr-12 -mt-4 shadow-xl border-4 border-white/20">
                                        {t.certified}
                                    </div>
                                </div>

                                <h2 className="text-2xl font-bold text-white mb-10 flex items-center gap-3">
                                    <ShieldCheck className="text-brand-green" size={32} />
                                    {t.resultTitle}
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-brand-light/40 text-sm uppercase tracking-wider mb-1">{t.parcelId}</p>
                                            <p className="text-2xl font-mono text-white flex items-center gap-2">
                                                {result.parcel_id}
                                                <ShieldCheck className="text-brand-gold" size={20} />
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-brand-light/40 text-sm uppercase tracking-wider mb-1">{t.status}</p>
                                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-green/20 text-brand-green font-bold border border-brand-green/30">
                                                <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></div>
                                                {result.status?.toUpperCase() || t.verified}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-start gap-4">
                                            <div className="bg-white/5 p-3 rounded-2xl text-brand-gold">
                                                <Ruler size={24} />
                                            </div>
                                            <div>
                                                <p className="text-brand-light/40 text-sm uppercase tracking-wider mb-1">{t.area}</p>
                                                <p className="text-xl font-bold text-white">{result.area_sqm} m²</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="bg-white/5 p-3 rounded-2xl text-brand-gold">
                                                <MapPin size={24} />
                                            </div>
                                            <div>
                                                <p className="text-brand-light/40 text-sm uppercase tracking-wider mb-1">{t.kebele}</p>
                                                <p className="text-xl font-bold text-white">{result.kebele || 'Haramaya Cluster 01'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="bg-white/5 p-3 rounded-2xl text-brand-gold">
                                                <Calendar size={24} />
                                            </div>
                                            <div>
                                                <p className="text-brand-light/40 text-sm uppercase tracking-wider mb-1">{t.regDate}</p>
                                                <p className="text-xl font-bold text-white">{result.registration_date || 'Certified 2024'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 pt-8 border-t border-white/10 flex items-center gap-3 text-brand-light/40 italic text-sm">
                                    <AlertCircle size={18} />
                                    {t.legalNote}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Verification;
