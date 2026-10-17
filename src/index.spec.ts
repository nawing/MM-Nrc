import {beforeEach, describe, expect, it} from 'bun:test';
import {MMNrc} from './index';

describe('MMNrc Package', () => {
  let mmnrc: MMNrc;

  beforeEach(() => {
    mmnrc = new MMNrc({lang: 'en'});
  });

  it('1. should accurately convert English numbers to Myanmar numbers', () => {
    const result = mmnrc.engToMmNum('0123456789');
    expect(result).toBe('၀၁၂၃၄၅၆၇၈၉');
  });

  it('2. should accurately convert Myanmar numbers to English numbers', () => {
    const result = mmnrc.mmToEngNum('၀၁၂၃၄၅၆၇၈၉');
    expect(result).toBe('0123456789');
  });

  it('3. should parse a standard English NRC into its correct components', () => {
    // Using real data: 1/KAPATA(N)123456
    const parsed = mmnrc.parseNrc('1/KAPATA(N)123456');
    expect(parsed).toEqual({
      state: '1',
      township: 'KAPATA',
      type: 'N',
      number: '123456'
    });
  });

  it('4. should successfully parse a Myanmar NRC even if the user typed spaces', () => {
    // Using real data: ၁/ကပတ(နိုင်)၁၂၃၄၅၆
    const parsed = mmnrc.parseNrc('၁ / ကပတ ( နိုင် ) ၁၂၃၄၅၆');
    expect(parsed).toEqual({
      state: '၁',
      township: 'ကပတ',
      type: 'နိုင်',
      number: '၁၂၃၄၅၆'
    });
  });

  it('5. should parse NRCs with long township codes (e.g., 6+ letters)', () => {
    const parsed = mmnrc.parseNrc('1/KAPATA(N)123456');
    expect(parsed).toEqual({
      state: '1',
      township: 'KAPATA', // 6 letters
      type: 'N',
      number: '123456'
    });
  });

  it('6. should convert a valid English NRC completely into Myanmar format', () => {
    mmnrc.setLanguage('mm');
    const result = mmnrc.formatNrc('1/KAPATA(N)123456');
    // KAPATA accurately maps to ကပတ based on your dataset
    expect(result).toBe('၁/ကပတ(နိုင်)၁၂၃၄၅၆');
  });

  it('7. should convert a valid Myanmar NRC completely into English format', () => {
    const result = mmnrc.formatNrc('၁/ကပတ(နိုင်)၁၂၃၄၅၆', 'en');
    expect(result).toBe('1/KAPATA(N)123456');
  });

  it('8. should throw an error when provided an invalid NRC format', () => {
    expect(() => {
      mmnrc.parseNrc('Invalid_NRC_String');
    }).toThrow('Invalid NRC format provided');

    expect(() => {
      mmnrc.parseNrc('/KAPATA(N)123456');
    }).toThrow();
  });

  it('9. should load all 14 unique states correctly', () => {
    const states = mmnrc.loadStates();
    expect(states.length).toBeGreaterThanOrEqual(14);
    expect(states[0]).toHaveProperty('code');
    expect(states[0]).toHaveProperty('name');
  });

  it('10. should load townships for a specific state, handling both EN and MM inputs', () => {
    const englishInputTownships = mmnrc.loadCode('1');
    const myanmarInputTownships = mmnrc.loadCode('၁');

    expect(englishInputTownships.length).toBeGreaterThan(0);
    expect(englishInputTownships.length).toBe(myanmarInputTownships.length);
    expect(englishInputTownships[0]).toHaveProperty('code');
    expect(englishInputTownships[0]).toHaveProperty('name');
  });
});
