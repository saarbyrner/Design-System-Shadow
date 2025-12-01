import { render, screen } from '@testing-library/react';
import { VirtuosoMockContext } from 'react-virtuoso';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';
import {
  useAthleteContext,
  useOptionSelect,
} from '@kitman/components/src/Athletes/hooks';
import AthleteList from '..';

jest.mock('@kitman/components/src/Athletes/hooks', () => ({
  ...jest.requireActual('@kitman/components/src/Athletes/hooks'),
  useAthleteContext: jest.fn().mockReturnValue({
    onSelectAllClick: undefined, // undefined by default, will mock in specific tests
    onClearAllClick: undefined, // undefined by default, will mock in specific tests
    isMulti: true,
  }),
  useOptionSelect: jest.fn().mockReturnValue({
    onClick: jest.fn(),
    isSelected: jest.fn(),
    selectMultiple: jest.fn(),
    deselectMultiple: jest.fn(),
  }),
}));

describe('<AthleteList />', () => {
  const i18nT = i18nextTranslateStub();
  const mockProps = {
    groupType: 'labels',
    selectedGrouping: {
      id: 10,
      name: 'Label One',
    },
    isLoading: false,
    athletes: [],
    onBack: jest.fn(),
    t: i18nT,
  };
  const MOCK_ATHLETES = [
    {
      id: 1,
      fullname: 'Jack Crowley',
    },
    {
      id: 2,
      fullname: 'Peter OMahony',
    },
  ];

  it('renders a checkbox for the selected grouping', () => {
    render(<AthleteList {...mockProps} />);

    expect(screen.getAllByText('Label One').length).toEqual(1);
  });

  it('renders a loading spinner when isLoading is true', () => {
    render(<AthleteList {...mockProps} isLoading />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders a list of checkboxes for each athlete passed in', () => {
    render(
      <VirtuosoMockContext.Provider
        value={{ viewportHeight: 1000, itemHeight: 40 }}
      >
        <AthleteList {...mockProps} athletes={MOCK_ATHLETES} />
      </VirtuosoMockContext.Provider>
    );

    MOCK_ATHLETES.forEach(({ fullname }) => {
      expect(screen.getAllByText(fullname).length).toEqual(1);
    });
  });

  it('calls onBack when back button is clicked', async () => {
    const user = userEvent.setup();
    render(<AthleteList {...mockProps} />);

    expect(mockProps.onBack).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: /back/i }));

    expect(mockProps.onBack).toHaveBeenCalled();
  });

  describe('when selecting athletes', () => {
    const setupTest = async (props = {}) => {
      const {
        onClick: onClickMock,
        selectMultiple,
        deselectMultiple,
        // can use this hook as we just want to track the mocked value
        // eslint-disable-next-line react-hooks/rules-of-hooks
      } = useOptionSelect();
      const user = userEvent.setup();
      render(
        <VirtuosoMockContext.Provider
          value={{ viewportHeight: 1000, itemHeight: 40 }}
        >
          <AthleteList {...mockProps} athletes={MOCK_ATHLETES} {...props} />
        </VirtuosoMockContext.Provider>
      );

      return { user, onClickMock, selectMultiple, deselectMultiple };
    };
    it('calls onClick with correct params when clicking athlete', async () => {
      const { user, onClickMock } = await setupTest();

      await user.click(screen.getByText('Jack Crowley'));

      expect(onClickMock).toHaveBeenCalledTimes(1);
      expect(onClickMock).toHaveBeenCalledWith(1, 'athletes', null, {
        id: 1,
        name: 'Jack Crowley',
        type: 'athletes',
      });
    });

    it('calls onClick with correct params when clicking group or label', async () => {
      const { user, onClickMock } = await setupTest();

      await user.click(screen.getByText(mockProps.selectedGrouping.name));

      expect(onClickMock).toHaveBeenCalledTimes(1);
      expect(onClickMock).toHaveBeenCalledWith(
        mockProps.selectedGrouping.id,
        mockProps.groupType,
        null,
        {
          id: mockProps.selectedGrouping.id,
          name: mockProps.selectedGrouping.name,
          type: 'labels',
        }
      );
    });

    it('calls selectMultiple with correct params when clicking group header select all', async () => {
      const { user, selectMultiple } = await setupTest();

      await user.click(screen.getByText('Select all'));

      expect(selectMultiple).toHaveBeenCalledWith(
        [
          {
            id: 1,
            name: 'Jack Crowley',
            type: 'athletes',
          },
          {
            id: 2,
            name: 'Peter OMahony',
            type: 'athletes',
          },
        ],
        null
      );
    });

    it('calls deselectMultiple with correct params when clicking group header clear all', async () => {
      const { user, deselectMultiple } = await setupTest();

      await user.click(screen.getByText('Clear all'));

      expect(deselectMultiple).toHaveBeenCalledWith(
        [
          {
            id: 1,
            name: 'Jack Crowley',
            type: 'athletes',
          },
          {
            id: 2,
            name: 'Peter OMahony',
            type: 'athletes',
          },
        ],
        null
      );
    });

    describe('athlete context callbacks are available', () => {
      const onSelectAllClick = jest.fn();
      const onClearAllClick = jest.fn();

      beforeEach(() => {
        useAthleteContext.mockReturnValue({
          onSelectAllClick,
          onClearAllClick,
          isMulti: true,
        });
      });

      it('calls onSelectAllClick callback when available', async () => {
        const { user } = await setupTest();

        await user.click(screen.getByText('Select all'));

        expect(onSelectAllClick).toHaveBeenCalledWith(
          [
            {
              id: 1,
              name: 'Jack Crowley',
              type: 'athletes',
            },
            {
              id: 2,
              name: 'Peter OMahony',
              type: 'athletes',
            },
          ],
          null
        );
      });

      it('calls onClearAllClick callback when available', async () => {
        const { user } = await setupTest();

        await user.click(screen.getByText('Clear all'));

        expect(onClearAllClick).toHaveBeenCalledWith(
          [
            {
              id: 1,
              name: 'Jack Crowley',
              type: 'athletes',
            },
            {
              id: 2,
              name: 'Peter OMahony',
              type: 'athletes',
            },
          ],
          null
        );
      });
    });
  });

  describe('when isMulti is false', () => {
    const onSelectAllClick = jest.fn();
    const onClearAllClick = jest.fn();

    beforeEach(() => {
      useAthleteContext.mockReturnValue({
        onSelectAllClick,
        onClearAllClick,
        isMulti: false,
      });
    });
    it('should not render checkboxes', () => {
      render(
        <VirtuosoMockContext.Provider
          value={{ viewportHeight: 1000, itemHeight: 40 }}
        >
          <AthleteList {...mockProps} athletes={MOCK_ATHLETES} />
        </VirtuosoMockContext.Provider>
      );
      expect(screen.queryAllByRole('checkbox').length).toBe(0);
    });

    it('should not render select all and clear all options', async () => {
      render(
        <VirtuosoMockContext.Provider
          value={{ viewportHeight: 1000, itemHeight: 40 }}
        >
          <AthleteList {...mockProps} athletes={MOCK_ATHLETES} />
        </VirtuosoMockContext.Provider>
      );
      expect(screen.queryByText('Select all')).not.toBeInTheDocument();
      expect(screen.queryByText('Clear all')).not.toBeInTheDocument();
    });
  });
});
