import CrudPage from '../components/CrudPage';
import { projectSchema } from '../lib/schemas';

export default function Projects() {
  return <CrudPage schema={projectSchema} />;
}
