import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VirtuosoMockContext } from 'react-virtuoso';
import i18n from 'i18next';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { useGetParticipationTypeOptionsQuery } from '@kitman/modules/src/analysis/Dashboard/redux/services/dashboard';

import ParticipationModule from '../ParticipationModule';

jest.mock('@kitman/modules/src/analysis/Dashboard/redux/services/dashboard');

describe('<ParticipationModule />', () => {
  const i18nT = i18nextTranslateStub(i18n);
  const props = {
    hideColumnTitle: false,
    calculation: '',
    columnTitle: 'Test column title',
    selectedAvailabilityStatus: null,
    onSetCalculation: jest.fn(),
    onSetColumnTitle: jest.fn(),
    selectedIds: [],
    participationStatus: '',
    onSetParticipationIds: () => {},
    onSetParticipationStatus: jest.fn(),
    onSetParticipationEvent: jest.fn(),
    panelType: 'column',
    isPanelOpen: true,
    t: i18nT,
  };

  const mockData = {
    games: [{ id: 123, name: 'Full' }],
    sessions: [{ id: 246, name: 'Partial' }],
  };
  const baseOptions = [
    {
      value: 'participation_status',
      name: props.t('Participation Status'),
    },
    {
      value: 'participation_levels',
      name: props.t('Participation Level'),
    },
  ];

  beforeEach(() => {
    useGetParticipationTypeOptionsQuery.mockReturnValue({
      data: mockData,
      isFetching: false,
    });

    window.setFlag('rep-game-involvement', true);
  });

  describe('for the Participation field', () => {
    it('renders select', () => {
      render(<ParticipationModule {...props} />);
      expect(screen.getByLabelText('Participation')).toBeInTheDocument();
    });

    it('has the correct options', async () => {
      const user = userEvent.setup();
      render(
        <VirtuosoMockContext.Provider
          value={{ viewportHeight: 10000, itemHeight: 50 }}
        >
          <ParticipationModule {...props} />
        </VirtuosoMockContext.Provider>
      );
      await user.click(screen.getByLabelText('Participation'));

      baseOptions.forEach((item) => {
        expect(screen.getByText(item.name)).toBeInTheDocument();
      });
    });

    it('calls the onSetParticipationStatus prop with the correct data when Select is changed', async () => {
      const user = userEvent.setup();
      render(
        <VirtuosoMockContext.Provider
          value={{ viewportHeight: 10000, itemHeight: 50 }}
        >
          <ParticipationModule {...props} />
        </VirtuosoMockContext.Provider>
      );
      await user.click(screen.getByLabelText('Participation'));
      await user.click(screen.getByText('Participation Status'));
      expect(props.onSetParticipationStatus).toHaveBeenCalledWith(
        'participation_status'
      );
    });
  });

  describe('for the calculation field', () => {
    it('renders a Select component', () => {
      render(<ParticipationModule {...props} />);
      expect(screen.getByLabelText('Calculation')).toBeInTheDocument();
    });

    it('renders the correct options', async () => {
      const user = userEvent.setup();
      render(<ParticipationModule {...props} />);
      await user.click(screen.getByLabelText('Calculation'));

      expect(screen.getByText('Count')).toBeInTheDocument();
      expect(screen.getByText('Proportion')).toBeInTheDocument();
      expect(screen.getByText('Percentage')).toBeInTheDocument();
    });

    it('calls the onSetCalculation prop when changed', async () => {
      const user = userEvent.setup();
      render(<ParticipationModule {...props} />);
      await user.click(screen.getByLabelText('Calculation'));
      await user.click(screen.getByText('Percentage'));

      expect(props.onSetCalculation).toHaveBeenCalledWith('percentage');
    });
  });

  describe('for the Column Title field', () => {
    it('renders an InputText component', () => {
      render(
        <ParticipationModule {...props} columnTitle="Test column title" />
      );
      const titleInput = screen.getByLabelText('Column Title');
      expect(titleInput).toHaveDisplayValue('Test column title');
    });

    it('renders an InputText component with empty text when columnTitle null', () => {
      render(<ParticipationModule {...props} columnTitle={null} />);
      const titleInput = screen.getByLabelText('Column Title');
      expect(titleInput).toHaveDisplayValue('');
    });

    it('calls onSetColumnTitle with the new text input value', async () => {
      const user = userEvent.setup();
      render(<ParticipationModule {...props} columnTitle="" />);

      const title = screen.getByLabelText('Column Title');
      await user.type(title, 'T');

      expect(props.onSetColumnTitle).toHaveBeenCalledWith('T');
    });
  });

  describe('for the Participation field with game_involvement status', () => {
    it('renders select', () => {
      render(
        <ParticipationModule
          {...props}
          participationStatus="game_involvement"
        />
      );
      expect(screen.getByLabelText('Participation')).toBeInTheDocument();
    });

    it('has the correct options', async () => {
      const user = userEvent.setup();
      render(
        <VirtuosoMockContext.Provider
          value={{ viewportHeight: 10000, itemHeight: 50 }}
        >
          <ParticipationModule {...props} />
        </VirtuosoMockContext.Provider>
      );
      await user.click(screen.getByLabelText('Participation'));

      [
        ...baseOptions,
        {
          value: 'game_involvement',
          name: props.t('Game Involvement'),
        },
      ].forEach((item) => {
        expect(screen.getByText(item.name)).toBeInTheDocument();
      });
    });
  });

  it('has the correct Unit optios', async () => {
    const user = userEvent.setup();
    render(
      <VirtuosoMockContext.Provider
        value={{ viewportHeight: 10000, itemHeight: 50 }}
      >
        <ParticipationModule
          {...props}
          participationStatus="game_involvement"
        />
      </VirtuosoMockContext.Provider>
    );
    await user.click(screen.getByText('Participation'));
    await user.click(screen.getByText('Game Involvement'));
    expect(screen.getByText('Unit')).toBeInTheDocument();

    [
      {
        value: 'events',
        name: props.t('Number of events'),
      },
      {
        value: 'minutes',
        name: props.t('Minutes'),
      },
    ].forEach((item) => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
    });
  });
});
