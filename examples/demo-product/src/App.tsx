import { ContentManager } from './content-manager/ContentManager';
import managedRaw from './copy/managed.yaml?raw';
import termsRaw from './copy/terms.yaml?raw';
import usage from './copy/contentUsage.generated.json';
import YAML from 'yaml';

export function App() {
  const managed = YAML.parse(managedRaw);
  const terms = YAML.parse(termsRaw);
  return <ContentManager managed={managed} terms={terms} usage={usage} />;
}
