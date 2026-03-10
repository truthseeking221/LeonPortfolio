import { useState } from 'react';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
const snippets = {
  node: {
    label: 'Node.js',
    code: `import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.gateflow.io/v1",
  apiKey:  process.env.GATEFLOW_API_KEY,
});

const res = await client.chat.completions.create({
  model: "gpt-4o",          // or claude-3.5-sonnet, gemini-1.5-pro
  messages: [{ role: "user", content: "Hello!" }],
});

console.log(res.choices[0].message.content);`,
  },
  python: {
    label: 'Python',
    code: `from openai import OpenAI

client = OpenAI(
    base_url="https://api.gateflow.io/v1",
    api_key=os.environ["GATEFLOW_API_KEY"],
)

res = client.chat.completions.create(
    model="claude-3.5-sonnet",   # or gpt-4o, gemini-1.5-pro
    messages=[{"role": "user", "content": "Hello!"}],
)

print(res.choices[0].message.content)`,
  },
  curl: {
    label: 'cURL',
    code: `curl https://api.gateflow.io/v1/chat/completions \\
  -H "Authorization: Bearer $GATEFLOW_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gemini-1.5-pro",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'`,
  },
} as const;

type Lang = keyof typeof snippets;

export default function CodePreview() {
  const [lang, setLang] = useState<Lang>('node');
  const sectionRef = useRevealOnScroll<HTMLElement>();

  return (
    <section id="docs" ref={sectionRef} className="max-w-7xl mx-auto px-6 pb-24 pt-24 relative bg-black font-sans border-b border-gray-800">
      <div className="flex flex-col items-center text-center mb-16 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-900 border border-gray-800 text-[11px] font-mono tracking-[0.2em] uppercase text-gray-400 mb-6 rounded-none">
          [ INTEGRATION ]
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-6 uppercase">
          ONE LINE OF CODE. <span className="text-cyan-500">EVERY MODEL.</span>
        </h2>
        <p className="text-[14px] text-gray-400 font-mono max-w-2xl mx-auto mb-10">
          Change the <code className="text-white bg-gray-900 border border-gray-700 px-1.5 py-0.5 select-all">baseURL</code> — done. 100% compatible with OpenAI SDK.
        </p>
      </div>

      <div className="max-w-4xl mx-auto relative z-10 w-full font-mono">
        <div className="bg-black border border-gray-700 rounded-none shadow-2xl relative">

          {/* Faux terminal header */}
          <div className="flex items-center justify-between border-b border-gray-700 bg-gray-900 px-4 py-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <div className="w-2 h-2 rounded-full bg-green-500" />
            </div>
            <div className="text-[10px] text-gray-500 uppercase tracking-widest">
              TERMINAL
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4">
            {/* Sidebar Language tabs */}
            <div className="flex flex-row md:flex-col border-b md:border-b-0 md:border-r border-gray-700 bg-gray-900/50">
              {(Object.keys(snippets) as Lang[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setLang(key)}
                  className={`px-6 py-4 text-[12px] font-bold tracking-widest uppercase transition-colors text-left border-l-2 ${lang === key
                    ? 'text-cyan-500 border-cyan-500 bg-black/50'
                    : 'text-gray-500 hover:text-white border-transparent hover:bg-gray-800'
                    }`}
                >
                  {snippets[key].label}
                </button>
              ))}
            </div>

            {/* Code block */}
            <div className="col-span-1 md:col-span-3 p-6 sm:p-8 bg-black overflow-x-auto">
              <div className="font-mono text-[13px] text-gray-300 leading-relaxed">
                <pre className="whitespace-pre-wrap">
                  <code className="text-cyan-100">{snippets[lang].code}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
