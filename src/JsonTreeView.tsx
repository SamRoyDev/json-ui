import React, { useState } from "react";

interface JsonTreeViewProps {
  data: Record<string, any>;
  onChange: (updatedData: Record<string, any>) => void;
}

const JsonTreeView: React.FC<JsonTreeViewProps> = ({ data, onChange }) => {
  const [localData, setLocalData] = useState(data);

  const handleValueChange = (key: string, value: any) => {
    const updatedData = { ...localData, [key]: value };
    setLocalData(updatedData);
    onChange(updatedData);
  };

  const renderValueField = (key: string, value: any) => {
    switch (typeof value) {
      case "string":
        return (
          <textarea
            className="json-value"
            value={value}
            onChange={(e) => handleValueChange(key, e.target.value)}
          />
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
