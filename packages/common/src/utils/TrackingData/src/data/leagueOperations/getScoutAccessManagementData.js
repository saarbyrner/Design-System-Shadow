// @flow
import type {
  Product,
  ProductArea,
  Feature,
} from '@kitman/common/src/utils/TrackingData/src/types/leagueOperations';

type ScoutAccessTrackingData = {
  isBulkAction?: boolean,
  product?: Product,
  productArea?: ProductArea,
  feature?: Feature,
  isRequestedOnBehalfOf?: boolean,
};

export const getScoutAccessTrackingData = (
  props: ScoutAccessTrackingData
): {
  'Bulk Action'?: boolean,
  Product?: Product,
  'Product Area'?: ProductArea,
  Feature?: Feature,
  'Requested on behalf of'?: boolean,
} => {
  const data = {};

  if (props.isBulkAction !== undefined) {
    data['Bulk Action'] = props.isBulkAction;
  }

  if (props.product) {
    data.Product = props.product;
  }

  if (props.productArea) {
    data['Product Area'] = props.productArea;
  }

  if (props.feature) {
    data.Feature = props.feature;
  }

  if (props.isRequestedOnBehalfOf !== undefined) {
    data['Requested on behalf of'] = props.isRequestedOnBehalfOf;
  }

  return data;
};
