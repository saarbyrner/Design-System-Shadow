import { render, screen } from '@testing-library/react';

import HeaderLayout from '../index';

describe('<HeaderLayout/>', () => {
  it('renders the <HeaderLayout/> component and children correctly', () => {
    render(
      <HeaderLayout>
        HeaderLayout
        <HeaderLayout.BackBar>HeaderLayout.BackBar</HeaderLayout.BackBar>
        <HeaderLayout.Content>
          HeaderLayout.Content
          <HeaderLayout.Avatar>HeaderLayout.Avatar</HeaderLayout.Avatar>
          <HeaderLayout.MainContent>
            HeaderLayout.MainContent
            <HeaderLayout.TitleBar>
              HeaderLayout.TitleBar
              <HeaderLayout.Title>HeaderLayout.Title</HeaderLayout.Title>
              <HeaderLayout.Actions>HeaderLayout.Actions</HeaderLayout.Actions>
            </HeaderLayout.TitleBar>
            <HeaderLayout.Items>HeaderLayout.Items</HeaderLayout.Items>
          </HeaderLayout.MainContent>
        </HeaderLayout.Content>
      </HeaderLayout>
    );

    expect(screen.getByText('HeaderLayout')).toBeInTheDocument();
    expect(screen.getByText('HeaderLayout.BackBar')).toBeInTheDocument();
    expect(
      screen.getByText('HeaderLayout.ContentHeaderLayout.Avatar')
    ).toBeInTheDocument();
    expect(screen.getByText('HeaderLayout.MainContent')).toBeInTheDocument();
    expect(screen.getByText('HeaderLayout.TitleBar')).toBeInTheDocument();
    expect(screen.getByText('HeaderLayout.Title')).toBeInTheDocument();
    expect(screen.getByText('HeaderLayout.Actions')).toBeInTheDocument();
    expect(screen.getByText('HeaderLayout.Items')).toBeInTheDocument();
  });

  it('renders the <HeaderLayout.Loading/>', () => {
    render(<HeaderLayout.Loading />);

    expect(screen.getByTestId('HeaderLayout.TitleBar')).toBeInTheDocument();
  });

  it('renders the <HeaderLayout.Loading/> withAvatar', () => {
    render(<HeaderLayout.Loading withAvatar />);
    expect(screen.getByTestId('HeaderLayout.Avatar')).toBeInTheDocument();
  });

  it('renders the <HeaderLayout.Loading/> withActions', () => {
    render(<HeaderLayout.Loading withActions />);
    expect(screen.getByTestId('HeaderLayout.Actions')).toBeInTheDocument();
  });

  it('renders the <HeaderLayout.Loading/> withItems', () => {
    render(<HeaderLayout.Loading withItems />);
    expect(screen.getByTestId('HeaderLayout.Items1')).toBeInTheDocument();
    expect(screen.getByTestId('HeaderLayout.Items2')).toBeInTheDocument();
    expect(screen.getByTestId('HeaderLayout.Items3')).toBeInTheDocument();
    expect(screen.getByTestId('HeaderLayout.Items4')).toBeInTheDocument();
  });
});
