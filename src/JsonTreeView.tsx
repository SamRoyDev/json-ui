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
              {" "}
              {/* New container div */}
              <div
                className="json-value"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) =>
                  handleValueChange(key, e.currentTarget.textContent || "")
                }
              >
                {localData[key]}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default JsonTreeView;
