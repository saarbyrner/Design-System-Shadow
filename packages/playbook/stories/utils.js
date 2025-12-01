// @flow

import { Title, Primary, Controls, Stories } from '@storybook/blocks';
import { Figma } from '@storybook/addon-designs/blocks';

type Links = {
  muiLink: string,
  figmaLink: string,
};

export const getPage =
  ({ muiLink, figmaLink }: Links) =>
  () => {
    return (
      <>
        <Title />
        {muiLink && (
          <a href={muiLink} target="_blank" rel="noreferrer">
            Material UI Docs
          </a>
        )}
        <Primary />
        <Controls />
        {figmaLink && <Figma url={figmaLink} />}
        <Stories includePrimary={false} />
      </>
    );
  };

export const getDesign = ({ figmaLink, muiLink }: Links) => [
  ...(figmaLink
    ? [
        {
          name: 'Figma Design',
          type: 'figma',
          url: figmaLink,
        },
      ]
    : []),
  ...(muiLink
    ? [
        {
          name: 'Material UI Docs',
          type: 'link',
          url: muiLink,
        },
      ]
    : []),
];
