import React from 'react';
import { HelpCircle, ChevronDown, BookOpen, MessageSquare, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import CosmicBackground from '@/components/ui/CosmicBackground';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const FAQ = ({ lang }: { lang: string }) => {
    const t: any = {
        en: {
            title: "Knowledge Base & FAQ",
            subtitle: "Find quick answers to common questions about land management in Haramaya.",
            categories: {
                registration: "Land Registration",
                tax: "Property Tax & Payments",
                disputes: "Disputes & Legal",
                general: "General System Use"
            },
            questions: [
                {
                    cat: "registration",
                    q: "What documents do I need for initial land registration?",
                    a: "You need a local administration (Kebele) letter of possession, a valid national ID, and four passport-sized photographs. If the land was purchased, the original sales contract is also required."
                },
                {
                    cat: "registration",
                    q: "How long does it take to get a digital Title Deed?",
                    a: "Once all documents are verified and the parcel survey is completed, it typically takes 5-10 working days to issue a digital Title Deed."
                },
                {
                    cat: "tax",
                    q: "How is my property tax calculated?",
                    a: "Property tax is based on land use (residential vs commercial), total area in square meters, and a location-based factor determined by the municipal zoning department."
                },
                {
                    cat: "tax",
                    q: "Can I pay my land tax through mobile money?",
                    a: "Yes! Once you log into the Citizen Portal, you can pay via Telebirr, CBE Birr, or direct bank transfer."
                },
                {
                    cat: "disputes",
                    q: "I have a boundary dispute with my neighbor. What should I do?",
                    a: "You can file a formal dispute through the 'Dispute' section of our portal or visit the Land Bureau. Our surveyors will be sent to verify boundaries using satellite precision."
                },
                {
                    cat: "general",
                    q: "Is my personal data safe on this portal?",
                    a: "Absolutely. We use industry-standard encryption and follow the national digital privacy guidelines. Personal owner data is never shared publicly."
                }
            ]
        },
        or: {
            title: "Bakka Beekumsaa & FAQ",
            subtitle: "Bulchiinsa lafaa Haramayaa irratti gaaffiiwwan baramoof deebii hatattamaa argadhu.",
            categories: {
                registration: "Galmee Lafaa",
                tax: "Gibira Lafaafi Kaffaltii",
                disputes: "Falmiilee fi Seera",
                general: "Fayyadama Sirnaa"
            },
            questions: [
                {
                    cat: "registration",
                    q: "Galmee lafaatiif sanadoonni barbaachisan maalfa'i?",
                    a: "Waraqaa ragaa qabiyyee Gandaa, waraqaa eenyummaa bioolessaa, fi suuraa afur barbaachisaa dha. Lafa bitame yoo ta'e, waliigalteen gurgurtaa orjinaalli ni barbaachisa."
                },
                {
                    cat: "registration",
                    q: "Waraqaa ragaa (Title Deed) dijitaalaa argachuuf yeroo hammam gubba?",
                    a: "Sanadoonni hundi mirkanaa'anii fi sakatta'iinsi lafaa erga xumuramee booda, guyyoota hojii 5-10 gidduutti ni kennama."
                },
                {
                    cat: "tax",
                    q: "Gibirri lafa kootii akkamitti shallagama?",
                    a: "Gibirri lafaa tajaajila lafichaa (mana jireenyaa ykn daldala), bal'ina isaa meetira kaaree, fi iddoo lafichi itti argamu irratti hundaa'ee shallagama."
                },
                {
                    cat: "tax",
                    q: "Kaffaltii gibira lafaa mobaayilaan kaffaluun ni danda'amaa?",
                    a: "Eeyyee! Erga 'Citizen Portal' keessaan seentanii booda, Telebirr, CBE Birr ykn baankii kallattiidhaan kaffaluu dandeessu."
                },
                {
                    cat: "disputes",
                    q: "Olola daangaa ollaa koo waliin qaba. Maal gochuun qaba?",
                    a: "Waliigaltee dhabuun daangaa yoo jiraate, karaa poortaalii keenyaa kutaa 'Dispute' jedhuun ykn Biiroo Lafaatti koottaanii gabaasuu dandeessu."
                },
                {
                    cat: "general",
                    q: "Odeeffannoon dhuunfaa koo poortaalii kana irratti eegumsa qabaa?",
                    a: "Eeyyee. Nuti eegumsa dijitaalaa ammayyaafi qajeelfama dhuunfaa biyyaalessaa hordofna. Odeeffannoon dhuunfaa keessanii uummataaf hin ifomu."
                }
            ]
        }
    }[lang];

    return (
        <div className="min-h-screen pt-32 pb-20 relative overflow-hidden bg-brand-dark">
            <CosmicBackground />

            <div className="max-w-4xl mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-green/20 border border-brand-green/30 text-brand-green text-sm font-bold mb-6"
                    >
                        <HelpCircle size={18} />
                        HELP CENTER
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

                <div className="space-y-12">
                    {Object.entries(t.categories).map(([key, categoryTitle]: [string, any]) => (
                        <motion.div
                            key={key}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 overflow-hidden"
                        >
                            <div className="p-8 border-b border-white/10 bg-white/5 flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-brand-gold/20 text-brand-gold">
                                    {key === 'registration' && <BookOpen size={24} />}
                                    {key === 'tax' && <MessageSquare size={24} />}
                                    {key === 'disputes' && <Info size={24} />}
                                    {key === 'general' && <HelpCircle size={24} />}
                                </div>
                                <h2 className="text-2xl font-bold text-white">{categoryTitle}</h2>
                            </div>
                            <div className="p-6">
                                <Accordion type="single" collapsible className="w-full">
                                    {t.questions.filter((q: any) => q.cat === key).map((q: any, i: number) => (
                                        <AccordionItem key={i} value={`item-${i}`} className="border-white/10 px-4">
                                            <AccordionTrigger className="text-white hover:text-brand-gold text-left text-lg py-6 transition-all hover:no-underline">
                                                {q.q}
                                            </AccordionTrigger>
                                            <AccordionContent className="text-brand-light/70 text-base leading-relaxed pb-6">
                                                {q.a}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-20 p-10 rounded-[3rem] bg-gradient-to-r from-brand-gold/10 to-brand-green/10 border border-white/10 text-center"
                >
                    <h3 className="text-2xl font-bold text-white mb-4">Still have questions?</h3>
                    <p className="text-brand-light/60 mb-8 max-w-xl mx-auto italic">
                        "If you can't find the answer you're looking for, our support team is available during office hours (8:00 AM - 5:00 PM)."
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button className="px-8 py-3 rounded-xl bg-brand-gold text-brand-dark font-black hover:bg-yellow-500 transition-all">
                            CONTACT SUPPORT
                        </button>
                        <button className="px-8 py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all border border-white/10">
                            DOWNLOAD GUIDE (PDF)
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default FAQ;
