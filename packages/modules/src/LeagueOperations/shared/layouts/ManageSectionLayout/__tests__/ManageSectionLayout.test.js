import { render, screen } from '@testing-library/react';

import ManageSectionLayout from '../index';

describe('<ManageSectionLayout/>', () => {
  it('renders the <ManageSectionLayout/> component and children correctly', () => {
    render(
      <ManageSectionLayout>
        <div>ManageSectionLayout</div>
        <ManageSectionLayout.Content>
          <ManageSectionLayout.Title
            title="ManageSectionLayout.Title"
            subtitle="ManageSectionLayout.Subtitle"
          />
          <ManageSectionLayout.Actions>
            <div>ManageSectionLayout.Actions</div>
          </ManageSectionLayout.Actions>
          <div>ManageSectionLayout.Content</div>
        </ManageSectionLayout.Content>
      </ManageSectionLayout>
    );

    expect(screen.getByText('ManageSectionLayout')).toBeInTheDocument();
    expect(screen.getByText('ManageSectionLayout.Title')).toBeInTheDocument();
    expect(
      screen.getByText('ManageSectionLayout.Subtitle')
    ).toBeInTheDocument();
    expect(screen.getByText('ManageSectionLayout.Content')).toBeInTheDocument();
    expect(screen.getByText('ManageSectionLayout.Actions')).toBeInTheDocument();
  });
});
