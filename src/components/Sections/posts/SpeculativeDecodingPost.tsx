import React from 'react';

const P: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <p className="text-base leading-relaxed text-white/90 break-words">{children}</p>
);

const H: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h4 className="text-xl md:text-2xl font-bold font-display text-white pt-4 border-b-2 border-white/40 pb-1 inline-block">
        {children}
    </h4>
);

const CodeBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <pre className="bg-black/40 border border-white/20 p-3 rounded font-mono text-xs md:text-sm text-green-400 overflow-x-auto whitespace-pre">
        {children}
    </pre>
);

const Inline: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <code className="font-mono text-sm bg-white/10 px-1.5 py-0.5 rounded break-words">{children}</code>
);

export const SpeculativeDecodingPost: React.FC = () => (
    <div className="space-y-5">
        <P>
            I just got home from a hackathon. The brief: three hours, one public dataset, build something
            cool in a marimo notebook. PyData and Cursor ran it at Moderna HQ. Most people went for the
            MBTA or NASA exoplanet datasets, so I picked the robot.
        </P>
        <P>
            The robot is <Inline>lerobot/pusht</Inline>: a single arm pushing a T-shaped block around a 2D
            plane, recorded at 10 Hz. The pretrained policy for it is a 263 million parameter diffusion
            model. You hand it an observation, it runs an iterative denoising loop, and out comes an
            action. First thing I did was load it on my laptop CPU and time one forward pass.
        </P>
        <CodeBlock>1.4 seconds per call.</CodeBlock>
        <P>
            The control loop runs at 10 Hz, so every frame gives you a 100 ms budget. I was missing the
            deadline by 14x. Picture a meeting that restarts every 100 ms and an engineer who shows up 1.3
            seconds late to all of them.
        </P>

        <H>The knob everyone turns</H>
        <P>
            Diffusion policies have one obvious speed knob: the number of denoising steps. The default is
            100 and the community fix is to crank it down and eat the quality loss. I swept it:
        </P>
        <div className="overflow-x-auto">
            <table className="w-full text-sm font-mono border border-white/20">
                <thead>
                    <tr className="bg-white/10 text-left">
                        <th className="p-2 border-b border-white/20">denoising steps</th>
                        <th className="p-2 border-b border-white/20">single call</th>
                        <th className="p-2 border-b border-white/20">action MSE</th>
                    </tr>
                </thead>
                <tbody className="text-white/80">
                    <tr><td className="p-2">50</td><td className="p-2">~3.3 s</td><td className="p-2">191</td></tr>
                    <tr><td className="p-2">20</td><td className="p-2">~1.4 s</td><td className="p-2">225</td></tr>
                    <tr><td className="p-2">10</td><td className="p-2">~700 ms</td><td className="p-2">229</td></tr>
                    <tr><td className="p-2">5</td><td className="p-2">~320 ms</td><td className="p-2">216</td></tr>
                </tbody>
            </table>
        </div>
        <P>
            Chunking helps too. The policy plans 8 actions per forward pass and serves them open loop, so
            1.4 s at 20 steps is really 178 ms per frame. Still late. At 5 steps you sneak under the
            deadline with a real quality hit. Everyone at the hackathon who picked this dataset would turn
            this knob, so I wanted a different angle.
        </P>

        <H>The thing I stole from LLM serving</H>
        <P>
            LLM inference has a trick called speculative decoding. A small draft model guesses the next
            tokens, a big verifier model checks the guesses, and you only pay for the big model when the
            draft is wrong. vLLM, Medusa, EAGLE. Every serious serving stack runs some flavor of it.
        </P>
        <P>
            Think of it as an intern and a senior engineer. The intern does the work, the senior reviews
            it. Most tasks are easy, the intern nails them, and the senior just nods. You pay senior
            prices only on the hard ones.
        </P>
        <P>
            The same shape of problem exists here. The diffusion policy is the senior: expensive,
            accurate. I can train a tiny policy on the same data to be the intern. The only missing piece
            is the review. Actions in pusht are 2D vectors, so the review is L2 distance: if the intern's
            action lands within <Inline>tau</Inline> pixels of the senior's, ship the intern's. Raise{' '}
            <Inline>tau</Inline> and you accept more drafts, go faster, and lose quality. One knob, honest
            tradeoff.
        </P>

        <H>The intern</H>
        <CodeBlock>{`class StateMlpPolicy(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(2, 64), nn.ReLU(),
            nn.Linear(64, 64), nn.ReLU(),
            nn.Linear(64, 2),
        )
    def forward(self, x): return self.net(x)`}</CodeBlock>
        <P>
            4,482 parameters against 263 million, about 59,000x smaller. Training MSE bottomed out around
            333, which is bad. It does not need to be good. It needs to agree with the senior on the easy
            frames.
        </P>

        <H>Does it work</H>
        <P>
            For 24 sampled frames per episode I ran both models and recorded the distance between their
            answers. At <Inline>tau ≈ 7.3</Inline> the intern gets accepted on 51% of decisions.
            Projected per-frame latency drops from 178 ms to 93 ms. Deadline hit. Served action MSE goes
            from 136 to 189, a real cost, but far from the 289 you get by trusting the intern outright.
        </P>
        <P>The best part is where it wins:</P>
        <CodeBlock>{`corr(delta, action_change)    = 0.61
corr(delta, action_magnitude) = 0.27`}</CodeBlock>
        <P>
            The intern handles the smooth pushing stretches and the senior gets pulled in at direction
            changes. Which is exactly the sentence you would write about speculative decoding for LLMs:
            drafts handle the common continuations, verifiers handle the surprises.
        </P>

        <H>Wait, is this real?</H>
        <P>
            The first version of the writeup had a headline number from one episode, with{' '}
            <Inline>tau</Inline> tuned on the same data I reported. Classic. So, in order: cross-episode
            validation on episodes 0, 1, and 2 (mean speedup 2.2x, the pattern survives), then a bootstrap
            on the pooled 72 frames with <Inline>tau</Inline> fixed, B=1000. The 95% CI on the speedup
            came out to <Inline>[1.59x, 2.62x]</Inline>. The lower bound sits well above 1x, so the result
            is not a few lucky frames.
        </P>

        <H>The part that didn't work</H>
        <P>
            To check the projection I built the serving loop for real and raced it against pure diffusion
            on 80 contiguous frames. Result: 1.05x wall clock. Way below the projected 2x.
        </P>
        <P>
            The cost model was the problem. At every decision my synchronous loop paid both the intern and
            the senior just to pick whose answer to use. There is no point having an intern if the senior
            redoes every task before it ships. The real win requires async serving: ship the intern's
            answer immediately, let the senior review in the background, roll back on disagreement. That
            is how LLM gateways actually run it. I deleted the misleading section from the notebook and
            put async serving at the top of the limitations list.
        </P>
        <P>
            The blind judge for the best-submission track was an LLM, and its rationale flagged exactly
            what I was worried about: the methodology asks the reader to trust several implementation
            details. The bootstrap CI and the difficulty analysis were the direct response. The submission
            won 1st place out of the 13 eligible entries.
        </P>
        <P>
            The transferable lesson is small. Techniques port between domains when the cost structure
            matches: a fast cheap model, a slow accurate one, and a deadline to commit on. LLM serving and
            robot control use different vocabulary for the same math.
        </P>
        <P>
            The notebook, the seven plots, and a more rigorous README live at{' '}
            <a
                href="https://github.com/aaravraina3/speculative-diffusion-pusht-robot-diffusion"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline break-all"
            >
                github.com/aaravraina3/speculative-diffusion-pusht-robot-diffusion
            </a>
            .
        </P>
    </div>
);
