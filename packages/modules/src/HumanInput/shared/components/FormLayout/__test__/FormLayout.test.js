import { render, screen } from '@testing-library/react';

import FormLayout from '../index';

describe('<FormLayout/>', () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = jest.fn();
  });

  it('renders the <FormLayout/> component and children correctly', () => {
    render(
      <FormLayout>
        <div>FormLayout</div>
        <FormLayout.Title>
          <div>FormLayout.Title</div>
        </FormLayout.Title>
        <FormLayout.Body>
          <div>FormLayout.Body</div>
          <FormLayout.Menu isOpen>
            <div>FormLayout.Menu</div>
          </FormLayout.Menu>
          <FormLayout.Content>
            <div>FormLayout.Content</div>
            <FormLayout.Form>
              <div>FormLayout.Form</div>
            </FormLayout.Form>
            <FormLayout.Footer>
              <div>FormLayout.Footer</div>
            </FormLayout.Footer>
          </FormLayout.Content>
        </FormLayout.Body>
      </FormLayout>
    );

    expect(screen.getByText('FormLayout')).toBeInTheDocument();
    expect(screen.getByText('FormLayout.Title')).toBeInTheDocument();
    expect(screen.getByText('FormLayout.Body')).toBeInTheDocument();
    expect(screen.getByText('FormLayout.Menu')).toBeInTheDocument();
    expect(screen.getByText('FormLayout.Content')).toBeInTheDocument();
    expect(screen.getByText('FormLayout.Form')).toBeInTheDocument();
    expect(screen.getByText('FormLayout.Footer')).toBeInTheDocument();
  });
});
