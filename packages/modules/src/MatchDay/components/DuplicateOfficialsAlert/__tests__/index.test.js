import { render, screen } from '@testing-library/react';
import LocalizationProvider from '@kitman/playbook/providers/wrappers/LocalizationProvider';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { getTranslations } from '@kitman/modules/src/MatchDay/shared/utils';
import DuplicateOfficialsAlert from '..';

describe('DuplicateOfficialsAlert', () => {
  const t = i18nextTranslateStub();
  const textEnum = getTranslations(t);

  const renderComponent = (props = {}) => {
    return render(
      <LocalizationProvider>
        <DuplicateOfficialsAlert {...props} />
      </LocalizationProvider>
    );
  };
  it('renders alert when there are duplicate officials', () => {
    const officialsIds = [1, 2, 2, 3];
    renderComponent({ officialsIds });
    expect(
      screen.getByText(textEnum.duplicateOfficialsErrorText)
    ).toBeInTheDocument();
  });

  it('does not render alert when there are no duplicate officials', () => {
    const officialsIds = [1, 2, 3];
    renderComponent({ officialsIds });
    expect(
      screen.queryByText(textEnum.duplicateOfficialsErrorText)
    ).not.toBeInTheDocument();
  });
});
