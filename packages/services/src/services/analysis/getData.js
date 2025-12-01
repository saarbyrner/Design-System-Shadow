// @flow
import { axios } from '@kitman/common/src/utils/services';
import type {
  ChartElement,
  ChartType,
  ValueDataShape,
  SummaryValueDataShape,
  GroupedSummaryValueDataShape,
} from '@kitman/modules/src/analysis/shared/types/charts';

export type RequestPayload = {
  name?: string,
  chart_id?: number,
  id: number | string,
  chart_type: ChartType,
  chart_elements: ChartElement[],
};

type ResponseShape<ChartT> = {
  id: number | string,
  chart: ChartT,
  overlays: Object | null,
  metadata: {
    unit: ?string,
  },
};

type ValueResponse = ResponseShape<ValueDataShape>;
type SummaryValueResponse = ResponseShape<SummaryValueDataShape>;
type GroupedSummaryValueResponse = ResponseShape<GroupedSummaryValueDataShape>;

type GetDataResponse =
  | ValueResponse
  | SummaryValueResponse
  | GroupedSummaryValueResponse;

const getData = async (params: RequestPayload): Promise<GetDataResponse> => {
  const urlParams = new URLSearchParams();
  urlParams.append('id', String(params.id));

  // Appending name to url so we can identify the request when debugging
  if (params.name) urlParams.append('name', params.name);

  const response = await axios.post(
    `/reporting/charts/preview?${urlParams.toString()}`,
    params,
    {
      timeout: 0, // leaving BE handle the timeout here
    }
  );
  return response;
};

export default getData;
