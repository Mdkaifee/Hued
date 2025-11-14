import {I18n} from 'i18n-js';
import {getLocales} from 'react-native-localize';

import en from './en/en.json';
import nl from './nl/nl.json';

const i18n = new I18n({
  ...en,
  ...nl,
});

i18n.defaultLocale = 'en';
i18n.locale = getLocales()[0].languageCode;
i18n.fallbacks = true;
i18n.translations = {en, nl};

export default i18n;
