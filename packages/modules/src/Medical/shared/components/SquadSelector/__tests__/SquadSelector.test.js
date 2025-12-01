import { render, screen } from '@testing-library/react';
import selectEvent from 'react-select-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { useGetPermittedSquadsQuery } from '@kitman/modules/src/Medical/shared/redux/services/medical';
import { useLazyGetAthleteDataQuery } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import SquadSelector from '@kitman/modules/src/Medical/shared/components/SquadSelector';

jest.mock('@kitman/modules/src/Medical/shared/redux/services/medical');
jest.mock('@kitman/modules/src/Medical/shared/redux/services/medicalShared');

const mockOnChange = jest.fn();
const mockGetAthleteData = jest.fn();

const defaultProps = {
  label: 'Occurred in Squad',
  athleteId: 1,
  value: null,
  onChange: mockOnChange,
  isInvalid: false,
  isOpen: false,
  requestStatus: 'SUCCESS',
  t: i18nextTranslateStub(),
};

const renderComponent = (props = defaultProps) =>
  render(<SquadSelector {...props} />);

describe('<SquadSelector />', () => {
  beforeEach(() => {
    mockOnChange.mockClear();
    mockGetAthleteData.mockClear();

    useGetPermittedSquadsQuery.mockReturnValue({
      data: [
        { id: 1, name: 'First Squad' },
        { id: 2, name: 'Second Squad' },
      ],
      isLoading: false,
      isSuccess: true,
    });
    useLazyGetAthleteDataQuery.mockReturnValue([
      mockGetAthleteData,
      {
        data: {
          squad_names: [
            { id: 1, name: 'First Squad' },
            { id: 2, name: 'Second Squad' },
            { id: 3, name: 'Third Squad' },
          ],
        },
        isFetching: false,
        status: 'fulfilled',
      },
    ]);
  });

  it('renders correctly', async () => {
    renderComponent();

    const squadSelector = screen.getByLabelText('Occurred in Squad');

    expect(squadSelector).toBeInTheDocument();

    expect(mockOnChange).toHaveBeenCalledTimes(0);

    selectEvent.openMenu(squadSelector);

    expect(screen.getByText('First Squad')).toBeInTheDocument();
    expect(screen.getByText('Second Squad')).toBeInTheDocument();

    await selectEvent.select(screen.getByText('Second Squad'), 'Second Squad');

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(2);
  });

  it('pre-populates correctly when there is a single athlete squad', async () => {
    useLazyGetAthleteDataQuery.mockReturnValue([
      mockGetAthleteData,
      {
        data: {
          squad_names: [{ id: 2, name: 'Second Squad' }],
        },
        isFetching: false,
        status: 'fulfilled',
      },
    ]);

    // Set isOpen to true for pre-population to occur
    renderComponent({ ...defaultProps, prePopulate: true, isOpen: true });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(2);
  });

  it('pre-populates correctly when there is a single user squad', async () => {
    useGetPermittedSquadsQuery.mockReturnValue({
      data: [{ id: 3, name: 'Third Squad' }],
      isLoading: false,
      isSuccess: true,
    });

    // Set isOpen to true for pre population to occur
    renderComponent({ ...defaultProps, prePopulate: true, isOpen: true });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(3);
  });

  it('does not pre-populate when there is a single athlete squad but not a permitted squad', async () => {
    useGetPermittedSquadsQuery.mockReturnValue({
      data: [
        { id: 1, name: 'First Squad' },
        { id: 2, name: 'Second Squad' },
      ],
      isLoading: false,
      isSuccess: true,
    });
    useLazyGetAthleteDataQuery.mockReturnValue([
      mockGetAthleteData,
      {
        data: {
          squad_names: [{ id: 3, name: 'Third Squad' }],
        },
        isFetching: false,
        status: 'fulfilled',
      },
    ]);

    // Set isOpen to true for pre population to occur
    renderComponent({ ...defaultProps, prePopulate: true, isOpen: true });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(null);
  });

  it('does not pre-populate if the prePopulate prop = false', async () => {
    useLazyGetAthleteDataQuery.mockReturnValue([
      mockGetAthleteData,
      {
        data: {
          squad_names: [{ id: 2, name: 'Second Squad' }],
        },
        isFetching: false,
        status: 'fulfilled',
      },
    ]);

    renderComponent({ ...defaultProps, prePopulate: false, isOpen: true });

    expect(mockOnChange).toHaveBeenCalledTimes(0);
  });

  describe('dropdown pre poulation logic based on the isOpen prop', () => {
    beforeEach(() => {
      useLazyGetAthleteDataQuery.mockReturnValue([
        mockGetAthleteData,
        {
          data: {
            squad_names: [{ id: 2, name: 'Second Squad' }],
          },
          isFetching: false,
          status: 'fulfilled',
        },
      ]);
    });

    it('does not pre-populate when isOpen is false, even if prePopulate is true', () => {
      // Render with prePopulate set to true, but isOpen is false (from defaultProps)
      renderComponent({ ...defaultProps, prePopulate: true });

      // The pre-population effect should not run because isOpen is false
      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('pre-populates correctly when the component re-renders with isOpen changing to true', () => {
      const { rerender } = renderComponent({
        ...defaultProps,
        prePopulate: true,
        isOpen: false,
      });

      // Nothing has happened yet
      expect(mockOnChange).not.toHaveBeenCalled();

      // Simulate the parent component (e.g., the side panel) opening
      // by re-rendering the component with isOpen: true
      rerender(<SquadSelector {...defaultProps} prePopulate isOpen />);

      // Now that isOpen is true, the effect should have run and called onChange
      expect(mockOnChange).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalledWith(2);
    });
  });
});
