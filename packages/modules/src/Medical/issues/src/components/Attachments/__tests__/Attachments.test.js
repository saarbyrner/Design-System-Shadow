import { render, screen } from '@testing-library/react';

import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  mockedIssueContextValue,
  MockedIssueContextProvider,
} from '../../../../../shared/contexts/IssueContext/utils/mocks';
import Attachments from '..';

jest.mock('@kitman/components/src/FileUploadField');

describe('Injury/Issues Overview Attachments', () => {
  let component;
  const mockLinks = [
    {
      id: '1',
      uri: 'testLink.com',
      title: 'Test Link',
      created_by: {
        fullname: 'Test User 1',
      },
      created_at: '2022-05-10',
      uri_type: 'injury',
    },
    {
      id: '2',
      uri: 'exampleLink.com',
      title: 'Example Link',
      created_by: {
        fullname: 'Test User 2',
      },
      created_at: '2022-05-10',
      uri_type: 'injury',
    },
  ];

  const renderComponent = (links) =>
    render(
      <Attachments
        onSave={jest.fn()}
        attachedLinks={links}
        t={i18nextTranslateStub()}
      />
    );

  describe('initial render', () => {
    beforeEach(() => {
      component = renderComponent([]);
    });

    it('renders the add button options', async () => {
      expect(component.queryByText('File')).not.toBeInTheDocument();
      expect(component.queryByText('Link')).not.toBeInTheDocument();
      await userEvent.click(component.getByRole('button'));
      expect(component.getByText('File')).toBeInTheDocument();
      expect(component.getByText('Link')).toBeInTheDocument();
    });

    it('does not render the links section when there are no links', () => {
      expect(component.queryByTestId('Links|Heading')).not.toBeInTheDocument();
    });

    it('does not render the files section when there are no files', () => {
      expect(component.queryByTestId('Files|Heading')).not.toBeInTheDocument();
    });

    describe('Links Side Panel', () => {
      it('opens the links side panel when the add option link is clicked', async () => {
        await userEvent.click(component.getByText('Add'));
        await userEvent.click(component.getByText('Link'));
        expect(
          component.getByText('Add Link to Injury/Illness')
        ).toBeInTheDocument();
      });

      it('opens the links side panel and closes it', async () => {
        await userEvent.click(component.getByText('Add'));
        await userEvent.click(component.getByText('Link'));
        await userEvent.click(
          component.getByTestId('sliding-panel|close-button')
        );
        expect(
          component.queryByText('Add Link to Injury/Illness')
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('render with links', () => {
    beforeEach(() => {
      component = renderComponent(mockLinks);
    });

    it('renders the links with their respective author and date', () => {
      expect(component.getByTestId('Links|Heading')).toBeInTheDocument();
      expect(component.getByText('Test Link')).toBeInTheDocument();
      expect(
        component.getByText('Created May 10, 2022 by Test User 1')
      ).toBeInTheDocument();
      expect(component.getByText('Example Link')).toBeInTheDocument();
      expect(
        component.getByText('Created May 10, 2022 by Test User 2')
      ).toBeInTheDocument();
    });

    describe('Files Side Panel', () => {
      it('Opens the files side panel when the add option file is clicked', async () => {
        await userEvent.click(component.getByText('Add'));
        await userEvent.click(component.getByText('File'));
        expect(
          component.getByText('Add File to Injury/Illness')
        ).toBeInTheDocument();
      });

      it('Adds a file displays it on the attachments section', async () => {
        const mockFile = new File(['hello'], 'hello.png', {
          type: 'image/png',
        });

        const { container } = component;

        await userEvent.click(component.getByText('Add'));
        await userEvent.click(component.getByText('File'));
        await userEvent.upload(container.querySelector('input'), mockFile);

        expect(component.getByText('hello.png')).toBeInTheDocument();
      });
    });
  });

  describe('when the issue is read only', () => {
    it('does not render the add button', () => {
      const result = render(
        <MockedIssueContextProvider
          issueContext={{
            ...mockedIssueContextValue,
            issue: {
              ...mockedIssueContextValue.issue,
            },
            isReadOnly: true,
          }}
        >
          <Attachments
            onSave={jest.fn()}
            attachedLinks={[]}
            t={i18nextTranslateStub()}
          />
        </MockedIssueContextProvider>
      ).container;

      // eslint-disable-next-line testing-library/no-debugging-utils
      screen.debug(result, 30000);
      expect(() => screen.getByText('Add')).toThrow();
    });
  });
});
