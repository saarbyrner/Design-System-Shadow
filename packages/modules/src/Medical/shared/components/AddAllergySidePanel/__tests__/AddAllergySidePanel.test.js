import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import selectEvent from 'react-select-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import colors from '@kitman/common/src/variables/colors';
import {
  defaultMedicalPermissions,
  MockedPermissionContextProvider,
} from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import {
  mockedDefaultPermissionsContextValue,
  mockedPastAthlete,
} from '@kitman/modules/src/Medical/shared/utils/testUtils';
import { VirtuosoMockContext } from 'react-virtuoso';
import { useGetAthleteDataQuery } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import { data as mockedNonMedicalAllergies } from '../../../../../../../services/src/mocks/handlers/medical/getNonMedicalAllergies';
import AddAllergySidePanel from '../index';
import {
  mockedSquadAthletes,
  mockSelectedAllergy,
} from './mocks/allergySidePanelMocks';

// Mock the RTK Query hook from the old spec file
jest.mock(
  '@kitman/modules/src/Medical/shared/redux/services/medicalShared',
  () => ({
    useGetAthleteDataQuery: jest.fn(),
  })
);

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const store = storeFake({
  medicalApi: {},
});

describe('<AddAllergySidePanel />', () => {
  let component;
  const dispatchMock = jest.fn();

  const props = {
    isOpen: true,
    isPastAthlete: false,
    athleteData: {},
    isAthleteSelectable: true,
    initialDataRequestStatus: null,
    squadAthletes: mockedSquadAthletes,
    nonMedicalAllergies: mockedNonMedicalAllergies.map((nonMedicalAllergy) => {
      return {
        label: nonMedicalAllergy.name,
        type: nonMedicalAllergy.allergen_type,
        value: nonMedicalAllergy.id,
      };
    }),
    athleteId: null,
    onSaveAllergy: jest.fn(),
    onSaveAllergyStart: jest.fn(),
    onSaveAllergySuccess: jest.fn(),
    onClose: jest.fn(),
    t: i18nextTranslateStub(),
  };

  const componentRender = (componentProps = props, virtuosoMock = false) =>
    render(
      <MockedPermissionContextProvider
        permissionsContext={{
          ...mockedDefaultPermissionsContextValue,
          permissions: {
            ...mockedDefaultPermissionsContextValue.permissions,
            medical: {
              ...defaultMedicalPermissions,
              allergies: {
                canCreate: true,
              },
            },
          },
        }}
      >
        <Provider store={store}>
          {virtuosoMock ? (
            <VirtuosoMockContext.Provider
              value={{ viewportHeight: 2000, itemHeight: 50 }}
            >
              <AddAllergySidePanel {...componentProps} />
            </VirtuosoMockContext.Provider>
          ) : (
            <AddAllergySidePanel {...componentProps} />
          )}
        </Provider>
      </MockedPermissionContextProvider>
    );

  beforeEach(() => {
    i18nextTranslateStub();
    // Provide a default mock implementation for the hook
    useGetAthleteDataQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the panel with the correct title', () => {
    componentRender();
    expect(screen.getByText('Add allergy')).toBeInTheDocument();
  });

  describe('when viewing a pre-selected squad athlete', () => {
    beforeEach(() => {
      component = componentRender({ ...props, athleteId: 1 });
    });
    it('has the correct name for the athlete id', async () => {
      await expect(screen.getByText('Athlete 1 Name')).toBeInTheDocument();
    });
  });

  describe('when viewing a past athlete loaded via API', () => {
    it('renders a disabled select pre-filled with only the past athlete', async () => {
      useGetAthleteDataQuery.mockReturnValue({ data: mockedPastAthlete });

      componentRender({
        ...props,
        athleteId: mockedPastAthlete.id,
        isPastAthlete: true,
        isAthleteSelectable: false,
      });

      // The hook is async, so we wait for the past athlete's name to appear
      await screen.findByText(mockedPastAthlete.fullname);

      // The role for react-select components is 'textbox'
      const athleteSelect = screen.getByRole('textbox', { name: 'Athlete' });
      // The select should now be disabled
      expect(athleteSelect).toBeDisabled();
    });
  });

  describe('Editing a Medical Alert', () => {
    it('renders the default form', () => {
      component = componentRender();
      expect(
        screen.getByTestId('AddAllergySidePanel|Parent')
      ).toBeInTheDocument();

      expect(
        screen.getByTestId('AddAllergySidePanel|AthleteSelect')
      ).toBeInTheDocument();

      expect(
        screen.getByTestId('AddAllergySidePanel|AllergenTypeSelect')
      ).toBeInTheDocument();

      expect(
        screen.getByTestId('AddAllergySidePanel|AllergenSelect')
      ).toBeInTheDocument();

      expect(
        screen.getByTestId('AddAllergySidePanel|Symptoms')
      ).toBeInTheDocument();

      expect(
        screen.getByTestId('AddAllergySidePanel|Severity')
      ).toBeInTheDocument();

      expect(
        screen.getByTestId('AddAllergySidePanel|CustomAllergyName')
      ).toBeInTheDocument();

      const buttons = screen.getAllByRole('button');

      // buttons[1...8] are <SegmentedControl /> buttons
      expect(buttons).toHaveLength(11);

      const everHospitalisedButton = buttons[1];
      expect(everHospitalisedButton).toBeInTheDocument();
      expect(everHospitalisedButton).toHaveTextContent('Yes');

      const requireEpinephrineButton = buttons[4];
      expect(requireEpinephrineButton).toBeInTheDocument();
      expect(requireEpinephrineButton).toHaveTextContent('No');

      const severeButton = buttons[5];
      const moderateButton = buttons[6];
      const mildButton = buttons[7];
      const notSpecifiedButton = buttons[8];

      expect(severeButton).toHaveTextContent('Severe');
      expect(moderateButton).toHaveTextContent('Moderate');
      expect(mildButton).toHaveTextContent('Mild');
      expect(notSpecifiedButton).toHaveTextContent('Not Specified');

      const addMoreDetailButton = buttons[9];
      expect(addMoreDetailButton).toHaveTextContent('Add more detail');

      const saveAllergyButton = buttons[10];
      expect(saveAllergyButton).toHaveTextContent('Save');

      userEvent.click(saveAllergyButton);

      const formTitle = component.getByTestId('sliding-panel|title');
      expect(formTitle).toHaveTextContent('Add allergy');
    });

    describe('button interactions', () => {
      let buttons;
      let reducerSpy;

      beforeEach(() => {
        const useReducerMock = (reducer, initialState) => [
          initialState,
          dispatchMock,
        ];
        reducerSpy = jest
          .spyOn(React, 'useReducer')
          .mockImplementation(useReducerMock);
        component = componentRender({ ...props, athleteId: 21 });
        buttons = screen.getAllByRole('button');
      });

      afterEach(() => {
        reducerSpy.mockRestore();
      });

      it('calls onClose when userEvent clicks the close icon', async () => {
        await userEvent.click(buttons[0]);
        expect(props.onClose).toHaveBeenCalled();
      });

      it('finds and opens optional Date of Allergy field', async () => {
        await userEvent.click(buttons[9]);
        const toolTipText =
          document.getElementsByClassName('tooltipMenu__text');

        expect(toolTipText[0]).toHaveTextContent('Diagnosed on');
        const toolTip = screen.getByText('Diagnosed on');
        await userEvent.click(toolTip);

        const dateLabel = screen.getByLabelText('Date');
        expect(dateLabel).toBeInTheDocument();
      });

      it('dispatches the hospitalized call when changed', async () => {
        await userEvent.click(
          component.getAllByTestId('SegmentedControl|Button')[0]
        );
        expect(dispatchMock).toHaveBeenCalledWith({
          type: 'SET_EVER_HOSPITALISED',
          everBeenHospitalised: true,
        });
      });

      it('dispatches the epi pen call when changed', async () => {
        await userEvent.click(
          component.getAllByTestId('SegmentedControl|Button')[3]
        );
        expect(dispatchMock).toHaveBeenCalledWith({
          type: 'SET_REQUIRE_EPINEPHRINE',
          requireEpinephrine: false,
        });
      });

      it('dispatches the severity call when changed', async () => {
        await userEvent.click(
          component.getAllByTestId('SegmentedControl|Button')[6]
        );
        expect(dispatchMock).toHaveBeenCalledWith({
          severity: 'mild',
          type: 'SET_SEVERITY',
        });
      });

      it('dispatches the symptoms call when changed', () => {
        fireEvent.change(component.getAllByRole('textbox')[3], {
          target: { value: 'test string' },
        });
        expect(dispatchMock).toHaveBeenCalledWith({
          symptoms: 'test string',
          type: 'SET_SYMPTOMS',
        });
      });

      it('dispatches the custom allergy name call when changed', () => {
        fireEvent.change(component.getAllByRole('textbox')[4], {
          target: { value: 'test string' },
        });
        expect(dispatchMock).toHaveBeenCalledWith({
          customAllergyName: 'test string',
          type: 'SET_CUSTOM_ALLERGY_NAME',
        });
        expect(dispatchMock).toHaveBeenCalledWith({
          allergyName: 'test string',
          type: 'SET_ALLERGY_NAME',
        });
      });

      it('shows the allergy date', async () => {
        await userEvent.click(component.getByText('Add more detail'));
        await userEvent.click(component.getByText('Diagnosed on'));
        expect(component.getByText('Date')).toBeInTheDocument();
      });
    });

    describe('MISC ALLERGIES', () => {
      beforeEach(() => {
        component = componentRender({ ...props, athleteId: 21 }, true);
      });

      it('finds misc allergies dropdown', async () => {
        expect(
          screen.getByTestId('AddAllergySidePanel|AllergenTypeSelect')
        ).toBeInTheDocument();

        await screen.findByText('Add allergy');

        selectEvent.openMenu(
          screen
            .getByTestId('AddAllergySidePanel|AllergenTypeSelect')
            .querySelector('.kitmanReactSelect input')
        );
        expect(screen.getByText('Chlorine allergy')).toBeInTheDocument();
        expect(screen.getByText('Food allergy')).toBeInTheDocument();
        expect(screen.getByText('Metal allergy')).toBeInTheDocument();
        expect(screen.getByText('Mold allergy')).toBeInTheDocument();
        expect(screen.getByText('Tree allergy')).toBeInTheDocument();
        expect(screen.getByText('Animal / Insect allergy')).toBeInTheDocument();
        expect(screen.getByText('Pollen allergy')).toBeInTheDocument();
        expect(
          screen.getByText('Latex and rubber allergy')
        ).toBeInTheDocument();

        // checks that input gets populated once option is clicked
        await selectEvent.select(
          screen
            .getByTestId('AddAllergySidePanel|AllergenTypeSelect')
            .querySelector('.kitmanReactSelect input'),
          'Food allergy'
        );
        selectEvent.openMenu(
          screen
            .getByTestId('AddAllergySidePanel|AllergenSelect')
            .querySelector('.kitmanReactSelect input')
        );
        // checks filters are working properly
        expect(screen.getByText('Celery')).toBeInTheDocument();
        expect(screen.queryByText('Mold')).not.toBeInTheDocument();
      });
    });
  });

  describe('when viewing a past athlete', () => {
    beforeEach(() => {
      component = componentRender({ ...props, athleteId: 1 });
    });
    it('has the correct name for the athlete id', async () => {
      await expect(screen.getByText('Athlete 1 Name')).toBeInTheDocument();
    });
  });

  describe('Editing a selected Medical Alert', () => {
    beforeEach(() => {
      component = componentRender({
        ...props,
        selectedAllergy: mockSelectedAllergy,
      });
    });

    it('autopopulates the form with the passed in values', async () => {
      // this first waitFor is needed becuase we need to wait for state to be set
      await waitFor(() => {
        expect(screen.getByText('Athlete 1 Name')).toBeInTheDocument();
      });

      expect(screen.getByText('Allergy details')).toBeInTheDocument();
      // expect(screen.getByText('Food allergy')).toBeInTheDocument();
      expect(screen.getByText('Milk')).toBeInTheDocument();

      const selectedSeverity = screen.getAllByRole('button')[3];
      expect(selectedSeverity).toHaveStyle({
        backgroundColor: colors.grey_200,
      });
    });
  });
});
