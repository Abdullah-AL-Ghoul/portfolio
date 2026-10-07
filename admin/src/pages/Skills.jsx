import CrudPage from '../components/CrudPage';
import { skillSchema } from '../lib/schemas';

export default function Skills() {
  return <CrudPage schema={skillSchema} />;
}
