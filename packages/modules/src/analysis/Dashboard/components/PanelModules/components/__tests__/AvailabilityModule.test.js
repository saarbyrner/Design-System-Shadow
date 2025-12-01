import i18n from 'i18next';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VirtuosoMockContext } from 'react-virtuoso';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { useGetAvailabilityTypeOptionsQuery } from '@kitman/modules/src/analysis/Dashboard/redux/services/dashboard';

import AvailabilityModule from '../AvailabilityModule';

jest.mock('@kitman/modules/src/analysis/Dashboard/redux/services/dashboard');

describe('<AvailabilityModule />', () => {
  const user = userEvent.setup();
  const i18nT = i18nextTranslateStub(i18n);
  const props = {
    hideColumnTitle: false,
    calculation: '',
    title: '',
    selectedAvailabilityStatus: null,
    onSetAvailabilitySource: jest.fn(),
    onSetCalculation: jest.fn(),
    onSetTitle: jest.fn(),
    t: i18nT,
  };

  const mockAvailabilityTypeOptions = [
    {
      status: 'available',
      label: 'Available',
      children: [
        {
          status: 'available_injured',
          label: 'Available (Injured)',
          children: [
            {
              status: 'status_2',
              label: 'Not affecting availability (medical attention)',
            },
          ],
        },
      ],
    },
    {
      status: 'unavailable',
      label: 'Unavailable',
      children: [
        { status: 'status_1', label: 'Causing unavailability (time-loss)' },
        { status: 'absent', label: 'Absent' },
      ],
    },
  ];

  beforeEach(() => {
    useGetAvailabilityTypeOptionsQuery.mockReturnValue({
      data: mockAvailabilityTypeOptions,
      isFetching: false,
    });
  });
  describe('for the availabilitySource source field', () => {
    it('renders the activity source Select component', () => {
      render(<AvailabilityModule {...props} />);
      expect(screen.getByLabelText('Availability Source')).toBeInTheDocument();
    });

    it('has the correct options', async () => {
      render(
        <VirtuosoMockContext.Provider
          value={{ viewportHeight: 10000, itemHeight: 50 }}
        >
          <AvailabilityModule {...props} />
        </VirtuosoMockContext.Provider>
      );
      await userEvent.click(screen.getByLabelText('Availability Source'));

      mockAvailabilityTypeOptions.forEach(({ label, children }) => {
        // top level labels show up twice - once as an option, and once as a group header
        expect(screen.getAllByText(label).length).toEqual(2);
        children.forEach(({ label: childLabel }) => {
          expect(screen.getByText(childLabel)).toBeInTheDocument();
        });
      });
    });

    it('calls the onSetAvailabilitySource prop with the correct data when Select is changed', async () => {
      render(
        <VirtuosoMockContext.Provider
          value={{ viewportHeight: 10000, itemHeight: 50 }}
        >
          <AvailabilityModule {...props} />
        </VirtuosoMockContext.Provider>
      );
      await userEvent.click(screen.getByLabelText('Availability Source'));
      await userEvent.click(
        screen.getByText(mockAvailabilityTypeOptions[0].children[0].label)
      );

      expect(props.onSetAvailabilitySource).toHaveBeenCalledWith(
        mockAvailabilityTypeOptions[0].children[0].status,
        mockAvailabilityTypeOptions[0].children[0].label
      );
    });
  });

  describe('for the calculation field', () => {
    it('renders a Select component', () => {
      render(<AvailabilityModule {...props} />);
      expect(screen.getByLabelText('Calculation')).toBeInTheDocument();
    });

    it('renders the correct options', async () => {
      render(<AvailabilityModule {...props} />);
      await userEvent.click(screen.getByLabelText('Calculation'));

      expect(screen.getByText('Count')).toBeInTheDocument();
      expect(screen.getByText('Proportion')).toBeInTheDocument();
      expect(screen.getByText('Percentage')).toBeInTheDocument();
    });

    it('calls the onSetCalculation prop when changed', async () => {
      render(<AvailabilityModule {...props} />);
      await userEvent.click(screen.getByLabelText('Calculation'));
      await userEvent.click(screen.getByText('Percentage'));

      expect(props.onSetCalculation).toHaveBeenCalledWith('percentage');
    });
  });

  describe('for the Column Title field', () => {
    it('renders an InputText component', () => {
      render(<AvailabilityModule {...props} />);
      expect(screen.getByLabelText('Column Title')).toBeInTheDocument();
    });

    it('calls onSetColumnTitle with the new text input value', async () => {
      render(<AvailabilityModule {...props} />);

      const title = screen.getByLabelText('Column Title');
      await user.type(title, 'T');

      expect(props.onSetTitle).toHaveBeenCalledWith('T');
    });
  });
});
