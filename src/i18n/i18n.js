import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from 'src/i18n/en.json'
import bg from 'src/i18n/bg.json'

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    bg: { translation: bg },
  },
  lng: 'bg',
  fallbackLng: 'bg',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n