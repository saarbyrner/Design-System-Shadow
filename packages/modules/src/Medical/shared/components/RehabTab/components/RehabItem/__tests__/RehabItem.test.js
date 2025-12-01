import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import exerciseVariations from '@kitman/services/src/mocks/handlers/exerciseVariations/data.mock';
import RehabItem from '../index';
import { RehabDispatchContext } from '../../../RehabContext';

const dispatchSpy = jest.fn();

describe('<RehabItem />', () => {
  const props = {
    draggingNewExercise: false,
    id: 1001,
    sessionId: 88,
    sectionId: 65,
    exercise: {
      id: 1001,
      exercise_template_id: 291,
      exercise_name: '4 Way Ankle',
      variations: [
        {
          parameters: [
            {
              type: 'count',
              key: 'sets',
              value: '3',
              unit: 'no.',
              param_key: 'parameter1',
              label: 'Sets',
            },
            {
              type: 'count',
              key: 'reps',
              value: '2',
              unit: 'no.',
              param_key: 'parameter2',
              label: 'Reps',
            },
            {
              type: 'length',
              key: 'feet',
              value: '1',
              unit: 'ft',
              param_key: 'parameter3',
              label: 'Feet',
            },
          ],
        },
      ],
      comment: null,
      order_index: 5,
      section_id: 4,
      session_id: 4,
      maintenance: false,
      tags: [
        {
          id: 123,
          theme_colour: '#2519ff',
          name: 'Warm up',
        },
      ],
    },
    athleteId: 40211,
    inMaintenance: false,
    disabled: false,
    readOnly: false,
    rehabCopyMode: false,
    rehabContext: {
      organisationVariations: exerciseVariations,
    },
    hasManagePermission: true,
    linkToMode: false,
    rehabDayMode: '3_DAY',
    callDeleteExercise: jest.fn(),
  };

  beforeEach(() => {
    window.featureFlags = { 'rehab-groups': true };
  });

  afterEach(() => {
    window.featureFlags = {};
  });

  it('displays the correct rehab item', async () => {
    render(
      <RehabDispatchContext.Provider
        value={{
          copyExerciseIds: [],
          editExerciseIds: [],
          linkExerciseIds: [],
          dispatch: dispatchSpy,
        }}
      >
        <RehabItem {...props} />
      </RehabDispatchContext.Provider>
    );

    const rehabItem = await screen.findByTestId('Rehab|Item');
    expect(within(rehabItem).getByText('4 Way Ankle')).toBeInTheDocument();
    expect(within(rehabItem).getByText('3 Sets')).toBeInTheDocument();
    expect(within(rehabItem).getByText('2 Reps')).toBeInTheDocument();
    expect(within(rehabItem).getByText('1 ft')).toBeInTheDocument();

    // Tags/groups
    expect(
      within(rehabItem).getByTestId('Rehab|GroupContainer')
    ).toBeInTheDocument();
    expect(
      within(rehabItem)
        .getByTestId('Rehab|GroupContainer')
        .querySelector('span')
    ).toHaveStyle({ width: '4px', flex: 1, backgroundColor: '#2519ff' });
    expect(
      within(rehabItem).queryByLabelText('Group indicator for Warm up items')
    ).toBeInTheDocument();

    // on hoover two buttons are displayed
    fireEvent.mouseOver(rehabItem);

    const itemButtons = await within(rehabItem).findByTestId('action-buttons');
    const buttons = itemButtons.querySelectorAll('button');
    expect(buttons.length).toEqual(2);
    await userEvent.click(buttons[0]);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'ADD_EXERCISE_TO_EDIT_ARRAY',
      exerciseId: 1001,
    });

    await userEvent.click(buttons[1]);
    expect(props.callDeleteExercise).toHaveBeenCalledTimes(1);
  });

  it('display the correct data when in edit mode', async () => {
    render(
      <RehabDispatchContext.Provider
        value={{
          copyExerciseIds: [],
          editExerciseIds: [1001],
          linkExerciseIds: [],
          dispatch: dispatchSpy,
        }}
      >
        <RehabItem {...props} />
      </RehabDispatchContext.Provider>
    );

    const rehabEditItem = await screen.findByTestId('Rehab|EditItem');

    /* item should be disabled when in edit mode */

    expect(rehabEditItem).toHaveAttribute('aria-disabled', 'true');

    expect(within(rehabEditItem).getByText('4 Way Ankle')).toBeInTheDocument();
    const inputs = await rehabEditItem.querySelectorAll('input');

    // 3 inputs and two search fields
    expect(inputs.length).toEqual(5);

    const textArea = await rehabEditItem.querySelectorAll('textArea');
    expect(textArea.length).toEqual(1);

    await userEvent.type(textArea[0], 'Test Comment');
    expect(textArea[0]).toHaveValue('Test Comment');

    /* should be 5 buttons:
    1 exercise: {
      2 changeVariationSelect
      1 close button
      1 delete variation
      1 add another variation buttons
    }
    */
    const buttons = within(rehabEditItem).getAllByRole('button', {
      hidden: true,
    });
    expect(buttons.length).toEqual(3);

    const changeVariationButtons = await within(rehabEditItem).findAllByTestId(
      'changeVariationSelect'
    );
    expect(changeVariationButtons.length).toEqual(2);

    /* clicking close item calls the right action in dispatch */
    await userEvent.click(buttons[0]);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'REMOVE_EXERCISE_FROM_EDIT_ARRAY',
      exerciseId: 1001,
    });

    // ensuring hover action buttons don't display in edit mode
    fireEvent.mouseOver(rehabEditItem);
    expect(
      within(rehabEditItem).queryByTestId('action-buttons')
    ).not.toBeInTheDocument();
  });

  it('does not display as editable when read only prop is true', async () => {
    render(
      <RehabDispatchContext.Provider
        value={{
          copyExerciseIds: [],
          editExerciseIds: [1001],
          linkExerciseIds: [],
          dispatch: dispatchSpy,
        }}
      >
        <RehabItem {...props} readOnly />
      </RehabDispatchContext.Provider>
    );

    const rehabEditItem = screen.queryByTestId('Rehab|EditItem');

    expect(rehabEditItem).not.toBeInTheDocument();
  });

  it('display the correct data when in copy mode and item not selected', async () => {
    const copyProps = { ...props };
    copyProps.rehabCopyMode = true;
    render(
      <RehabDispatchContext.Provider
        value={{
          copyExerciseIds: [],
          editExerciseIds: [],
          linkExerciseIds: [],
          dispatch: dispatchSpy,
        }}
      >
        <RehabItem {...copyProps} />
      </RehabDispatchContext.Provider>
    );

    const rehabItem = await screen.findByTestId('Rehab|Item');
    expect(rehabItem).toHaveAttribute('aria-disabled', 'true');
    expect(within(rehabItem).getByText('3 Sets')).toBeInTheDocument();
    expect(within(rehabItem).getByText('2 Reps')).toBeInTheDocument();
    expect(within(rehabItem).getByText('1 ft')).toBeInTheDocument();

    const checkBox = within(rehabItem).getByRole('checkbox');
    expect(checkBox).toBeInTheDocument();
    expect(checkBox).not.toBeChecked();

    await userEvent.click(checkBox);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'ADD_EXERCISE_TO_COPY_ARRAY',
      exerciseSelected: true,
      exerciseId: 1001,
    });
  });

  it('display the correct data when in copy mode and item is selected', async () => {
    const copyProps = { ...props };
    copyProps.rehabCopyMode = true;
    render(
      <RehabDispatchContext.Provider
        value={{
          copyExerciseIds: [1001],
          editExerciseIds: [],
          linkExerciseIds: [],
          dispatch: dispatchSpy,
        }}
      >
        <RehabItem {...copyProps} />
      </RehabDispatchContext.Provider>
    );

    const rehabItem = await screen.findByTestId('Rehab|Item');

    expect(within(rehabItem).getByText('3 Sets')).toBeInTheDocument();
    expect(within(rehabItem).getByText('2 Reps')).toBeInTheDocument();
    expect(within(rehabItem).getByText('1 ft')).toBeInTheDocument();

    const checkBox = within(rehabItem).getByRole('checkbox');
    expect(checkBox).toBeInTheDocument();
    expect(checkBox).toBeChecked();

    // check that rehab item isn't draggable
    expect(rehabItem).toHaveAttribute('aria-disabled', 'false');
    await userEvent.click(checkBox);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'ADD_EXERCISE_TO_COPY_ARRAY',
      exerciseSelected: false,
      exerciseId: 1001,
    });

    // ensuring hover action buttons don't display in copy mode
    fireEvent.mouseOver(rehabItem);
    expect(
      within(rehabItem).queryByTestId('action-buttons')
    ).not.toBeInTheDocument();
  });

  it('display the correct data when in link to mode', async () => {
    const linkToProps = { ...props };
    linkToProps.linkToMode = true;
    render(
      <RehabDispatchContext.Provider
        value={{
          copyExerciseIds: [],
          editExerciseIds: [],
          linkExerciseIds: [1001],
          dispatch: dispatchSpy,
        }}
      >
        <RehabItem {...linkToProps} />
      </RehabDispatchContext.Provider>
    );

    const rehabItem = await screen.findByTestId('Rehab|Item');

    expect(within(rehabItem).getByText('3 Sets')).toBeInTheDocument();
    expect(within(rehabItem).getByText('2 Reps')).toBeInTheDocument();
    expect(within(rehabItem).getByText('1 ft')).toBeInTheDocument();
    // check that rehab item isn't draggable
    expect(rehabItem).toHaveAttribute('aria-disabled', 'true');

    // ensuring hover action buttons don't display in link to mode
    fireEvent.mouseOver(rehabItem);
    expect(
      within(rehabItem).queryByTestId('action-buttons')
    ).not.toBeInTheDocument();
  });

  it('display the correct data when in group mode', async () => {
    const groupModeProps = { ...props };
    groupModeProps.rehabGroupMode = true;
    render(
      <RehabDispatchContext.Provider
        value={{
          copyExerciseIds: [],
          editExerciseIds: [],
          rehabGroupIds: [1001],
          linkExerciseIds: [],
          dispatch: dispatchSpy,
        }}
      >
        <RehabItem {...groupModeProps} />
      </RehabDispatchContext.Provider>
    );

    const rehabItem = await screen.findByTestId('Rehab|Item');
    expect(within(rehabItem).getByText('3 Sets')).toBeInTheDocument();
    expect(within(rehabItem).getByText('2 Reps')).toBeInTheDocument();
    expect(within(rehabItem).getByText('1 ft')).toBeInTheDocument();

    const groupContainer = screen.queryByTestId('Rehab|GroupContainer');
    expect(groupContainer).toBeInTheDocument();
    expect(groupContainer.querySelector('span')).toHaveAttribute(
      'aria-label',
      'Group indicator for Warm up items'
    );
    expect(groupContainer.querySelector('span')).toHaveStyle({
      flex: '1',
      backgroundColor: '#2519ff',
    });

    // Checkbox should be rendered
    expect(within(rehabItem).getByRole('checkbox')).toBeInTheDocument();
    expect(within(rehabItem).getByRole('checkbox')).not.toBeChecked();

    // Action buttons should not be rendered
    fireEvent.mouseOver(rehabItem);
    expect(
      within(rehabItem).queryByTestId('action-buttons')
    ).not.toBeInTheDocument();
  });

  it('displays the correct data when a user does not have the canManage permission', async () => {
    const noManagePermissionProps = {
      ...props,
      hasManagePermission: false,
    };
    render(
      <RehabDispatchContext.Provider
        value={{
          copyExerciseIds: [],
          editExerciseIds: [],
          linkExerciseIds: [],
          dispatch: dispatchSpy,
        }}
      >
        <RehabItem {...noManagePermissionProps} />
      </RehabDispatchContext.Provider>
    );
    const rehabItem = await screen.findByTestId('Rehab|Item');
    fireEvent.mouseOver(rehabItem);
    expect(
      within(rehabItem).queryByTestId('action-buttons')
    ).not.toBeInTheDocument();
  });
  describe('TRIAL ATHLETE - action buttons', () => {
    const renderWithHiddenFilters = (hiddenFilters = []) => {
      render(
        <RehabDispatchContext.Provider
          value={{
            copyExerciseIds: [],
            editExerciseIds: [],
            linkExerciseIds: [],
            dispatch: dispatchSpy,
          }}
        >
          <RehabItem {...props} hiddenFilters={hiddenFilters} />{' '}
        </RehabDispatchContext.Provider>
      );
    };

    it('does render by default', async () => {
      renderWithHiddenFilters();
      const rehabItem = await screen.findByTestId('Rehab|Item');
      expect(within(rehabItem).getByText('4 Way Ankle')).toBeInTheDocument();
      expect(within(rehabItem).getByText('3 Sets')).toBeInTheDocument();
      expect(within(rehabItem).getByText('2 Reps')).toBeInTheDocument();
      expect(within(rehabItem).getByText('1 ft')).toBeInTheDocument();

      // Tags/groups
      expect(
        within(rehabItem).getByTestId('Rehab|GroupContainer')
      ).toBeInTheDocument();
      expect(
        within(rehabItem)
          .getByTestId('Rehab|GroupContainer')
          .querySelector('span')
      ).toHaveStyle({ width: '4px', flex: 1, backgroundColor: '#2519ff' });
      expect(
        within(rehabItem).queryByLabelText('Group indicator for Warm up items')
      ).toBeInTheDocument();

      // on hoover two buttons are displayed
      fireEvent.mouseOver(rehabItem);

      const itemButtons = await within(rehabItem).findByTestId(
        'action-buttons'
      );
      expect(itemButtons).toBeInTheDocument();
    });
    it('does not render when hidden', async () => {
      renderWithHiddenFilters(['add_rehab_button']);
      const rehabItem = await screen.findByTestId('Rehab|Item');
      expect(within(rehabItem).getByText('4 Way Ankle')).toBeInTheDocument();
      expect(within(rehabItem).getByText('3 Sets')).toBeInTheDocument();
      expect(within(rehabItem).getByText('2 Reps')).toBeInTheDocument();
      expect(within(rehabItem).getByText('1 ft')).toBeInTheDocument();

      // Tags/groups
      expect(
        within(rehabItem).getByTestId('Rehab|GroupContainer')
      ).toBeInTheDocument();
      expect(
        within(rehabItem)
          .getByTestId('Rehab|GroupContainer')
          .querySelector('span')
      ).toHaveStyle({ width: '4px', flex: 1, backgroundColor: '#2519ff' });
      expect(
        within(rehabItem).queryByLabelText('Group indicator for Warm up items')
      ).toBeInTheDocument();

      // on hoover two buttons are displayed
      fireEvent.mouseOver(rehabItem);

      const itemButtons = within(rehabItem).queryByTestId('action-buttons');
      expect(itemButtons).not.toBeInTheDocument();
    });
  });
});
