import { screen } from '@testing-library/react';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';
import Header from '../Header';
import { getDefaultReviewForm } from '../../shared/utils';

jest.mock('@kitman/common/src/hooks/useLocationPathname');

describe('Header', () => {
  const props = {
    form: getDefaultReviewForm(),
    setIsValidationTriggered: jest.fn(),
    t: i18nextTranslateStub(),
    formMode: 'CREATE',
  };
  const saveBtnLabel = 'Save';

  beforeEach(() => {
    useLocationPathname.mockReturnValue('/athletes/123/athlete_reviews');
  });

  it('renders - CREATE mode', async () => {
    const backBtnLabel = 'Athlete reviews';

    const user = userEvent.setup();
    renderWithProviders(<Header {...props} />);

    expect(
      screen.getByRole('heading', {
        name: 'New review',
      })
    ).toBeInTheDocument();

    const saveBtn = screen.getByRole('button', {
      name: saveBtnLabel,
    });
    expect(saveBtn).toBeInTheDocument();
    await user.click(saveBtn);
    expect(props.setIsValidationTriggered).toHaveBeenCalled();

    const backBtn = screen.getByRole('link', {
      name: backBtnLabel,
    });
    expect(backBtn).toHaveAttribute('href', '/athletes/123/athlete_reviews');
  });

  it('renders - EDIT mode', async () => {
    const backBtnLabel = 'Athlete review';
    const user = userEvent.setup();
    renderWithProviders(
      <Header {...props} formMode="EDIT" form={{ ...props.form, id: 1 }} />
    );

    expect(
      screen.getByRole('heading', {
        name: 'Edit review',
      })
    ).toBeInTheDocument();

    const saveBtn = screen.getByRole('button', {
      name: saveBtnLabel,
    });
    expect(saveBtn).toBeInTheDocument();
    await user.click(saveBtn);
    expect(props.setIsValidationTriggered).toHaveBeenCalled();

    const backBtn = screen.getByRole('link', {
      name: backBtnLabel,
    });
    expect(backBtn).toHaveAttribute('href', '/athletes/123/athlete_reviews/1');
  });
});
