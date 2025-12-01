// @flow
import { useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import { ColourPalette } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  fetchColours: Function,
  onUpdateColours: Function,
  palette: Array<string>,
};

function GraphColours(props: I18nProps<Props>) {
  useEffect(() => {
    props.fetchColours();
  }, []);

  return (
    <div className="graphColours">
      <div className="graphColours__introText">
        {props.t('Select graph colour palette')}
      </div>
      <ColourPalette
        onUpdateColours={props.onUpdateColours}
        palette={props.palette}
      />
    </div>
  );
}

export const GraphColoursTranslated = withNamespaces()(GraphColours);
export default GraphColours;
