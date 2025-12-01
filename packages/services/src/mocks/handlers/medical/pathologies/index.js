import { rest } from 'msw';
import { url as getBodyAreasUrl } from '@kitman/services/src/services/medical/pathologies/getBodyAreasMultiCodingV2';
import { url as getPathologiesUrl } from '@kitman/services/src/services/medical/pathologies/getPathologiesMultiCodingV2';
import { url as getPathologiesByIdsUrl } from '@kitman/services/src/services/medical/pathologies/getPathologiesByIds';

import bodyAreasData from '@kitman/services/src/mocks/handlers/medical/pathologies/data.mock';
import osiics15MockPathologies from '@kitman/services/src/mocks/handlers/medical/pathologies/osiics15Pathologies.mock';

const getBodyAreasMultiCodingV2Handler = rest.get(
  getBodyAreasUrl,
  (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(bodyAreasData));
  }
);

const filterPathologiesMultiCodingV2Data = (params) => {
  let data = osiics15MockPathologies;
  switch (params.codingSystem) {
    // Add coding system specific data here
    case 'OSIICS-15':
      data = osiics15MockPathologies;
      break;
    default:
      data = osiics15MockPathologies;
  }

  if (params.searchExpression) {
    const searchTerm = params.searchExpression.toLowerCase();
    const filteredResults = data.filter(
      (pathology) =>
        pathology.pathology.toLowerCase().includes(searchTerm) ||
        (pathology.code && pathology.code.toLowerCase().includes(searchTerm)) ||
        (searchTerm.toLowerCase() === 'leg' &&
          pathology.coding_system_body_region?.name === 'Lower limb')
    );

    return filteredResults;
  }

  return data;
};

const getPathologiesMultiCodingV2Handler = rest.get(
  getPathologiesUrl,
  (req, res, ctx) => {
    const codingSystem = req.url.searchParams.get('coding_system');
    const searchExpression = req.url.searchParams.get('search_expression');

    return res(
      ctx.json(
        filterPathologiesMultiCodingV2Data({ searchExpression, codingSystem })
      )
    );
  }
);

const getPathologiesByIdsHandler = rest.get(
  getPathologiesByIdsUrl,
  (req, res, ctx) => {
    let data = osiics15MockPathologies;

    const codingSystem = req.url.searchParams.get('coding_system');
    const idsParam = req.url.searchParams.get('ids');

    if (codingSystem) {
      switch (codingSystem) {
        case 'OSIICS-15':
          data = osiics15MockPathologies;
          break;
        default:
          data = osiics15MockPathologies;
      }
    }

    if (idsParam) {
      const ids = JSON.parse(idsParam);

      if (ids && ids.length > 0) {
        data = data.filter((pathology) => ids.includes(pathology.id));
      }
    }

    return res(ctx.status(200), ctx.json(data));
  }
);

export {
  getBodyAreasMultiCodingV2Handler,
  getPathologiesMultiCodingV2Handler,
  filterPathologiesMultiCodingV2Data,
  getPathologiesByIdsHandler,
  bodyAreasData,
  osiics15MockPathologies,
};
