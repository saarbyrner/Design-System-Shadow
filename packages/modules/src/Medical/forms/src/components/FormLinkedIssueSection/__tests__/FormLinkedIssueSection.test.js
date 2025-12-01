import { render, screen } from '@testing-library/react';
import { setI18n } from 'react-i18next';
import selectEvent from 'react-select-event';

import i18n from '@kitman/common/src/utils/i18n';
import {
  renderWithUserEventSetup,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';
import useConcussionInjuryResults from '@kitman/modules/src/Medical/shared/hooks/useConcussionInjuryResults';

import FormLinkedIssueSection from '../index';

jest.mock(
  '@kitman/modules/src/Medical/shared/hooks/useConcussionInjuryResults'
);

setI18n(i18n);

describe('<FormLinkedIssueSection />', () => {
  const mockData = [
    {
      type: 'injury',
      id: 77704,
      athlete_id: 22213,
      osics: {
        pathology: {
          id: 420,
          name: 'Concussion',
        },
      },
      occurrence_id: 80239,
      occurrence_date: '2022-05-29T00:00:00+01:00',
    },
    {
      type: 'illness',
      id: 77705,
      athlete_id: 22213,
      osics: {
        pathology: {
          id: 420,
          name: 'Some Illness',
        },
      },
      occurrence_id: 80240,
      occurrence_date: '2022-09-29T00:00:00+01:00',
    },
  ];

  const props = {
    athlete_id: '1234',
    formInfo: {
      formMeta: {
        id: 46,
        category: 'medical',
        group: 'pac_12',
        key: 'concussion_incident',
        name: 'Concussion incident',
        form_type: 'incident',
        config: null,
        enabled: true,
        created_at: '2022-08-23T15:40:38Z',
        updated_at: '2022-08-23T15:40:38Z',
      },
      athlete: {
        id: 1234,
        firstname: 'Adam',
        lastname: 'Conway',
        fullname: 'Conway Adam',
        position: {
          id: 77,
          name: 'Scrum Half',
          order: 8,
        },
        availability: 'unavailable',
        avatar_url:
          'https://kitman-staging.imgix.net/kitman-staff/kitman-staff.png?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
      },
      editor: {
        id: 93972,
        firstname: 'Stefano',
        lastname: 'Santomauro',
        fullname: 'Stefano Santomauro',
      },
      status: 'complete',
      date: '2022-07-12T00:00:00Z',
      created_at: '2022-07-12T00:00:00Z',
      updated_at: '2022-07-12T00:00:00Z',
      linked_injuries_illnesses: { ...mockData },
    },
    linkedInjuriesIllnesses: mockData,
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    useConcussionInjuryResults.mockReturnValue({
      concussionSelectOptions: [
        { label: 'Concussion', value: 80239 },
        { label: 'Some Illness', value: 80240 },
      ],
      requestStatus: 'SUCCESS',
      setRequestStatus: jest.fn(),
    });
  });

  it('renders expected fields', () => {
    render(<FormLinkedIssueSection {...props} />);
    expect(
      screen.getByTestId('FormLinkedIssue|FormLinkedIssueSection')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(2);

    expect(screen.getByRole('link', { name: 'Concussion' })).toHaveAttribute(
      'href',
      '/medical/athletes/22213/injuries/80239'
    );

    expect(screen.getByRole('link', { name: 'Some Illness' })).toHaveAttribute(
      'href',
      '/medical/athletes/22213/illnesses/80240'
    );
  });

  it('renders expected fields when edit button is pressed', async () => {
    const { user } = renderWithUserEventSetup(
      <FormLinkedIssueSection {...props} />
    );

    await user.click(screen.getByRole('button', { name: 'Edit' }));

    const injuriesSelect = screen.getByLabelText('Injuries');
    expect(injuriesSelect).toBeInTheDocument();

    await selectEvent.select(injuriesSelect, 'Some Illness');

    expect(
      screen.getByRole('button', { name: 'Discard changes' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });
});
