export interface Experience {
    id: string;
    company: string;
    title: string;
    location: string;
    dateRange: string;
    bullets: string[];
}

export interface Education {
    school: string;
    degree: string;
    major: string;
    dates: string;
    coursework: string[];
    honors: string[];
}

export interface Project {
    id: string;
    name: string;
    shortDescription: string;
    techStack: string[];
    impact: string;
    links: {
        github?: string;
        live?: string;
    };
}

export interface About {
    bio: string;
    email?: string;
    github?: string;
    linkedin?: string;
    focusAreas: string[];
    technologies: {
        [category: string]: string[];
    };
    stats: { label: string; value: number }[];
}

export const profileData = {
    experience: [
        {
            id: 'exp0b',
            company: 'AQR Capital Management',
            title: 'Quantitative Research Developer Intern',
            location: 'Greenwich, CT',
            dateRange: 'Jun 2026',
            bullets: ['Risk Engineering'],
        },
        {
            id: 'exp0',
            company: 'Verisk',
            title: 'Software Engineer Co-op',
            location: 'Boston, MA',
            dateRange: 'Jan 2026 – Jun 2026',
            bullets: [
                'Building distributed catastrophe risk analytics platform orchestrating Monte Carlo loss simulations (10,000+ trials) across multi-peril reinsurance portfolios, processing exceedance probability curves and stochastic risk metrics at scale',
            ],
        },
        {
            id: 'exp0c',
            company: 'Cursor',
            title: 'Engineering Fellow',
            location: 'Boston, MA',
            dateRange: 'May 2026 – Jun 2026',
            bullets: [
                'Building AGI',
                'Researching and studying multicalibration in machine learning, with an ongoing project applying these techniques',
                "Built Speculative Decoding for Robot Diffusion Policies, porting the vLLM / Medusa / EAGLE draft-verifier inference pattern to lerobot/diffusion_pusht for ~2x speedup while hitting pusht's 10 Hz real-time control deadline",
            ],
        },
        {
            id: 'exp1',
            company: 'Forge',
            title: 'Software Engineer',
            location: 'Boston, MA',
            dateRange: 'Aug 2025 – Dec 2025',
            bullets: [
                'Building a Python + MongoDB backend (REST APIs, JWT auth, caching, tests) for a skill-sharing platform',
            ],
        },
        {
            id: 'exp1b',
            company: 'Cortex',
            title: 'Machine Learning Lead',
            location: 'Boston, MA',
            dateRange: 'Jan 2026 – May 2026',
            bullets: [
                'Architected end-to-end ML-powered document intelligence platform for a client partner, leading team of 8 in designing vector embedding, unsupervised clustering, and graph algorithm pipelines to extract, classify, and link structured data',
            ],
        },
        {
            id: 'exp2',
            company: 'Generate Product Development Studio',
            title: 'Data Tech Lead',
            location: 'Boston, MA',
            dateRange: 'Aug 2025 – Present',
            bullets: [
                "Data Tech Lead — leading internal systems (recruitment portal + MCP AI chatbot + automation/ETL) for Generate, Northeastern University's premier product development studio",
                'Previously: Chief of Internal Insights',
            ],
        },
        {
            id: 'exp3',
            company: 'International Hellenic University',
            title: 'Data Analysis Research Assistant',
            location: 'Remote',
            dateRange: 'May 2024 – Jul 2024',
            bullets: [
                'Built Python/NumPy pipelines on 1M+ healthcare records and optimized PostgreSQL queries/indexes',
            ],
        },
        {
            id: 'exp4',
            company: 'NutriCycle Environmental Initiative',
            title: 'Executive Director',
            location: 'Stamford, CT',
            dateRange: 'Nov 2023 – Jul 2024',
            bullets: [
                'Founded and led a 200+ student nonprofit and built a Flask + PostgreSQL tracking platform (99% uptime)',
            ],
        },
    ] as Experience[],
    education: {
        school: 'NORTHEASTERN UNIVERSITY',
        degree: 'Bachelor of Science',
        major: 'Computer Science and Finance',
        dates: 'Anticipated Graduation: May 2028',
        coursework: [
            'Object Oriented Design',
            'ML Essentials',
            'Algorithms',
            'Data Structures',
            'Discrete Mathematics',
            'Linear Algebra',
            'Calculus',
            'Statistics',
            'Investments',
        ],
        honors: [
            '1st Place at PyData × Cursor Boston Hackathon',
            "YC AI Startup School '26",
            "Two Sigma New Seeker's Summit",
            'IMC Prosperity Top 5% Globally',
            'Jane Street Guts++',
            '2000 Chess.com (99th percentile)',
            'Winner at PennApps XXVI Hackathon (Best Use of Gemini API)',
        ],
    } as Education,
    projects: [
        {
            id: 'projspec',
            name: 'Speculative Diffusion Policy Inference',
            shortDescription: 'Draft-verifier speculative inference for diffusion-based robot policies on lerobot/diffusion_pusht.',
            techStack: ['PyTorch', 'Diffusion Policies', 'Speculative Decoding', 'Real-Time Inference'],
            impact: "Won 1st place at the PyData x Cursor Boston Hackathon. Built a chunked draft-verifier serving pipeline that amortizes one DDPM forward across n_action_steps=8 and hits pusht's 10 Hz / 100 ms control SLO at 2.02x mean speedup over baseline diffusion (95% bootstrap CI [1.59x, 2.62x], B=1000). Matches the action MSE of the highest-fidelity fixed-denoising configuration at 4.4x lower single-inference latency; the only operating point that achieves both deadline and quality simultaneously.",
            links: { github: 'https://github.com/aaravraina3/speculative-diffusion-pusht-robot-diffusion' },
        },
        {
            id: 'proj0',
            name: 'Lock-Free Order Book',
            shortDescription: 'High-performance matching engine in C++ using atomic operations and lock-free data structures.',
            techStack: ['C++', 'Atomics', 'Lock-Free', 'CMake'],
            impact: 'Built a high-performance matching engine that handles 9M+ orders/sec with sub-10ns latency.',
            links: { github: 'https://github.com/aaravraina3/Lock-Free-Order-Book-C-' },
        },
        {
            id: 'proj1',
            name: 'TCP Proxy',
            shortDescription: 'Async network proxy in Rust with zero-copy inspection and real-time traffic modification.',
            techStack: ['Rust', 'Tokio', 'Networking', 'Zero-copy'],
            impact: 'Built an async proxy with zero-copy inspection and real-time traffic modification.',
            links: { github: 'https://github.com/aaravraina3/rust_proxy' },
        },
        {
            id: 'proj2',
            name: 'Jarvis',
            shortDescription: 'AI personal assistant built as a microservices platform with an API gateway, auth, and reliability patterns.',
            techStack: ['Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker'],
            impact: 'Developing a microservices platform with an nginx API gateway routing to 9 Docker services, JWT authentication, webhook event handling, provider failover patterns, and automated integration testing via CI/CD.',
            links: { github: 'https://github.com/aaravraina3/Jarvis' },
        },
        {
            id: 'proj3',
            name: 'Pact',
            shortDescription: 'Accountability habit-tracking app designed for partners to stay consistent together.',
            techStack: ['TypeScript', 'React Native', 'Node.js', 'Python', 'MongoDB'],
            impact: 'Two users pair up as a duo, pick habits, and hold each other accountable with daily check-ins; supports multiple habits and multiple partnerships per user.',
            links: { github: 'https://github.com/aaravraina3/Pact' },
        },
        {
            id: 'proj4',
            name: 'Generate Recruitment System',
            shortDescription: 'Full-stack + ML recruitment portal with automation, analytics, and an MCP-powered assistant.',
            techStack: ['React', 'Tailwind CSS', 'Node.js', 'Express', 'Python', 'pandas', 'Docker'],
            impact: 'Transforms a 300+ application pipeline with automated processing, referral context tracking, intelligent follow-ups, and real-time analytics; includes an AI assistant (MCP) to reduce repetitive recruiter questions and improve applicant experience.',
            links: { github: 'https://github.com/aaravraina3/Recruitment-System' },
        },
        {
            id: 'proj5',
            name: 'CarbonSight',
            shortDescription: 'AI platform that helps reduce carbon footprint using model routing and caching.',
            techStack: ['Python', 'FastAPI', 'Gemini API', 'React', 'Supabase'],
            impact: 'Built an AI platform reducing carbon footprint via complexity-based model routing, a FastAPI backend with vector caching, and blockchain carbon credits; won Best Use of Gemini API at PennApps XXVI.',
            links: { github: 'https://github.com/aaravraina3/carbon-sight' },
        },
        {
            id: 'proj6',
            name: 'Marco',
            shortDescription: 'Voice-controlled browser agent that plans and executes multi-step workflows.',
            techStack: ['Python', 'FastAPI', 'Next.js', 'LangChain', 'Playwright', 'WebSockets'],
            impact: 'Implemented distributed browser control where voice commands trigger AI reasoning to plan multi-step workflows, execute via Playwright automation, and stream live browser state over WebSockets.',
            links: { github: 'https://github.com/aaravraina3/Marco' },
        },
    ] as Project[],
    about: {
        bio: 'Northeastern University student studying Computer Science and Finance. I build backend systems, AI-powered products, and automation—especially APIs, data pipelines, and agentic workflows.',
        email: 'raina.aa@northeastern.edu',
        github: 'https://github.com/aaravraina3',
        linkedin: 'https://www.linkedin.com/in/aarav-raina/',
        focusAreas: ['Software Engineering', 'Quantitative Finance', 'Backend Systems', 'Machine Learning'],
        technologies: {
            'Languages': ['C++', 'Python', 'Java', 'Rust', 'C#/.NET', 'JavaScript', 'TypeScript', 'SQL', 'HTML/CSS', 'Racket'],
            'Libraries/Developer Tools': ['AWS', 'Spring Boot', 'Pandas', 'FastAPI', 'Flask', 'NumPy', 'SciPy', 'Docker', 'CI/CD', 'Render', 'Linux'],
            'Machine Learning': ['NLP', 'Scikit-learn', 'TensorFlow', 'PyTorch', 'Hugging Face', 'LangChain', 'Vector Databases'],
            'Databases': ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL', 'SupaBase'],
        },
        stats: [
            { label: 'C++', value: 100 },
            { label: 'PYTHON', value: 92 },
            { label: 'ALGORITHMS', value: 90 },
            { label: 'PROB/STATS', value: 86 },
        ],
    } as About,
};
