// @flow
import type {
  Product,
  ProductArea,
  Feature,
} from '@kitman/common/src/utils/TrackingData/src/types/leagueOperations';

type MatchMonitorTrackingData = {
  product?: Product,
  productArea?: ProductArea,
  feature?: Feature,
};

export const getMatchMonitorTrackingData = (
  props: MatchMonitorTrackingData = {}
): {
  Product?: Product,
  'Product Area'?: ProductArea,
  Feature?: Feature,
} => {
  const data = {};

  if (props.product) {
    data.Product = props.product;
  }

  if (props.productArea) {
    data['Product Area'] = props.productArea;
  }

  if (props.feature) {
    data.Feature = props.feature;
  }

  return data;
};

export default getMatchMonitorTrackingData;
