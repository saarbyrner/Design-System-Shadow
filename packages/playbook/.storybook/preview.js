import { DocsContainer } from '@storybook/blocks';
import { MDXProvider } from '@mdx-js/react';
import { LocalizationProvider, ThemeProvider } from '../providers';
import { Typography } from '../components';

const mdxComponents = {
  h1: ({ children }) => (
    <Typography variant="h3" component="h1" gutterBottom>
      {children}
    </Typography>
  ),
  h2: ({ children }) => (
    <Typography variant="h4" component="h2" gutterBottom>
      {children}
    </Typography>
  ),
  h3: ({ children }) => (
    <Typography variant="h5" component="h3" gutterBottom>
      {children}
    </Typography>
  ),
  h4: ({ children }) => (
    <Typography variant="h6" component="h4" gutterBottom>
      {children}
    </Typography>
  ),
  p: ({ children }) => (
    <Typography variant="body1" component="p" gutterBottom>
      {children}
    </Typography>
  ),
};

const MyDocsContainer = (props) => (
  <ThemeProvider>
    <LocalizationProvider>
      <MDXProvider components={mdxComponents}>
        <DocsContainer {...props} />
      </MDXProvider>
    </LocalizationProvider>
  </ThemeProvider>
);

const preview = {
  decorators: [
    (Story) => (
      <ThemeProvider>
        <LocalizationProvider>
          <Story />
        </LocalizationProvider>
      </ThemeProvider>
    ),
  ],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      container: MyDocsContainer,
    },
    options: {
      storySort: {
        order: ['Content Standards', '...'],
      },
    },
  },
};

export default preview;
