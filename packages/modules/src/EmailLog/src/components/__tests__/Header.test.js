import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import Header from '../Header';

describe('Header', () => {
  const i18nT = i18nextTranslateStub();
  const props = {
    t: i18nT,
  };
  it('renders the header correctly', () => {
    render(<Header {...props} />);
    expect(
      screen.getByText('Email log', { selector: 'h2' })
    ).toBeInTheDocument();
  });
});
