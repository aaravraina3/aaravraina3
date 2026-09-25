import React from 'react';

// Renders the subset of markdown the posts actually use, styled to match the
// hand-written components in SpeculativeDecodingPost.

const inline = (text: string, keyPrefix: string): React.ReactNode[] => {
    const nodes: React.ReactNode[] = [];
    const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*[^*]+\*)/g;
    let last = 0;
    let match: RegExpExecArray | null;
    let i = 0;

    while ((match = pattern.exec(text)) !== null) {
        if (match.index > last) nodes.push(text.slice(last, match.index));
        const token = match[0];
        const key = `${keyPrefix}-i${i++}`;

        if (token.startsWith('**')) {
            nodes.push(<strong key={key} className="font-bold text-white">{token.slice(2, -2)}</strong>);
        } else if (token.startsWith('`')) {
            nodes.push(
                <code key={key} className="font-mono text-sm bg-white/10 px-1.5 py-0.5 rounded break-words">
                    {token.slice(1, -1)}
                </code>
            );
        } else if (token.startsWith('[')) {
            const [, label, href] = /\[([^\]]+)\]\(([^)]+)\)/.exec(token)!;
            nodes.push(
                <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline break-words"
                >
                    {label}
                </a>
            );
        } else {
            nodes.push(<em key={key} className="italic">{token.slice(1, -1)}</em>);
        }
        last = match.index + token.length;
    }
    if (last < text.length) nodes.push(text.slice(last));
    return nodes;
};

const splitRow = (row: string): string[] =>
    row.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());

export const Markdown: React.FC<{ source: string }> = ({ source }) => {
    const lines = source.replace(/\r\n/g, '\n').split('\n');
    const blocks: React.ReactNode[] = [];
    let i = 0;
    let key = 0;

    while (i < lines.length) {
        const line = lines[i];

        if (!line.trim()) { i++; continue; }

        // The page chrome already renders the title and byline.
        if (line.startsWith('# ')) { i++; continue; }
        if (/^Aarav Raina\s+·/.test(line.trim())) { i++; continue; }

        if (line.startsWith('## ') || line.startsWith('### ')) {
            blocks.push(
                <h4
                    key={key++}
                    className="text-xl md:text-2xl font-bold font-display text-white pt-4 border-b-2 border-white/40 pb-1 inline-block"
                >
                    {line.replace(/^#+\s*/, '')}
                </h4>
            );
            i++;
            continue;
        }

        if (line.startsWith('```')) {
            const body: string[] = [];
            i++;
            while (i < lines.length && !lines[i].startsWith('```')) body.push(lines[i++]);
            i++;
            blocks.push(
                <pre
                    key={key++}
                    className="bg-black/40 border border-white/20 p-3 rounded font-mono text-xs md:text-sm text-green-400 overflow-x-auto whitespace-pre"
                >
                    {body.join('\n')}
                </pre>
            );
            continue;
        }

        if (line.startsWith('> ')) {
            const body: string[] = [];
            while (i < lines.length && lines[i].startsWith('> ')) body.push(lines[i++].slice(2));
            blocks.push(
                <blockquote
                    key={key++}
                    className="border-l-4 border-white/40 pl-4 text-sm md:text-base leading-relaxed text-white/70"
                >
                    {inline(body.join(' '), `q${key}`)}
                </blockquote>
            );
            continue;
        }

        if (line.startsWith('![')) {
            const [, alt, src] = /!\[([^\]]*)\]\(([^)]+)\)/.exec(line)!;
            blocks.push(
                <img
                    key={key++}
                    src={src}
                    alt={alt}
                    loading="lazy"
                    className="w-full border border-white/20 rounded bg-white/5"
                />
            );
            i++;
            continue;
        }

        // Figure captions are a lone fully-italic line.
        if (/^\*[^*].*\*$/.test(line.trim())) {
            blocks.push(
                <p key={key++} className="text-sm text-white/60 font-mono leading-relaxed break-words">
                    {line.trim().slice(1, -1)}
                </p>
            );
            i++;
            continue;
        }

        if (line.startsWith('|')) {
            const rows: string[] = [];
            while (i < lines.length && lines[i].startsWith('|')) rows.push(lines[i++]);
            const header = splitRow(rows[0]);
            const body = rows.slice(2).map(splitRow);
            blocks.push(
                <div key={key++} className="overflow-x-auto">
                    <table className="w-full text-sm font-mono border border-white/20">
                        <thead>
                            <tr className="bg-white/10 text-left">
                                {header.map((cell, c) => (
                                    <th key={c} className="p-2 border-b border-white/20">{inline(cell, `th${c}`)}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="text-white/80">
                            {body.map((row, r) => (
                                <tr key={r}>
                                    {row.map((cell, c) => (
                                        <td key={c} className="p-2">{inline(cell, `td${r}-${c}`)}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
            continue;
        }

        if (line.startsWith('- ')) {
            const items: string[] = [];
            while (i < lines.length && lines[i].startsWith('- ')) items.push(lines[i++].slice(2));
            blocks.push(
                <ul key={key++} className="list-disc pl-6 space-y-2">
                    {items.map((item, n) => (
                        <li key={n} className="text-base leading-relaxed text-white/90 break-words">
                            {inline(item, `li${n}`)}
                        </li>
                    ))}
                </ul>
            );
            continue;
        }

        const para: string[] = [];
        while (
            i < lines.length &&
            lines[i].trim() &&
            !/^(#|>|```|\||- |!\[)/.test(lines[i])
        ) {
            para.push(lines[i++]);
        }
        blocks.push(
            <p key={key++} className="text-base leading-relaxed text-white/90 break-words">
                {inline(para.join(' '), `p${key}`)}
            </p>
        );
    }

    return <div className="space-y-5">{blocks}</div>;
};
