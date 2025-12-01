import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import ExerciseContainer from '../index';

describe('<ExerciseContainer />', () => {
  const onAddRehabToSectionClickedSpy = jest.fn();

  const props = {
    athleteId: 1,
    inMaintenance: false,
    id: 1,
    sessionId: 2,
    exercises: [],
    disabled: false,
    rehabCopyMode: false,
    rehabGroupMode: false,
    rehabDayMode: false,
    readOnlyExercises: false,
    // customFooter

    // Function callbacks
    onAddRehabToSectionClicked: onAddRehabToSectionClickedSpy,

    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    window.featureFlags = { 'rehab-groups': true };
  });

  afterEach(() => {
    window.featureFlags = {};
  });

  it('displays the footer', async () => {
    render(<ExerciseContainer {...props} rehabCopyMode={false} />);
    const container = screen.queryByTestId('Rehab|DroppableContainer');
    expect(container).toBeInTheDocument();

    const footer = screen.queryByTestId('Rehab|ContainerFooter');
    expect(footer).toBeInTheDocument();
  });

  it('displays a custom footer', async () => {
    render(
      <ExerciseContainer
        {...props}
        rehabCopyMode={false}
        customFooter={<div>custom footer test</div>}
      />
    );
    const container = screen.queryByTestId('Rehab|DroppableContainer');
    expect(container).toBeInTheDocument();

    const footer = screen.queryByTestId('Rehab|ContainerFooter');
    expect(footer).toBeInTheDocument();

    const customFooter = screen.getByText('custom footer test');
    expect(customFooter).toBeInTheDocument();
  });

  it('displays group elements and data correctly when exercise data present and rehab-groups FF is on', async () => {
    render(
      <ExerciseContainer
        {...props}
        rehabCopyMode={false}
        rehabGroupMode
        exercises={[
          {
            id: 863,
            exercise_template_id: 471,
            exercise_name: 'Alter G Running',
            variations: [
              {
                key: 'sets-reps-pounds',
                parameters: [
                  {
                    type: 'count',
                    key: 'sets',
                    value: '1',
                    unit: 'no.',
                    param_key: 'parameter1',
                    label: 'Sets',
                  },
                  {
                    type: 'count',
                    key: 'reps',
                    value: '3',
                    unit: 'no.',
                    param_key: 'parameter2',
                    label: 'Reps',
                  },
                  {
                    type: 'mass',
                    key: 'pounds',
                    value: '33',
                    unit: 'lb',
                    param_key: 'parameter3',
                    label: 'Pounds',
                  },
                ],
              },
            ],
            comment: null,
            order_index: 1,
            section_id: 195,
            session_id: 218,
            tags: [
              {
                id: 123,
                theme_colour: '#2513ff',
                name: 'warm up 1',
              },
            ],
            maintenance: true,
            issue_title: null,
          },
          {
            id: 864,
            exercise_template_id: 475,
            exercise_name: 'Bent Knee Calf Raise Isometrics',
            variations: [
              {
                key: 'sets-reps-pounds',
                parameters: [
                  {
                    type: 'count',
                    key: 'sets',
                    value: null,
                    unit: 'no.',
                    param_key: 'parameter1',
                    label: 'Sets',
                  },
                  {
                    type: 'count',
                    key: 'reps',
                    value: null,
                    unit: 'no.',
                    param_key: 'parameter2',
                    label: 'Reps',
                  },
                  {
                    type: 'mass',
                    key: 'pounds',
                    value: null,
                    unit: 'lb',
                    param_key: 'parameter3',
                    label: 'Pounds',
                  },
                ],
              },
            ],
            comment: null,
            order_index: 2,
            section_id: 195,
            session_id: 218,
            tags: [
              {
                id: 123,
                theme_colour: '#2516ff',
                name: 'warm down 1',
              },
            ],
            maintenance: true,
            issue_title: null,
          },
          {
            id: 865,
            exercise_template_id: 476,
            exercise_name: 'Bent Knee Calf Raises',
            variations: [
              {
                key: 'sets-reps-pounds',
                parameters: [
                  {
                    type: 'count',
                    key: 'sets',
                    value: null,
                    unit: 'no.',
                    param_key: 'parameter1',
                    label: 'Sets',
                  },
                  {
                    type: 'count',
                    key: 'reps',
                    value: null,
                    unit: 'no.',
                    param_key: 'parameter2',
                    label: 'Reps',
                  },
                  {
                    type: 'mass',
                    key: 'pounds',
                    value: null,
                    unit: 'lb',
                    param_key: 'parameter3',
                    label: 'Pounds',
                  },
                ],
              },
            ],
            comment: null,
            order_index: 3,
            section_id: 195,
            session_id: 218,
            tags: [
              {
                id: 123,
                theme_colour: '#2519ff',
                name: 'warm up 2',
              },
            ],
            maintenance: true,
            issue_title: null,
          },
        ]}
      />
    );

    const groupContainer = screen.queryAllByTestId('Rehab|GroupContainer');
    expect(groupContainer).toHaveLength(3);
    expect(groupContainer[0].querySelector('span')).toHaveAttribute(
      'aria-label',
      'Group indicator for warm up 1 items'
    );
    expect(groupContainer[0].querySelector('span')).toHaveStyle({
      flex: '1',
      backgroundColor: '#2513ff',
    });

    expect(groupContainer[1].querySelector('span')).toHaveAttribute(
      'aria-label',
      'Group indicator for warm down 1 items'
    );
    expect(groupContainer[1].querySelector('span')).toHaveStyle({
      flex: '1',
      backgroundColor: '#2516ff',
    });

    expect(groupContainer[2].querySelector('span')).toHaveAttribute(
      'aria-label',
      'Group indicator for warm up 2 items'
    );
    expect(groupContainer[2].querySelector('span')).toHaveStyle({
      flex: '1',
      backgroundColor: '#2519ff',
    });
  });
});
