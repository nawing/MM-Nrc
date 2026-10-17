export interface NrcData {
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
export type Language = 'en' | 'mm';
export interface MMNrcOptions {
    lang?: Language;
}
export interface StateInfo {
    code: string;
    name: string;
}
export interface TownshipInfo {
    code: string;
    name: string;
}
export interface NrcType {
    code: string;
    name: string;
}
export interface ParsedNrc {
    state: string;
    township: string;
    type: string;
    number: string;
}
