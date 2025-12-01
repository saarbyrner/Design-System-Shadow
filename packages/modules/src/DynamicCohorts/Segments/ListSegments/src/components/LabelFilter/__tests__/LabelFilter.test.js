import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { useGetAllLabelsQuery } from '@kitman/modules/src/OrganisationSettings/src/components/DynamicCohorts/ManageLabels/redux/services/labelsApi';
import {
  storeFake,
  renderTestComponent,
} from '@kitman/modules/src/DynamicCohorts/shared/testUtils';
import { getInitialState } from '@kitman/modules/src/DynamicCohorts/Segments/ListSegments/redux/slices/manageSegmentsSlice';
import LabelFilter from '../LabelFilter';

jest.mock(
  '@kitman/modules/src/OrganisationSettings/src/components/DynamicCohorts/ManageLabels/redux/services/labelsApi'
);

describe('<LabelFilter />', () => {
  const props = {
    t: i18nextTranslateStub(),
  };
  const defaultStore = storeFake({
    manageSegmentsSlice: getInitialState(),
  });

  beforeEach(() => {
    useGetAllLabelsQuery.mockReturnValue({
      data: [],
      isSuccess: true,
    });
  });

  it('renders the filter', async () => {
    renderTestComponent(defaultStore, <LabelFilter {...props} />);

    expect(await screen.findByText('Athlete labels')).toBeInTheDocument();
  });
});
