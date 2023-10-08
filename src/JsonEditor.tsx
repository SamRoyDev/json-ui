import React, { useState } from 'react';
import ReactJson from 'react-json-view';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const JsonEditor: React.FC = () => {
  const [rawJson, setRawJson] = useState('');
  const [parsedJson, setParsedJson] = useState<Record<string, any> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRawJson(e.target.value);
    try {
      setParsedJson(JSON.parse(e.target.value));
      setError(null);
    } catch (err) {
      setError('Invalid JSON');
    }
  };

  const handleJsonChange = (updatedJson: Record<string, any>) => {
    setParsedJson(updatedJson);
    setRawJson(JSON.stringify(updatedJson, null, 2));
  };

  return (
    <div className="json-editor">
      <div className="input-area">
        <textarea value={rawJson} onChange={handleInputChange} placeholder="Paste raw JSON here..."></textarea>
      </div>
      <div className="output-area">
        {error ? (
          <div className="error">{error}</div>
        ) : (
          <ReactJson src={parsedJson || {}} onEdit={(edit) => handleJsonChange(edit.updated_src)} />
        )}
      </div>
      <CopyToClipboard text={rawJson}>
        <button>Copy to Clipboard</button>
      </CopyToClipboard>
    </div>
  );
};

export default JsonEditor;