import { screen, within } from '@testing-library/react';
import moment from 'moment';

import {
  i18nextTranslateStub,
  renderWithUserEventSetup,
} from '@kitman/common/src/utils/test_utils';
import { data as mockedMedicalNotes } from '@kitman/services/src/mocks/handlers/medical/getMedicalNotes';
import {
  usePermissions,
  DEFAULT_CONTEXT_VALUE,
} from '@kitman/common/src/contexts/PermissionsContext';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import * as MediaHelper from '@kitman/common/src/utils/mediaHelper';

import PresentationView from '../components/PresentationView';

jest.mock('@kitman/common/src/contexts/PermissionsContext', () => {
  const actual = jest.requireActual(
    '@kitman/common/src/contexts/PermissionsContext'
  );
  return {
    ...actual,
    usePermissions: jest.fn(),
  };
});

jest.mock('@kitman/components/src/TooltipMenu', () => {
  return function MockTooltipMenu({ menuItems, tooltipTriggerElement }) {
    return (
      <div>
        {tooltipTriggerElement}
        {menuItems &&
          menuItems.map((item) => <div key={item.key}>{item.description}</div>)}
      </div>
    );
  };
});

jest.mock('@kitman/common/src/utils/dateFormatter', () => ({
  ...jest.requireActual('@kitman/common/src/utils/dateFormatter'),
  formatStandard: jest.fn(),
}));

jest.mock('@kitman/common/src/utils/mediaHelper', () => ({
  ...jest.requireActual('@kitman/common/src/utils/mediaHelper'),
  getContentTypeIcon: jest.fn(),
}));

jest.mock('@kitman/modules/src/Medical/shared/utils', () => ({
  ...jest.requireActual('@kitman/modules/src/Medical/shared/utils'),
  getIssueTitle: jest.fn((issue) => issue.title),
  getIssueTypePath: jest.fn((type) => type.toLowerCase()),
}));

const mockedActions = [
  {
    id: 1,
    text: 'action 1',
    onCallAction: jest.fn(),
  },
  {
    id: 2,
    text: 'action 2',
    onCallAction: jest.fn(),
  },
];

const mockedModificationType = {
  id: 2,
  name: 'Modification note',
  type: 'OrganisationAnnotationTypes::Modification',
};

const defaultPermissions = DEFAULT_CONTEXT_VALUE.permissions.medical;

describe('<PresentationView />', () => {
  let props;

  beforeEach(() => {
    props = {
      note: mockedMedicalNotes.medical_notes[0],
      showAthleteInformations: true,
      t: i18nextTranslateStub(),
      layoutProps: {},
    };

    // Mock default permissions
    usePermissions.mockReturnValue({
      permissions: {
        medical: {
          ...defaultPermissions,
          issues: {
            canView: false,
          },
        },
      },
      permissionsRequestStatus: 'SUCCESS',
    });

    DateFormatter.formatStandard.mockImplementation(({ date }) =>
      moment(date).format('MMM DD, YYYY')
    );
    MediaHelper.getContentTypeIcon.mockReturnValue('file-icon-pdf');
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-06-15T18:00:00Z'));
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe('default permissions', () => {
    test('renders the correct content', () => {
      renderWithUserEventSetup(<PresentationView {...props} />);
      expect(
        screen.getByTestId('PresentationView|AthleteInformations')
      ).toBeInTheDocument();
      expect(
        screen.getByAltText(props.note.annotationable.fullname)
      ).toHaveAttribute('src', 'https://kitman-staging.imgix.net/avatar.jpg');
      expect(screen.getByText('Rehab update')).toBeInTheDocument();
      expect(screen.getByText('Medical note')).toBeInTheDocument();
      expect(screen.getByTestId('PresentationView|Date')).toHaveTextContent(
        'Jun 23, 2021 - Jun 28, 2021'
      );
      expect(
        screen.getByText(
          /Collision during tackle in match against the Seahawks/
        )
      ).toBeInTheDocument();
      const attachmentsList = screen.getByTestId(
        'PresentationView|Attachments'
      );
      const firstAttachmentLink = within(attachmentsList).getByTestId(
        'PresentationView|AttachmentLink'
      );
      expect(firstAttachmentLink).toHaveTextContent(
        'Gordon_Morales Rehab Plan Jan 2021.pdf'
      );
      expect(
        firstAttachmentLink.querySelector('.file-icon-pdf')
      ).toBeInTheDocument();
      expect(firstAttachmentLink).toHaveAttribute('href', '/fileurl.pdf');
      expect(
        screen.getByTestId('PresentationView|Visibility')
      ).toHaveTextContent('Default');
      expect(screen.getByTestId('PresentationView|Roster')).toHaveTextContent(
        'Full roster'
      );
      expect(
        screen.getByTestId('PresentationView|AuthorDetails')
      ).toHaveTextContent('Created Jun 24, 2021 by John Jones');
      expect(
        screen.queryByTestId('PresentationView|Actions')
      ).not.toBeInTheDocument();
    });

    test('does not render the linked injury / illness information', () => {
      renderWithUserEventSetup(<PresentationView {...props} />);
      expect(
        screen.queryByTestId('PresentationView|LinkedIssues')
      ).not.toBeInTheDocument();
    });

    test('displays an empty string for author when author is missing', () => {
      renderWithUserEventSetup(
        <PresentationView
          {...props}
          note={{ ...props.note, author: { fullname: '' } }}
        />
      );
      expect(
        screen.getByTestId('PresentationView|AuthorDetails')
      ).toHaveTextContent('Created Jun 24, 2021 by');
    });

    test('does not show the athlete information when showAthleteInformations is false', () => {
      renderWithUserEventSetup(
        <PresentationView {...props} showAthleteInformations={false} />
      );
      expect(
        screen.queryByTestId('PresentationView|AthleteInformations')
      ).not.toBeInTheDocument();
    });

    test('renders a lock icon if the note is restricted to psych', () => {
      renderWithUserEventSetup(
        <PresentationView
          {...props}
          note={{ ...props.note, restricted_to_psych: true }}
        />
      );
      expect(
        screen
          .getByTestId('PresentationView|LeftContent')
          .querySelector('.icon-lock')
      ).toBeInTheDocument();
    });

    test('renders a lock icon if the note is restricted to docs', () => {
      renderWithUserEventSetup(
        <PresentationView
          {...props}
          note={{ ...props.note, restricted_to_doc: true }}
        />
      );
      expect(
        screen
          .getByTestId('PresentationView|LeftContent')
          .querySelector('.icon-lock')
      ).toBeInTheDocument();
    });

    test('renders the actions wrapper and the tooltip menu with the correct options when there are actions', () => {
      renderWithUserEventSetup(
        <PresentationView {...props} actions={mockedActions} />
      );
      const actionsSection = screen.getByTestId('PresentationView|Actions');
      expect(actionsSection).toBeInTheDocument();
      expect(screen.getByText('action 1')).toBeInTheDocument();
      expect(screen.getByText('action 2')).toBeInTheDocument();
    });

    describe('when the type note is modification', () => {
      test('displays the correct label when the note is active', () => {
        renderWithUserEventSetup(
          <PresentationView
            {...{
              ...props,
              note: {
                ...props.note,
                expired: false,
                organisation_annotation_type: mockedModificationType,
              },
            }}
          />
        );
        expect(screen.getByText('Active')).toBeInTheDocument();
      });

      test('does not display any label when the note is inactive', () => {
        renderWithUserEventSetup(
          <PresentationView
            {...{
              ...props,
              note: {
                ...props.note,
                expired: true,
                organisation_annotation_type: mockedModificationType,
              },
            }}
          />
        );
        expect(screen.queryByText('Active')).not.toBeInTheDocument();
      });

      test('hides the note actions when the note is inactive', () => {
        renderWithUserEventSetup(
          <PresentationView
            {...{
              ...props,
              note: {
                ...props.note,
                expired: true,
                organisation_annotation_type: mockedModificationType,
              },
            }}
            actions={mockedActions}
          />
        );
        expect(
          screen.queryByTestId('PresentationView|Actions')
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('[permissions] permissions.medical.issues.canView', () => {
    beforeEach(() => {
      usePermissions.mockReturnValue({
        permissions: {
          medical: {
            ...defaultPermissions,
            issues: {
              canView: true,
            },
          },
        },
        permissionsRequestStatus: 'SUCCESS',
      });
    });

    test('does render the medical profile', () => {
      renderWithUserEventSetup(<PresentationView {...props} />);
      const athleteLink = screen
        .getByTestId('PresentationView|AthleteInformations')
        .querySelector('a');
      expect(athleteLink).toHaveTextContent('Marcius Vega');
      expect(athleteLink).toHaveAttribute('href', '/medical/athletes/1');
    });

    test('does render the linked injury / illness information', () => {
      renderWithUserEventSetup(<PresentationView {...props} />);
      const linkedIssuesList = screen.getByTestId(
        'PresentationView|LinkedIssues'
      );
      const listItems = within(linkedIssuesList).getAllByRole('listitem');

      expect(listItems).toHaveLength(2);

      const firstIssueLinks = within(listItems[0]).getAllByRole('link');
      const firstIssueLink = firstIssueLinks.find(
        (link) => link.getAttribute('href') === '/medical/athletes/1/illness/1'
      );
      expect(firstIssueLink).toBeInTheDocument();

      const secondIssueLinks = within(listItems[1]).getAllByRole('link');
      const secondIssueLink = secondIssueLinks.find(
        (link) => link.getAttribute('href') === '/medical/athletes/1/injury/1'
      );
      expect(secondIssueLink).toBeInTheDocument();
    });
  });
});
