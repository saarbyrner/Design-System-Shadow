import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { data as mockCSVAthlete } from '@kitman/modules/src/shared/MassUpload/services/mocks/data/mock_athlete_csv';
import MassUploadModal from '../MassUploadModal';

jest.mock('@kitman/modules/src/shared/MassUpload/services/massUpload');

const actualUseParseCSV = jest.requireActual('../../hooks/useParseCSV');

const columns = [
  {
    id: 'FirstName',
    row_key: 'FirstName',
    content: <div>FirstName</div>,
  },
  {
    id: 'LastName',
    row_key: 'LastName',
    content: <div>LastName Status</div>,
  },
  {
    id: 'Email',
    row_key: 'Email',
    content: <div>Email</div>,
  },
  {
    id: 'DOB',
    row_key: 'DOB',
    content: <div>DOB</div>,
  },
  {
    id: 'SquadName',
    row_key: 'SquadName',
    content: <div>SquadName</div>,
  },
  {
    id: 'Country',
    row_key: 'Country',
    content: <div>Country</div>,
  },
  {
    id: 'Position',
    row_key: 'Position',
    content: <div>Position</div>,
  },
];

const rows = [
  ...mockCSVAthlete.validData,
  ...mockCSVAthlete.invalidData.map((row) => ({
    ...row,
    classnames: {
      is__error: true,
    },
  })),
].map((data, index) => ({
  id: index,
  cells: [
    {
      id: 'FirstName',
      content: <span>{data.FirstName}</span>,
    },
    {
      id: 'LastName',
      content: <span>{data.LastName}</span>,
    },
    {
      id: 'Email',
      content: <span>{data.Email}</span>,
    },
    {
      id: 'DOB',
      content: <span>{data.DOB}</span>,
    },
    {
      id: 'SquadName',
      content: <span>{data.SquadName}</span>,
    },
    {
      id: 'Country',
      content: <span>{data.Country}</span>,
    },
    {
      id: 'Position',
      content: <span>{data.Position}</span>,
    },
  ],
  classnames: {
    athlete__row: true,
    ...data.classnames,
  },
}));

describe('<MassUploadModal />', () => {
  const i18nT = i18nextTranslateStub();

  const props = {
    title: 'Mass Upload title',
    buttonText: 'Trigger button',
    useGrid: () => ({
      grid: {
        rows: [],
        columns: [],
        emptyTableText: '',
        id: 0,
      },
      ruleset: {},
      isLoading: false,
      isError: false,
    }),
    onProcessCSV: jest.fn(),
    expectedHeaders: [],
    t: i18nT,
  };

  const userTypes = [
    {
      type: 'athlete',
      buttonText: 'Upload Athletes',
      title: 'Upload Athletes',
    },
    { type: 'user', buttonText: 'Upload Users', title: 'Upload Users' },
    {
      type: 'official',
      buttonText: 'Upload Officials',
      title: 'Upload Officials',
    },
    { type: 'scout', buttonText: 'Upload Scouts', title: 'Upload Scouts' },
  ];

  it('hides the trigger button when ‘hideButton’ prop is passed', () => {
    renderWithRedux(<MassUploadModal {...props} hideButton />);

    expect(
      screen.queryByRole('button', { name: props.buttonText })
    ).not.toBeInTheDocument();
  });

  describe('Different usertypes', () => {
    describe('Trigger Element content', () => {
      userTypes.forEach((userProps) => {
        it(`displays the correct content for ${userProps.type}`, async () => {
          const user = userEvent.setup();
          renderWithRedux(<MassUploadModal {...props} {...userProps} />);
          await user.click(
            screen.getByRole('button', { name: userProps.title })
          );
          expect(screen.getByTestId('Modal|Title')).toHaveTextContent(
            userProps.title
          );
        });
      });
    });
    describe('Modal content', () => {
      userTypes.forEach((userProps) => {
        it(`Has the correct modal content for ${userProps.type}`, async () => {
          const user = userEvent.setup();
          renderWithRedux(<MassUploadModal {...props} {...userProps} />);
          await user.click(
            screen.getByRole('button', { name: userProps.title })
          );
          expect(
            screen.getByRole('button', {
              name: /cancel/i,
              hidden: true,
            })
          ).toBeInTheDocument();
          expect(
            screen.getByRole('button', {
              name: 'Upload',
              hidden: true,
            })
          ).toBeInTheDocument();
          expect(
            screen.getByRole('button', {
              name: 'Upload',
              hidden: true,
            })
          ).toBeDisabled();
          expect(
            screen.getByRole('tab', { name: 'Instructions', hidden: true })
          ).toBeInTheDocument();
          expect(
            screen.getByRole('tab', { name: 'Upload', hidden: true })
          ).toBeInTheDocument();
        });
      });
    });
  });

  describe('Ruleset present', () => {
    const localProps = {
      ...props,
      useGrid: () => ({
        grid: {
          rows: [],
          columns: [],
          emptyTableText: '',
          id: 0,
        },
        ruleset: {
          GenericKey: {
            description: 'Such description',
            exampleText: 'Very example',
            exampleList: ['So list', 'Much example'],
          },
        },
        isLoading: false,
        isError: false,
      }),
    };
    it('renders the ruleset', async () => {
      const user = userEvent.setup();
      renderWithRedux(<MassUploadModal {...localProps} />);
      await user.click(screen.getByRole('button', { name: props.buttonText }));

      expect(screen.getByText('GenericKey')).toBeInTheDocument();
      expect(screen.getByText('Description:')).toBeInTheDocument();
      expect(screen.getByText('Such description')).toBeInTheDocument();
      expect(screen.getByText('Example:')).toBeInTheDocument();
      expect(screen.getByText('Very example')).toBeInTheDocument();
      expect(screen.getByText('Accepted values:')).toBeInTheDocument();
      expect(screen.getByText('So list')).toBeInTheDocument();
      expect(screen.getByText('Much example')).toBeInTheDocument();
    });
  });

  describe('Changing tab', () => {
    it('renders the ruleset', async () => {
      const user = userEvent.setup();
      renderWithRedux(<MassUploadModal {...props} />);
      await user.click(screen.getByRole('button', { name: props.buttonText }));
      await user.click(
        screen.getByRole('tab', { name: 'Upload', hidden: true })
      );
      expect(
        screen.getByTestId('RegistrationForm|FormDocumentUploader')
      ).toBeInTheDocument();
    });
  });

  describe('Invalid grid data', () => {
    const localProps = {
      ...props,
      useGrid: () => ({
        grid: {
          columns,
          rows,
          emptyTableText: '',
          id: 0,
        },
        ruleset: {
          GenericKey: {
            description: 'Such description',
            exampleText: 'Very example',
            exampleList: ['So list', 'Much example'],
          },
        },
        isLoading: false,
        isError: false,
      }),
    };

    it('disables the upload button', async () => {
      const user = userEvent.setup();
      renderWithRedux(<MassUploadModal {...localProps} />);

      await user.click(screen.getByRole('button', { name: props.buttonText }));
      await user.click(
        screen.getByRole('tab', { name: 'Upload', hidden: true })
      );
      await user.click(
        screen.getByRole('tab', { name: 'Upload', hidden: true })
      );

      expect(
        screen.getByTestId('RegistrationForm|FormDocumentUploader')
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', {
          name: 'Upload',
          hidden: true,
        })
      ).toBeDisabled();
    });

    it('shows all rows', async () => {
      const user = userEvent.setup();

      jest.spyOn(actualUseParseCSV, 'default').mockImplementation(() => ({
        onRemoveCSV: () => {},
        onHandleParseCSV: () => {},
        queueState: {},
        parseResult: {},
        setParseState: () => {},
        parseState: 'COMPLETE',
        isDisabled: false,
      }));

      renderWithRedux(<MassUploadModal {...localProps} />);

      await user.click(screen.getByRole('button', { name: props.buttonText }));
      await user.click(
        screen.getByRole('tab', { name: 'Upload', hidden: true })
      );

      expect(
        screen.getByText(mockCSVAthlete.validData[0].SquadName)
      ).toBeInTheDocument();
      expect(
        screen.getByText(mockCSVAthlete.invalidData[0].SquadName)
      ).toBeInTheDocument();
    });

    it(
      'shows only rows with errors when' +
        ' ‘mustShowOnlyRowsWithErrorsOnParseStateComplete’ prop is passed',
      async () => {
        const user = userEvent.setup();

        jest.spyOn(actualUseParseCSV, 'default').mockImplementation(() => ({
          onRemoveCSV: () => {},
          onHandleParseCSV: () => {},
          queueState: {},
          parseResult: {},
          setParseState: () => {},
          parseState: 'COMPLETE',
          isDisabled: false,
        }));

        renderWithRedux(
          <MassUploadModal
            {...localProps}
            mustShowOnlyRowsWithErrorsOnParseStateComplete
          />
        );

        await user.click(
          screen.getByRole('button', { name: props.buttonText })
        );
        await user.click(
          screen.getByRole('tab', { name: 'Upload', hidden: true })
        );

        expect(
          screen.queryByText(mockCSVAthlete.validData[0].SquadName)
        ).not.toBeInTheDocument();
        expect(
          screen.getByText(mockCSVAthlete.invalidData[0].SquadName)
        ).toBeInTheDocument();
      }
    );
  });
});
