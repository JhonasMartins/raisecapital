import fs from "node:fs";
import path from "node:path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

export default function Page() {
  const filePath = path.join(process.cwd(), "docs", "material-didatico.md");
  const markdown = fs.readFileSync(filePath, "utf8");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            ← Voltar ao início
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Material Didático
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Guias e recursos educacionais sobre investimentos
          </p>
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <article className="prose prose-lg prose-slate max-w-none prose-headings:text-gray-900 prose-headings:font-semibold prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-700 prose-strong:text-gray-900 prose-a:text-blue-600 hover:prose-a:text-blue-800">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
          </article>
        </div>
      </main>
    </div>
  );
}