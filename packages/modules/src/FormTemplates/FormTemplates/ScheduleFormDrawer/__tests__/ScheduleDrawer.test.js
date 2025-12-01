import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import {
  REDUCER_KEY as FORM_TEMPLATES_REDUCER_KEY,
  initialState as formTemplatesInitialState,
} from '@kitman/modules/src/FormTemplates/redux/slices/formTemplatesSlice';
import ScheduleDrawer from '..';
import { getDrawerTranslations } from '../utils/helpers';

describe('<ScheduleDrawer />', () => {
  const props = {
    handleSaveButton: jest.fn(),
  };
  const renderComponent = () => {
    const { mockedStore } = renderWithRedux(<ScheduleDrawer {...props} />, {
      preloadedState: {
        [FORM_TEMPLATES_REDUCER_KEY]: {
          ...formTemplatesInitialState,
          isCreateFormDrawerOpen: false,
          isScheduleDrawerOpen: true,
        },
      },
      useGlobalStore: false,
    });
    return mockedStore;
  };

  it('should display the side panel properly', () => {
    const translations = getDrawerTranslations();
    renderComponent();

    expect(screen.getByText(translations.title)).toBeInTheDocument();
    const saveButton = screen.getByRole('button', {
      name: translations.saveButton,
    });
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toBeEnabled();
  });

  it('should call the handleSaveClick callback', async () => {
    const translations = getDrawerTranslations();
    const user = userEvent.setup();
    renderComponent();

    const saveButton = screen.getByRole('button', {
      name: translations.saveButton,
    });
    expect(saveButton).toBeEnabled();

    await user.click(saveButton);

    expect(props.handleSaveButton).toHaveBeenCalled();
  });
});
