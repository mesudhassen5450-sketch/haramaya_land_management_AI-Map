import React, { useEffect, useRef } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/website/ui/Card';
import { SectionHeader } from '@/components/website/ui/SectionHeader';
import * as maptilersdk from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';

const ContactInfo = ({ lang }: any) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maptilersdk.Map | null>(null);
    const haramaya = { lng: 42.0211, lat: 9.4128 };
    const zoom = 14;

    const t: any = {
        title: lang === 'en' ? "Contact Information" : "Odeeffannoo Qunnamtii",
        subtitle: lang === 'en' ? "Get in touch with us through various channels." : "karaalee adda addaatiin nu qunnamaa.",
        address: lang === 'en' ? "Address" : "Teessoo",
        phone: lang === 'en' ? "Phone" : "Bilbila",
        email: lang === 'en' ? "Email" : "Imeelii",
        hours: lang === 'en' ? "Working Hours" : "Sa'aatii Hojii"
    };

    useEffect(() => {
        if (!mapContainer.current || map.current) return;

        maptilersdk.config.apiKey = import.meta.env.VITE_MAPTILER_API_KEY;

        map.current = new maptilersdk.Map({
            container: mapContainer.current,
            style: maptilersdk.MapStyle.STREETS,
            center: [haramaya.lng, haramaya.lat],
            zoom: zoom,
        });

        new maptilersdk.Marker({ color: "#D4AF37" })
            .setLngLat([haramaya.lng, haramaya.lat])
            .setPopup(new maptilersdk.Popup({ offset: 25 })
                .setHTML(`
                    <div style="color: #1A1A1A; padding: 10px;">
                        <h3 style="margin: 0 0 5px 0; font-weight: bold;">Haramaya Land Bureau</h3>
                        <p style="margin: 0; font-size: 12px;">Main Administration Office</p>
                    </div>
                `))
            .addTo(map.current);

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, [haramaya.lng, haramaya.lat, zoom]);

    return (
        <div className="bg-brand-light min-h-screen pb-20">
            {/* Hero Section */}
            <div className="bg-brand-green text-white py-16 mb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold mb-4"
                    >
                        {t.title}
                    </motion.h1>
                    <p className="text-xl text-green-100">{t.subtitle}</p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Location Card */}
                    <Card className="flex items-start gap-4 p-8 hover:border-brand-green/30">
                        <div className="bg-green-100 p-3 rounded-full text-brand-green">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2 text-gray-900">{t.address}</h3>
                            <p className="text-gray-600">
                                Haramaya Woreda Land Administration Office<br />
                                Haramaya Town, Eastern Hararghe<br />
                                Oromia, Ethiopia
                            </p>
                        </div>
                    </Card>

                    {/* Phone Card */}
                    <Card className="flex items-start gap-4 p-8 hover:border-brand-green/30">
                        <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                            <Phone size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2 text-gray-900">{t.phone}</h3>
                            <p className="text-gray-600 text-lg font-medium">0900 201 691</p>
                            <p className="text-gray-600 text-lg font-medium">0915 707 761</p>
                        </div>
                    </Card>

                    {/* Email Card */}
                    <Card className="flex items-start gap-4 p-8 hover:border-brand-green/30">
                        <div className="bg-yellow-100 p-3 rounded-full text-yellow-700">
                            <Mail size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2 text-gray-900">{t.email}</h3>
                            <p className="text-gray-600">haramayaifo@gmail.com</p>
                            <p className="text-gray-500 text-sm mt-1">Send us your queries anytime.</p>
                        </div>
                    </Card>

                    {/* Hours Card */}
                    <Card className="flex items-start gap-4 p-8 hover:border-brand-green/30">
                        <div className="bg-purple-100 p-3 rounded-full text-purple-600">
                            <Clock size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2 text-gray-900">{t.hours}</h3>
                            <div className="space-y-1 text-gray-600">
                                <p><span className="font-semibold">Mon - Thu:</span> 8:30 AM - 5:30 PM</p>
                                <p><span className="font-semibold">Fri:</span> 8:30 AM - 11:30 AM / 1:30 PM - 5:30 PM</p>
                                <p className="text-red-500 text-sm mt-2">Closed on Weekends & Public Holidays</p>
                            </div>
                        </div>
                    </Card>

                </div>

                {/* Interactive Map */}
                <div className="mt-12 rounded-xl overflow-hidden shadow-lg border border-gray-200 relative">
                    <div ref={mapContainer} className="h-96 w-full" />
                    <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-[10px] text-gray-500 z-10 text-right">
                        interactive map by Fysel, Ziyad, Mesud <br /> TECH GROUP
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactInfo;
