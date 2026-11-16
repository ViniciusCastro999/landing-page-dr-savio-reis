# Dr. Sávio Reis — Landing Page

Site institucional (landing page) do **Dr. Sávio Reis** — neurocirurgia e cirurgia endoscópica da coluna, em Pouso Alegre, MG.

🔗 **Site publicado:** https://savioreisneuro.com.br/

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
│   ├── cena-1920.mp4   # computador, sem áudio, em loop (~4,6 MB, resolução cheia)
│   ├── cena-celular.mp4 # celular, recortado na área que aparece (~3 MB)
│   ├── cena-poster.jpg # primeiro quadro (computador; fallback e movimento reduzido)
│   └── cena-poster-celular.jpg # primeiro quadro recortado (celular)
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

O site é publicado automaticamente pelo GitHub Pages a partir da branch `main` (pasta raiz), no domínio próprio **savioreisneuro.com.br** (arquivo `CNAME`). Qualquer `git push` para `main` atualiza o site em cerca de um minuto. O endereço antigo `viniciuscastro999.github.io/landing-page-dr-savio-reis/` redireciona para o domínio.

**DNS (Zone Editor do cPanel da HostGator):** `savioreisneuro.com.br` com registros A para 185.199.108.153, 185.199.109.153, 185.199.110.153 e 185.199.111.153; `www` como CNAME para `viniciuscastro999.github.io`. O e-mail (`mail` e MX) continua na HostGator (162.241.203.80) — não cancelar o plano da HostGator nem deixar o domínio vencer (Registro.br, 13/04/2027).

## Status do conteúdo

- **Conteúdo demonstrativo:** os relatos de pacientes são fictícios e estão marcados como tal.
- **Pendências editoriais/médicas** ficam fora da interface pública. Abra a página com `#revisao` no fim do endereço para vê-las destacadas.
- **Alegações em validação** aparecem com o selo "Em validação" só ao abrir a página com `#revisao`; no site público ficam ocultas. O "1º no Sul de Minas Gerais" e os "+1.000 pacientes operados" foram confirmados pelo Dr. Sávio e aparecem sempre.
- Lista completa em [`PENDENCIAS.md`](PENDENCIAS.md).

## Ordem das seções

Topo → cena em vídeo → revelação da cirurgia endoscópica → Dr. Sávio → comparação de prazos (aberta × endoscópica) → avaliações → atendimento → perguntas → agendamento.

## Próximos passos

- Revisar e validar as pendências médicas/editoriais.
- Migração prevista para React + Vite + TypeScript.
- Enviar o sitemap no Google Search Console e trocar o link do site no Instagram e no perfil do Google.

## Plano B: hospedar na HostGator

Se um dia o site sair do GitHub Pages, ele pode ir para a hospedagem da HostGator (voltando o registro A do domínio para 162.241.203.80). Os endereços do site (canonical, Open Graph, JSON-LD, sitemap e robots) já apontam para `https://savioreisneuro.com.br/`, e o `.htaccess` força https sem "www", define o cache e bloqueia arquivos ocultos.

1. Gerar o pacote: `zip -q -r -X publicar/savioreisneuro.com.br.zip .htaccess index.html robots.txt sitemap.xml img js media -x '*.DS_Store'` (a pasta `publicar/` não vai para o git)
2. cPanel → Gerenciador de Arquivos → `public_html`: apagar a página padrão da HostGator (ou renomear o que já existir)
3. Enviar o .zip para `public_html` e clicar em "Extrair"; ligar "mostrar arquivos ocultos" e conferir o `.htaccess`
4. Testar https://savioreisneuro.com.br no computador e no celular (cadeado, vídeos, WhatsApp)
5. Depois de no ar: enviar o sitemap no Google Search Console e trocar o link do Instagram e do perfil do Google

## Links

- Instagram: [@drsavioreis.neuro](https://www.instagram.com/drsavioreis.neuro/)
- Linktree: [linktr.ee/savioreisneuro](https://linktr.ee/savioreisneuro)
