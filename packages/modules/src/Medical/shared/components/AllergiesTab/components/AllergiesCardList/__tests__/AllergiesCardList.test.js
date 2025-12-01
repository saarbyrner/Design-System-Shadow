import { within, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { renderWithProvider, i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import PermissionsContext, {
  DEFAULT_CONTEXT_VALUE,
} from '@kitman/common/src/contexts/PermissionsContext';
import AllergiesCardList from '..';

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const store = storeFake({
  medicalApi: {},
  medicalHistory: {},
});

describe('<AllergiesCardList/>', () => {
  beforeEach(() => {
    window.featureFlags['edit-alerts-allergies'] = true;
  });

  afterEach(() => {
    window.featureFlags['edit-alerts-allergies'] = false;
  });

  const props = {
    onReachingEnd: jest.fn(),
    showAvatar: true,
    isLoading: false,
    allergies: [
      {
        id: 32,
        athlete_id: 40211,
        athlete: {
          id: 40211,
          firstname: 'Tomas',
          lastname: 'Albornoz',
          fullname: 'Albornoz, Tomas',
          avatar_url:
            'https://kitman-staging.imgix.net/kitman-staff/kitman-staff.png',
          shortname: 'T Albornoz',
          availability: 'unavailable',
          position: 'Second Row',
        },
        display_name: 'Custom Allergy Name',
        allergen_type: 'DrfirstDrug',
        allergen: {
          rcopia_id: '13100000122242',
          name: 'Posimir',
          groups: [
            {
              group_id: '526',
              name: 'Anesthetics - Amide Type - Select Amino Amides',
            },
          ],
        },
        name: 'Custom Allergy Name',
        ever_been_hospitalised: true,
        require_epinephrine: false,
        symptoms: 'Symptoms of whatever that Allergen is at all.',
        severity: 'mild',
        restricted_to_doc: false,
        restricted_to_psych: false,
        diagnosed_on: null,
      },
      {
        id: 29,
        athlete_id: 30693,
        athlete: {
          id: 30693,
          firstname: 'Federico',
          lastname: 'Baldasso',
          fullname: 'Baldasso, Federico',
          shortname: 'F Baldasso',
          availability: 'unavailable',
          position: 'Other',
        },
        display_name: 'Lactobacillus acidoph-L. bifid',
        allergen_type: 'DrfirstDrug',
        allergen: {
          rcopia_id: '18284',
          name: 'Lactobacillus acidoph-L. bifid',
          groups: [
            { group_id: '652', name: 'Lactobacillus Acidophilus' },
            { group_id: '656', name: 'Lactobacillus Bifidus' },
          ],
        },
        name: '',
        ever_been_hospitalised: true,
        require_epinephrine: false,
        symptoms: 'Symptoms of whatever that Allergen is at all.',
        severity: 'moderate',
        restricted_to_doc: false,
        restricted_to_psych: false,
        diagnosed_on: null,
      },
    ],
    athleteMedicalAlerts: [
      {
        alert_title: 'Medical Alert',
        athlete_id: 40211,
        id: 37,
        severity: 'mild',
        athlete: {
          id: 40211,
          firstname: 'Tomas',
          lastname: 'Albornoz',
          fullname: 'Albornoz, Tomas',
          avatar_url:
            'https://kitman-staging.imgix.net/kitman-staff/kitman-staff.png',
          shortname: 'T Albornoz',
          availability: 'unavailable',
          position: 'Second Row',
        },
        medical_alert: { id: 1, name: 'Sickle Cell' },
        restricted_to_doc: false,
        restricted_to_psych: false,
        display_name: 'Newest Medical Alert',
      },
    ],
    next_id: 1,
    t: i18nextTranslateStub(),
  };

  describe('rendering content', () => {
    it('renders the correct table column headings', async () => {
      renderWithProvider(
        <PermissionsContext.Provider
          value={{
            permissions: {
              ...DEFAULT_CONTEXT_VALUE.permissions,
              medical: {
                ...DEFAULT_CONTEXT_VALUE.permissions.medical,
                alerts: {
                  canArchive: true,
                },
                allergies: {
                  canArchive: true,
                },
              },
            },
          }}
        >
          <AllergiesCardList {...props} />
        </PermissionsContext.Provider>,
        store
      );

      const columns = screen.getAllByRole('columnheader');
      expect(columns).toHaveLength(7);

      expect(columns[0]).toHaveClass('dataTable__th--avatar');
      expect(columns[1]).toHaveClass('dataTable__th--type');
      expect(columns[2]).toHaveClass('dataTable__th--medicalFlagTitle');
      expect(columns[3]).toHaveClass('dataTable__th--details');
      expect(columns[4]).toHaveClass('dataTable__th--symptoms');
      expect(columns[5]).toHaveClass('dataTable__th--severity');
      expect(columns[6]).toHaveClass('dataTable__th--actions');

      expect(columns[0]).toHaveTextContent('Player');
      expect(columns[1]).toHaveTextContent('Type');
      expect(columns[2]).toHaveTextContent('Title');
      expect(columns[3]).toHaveTextContent('Details');
      expect(columns[4]).toHaveTextContent('Symptoms');
      expect(columns[5]).toHaveTextContent('Severity');
      expect(columns[6]).toHaveTextContent('');
    });

    it('renders the correct correct TextCell values', () => {
      render(<AllergiesCardList {...props} />);
      const textCells = screen.getAllByRole('cell');

      expect(textCells[0]).toHaveTextContent('Baldasso, Federico');
      expect(textCells[1]).toHaveTextContent('Allergy');
      expect(textCells[2]).toHaveTextContent('Lactobacillus acidoph-L. bifid');
      expect(textCells[3]).toHaveTextContent('Lactobacillus acidoph-L. bifid');
      expect(textCells[4]).toHaveTextContent(
        'Symptoms of whatever that Allergen is at all.'
      );
      expect(textCells[5]).toHaveTextContent('moderate');
    });

    it('should render tooltip if canArchive and canEdit permission is on', async () => {
      renderWithProvider(
        <PermissionsContext.Provider
          value={{
            permissions: {
              ...DEFAULT_CONTEXT_VALUE.permissions,
              medical: {
                ...DEFAULT_CONTEXT_VALUE.permissions.medical,
                alerts: {
                  canArchive: true,
                  canEdit: true,
                },
                allergies: {
                  canArchive: true,
                  canEdit: true,
                },
              },
            },
          }}
        >
          <AllergiesCardList {...props} />
        </PermissionsContext.Provider>,
        store
      );

      // Find the table rows
      const tableRows = screen.getAllByRole('row');

      // Find Medical Alert in the Table
      const medicalAlertActionCell = within(tableRows[3]).getAllByRole(
        'cell'
      )[6];

      const medicalAlertTooltipButton = within(
        medicalAlertActionCell
      ).getByRole('button');

      await waitFor(() =>
        expect(medicalAlertTooltipButton).toBeInTheDocument()
      );
      await userEvent.click(medicalAlertTooltipButton);

      // archive and edit actions for Medical Alert
      expect(
        screen.getByRole('button', { name: 'Archive' })
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    });
  });
});
