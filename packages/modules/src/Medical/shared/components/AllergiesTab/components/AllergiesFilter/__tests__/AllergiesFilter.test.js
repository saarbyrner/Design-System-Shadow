import { render, screen } from '@testing-library/react';
import selectEvent from 'react-select-event';
import { Provider } from 'react-redux';
import {
  defaultMedicalPermissions,
  MockedPermissionContextProvider,
} from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import { mockedDefaultPermissionsContextValue } from '@kitman/modules/src/Medical/shared/utils/testUtils';
import sinon from 'sinon';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import AllergiesFilter from '..';

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const store = storeFake({
  medicalApi: {},
  addAllergySidePanel: {
    isOpen: true,
    initialInfo: {
      isAthleteSelectable: true,
    },
  },
  medicalHistory: {},
});

describe('<AllergiesFilter/>', () => {
  const dispatchSpy = sinon.spy();

  beforeEach(() => {
    storeFake({
      medicalApi: {},
      medicalHistory: {},
    });
    store.dispatch = dispatchSpy;
  });

  const props = {
    positionGroups: [
      { label: 'Hooker', value: 78 },
      { label: 'Second Row', value: 87 },
    ],
    squads: [
      { label: 'Academy Squad', value: 2 },
      { label: 'International Squad', value: 3 },
    ],
    onChangeFilter: jest.fn(),
    onClickAddAllergy: jest.fn(),
    initialDataRequest: ['PENDING'],
    hiddenFilters: [],
    filters: {
      athlete_id: 21,
      search_expression: '',
      squad_ids: [6],
      position_ids: [2, 3],
      severities: ['mild', 'moderate', 'severe'],
    },
    t: i18nextTranslateStub(),
  };

  describe('renders filters', () => {
    it('populates Squad select', async () => {
      render(
        <MockedPermissionContextProvider
          permissionsContext={{
            ...mockedDefaultPermissionsContextValue,
            permissions: {
              ...mockedDefaultPermissionsContextValue.permissions,
              medical: {
                ...defaultMedicalPermissions,
                allergies: {
                  canView: true,
                },
              },
            },
          }}
        >
          <Provider store={store}>
            <AllergiesFilter {...props} />
          </Provider>
        </MockedPermissionContextProvider>
      );

      const selectModeContainer = screen.getAllByTestId(
        'AllergiesFilter|Squad'
      )[0];

      selectEvent.openMenu(
        selectModeContainer.querySelector('.kitmanReactSelect input')
      );

      expect(screen.getByText('Academy Squad')).toBeInTheDocument();
      expect(screen.getByText('International Squad')).toBeInTheDocument();
    });

    it('populates Severity select', async () => {
      render(
        <MockedPermissionContextProvider
          permissionsContext={{
            ...mockedDefaultPermissionsContextValue,
            permissions: {
              ...mockedDefaultPermissionsContextValue.permissions,
              medical: {
                ...defaultMedicalPermissions,
                allergies: {
                  canView: true,
                },
              },
            },
          }}
        >
          <Provider store={store}>
            <AllergiesFilter {...props} />
          </Provider>
        </MockedPermissionContextProvider>
      );

      const selectModeContainer = screen.getAllByTestId(
        'AllergiesFilter|Severity'
      )[0];

      selectEvent.openMenu(
        selectModeContainer.querySelector('.kitmanReactSelect input')
      );

      expect(screen.getByText('Mild')).toBeInTheDocument();
      expect(screen.getByText('Moderate')).toBeInTheDocument();
      expect(screen.getByText('Severe')).toBeInTheDocument();
    });

    it('populates Position select', async () => {
      render(
        <MockedPermissionContextProvider
          permissionsContext={{
            ...mockedDefaultPermissionsContextValue,
            permissions: {
              ...mockedDefaultPermissionsContextValue.permissions,
              medical: {
                ...defaultMedicalPermissions,
                allergies: {
                  canView: true,
                },
              },
            },
          }}
        >
          <Provider store={store}>
            <AllergiesFilter {...props} />
          </Provider>
        </MockedPermissionContextProvider>
      );

      const selectModeContainer = screen.getAllByTestId(
        'AllergiesFilter|Position'
      )[0];

      selectEvent.openMenu(
        selectModeContainer.querySelector('.kitmanReactSelect input')
      );

      expect(screen.getByText('Hooker')).toBeInTheDocument();
      expect(screen.getByText('Second Row')).toBeInTheDocument();
    });
  });
});
