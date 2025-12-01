// @flow

import { withNamespaces } from 'react-i18next';

import { Accordion, Select } from '@kitman/components';
import { defaultMapToOptions } from '@kitman/components/src/Select/utils';
import type { Translation } from '@kitman/common/src/types/i18n';
import type { Competitions } from '@kitman/services/src/services/getCompetitions';
import type { Teams } from '@kitman/services/src/services/getTeams';
import {
  accordionOverrideStyles,
  createAccordionContentStyles,
} from './utils/styles';
import {
  useGetCompetitionsQuery,
  useGetOppositionsQuery,
} from './redux/services/filters';
import { useFilter } from './utils/hooks';
import { getGamesTranslatedTexts } from './utils/helpers';
import AccordionTitle from './AccordionTitle';

const accordionContent = createAccordionContentStyles({
  includeBorderBottom: false,
  rowGapRem: 1,
});

const Games = ({ t }: { t: Translation }) => {
  const { filter: competitionsFilter, setFilter: setCompetitionsFilter } =
    useFilter('competitions');
  const { filter: oppositionsFilter, setFilter: setOppositionsFilter } =
    useFilter('oppositions');
  const { filter: squadsFilter } = useFilter('squads');

  const {
    data: competitions = [],
    isError: competitionsIsError,
  }: { data: Competitions, isError: boolean } =
    useGetCompetitionsQuery(squadsFilter);
  const {
    data: oppositions = [],
    isError: oppositionsIsError,
  }: { data: Teams, isError: boolean } = useGetOppositionsQuery();

  const translations = getGamesTranslatedTexts(t);

  return (
    <Accordion
      title={
        <AccordionTitle
          translatedTitle={translations.title}
          numberOfActiveFilters={
            competitionsFilter.length + oppositionsFilter.length
          }
        />
      }
      isOpen
      overrideStyles={accordionOverrideStyles}
      content={
        <div css={accordionContent}>
          <Select
            label=""
            options={defaultMapToOptions(
              competitionsIsError ? [] : competitions
            )}
            value={competitionsFilter}
            onChange={setCompetitionsFilter}
            isMulti
            placeholder={translations.competitionsPlaceholder}
          />
          <Select
            label=""
            options={defaultMapToOptions(oppositionsIsError ? [] : oppositions)}
            value={oppositionsFilter}
            onChange={setOppositionsFilter}
            isMulti
            placeholder={translations.oppositionPlaceholder}
          />
        </div>
      }
    />
  );
};

export const GamesTranslated = withNamespaces()(Games);
export default Games;
