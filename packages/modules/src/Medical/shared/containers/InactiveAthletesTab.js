// @flow
import { InactiveAthletesTabTranslated as InactiveAthletesTab } from '../components/InactiveAthletesTab';

type Props = {
  reloadData: boolean,
};

const InactiveAthletesTabContainer = (props: Props) => {
  return <InactiveAthletesTab reloadData={props.reloadData} />;
};

export default InactiveAthletesTabContainer;
