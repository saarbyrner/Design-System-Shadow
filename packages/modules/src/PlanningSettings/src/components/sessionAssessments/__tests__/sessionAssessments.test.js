import { screen } from '@testing-library/react';
import { setI18n } from 'react-i18next';

import { renderWithUserEventSetup } from '@kitman/common/src/utils/test_utils';
import i18n from '@kitman/common/src/utils/i18n';

import { SessionAssessmentsTranslated as SessionAssessments } from '..';

describe('SessionAssessments', () => {
  const props = {
    assessmentTemplates: [],
    editedSessionAssessments: {},
    getSessionTemplates: jest.fn(),
    onCancelEdit: jest.fn(),
    onClickSave: jest.fn(),
    onSelectAssessmentType: jest.fn(),
    requestStatus: 'SUCCESS',
    sessionAssessments: [],
  };

  beforeAll(() => {
    setI18n(i18n);
  });

  it('renders the correct content', () => {
    renderWithUserEventSetup(<SessionAssessments {...props} />);

    expect(screen.getByText('Session Types')).toBeInTheDocument();
    expect(screen.getByText('Session type')).toBeInTheDocument();
    expect(screen.getByText('Assessment type')).toBeInTheDocument();
  });

  it('renders the correct content when loading', async () => {
    renderWithUserEventSetup(
      <SessionAssessments {...props} requestStatus="LOADING" />
    );

    expect(await screen.findByText('Loading ...')).toBeInTheDocument();
  });

  it('renders the correct content when there has been an error', () => {
    renderWithUserEventSetup(
      <SessionAssessments {...props} requestStatus="FAILURE" />
    );

    expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
  });
});
