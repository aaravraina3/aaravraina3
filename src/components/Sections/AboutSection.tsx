import React from 'react';
import { motion } from 'framer-motion';
import { profileData } from '../../data/profileData';
import { SkewedPanel } from '../UI/SkewedPanel';
import { User, Zap, Cpu, Palette, Mail, Github, FileText, Linkedin } from 'lucide-react';

export const AboutSection: React.FC = () => {
    const { about } = profileData;
    const [hoveredAction, setHoveredAction] = React.useState<null | 'email' | 'github' | 'linkedin' | 'resume'>(null);
    const [copiedToast, setCopiedToast] = React.useState<null | string>(null);

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            return;
        } catch {
            // Fallback for older browsers / permission issues
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.top = '0';
            textarea.style.left = '0';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            try {
                document.execCommand('copy');
            } finally {
                document.body.removeChild(textarea);
            }
        }
    };

    const getIconForStat = (label: string) => {
        if (label.includes('SYSTEMS')) return <Cpu size={16} />;
        if (label.includes('AI')) return <Zap size={16} />;
        if (label.includes('DESIGN')) return <Palette size={16} />;
        return <User size={16} />;
    };

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-4xl font-display font-bold mb-4 border-b-4 border-white inline-block pr-12 ml-0 md:ml-12 transform-none md:transform md:-skew-x-12">
                    Aarav Raina
                </h2>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Bio Column */}
                <div className="lg:col-span-2 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <SkewedPanel variant="white" className="p-4 px-6 transform-none md:transform rounded-lg md:rounded-none" innerClassName="transform-none md:transform">
                            <h3 className="text-xl font-bold mb-2 uppercase italic ml-0 md:ml-4 border-b border-black/20 pb-1">Profile</h3>
                            <p className="text-xs font-bold italic uppercase leading-relaxed">
                                {about.bio}
                            </p>
                            {(about.email || about.github) && (
                                <div className="mt-2 pt-2 border-t-2 border-black/20 space-y-1">
                                    <div className="relative inline-flex flex-wrap gap-2">
                                        {about.email && (
                                            <button
                                                type="button"
                                                aria-label="Copy email"
                                                onClick={async () => {
                                                    await copyToClipboard(about.email!);
                                                    setCopiedToast('Copied to clipboard.');
                                                    setHoveredAction('email');
                                                    window.setTimeout(() => setCopiedToast(null), 1500);
                                                }}
                                                onMouseEnter={() => setHoveredAction('email')}
                                                onMouseLeave={() => setHoveredAction(null)}
                                                className="inline-flex items-center justify-center p-2 text-xs font-mono border border-black/30 rounded-md hover:bg-black hover:text-white transition-colors"
                                            >
                                                <Mail size={14} />
                                            </button>
                                        )}
                                        {about.github && (
                                            <a
                                                href={about.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label="GitHub"
                                                onMouseEnter={() => setHoveredAction('github')}
                                                onMouseLeave={() => setHoveredAction(null)}
                                                className="inline-flex items-center justify-center p-2 text-xs font-mono border border-black/30 rounded-md hover:bg-black hover:text-white transition-colors"
                                            >
                                                <Github size={14} />
                                            </a>
                                        )}
                                        {about.linkedin && (
                                            <a
                                                href={about.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label="LinkedIn"
                                                onMouseEnter={() => setHoveredAction('linkedin')}
                                                onMouseLeave={() => setHoveredAction(null)}
                                                className="inline-flex items-center justify-center p-2 text-xs font-mono border border-black/30 rounded-md hover:bg-black hover:text-white transition-colors"
                                            >
                                                <Linkedin size={14} />
                                            </a>
                                        )}
                                        {about.email && (
                                            <button
                                                type="button"
                                                aria-label="Resume"
                                                onMouseEnter={() => setHoveredAction('resume')}
                                                onMouseLeave={() => setHoveredAction(null)}
                                                className="inline-flex items-center justify-center p-2 text-xs font-mono border border-black/30 rounded-md hover:bg-black hover:text-white transition-colors"
                                            >
                                                <FileText size={14} />
                                            </button>
                                        )}

                                        {(hoveredAction || copiedToast) && (
                                            <div className="pointer-events-none absolute left-full ml-4 top-1/2 -translate-y-1/2 z-50 w-72 rounded-md bg-black px-3 py-2 text-[11px] leading-snug text-white shadow-lg">
                                                {copiedToast ? (
                                                    <span>
                                                        <span className="font-bold">Copied:</span> {about.email}
                                                    </span>
                                                ) : (
                                                    <>
                                                        {hoveredAction === 'email' && (
                                                            <span>{about.email}</span>
                                                        )}
                                                        {hoveredAction === 'github' && (
                                                            <span>GitHub: {about.github}</span>
                                                        )}
                                                        {hoveredAction === 'linkedin' && (
                                                            <span>LinkedIn: {about.linkedin}</span>
                                                        )}
                                                        {hoveredAction === 'resume' && (
                                                            <span>Resume is available upon request — reach out and I’ll send it over.</span>
                                                        )}
                                                    </>
                                                )}
                                                {hoveredAction === 'github' && (
                                                    <span>GitHub: {about.github}</span>
                                                )}
                                                {hoveredAction === 'linkedin' && (
                                                    <span>LinkedIn: {about.linkedin}</span>
                                                )}
                                                {hoveredAction === 'resume' && (
                                                    <span>Resume is available upon request — reach out and I’ll send it over.</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </SkewedPanel>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <SkewedPanel variant="outline" className="px-6 py-3 transform-none md:transform rounded-lg md:rounded-none" innerClassName="transform-none md:transform">
                            <h3 className="text-lg font-bold mb-2 uppercase border-b border-white/30 pb-1">Current Focus</h3>
                            <div className="flex flex-wrap gap-2">
                                {about.focusAreas.map((area, i) => (
                                    <span key={i} className="bg-white text-black px-2 py-0.5 text-sm font-bold rounded md:rounded-none transform-none md:transform md:-skew-x-12 hover:scale-110 transition-transform cursor-default">
                                        <span className="block transform-none md:transform md:skew-x-12">{area}</span>
                                    </span>
                                ))}
                            </div>
                        </SkewedPanel>
                    </motion.div>

                    {Object.entries(about.technologies).map(([category, items], idx) => (
                        <motion.div
                            key={category}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + idx * 0.1 }}
                        >
                            <SkewedPanel variant="outline" className="px-6 py-3 transform-none md:transform rounded-lg md:rounded-none" innerClassName="transform-none md:transform">
                                <h3 className="text-lg font-bold mb-2 uppercase border-b border-white/30 pb-1">{category}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {items.map((item, i) => (
                                        <span key={i} className="bg-white text-black px-2 py-0.5 text-sm font-bold rounded md:rounded-none transform-none md:transform md:-skew-x-12 hover:scale-110 transition-transform cursor-default">
                                            <span className="block transform-none md:transform md:skew-x-12">{item}</span>
                                        </span>
                                    ))}
                                </div>
                            </SkewedPanel>
                        </motion.div>
                    ))}
                </div>

                {/* Stats Column */}
                <div className="lg:col-span-1 transform-none md:transform md:scale-90 md:scale-x-90 md:origin-top-right md:translate-x-[2%]">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <SkewedPanel variant="black" className="h-full px-5 py-4 transform-none md:transform rounded-lg md:rounded-none" innerClassName="transform-none md:transform">
                            <h3 className="text-lg font-bold mb-4 uppercase text-center border-b-2 border-white pb-1">
                                Stats
                            </h3>
                            <div className="space-y-4">
                                {about.stats.map((stat, index) => (
                                    <div key={stat.label}>
                                        <div className="flex justify-between items-center mb-1">
                                            <div className="flex items-center gap-2 font-bold text-xs">
                                                {getIconForStat(stat.label)}
                                                {stat.label}
                                            </div>
                                            <span className="font-mono text-[10px]">{stat.value}/100</span>
                                        </div>
                                        <div className="h-2 bg-gray-800 rounded md:rounded-none transform-none md:transform md:-skew-x-12 overflow-hidden border border-white/30">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${stat.value}%` }}
                                                transition={{ duration: 1, delay: 0.5 + index * 0.1, ease: "easeOut" }}
                                                className="h-full bg-white"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Decorative "Limit Break" style element */}
                            <div className="mt-6 pt-2 border-t border-dashed border-white/50 text-center">
                                <span className="text-[10px] font-mono animate-pulse">Status: Max</span>
                            </div>
                        </SkewedPanel>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
