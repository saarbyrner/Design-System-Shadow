import { within, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import MedicalFlagHistory from '..';

const i18nT = i18nextTranslateStub();
const props = {
  t: i18nT,
  history: [
    {
      updated_by: {
        id: 1,
        firstname: 'John',
        lastname: 'Smith',
        fullname: 'John Smith',
      },
      updated_at: '2023-06-06T20:17:35Z',
      changeset: {
        name: ['Milk Allergy', 'Lactose'],
        symptoms: ['gets real real gassy', 'Cannot eat cheese'],
        severity: ['moderate', 'severe'],
      },
    },
  ],
};

describe('MedicalFlagHistory', () => {
  beforeEach(() => {
    render(<MedicalFlagHistory {...props} />);
  });

  it('should render the medical flag edit details', async () => {
    const sectionElement = screen.getByTestId('EditHistory|root');
    expect(sectionElement).toBeInTheDocument();
  });

  it('should click the dropdown and see the edits listed', async () => {
    const sectionElement = screen.getByTestId('EditHistory|root');
    const accordionButton = within(sectionElement).getByRole('button');

    await userEvent.click(accordionButton);

    expect(screen.getByTestId('Version|author')).toBeInTheDocument();
    expect(screen.getByTestId('Version|changeset')).toBeInTheDocument();
    expect(screen.getByTestId('Version|symptoms')).toBeInTheDocument();
    expect(screen.getByTestId('Version|severity')).toBeInTheDocument();
  });
});
