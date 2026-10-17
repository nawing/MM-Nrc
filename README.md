# @mmpay/mm-nrc

A lightweight, zero-dependency TypeScript/JavaScript library for parsing, formatting, and handling Myanmar National Registration Card (NRC) data.

Built for modern web development, it natively supports both **ECMAScript Modules (ESM)** and **CommonJS (CJS)**.

---

## 🏆 Data Attribution
The internal NRC JSON dataset powering this package was created and made publicly available by **[chuuhtetnaing/myanmar-nrc-format-dataset](https://github.com/chuuhtetnaing/myanmar-nrc-format-dataset)**. Full credit for the data scraping and compilation belongs to them. We built this package to provide a highly reusable, ESM/CJS-supported utility with robust string conversion for Node/TypeScript ecosystems.

---

## Installation

```bash
npm install @mmpay/mm-nrc
# or
yarn add @mmpay/mm-nrc
# or
bun add @mmpay/mm-nrc
```

---

## 🚀 Quick Start

Initialize the library with your preferred default output language (`'mm'` for Myanmar, `'en'` for English).

```javascript
import { MMNrc } from '@mmpay/mm-nrc';

// Initialize with English as default
const mmnrc = new MMNrc({ lang: 'en' });
```

*(For legacy Node.js CJS, use: `const { MMNrc } = require('@mmpay/mm-nrc');`)*

---

## 📖 API Documentation

### 1. Parsing NRC Strings
Extract distinct components (State, Township, Type, Number) from any valid NRC string. It automatically ignores accidental spaces and accepts both English and Myanmar formats.

```javascript
const parsed = mmnrc.parseNrc('1/KAPATA(N)123456');

console.log(parsed);
/* Output:
{
  state: '1',
  township: 'KAPATA',
  type: 'N',
  number: '123456'
}
*/
```

### 2. Formatting & Language Conversion
Convert a full NRC string seamlessly between Myanmar and English formats. It maps the township codes instantly using O(1) dictionary lookups.

```javascript
// Convert Myanmar to English
const enNrc = mmnrc.formatNrc('၁/ကပတ(နိုင်)၁၂၃၄၅၆', 'en');
console.log(enNrc); // "1/KAPATA(N)123456"

// Convert English to Myanmar
const mmNrc = mmnrc.formatNrc('1/KAPATA(N)123456', 'mm');
console.log(mmNrc); // "၁/ကပတ(နိုင်)၁၂၃၄၅၆"
```

### 3. Number Translation
Standalone utilities to convert digits between languages.

```javascript
mmnrc.engToMmNum('0123456789'); // "၀၁၂၃၄၅၆၇၈၉"
mmnrc.mmToEngNum('၀၁၂၃၄၅၆၇၈၉'); // "0123456789"
```

### 4. Fetching Core Data
You can extract raw States, Townships, and Types directly from the dataset. The output language depends on how you initialized `MMNrc` (or you can switch it using `mmnrc.setLanguage('mm')`).

```javascript
// 1. Get all 14 States/Regions
const states = mmnrc.loadStates();
// [{ code: '1', name: 'Kachin' }, ... ]

// 2. Get Townships for a specific State (Accepts '1' or '၁')
const townships = mmnrc.loadCode('1');
// [{ code: 'KAPATA', name: 'Kan Yeik Ti' }, ... ]

// 3. Get NRC Types (Citizen, Guest Citizen, etc.)
const types = mmnrc.loadTypes();
// [{ code: 'N', name: 'Citizen' }, ... ]
```

---

## Build Instructions (For Contributors)

If you are cloning this repository to modify the source code, we use `tsup` for bundling and `bun` for testing.

```bash
# Build the package (Outputs to /dist)
npm run build

# Run the test suite
npm run test
```
