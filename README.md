# Sittie
Mobilní Expo aplikace, která ti pomůže zjistit, na které straně trasy máš sedět, aby ti (ne)svítilo slunce. Vyhledá start i cíl přes OpenStreetMap, vykreslí trasu na mapě, spočítá azimut slunce a uloží poslední dotazy do historie. 

## Funkce
- Vyhledání startu/cíle s našeptávačem (Nominatim OpenStreetMap).
- GPS tlačítko pro rychlé nastavení „Moje poloha“.
- Mapový náhled s markery, polyline a automatickým zarámováním trasy.
- Výpočet směru trasy a rozdílu proti azimutu slunce: textově řekne, zda sedět nalevo/napravo a jestli je den nebo noc.
- Lokální historie posledních 20 hledání (AsyncStorage).
- Přepínač světlý/tmavý režim a vymazání historie s potvrzením.

## Rychlý start
1) Nainstaluj závislosti  
```bash
npm install
```
2) Spusť vývojový server  
```bash
npx expo start
```
3) Otevři aplikaci v Expo Go (telefon), emulátoru nebo simulátoru dle nabídky v konzoli.

## Požadavky
- Node.js 18+ a npm
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (automaticky při `npx expo start`)
- Mobil s podporou Expo Go nebo nastavený emulátor/simulátor
- Povolení přístupu k poloze pro funkci GPS

## Architektura
- `app/index.tsx` – hlavní obrazovka: vyhledávání, mapa, výpočet azimutu slunce vs. směr trasy.
- `app/history.tsx` – seznam posledních 20 hledání uložených v `@history` (AsyncStorage).
- `app/settings.tsx` – přepnutí dark/light theme, mazání historie s potvrzením.
- `components/theme.tsx` – ThemeProvider, perzistence v `@theme`.
- `components/UserKolecko.tsx` – vizualizace aktuální polohy uživatele na mapě.

## API a data
- Geokódování: veřejné rozhraní Nominatim (OpenStreetMap) – vyžaduje připojení k internetu. V dotazech se posílá hlavička `User-Agent`.
- Astronomie: balíček `suncalc` pro výpočet polohy slunce.
- Ukládání: `@react-native-async-storage/async-storage` pro historii a téma.

## Skripty npm
- `npm start` – spustí Metro bundler / Expo DevTools.
- `npm run android` / `npm run ios` – build + spuštění na emulátoru (po nastavení prostředí).
- `npm run web` – webová verze.
- `npm run lint` – ESLint kontrola.

## Poznámky
- Aplikace je demonstrativní: neprovádí routing ani přesné plánování tras, jen spojí dva body a vyhodnotí polohu slunce vůči přímé linii.
- Historie a téma zůstávají lokálně na zařízení; nic se neposílá na vlastní servery.  

Potřebuješ doplnit anglickou verzi nebo build instrukce pro produkci? 
