# Atypica – Plataforma de Acessibilidade Educacional (Protótipo)

Atypica é um protótipo web para apoiar professores na adaptação de materiais didáticos para alunos neurodivergentes conforme o Design Universal para Aprendizagem (DUA). Inclui análise de PDFs com sugestões de acessibilidade e uma comunidade/fórum para compartilhamento de boas práticas.

## Monorepo

- `atypica-frontend/` – React + Vite + Tailwind, UI acessível e responsiva
- `atypica-backend/` – Node + Express, endpoints mockados para análise e fórum

## Principais telas

- Login/Boas-vindas
- Dashboard (upload de PDF, histórico, indicadores)
- Upload (drag-and-drop)
- Análise em progresso
- Sugestões (lista, filtros, comparação lado a lado)
- Pré-visualização corrigida (download/compartilhar/ajustes)
- Configurações (preferências de acessibilidade, notificações)
- Fórum/Comunidade (tópicos, comentários, curtir, “Boa prática”)
- Ajuda e Suporte (FAQ, vídeo com legenda/Libras, chat ao vivo mock)

## Acessibilidade (WCAG-first)

- Alto contraste e modo claro/escuro
- Tamanho de fonte ajustável globalmente
- Navegação por teclado (skip links, foco visível)
- Compatível com leitores de tela (aria-attrs, labels)
- Leitura em voz alta (TTS via Web Speech API no protótipo)

## Como rodar

1) Frontend

```
cd atypica-frontend
npm install
npm run dev
```

2) Backend

```
cd atypica-backend
npm install
npm run dev
```

Acesse o frontend em http://localhost:5173 e backend em http://localhost:5000.

## Executar com Docker (recomendado se você não tem Node/npm instalado)

1) Construa e suba os serviços com Docker Compose

```
docker compose up --build
```

2) Acesse

- Frontend (Nginx): http://localhost:8080
- Backend (Express): http://localhost:5000

O Nginx do frontend já faz proxy de `/api` para o backend dentro da rede do Compose, então as chamadas funcionarão sem configuração extra.

## Observação

Este é um protótipo com dados e análises mockados. A integração com serviços reais (OCR, verificação WCAG, WhatsApp/email, LMS) pode ser conectada futuramente.
