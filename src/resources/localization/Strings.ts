import LocalizedStrings from 'react-native-localization';
// tslint:disable-next-line: no-var-requires
const arStrings = require('./ar.json');
// tslint:disable-next-line: no-var-requires
const englishStrings = require('./en.json');
export const Strings = new LocalizedStrings({
  en: englishStrings,
  ar: arStrings,
});
