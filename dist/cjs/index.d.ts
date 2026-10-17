import { Language, MMNrcOptions, NrcType, ParsedNrc, StateInfo, TownshipInfo } from './types';
export declare class MMNrc {
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
export * from './types';
