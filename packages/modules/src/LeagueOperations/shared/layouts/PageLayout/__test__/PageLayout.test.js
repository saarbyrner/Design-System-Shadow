import { render, screen } from '@testing-library/react';
import { TabContext } from '@kitman/playbook/components';

import PageLayout from '../index';

describe('<PageLayout/>', () => {
  it('renders the <PageLayout/> component and children correctly', () => {
    render(
      <PageLayout>
        <div>PageLayout</div>

        <PageLayout.Content>
          <PageLayout.Header>
            <div>PageLayout.Header</div>
          </PageLayout.Header>
          <div>PageLayout.Content</div>

          <TabContext value="one">
            <PageLayout.TabContent value="one">
              <div>PageLayout.TabContent</div>
            </PageLayout.TabContent>
          </TabContext>
        </PageLayout.Content>
      </PageLayout>
    );

    expect(screen.getByText('PageLayout')).toBeInTheDocument();
    expect(screen.getByText('PageLayout.Header')).toBeInTheDocument();
    expect(screen.getByText('PageLayout.Content')).toBeInTheDocument();
    expect(screen.getByText('PageLayout.TabContent')).toBeInTheDocument();
  });
});
