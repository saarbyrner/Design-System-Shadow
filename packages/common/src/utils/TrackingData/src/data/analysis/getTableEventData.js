// @flow
import type {
  TableTypeEventParams,
  TableTypeEventData,
} from '@kitman/common/src/utils/TrackingData/src/types/analysis';

const getTableType = ({
  tableType,
}: TableTypeEventParams): TableTypeEventData => {
  return {
    tableType,
  };
};

export default getTableType;
