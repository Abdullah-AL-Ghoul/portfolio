import CrudPage from '../components/CrudPage';
import { experienceSchema } from '../lib/schemas';

export default function Experience() {
  return <CrudPage schema={experienceSchema} />;
}
