import { render, screen, act, fireEvent } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import CaseInformation from '..';

jest.mock('../../../../utils');

describe('<CaseInformation />', () => {
  const storeFake = (state) => ({
    default: () => {},
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({ ...state }),
  });

  const mockStore = storeFake({
    addOshaFormSidePanel: {
      isOpen: true,
      page: 1,
      initialInformation: {},
      employeeDrInformation: {},
      caseInformation: {},
    },
  });

  const defaultProps = {
    issue: {
      osha: {},
    },
    isOpen: true,
    t: i18nextTranslateStub(),
  };

  const useDispatchMock = jest.fn();
  mockStore.dispatch = useDispatchMock;

  it('should render contents as expected', () => {
    render(
      <Provider store={mockStore}>
        <CaseInformation {...defaultProps} />
      </Provider>
    );

    expect(
      screen.getByTestId('AddOshaSidePanel|CaseNumber')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        '(Transfer the case number from the Log after you record the case.)'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AddOshaSidePanel|DateInjured')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AddOshaSidePanel|TimeBeganWork')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AddOshaSidePanel|TimeEvent')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AddOshaSidePanel|TimeEventCheckBox')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AddOshaSidePanel|AthleteActivity')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Describe the activity, as well as the tools, equipment, or material the employee was using. Be specific. Examples: “climbing a ladder while carrying roofing materials”; “spraying chlorine from hand sprayer”; “daily computer key-entry.”'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AddOshaSidePanel|WhatHappened')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Tell us how the injury occured. Examples: “When the ladder slipped on wet flood, worker fell 20 feet”; “Worker was sprayed with chlorine when gasket broke during replacement”; “Worker developed soreness in wrist over time.”'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AddOshaSidePanel|IssueDescription')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Tell us the part of the body that was affected and how it was affected; be more specific than “hurt”; “pain” or “sore”. Examples: “strained back”; “chemical burn, hand”; “carpal tunnel syndrome.”'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AddOshaSidePanel|ObjectSubstance')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Examples: “concrete floor”; “chlorine”; “radial arm saw”. If this question does not apply to the incident, leave it blank.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AddOshaSidePanel|DateOfDeath')
    ).toBeInTheDocument();
  });

  describe('no time event', () => {
    it('should render time event input by default', () => {
      render(
        <Provider store={mockStore}>
          <CaseInformation {...defaultProps} />
        </Provider>
      );

      expect(screen.getByRole('checkbox')).not.toBeChecked();
      expect(
        screen.getByTestId('AddOshaSidePanel|TimeEvent')
      ).toBeInTheDocument();
    });

    it('should not render time event input if checkbox is ticked', () => {
      render(
        <Provider store={mockStore}>
          <CaseInformation {...defaultProps} />
        </Provider>
      );

      act(() => {
        fireEvent.click(screen.getByRole('checkbox'));
      });

      expect(screen.getByRole('checkbox')).toBeChecked();
      expect(
        screen.queryByTestId('AddOshaSidePanel|TimeEvent')
      ).not.toBeInTheDocument();
    });
  });
});
