import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { endWidgetEditMode } from '@kitman/modules/src/analysis/Dashboard/redux/slices/chartBuilder';
import { editWidgetSuccess } from '@kitman/modules/src/analysis/Dashboard/redux/actions/widgets';
import BuilderActionButtons from '../index';

jest.mock(
  '@kitman/modules/src/analysis/Dashboard/redux/slices/chartBuilder',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/analysis/Dashboard/redux/slices/chartBuilder'
    ),
    endWidgetEditMode: jest.fn(() => ({
      type: null,
    })),
  })
);

jest.mock(
  '@kitman/modules/src/analysis/Dashboard/redux/actions/widgets',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/analysis/Dashboard/redux/actions/widgets'
    ),
    editWidgetSuccess: jest.fn(() => ({
      type: null,
    })),
  })
);

describe('analysis dashboard | <BuilderActionButtons />', () => {
  const props = {
    t: i18nextTranslateStub(),
  };

  describe('done button', () => {
    it('renders done button', async () => {
      renderWithStore(<BuilderActionButtons {...props} />);

      await expect(screen.getByText('Done')).toBeInTheDocument();
    });
    it('triggers endWidgetEditMode when clicked', async () => {
      const user = userEvent.setup();
      renderWithStore(<BuilderActionButtons {...props} />);

      await user.click(screen.getByText('Done'));

      expect(endWidgetEditMode).toHaveBeenCalled();
      expect(editWidgetSuccess).toHaveBeenCalled();
    });
  });
});
