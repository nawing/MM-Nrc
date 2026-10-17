"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MMNrc = void 0;
const nrc_json_1 = __importDefault(require("./data/nrc.json"));
const data = nrc_json_1.default;
const MM_NUMBERS = ['၀', '၁', '၂', '၃', '၄', '၅', '၆', '၇', '၈', '၉'];
const EN_NUMBERS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const NRC_TYPES = {
    en: [
        { code: 'N', name: 'Citizen' },
        { code: 'E', name: 'Guest Citizen' },
        { code: 'P', name: 'Naturalized Citizen' },
        { code: 'A', name: 'Temporary' },
        { code: 'F', name: 'Foreigner' },
        { code: 'T', name: 'Special' },
    ],
    mm: [
        { code: 'နိုင်', name: 'နိုင်ငံသား' },
        { code: 'ဧည့်', name: 'ဧည့်နိုင်ငံသား' },
        { code: 'ပြု', name: 'နိုင်ငံသားပြုခွင့်ရသူ' },
        { code: 'အ', name: 'ယာယီ' },
        { code: 'ဖ', name: 'နိုင်ငံခြားသား' },
        { code: 'သ', name: 'သာသနာဝင်' },
    ]
};
// Dictionaries for fast Type lookups
const TYPE_MM_TO_EN = { 'နိုင်': 'N', 'ဧည့်': 'E', 'ပြု': 'P', 'အ': 'A', 'ဖ': 'F', 'သ': 'T' };
const TYPE_EN_TO_MM = { 'N': 'နိုင်', 'E': 'ဧည့်', 'P': 'ပြု', 'A': 'အ', 'F': 'ဖ', 'T': 'သ' };
class MMNrc {
    lang;
    mmToEnTownship = new Map();
    enToMmTownship = new Map();
    constructor(options) {
        this.lang = options?.lang || 'en';
        this.initializeTownshipMaps();
    }
    /**
     * Pre-computes township maps for fast formatting lookups O(1)
     */
    initializeTownshipMaps() {
        data.forEach(item => {
            this.mmToEnTownship.set(item.township_code_mm, item.township_code_en);
            // Ensure EN keys are uppercase for safe matching
            this.enToMmTownship.set(item.township_code_en.toUpperCase(), item.township_code_mm);
        });
    }
    /**
     * Updates the active language setting
     */
    setLanguage(lang) {
        this.lang = lang;
    }
    /**
     * Loads all unique State Codes (1 to 14)
     */
    loadStates() {
        const uniqueStates = new Map();
        data.forEach(item => {
            if (!uniqueStates.has(item.state_code)) {
                uniqueStates.set(item.state_code, {
                    code: this.lang === 'mm' ? this.engToMmNum(item.state_code) : item.state_code,
                    name: this.lang === 'mm' ? item.state_mm : item.state_en
                });
            }
        });
        return Array.from(uniqueStates.values()).sort((a, b) => {
            const numA = parseInt(this.mmToEngNum(a.code));
            const numB = parseInt(this.mmToEngNum(b.code));
            return numA - numB;
        });
    }
    /**
     * Loads townships associated with a specific state code
     * @param stateCode e.g., '1', '12', or '၁၂'
     */
    loadCode(stateCode) {
        const normalizedStateCode = this.mmToEngNum(String(stateCode));
        const townships = data.filter(item => item.state_code === normalizedStateCode);
        return townships.map(item => ({
            code: this.lang === 'mm' ? item.township_code_mm : item.township_code_en,
            name: this.lang === 'mm' ? item.township_mm : item.township_en
        }));
    }
    /**
     * Loads citizenship types
     */
    loadTypes() {
        return NRC_TYPES[this.lang];
    }
    /**
     * Parses an NRC string into its component parts
     * @param nrcString Any full NRC string (e.g., "12/KMR(N)123456" or "၁၂/ကမရ(နိုင်)၁၂၃၄၅၆")
     */
    parseNrc(nrcString) {
        const cleanStr = nrcString.replace(/\s+/g, '');
        // Regex captures: 1: State, 2: Township, 3: Type, 4: Number
        const regex = /^([0-9၁-၉]{1,2})\/([a-zA-Z]+|[\u1000-\u109F]+)\(([a-zA-Z]+\vert{}[\u1000-\u109F]+)\)([0-9၁-၉]{6})$/;
        const match = cleanStr.match(regex);
        if (!match) {
            throw new Error(`Invalid NRC format provided: ${nrcString}`);
        }
        return {
            state: match[1],
            township: match[2],
            type: match[3],
            number: match[4]
        };
    }
    /**
     * Converts a full NRC string into the target language format: State/Township(Type)Number
     * @param nrcString The source NRC string
     * @param targetLang Optional override for the output language (defaults to class instance language)
     */
    formatNrc(nrcString, targetLang) {
        const lang = targetLang || this.lang;
        const parts = this.parseNrc(nrcString);
        if (lang === 'en') {
            const state = this.mmToEngNum(parts.state);
            const township = this.mmToEnTownship.get(parts.township) || parts.township.toUpperCase();
            const type = TYPE_MM_TO_EN[parts.type] || parts.type.toUpperCase();
            const number = this.mmToEngNum(parts.number);
            return `${state}/${township}(${type})${number}`;
        }
        else {
            const state = this.engToMmNum(parts.state);
            const township = this.enToMmTownship.get(parts.township.toUpperCase()) || parts.township;
            const type = TYPE_EN_TO_MM[parts.type.toUpperCase()] || parts.type;
            const number = this.engToMmNum(parts.number);
            return `${state}/${township}(${type})${number}`;
        }
    }
    /**
     * Converts English digits to Myanmar digits
     */
    engToMmNum(str) {
        return str.replace(/[0-9]/g, (match) => MM_NUMBERS[parseInt(match)]);
    }
    /**
     * Converts Myanmar digits to English digits
     */
    mmToEngNum(str) {
        return str.replace(/[၀-၉]/g, (match) => EN_NUMBERS[MM_NUMBERS.indexOf(match)]);
    }
}
exports.MMNrc = MMNrc;
// Ensure the types are exported for consumers
__exportStar(require("./types"), exports);
