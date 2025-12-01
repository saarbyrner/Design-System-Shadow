import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import { defaultMedicalPermissions } from '@kitman/modules/src/Medical/shared/utils/testUtils';
import {
  medicationAttachment as mockAttachment,
  medicationArchivedAttachment as mockArchivedAttachment,
} from '@kitman/modules/src/Medical/shared/components/MedicationsTab/mocks/medicationAttachmentMock';
import MedicationCardList from '..';

const mockedPermissionsContextValue = {
  permissions: {
    medical: {
      ...defaultMedicalPermissions,
      stockManagement: {
        ...defaultMedicalPermissions.stockManagement,
        canDispense: true,
      },
      medications: {
        ...defaultMedicalPermissions.medications,
        canEdit: true,
        canArchive: false,
      },
    },
  },
  permissionsRequestStatus: 'SUCCESS',
};

describe('<MedicationsCardList/>', () => {
  describe('rendering content', () => {
    const props = {
      athleteId: 1234,
      includesToggle: false,
      requestStatus: 'SUCCESS',
      medications: [
        {
          display_name: 'Fabior 0.1 % topical foam',
          type: 'DrFirst',
          prescriber_id: null,
          external_prescriber_name: 'Carmen Benjamin',
          prescription_date: null,
          reason: null,
          issues: [],
          chronic_issues: [],
          tapered: false,
          directions: 'Apply',
          all_directions: 'Apply twice a day',
          quantity: '2',
          quantity_units: '',
          frequency: 'single dose',
          route: 'topto skin',
          refills: 0,
          note: 'better luck',
          start_date: '2023-01-03T00:00:00.000+00:00',
          end_date: '2023-02-07T00:00:00.000+00:00',
          paused: false,
          pause_reason: null,
          pharmacy: 'CVS',
          archived: false,
          status: 'active',
          source: 'Dispensed',
          attachments: [mockAttachment],
        },
        {
          display_name: 'Tapered Test',
          type: 'DrFirst',
          prescriber_id: null,
          external_prescriber_name: 'Carmen Benjamin',
          prescription_date: null,
          reason: null,
          issues: [],
          chronic_issues: [],
          tapered: true,
          directions: null,
          all_directions: 'take as directed',
          quantity: '2',
          quantity_units: '',
          frequency: null,
          route: 'topto skin',
          refills: 0,
          note: 'next time',
          start_date: '2023-01-03T00:00:00.000+00:00',
          end_date: '2023-02-07T00:00:00.000+00:00',
          paused: false,
          pause_reason: null,
          pharmacy: 'CVS',
          archived: false,
          status: 'active',
          source: 'Dispensed',
          attachments: [mockArchivedAttachment],
        },
      ],
      setSelectedMedication: jest.fn(),
      onViewSelectedMedicationAttachments: jest.fn(),
      t: i18nextTranslateStub(),
    };
    it('renders the correct table column headings', async () => {
      render(<MedicationCardList {...props} />);

      const columns = screen.getAllByRole('columnheader');
      expect(columns).toHaveLength(9);
      const headers = [
        'Medication',
        'Quantity',
        'Note',
        'Prescriber',
        'Source',
        'Start Date',
        'End Date',
        'Status',
      ];
      headers.forEach((header, index) => {
        expect(columns[index]).toHaveTextContent(header);
      });
      // 8th column is for actions
    });

    it('renders the correct correct TextCell values', () => {
      render(<MedicationCardList {...props} />);
      const textCells = screen.getAllByRole('cell');
      expect(textCells[0]).toHaveTextContent('Fabior 0.1 % topical foam');
      const contentValues = [
        'Apply twice a day',
        '2',
        'better luck',
        'Carmen Benjamin',
        'Dispensed',
        'Jan 03, 2023',
        'Feb 07, 2023',
        'active',
      ];
      contentValues.forEach((content, index) => {
        expect(textCells[index]).toHaveTextContent(content);
      });

      // 8th column is for actions

      // 2 pieces of  content rendering in same cell
      expect(textCells[9]).toHaveTextContent('Tapered Test');
      expect(textCells[9]).toHaveTextContent('take as directed');
    });

    it('renders the note column heading at player level', async () => {
      render(<MedicationCardList {...props} playerLevel />);

      const columns = screen.getAllByRole('columnheader');
      expect(columns).toHaveLength(10);
      const headers = [
        'Medication',
        'Quantity',
        'Reason',
        'Note',
        'Prescriber',
        'Source',
        'Start Date',
        'End Date',
        'Status',
      ];
      headers.forEach((header, index) => {
        expect(columns[index]).toHaveTextContent(header);
      });
      // 10th column is for actions
    });

    it('renders the correct correct TextCell values at player level', () => {
      render(<MedicationCardList {...props} playerLevel />);
      const textCells = screen.getAllByRole('cell');
      expect(textCells[0]).toHaveTextContent('Fabior 0.1 % topical foam');

      const contentValues = [
        'Apply twice a day',
        '2',
        '',
        'better luck',
        'Carmen Benjamin',
        'Dispensed',
        'Jan 03, 2023',
        'Feb 07, 2023',
        'active',
      ];
      contentValues.forEach((content, index) => {
        expect(textCells[index]).toHaveTextContent(content);
      });

      // 9th column is for actions

      // 2 pieces of  content rendering in same cell
      expect(textCells[10]).toHaveTextContent('Tapered Test');
      expect(textCells[10]).toHaveTextContent('take as directed');
    });

    it('renders the view attachment button', async () => {
      const user = userEvent.setup();
      render(<MedicationCardList {...props} playerLevel />);
      const fileButton = screen.getByRole('button', { name: 'test.pdf' });
      expect(
        within(fileButton).getByTestId('AttachFileOutlinedIcon')
      ).toBeInTheDocument();
      expect(fileButton).toBeInTheDocument();

      await user.click(fileButton);
      expect(props.setSelectedMedication).toHaveBeenCalledWith(
        props.medications[0]
      );
      expect(props.onViewSelectedMedicationAttachments).toHaveBeenCalled();
    });

    it('does not render the view attachment button for archived attachments', () => {
      render(<MedicationCardList {...props} playerLevel />);
      const fileButton = screen.queryByRole('button', {
        name: mockArchivedAttachment.name,
      });
      expect(fileButton).not.toBeInTheDocument();
    });

    it('does not render the actions column when the drug is not internal stock or internally dispensed', () => {
      render(
        <MockedPermissionContextProvider
          permissionsContext={mockedPermissionsContextValue}
        >
          <MedicationCardList {...props} />
        </MockedPermissionContextProvider>
      );

      expect(screen.queryByTestId('MeatballMenu')).not.toBeInTheDocument();
    });
  });

  describe('when meatball menu is available', () => {
    const props = {
      athleteId: 1234,
      includesToggle: false,
      requestStatus: 'SUCCESS',
      medications: [
        {
          type: 'InternalStock',
          external_prescriber_name: 'Carmen Benjamin',
          attachments: [],
        },
      ],
      t: i18nextTranslateStub(),
    };

    const fdbDispensableDrugs = [
      {
        type: 'InternalStock',
        drug_type: 'FdbDispensableDrug',
        prescriber: { fullname: 'Carmen Benjamin' },
      },
    ];

    it('does not show Archive option without permission', async () => {
      const user = userEvent.setup();
      render(
        <MockedPermissionContextProvider
          permissionsContext={mockedPermissionsContextValue}
        >
          <MedicationCardList {...props} />
        </MockedPermissionContextProvider>
      );
      const meatballMenu = screen.getByTestId('MeatballMenu');

      expect(meatballMenu).toBeInTheDocument();
      await user.click(within(meatballMenu).getByRole('button'));

      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.queryByText('Archive')).not.toBeInTheDocument();
    });

    it('shows Archive option with permission', async () => {
      const user = userEvent.setup();
      render(
        <MockedPermissionContextProvider
          permissionsContext={{
            permissions: {
              medical: {
                ...defaultMedicalPermissions,
                stockManagement: {
                  ...defaultMedicalPermissions.stockManagement,
                  canDispense: true,
                },
                medications: {
                  ...defaultMedicalPermissions.medications,
                  canEdit: true,
                  canArchive: true,
                },
              },
            },
            permissionsRequestStatus: 'SUCCESS',
          }}
        >
          <MedicationCardList {...props} />
        </MockedPermissionContextProvider>
      );
      const meatballMenu = screen.getByTestId('MeatballMenu');

      expect(meatballMenu).toBeInTheDocument();
      await user.click(within(meatballMenu).getByRole('button'));

      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('Archive')).toBeInTheDocument();
    });

    it('does not show favorite option when drug type is not present', async () => {
      const user = userEvent.setup();
      render(
        <MockedPermissionContextProvider
          permissionsContext={mockedPermissionsContextValue}
        >
          <MedicationCardList {...props} />
        </MockedPermissionContextProvider>
      );
      const meatballMenu = screen.getByTestId('MeatballMenu');

      expect(meatballMenu).toBeInTheDocument();
      await user.click(within(meatballMenu).getByRole('button'));

      expect(screen.getByText('Edit')).toBeInTheDocument();

      // does not render 'Favorite' option if the drug type is not FdbDispensableDrug
      expect(screen.queryByText('Favorite')).not.toBeInTheDocument();
    });

    it('does not show favorite option when drug type is not a supportedDrugType', async () => {
      const user = userEvent.setup();
      const unknownDrugs = [
        {
          type: 'InternalStock',
          drug_type: 'MadeUpDrugType',
          prescriber: { fullname: 'Carmen Benjamin' },
        },
      ];

      render(
        <MockedPermissionContextProvider
          permissionsContext={mockedPermissionsContextValue}
        >
          <MedicationCardList {...props} medications={unknownDrugs} />
        </MockedPermissionContextProvider>
      );
      const meatballMenu = screen.getByTestId('MeatballMenu');

      expect(meatballMenu).toBeInTheDocument();
      await user.click(within(meatballMenu).getByRole('button'));

      expect(screen.getByText('Edit')).toBeInTheDocument();

      // does not render 'Favorite' option if the drug type is not FdbDispensableDrug
      expect(screen.queryByText('Favorite')).not.toBeInTheDocument();
    });

    it('shows favorite option when drug type is FdbDispensableDrug', async () => {
      const user = userEvent.setup();

      render(
        <MockedPermissionContextProvider
          permissionsContext={mockedPermissionsContextValue}
        >
          <MedicationCardList {...props} medications={fdbDispensableDrugs} />
        </MockedPermissionContextProvider>
      );
      const meatballMenu = screen.getByTestId('MeatballMenu');

      expect(meatballMenu).toBeInTheDocument();
      await user.click(within(meatballMenu).getByRole('button'));
      expect(screen.getByText('Favorite')).toBeInTheDocument();
    });

    it('shows favorite option when drug type is Emr::Private::Models::NhsDmdDrug', async () => {
      const user = userEvent.setup();
      const nhsDrugs = [
        {
          type: 'InternalStock',
          drug_type: 'Emr::Private::Models::NhsDmdDrug',
          prescriber: { fullname: 'Carmen Benjamin' },
        },
      ];

      render(
        <MockedPermissionContextProvider
          permissionsContext={mockedPermissionsContextValue}
        >
          <MedicationCardList {...props} medications={nhsDrugs} />
        </MockedPermissionContextProvider>
      );
      const meatballMenu = screen.getByTestId('MeatballMenu');

      expect(meatballMenu).toBeInTheDocument();
      await user.click(within(meatballMenu).getByRole('button'));
      expect(screen.getByText('Favorite')).toBeInTheDocument();
    });

    describe('TRIAL ATHLETE - meatball menu', () => {
      const renderWithHiddenFilters = (hiddenFilters = []) => {
        render(
          <MockedPermissionContextProvider
            permissionsContext={{
              permissions: {
                medical: {
                  ...defaultMedicalPermissions,
                  stockManagement: {
                    ...defaultMedicalPermissions.stockManagement,
                    canDispense: true,
                  },
                  medications: {
                    ...defaultMedicalPermissions.medications,
                    canEdit: true,
                    canArchive: true,
                  },
                },
              },
              permissionsRequestStatus: 'SUCCESS',
            }}
          >
            <MedicationCardList
              {...props}
              medications={fdbDispensableDrugs}
              hiddenFilters={hiddenFilters}
            />
          </MockedPermissionContextProvider>
        );
      };

      it('does render by default', async () => {
        const user = userEvent.setup();

        renderWithHiddenFilters([]);
        const meatballMenu = screen.getByTestId('MeatballMenu');

        expect(meatballMenu).toBeInTheDocument();
        await user.click(within(meatballMenu).getByRole('button'));

        expect(screen.getByText('Edit')).toBeInTheDocument();
        expect(screen.getByText('Archive')).toBeInTheDocument();
        expect(screen.getByText('Favorite')).toBeInTheDocument();
      });

      it('does not render when hidden', () => {
        renderWithHiddenFilters(['add_medication_button']);

        const meatballMenu = screen.queryByTestId('MeatballMenu');

        expect(meatballMenu).not.toBeInTheDocument();
      });
    });
  });
});
