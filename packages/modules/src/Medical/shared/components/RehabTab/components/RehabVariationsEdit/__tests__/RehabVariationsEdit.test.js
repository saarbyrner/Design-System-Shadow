import { render, screen, within, fireEvent } from '@testing-library/react';
import exerciseVariations from '@kitman/services/src/mocks/handlers/exerciseVariations/data.mock';
import RehabVariationsEdit from '../index';

jest.mock('@kitman/components/src/DelayedLoadingFeedback');

describe('<RehabVariationsEdit />', () => {
  const props = {
    disabled: false,
    rehabContext: {
      organisationVariations: exerciseVariations,
    },
    variation: {
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
          value: '1',
          unit: 'no.',
          param_key: 'parameter2',
          label: 'Reps',
        },
        {
          type: 'mass',
          key: 'bands',
          value: '1',
          unit: null,
          param_key: 'parameter3',
          label: 'Bands',
        },
      ],
    },
    forwardedRef: {
      parameter1: null,
      parameter2: null,
      parameter3: null,
    },
    changeVariationType: jest.fn(),
    updateExerciseVariationProperty: jest.fn(),
    onDeleteExerciseVariation: jest.fn(),
  };

  it('displays the correct data for newly dragged item', async () => {
    render(<RehabVariationsEdit {...props} />);

    const inputs = screen.getAllByTestId('EditVariation|VariationItemDisplay');
    expect(inputs).toHaveLength(3);

    await fireEvent.mouseOver(inputs[0]);
    expect(() =>
      inputs[0].getByRole('button', {
        hidden: true,
      })
    ).toThrow();

    await fireEvent.mouseOver(inputs[1]);
    const param2button = await within(inputs[1]).findByTestId(
      'changeVariationSelect'
    );
    expect(param2button).toBeInTheDocument();

    await fireEvent.mouseOver(inputs[2]);
    // TODO: shouldn't be hidden once hovered
    const param3button = await within(inputs[2]).findByTestId(
      'changeVariationSelect'
    );
    expect(param3button).toBeInTheDocument();
  });
});
