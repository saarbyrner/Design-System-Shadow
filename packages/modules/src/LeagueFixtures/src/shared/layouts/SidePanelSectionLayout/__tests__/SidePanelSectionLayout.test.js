import { render, screen } from '@testing-library/react';

import SidePanelSectionLayout from '../index';

describe('<SidePanelSectionLayout/>', () => {
  it('renders the <SidePanelSectionLayout/> component and children correctly', () => {
    render(
      <SidePanelSectionLayout>
        <div>SidePanelSectionLayout</div>
        <SidePanelSectionLayout.Content>
          <SidePanelSectionLayout.Title
            title="SidePanelSectionLayout.Title"
            date="SidePanelSectionLayout.Date"
            text="SidePanelSectionLayout.Text"
          />
          <SidePanelSectionLayout.Actions>
            <div>SidePanelSectionLayout.Actions</div>
          </SidePanelSectionLayout.Actions>
          <div>SidePanelSectionLayout.Content</div>
        </SidePanelSectionLayout.Content>
      </SidePanelSectionLayout>
    );

    expect(screen.getByText('SidePanelSectionLayout')).toBeInTheDocument();
    expect(screen.getByText('SidePanelSectionLayout.Title')).toBeInTheDocument();
    expect(
      screen.getByText('SidePanelSectionLayout.Date')
    ).toBeInTheDocument();
    expect(
      screen.getByText('SidePanelSectionLayout.Text')
    ).toBeInTheDocument();
    expect(screen.getByText('SidePanelSectionLayout.Content')).toBeInTheDocument();
    expect(screen.getByText('SidePanelSectionLayout.Actions')).toBeInTheDocument();
  });
});
