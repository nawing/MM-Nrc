# @mmpay/mm-nrc

A lightweight, zero-dependency TypeScript/JavaScript library for handling Myanmar National Registration Card (NRC) data.
Supports both CommonJS (CJS) and ECMAScript Modules (ESM) seamlessly.

## 🏆 Data Attribution
The internal NRC JSON dataset used in this package was created and made publicly available by **[chuuhtetnaing/myanmar-nrc-format-dataset](https://github.com/chuuhtetnaing/myanmar-nrc-format-dataset)**.

Full credit for the data scraping, compilation, and structure belongs to them. We built this package wrapper because we needed a highly reusable, ESM/CJS-supported utility with robust string conversion for our software development needs.

## Installation

```bash
# npm
npm install @mmpay/mm-nrc --save
# bun
bun add @mmpay/mm-nrc
```



## Usage

You can initialize the library and specify the output language (`'mm'` for Myanmar, `'en'` for English).

### ESM (Modern React, Vue, Next.js, Vite, Node 14+)
```javascript
import { MMNrc } from '@mmpay/mm-nrc';

const mmnrc = new MMNrc({ lang: 'mm' }); // Default output language

// Load all states (1 through 14)
const states = mmnrc.loadStates();
console.log(states);
// [{ code: '၁', name: 'ကချင်ပြည်နယ်' }, ... ]

// Load townships by state code
const townships = mmnrc.loadCode('1'); // Pass English '1' or Myanmar '၁'
console.log(townships);
// [{ code: 'ကပတ', name: 'ကန်ပိုက်တီ' }, ... ]
```

### Formatting & Converting NRCs

Convert any valid Myanmar or English NRC string into the opposite language natively.

```javascript
import { MMNrc } from '@mmpay/mm-nrc';

const mmnrc = new MMNrc({ lang: 'en' });

// Myanmar to English
const enNrc = mmnrc.formatNrc('၁၂/ကမရ(နိုင်)၁၂၃၄၅၆');
console.log(enNrc);
// Output: "12/KMR(N)123456"

// Override instance language on the fly (English to Myanmar)
const mmNrc = mmnrc.formatNrc('12/KMR(N)123456', 'mm');
console.log(mmNrc);
// Output: "၁၂/ကမရ(နိုင်)၁၂၃၄၅၆"

// Parse an NRC string into distinct parts
const parsed = mmnrc.parseNrc('12/KMR(N)123456');
console.log(parsed);
// { state: '12', township: 'KMR', type: 'N', number: '123456' }
```

### CJS (Legacy Node.js)
```javascript
const { MMNrc } = require('@mmpay/mm-nrc');

const mmnrc = new MMNrc({ lang: 'en' });

console.log(mmnrc.loadTypes());
// [{ code: 'N', name: 'Citizen' }, { code: 'E', name: 'Guest Citizen' }, ... ]
```

## Build Instructions

If you are cloning this repository and modifying the source:

```bash
npm run build
```

This generates a `dist` folder containing:
*   `index.js` (CommonJS build)
*   `index.mjs` (ESM build)
*   `index.d.ts` (TypeScript definitions)
