import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import ValidationText from '..';

describe('<ValidationText/> component', () => {
  const props = {
    t: i18nextTranslateStub(),
  };
  it('renders the component correctly when customValidationText is not provided', () => {
    render(<ValidationText {...props} />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('renders the component correctly when customValidationText is provided', () => {
    render(
      <ValidationText
        {...props}
        customValidationText="Custom validation text"
      />
    );
    expect(screen.getByText('Custom validation text')).toBeInTheDocument();
  });
});
