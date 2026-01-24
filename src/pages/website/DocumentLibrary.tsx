import React from 'react';
import { FileText, Download, Scale, ClipboardList, Book, Search, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import CosmicBackground from '@/components/ui/CosmicBackground';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const DocumentLibrary = ({ lang }: { lang: string }) => {
    const t: any = {
        en: {
            title: "Policy & Document Library",
            subtitle: "Access official land proclamations, application forms, and municipal guidelines.",
            searchPlaceholder: "Search documents...",
            categories: {
                proclamations: "Federal & Regional Proclamations",
                forms: "Application Forms",
                guidelines: "Municipal Guidelines"
            },
            docs: [
                {
                    cat: "proclamations",
                    title: "Land Holding Proclamation 2023",
                    desc: "Revised federal guidelines for urban land administration and holding rights.",
                    size: "2.4 MB",
                    format: "PDF"
                },
                {
                    cat: "proclamations",
                    className: "Oromia Rural Land Use Regulation",
                    title: "Regional Regulation No. 562",
                    desc: "Specific bylaws concerning the management of rural agricultural land in Haramaya.",
                    size: "1.8 MB",
                    format: "PDF"
                },
                {
                    cat: "forms",
                    title: "Land Title Registration Form",
                    desc: "Official application form for initial registration of land holdings.",
                    size: "450 KB",
                    format: "PDF"
                },
                {
                    cat: "forms",
                    title: "Property Valuation Request",
                    desc: "Form to request a re-assessment of property market value.",
                    size: "320 KB",
                    format: "PDF"
                },
                {
                    cat: "guidelines",
                    title: "Haramaya Urban Design Guide",
                    desc: "Building standards and architectural guidelines for Kebele 01-03.",
                    size: "5.2 MB",
                    format: "PDF"
                }
            ],
            downloadBtn: "Download",
            viewBtn: "View Online"
        },
        or: {
            title: "Mana Galmee Imaammataa",
            subtitle: "Labsiiwwan lafaa, foormiiwwan iyyannoo fi qajeelfamoota biiroo argadhu.",
            searchPlaceholder: "Sanadoota barbaaduu...",
            categories: {
                proclamations: "Labsiiwwan Federaalaa fi Naannoo",
                forms: "Foormiiwwan Iyyannoo",
                guidelines: "Qajeelfamoota Magaalaa"
            },
            docs: [
                {
                    cat: "proclamations",
                    title: "Labsii Qabiyyee Lafaa 2023",
                    desc: "Qajeelfama bulchiinsa lafa magaalaa fi mirga qabiyyee haaromfame.",
                    size: "2.4 MB",
                    format: "PDF"
                },
                {
                    cat: "proclamations",
                    title: "Dambii Fayyadama Lafa Baadiyaa Oromiyaa",
                    desc: "Dambii bulchiinsa lafa qonnaa baadiyaa Haramayaa irratti xiyyeeffatu.",
                    size: "1.8 MB",
                    format: "PDF"
                },
                {
                    cat: "forms",
                    title: "Foormii Galmee Abbummaa Lafaa",
                    desc: "Foormii iyyannoo ragaa abbummaa lafaa jalqaba galmeessuuf tajaajilu.",
                    size: "450 KB",
                    format: "PDF"
                },
                {
                    cat: "forms",
                    title: "Gaaffii Shallaggii Gatii Qabeenyaa",
                    desc: "Foormii gatii gabaa manaa ykn lafaa irra deebi'anii shallaguuf gaafatamu.",
                    size: "320 KB",
                    format: "PDF"
                },
                {
                    cat: "guidelines",
                    title: "Qajeelfama Diizaayinii Magaalaa Haramayaa",
                    desc: "Ulaagaalee ijaararsaa fi qajeelfamoota arkiteekcharii Ganda 01-03.",
                    size: "5.2 MB",
                    format: "PDF"
                }
            ],
            downloadBtn: "Buufadhu",
            viewBtn: "Ilaanali"
        }
    }[lang];

    return (
        <div className="min-h-screen pt-32 pb-20 relative overflow-hidden bg-brand-dark">
            <CosmicBackground />

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/20 border border-brand-gold/30 text-brand-gold text-sm font-bold mb-6"
                        >
                            <Book size={18} />
                            RESOURCE CENTER
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
                            className="text-xl text-brand-light/60"
                        >
                            {t.subtitle}
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-full md:w-96 relative"
                    >
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                        <Input
                            placeholder={t.searchPlaceholder}
                            className="h-14 pl-12 bg-white/5 border-white/10 text-white rounded-xl focus:ring-brand-gold"
                        />
                    </motion.div>
                </div>

                <div className="space-y-20">
                    {Object.entries(t.categories).map(([key, categoryTitle]: [string, any]) => (
                        <div key={key}>
                            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                                <div className="w-2 h-8 bg-brand-gold rounded-full"></div>
                                {categoryTitle}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {t.docs.filter((d: any) => d.cat === key).map((doc: any, i: number) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:border-white/20 hover:bg-white/10 transition-all p-8 rounded-3xl h-full flex flex-col group">
                                            <div className="mb-6 flex justify-between items-start">
                                                <div className="p-4 rounded-2xl bg-brand-gold/20 text-brand-gold group-hover:scale-110 transition-transform">
                                                    {key === 'proclamations' && <Scale size={32} />}
                                                    {key === 'forms' && <ClipboardList size={32} />}
                                                    {key === 'guidelines' && <FileText size={32} />}
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xs font-black bg-brand-dark/50 text-brand-light/40 px-3 py-1 rounded-full border border-white/5 uppercase">
                                                        {doc.format}
                                                    </span>
                                                    <p className="text-[10px] text-brand-light/30 mt-1 uppercase tracking-tighter">{doc.size}</p>
                                                </div>
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-4 leading-tight group-hover:text-brand-gold transition-colors">
                                                {doc.title}
                                            </h3>
                                            <p className="text-brand-light/60 text-sm leading-relaxed mb-8 flex-grow">
                                                {doc.desc}
                                            </p>
                                            <div className="flex gap-4">
                                                <Button className="flex-grow bg-brand-gold hover:bg-yellow-500 text-brand-dark font-bold rounded-xl gap-2">
                                                    <Download size={18} />
                                                    {t.downloadBtn}
                                                </Button>
                                                <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10 font-bold rounded-xl">
                                                    {t.viewBtn}
                                                </Button>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-32 p-12 rounded-[4rem] bg-brand-dark/40 backdrop-blur-2xl border border-white/10 overflow-hidden relative"
                >
                    <div className="absolute right-0 top-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="text-center md:text-left">
                            <h2 className="text-3xl font-bold text-white mb-4 italic">"Transparency is the Foundation of Progress"</h2>
                            <p className="text-brand-light/50 max-w-xl">
                                All documents provided here are the latest official versions approved by the Haramaya Land Bureau and Regional Oromia Land Administration.
                            </p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 bg-brand-green/20 rounded-full flex items-center justify-center text-brand-green mb-4">
                                <ShieldCheck size={48} />
                            </div>
                            <p className="text-xs text-brand-green font-bold tracking-widest uppercase">Certified & Verified</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default DocumentLibrary;
