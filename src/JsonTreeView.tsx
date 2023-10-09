import React, { useState, useEffect } from "react";
import ReactHtmlParser from "react-html-parser"; // Import ReactHtmlParser

interface JsonTreeViewProps {
  data: Record<string, any>;
  onChange: (updatedData: Record<string, any>) => void;
}

const JsonTreeView: React.FC<JsonTreeViewProps> = ({ data, onChange }) => {
  const [localData, setLocalData] = useState(data);
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({});
  const [previewHtmlKey, setPreviewHtmlKey] = useState<string | null>(null);

  useEffect(() => {
    setLocalData(data);
    const newExpandedKeys: Record<string, boolean> = {};
    Object.keys(data).forEach((key) => {
      newExpandedKeys[key] = true;
    });
    setExpandedKeys(newExpandedKeys);
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

  const formatLabel = (key: string) => {
    return "Add " + key.charAt(0).toUpperCase() + key.slice(1) + " Item";
  };

  const toggleExpandItem = (key: string) => {
    setExpandedKeys((prevKeys) => ({ ...prevKeys, [key]: !prevKeys[key] }));
  };

  const getNewItem = (array: any[]) => {
    if (array.length === 0) return {};
    const firstItem = array[0];
    if (typeof firstItem !== "object") return ""; // Assuming string as a default type
    const newItem: Record<string, any> = {};
    Object.keys(firstItem).forEach((key) => {
      const value = firstItem[key];
      switch (typeof value) {
        case "string":
          newItem[key] = "";
          break;
        case "number":
          newItem[key] = 0;
          break;
        case "boolean":
          newItem[key] = false;
          break;
        case "object":
          // If it's an array, initialize with an empty array
          // Otherwise, initialize with an empty object
          newItem[key] = Array.isArray(value) ? [] : {};
          break;
        default:
          newItem[key] = null;
          break;
      }
    });
    return newItem;
  };

  const handleAddItem = (key: string) => {
    const newItem = getNewItem(localData[key]);
    const updatedData = { ...localData, [key]: [...localData[key], newItem] };
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
          <div className="json-key" onClick={() => toggleExpandItem(key)}>
            {key}
            <span className="arrow">{expandedKeys[key] ? "v" : ">"}</span>
          </div>
          <div className="json-item-content">
            {typeof localData[key] === "object" &&
            !Array.isArray(localData[key]) &&
            localData[key] !== null ? (
              <div className="json-nested">
                <JsonTreeView
                  data={localData[key]}
                  onChange={(updatedData) =>
                    handleValueChange(key, updatedData)
                  }
                />
              </div>
            ) : Array.isArray(localData[key]) ? (
              <div className="json-array">
                {localData[key].map((item: any, index: number) => (
                  <div className="array-item-container" key={index}>
                    {expandedKeys[key] &&
                      (typeof item === "string" ? (
                        <>
                          <textarea
                            className="json-value"
                            value={item}
                            onChange={(e) =>
                              handleArrayItemChange(key, index, e.target.value)
                            }
                          />
                          <button
                            className="item-button"
                            onClick={() => handleRemoveItem(key, index)}
                          >
                            Remove
                          </button>
                        </>
                      ) : (
                        <div className="nested-array-item">
                          <JsonTreeView
                            data={item}
                            onChange={(updatedData) =>
                              handleArrayItemChange(key, index, updatedData)
                            }
                          />
                          <button
                            className="item-button"
                            onClick={() => handleRemoveItem(key, index)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                  </div>
                ))}
                <div className="array-item-container">
                  <button
                    className="item-button"
                    onClick={() => handleAddItem(key)}
                  >
                    {formatLabel(key)}
                  </button>
                </div>
              </div>
            ) : (
              <div className="json-value-container">
                {renderValueField(key, localData[key])}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default JsonTreeView;
