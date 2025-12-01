import { act } from 'react-dom/test-utils';
import { axios } from '@kitman/common/src/utils/services';
import { render, screen, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import RehabGroupsPanel from '../index';

jest.mock('@kitman/components/src/DatePicker');
jest.mock('@kitman/components/src/DelayedLoadingFeedback');

describe('<RehabGroupsPanel />', () => {
  let spy;
  // We use React Portal to add the side panel to div 'issueMedicalProfile-Slideout'
  // Mock in as needs to be present in the test
  beforeAll(() => {
    spy = jest.spyOn(document, 'getElementById');
    const mockElement = document.createElement('div');
    mockElement.setAttribute('id', 'issueMedicalProfile-Slideout');
    document.body.appendChild(mockElement);
    spy.mockReturnValueOnce(mockElement);
  });

  beforeEach(() => {
    i18nextTranslateStub();
  });

  const onClickCloseButtonSpy = jest.fn();

  const props = {
    isOpen: true,
    onClose: onClickCloseButtonSpy,
    t: i18nextTranslateStub(),
  };

  const storeFake = (state) => ({
    default: () => {},
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({ ...state }),
  });

  const store = storeFake({
    medicalApi: {},
  });

  it('displays the correct content', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <RehabGroupsPanel {...props} />
        </Provider>
      );
    });

    expect(screen.getByText('Groups')).toBeInTheDocument();
    expect(screen.getAllByText('Name')).toHaveLength(3); // Three rendered groups/tags
    expect(screen.getByText('New group')).toBeInTheDocument();
    expect(screen.getByTestId('ColorPicker')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();

    const existingGroups = screen.getAllByRole('checkbox');
    const expectedGroupValues = ['Warm down', 'Cardio', 'Group test'];
    expect(existingGroups).toHaveLength(3);

    existingGroups.forEach((checkbox, index) => {
      expect(
        existingGroups[index].parentNode.parentNode.querySelector('input')
      ).toHaveValue(expectedGroupValues[index]);
    });
  });

  it('disables new group creation when checkboxes (existing groups) interacted with', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <RehabGroupsPanel {...props} />
        </Provider>
      );
    });

    const existingGroups = screen.getAllByRole('checkbox');
    const newGroupContainer = screen
      .getByTestId('ExpandingPanel')
      .querySelector('[class*="-rehabGroupsContainer"]');

    expect(newGroupContainer).toBeInTheDocument();

    // Default styles
    expect(newGroupContainer).not.toHaveStyle({
      opacity: '0.5',
      pointerEvents: 'none',
    });

    // Click one of the checkboxes
    await userEvent.click(existingGroups[0]);

    // Expect the new groups container to be disabled
    expect(newGroupContainer).toHaveStyle({
      opacity: '0.5',
      pointerEvents: 'none',
    });
  });

  it('disables checkboxes (existing groups selection) when new group creation interacted with (input receives text)', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <RehabGroupsPanel {...props} />
        </Provider>
      );
    });

    const existingGroupsContainer =
      screen.getAllByRole('checkbox')[0].parentNode.parentNode.parentNode;
    const newGroupInput = screen
      .getByText('New group')
      .parentNode.parentNode.querySelector('input');

    // Default styles
    expect(existingGroupsContainer).not.toHaveStyle({
      opacity: '0.5',
      pointerEvents: 'none',
    });

    // Type into the input
    await userEvent.type(newGroupInput, 'hi there');

    // Expect the new groups container to be disabled
    expect(existingGroupsContainer).toHaveStyle({
      opacity: '0.5',
      pointerEvents: 'none',
    });
  });

  it('triggers callback from the close button', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <RehabGroupsPanel {...props} />
        </Provider>
      );
      const buttons = await screen.findAllByRole('button');
      await act(async () => {
        await userEvent.click(buttons[0]);

        expect(onClickCloseButtonSpy).toHaveBeenCalled();
      });
    });
  });

  it('disables the Save button after click', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <RehabGroupsPanel {...props} />
        </Provider>
      );

      const spyServiceCall = jest.spyOn(axios, 'post');

      const actionButtonsContainer = screen.getByTestId(
        'RehabGroups|Actions|save'
      );
      expect(actionButtonsContainer).toBeInTheDocument();

      expect(
        within(actionButtonsContainer).getByText('Save')
      ).toBeInTheDocument();

      expect(within(actionButtonsContainer).getByRole('button')).toBeEnabled();

      await userEvent.click(within(actionButtonsContainer).getByRole('button'));
      expect(spyServiceCall).toHaveBeenCalledWith('/tags', {
        name: '',
        scope: 'Default',
        theme_colour: '',
      });
    });
  });

  it('removes a group when the bin icon is clicked', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <RehabGroupsPanel {...props} />
        </Provider>
      );
    });
    const spyServiceCall = jest.spyOn(axios, 'delete');

    const existingGroupsContainer = screen.getByTestId('RehabGroupContainer');
    const existingGroups = screen.getAllByRole('checkbox');
    const deleteGroupButtons =
      existingGroupsContainer.querySelectorAll('button.icon-bin');

    expect(deleteGroupButtons[0]).toBeInTheDocument();
    expect(existingGroups).toHaveLength(3);

    // Click delete/archive buttons
    await userEvent.click(deleteGroupButtons[0]);
    expect(spyServiceCall).toHaveBeenCalledWith('/tags/22');
    await userEvent.click(deleteGroupButtons[1]);
    expect(spyServiceCall).toHaveBeenLastCalledWith('/tags/23');
  });
});
