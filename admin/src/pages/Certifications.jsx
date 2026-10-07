import CrudPage from '../components/CrudPage';
import { certificationSchema } from '../lib/schemas';

export default function Certifications() {
  return <CrudPage schema={certificationSchema} />;
}
