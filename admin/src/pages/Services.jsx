import CrudPage from '../components/CrudPage';
import { serviceSchema } from '../lib/schemas';

export default function Services() {
  return <CrudPage schema={serviceSchema} />;
}
