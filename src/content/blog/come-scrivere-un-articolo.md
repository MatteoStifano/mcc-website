---
title: "Come scrivere un articolo per il blog MCC"
description: "Il blog è aperto a tutti i membri: basta un file Markdown e una pull request. Ecco come funziona, passo per passo."
date: 2026-11-22
author: Monopoli Coders Club
tags: [community, git, markdown]
---

Il blog del Monopoli Coders Club è scritto dai membri della community. Hai preparato un workshop, risolto un bug ostinato, provato un nuovo framework o scoperto un trucco che ti ha fatto risparmiare un'ora? È materiale perfetto per un articolo.

## Cosa pubblicare

Non serve scrivere un saggio. Funzionano bene:

- **Appunti di un workshop**: slide, link e il codice mostrato durante l'incontro.
- **Guide pratiche**: "come ho configurato X", "come fare Y in 10 minuti".
- **Post-mortem**: un problema reale, come l'hai debuggato e cosa hai imparato.
- **Recensioni**: un tool, una libreria, un libro, una conferenza.

Puoi scrivere in italiano o in inglese.

## Come funziona

Il sito è generato con [Astro](https://astro.build/), che trasforma i file Markdown in pagine, e pubblicato su GitHub Pages. Ogni articolo è un file nella cartella `src/content/blog/`.

1. Fai un fork del [repository](https://github.com/MatteoStifano/mcc-website).
2. Crea il tuo file in `src/content/blog/`, per esempio `src/content/blog/debug-con-playwright.md`. Il nome del file diventa l'indirizzo dell'articolo.
3. In cima al file aggiungi l'intestazione (il *front matter*):

```yaml
---
title: "Debug di test end-to-end con Playwright"
description: "Una frase che riassume l'articolo: appare nelle anteprime."
date: 2026-12-01
author: Nome Cognome
github: tuo-username-github
tags: [testing, playwright]
language: it   # oppure en
---
```

4. Sotto l'intestazione scrivi l'articolo in Markdown. I blocchi di codice vengono colorati automaticamente se indichi il linguaggio:

```python
def saluta(nome: str) -> str:
    return f"Ciao {nome}, benvenuto al MCC!"
```

5. Apri una pull request. Un controllo automatico verifica l'intestazione (campi mancanti o scritti male vengono segnalati per nome); poi qualcuno della community la rilegge e, una volta unita, l'articolo è online in un paio di minuti.

## Qualche consiglio

- **Un'idea per articolo.** Meglio due post brevi che uno lunghissimo.
- **Codice che funziona.** Se puoi, collega un repository o un gist completo.
- **Immagini leggere.** Mettile in `public/assets/img/blog/` e comprimile prima (ad esempio con [Squoosh](https://squoosh.app/)).

Tutti i dettagli sono nella [guida per contribuire](https://github.com/MatteoStifano/mcc-website/blob/main/CONTRIBUTING.md). Ci vediamo nel prossimo articolo, magari il tuo.
