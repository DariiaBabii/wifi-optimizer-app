import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enJSON from './locales/en.json';
import uaJSON from './locales/ua.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enJSON },
      ua: { translation: uaJSON } 
    },
    lng: 'en', 
    fallbackLng: 'en', 
    
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;