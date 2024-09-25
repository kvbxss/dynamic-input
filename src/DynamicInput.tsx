import React, { useState } from "react";

type TagContentType = { id: string; type: "tag"; value: string };
type ContentType = string | TagContentType;

const DynamicInput: React.FC = () => {
  const [content, setContent] = useState<ContentType[]>([]);
  const [inputText, setInputText] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.includes(",")) {
      const [textBeforeComma] = value.split(",");
      if (textBeforeComma.trim()) {
        addTag(textBeforeComma.trim());
      }
      setInputText("");
    } else {
      setInputText(value);
    }
  };

  const addTag = (tag: string) => {
    const newTag: TagContentType = {
      id: Math.random().toString(),
      type: "tag",
      value: tag,
    };
    setContent([...content, newTag]);
  };

  const removeTag = (id: string) => {
    setContent(
      content.filter((item) => !(typeof item === "object" && item.id === id))
    );
  };

  const renderContent = () => {
    return content.map((item, index) => {
      if (typeof item === "string") {
        return <span key={index}>{item}</span>;
      } else {
        return (
          <span
            key={item.id}
            className="bg-blue-500 text-white px-2 py-1 rounded-lg mr-1 inline-flex items-center"
          >
            {item.value}
            <button
              className="ml-2 text-white text-xs cursor-pointer"
              onClick={() => removeTag(item.id)}
            >
              x
            </button>
          </span>
        );
      }
    });
  };

  return (
    <div className="p-4">
      <div className="flex flex-wrap border border-gray-300 p-2 rounded-lg w-full min-h-[40px]">
        {renderContent()}

        <input
          className="border-none outline-none flex-grow"
          type="text"
          value={inputText}
          onChange={handleInputChange}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {["React", "Next.js", "Tailwind", "JavaScript", "CSS"].map(
          (tag, index) => (
            <button
              key={index}
              className="bg-gray-100 text-gray-800 px-4 py-1 rounded-lg hover:bg-gray-200"
              onClick={() => addTag(tag)}
            >
              {tag}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default DynamicInput;
