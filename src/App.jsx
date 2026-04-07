import { useState, useRef, useEffect, useCallback } from "react";

// ─── KNOWLEDGE BASE ────────────────────────────────────────────
const KNOWLEDGE = `
DISCIPLINA: Bioquímica Clínica — 7º semestre, Biomedicina.
OBJETIVO: Ensinar de forma simples, clara e didática.

MÓDULO 1: INTRODUÇÃO À BIOQUÍMICA CLÍNICA
- Bioquímica clínica: analisa fluidos biológicos (sangue, urina, líquor) para diagnóstico, prognóstico e monitoramento.
- Fase pré-analítica: coleta, identificação, transporte. Maior fonte de erros (~60-70%). Jejum, postura, torniquete, hemólise, lipemia, icterícia.
- Fase analítica: dosagem. Métodos: espectrofotometria, turbidimetria, nefelometria, eletroforese, imunoensaios (ELISA, quimioluminescência), potenciometria.
- Fase pós-analítica: interpretação, valores de referência, laudos.
- Valores de referência: 95% da população saudável. Variam por idade, sexo, etnia.
- Sensibilidade: detectar doença. Especificidade: excluir doença.
- CQI e AEQ. Levey-Jennings, Westgard.
- Amostras: soro (sem anticoagulante), plasma (EDTA, heparina, citrato), sangue total, urina.

MÓDULO 2: AVALIAÇÃO BIOQUÍMICA CARDIOVASCULAR
- Troponinas (cTnI/cTnT): padrão-ouro IAM. Elevam 3-6h, pico 12-24h, permanecem 7-14 dias.
- CK-MB: eleva 3-8h, pico 12-24h, normaliza 48-72h. Índice CK-MB/CK >5% = cardíaco.
- Mioglobina: primeira a elevar (1-3h), inespecífica. VPN alto.
- BNP/NT-proBNP: insuficiência cardíaca. BNP <100 exclui IC.
- PCR-us: risco CV. <1 baixo, 1-3 médio, >3 alto.
- Perfil lipídico: CT, LDL, HDL, TG, VLDL. Friedewald: LDL=CT-HDL-TG/5 (TG<400). CT<200, LDL<130, HDL>40(H)/50(M), TG<150.
- Homocisteína, Lp(a): risco cardiovascular.
- Aterosclerose: inflamação crônica arterial com acúmulo lipídico.

MÓDULO 3: AVALIAÇÃO BIOQUÍMICA RENAL
- Creatinina: 0,6-1,2 mg/dL. Só eleva com ~50% perda função. Influenciada por massa muscular.
- Ureia: 15-40 mg/dL. Eleva em IR, desidratação, sangramento GI. Relação ureia/creat >40:1 = pré-renal.
- TFG/eGFR: CKD-EPI. DRC: G1≥90, G2 60-89, G3a 45-59, G3b 30-44, G4 15-29, G5<15.
- Cistatina C: alternativa à creatinina.
- Albuminúria: marcador precoce. Micro: 30-300 mg/dia.
- EAS: pH, densidade, proteínas, glicose, hemácias, leucócitos, cilindros.
- Eletrólitos: Na 135-145, K 3,5-5,0. Gasometria: pH 7,35-7,45, pCO2 35-45, HCO3 22-26.
- LRA: creat ≥0,3 em 48h ou ≥1,5x em 7d. KDIGO. Pré-renal, renal, pós-renal.
- DRC: TFG<60 por ≥3 meses. Diabetes e HAS principais causas.

MÓDULO 4: AVALIAÇÃO BIOQUÍMICA HEPATOBILIAR
- AST(TGO)/ALT(TGP): lesão hepatocelular. ALT mais específica. De Ritis: AST/ALT >2 = alcoólica, <1 = viral.
- FA/GGT: colestase. GGT sensível ao álcool. FA+GGT↑ = colestase.
- Bilirrubinas: BI↑=hemólise/Gilbert. BD↑=colestase/lesão. Icterícia: BT>2-3. Pré-hepática(BI↑), hepática(ambas↑), pós-hepática(BD↑).
- Albumina: 3,5-5,0. Meia-vida 20d. Baixa = doença crônica/desnutrição.
- TP/INR: síntese hepática. INR>1,5 = comprometimento.
- Amônia: encefalopatia hepática.
- Hepatites: A(fecal-oral), B(HBsAg), C(Anti-HCV). ALT/AST >10x na aguda.
- Cirrose: albumina↓, TP↑, bilirrubinas↑, plaquetas↓. MELD.
`;

// ─── CURRICULUM ────────────────────────────────────────────────
const CURRICULUM = [
  { level: 1, label: "Introdução", icon: "🔬", color: "#4fc3f7", topics: [
    { id: "intro_bioq", name: "O que é Bioquímica Clínica", icon: "🧪", prompt: "Me explique o que é bioquímica clínica, qual a importância no diagnóstico e quais fluidos biológicos são analisados. Use linguagem simples." },
    { id: "fases", name: "Fases: Pré, Analítica, Pós", icon: "📋", prompt: "Me explique as 3 fases do laboratório (pré-analítica, analítica e pós-analítica). Dê exemplos de erros em cada fase. Use analogias." },
    { id: "amostras", name: "Amostras e Coleta", icon: "🩸", prompt: "Me explique a diferença entre soro, plasma e sangue total. Quais anticoagulantes são usados e quando usar cada um? Use tabela." },
    { id: "cqi", name: "Valores de Referência e CQ", icon: "📊", prompt: "Me explique valores de referência, sensibilidade, especificidade e controle de qualidade laboratorial." },
  ]},
  { level: 2, label: "Cardiovascular", icon: "❤️", color: "#ef5350", topics: [
    { id: "marcadores_iam", name: "Troponina, CK-MB e Mioglobina", icon: "💔", prompt: "Me explique os 3 marcadores de IAM: quando eleva, pico e normalização. Use tabela e fluxograma temporal." },
    { id: "bnp_ic", name: "BNP e Insuficiência Cardíaca", icon: "🫀", prompt: "Me explique BNP e NT-proBNP no diagnóstico de insuficiência cardíaca. Use analogia simples." },
    { id: "perfil_lipidico", name: "Perfil Lipídico e Aterosclerose", icon: "🩺", prompt: "Me explique o perfil lipídico: CT, LDL, HDL, TG, Friedewald, valores desejáveis e aterosclerose." },
    { id: "risco_cv", name: "PCR-us, Homocisteína e Lp(a)", icon: "⚡", prompt: "Me explique os marcadores de risco cardiovascular: PCR-us, homocisteína e Lp(a)." },
  ]},
  { level: 3, label: "Renal", icon: "🫘", color: "#ab47bc", topics: [
    { id: "creat_ureia", name: "Creatinina, Ureia e TFG", icon: "🔎", prompt: "Me explique creatinina, ureia e TFG: o que medem, valores normais, limitações e classificação DRC." },
    { id: "eas_urina", name: "Exame de Urina (EAS)", icon: "🧫", prompt: "Me explique o EAS: cada parâmetro (pH, densidade, proteínas, glicose, hemácias, leucócitos, cilindros)." },
    { id: "eletrólitos", name: "Eletrólitos e Gasometria", icon: "⚖️", prompt: "Me explique eletrólitos (Na, K) e gasometria arterial básica. Use fluxograma." },
    { id: "lra_drc", name: "LRA e DRC", icon: "🏥", prompt: "Me explique LRA vs DRC: critérios KDIGO, causas pré-renal, renal e pós-renal. Use tabela." },
  ]},
  { level: 4, label: "Hepatobiliar", icon: "🫁", color: "#ffa726", topics: [
    { id: "enzimas_hep", name: "AST, ALT, FA e GGT", icon: "🧬", prompt: "Me explique AST/ALT (lesão) e FA/GGT (colestase). Índice de De Ritis. Use tabela." },
    { id: "bilirrubinas", name: "Bilirrubinas e Icterícia", icon: "🟡", prompt: "Me explique bilirrubina indireta vs direta e como diferenciar icterícias. Use fluxograma." },
    { id: "funcao_hep", name: "Albumina, TP e Amônia", icon: "📈", prompt: "Me explique albumina, TP/INR e amônia como marcadores de função hepática." },
    { id: "hepatopatias", name: "Hepatites, Cirrose e Colestase", icon: "🏥", prompt: "Me explique os padrões bioquímicos das hepatites, cirrose e colestase. Use tabela comparativa." },
  ]},
];

const ALL_TOPICS = CURRICULUM.flatMap(l => l.topics.map(t => ({ ...t, level: l.level, levelLabel: l.label, levelColor: l.color })));

const CLINICAL_CASES = [
  { title: "Dor torácica — IAM?", prompt: "Caso: Homem, 58 anos, hipertenso, dor torácica há 4h. ECG inconclusivo. Troponina, CK-MB e mioglobina colhidas. Guie o aluno: qual marcador alterado nesse tempo?" },
  { title: "Edema e creatinina elevada", prompt: "Caso: Mulher, 65 anos, diabética, edema de MMII, creatinina 3,2 (basal 1,0). LRA ou DRC? TFG? Que exames pedir?" },
  { title: "Icterícia no adulto jovem", prompt: "Caso: Homem, 28 anos, pele amarelada, urina escura. BT 6,0 (BD 4,5/BI 1,5), ALT 850, AST 620, FA leve↑. Anti-HAV IgM positivo. Explique." },
  { title: "Perfil lipídico alterado", prompt: "Caso: Mulher, 45 anos, IMC 32. CT 280, LDL 190, HDL 35, TG 320. Pode usar Friedewald? Quais valores alterados? Risco CV?" },
  { title: "Sódio perigosamente baixo", prompt: "Caso: Mulher, 75 anos, sonolenta. Na 118 mEq/L, K 3.0 mEq/L, osmolaridade sérica reduzida. Avalie as causas de hiponatremia hipotônica extrema." },
  { title: "Abdome agudo (Pancreatite)", prompt: "Caso: Homem, 42 anos, etilista, dor em barra. Amilase 1200 U/L, Lipase 3500 U/L, Cálcio 7,5 mg/dL. Explique a intersecção metabólica." },
  { title: "Cetoacidose em pediatria", prompt: "Caso: Menino, 10 anos, poliúria intensa, hálito cetônico. Glicose 480 mg/dL, pH 7,10, HCO3 12. Cetoacidose diabética? O que ocorre bioquimicamente?" }
];

// ─── SYSTEM PROMPT ─────────────────────────────────────────────
const buildSystemPrompt = (level) => `Você é o Prof. Bioq — professor de Biomedicina, especialista em Bioquímica Clínica. Paciente, didático, linguagem simples mas precisa.

CONTEXTO: Aluno 4º ano (7º semestre) Biomedicina.
NÍVEL: ${level === 1 ? "Iniciante" : level === 2 ? "Intermediário" : level === 3 ? "Avançado" : "Expert"}

${KNOWLEDGE}

REGRAS:
- Português brasileiro sempre.
- Linguagem simples — como explicando para um colega.
- Analogias do cotidiano para conceitos difíceis.
- Inclua valores de referência quando mencionar exames.
- Conecte teoria com prática: "na bancada, isso significa..."
- Markdown: # headers, **negrito**, *itálico*, \`termos\`, listas - .
- NUNCA pare no meio. Conclua completamente.

FORMATAÇÃO VISUAL:
1. Caixas: > 💡 Dica | > ⚠️ Atenção | > 📌 Nota | > ✅ Ponto-chave
2. Tabelas: | Exame | Normal | Quando altera |
3. Fluxogramas: [Etapa 1] → [Etapa 2] → [Etapa 3]
4. Sempre finalize com: ## 📋 Resumo`;

const QUIZ_SYSTEM = `Gere 1 questão de múltipla escolha de Bioquímica Clínica. NÃO USE JSON. Use EXATAMENTE a seguinte estrutura textual:
@@@PERGUNTA
[seu enunciado longo com caso clínico profundo, estilo ENADE]
@@@OPCOES
A) [opção 1]
B) [opção 2]
C) [opção 3]
D) [opção 4]
E) [opção 5]
@@@CORRETA
[APENAS A LETRA CORRETA, ex: C]
@@@EXPLICACAO
[sua explicação detalhada]

Use: ${KNOWLEDGE}`;

// ─── MARKDOWN ──────────────────────────────────────────────────
function parseMsg(t) {
  const p = [], re = /```(\w*)\n([\s\S]*?)```/g;
  let l = 0, m;
  while ((m = re.exec(t)) !== null) { if (m.index > l) p.push({ type: "t", c: t.slice(l, m.index) }); p.push({ type: "c", c: m[2].trimEnd() }); l = m.index + m[0].length; }
  if (l < t.length) p.push({ type: "t", c: t.slice(l) });
  return p;
}

function inlineFmt(text) {
  const K = "\u0000", sl = [];
  const s = (el) => { sl.push(el); return K + (sl.length - 1) + K; };
  text = text.replace(/`([^`]+?)`/g, (_, c) => s(<code style={{ background: "#1a1a32", padding: "2px 6px", borderRadius: 4, fontSize: "0.88em", color: "#80cbc4", fontFamily: "monospace" }}>{c}</code>));
  text = text.replace(/\*\*(.+?)\*\*/g, (_, c) => s(<strong style={{ color: "#e8e8f8", fontWeight: 600 }}>{c}</strong>));
  text = text.replace(/\*(.+?)\*/g, (_, c) => s(<em style={{ color: "#b0c8d8" }}>{c}</em>));
  const parts = text.split(new RegExp(K + "(\\d+)" + K));
  return parts.map((p, i) => i % 2 === 1 ? { ...sl[parseInt(p)], key: i } : p).filter(p => p !== "");
}

const CS = { "💡": { bg: "#1a1a0a", b: "#ffd54f", l: "Dica" }, "⚠️": { bg: "#1a1008", b: "#ff9800", l: "Atenção" }, "📌": { bg: "#0a1a1a", b: "#4fc3f7", l: "Nota" }, "✅": { bg: "#0a1a0e", b: "#4caf50", l: "Ponto-chave" }, "❗": { bg: "#1a0a0a", b: "#ef5350", l: "Importante" } };

function Callout({ emoji, lines }) { const s = CS[emoji] || CS["📌"]; return <div style={{ background: s.bg, borderLeft: `3px solid ${s.b}`, borderRadius: "0 8px 8px 0", padding: "10px 14px", margin: "10px 0" }}><div style={{ fontSize: 11, fontWeight: 700, color: s.b, marginBottom: 4 }}>{emoji} {s.l}</div>{lines.map((l, i) => <div key={i} style={{ fontSize: 13, lineHeight: 1.6 }}>{inlineFmt(l)}</div>)}</div>; }

function Table({ headers, rows }) { return <div style={{ overflowX: "auto", margin: "10px 0" }}><table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}><thead><tr>{headers.map((h, i) => <th key={i} style={{ background: "#161628", color: "#4fc3f7", padding: "8px 12px", borderBottom: "2px solid #2a2a4a", textAlign: "left", fontWeight: 600, fontSize: 12 }}>{inlineFmt(h.trim())}</th>)}</tr></thead><tbody>{rows.map((r, ri) => <tr key={ri} style={{ background: ri % 2 ? "#12122a" : "#0e0e1e" }}>{r.map((c, ci) => <td key={ci} style={{ padding: "7px 12px", borderBottom: "1px solid #1a1a30", color: "#c8c8e0", fontSize: 12.5 }}>{inlineFmt(c.trim())}</td>)}</tr>)}</tbody></table></div>; }

function Flow({ steps }) { return <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", margin: "12px 0", overflowX: "auto" }}>{steps.map((s, i) => <div key={i} style={{ display: "flex", alignItems: "center" }}><div style={{ background: "linear-gradient(135deg,#1a2040,#1a1a3a)", border: "1px solid #3a3a6a", borderRadius: 8, padding: "8px 14px", fontSize: 12.5, color: "#e0e0f0", fontWeight: 500, whiteSpace: "nowrap" }}>{inlineFmt(s.replace(/^\[|\]$/g, "").trim())}</div>{i < steps.length - 1 && <div style={{ color: "#4fc3f7", fontSize: 18, margin: "0 6px" }}>→</div>}</div>)}</div>; }

function Summary({ lines }) { return <div style={{ background: "linear-gradient(135deg,#0d1a2a,#0a1420)", border: "1px solid #1a3a5a", borderRadius: 10, padding: "14px 16px", margin: "14px 0" }}><div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}><span style={{ fontSize: 16 }}>📋</span><span style={{ color: "#4fc3f7", fontWeight: 700, fontSize: 14 }}>Resumo</span></div>{lines.map((l, i) => { const b = l.match(/^[-*]\s+(.+)/); return b ? <div key={i} style={{ display: "flex", gap: 8, margin: "4px 0", paddingLeft: 4 }}><span style={{ color: "#4fc3f7" }}>▸</span><span style={{ fontSize: 13, lineHeight: 1.5 }}>{inlineFmt(b[1])}</span></div> : l.trim() === "" ? <div key={i} style={{ height: 4 }} /> : <div key={i} style={{ fontSize: 13, lineHeight: 1.5 }}>{inlineFmt(l)}</div>; })}</div>; }

function RichText({ content }) {
  const lines = content.split("\n"), el = []; let i = 0;
  while (i < lines.length) {
    const ln = lines[i];
    if (/^---+$/.test(ln.trim())) { el.push(<hr key={i} style={{ border: "none", borderTop: "1px solid #222238", margin: "12px 0" }} />); i++; continue; }
    if (/^#{1,3}\s+📋\s*[Rr]esumo/.test(ln)) { i++; const cl = []; while (i < lines.length && !/^#{1,3}\s/.test(lines[i])) { cl.push(lines[i]); i++; } el.push(<Summary key={`s${i}`} lines={cl} />); continue; }
    const h = ln.match(/^(#{1,3})\s+(.+)/);
    if (h) { const lv = h[1].length; const st = { 1: { fontSize: 18, color: "#4fc3f7" }, 2: { fontSize: 15.5, color: "#80cbc4" }, 3: { fontSize: 14, color: "#a5d6a7" } }; el.push(<div key={i} style={{ fontWeight: 700, margin: "14px 0 6px", ...st[lv] }}>{inlineFmt(h[2])}</div>); i++; continue; }
    const cm = ln.match(/^>\s*(💡|⚠️|📌|✅|❗)\s*(.*)/);
    if (cm) { const em = cm[1], cl = [cm[2]]; i++; while (i < lines.length && /^>\s/.test(lines[i])) { cl.push(lines[i].replace(/^>\s*/, "")); i++; } el.push(<Callout key={`c${i}`} emoji={em} lines={cl.filter(l => l.trim())} />); continue; }
    if (ln.includes("|") && ln.trim().startsWith("|")) { const tl = []; let j = i; while (j < lines.length && lines[j].includes("|") && lines[j].trim().startsWith("|")) { tl.push(lines[j]); j++; } if (tl.length >= 2) { const pr = r => r.split("|").filter((_, x, a) => x > 0 && x < a.length - 1); const isSep = r => /^\|[\s\-:|]+\|$/.test(r.trim()); const si = tl.findIndex(isSep); if (si > 0) { el.push(<Table key={`t${i}`} headers={pr(tl[si - 1])} rows={tl.slice(si + 1).filter(r => !isSep(r)).map(pr)} />); i = j; continue; } } }
    if (/→/.test(ln) && (ln.includes("[") || (ln.match(/→/g) || []).length >= 2)) { const st = ln.split("→").map(s => s.trim()).filter(Boolean); if (st.length >= 2) { el.push(<Flow key={`f${i}`} steps={st} />); i++; continue; } }
    if (ln.trim() === "") { el.push(<div key={i} style={{ height: 5 }} />); i++; continue; }
    const bl = ln.match(/^(\s*)[-*]\s+(.+)/);
    if (bl) { el.push(<div key={i} style={{ margin: "3px 0", paddingLeft: 14, display: "flex", gap: 7 }}><span style={{ color: "#4fc3f7" }}>•</span><span>{inlineFmt(bl[2])}</span></div>); i++; continue; }
    const nm = ln.match(/^(\d+)\.\s+(.+)/);
    if (nm) { el.push(<div key={i} style={{ margin: "3px 0", paddingLeft: 14, display: "flex", gap: 7 }}><span style={{ color: "#4fc3f7" }}>{nm[1]}.</span><span>{inlineFmt(nm[2])}</span></div>); i++; continue; }
    el.push(<div key={i} style={{ margin: "2px 0" }}>{inlineFmt(ln)}</div>); i++;
  }
  return <>{el}</>;
}

function NoteBlock({ code }) { const [cp, setCp] = useState(false); return <div style={{ margin: "10px 0", borderRadius: 8, overflow: "hidden", background: "#0d1117", border: "1px solid #1e2a3a" }}><div style={{ display: "flex", justifyContent: "space-between", padding: "4px 12px", background: "#161b22", fontSize: 10, color: "#5a6a7a" }}><span>nota</span><button onClick={() => { navigator.clipboard?.writeText(code); setCp(true); setTimeout(() => setCp(false), 1400); }} style={{ background: "none", border: "1px solid #2a3a4a", color: "#7a8a9a", borderRadius: 4, padding: "1px 8px", cursor: "pointer", fontSize: 10 }}>{cp ? "✓" : "copiar"}</button></div><pre style={{ margin: 0, padding: 12, overflowX: "auto", fontSize: 13, lineHeight: 1.6, color: "#c8d6e5", fontFamily: "monospace" }}>{code}</pre></div>; }

// ─── TYPING ────────────────────────────────────────────────────
function useTyping(text, speed = 6) {
  const [shown, setShown] = useState(""); const [done, setDone] = useState(false); const ref = useRef({ idx: 0, x: false });
  useEffect(() => { if (!text) return; const r = ref.current; r.idx = 0; r.x = false; setShown(""); setDone(false); const t = () => { if (r.x) return; r.idx = Math.min(r.idx + 5, text.length); setShown(text.slice(0, r.idx)); r.idx < text.length ? setTimeout(t, speed) : setDone(true); }; t(); return () => { r.x = true; }; }, [text, speed]);
  const skip = useCallback(() => { ref.current.x = true; setShown(text); setDone(true); }, [text]);
  return { shown, done, skip };
}
function TypedMsg({ content, onDone }) { const { shown, done, skip } = useTyping(content); useEffect(() => { if (done && onDone) onDone(); }, [done, onDone]); return <div>{parseMsg(shown).map((p, i) => p.type === "c" ? <NoteBlock key={i} code={p.c} /> : <div key={i}><RichText content={p.c} /></div>)}{!done && <span onClick={skip} style={{ fontSize: 11, color: "#4fc3f7", cursor: "pointer", opacity: 0.7, marginTop: 4, display: "inline-block" }}>⏩ pular</span>}</div>; }
function StaticMsg({ content }) { return <div>{parseMsg(content).map((p, i) => p.type === "c" ? <NoteBlock key={i} code={p.c} /> : <div key={i}><RichText content={p.c} /></div>)}</div>; }

// ─── QUIZ ──────────────────────────────────────────────────────
function QuizCard({ quiz, onResult }) { const [sel, setSel] = useState(null); const ok = sel === quiz.correct; return <div style={{ background: "#10101e", border: "1px solid #222238", borderRadius: 12, padding: 14, margin: "10px auto", maxWidth: 650, width: "100%" }}><div style={{ fontSize: 11, color: "#4fc3f7", fontWeight: 700, marginBottom: 6 }}>{quiz.isTest ? "📋 TESTE" : "🧠 QUIZ"}</div><div style={{ color: "#d0d0e0", fontSize: 13.5, marginBottom: 10, lineHeight: 1.5 }}>{quiz.question}</div><div style={{ display: "flex", flexDirection: "column", gap: 5 }}>{quiz.options.map((o, i) => { const ch = sel === i; return <button key={i} onClick={() => { if (sel === null) { setSel(i); onResult(i === quiz.correct); } }} style={{ background: sel === null ? "#151528" : i === quiz.correct ? "#0d2818" : ch ? "#2d1014" : "#151528", border: `1px solid ${sel === null ? "#2a2a4a" : i === quiz.correct ? "#4caf50" : ch ? "#e05555" : "#2a2a4a"}`, color: "#d0d0e0", borderRadius: 8, padding: "9px 12px", cursor: sel === null ? "pointer" : "default", fontSize: 13, textAlign: "left" }}>{o}{sel !== null && i === quiz.correct && " ✅"}{ch && !ok && " ❌"}</button>; })}</div>{sel !== null && <div style={{ marginTop: 8, padding: "8px 10px", background: ok ? "#0a1e14" : "#1e0a0e", borderRadius: 6, fontSize: 12.5, color: ok ? "#88d4ab" : "#e8a0a0", lineHeight: 1.5 }}>{ok ? "🎉 " : "💡 "}{quiz.explanation}</div>}</div>; }

// ─── PANELS ────────────────────────────────────────────────────
function CasesPanel({ onClose, onSelect }) { 
  const randCases = React.useMemo(() => [...CLINICAL_CASES].sort(() => 0.5 - Math.random()).slice(0, 3), []);
  return (
    <div style={{ background: "#0d1117", borderTop: "1px solid #1e2a3a", padding: "14px 12px", flexShrink: 0 }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ color: "#ef5350", fontSize: 12, fontWeight: 700 }}>🏥 Galeria de Casos</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#5a5a7a", cursor: "pointer", fontSize: 15 }}>✕</button>
        </div>
        <button onClick={() => onSelect("Gere um caso clínico inusitado, avançado e original de Bioquímica Clínica. Não use doenças clichês. Forneça o laudo bioquímico completo, a queixa e peça pro aluno desvendar o quebra-cabeça diagnóstico.")} style={{ display: "block", width: "100%", background: "linear-gradient(135deg, #2b1836, #5c2049)", border: "1px solid #783561", color: "#fff", borderRadius: 8, padding: "10px 14px", cursor: "pointer", fontSize: 13, textAlign: "left", marginBottom: 12, fontWeight: 700, boxShadow: "0 2px 10px rgba(92,32,73,0.3)" }}>🎲 Sortear Caso Aleatório (Nível Mestre)</button>
        {randCases.map((c, i) => <button key={i} onClick={() => onSelect(c.prompt)} style={{ display: "block", width: "100%", background: "#161b22", border: "1px solid #2a3a4a", color: "#c8d6e5", borderRadius: 8, padding: "10px 14px", cursor: "pointer", fontSize: 13, textAlign: "left", marginBottom: 6 }}>📋 {c.title}</button>)}
      </div>
    </div>
  ); 
}

function Sidebar({ open, onClose, completed, currentLevel, onSelect, xp, history }) {
  const pct = Math.round((completed.length / ALL_TOPICS.length) * 100);
  return <>
    {open && <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 90 }} />}
    <div style={{ position: "fixed", top: 0, left: open ? 0 : -310, width: 290, height: "100vh", background: "#0a0a16", borderRight: "1px solid #1a1a2a", zIndex: 100, transition: "left .25s", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "14px 16px", borderBottom: "1px solid #1a1a2a" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#e0e0f0", fontWeight: 700, fontSize: 15 }}>🧪 Trilha</span><button onClick={onClose} style={{ background: "none", border: "none", color: "#5a5a7a", cursor: "pointer", fontSize: 17 }}>✕</button></div>
        <div style={{ marginTop: 10 }}><div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#5a5a7a", marginBottom: 3 }}><span>⭐ {xp} XP</span><span>{pct}%</span></div><div style={{ height: 5, background: "#1a1a2a", borderRadius: 3 }}><div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#4fc3f7,#ef5350,#ab47bc,#ffa726)", borderRadius: 3, transition: "width .4s" }} /></div></div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 12px" }}>
        {CURRICULUM.map(lv => { const un = lv.level <= currentLevel; return <div key={lv.level} style={{ marginBottom: 16 }}><div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}><span style={{ fontSize: 16 }}>{lv.icon}</span><span style={{ color: un ? lv.color : "#2a2a4a", fontWeight: 700, fontSize: 12 }}>Nível {lv.level} — {lv.label}</span>{!un && <span style={{ fontSize: 10, color: "#2a2a4a" }}>🔒</span>}</div>{lv.topics.map(t => { const d = completed.includes(t.id); return <button key={t.id} onClick={() => un && onSelect(t)} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", background: d ? "#0a1418" : "transparent", border: `1px solid ${d ? "#1a3a4a" : !un ? "#111120" : "#1e1e36"}`, borderRadius: 7, padding: "8px 10px", marginBottom: 3, cursor: un ? "pointer" : "default", opacity: un ? 1 : 0.3 }}><span style={{ fontSize: 14 }}>{d ? "✅" : t.icon}</span><span style={{ color: d ? "#80cbc4" : "#b0b0c8", fontSize: 12.5 }}>{t.name}</span></button>; })}</div>; })}
        {history.length > 0 && <div style={{ borderTop: "1px solid #1a1a2a", paddingTop: 10, marginTop: 8 }}><div style={{ color: "#4a4a6a", fontSize: 10, fontWeight: 600, marginBottom: 6 }}>HISTÓRICO</div>{history.slice().reverse().slice(0, 8).map(h => <button key={h.id + h.time} onClick={() => onSelect(ALL_TOPICS.find(t => t.id === h.id))} style={{ display: "flex", alignItems: "center", gap: 6, width: "100%", background: "transparent", border: "none", color: "#6a6a8a", padding: "5px 4px", cursor: "pointer", fontSize: 11.5, textAlign: "left" }}><span>{h.icon}</span> {h.name}</button>)}</div>}
      </div>
    </div>
  </>;
}

// ─── MAIN ──────────────────────────────────────────────────────
export default function App() {
  const [init] = useState(() => { try { return JSON.parse(localStorage.getItem("bioq_session")) || {}; } catch { return {}; } });
  const [msgs, setMsgs] = useState(init.msgs || []); const [input, setInput] = useState(""); const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(init.started || false); const [sidebar, setSidebar] = useState(false); const [casesOpen, setCasesOpen] = useState(false);
  const [completed, setCompleted] = useState([]); const [xp, setXp] = useState(0); const [topic, setTopic] = useState(init.topic || null);
  const [typIdx, setTypIdx] = useState(-1); const [quiz, setQuiz] = useState(init.quiz || null); const [quizLoad, setQuizLoad] = useState(false);
  const [hist, setHist] = useState([]); const btm = useRef(null);
  const lvl = completed.length < 4 ? 1 : completed.length < 8 ? 2 : completed.length < 12 ? 3 : 4;

  useEffect(() => { try { const d = JSON.parse(localStorage.getItem("bioq") || "{}"); setCompleted(d.c || []); setXp(d.x || 0); setHist(d.h || []); } catch {} }, []);
  const save = useCallback((c, x, h) => { try { localStorage.setItem("bioq", JSON.stringify({ c, x, h })); } catch {} }, []);
  useEffect(() => { btm.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, loading, typIdx, quiz]);
  useEffect(() => { try { localStorage.setItem("bioq_session", JSON.stringify({ msgs, started, topic, quiz })); } catch {} }, [msgs, started, topic, quiz]);

  async function api(sys, m, mt = 1024, temp = 0.7) {
  const r = await fetch("/api/chat", {  
    method: "POST", 
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ system: sys, messages: m, max_tokens: mt, temperature: temp })
  });
  const d = await r.json();
  if (r.status === 429) throw new Error("429");
  if (d.error) throw new Error(d.error);
  return d.content || "";
}

  async function send(txt, tp = null) {
    if (tp) { setTopic(tp); const nh = [...hist.filter(h => h.id !== tp.id), { id: tp.id, name: tp.name, icon: tp.icon, time: Date.now() }]; setHist(nh); save(completed, xp, nh); }
    const nm = [...msgs, { role: "user", content: txt }];
    setMsgs(nm); setInput(""); setLoading(true); setStarted(true); setQuiz(null); setSidebar(false); setCasesOpen(false);
    try { const t = await api(buildSystemPrompt(lvl), nm.slice(-4).map(m => ({ role: m.role, content: m.content }))); if (!t) throw new Error("empty"); setMsgs(p => [...p, { role: "assistant", content: t }]); setTypIdx(nm.length); }
    catch(e) { setMsgs(p => [...p, { role: "assistant", content: e.message === "429" ? "⏳ Limite global do servidor gratuito atingido (muitas chamadas em 1 minuto). Por favor, aguarde cerca de 30 a 60 segundos e reenvie!" : "⚠️ Erro de conexão. Tente novamente." }]); }
    setLoading(false);
  }

  function typDone() { setTypIdx(-1); if (topic && !completed.includes(topic.id)) { const nc = [...completed, topic.id], nx = xp + 20; setCompleted(nc); setXp(nx); save(nc, nx, hist); } }

  async function getQuiz(amount = 1, forceTest = false) { setQuizLoad(true); setMsgs([]); try { const fcs = ["paciente idoso com comorbidades", "emergência clínica", "fase pré-analítica de laboratório", "caso atípico", "toxicologia/medicamentos", "dilema diagnóstico"]; const f = fcs[Math.floor(Math.random() * fcs.length)]; const pmpt = `Gere exatamente ${amount} questão inédita super complexa e original sobre: ${topic?.name || "bioquímica clínica"}. CONTEXTO: "${f}". RESPONDA APENAS NO FORMATO TEXTUAL COM @@@ e NADA ALÉM DISSO. Seed: ${Math.random()}`; const t = await api(QUIZ_SYSTEM, [{ role: "user", content: pmpt }], 1024, 0.95); const qM = t.match(/@@@PERGUNTA\n([\s\S]*?)@@@OPCOES/); const oM = t.match(/@@@OPCOES\n([\s\S]*?)@@@CORRETA/); const cM = t.match(/@@@CORRETA\n([\s\S]*?)@@@EXPLICACAO/); const eM = t.match(/@@@EXPLICACAO\n([\s\S]*)/i); if(qM && oM && cM && eM) { const opts = oM[1].trim().split('\n').filter(l => l.trim() !== ''); const idC = ['A','B','C','D','E'].indexOf(cM[1].trim().charAt(0).toUpperCase()); setQuiz([{ question: qM[1].trim(), options: opts, correct: idC !== -1 ? idC : 0, explanation: eM[1].trim(), isTest: forceTest || amount > 1 }]); } else throw new Error("Parse: Formatação LLM falhou"); } catch(e) { console.error(e); setMsgs([{ role: "assistant", content: e.message === "429" ? "⏳ A placa Rápido/Llama gratuita saturou a quantidade de tokens permitidos neste exato minuto. Aguarde cerca de 60 segundinhos e tente clicar de novo!" : "⚠️ A geração falhou. O prompt pode não ter sido interpretado corretamente. Clique em 'Exercícios' para tentar novamente." }]); setQuiz(null); } setQuizLoad(false); }

  function selTopic(t) { setMsgs([]); setQuiz(null); setSidebar(false); send(t.prompt, t); }

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#0b0b18", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@keyframes pulse{0%,100%{opacity:.3}50%{opacity:1}} @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}} *::-webkit-scrollbar{width:4px} *::-webkit-scrollbar-thumb{background:#2a2a4a;border-radius:2px}`}</style>
      <Sidebar open={sidebar} onClose={() => setSidebar(false)} completed={completed} currentLevel={lvl} onSelect={selTopic} xp={xp} history={hist} />

      <div style={{ padding: "8px 12px", borderBottom: "1px solid #151528", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <button onClick={() => setSidebar(true)} style={{ background: "#111120", border: "1px solid #222238", color: "#6a6a8a", borderRadius: 7, padding: "5px 9px", cursor: "pointer", fontSize: 14 }}>☰</button>
        <div style={{ width: 30, height: 30, borderRadius: 7, background: "linear-gradient(135deg,#4fc3f7,#ef5350)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🧪</div>
        <div style={{ flex: 1, minWidth: 0 }}><div style={{ color: "#e0e0f0", fontWeight: 700, fontSize: 14 }}>Prof. Bioq</div><div style={{ color: "#5a5a7a", fontSize: 10, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{topic ? `${topic.icon} ${topic.name}` : "Bioquímica Clínica — 7º Semestre"}</div></div>
        <div style={{ display: "flex", gap: 5, alignItems: "center", flexShrink: 0 }}>
          <div style={{ background: "#111120", border: "1px solid #222238", borderRadius: 6, padding: "3px 8px", fontSize: 11, color: "#4fc3f7", fontWeight: 600 }}>⭐{xp}</div>
          <button onClick={() => setCasesOpen(p => !p)} style={{ background: casesOpen ? "#1a1014" : "#111120", border: `1px solid ${casesOpen ? "#ef5350" : "#222238"}`, color: casesOpen ? "#ef5350" : "#6a6a8a", borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>🏥</button>
          {started && <button onClick={() => { setMsgs([]); setQuiz(null); setTopic(null); setCasesOpen(false); send("Gere um caso clínico inusitado, avançado e original de Bioquímica Clínica. Não use doenças clichês. Forneça o laudo bioquímico completo, a história e peça pro aluno desvendar o quebra-cabeça diagnóstico."); }} style={{ background: "linear-gradient(135deg, #2b1836, #5c2049)", border: "1px solid #783561", color: "#fff", borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontSize: 11, fontWeight: 700 }}>🎲 Novo Caso</button>}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 14 }}>
        {!started ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 16, animation: "fadeUp .5s" }}>
            <div style={{ fontSize: 48 }}>🧪</div>
            <div style={{ color: "#e0e0f0", fontSize: 19, fontWeight: 700 }}>Prof. Bioq</div>
            <div style={{ color: "#5a5a7a", fontSize: 12.5, textAlign: "center", maxWidth: 400, lineHeight: 1.6 }}>Bioquímica Clínica de forma simples. Aulas, quizzes, casos clínicos e exercícios.</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>{CURRICULUM.map(l => <div key={l.level} style={{ background: l.level <= lvl ? "#0a1418" : "#111120", border: `1px solid ${l.level <= lvl ? l.color + "44" : "#1a1a2a"}`, borderRadius: 8, padding: "6px 12px", textAlign: "center", opacity: l.level <= lvl ? 1 : 0.35 }}><div style={{ fontSize: 16 }}>{l.icon}</div><div style={{ color: l.color, fontSize: 9, fontWeight: 600 }}>{l.label}</div></div>)}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", maxWidth: 480 }}>{CURRICULUM[0].topics.map(t => <button key={t.id} onClick={() => selTopic(t)} style={{ background: "#111120", border: "1px solid #222238", color: "#b0b0c8", borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontSize: 12.5, display: "flex", alignItems: "center", gap: 5 }}>{t.icon} {t.name}</button>)}</div>
            <button onClick={() => setSidebar(true)} style={{ background: "none", border: "1px solid #222238", color: "#4fc3f7", borderRadius: 8, padding: "7px 18px", cursor: "pointer", fontSize: 12 }}>📚 Trilha completa</button>
          </div>
        ) : (<>
          {msgs.map((m, i) => <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 12, paddingLeft: m.role === "user" ? 36 : 0, paddingRight: m.role === "user" ? 0 : 16, animation: "fadeUp .25s" }}>
            {m.role !== "user" && <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#4fc3f7,#ef5350)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, marginRight: 7, flexShrink: 0, marginTop: 2 }}>🧪</div>}
            <div style={{ background: m.role === "user" ? "linear-gradient(135deg,#1a237e,#283593)" : "#0e0e1e", color: m.role === "user" ? "#bbdefb" : "#d0d0e0", padding: "10px 14px", borderRadius: m.role === "user" ? "14px 14px 3px 14px" : "14px 14px 14px 3px", fontSize: 13.5, lineHeight: 1.7, border: m.role === "user" ? "none" : "1px solid #1a1a30", maxWidth: "100%", wordBreak: "break-word" }}>
              {m.role === "user" ? m.content : i === typIdx ? <TypedMsg content={m.content} onDone={typDone} /> : <StaticMsg content={m.content} />}
            </div>
          </div>)}
          {!loading && started && typIdx === -1 && <div style={{ display: "flex", gap: 6, padding: "2px 35px", flexWrap: "wrap", animation: "fadeUp .3s" }}>
            {(!quiz || quiz.length === 0) && <button onClick={() => getQuiz(1)} disabled={quizLoad} style={{ background: "#111120", border: "1px solid #222238", color: "#4fc3f7", borderRadius: 7, padding: "5px 12px", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>{quizLoad ? "⏳" : "🧠 Quiz"}</button>}
            {(!quiz || quiz.length === 0) && <button onClick={() => send("Mais detalhes e exemplos práticos.")} style={{ background: "#111120", border: "1px solid #222238", color: "#6a6a8a", borderRadius: 7, padding: "5px 12px", cursor: "pointer", fontSize: 11 }}>📝 Aprofundar</button>}
            {(!quiz || quiz.length === 0) && <button onClick={() => send("Explique de outro jeito, mais simples.")} style={{ background: "#111120", border: "1px solid #222238", color: "#6a6a8a", borderRadius: 7, padding: "5px 12px", cursor: "pointer", fontSize: 11 }}>🔄 Simplificar</button>}
            {(quiz && quiz.length > 0) && <button onClick={() => { const q = quiz[0]; send(`Me mostre a resolução matemática passo a passo e o raciocínio diagnóstico desta questão:\n\nQuestão: ${q.question}\nOpções: ${q.options.join(' | ')}\n\nRevele a resposta correta e justifique os cálculos detalhadamente.`); }} style={{ background: "#111120", border: "1px solid #222238", color: "#cddc39", borderRadius: 7, padding: "5px 12px", cursor: "pointer", fontSize: 11 }}>🧮 Ver Resolução/Cálculo</button>}
            <button onClick={() => getQuiz(1, true)} disabled={quizLoad} style={{ background: "#111120", border: "1px solid #222238", color: "#ab47bc", borderRadius: 7, padding: "5px 12px", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>{quizLoad ? "⏳" : (quiz && quiz.length > 0 ? "🔄 Gerar Outra" : "📋 Exercícios")}</button>
          </div>}
          {quiz?.length > 0 && <div style={{ padding: "10px 35px", animation: "fadeUp .25s", display: "flex", flexDirection: "column", gap: 6 }}>{quiz.map((q, idx) => <QuizCard key={idx} quiz={q} onResult={ok => { const nx = xp + (ok ? 15 : 5); setXp(nx); save(completed, nx, hist); }} />)}</div>}
          {loading && <div style={{ display: "flex", alignItems: "center", gap: 7, color: "#5a5a7a", fontSize: 12, padding: "0 35px" }}><span style={{ animation: "pulse 1.2s infinite" }}>🧪</span> Preparando explicação...</div>}
          <div ref={btm} />
        </>)}
      </div>

      {casesOpen && <CasesPanel onClose={() => setCasesOpen(false)} onSelect={p => { setCasesOpen(false); send(p); }} />}

      <div style={{ padding: "8px 12px", borderTop: "1px solid #151528", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 7, maxWidth: 700, margin: "0 auto" }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && input.trim() && !loading) send(input.trim()); }}
            placeholder="Sua pergunta de bioquímica clínica..." style={{ flex: 1, background: "#0e0e1e", border: "1px solid #222238", color: "#e0e0f0", borderRadius: 9, padding: "10px 13px", fontSize: 13.5, outline: "none" }} />
          <button onClick={() => { if (input.trim() && !loading) send(input.trim()); }} disabled={!input.trim() || loading}
            style={{ background: input.trim() && !loading ? "linear-gradient(135deg,#4fc3f7,#ef5350)" : "#111120", border: "none", color: "#fff", borderRadius: 9, padding: "0 16px", cursor: input.trim() && !loading ? "pointer" : "default", fontSize: 15, opacity: input.trim() && !loading ? 1 : 0.35 }}>➤</button>
        </div>
      </div>
    </div>
  );
}
