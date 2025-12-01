// @flow
import type { FavoriteGroup } from '@kitman/services/src/services/favoriting';
import { rest } from 'msw';
import {
  exerciseFavorites as data,
  drugsNHSFavorites,
  drugsFDBFavorites,
  customDrugsFavorites,
  procedureTypesFavorites,
} from './data.mock';

const handler = rest.get('/user_favorites', (req, res, ctx) => {
  const query = req.url.searchParams;
  const favoriteType: FavoriteGroup = query.get('favorite_type');

  switch (favoriteType) {
    case 'procedure_types':
      return res(ctx.json(procedureTypesFavorites));

    case 'nhs_dmd_drugs':
      return res(ctx.json(drugsNHSFavorites));

    case 'fdb_dispensable_drugs':
      return res(ctx.json(drugsFDBFavorites));

    case 'custom_drugs':
      return res(ctx.json(customDrugsFavorites));

    case 'rehab_exercises':
      return res(ctx.json(data));

    default:
      return res(ctx.json(data));
  }
});

export { handler, data };
