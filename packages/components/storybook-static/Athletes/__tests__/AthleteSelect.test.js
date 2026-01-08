/* eslint-disable jest/no-mocks-import */
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { data as segmentData } from '@kitman/services/src/mocks/handlers/analysis/groups';
import { data as labelData } from '@kitman/services/src/mocks/handlers/analysis/labels';
import selectEvent from 'react-select-event';
import mockSquadAthletes from '../__mocks__/squadAthletes';
import AthleteSelect from '../AthleteSelect';
import { EMPTY_SELECTION } from '../constants';

describe('Athletes | <AthleteSelect />', () => {
  const mockLabel = 'Players';
  const i18nT = i18nextTranslateStub();
  const props = {
    t: i18nT,
    placeholder: 'Select players...',
    value: [],
    squadAthletes: mockSquadAthletes.squads,
    labels: labelData,
    segments: segmentData,
    onChange: () => {},
  };

  it('renders correctly', () => {
    render(<AthleteSelect {...props} />);

    // the default label
    expect(screen.getByText('Athletes')).toBeInTheDocument();
  });

  it('renders a label when supplied', () => {
    render(<AthleteSelect {...props} label={mockLabel} />);

    // default label should be hidden
    expect(screen.queryByText('Athletes')).not.toBeInTheDocument();
    // custom label should show
    expect(screen.getByText(mockLabel)).toBeInTheDocument();
  });

  it('renders the correct value for position group', async () => {
    const selection = mockSquadAthletes.squads[0].position_groups[0];
    render(
      <AthleteSelect
        {...props}
        value={[
          {
            ...EMPTY_SELECTION,
            position_groups: [selection.id],
          },
        ]}
      />
    );
    expect(screen.getByText(selection.name)).toBeInTheDocument();
  });

  it('renders the correct value for position', async () => {
    const selection =
      mockSquadAthletes.squads[0].position_groups[0].positions[0];
    render(
      <AthleteSelect
        {...props}
        value={[
          {
            ...EMPTY_SELECTION,
            positions: [selection.id],
          },
        ]}
      />
    );
    expect(screen.getByText(selection.name)).toBeInTheDocument();
  });

  it('renders correct value for athlete', () => {
    const selection =
      mockSquadAthletes.squads[0].position_groups[0].positions[0].athletes[0];
    render(
      <AthleteSelect
        {...props}
        value={[
          {
            ...EMPTY_SELECTION,
            athletes: [selection.id],
          },
        ]}
      />
    );
    expect(screen.getByText(selection.fullname)).toBeInTheDocument();
  });

  it('renders correct value for multiple athletes', () => {
    const selection =
      mockSquadAthletes.squads[0].position_groups[0].positions[0].athletes;
    render(
      <AthleteSelect
        {...props}
        isMulti
        value={[
          {
            ...EMPTY_SELECTION,
            athletes: [selection[0].id, selection[1].id],
          },
        ]}
      />
    );
    expect(
      screen.getByText(`${selection[0].fullname}, ${selection[1].fullname}`)
    ).toBeInTheDocument();
  });

  it('renders correct value for label', () => {
    const selection = labelData[0];
    render(
      <AthleteSelect
        {...props}
        value={[
          {
            ...EMPTY_SELECTION,
            labels: [selection.id],
          },
        ]}
      />
    );
    expect(screen.getByText(selection.name)).toBeInTheDocument();
  });

  it('renders correct value for segment', () => {
    const selection = segmentData[0];
    render(
      <AthleteSelect
        {...props}
        value={[
          {
            ...EMPTY_SELECTION,
            segments: [selection.id],
          },
        ]}
      />
    );
    expect(screen.getByText(selection.name)).toBeInTheDocument();
  });

  // Some very weird behaviour happening with userEvent.type and asserting after, some kind
  // of race condition. Using fireEvent here for the typing and blur of the input seems to work,
  // and although the code is inconsistent I feel it's better than flakey-ness.
  // Open issue: https://github.com/testing-library/user-event/issues/1150
  describe('clearSearchValueOnUnmount', () => {
    jest.retryTimes(3);
    it('should clear search value on close of select if prop is passed', async () => {
      render(<AthleteSelect {...props} clearSearchValueOnUnmount isMulti />);

      selectEvent.openMenu(screen.getByLabelText('Athletes'));
      const searchInput = await screen.findByTestId('selectSearchInput');
      fireEvent.change(searchInput, { target: { value: 'Test' } });

      // Simulate blur and re-open select
      fireEvent.blur(searchInput);
      selectEvent.openMenu(screen.getByLabelText('Athletes'));

      expect(await screen.findByTestId('selectSearchInput')).toHaveValue('');
    });

    jest.retryTimes(3);
    it('should not clear search value on close of select if prop is not passed', async () => {
      render(<AthleteSelect {...props} isMulti />);

      selectEvent.openMenu(screen.getByLabelText('Athletes'));
      const searchInput = await screen.findByTestId('selectSearchInput');
      fireEvent.change(searchInput, { target: { value: 'Test' } });

      // Simulate blur and re-open select
      fireEvent.blur(searchInput);
      selectEvent.openMenu(screen.getByLabelText('Athletes'));

      expect(await screen.findByTestId('selectSearchInput')).toHaveValue(
        'Test'
      );
    });
  });

  describe('reactSelectProps for menu control', () => {
    const mockOnMenuOpen = jest.fn();
    const reactSelectProps = {
      onMenuOpen: mockOnMenuOpen,
    };

    it('should call mockOnMenuOpen when the menu opens', async () => {
      const user = userEvent.setup();
      render(
        <AthleteSelect {...props} isMulti reactSelectProps={reactSelectProps} />
      );

      await user.click(screen.getByLabelText('Athletes'));
      expect(mockOnMenuOpen).toHaveBeenCalledTimes(1);
    });

    it('should open the menu via internal ReactSelect when reactSelectProps are not provided', () => {
      render(<AthleteSelect {...props} isMulti />);

      selectEvent.openMenu(screen.getByLabelText('Athletes'));
      expect(screen.getByText('International Squad')).toBeInTheDocument();
    });
  });

  describe('customPlaceholderRenderer', () => {
    it('should render placeholder when there is a complex value type', () => {
      render(
        <AthleteSelect
          {...props}
          customPlaceholderRenderer={() => true}
          placeholder="Custom placeholder"
          value={[{ scopeToSquad: false }, { athletes: [] }, { squad: [] }]}
        />
      );

      expect(screen.getByText('Custom placeholder')).toBeInTheDocument();
    });
  });
});
