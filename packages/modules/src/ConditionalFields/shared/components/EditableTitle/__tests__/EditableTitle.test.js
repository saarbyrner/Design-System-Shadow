import { render } from '@testing-library/react';
import EditableTitle from '..';

describe('<EditableTitle />', () => {
  it('renders the initial value', () => {
    const { getByText } = render(
      <EditableTitle initialValue="Initial Value" onSubmit={() => {}} />
    );
    expect(getByText('Initial Value')).toBeInTheDocument();
  });

  it('renders the edit icon when not saving', () => {
    const { getByTestId } = render(
      <EditableTitle initialValue="Initial Value" onSubmit={() => {}} />
    );
    expect(getByTestId('edit-title-icon')).toBeInTheDocument();
  });

  it('renders the loading spinner when saving', () => {
    const { getByTestId } = render(
      <EditableTitle
        initialValue="Initial Value"
        onSubmit={() => {}}
        isTitleSaving
      />
    );
    expect(getByTestId('LoadingSpinner')).toBeInTheDocument();
  });
});
