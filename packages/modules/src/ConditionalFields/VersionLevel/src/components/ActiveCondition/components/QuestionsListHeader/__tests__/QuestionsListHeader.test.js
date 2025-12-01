import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import QuestionsListHeader from '..';

describe('<QuestionsListHeader />', () => {
  const props = {
    order: 1,
    t: i18nextTranslateStub(),
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('displays heading and Add button', () => {
    render(<QuestionsListHeader {...props} />);

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Ask');
    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent(
      `Question ${props.order}`
    );
  });
});
