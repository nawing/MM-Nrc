interface NrcData {
    state_code: string;
    township_code_mm: string;
    township_code_en: string;
    township_mm: string;
    township_en: string;
    state_en: string;
    state_mm: string;
    township?: string;
    wiki_township_mm?: string;
    wiki_township_en?: string;
}
type Language = 'en' | 'mm';
interface MMNrcOptions {
    lang?: Language;
}
interface StateInfo {
    code: string;
    name: string;
}
interface TownshipInfo {
    code: string;
    name: string;
}
interface NrcType {
    code: string;
    name: string;
}
interface ParsedNrc {
    state: string;
    township: string;
    type: string;
    number: string;
}

declare class MMNrc {
    private lang;
    private mmToEnTownship;
    private enToMmTownship;
    constructor(options?: MMNrcOptions);
    /**
     * Pre-computes township maps for fast formatting lookups O(1)
     */
    private initializeTownshipMaps;
    /**
     * Updates the active language setting
     */
    setLanguage(lang: Language): void;
    /**
     * Loads all unique State Codes (1 to 14)
     */
    loadStates(): StateInfo[];
    /**
     * Loads townships associated with a specific state code
     * @param stateCode e.g., '1', '12', or '၁၂'
     */
    loadCode(stateCode: string | number): TownshipInfo[];
    /**
     * Loads citizenship types
     */
    loadTypes(): NrcType[];
    /**
     * Parses an NRC string into its component parts
     * @param nrcString Any full NRC string (e.g., "12/KMR(N)123456" or "၁၂/ကမရ(နိုင်)၁၂၃၄၅၆")
     */
    parseNrc(nrcString: string): ParsedNrc;
    /**
     * Converts a full NRC string into the target language format: State/Township(Type)Number
     * @param nrcString The source NRC string
     * @param targetLang Optional override for the output language (defaults to class instance language)
     */
    formatNrc(nrcString: string, targetLang?: Language): string;
    /**
     * Converts English digits to Myanmar digits
     */
    engToMmNum(str: string): string;
    /**
     * Converts Myanmar digits to English digits
     */
    mmToEngNum(str: string): string;
}

export { type Language, MMNrc, type MMNrcOptions, type NrcData, type NrcType, type ParsedNrc, type StateInfo, type TownshipInfo };
