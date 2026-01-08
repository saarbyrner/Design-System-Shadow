// @flow
import type { Node } from 'react';
import { useInRouterContext, Link as ReactRouterLink } from 'react-router-dom';

type Props = {
  href: string,
  className: string,
  children?: Node,
  withHashParam?: boolean,
  openInNewTab?: boolean,
  isExternalLink?: boolean,
};

const Link = (props: Props) => {
  const inRouterContext = useInRouterContext();
  const commonProps = { ...props }; // Shallow copy

  // Remove the invalid properties for react-router-dom link and anchor a href
  delete commonProps.withHashParam;
  delete commonProps.openInNewTab;
  delete commonProps.isExternalLink;

  if (inRouterContext && !props.withHashParam && !props.isExternalLink) {
    return (
      <ReactRouterLink
        {...commonProps}
        className={props.className}
        to={props.href}
        target={props.openInNewTab ? '_blank' : undefined}
        rel={props.openInNewTab ? 'noopener noreferrer' : undefined}
      >
        {props.children}
      </ReactRouterLink>
    );
  }

  return props.openInNewTab || props.isExternalLink ? (
    <a
      {...commonProps}
      className={props.className}
      href={props.href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {props.children}
    </a>
  ) : (
    <a {...commonProps} className={props.className} href={props.href}>
      {props.children}
    </a>
  );
};

Link.defaultProps = {
  className: '',
  href: '',
};

export default Link;
