// @flow
import compact from 'lodash/compact';
import isEmpty from 'lodash/isEmpty';
import omitBy from 'lodash/omitBy';
import type { OrganisationFormat } from '@kitman/services/src/services/planning/getOrganisationFormats';
import type { Formation } from '@kitman/common/src/types/PitchView';
import type {
  EnrichedLineUpTemplate,
  LineUpTemplate,
  LineUpTemplateAuthor,
} from '@kitman/modules/src/PlanningEvent/src/services/lineUpTemplate';

export type AppliedFilter = {
  gameFormat: OrganisationFormat | null,
  formation: Formation | null,
  author: LineUpTemplateAuthor | null,
  query: string,
};

export const defaultAppliedFilters: AppliedFilter = {
  gameFormat: null,
  formation: null,
  author: null,
  query: '',
};

export const filterLineUps = (
  lineUps: EnrichedLineUpTemplate[] = [],
  filters: AppliedFilter
): EnrichedLineUpTemplate[] => {
  const cleanedFilters = omitBy(filters, isEmpty);
  const queryWords = cleanedFilters.query
    ? compact(cleanedFilters.query.toLowerCase().split(' '))
    : [];

  return lineUps.filter((lineUp) => {
    const { name, gameFormat, formation, author } = lineUp;
    const fullName = author.fullname ? author.fullname.toLowerCase() : '';

    return Object.keys(cleanedFilters).every((filterName) => {
      if (filterName === 'query') {
        return queryWords.some((word) => {
          return (
            name.toLowerCase().includes(word) ||
            gameFormat.name.toLowerCase().includes(word) ||
            formation.name.toLowerCase().includes(word) ||
            fullName.includes(word)
          );
        });
      }

      return filters[filterName].id === lineUp[filterName].id;
    });
  });
};

export const processLineUpsData = (
  lineUps: LineUpTemplate[] = [],
  gameFormats: OrganisationFormat[] = [],
  formations: Formation[] = []
): {
  gameFormats: OrganisationFormat[],
  formations: Formation[],
  authors: { [key: string | number]: LineUpTemplateAuthor },
  processedLineUps: EnrichedLineUpTemplate[],
} => {
  const gameFormatIds = new Set();
  const formationIds = new Set();
  const authors = {};

  const processedLineUps = [];

  lineUps.forEach((item) => {
    gameFormatIds.add(item.organisation_format_id);
    formationIds.add(item.formation_id);
    authors[item.author.id] = item.author;

    const foundGameFormat = gameFormats.find(
      (gameFormat) => gameFormat.id === item.organisation_format_id
    );
    const foundFormation = formations.find((f) => f.id === item.formation_id);

    if (foundGameFormat && foundFormation) {
      processedLineUps.push({
        ...item,
        gameFormat: foundGameFormat,
        formation: foundFormation,
      });
    }
  });

  return {
    gameFormats: gameFormats.filter((gameFormat) =>
      gameFormatIds.has(gameFormat.id)
    ),
    formations: formations.filter((gameFormat) =>
      formationIds.has(gameFormat.id)
    ),
    authors,
    processedLineUps,
  };
};
