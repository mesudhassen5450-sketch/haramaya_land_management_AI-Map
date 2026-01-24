import React, { useEffect, useRef, useState } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

interface NumberTickerProps {
    value: number;
    suffix?: string;
    className?: string;
}

export const NumberTicker: React.FC<NumberTickerProps> = ({
    value,
    suffix = "",
    className = ""
}) => {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, {
        damping: 30,
        stiffness: 100,
    });

    const [displayValue, setDisplayValue] = useState("0");

    useEffect(() => {
        if (isInView) {
            motionValue.set(value);
        }
    }, [isInView, value, motionValue]);

    useEffect(() => {
        springValue.on("change", (latest) => {
            setDisplayValue(Math.floor(latest).toLocaleString());
        });
    }, [springValue]);

    return (
        <span ref={ref} className={className}>
            {displayValue}
            {suffix}
        </span>
    );
};
