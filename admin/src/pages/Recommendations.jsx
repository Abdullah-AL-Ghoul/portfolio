import CrudPage from '../components/CrudPage';
import { recommendationSchema } from '../lib/schemas';

export default function Recommendations() {
  return <CrudPage schema={recommendationSchema} />;
}
