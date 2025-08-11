import CaseEditorTabs from './CaseEditorTabs';

interface CaseEditorProps {
  caseId?: string;
  onBack: () => void;
}

const CaseEditor = ({ caseId, onBack }: CaseEditorProps) => {
  return (
    <CaseEditorTabs
      caseId={caseId}
      onBack={onBack}
    />
  );
};

export default CaseEditor;