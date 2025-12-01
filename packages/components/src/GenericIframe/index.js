// @flow
import { css } from '@emotion/react';
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import type { Node } from 'react';
import { AppStatus } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  src: string,
  title?: string,
  hide?: boolean,
  id?: string,
  hasErrored?: boolean,
  isLoading?: boolean,
};

const GenericIframe = (props: I18nProps<Props>) => {
  const [isContentLoading, setIsContentLoading] = useState<boolean>(true);

  const renderAppStatus = (): Node | null => {
    if (props.hasErrored) {
      return <AppStatus status="error" />;
    }
    if (isContentLoading || props.isLoading) {
      return <AppStatus message={props.t('Loading...')} status="loading" />;
    }
    return null;
  };

  return (
    <>
      {renderAppStatus()}
      <iframe
        title={props.title ?? props.t('Iframe component')}
        src={props.src}
        css={css`
          display: ${isContentLoading ||
          props.isLoading ||
          props.hide ||
          props.hasErrored
            ? 'none'
            : 'initial'};
          height: calc(100vh - 60px); // full height - height of header
          width: 100%;
          border: 0;
        `}
        onLoad={() => setIsContentLoading(false)}
        id={props.id ? props.id : 'GenericIframe'}
      />
    </>
  );
};

const GenericIframeTranslated = withNamespaces()(GenericIframe);
export default GenericIframeTranslated; // exporting translated as default for use with lazy()
