import React from 'react';
import { DocsContainer } from '@storybook/blocks';
import { MDXProvider } from '@mdx-js/react';
import { LocalizationProvider, ThemeProvider } from '../providers';
import { Box, Typography } from '../components';

const DoDontParagraph = ({ children }) => {
  const nodes = React.Children.toArray(children);
  if (nodes.length === 0) {
    return (
      <Typography variant="body1" component="p" gutterBottom>
        {children}
      </Typography>
    );
  }

  const segments = [];
  let current = null;
  const pushCurrent = () => {
    if (current) {
      segments.push(current);
      current = null;
    }
  };

  for (const node of nodes) {
    if (
      React.isValidElement(node) &&
      node.type === 'strong' &&
      typeof node.props.children === 'string'
    ) {
      const labelRaw = node.props.children.trim();
      const labelKey = labelRaw.toLowerCase().replace(/[^a-z]/g, '');
      if (labelKey === 'do' || labelKey === 'dont') {
        pushCurrent();
        current = {
          labelRaw,
          labelKey,
          content: [],
        };
        continue;
      }
    }

    if (current) {
      current.content.push(node);
    }
  }
  pushCurrent();

  if (segments.length > 0) {
    return (
      <Box
        component="div"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
          mb: 1,
          alignItems: 'flex-start',
        }}
      >
        {segments.map(({ labelRaw, labelKey, content }, segmentIndex) => {
          const color = labelKey === 'do' ? 'success.main' : 'error.main';
          return (
            <Box key={segmentIndex} sx={{ width: '100%' }}>
              <Typography component="span" variant="subtitle2" sx={{ color }}>
                {`${labelRaw.replace(/:$/, '')}:`}
              </Typography>
              {content.length > 0 && (
                <Box
                  component="div"
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.25,
                    pl: 1,
                  }}
                >
                  {content.map((child, childIndex) =>
                    typeof child === 'string' ? (
                      <Typography component="span" variant="body1" key={childIndex}>
                        {child}
                      </Typography>
                    ) : (
                      <Box component="div" key={childIndex}>
                        {child}
                      </Box>
                    ),
                  )}
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    );
  }

  return (
    <Typography variant="body1" component="p" gutterBottom>
      {children}
    </Typography>
  );
};

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
  p: DoDontParagraph,
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
        order: [
          'Content Standards',
          ['Content standards index', '*'],
          '...',
        ],
      },
    },
  },
};

export default preview;
