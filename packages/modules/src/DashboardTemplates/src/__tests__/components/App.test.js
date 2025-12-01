import { render, screen } from '@testing-library/react';
import App from '../../components/App';

jest.mock('../../containers/Header', () => () => (
  <header role="banner">Header</header>
));
jest.mock('../../containers/TemplateList', () => () => (
  <div role="region" aria-label="Template List" />
));
jest.mock('../../containers/AddTemplateModal', () => () => (
  <div role="dialog" aria-label="Add Template Modal" />
));
jest.mock('../../containers/DuplicateTemplateModal', () => () => (
  <div role="dialog" aria-label="Duplicate Template Modal" />
));
jest.mock('../../containers/RenameTemplateModal', () => () => (
  <div role="dialog" aria-label="Rename Template Modal" />
));
jest.mock('../../containers/AppStatus', () => () => (
  <div role="status" aria-label="App Status" />
));
jest.mock('../../containers/DeleteTemplateModal', () => () => (
  <div role="dialog" aria-label="Delete Template Modal" />
));

describe('Dashboard Templates <App /> component', () => {
  it('renders', () => {
    render(<App />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('renders the Header', () => {
    render(<App />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('renders the TemplateList', () => {
    render(<App />);
    expect(
      screen.getByRole('region', { name: 'Template List' })
    ).toBeInTheDocument();
  });

  it('renders the AddTemplateModal', () => {
    render(<App />);
    expect(
      screen.getByRole('dialog', { name: 'Add Template Modal' })
    ).toBeInTheDocument();
  });

  it('renders the DuplicateTemplateModal', () => {
    render(<App />);
    expect(
      screen.getByRole('dialog', { name: 'Duplicate Template Modal' })
    ).toBeInTheDocument();
  });

  it('renders the RenameTemplateModal', () => {
    render(<App />);
    expect(
      screen.getByRole('dialog', { name: 'Rename Template Modal' })
    ).toBeInTheDocument();
  });

  it('renders the AppStatus', () => {
    render(<App />);
    expect(
      screen.getByRole('status', { name: 'App Status' })
    ).toBeInTheDocument();
  });

  it('renders the DeleteTemplateModal', () => {
    render(<App />);
    expect(
      screen.getByRole('dialog', { name: 'Delete Template Modal' })
    ).toBeInTheDocument();
  });
});
