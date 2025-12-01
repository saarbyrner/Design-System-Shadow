import { useSelector } from 'react-redux';
import App from '../components/App';

export default () => {
  const viewType = useSelector((state) => state.viewType);

  return <App viewType={viewType} />;
};
