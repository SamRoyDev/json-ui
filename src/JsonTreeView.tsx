import React, { useState, useEffect } from "react";
import ReactHtmlParser from "react-html-parser"; // Import ReactHtmlParser

interface JsonTreeViewProps {
  data: Record<string, any>;
  onChange: (updatedData: Record<string, any>) => void;
}

const JsonTreeView: React.FC<JsonTreeViewProps> = ({ data, onChange }) => {
  const [localData, setLocalData] = useState(data);
  const [previewHtmlKey, setPreviewHtmlKey] = useState<string | null>(null); // State to track which key's HTML is being previewed

  useEffect(() => {
    setLocalData(data); // Update localData whenever data prop changes
  }, [data]);

  const handleValueChange = (key: string | number, value: any) => {
    if (Array.isArray(localData)) {
      // If localData is an array, create a new array with the updated value
      const updatedData = [...localData];
      updatedData[key as number] = value;
      setLocalData(updatedData);
      onChange(updatedData);
    } else {
      // If localData is an object, create a new object with the updated value
      const updatedData = { ...localData, [key]: value };
      setLocalData(updatedData);
      onChange(updatedData);
    }
  };

  const renderValueField = (key: string, value: any) => {
    const isHtml =
      value &&
      typeof value === "string" &&
      value.startsWith("<") &&
      value.endsWith(">");

    switch (typeof value) {
      case "string":
        return (
          <div className="value-field-container">
            <textarea
              className="json-value"
              value={value}
              onChange={(e) => handleValueChange(key, e.target.value)}
            />
            {isHtml && (
              <button onClick={() => setPreviewHtmlKey(key)}>
                Preview HTML
              </button>
            )}
            {previewHtmlKey === key && (
              <div className="html-preview">{ReactHtmlParser(value)}</div>
            )}
          </div>
        );
      case "number":
        return (
          <input
            className="json-value"
            type="number"
            value={value}
            onChange={(e) => handleValueChange(key, parseFloat(e.target.value))}
          />
        );
      case "boolean":
        return (
          <select
            className="json-value"
            value={value ? "true" : "false"}
            onChange={(e) => handleValueChange(key, e.target.value === "true")}
          >
            <option value="true">true</option>
            <option value="false">false</option>
          </select>
        );
      default:
        return null;
    }
  };

  return (
    <div className="json-tree-view">
      {Object.keys(localData).map((key) => (
        <div className="json-item" key={key}>
          <div className="json-key">
            {key} <span className="arrow">{">"}</span>
          </div>
          {typeof localData[key] === "object" && localData[key] !== null ? (
            <div className="json-nested">
              <JsonTreeView
                data={localData[key]}
                onChange={(updatedData) => handleValueChange(key, updatedData)}
              />
            </div>
          ) : (
            <div className="json-value-container">
              {renderValueField(key, localData[key])}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default JsonTreeView;
