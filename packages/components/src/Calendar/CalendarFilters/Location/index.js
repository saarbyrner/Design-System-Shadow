// @flow
import { css } from '@emotion/react';
import { useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import { Accordion } from '@kitman/components';

import type { Translation } from '@kitman/common/src/types/i18n';

import {
  accordionOverrideStyles,
  createAccordionContentStyles,
} from '../utils/styles';
import { getLocationTranslatedTexts } from '../utils/helpers';
import VenueTypes from './VenueTypes';
import LocationNames from './LocationNames';
import AccordionTitle from '../AccordionTitle';
import { getFilterFactory } from '../redux/selectors/filters';

const accordionContent = createAccordionContentStyles({
  includeBorderBottom: false,
});

const accordionContentComposition = [
  accordionContent,
  css({
    '.kitmanReactSelect__multi-value': {
      display: 'none',
    },
  }),
];

const Location = ({ t }: { t: Translation }) => {
  const { title, placeholder } = getLocationTranslatedTexts(t);
  const venueTypes = useSelector(getFilterFactory('venueTypes'));
  const locationNames = useSelector(getFilterFactory('locationNames'));

  return (
    <Accordion
      title={
        <AccordionTitle
          translatedTitle={title}
          numberOfActiveFilters={venueTypes.length + locationNames.length}
        />
      }
      isOpen
      overrideStyles={accordionOverrideStyles}
      content={
        <div css={accordionContentComposition}>
          <VenueTypes />
          <LocationNames placeholder={placeholder} />
        </div>
      }
    />
  );
};

export const LocationTranslated = withNamespaces()(Location);
export default Location;
