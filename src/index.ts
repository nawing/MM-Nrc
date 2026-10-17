import nrcRawData from './data/nrc.json';
import {Language, MMNrcOptions, NrcData, NrcType, ParsedNrc, StateInfo, TownshipInfo} from './types';

const data = nrcRawData as NrcData[];

const MM_NUMBERS = ['၀', '၁', '၂', '၃', '၄', '၅', '၆', '၇', '၈', '၉'];
const EN_NUMBERS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

const NRC_TYPES = {
  en: [
    {code: 'N', name: 'Citizen'},
    {code: 'E', name: 'Guest Citizen'},
    {code: 'P', name: 'Naturalized Citizen'},
    {code: 'A', name: 'Temporary'},
    {code: 'F', name: 'Foreigner'},
    {code: 'T', name: 'Special'},
  ],
  mm: [
    {code: 'နိုင်', name: 'နိုင်ငံသား'},
    {code: 'ဧည့်', name: 'ဧည့်နိုင်ငံသား'},
    {code: 'ပြု', name: 'နိုင်ငံသားပြုခွင့်ရသူ'},
    {code: 'အ', name: 'ယာယီ'},
    {code: 'ဖ', name: 'နိုင်ငံခြားသား'},
    {code: 'သ', name: 'သာသနာဝင်'},
  ]
};

// Dictionaries for fast Type lookups
const TYPE_MM_TO_EN: Record<string, string> = {'နိုင်': 'N', 'ဧည့်': 'E', 'ပြု': 'P', 'အ': 'A', 'ဖ': 'F', 'သ': 'T'};
const TYPE_EN_TO_MM: Record<string, string> = {'N': 'နိုင်', 'E': 'ဧည့်', 'P': 'ပြု', 'A': 'အ', 'F': 'ဖ', 'T': 'သ'};

export class MMNrc {
  private lang: Language;
  private mmToEnTownship = new Map<string, string>();
  private enToMmTownship = new Map<string, string>();

  constructor(options?: MMNrcOptions) {
    this.lang = options?.lang || 'en';
    this.initializeTownshipMaps();
  }

  /**
   * Pre-computes township maps for fast formatting lookups O(1)
   */
  private initializeTownshipMaps() {
    data.forEach(item => {
      this.mmToEnTownship.set(item.township_code_mm, item.township_code_en);
      // Ensure EN keys are uppercase for safe matching
      this.enToMmTownship.set(item.township_code_en.toUpperCase(), item.township_code_mm);
    });
  }

  /**
   * Updates the active language setting
   */
  public setLanguage(lang: Language): void {
    this.lang = lang;
  }

  /**
   * Loads all unique State Codes (1 to 14)
   */
  public loadStates(): StateInfo[] {
    const uniqueStates = new Map<string, StateInfo>();

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
  public loadCode(stateCode: string | number): TownshipInfo[] {
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
  public loadTypes(): NrcType[] {
    return NRC_TYPES[this.lang];
  }

  /**
   * Parses an NRC string into its component parts
   * @param nrcString Any full NRC string (e.g., "12/KMR(N)123456" or "၁၂/ကမရ(နိုင်)၁၂၃၄၅၆")
   */
  public parseNrc(nrcString: string): ParsedNrc {
    const cleanStr = nrcString.replace(/\s+/g, '');
    // Updated Regex: Combined character classes to prevent copy-paste pipe (|) glitches
    // Captures: 1: State, 2: Township, 3: Type, 4: Number
    const regex = /^([0-9၁-၉]{1,2})\/([a-zA-Z\u1000-\u109F]+)\(([a-zA-Z\u1000-\u109F]+)\)([0-9၁-၉]{6})$/;
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
  public formatNrc(nrcString: string, targetLang?: Language): string {
    const lang = targetLang || this.lang;
    const parts = this.parseNrc(nrcString);

    if (lang === 'en') {
      const state = this.mmToEngNum(parts.state);
      const township = this.mmToEnTownship.get(parts.township) || parts.township.toUpperCase();
      const type = TYPE_MM_TO_EN[parts.type] || parts.type.toUpperCase();
      const number = this.mmToEngNum(parts.number);

      return `${state}/${township}(${type})${number}`;
    } else {
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
  public engToMmNum(str: string): string {
    return str.replace(/[0-9]/g, (match) => MM_NUMBERS[parseInt(match)]);
  }

  /**
   * Converts Myanmar digits to English digits
   */
  public mmToEngNum(str: string): string {
    return str.replace(/[၀-၉]/g, (match) => EN_NUMBERS[MM_NUMBERS.indexOf(match)]);
  }
}

// Ensure the types are exported for consumers
export * from './types';
