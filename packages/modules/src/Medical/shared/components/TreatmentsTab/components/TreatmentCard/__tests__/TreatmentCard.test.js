import { render, screen } from '@testing-library/react';
import moment from 'moment-timezone';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import PermissionsContext, {
  DEFAULT_CONTEXT_VALUE,
} from '@kitman/common/src/contexts/PermissionsContext';
import { MockedOrganisationContextProvider } from '@kitman/common/src/contexts/OrganisationContext/__tests__/testUtils';

import { data } from '../../../__tests__/mocks/getTreatmentSessions';
import TreatmentCard from '..';

const wrapRenderWithPermissions = (
  passedPermissions = {},
  children,
  orgId = 37
) => {
  return (
    <MockedOrganisationContextProvider
      organisationContext={{
        organisation: { id: orgId },
      }}
    >
      <PermissionsContext.Provider
        value={{
          permissions: {
            ...DEFAULT_CONTEXT_VALUE.permissions,
            ...passedPermissions,
          },
          permissionsRequestStatus: 'SUCCESS',
        }}
      >
        {children}
      </PermissionsContext.Provider>
    </MockedOrganisationContextProvider>
  );
};

describe('<TreatmentCard />', () => {
  const defaultLocale = moment.locale();

  beforeEach(() => {
    moment.tz.setDefault('UTC');
  });
  afterEach(() => {
    moment.tz.setDefault();
  });

  const props = {
    treatment: data.treatment_sessions[0],
    isEditing: false,
    setIsEditing: jest.fn(),
    showAthleteInformation: false,
    requestStatus: null,
    onClickReplicateTreatment: jest.fn(),
    onClickDuplicateTreatment: jest.fn(),
    onClickSaveTreatment: jest.fn(),
    t: i18nextTranslateStub(),
  };

  it('renders the correct content', () => {
    render(<TreatmentCard {...props} />);

    expect(screen.getByTestId('TreatmentCard|Header')).toHaveTextContent(
      '4:00 PM, Thursday August 12, 2021 - 4:30 PM, Tuesday August 17, 2021 firstname lastname'
    );
    expect(screen.getByTestId('TreatmentCard|DateAndTime')).toHaveTextContent(
      '4:00 PM, Thursday August 12, 2021 - 4:30 PM, Tuesday August 17, 2021'
    );
    expect(screen.getByTestId('TreatmentCard|Practitioner')).toHaveTextContent(
      'firstname lastname'
    );
    expect(screen.getByTestId('TreatmentCard|Content')).toBeInTheDocument();
    expect(
      screen.getByTestId('TreatmentCard|AttachmentsHeader')
    ).toHaveTextContent('Files (1)');
    expect(
      screen.getByTestId('TreatmentCard|AttachmentLink')
    ).toHaveTextContent('file.pdf.png');
    expect(screen.getAllByRole('listitem').length).toBe(1);
    expect(screen.getAllByRole('link').length).toBe(1);
    expect(screen.getAllByRole('link')[0]).toHaveTextContent('file.pdf.png');
    const h4s = screen.getAllByRole('heading', { level: 4 });
    expect(h4s[2]).toHaveTextContent('Created by firstname lastname');

    expect(screen.getByText(/Ice Pack/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /Doggo ipsum most angery pupper I have ever seen dat tungg tho tungg length boy long doggo borking doggo/i
      )
    ).toBeInTheDocument();
  });

  it('renders the correct content corectly for Irish timezones', () => {
    moment.locale('en-ie');
    render(<TreatmentCard {...props} />);

    expect(screen.getByTestId('TreatmentCard|Header')).toHaveTextContent(
      '16:00, Thursday 12 August 2021 - 16:30, Tuesday 17 August 2021 firstname lastname'
    );
    moment.locale(defaultLocale);
  });

  it('renders the correct content corectly for British timezones', () => {
    moment.locale('en-gb');
    render(<TreatmentCard {...props} />);

    expect(screen.getByTestId('TreatmentCard|Header')).toHaveTextContent(
      '16:00, Thursday 12 August 2021 - 16:30, Tuesday 17 August 2021 firstname lastname'
    );
    moment.locale(defaultLocale);
  });

  it('renders the correct content corectly for Spanish timezones', () => {
    moment.locale('es');
    render(<TreatmentCard {...props} />);

    expect(screen.getByTestId('TreatmentCard|Header')).toHaveTextContent(
      '16:00, jueves 12 de agosto de 2021 - 16:30, martes 17 de agosto de 2021 firstname lastname'
    );
    moment.locale(defaultLocale);
  });

  it('renders the correct content corectly for Japanese timezones', () => {
    moment.locale('ja');
    render(<TreatmentCard {...props} />);

    expect(screen.getByTestId('TreatmentCard|Header')).toHaveTextContent(
      '16:00, 木曜日 2021年8月12日 - 16:30, 火曜日 2021年8月17日 firstname lastname'
    );
    moment.locale(defaultLocale);
  });

  it('renders the datatable content', () => {
    const { container } = render(<TreatmentCard {...props} />);

    const dataTableRows = container.querySelectorAll('.dataTable__tr');
    expect(dataTableRows.length).toBe(2);

    const dataTableCells = container.querySelectorAll('.dataTable__td');
    expect(dataTableCells.length).toBe(10);

    expect(dataTableCells[0]).toHaveTextContent('Ice Pack');
    expect(dataTableCells[0]).toHaveTextContent(
      'Aug 12, 2021 by firstname lastname'
    );

    expect(dataTableCells[2]).toHaveTextContent('Left Calcaneus, Left A ...');
    expect(dataTableCells[3]).toHaveTextContent('Doggo ipsum most anger ...');
    expect(dataTableCells[4]).toHaveTextContent('General Treatment');
  });

  describe('when showAthleteInformation is true', () => {
    it('renders the athelete avater and name', () => {
      render(<TreatmentCard {...props} showAthleteInformation />);
      expect(
        screen.getByTestId('TreatmentCard|AthleteDetails')
      ).toHaveTextContent('firstname lastname');
      expect(
        screen.getByTestId('TreatmentCard|AthleteAvatar')
      ).toBeInTheDocument();
    });

    it('does render the medical profile when showAthleteInformation is true', () => {
      render(<TreatmentCard {...props} showAthleteInformation />);
      const userLink = screen.getAllByRole('link')[0];
      expect(userLink).toHaveTextContent('firstname lastname');
      expect(userLink).toHaveAttribute('href', '/medical/athletes/2');
    });
  });

  it('does not display the creator when created_by is null', () => {
    const noCreator = {
      ...data.treatment_sessions[0],
      annotation: {
        ...data.treatment_sessions[0].annotation,
        attachments: [
          {
            id: 1,
            url: 'url',
            filename: 'file.pdf.png',
            filetype: 'image/png',
            filesize: 9133,
            audio_file: false,
            confirmed: true,
            presigned_post: null,
            download_url: 'url',
          },
        ],
      },
    };
    render(<TreatmentCard {...props} treatment={noCreator} />);
    expect(
      screen.queryByText('Created by firstname lastname')
    ).not.toBeInTheDocument();
  });

  describe('[permissions] permissions.medical.treatments.canEdit', () => {
    describe('[feature-flag] treatments-billing', () => {
      beforeEach(() => {
        window.featureFlags['treatments-billing'] = true;
      });

      afterEach(() => {
        window.featureFlags['treatments-billing'] = false;
      });

      it('renders the correct actions', async () => {
        render(
          wrapRenderWithPermissions(
            {
              medical: {
                ...DEFAULT_CONTEXT_VALUE.permissions.medical,
                treatments: {
                  canEdit: true,
                },
              },
            },
            <TreatmentCard {...props} />
          )
        );
        const actionMenu = screen.getByRole('button');
        expect(actionMenu).toBeInTheDocument();
        await userEvent.click(actionMenu);
        const editBillingButton = screen.getAllByTestId(
          'TooltipMenu|ListItemButton'
        )[0];
        expect(editBillingButton).toHaveTextContent('Edit billing');
        await userEvent.click(editBillingButton);
        expect(props.setIsEditing).toHaveBeenCalled();
      });

      it('renders the correct actions when editing', async () => {
        const { container } = render(
          wrapRenderWithPermissions(
            {
              medical: {
                ...DEFAULT_CONTEXT_VALUE.permissions.medical,
                treatments: {
                  canEdit: true,
                },
              },
            },
            <TreatmentCard {...props} isEditing />
          )
        );

        const buttons = container.getElementsByClassName(
          'textButton--kitmanDesignSystem'
        );
        expect(buttons).toHaveLength(2);
        expect(buttons[0]).toHaveTextContent('Discard changes');
        await userEvent.click(buttons[0]);
        expect(props.setIsEditing).toHaveBeenCalled();
        expect(buttons[1]).toHaveTextContent('Save');
        await userEvent.click(buttons[1]);
        expect(props.onClickSaveTreatment).toHaveBeenCalled();
      });

      it('render the correct datatable content', async () => {
        const { container } = render(
          wrapRenderWithPermissions(
            {
              medical: {
                ...DEFAULT_CONTEXT_VALUE.permissions.medical,
                treatments: {
                  canEdit: true,
                },
              },
            },
            <TreatmentCard {...props} />
          )
        );
        const dataTableRows = container.querySelectorAll('.dataTable__tr');
        expect(dataTableRows.length).toBe(2);

        const dataTableCells = container.querySelectorAll('.dataTable__td');
        expect(dataTableCells.length).toBe(20);
        expect(dataTableCells[7]).toHaveTextContent('No');
        expect(dataTableCells[8]).toHaveTextContent('0.0');
        expect(dataTableCells[9]).toHaveTextContent('0.0');
        expect(dataTableCells[17]).toHaveTextContent('Yes');
        expect(dataTableCells[18]).toHaveTextContent('120.0');
        expect(dataTableCells[19]).toHaveTextContent('10.0');
      });

      describe('[feature-flag] referring-physician-treatments-diagnostics', () => {
        beforeEach(() => {
          window.featureFlags[
            'referring-physician-treatments-diagnostics'
          ] = true;
        });

        afterEach(() => {
          window.featureFlags[
            'referring-physician-treatments-diagnostics'
          ] = false;
        });

        it('render the correct datatable content', async () => {
          const { container } = render(
            wrapRenderWithPermissions(
              {
                medical: {
                  ...DEFAULT_CONTEXT_VALUE.permissions.medical,
                  treatments: {
                    canEdit: true,
                  },
                },
              },
              <TreatmentCard {...props} />
            )
          );
          const dataTableRows = container.querySelectorAll('.dataTable__tr');
          expect(dataTableRows.length).toBe(2);

          const dataTableCells = container.querySelectorAll('.dataTable__td');
          expect(dataTableCells.length).toBe(22);

          expect(dataTableCells[5]).toHaveTextContent('Mr Test Physician'); // referring physician
          expect(dataTableCells[6]).toHaveTextContent(''); // cpt code
          expect(dataTableCells[6]).toHaveTextContent(''); // icd code
          expect(dataTableCells[8]).toHaveTextContent('No');
          expect(dataTableCells[9]).toHaveTextContent('0.0');
          expect(dataTableCells[10]).toHaveTextContent('0.0');
          expect(dataTableCells[16]).toHaveTextContent('Mr Test Physician');
          expect(dataTableCells[17]).toHaveTextContent('12345');
          expect(dataTableCells[18]).toHaveTextContent('abcdef');
          expect(dataTableCells[19]).toHaveTextContent('Yes');
          expect(dataTableCells[20]).toHaveTextContent('120.0');
          expect(dataTableCells[21]).toHaveTextContent('10.0');
        });
      });

      describe('[feature-flag] treatments-billing-extra-fields', () => {
        beforeEach(() => {
          window.featureFlags['treatments-billing-extra-fields'] = true;
        });

        afterEach(() => {
          window.featureFlags['treatments-billing-extra-fields'] = false;
        });

        it('render the correct datatable content', async () => {
          const { container } = render(
            wrapRenderWithPermissions(
              {
                medical: {
                  ...DEFAULT_CONTEXT_VALUE.permissions.medical,
                  treatments: {
                    canEdit: true,
                  },
                },
              },
              <TreatmentCard {...props} />
            )
          );
          const dataTableRows = container.querySelectorAll('.dataTable__tr');
          expect(dataTableRows.length).toBe(2);

          const dataTableCells = container.querySelectorAll('.dataTable__td');
          expect(dataTableCells.length).toBe(28);

          expect(dataTableCells[7]).toHaveTextContent('No');
          expect(dataTableCells[8]).toHaveTextContent('0.0');
          expect(dataTableCells[9]).toHaveTextContent('0.0');
          expect(dataTableCells[10]).toHaveTextContent('0.0');
          expect(dataTableCells[11]).toHaveTextContent('0.0');
          expect(dataTableCells[12]).toHaveTextContent('0.0');
          expect(dataTableCells[13]).toHaveTextContent('Not paid yet');
          expect(dataTableCells[21]).toHaveTextContent('Yes');
          expect(dataTableCells[22]).toHaveTextContent('150.0');
          expect(dataTableCells[23]).toHaveTextContent('20.0');
          expect(dataTableCells[24]).toHaveTextContent('120.0');
          expect(dataTableCells[25]).toHaveTextContent('120.0');
          expect(dataTableCells[26]).toHaveTextContent('10.0');
          expect(dataTableCells[27]).toHaveTextContent('Aug 11, 2021');
        });
      });
    });

    describe('[feature-flag] treatments-multi-modality && [feature-flag] replicate-treatments', () => {
      beforeEach(() => {
        window.featureFlags['treatments-multi-modality'] = true;
        window.featureFlags['replicate-treatments'] = true;
      });

      afterEach(() => {
        window.featureFlags['treatments-multi-modality'] = false;
        window.featureFlags['replicate-treatments'] = false;
      });

      it('render the correct actions', async () => {
        render(
          wrapRenderWithPermissions(
            {
              medical: {
                ...DEFAULT_CONTEXT_VALUE.permissions.medical,
                treatments: {
                  canEdit: true,
                },
              },
            },
            <TreatmentCard {...props} />
          )
        );
        const actionMenu = screen.getByRole('button');
        expect(actionMenu).toBeInTheDocument();
        await userEvent.click(actionMenu);
        const replicateTreatmentButton = screen.getAllByTestId(
          'TooltipMenu|ListItemButton'
        )[0];
        expect(replicateTreatmentButton).toHaveTextContent(
          'Replicate treatment'
        );
        await userEvent.click(replicateTreatmentButton);
        expect(props.onClickReplicateTreatment).toHaveBeenCalled();
      });
    });

    describe('[feature-flag] duplicate-treatment', () => {
      beforeEach(() => {
        window.featureFlags['duplicate-treatment'] = true;
        render(
          wrapRenderWithPermissions(
            {
              medical: {
                ...DEFAULT_CONTEXT_VALUE.permissions.medical,
                treatments: {
                  canEdit: true,
                },
              },
            },
            <TreatmentCard {...props} />
          )
        );
      });

      afterEach(() => {
        window.featureFlags['duplicate-treatment'] = false;
      });

      it('render the correct actions', async () => {
        const actionMenu = screen.getByRole('button');
        expect(actionMenu).toBeInTheDocument();
        await userEvent.click(actionMenu);
        const duplicateTreatmentButton = screen.getAllByTestId(
          'TooltipMenu|ListItemButton'
        )[0];
        expect(duplicateTreatmentButton).toHaveTextContent(
          'Duplicate treatment'
        );
        await userEvent.click(duplicateTreatmentButton);
        expect(props.onClickDuplicateTreatment).toHaveBeenCalled();
      });
    });
  });

  describe('When the treatment was created by a previous organisation', () => {
    beforeEach(() => {
      window.featureFlags['treatments-billing'] = true;
      window.featureFlags['replicate-treatments'] = true;
    });

    afterEach(() => {
      window.featureFlags['treatments-billing'] = false;
      window.featureFlags['replicate-treatments'] = false;
    });

    it('does not render the actions, regardless of permissions or feature flags', async () => {
      render(
        wrapRenderWithPermissions(
          {
            medical: {
              ...DEFAULT_CONTEXT_VALUE.permissions.medical,
              treatments: {
                canEdit: true,
              },
            },
          },
          <TreatmentCard {...props} isEditing />,
          999
        )
      );

      expect(() => screen.getByRole('button')).toThrow();
    });
  });
});
