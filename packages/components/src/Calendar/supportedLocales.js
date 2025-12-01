// @flow
import de from '@fullcalendar/core/locales/de';
import enAU from '@fullcalendar/core/locales/en-au';
import enGB from '@fullcalendar/core/locales/en-gb';
import enNZ from '@fullcalendar/core/locales/en-nz';
import es from '@fullcalendar/core/locales/es';
import fr from '@fullcalendar/core/locales/fr';
import it from '@fullcalendar/core/locales/it';
import ja from '@fullcalendar/core/locales/ja';
import nl from '@fullcalendar/core/locales/nl';
import pl from '@fullcalendar/core/locales/pl';
import pt from '@fullcalendar/core/locales/pt';
import ptBR from '@fullcalendar/core/locales/pt-br';
import tr from '@fullcalendar/core/locales/tr';
import zhTW from '@fullcalendar/core/locales/zh-tw';

// These are the desired IP supported translations
// de, en (AU, IE, NZ and US), es, fr, it, ja, nl, pl, pt (BR and PT), tr and zh (TW)

// Import suitable full calendar locales
// NOTE: bellow are not present in core/locales
// en: believe is default though
// en-ie: adding en-gb instead
// en-us
// pt-PT: adding pt instead

const supportedLocales = [
  de,
  enAU,
  enGB,
  enNZ,
  es,
  fr,
  it,
  ja,
  nl,
  pl,
  pt,
  ptBR,
  tr,
  zhTW,
];

export default supportedLocales;
