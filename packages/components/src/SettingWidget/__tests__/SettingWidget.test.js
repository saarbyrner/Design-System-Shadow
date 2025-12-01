import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SettingWidget from '../index';

describe('Organisation Settings <SettingWidget /> component', () => {
  const props = {
    title: '',
    onClickRestore: jest.fn(),
    t: (key) => key,
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders a header with the correct title', () => {
    render(<SettingWidget {...props} title="Widget Title" />);
    expect(screen.getByText('Widget Title')).toBeInTheDocument();
  });

  it('calls the correct callback when restore defaults link is clicked', async () => {
    render(<SettingWidget {...props} />);
    await userEvent.click(screen.getByText('Restore Defaults'));
    expect(props.onClickRestore).toHaveBeenCalled();
  });

  it('renders the widget content', () => {
    render(<SettingWidget {...props}>Widget Content</SettingWidget>);
    expect(screen.getByText('Widget Content')).toBeInTheDocument();
  });

  it("doesn't render the restore button if onClickRestore is undefined", () => {
    render(
      <SettingWidget {...props} onClickRestore={undefined}>
        Widget Content
      </SettingWidget>
    );

    expect(screen.queryByText('Restore Defaults')).not.toBeInTheDocument();
  });

  it('renders an action button if actionButtonText and onClickActionButton are defined', async () => {
    const onClickActionButtonSpy = jest.fn();
    render(
      <SettingWidget
        {...props}
        actionButtonText="Add"
        onClickActionButton={onClickActionButtonSpy}
      >
        Widget Content
      </SettingWidget>
    );

    await userEvent.click(screen.getByText('Add'));
    expect(onClickActionButtonSpy).toHaveBeenCalled();
  });

  it('uses the kitmanDesignSystem theme', () => {
    const { container } = render(
      <SettingWidget
        {...props}
        actionButtonText="Add"
        onClickActionButton={() => {}}
        kitmanDesignSystem
      >
        Widget Content
      </SettingWidget>
    );

    expect(
      container.getElementsByClassName('settingWidget--kitmanDesignSystem')
    ).toHaveLength(1);
    expect(
      container.getElementsByClassName(
        'settingWidget--kitmanDesignSystem__headerContainer'
      )
    ).toHaveLength(1);
    expect(
      container.getElementsByClassName(
        'settingWidget--kitmanDesignSystem__headerText'
      )
    ).toHaveLength(1);
    expect(
      container.getElementsByClassName(
        'settingWidget--kitmanDesignSystem__headerControls'
      )
    ).toHaveLength(1);
    expect(
      container.getElementsByClassName('textButton--kitmanDesignSystem')
    ).toHaveLength(1);
  });
});
