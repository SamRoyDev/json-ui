import React, { useState, useEffect, useRef } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import JsonTreeView from "./JsonTreeView";

const JsonEditor: React.FC = () => {
  const [rawJson, setRawJson] = useState("");
  const [parsedJson, setParsedJson] = useState<Record<string, any> | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRawJson(e.target.value);
    formatJson(e.target.value);
  };

  const formatJson = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      const formattedJson = JSON.stringify(parsed, null, 2);
      setRawJson(formattedJson);
      setParsedJson(parsed);
      setError(null);
    } catch (err) {
      setError("Invalid JSON");
    }
  };

  const handleJsonChange = (updatedJson: Record<string, any>) => {
    setParsedJson(updatedJson);
    setRawJson(JSON.stringify(updatedJson, null, 2));
  };

  return (
    <div className="json-editor">
      <div className="input-area">
        <textarea
          ref={textAreaRef}
          value={rawJson}
          onChange={handleInputChange}
          placeholder="Paste raw JSON here..."
          style={{
            whiteSpace: "pre-wrap",
          }} /* Ensure text wraps to the next line */
        ></textarea>
        <CopyToClipboard text={rawJson}>
          <button>Copy to Clipboard</button>
        </CopyToClipboard>
      </div>
      <div className="output-area">
        {error ? (
          <div className="error">
            Invalid JSON - Please fix the errors in the left panel to proceed.
          </div>
        ) : (
          <JsonTreeView data={parsedJson || {}} onChange={handleJsonChange} />
        )}
      </div>
    </div>
  );
};

export default JsonEditor;
