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

  const handleArrayItemChange = (
    key: string | number,
    index: number,
    updatedData: any
  ) => {
    if (Array.isArray(localData[key])) {
      const updatedArray = [...localData[key]];
      updatedArray[index] = updatedData;
      const updatedLocalData = { ...localData, [key]: updatedArray };
      setLocalData(updatedLocalData);
      onChange(updatedLocalData);
    }
  };

  const handleAddItem = (key: string) => {
    const updatedData = { ...localData, [key]: [...localData[key], {}] };
    setLocalData(updatedData);
    onChange(updatedData);
  };

  const handleRemoveItem = (key: string, index: number) => {
    const updatedData = {
      ...localData,
      [key]: localData[key].filter((_: any, i: number) => i !== index),
    };
    setLocalData(updatedData);
    onChange(updatedData);
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
              <button
                onClick={() =>
                  setPreviewHtmlKey((prevKey) => (prevKey === key ? null : key))
                }
              >
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
          {typeof localData[key] === "object" &&
          !Array.isArray(localData[key]) &&
          localData[key] !== null ? (
            <div className="json-nested">
              <JsonTreeView
                data={localData[key]}
                onChange={(updatedData) => handleValueChange(key, updatedData)}
              />
            </div>
          ) : Array.isArray(localData[key]) ? (
            <div className="json-array">
              <button onClick={() => handleAddItem(key)}>Add Item</button>
              {localData[key].map((item: any, index: number) => (
                <div key={index}>
                  <button onClick={() => handleRemoveItem(key, index)}>
                    Remove
                  </button>
                  {typeof item === "string" ? (
                    <textarea
                      value={item}
                      onChange={(e) =>
                        handleArrayItemChange(key, index, e.target.value)
                      }
                    />
                  ) : (
                    <JsonTreeView
                      data={item}
                      onChange={(updatedData) =>
                        handleArrayItemChange(key, index, updatedData)
                      }
                    />
                  )}
                </div>
              ))}
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
