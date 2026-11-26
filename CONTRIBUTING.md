# Contribuire al sito MCC

Grazie per voler contribuire. Ci sono tre modi principali per farlo: pubblicare un evento, scrivere un articolo o migliorare il sito.

Tutte le modifiche passano da una pull request su `main`. Ogni pull request viene compilata automaticamente e i file di eventi e articoli vengono controllati: se manca un campo obbligatorio o un nome è scritto male, il controllo fallisce e indica file e campo. Appena la pull request viene unita, il sito viene ricostruito e pubblicato in un paio di minuti.

## Pubblicare il prossimo evento

Gli eventi stanno in [`src/data/events.json`](src/data/events.json). La homepage mostra automaticamente il primo evento non ancora concluso; se non ce ne sono, mostra un invito a entrare nella community WhatsApp. Gli eventi passati possono restare nel file: vengono ignorati.

```json
[
  {
    "date": "2026-12-12T18:30:00+01:00",
    "end": "2026-12-12T21:00:00+01:00",
    "title": { "it": "Titolo in italiano", "en": "English title" },
    "description": { "it": "Una o due frasi.", "en": "One or two sentences." },
    "speaker": "Nome Cognome",
    "location": "Nome del posto, Monopoli",
    "address": "Via Esempio 1, 70043 Monopoli BA",
    "signupUrl": "https://lu.ma/..."
  }
]
```

| Campo | Obbligatorio | Note |
|---|---|---|
| `date` | sì | Data e ora ISO 8601 **con fuso orario** (`+01:00` d'inverno, `+02:00` d'estate). |
| `title` | sì | Stringa oppure `{ "it": ..., "en": ... }`. |
| `end` | no | Stesso formato di `date`. Se manca, l'evento dura 3 ore. |
| `description` | no | Stringa oppure `{ "it": ..., "en": ... }`. |
| `speaker`, `location`, `address` | no | Testo libero. |
| `signupUrl` | no | Link di iscrizione (Luma, Eventbrite, Google Form...). Fortemente consigliato: ci dice quante persone aspettarci. |

Campi diversi da questi vengono rifiutati, così un errore di battitura (per esempio `signupURL`) non passa inosservato. Se non ci sono eventi (il file contiene `[]`), la build mostra un avviso sulla collection `events` vuota: è normale. Il pulsante "Aggiungi al calendario" genera un file `.ics` a partire da questi dati.

Dopo l'evento, aggiungi il poster in [`src/data/workshops.json`](src/data/workshops.json) (immagine in `public/workshops/`, larga al massimo 1000px; `width` e `height` sono le sue dimensioni in pixel).

## Proporre un talk

Il pulsante "Proponi il tuo talk" in homepage apre il modulo [`.github/ISSUE_TEMPLATE/proposta-talk.yml`](.github/ISSUE_TEMPLATE/proposta-talk.yml): ogni proposta diventa una issue con titolo `[Talk] ...`, dove gli organizzatori possono rispondere. Le issue sono pubbliche.

Per usare un altro modulo (per esempio Tally o Google Forms, se si preferisce raccogliere proposte in privato), basta cambiare `TALK_PROPOSAL_URL` in [`src/config.ts`](src/config.ts).

## Scrivere un articolo

Gli articoli sono file Markdown nella cartella [`src/content/blog/`](src/content/blog/). Il nome del file diventa l'indirizzo dell'articolo: `src/content/blog/debug-con-playwright.md` → `/blog/2026/12/debug-con-playwright/`. La guida completa, che è anche un articolo di esempio, è [`come-scrivere-un-articolo.md`](src/content/blog/come-scrivere-un-articolo.md).

Ogni file inizia con:

```yaml
---
title: "Titolo dell'articolo"
description: "Una frase di riassunto, usata nelle anteprime e sui social."
date: 2026-12-01
author: Nome Cognome
github: username-github   # opzionale, mostra il tuo avatar
tags: [tag1, tag2]        # opzionale
language: it              # opzionale: it (predefinito) oppure en
draft: true               # opzionale: l'articolo non viene pubblicato
---
```

`title`, `description`, `date` e `author` sono obbligatori. Lo schema completo è in [`src/content.config.ts`](src/content.config.ts).

Note:

- Le immagini vanno in `public/assets/img/blog/` e si includono con `![descrizione](/assets/img/blog/nome.jpg)`. Comprimile prima di caricarle.
- `date` è la data di pubblicazione: un articolo con una data futura non compare finché quella data non arriva (al primo push successivo).

## Anteprima in locale

Serve [Node.js](https://nodejs.org/) 22.23 o successivo (consigliato: 24 LTS). Dalla cartella del repository:

```sh
npm install
npm run dev
```

poi apri http://localhost:4321. Le modifiche si aggiornano in tempo reale, e gli errori nei file di eventi e articoli compaiono direttamente nel browser. `npm run build` esegue lo stesso controllo della pull request.

## Struttura del progetto

```
astro.config.mjs              configurazione (lingue, sitemap, evidenziazione del codice)
src/content.config.ts         schemi di articoli, eventi e workshop
src/content/blog/             articoli del blog (Markdown)
src/data/events.json          eventi
src/data/workshops.json       poster dei workshop passati
src/config.ts                 link usati nel sito (GitHub, WhatsApp, modulo per i talk)
src/i18n/ui.ts                testi della homepage in italiano e inglese
src/pages/                    una pagina per file: / , /en/ , /blog/ , articoli, feed RSS
src/components/               parti riutilizzabili (head, sezioni, anteprima articolo)
src/components/home/          sezioni della homepage
src/layouts/BlogLayout.astro  struttura delle pagine del blog
src/lib/blog.ts               funzioni per gli articoli (URL, date, tempo di lettura)
public/                       file copiati così come sono
  assets/css/site.css         stili condivisi
  assets/css/blog.css         stili del blog
  assets/js/site.js           homepage: sfondo animato, evento, lightbox
  assets/js/page.js           pagine del blog: cambio tema
  workshops/                  immagini dei poster
.github/workflows/deploy.yml  build e pubblicazione su GitHub Pages
```

La homepage esiste in italiano (`/`) e inglese (`/en/`). Per aggiungere o modificare un testo, aggiorna entrambe le lingue in `src/i18n/ui.ts`: se una chiave manca in una lingua, l'editor lo segnala.
