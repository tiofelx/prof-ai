# 🧪 Prof. Bioq — Tutor de Bioquímica Clínica

Tutor inteligente de Bioquímica Clínica com IA, feito para alunos do 7º semestre de Biomedicina.

## 🚀 Deploy no Vercel (passo a passo)

### 1. Criar repositório no GitHub
- Vá em [github.com/new](https://github.com/new)
- Nome: `prof-bioq`
- Marque "Private" se preferir
- Clique "Create repository"

### 2. Subir os arquivos
No terminal, dentro da pasta do projeto:
```bash
git init
git add .
git commit -m "Prof. Bioq v1.0"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/prof-bioq.git
git push -u origin main
```

### 3. Conectar no Vercel
- Vá em [vercel.com/new](https://vercel.com/new)
- Clique "Import" no repositório `prof-bioq`
- Em **Environment Variables**, adicione:
  - `OPENROUTER_API_KEY` = `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`
  - `AI_MODEL` = `qwen/qwen3.6-plus:free`
- Clique **Deploy**

### 4. Pronto! 🎉
Seu app estará online em `https://prof-bioq.vercel.app` (ou similar).

## 🛠️ Rodar localmente
```bash
npm install
npm run dev
```

## 📁 Estrutura
```
prof-bioq/
├── api/chat.js          ← Serverless function (esconde API key)
├── src/
│   ├── main.jsx         ← Entry point
│   └── App.jsx          ← App completo
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
└── .env.example
```

## ✨ Features
- 16 tópicos em 4 módulos (Intro, Cardiovascular, Renal, Hepatobiliar)
- Quizzes interativos gerados por IA
- 4 casos clínicos práticos
- Formatação rica (tabelas, fluxogramas, caixas de destaque, cards de resumo)
- Sistema de XP e progresso
- Animação de digitação
- Sidebar com trilha e histórico
