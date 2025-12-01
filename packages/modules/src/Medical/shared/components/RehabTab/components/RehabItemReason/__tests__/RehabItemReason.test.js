import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import exerciseVariations from '@kitman/services/src/mocks/handlers/exerciseVariations/data.mock';
import RehabItemReason from '../RehabItemReason';
import { RehabDispatchContext } from '../../../RehabContext';

const dispatchSpy = jest.fn();

describe('<RehabItemReason />', () => {
  const props = {
    issueId: 111,
    onDoneAddingReason: jest.fn(),
    isTouchInput: false,
    isInEditMode: false,
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
      reason: 'Reason here',
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

  beforeAll(() => {
    window.featureFlags = { 'rehab-maintenance-reason': true };
  });

  afterAll(() => {
    window.featureFlags = {};
  });

  it('displays the correct rehab reason item', async () => {
    render(
      <RehabDispatchContext.Provider
        value={{
          copyExerciseIds: [],
          editExerciseIds: [],
          linkExerciseIds: [],
          dispatch: dispatchSpy,
        }}
      >
        <RehabItemReason {...props} />
      </RehabDispatchContext.Provider>
    );

    const RehabItemReasonElement = await screen.findByTestId(
      'RehabItemReason|Header'
    );

    expect(
      within(RehabItemReasonElement).getByText('Reason here')
    ).toBeInTheDocument();

    expect(RehabItemReasonElement).toBeInTheDocument();

    // on hover two buttons are displayed
    await fireEvent.mouseOver(RehabItemReasonElement);

    const itemButtons = await within(RehabItemReasonElement).findByTestId(
      'action-buttons'
    );
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

  it('displays the correct data when in edit mode', async () => {
    render(
      <RehabDispatchContext.Provider
        value={{
          copyExerciseIds: [],
          editExerciseIds: [1001],
          linkExerciseIds: [],
          dispatch: dispatchSpy,
        }}
      >
        <RehabItemReason {...props} isInEditMode />
      </RehabDispatchContext.Provider>
    );

    const rehabEditItem = await screen.findByTestId(
      'EditAndAddRehabItemReason'
    );

    /* item should be disabled when in edit mode */
    expect(rehabEditItem).toBeInTheDocument();
    expect(rehabEditItem).toHaveAttribute('aria-disabled', 'true');

    expect(within(rehabEditItem).getByPlaceholderText('Reason')).toHaveValue(
      'Reason here'
    );
    const inputs = await rehabEditItem.querySelectorAll('input');
    expect(inputs.length).toEqual(1);

    /* should be 2 buttons:
      1 save reason
      1 close/remove 
    */
    const buttons = within(rehabEditItem).getAllByRole('button', {
      hidden: true,
    });
    expect(buttons.length).toEqual(2);

    /* clicking save item calls the right action in dispatch to reset the edit array */
    await userEvent.click(buttons[0]);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'CLEAR_EDITING_EXERCISE_IDS',
    });

    // ensuring hover action buttons don't display in edit mode
    await fireEvent.mouseOver(rehabEditItem);
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
        <RehabItemReason {...props} readOnly />
      </RehabDispatchContext.Provider>
    );

    const rehabEditItem = screen.queryByTestId('EditAndAddRehabItemReason');

    expect(rehabEditItem).not.toBeInTheDocument();
  });

  it('displays the correct data when in copy mode and item not selected', async () => {
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
        <RehabItemReason {...copyProps} />
      </RehabDispatchContext.Provider>
    );

    const rehabItem = await screen.findByTestId('RehabItemReason|Header');
    expect(rehabItem).toHaveAttribute('aria-disabled', 'true');

    expect(within(rehabItem).getByText('Reason here')).toBeInTheDocument();

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

  it('displays the correct data when in copy mode and item is selected', async () => {
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
        <RehabItemReason {...copyProps} />
      </RehabDispatchContext.Provider>
    );

    const rehabItem = await screen.findByTestId('RehabItemReason|Header');

    expect(within(rehabItem).getByText('Reason here')).toBeInTheDocument();

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
    await fireEvent.mouseOver(rehabItem);
    expect(
      within(rehabItem).queryByTestId('action-buttons')
    ).not.toBeInTheDocument();
  });

  it('displays the correct data when in link to mode', async () => {
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
        <RehabItemReason {...linkToProps} />
      </RehabDispatchContext.Provider>
    );

    const rehabItem = await screen.findByTestId('RehabItemReason|Header');

    expect(within(rehabItem).getByText('Reason here')).toBeInTheDocument();

    // check that rehab item isn't draggable
    expect(rehabItem).toHaveAttribute('aria-disabled', 'true');

    // ensuring hover action buttons don't displays in link to mode
    await fireEvent.mouseOver(rehabItem);
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
        <RehabItemReason {...noManagePermissionProps} />
      </RehabDispatchContext.Provider>
    );
    const rehabItem = await screen.findByTestId('RehabItemReason|Header');
    await fireEvent.mouseOver(rehabItem);
    expect(
      within(rehabItem).queryByTestId('action-buttons')
    ).not.toBeInTheDocument();
  });

  it('displays the correct button and call correct function when in edit mode', async () => {
    render(
      <RehabDispatchContext.Provider
        value={{
          copyExerciseIds: [],
          editExerciseIds: [1001],
          linkExerciseIds: [],
          dispatch: dispatchSpy,
        }}
      >
        <RehabItemReason {...props} />
      </RehabDispatchContext.Provider>
    );

    const rehabEditItem = await screen.findByTestId(
      'EditAndAddRehabItemReason'
    );
    const editModebuttons = rehabEditItem.querySelectorAll('button');
    expect(rehabEditItem).toBeInTheDocument();
    expect(editModebuttons.length).toEqual(2);

    expect(editModebuttons[1]).toHaveClass('icon-close');
    await userEvent.click(editModebuttons[1]);

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'CLEAR_EDITING_EXERCISE_IDS',
    });
  });

  it('displays the correct button and call correct function when not in edit mode', async () => {
    render(
      <RehabDispatchContext.Provider
        value={{
          copyExerciseIds: [],
          editExerciseIds: [],
          linkExerciseIds: [],
          dispatch: dispatchSpy,
        }}
      >
        {/* isInEditMode props is used to create a new rehabReason - opens the component in edit mode */}
        <RehabItemReason {...props} isInEditMode />
      </RehabDispatchContext.Provider>
    );

    const createRehabReasonItem = await screen.findByTestId(
      'EditAndAddRehabItemReason'
    );
    const createRehabReasonButtons =
      createRehabReasonItem.querySelectorAll('button');
    expect(createRehabReasonItem).toBeInTheDocument();
    expect(createRehabReasonButtons.length).toEqual(2);

    expect(createRehabReasonButtons[1]).toHaveClass('icon-bin-new');
    await userEvent.click(createRehabReasonButtons[1]);

    expect(dispatchSpy).not.toHaveBeenCalledWith({
      type: 'CLEAR_EDITING_EXERCISE_IDS',
    });

    expect(props.onDoneAddingReason).toHaveBeenCalledTimes(1);
  });

  it('triggers correct functionality when ESC key pressed in edit mode', async () => {
    render(
      <RehabDispatchContext.Provider
        value={{
          copyExerciseIds: [],
          editExerciseIds: [1001],
          linkExerciseIds: [],
          dispatch: dispatchSpy,
        }}
      >
        <RehabItemReason {...props} />
      </RehabDispatchContext.Provider>
    );

    await userEvent.type(screen.getByPlaceholderText('Reason'), `{escape}`);

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'CLEAR_EDITING_EXERCISE_IDS',
    });
    expect(props.onDoneAddingReason).toHaveBeenCalledTimes(1);
  });

  it('triggers correct functionality when ENTER pressed in creation mode', async () => {
    render(
      <RehabDispatchContext.Provider
        value={{
          copyExerciseIds: [],
          editExerciseIds: [],
          linkExerciseIds: [],
          dispatch: dispatchSpy,
        }}
      >
        {/* isInEditMode props is used to create a new rehabReason - opens the component in edit mode */}
        <RehabItemReason {...props} isInEditMode />
      </RehabDispatchContext.Provider>
    );

    expect(screen.getByPlaceholderText('Reason')).toHaveValue('Reason here');

    await userEvent.type(
      screen.getByPlaceholderText('Reason'),
      ` and new value here`
    );
    await userEvent.type(screen.getByPlaceholderText('Reason'), `{enter}`);

    expect(screen.getByPlaceholderText('Reason')).toHaveValue(
      'Reason here and new value here'
    );
    // Called after success
    expect(props.onDoneAddingReason).toHaveBeenCalled();
  });
});
