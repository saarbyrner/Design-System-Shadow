import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  useGetPermissionsQuery,
  useGetAllGroupsQuery,
  useGetAllLabelsQuery,
} from '@kitman/modules/src/analysis/Dashboard/redux/services/dashboard';
import { data as segmentData } from '@kitman/services/src/mocks/handlers/analysis/groups';
import { data as labelData } from '@kitman/services/src/mocks/handlers/analysis/labels';
import ExtendedPopulationSelector from '..';

jest.mock('@kitman/modules/src/analysis/Dashboard/redux/services/dashboard');
describe('<ExtendedPopulationSelector />', () => {
  const i18nT = i18nextTranslateStub();
  const mockProps = {
    updateSquad: jest.fn(),
    squadId: null,
    t: i18nT,
  };

  beforeEach(() => {
    useGetPermissionsQuery.mockReturnValue({
      data: { analysis: { labelsAndGroups: { canReport: true } } },
      isSuccess: true,
    });
    useGetAllGroupsQuery.mockReturnValue({
      data: segmentData,
    });
    useGetAllLabelsQuery.mockReturnValue({
      data: labelData,
    });
  });

  test('renders ExtendedPopulationSelector and its tabs', () => {
    render(<ExtendedPopulationSelector {...mockProps} />);

    expect(screen.getByText('Athlete Groups')).toBeInTheDocument();
    expect(screen.getByText('Athlete Labels')).toBeInTheDocument();
    // Tab name and active squad label respectively.
    expect(screen.getAllByText('Squads').length).toEqual(2);
  });

  it('does not show labels and groups tabs if permission is false', () => {
    useGetPermissionsQuery.mockReturnValue({
      data: { analysis: { labelsAndGroups: { canReport: false } } },
      isSuccess: true,
    });

    render(<ExtendedPopulationSelector {...mockProps} />);

    expect(screen.queryByText('Athlete Groups')).not.toBeInTheDocument();
    expect(screen.queryByText('Athlete Labels')).not.toBeInTheDocument();
    // Tab name and active squad label respectively.
    expect(screen.getAllByText('Squads').length).toEqual(2);
  });
});
