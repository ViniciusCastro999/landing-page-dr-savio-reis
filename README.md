# Dr. Sávio Reis — Landing Page

Site institucional (landing page) do **Dr. Sávio Reis** — neurocirurgia e cirurgia endoscópica da coluna, em Pouso Alegre, MG.

🔗 **Site publicado:** https://viniciuscastro999.github.io/landing-page-dr-savio-reis/

## Sobre

Página única, leve e responsiva, construída com HTML, CSS e JavaScript puros — sem etapa de build e sem dependências externas além das fontes do Google Fonts (Instrument Serif, Geist e Geist Mono).

## Estrutura

```
.
├── index.html   # página completa (HTML + CSS + JS embutidos)
├── img/         # fotografias do Dr. Sávio (hero e retrato)
│   ├── dr-savio-hero.jpg
│   ├── dr-savio-hero-sm.jpg
│   └── dr-savio-retrato.jpg
├── .nojekyll    # faz o GitHub Pages servir os arquivos sem processar com Jekyll
└── README.md
```

## Visualizar localmente

Abra o `index.html` direto no navegador, ou sirva a pasta com um servidor estático:

```bash
python3 -m http.server 8000
```

Depois acesse http://localhost:8000.

## Publicação (GitHub Pages)

O site é publicado automaticamente pelo GitHub Pages a partir da branch `main` (pasta raiz). Qualquer `git push` para `main` atualiza o site em cerca de um minuto.

## Status do conteúdo

- **Conteúdo demonstrativo:** os relatos de pacientes são fictícios e estão marcados como tal.
- **Pendências editoriais/médicas** (CRM, RQE, formação, endereço, dados clínicos) aparecem destacadas no botão **"Revisão"** da página e devem ser confirmadas antes da divulgação oficial.

## Próximos passos

- Revisar e validar as pendências médicas/editoriais.
- Migração prevista para React + Vite + TypeScript.
- Configurar domínio próprio (opcional).

## Links

- Instagram: [@drsavioreis.neuro](https://www.instagram.com/drsavioreis.neuro/)
- Linktree: [linktr.ee/savioreisneuro](https://linktr.ee/savioreisneuro)
