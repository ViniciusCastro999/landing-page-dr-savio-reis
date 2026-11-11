# Dr. Sávio Reis — Landing Page

Site institucional (landing page) do **Dr. Sávio Reis** — neurocirurgia e cirurgia endoscópica da coluna, em Pouso Alegre, MG.

🔗 **Site publicado:** https://viniciuscastro999.github.io/landing-page-dr-savio-reis/

## Sobre

Página única, leve e responsiva, construída com HTML, CSS e JavaScript puros — sem etapa de build e sem dependências externas além das fontes do Google Fonts (Instrument Serif, Geist e Geist Mono).

- **Ícones:** [Tabler Icons](https://tabler.io/icons) (licença MIT), embutidos como SVG no `index.html`.
- **Modelo 3D:** coluna lombar modelada por código em `js/coluna3d.js`, renderizada com [three.js](https://threejs.org) 0.160 (licença MIT, carregado do jsDelivr). Sem WebGL, a seção mostra a ilustração em SVG de `js/anatomia.js`.
- **Ilustrações animadas:** desenhos próprios em SVG gerados por `js/anatomia.js` (sinais no corpo, caminho até a hérnia, comparação aberta × endoscópica). Rodam sozinhas quando aparecem na tela, sem depender do scroll, e respeitam a preferência de movimento reduzido.

## Estrutura

```
.
├── index.html   # página completa (HTML + CSS + JS embutidos)
├── js/
│   ├── anatomia.js  # ilustrações animadas da coluna (SVG)
│   └── coluna3d.js  # modelo 3D da coluna (three.js)
├── img/         # fotografias do Dr. Sávio
│   ├── dr-savio-hero.jpg         # topo no desktop
│   ├── dr-savio-retrato.jpg      # topo no celular e seção Dr. Sávio
│   ├── dr-savio-atendimento.jpg  # fundo da seção Atendimento (IMG_1531)
│   ├── og-dr-savio.jpg           # imagem de compartilhamento (1200×630)
│   ├── avaliacoes/               # fotos de perfil das avaliações do Google
│   └── icons/
├── media/       # vídeos: cena (dramatização) e fundo da comparação (cirurgia), com posters
│   ├── cena-1600.mp4   # desktop, sem áudio, em loop (~1,4 MB)
│   ├── cena-960.mp4    # celular (~500 KB)
│   └── cena-poster.jpg # momento da dor (fallback e movimento reduzido)
├── PENDENCIAS.md  # pendências editoriais, médicas e alegações em validação
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
- **Pendências editoriais/médicas** ficam fora da interface pública. Abra a página com `#revisao` no fim do endereço para vê-las destacadas.
- **Alegações em validação** (+1.000 procedimentos, pioneirismo em MG) aparecem com o selo "Em validação". Abra com `#publico` para ver a página sem elas.
- Lista completa em [`PENDENCIAS.md`](PENDENCIAS.md).

## Ordem das seções

Topo → cena em vídeo → revelação da cirurgia endoscópica → Dr. Sávio → comparação de prazos (aberta × endoscópica) → avaliações → atendimento → perguntas → agendamento.

## Próximos passos

- Revisar e validar as pendências médicas/editoriais.
- Migração prevista para React + Vite + TypeScript.
- Configurar domínio próprio (opcional).

## Links

- Instagram: [@drsavioreis.neuro](https://www.instagram.com/drsavioreis.neuro/)
- Linktree: [linktr.ee/savioreisneuro](https://linktr.ee/savioreisneuro)
