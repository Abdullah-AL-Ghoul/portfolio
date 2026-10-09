import CrudPage from '../components/CrudPage';
import { profileSchema } from '../lib/schemas';

export default function Profiles() {
  return <CrudPage schema={profileSchema} />;
}
