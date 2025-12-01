// @flow
import { useEffect, type Node } from 'react';
import { useDispatch } from 'react-redux';
import { fetchWidgetContent } from '../redux/actions/widgets';

type Props = {
  widget: Object,
  children: Node,
};

/**
 * This component wraps a widget and fetches the data on widget load.
 * this logic was contained within packages/modules/src/analysis/Dashboard/redux/actions/widgets.js:188
 * i.e. the success block of the fetchWidgets request but it was moved to guarantee
 * that the widgets load in order of the way they are rendered on the page
 *
 * @param {Object} props props containing children and widget
 * @returns
 */
function WidgetDataFetch(props: Props) {
  const dispatch = useDispatch();

  useEffect(() => {
    // eslint-disable-next-line no-underscore-dangle
    if (props.widget.widget_render.__async__) {
      dispatch(fetchWidgetContent(props.widget.id, props.widget.widget_type));
    }
  }, []);

  return props.children;
}

export default WidgetDataFetch;
