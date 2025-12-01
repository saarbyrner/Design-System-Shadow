import { render, screen, act } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import ClubRulesetsTab from '..';
import useRulesetsGrid from '../../../../../shared/hooks/useRulesetsGrid';

jest.mock('../../../../../shared/hooks/useRulesetsGrid');

const mockHookValue = ({
  requestStatus = 'SUCCESS',
  grid = {
    rows: [],
    columns: [],
    id: '',
    emptyTableText: '',
  },
} = {}) => ({
  requestStatus,

  grid,
});

describe('<ClubRulesetsTab />', () => {
  const props = {
    t: i18nextTranslateStub(),
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('[requestStatus]', () => {
    it('[SUCCESS] renders the correct content', async () => {
      useRulesetsGrid.mockReturnValue(mockHookValue());
      act(() => {
        render(<ClubRulesetsTab {...props} />);
      });

      expect(screen.getAllByText(/Rulesets/i)[0]).toBeInTheDocument();
    });
  });
});
