import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SkewedPanel } from '../UI/SkewedPanel';
import { ExternalLink, ArrowLeft } from 'lucide-react';
import { SpeculativeDecodingPost } from './posts/SpeculativeDecodingPost';

interface BlogPost {
    id: string;
    title: string;
    date: string;
    description: string;
    link?: string;
    readTime?: string;
    content?: React.ReactNode;
    visualElement?: React.ReactNode;
}

const blogPosts: BlogPost[] = [
    {
        id: 'speculative-decoding-robot-policy',
        title: 'I ported speculative decoding to a robot policy',
        date: 'May 15, 2026',
        readTime: '6 min read',
        description:
            'A 263M parameter diffusion policy misses its 10 Hz control deadline by 14x on a laptop CPU. Instead of turning the usual knob, I stole the draft-verifier trick from LLM serving. Won 1st place at the PyData x Cursor hackathon.',
        content: <SpeculativeDecodingPost />,
        visualElement: (
            <div className="bg-black/40 border border-white/20 p-3 rounded font-mono text-xs text-green-400 w-full">
                <div className="mb-2">SPECULATIVE SERVE:</div>
                <div className="space-y-1">
                    <div>draft: 4,482 params</div>
                    <div>verifier: 263M params</div>
                    <div>speedup: 2.02x</div>
                    <div>10 Hz deadline: hit</div>
                </div>
            </div>
        ),
    },
    {
        id: 'coming-soon',
        title: 'Coming soon!',
        date: 'Jan 1, 2025',
        description: 'Look to more writing pieces about my work coming soon',
        visualElement: (
            <div className="bg-black/40 border border-white/20 p-3 rounded font-mono text-xs text-green-400">
                <div className="mb-2">STATUS:</div>
                <div className="space-y-1">
                    <div>[✓] Writing in progress</div>
                    <div>[✓] Technical deep-dives</div>
                    <div>[ ] Project retrospectives</div>
                </div>
            </div>
        ),
    },
];

export const WorksSection: React.FC = () => {
    const [openPost, setOpenPost] = useState<BlogPost | null>(null);

    // The scrollable panel lives in MainLayout; jump to the top when
    // entering or leaving an article so it doesn't open mid-scroll.
    useEffect(() => {
        document.querySelector('.custom-scrollbar')?.scrollTo({ top: 0 });
    }, [openPost]);

    if (openPost) {
        return (
            <div className="space-y-6">
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <motion.div
                        onClick={() => setOpenPost(null)}
                        whileTap={{ scale: 0.95 }}
                        className="inline-block cursor-pointer mb-6"
                    >
                        <SkewedPanel skew="left" variant="white" className="border-l-8 border-l-black py-1">
                            <div className="flex items-center gap-2 font-bold font-display text-black text-lg">
                                <ArrowLeft size={20} />
                                WORKS
                            </div>
                        </SkewedPanel>
                    </motion.div>

                    <h2 className="text-3xl md:text-4xl font-display font-bold mb-3 break-words">
                        {openPost.title}
                    </h2>
                    <p className="text-sm text-white/70 font-mono">
                        {openPost.date}
                        {openPost.readTime ? ` · ${openPost.readTime}` : ''}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                >
                    {openPost.content}
                </motion.div>
            </div>
        );
    }

    // Group posts by year
    const postsByYear = blogPosts.reduce((acc, post) => {
        const year = new Date(post.date).getFullYear().toString();
        if (!acc[year]) {
            acc[year] = [];
        }
        acc[year].push(post);
        return acc;
    }, {} as Record<string, BlogPost[]>);

    const sortedYears = Object.keys(postsByYear).sort((a, b) => parseInt(b) - parseInt(a));

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="mb-4 ml-0 md:ml-12">
                    <h2 className="text-4xl font-display font-bold mb-2 border-b-4 border-white inline-block pr-12 transform-none md:transform md:-skew-x-12">
                        WORKS
                    </h2>
                    <p className="text-sm mt-2 opacity-80">
                        Writing about the things I build.
                    </p>
                </div>
            </motion.div>

            <div className="space-y-12">
                {sortedYears.map((year) => (
                    <motion.div
                        key={year}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h3 className="text-5xl font-display font-bold mb-6 ml-0 md:ml-12">{year}</h3>
                        <div className="space-y-6">
                            {postsByYear[year].map((post, index) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 + 0.3 }}
                                >
                                    <SkewedPanel
                                        variant="outline"
                                        className={`group hover:bg-white/5 transition-colors duration-300 px-6 transform-none md:transform rounded-lg md:rounded-none overflow-hidden ${post.content ? 'cursor-pointer' : ''}`}
                                        innerClassName="transform-none md:transform"
                                        onClick={post.content ? () => setOpenPost(post) : undefined}
                                    >
                                        <div className="flex flex-col md:flex-row gap-6">
                                            {/* Left side: Title, Date, Description */}
                                            <div className="flex-1 space-y-3">
                                                <div className="flex items-start justify-between gap-4">
                                                    {post.link ? (
                                                        <a
                                                            href={post.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-2xl font-bold font-display text-blue-400 hover:text-blue-300 transition-colors group-hover:underline break-words"
                                                        >
                                                            {post.title}
                                                        </a>
                                                    ) : post.content ? (
                                                        <h3 className="text-2xl font-bold font-display text-blue-400 group-hover:text-blue-300 transition-colors group-hover:underline break-words">
                                                            {post.title}
                                                        </h3>
                                                    ) : (
                                                        <h3 className="text-2xl font-bold font-display text-white break-words">
                                                            {post.title}
                                                        </h3>
                                                    )}
                                                    {post.link && (
                                                        <ExternalLink
                                                            size={18}
                                                            className="text-blue-400 flex-shrink-0 mt-1"
                                                        />
                                                    )}
                                                </div>
                                                <p className="text-sm text-white/70 font-mono">
                                                    {post.date}
                                                    {post.readTime ? ` · ${post.readTime}` : ''}
                                                </p>
                                                <p className="text-base leading-relaxed text-white/90 break-words">
                                                    {post.description}
                                                </p>
                                                {post.content && (
                                                    <p className="text-sm font-mono text-blue-400 group-hover:text-blue-300">
                                                        read post →
                                                    </p>
                                                )}
                                            </div>

                                            {/* Right side: Visual element */}
                                            {post.visualElement && (
                                                <div className="flex-shrink-0 md:w-48 flex items-center justify-center">
                                                    {post.visualElement}
                                                </div>
                                            )}
                                        </div>
                                    </SkewedPanel>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
