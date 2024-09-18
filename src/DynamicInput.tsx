import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "react-query";
import { v4 as uuidv4 } from "uuid"; // For generating unique IDs

// Define the type for a tag and the mixed content
type TagContentType = { id: string; type: "tag"; value: string };
type ContentType = string | TagContentType;

// Simulating an API call for tag suggestions
const fetchTags = async (): Promise<string[]> => {
  return ["React", "Next.js", "Tailwind", "JavaScript", "CSS"];
};

const DynamicInput: React.FC = () => {
  const [content, setContent] = useState<ContentType[]>([]);
  const editableDivRef = useRef<HTMLDivElement>(null);

  // React Query to fetch tags
  const { data: tagsList, isLoading } = useQuery("tags", fetchTags);

  useEffect(() => {
    if (editableDivRef.current) {
      editableDivRef.current.focus();
    }
  }, []);

  // Function to insert the tag at the current cursor position
  const insertTag = (tag: string) => {
    const selection = window.getSelection();
    if (!selection || !editableDivRef.current?.contains(selection.anchorNode))
      return;

    const range = selection.getRangeAt(0);
    const newTag: TagContentType = { id: uuidv4(), type: "tag", value: tag }; // Generate a unique ID for the tag

    range.deleteContents();
    range.insertNode(createTagNode(newTag));

    const spaceNode = document.createTextNode(" ");
    range.insertNode(spaceNode);
    range.setStartAfter(spaceNode);
    range.setEndAfter(spaceNode);

    const newContent: ContentType[] = [...content, newTag]; // Append new tag at the end
    setContent(newContent);

    selection.removeAllRanges();
    selection.addRange(range);

    editableDivRef.current?.focus();
  };

  const createTagNode = (tag: TagContentType) => {
    const span = document.createElement("span");
    span.className =
      "bg-blue-500 text-white px-2 py-1 rounded-lg mr-1 inline-flex items-center";
    span.contentEditable = "false"; // Explicitly set contentEditable to false
    span.dataset.id = tag.id; // Associate with unique ID

    const tagText = document.createTextNode(tag.value);
    span.appendChild(tagText);

    const deleteButton = document.createElement("button");
    deleteButton.className = "ml-2 text-white text-xs cursor-pointer";
    deleteButton.textContent = "x";
    deleteButton.onclick = () => handleDeleteTag(tag.id); // Use the tag's unique ID for deletion
    span.appendChild(deleteButton);

    return span;
  };

  const handleDeleteTag = (tagId: string) => {
    setContent((prevContent) =>
      prevContent.filter(
        (item) => !(typeof item === "object" && item.id === tagId)
      )
    );

    const editableDiv = editableDivRef.current;
    if (editableDiv) {
      const childrenArray = Array.from(editableDiv.children);
      childrenArray.forEach((child) => {
        if (child instanceof HTMLElement && child.dataset.id === tagId) {
          child.remove(); // Remove the tag with matching unique ID
        }
      });
    }
  };

  const handleAddNewTag = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === ",") {
      event.preventDefault();
      const text = editableDivRef.current?.innerText.trim();
      insertTag(text || "");
    }
  };

  return (
    <div className="p-4">
      <div
        contentEditable
        ref={editableDivRef}
        className="border border-gray-300 p-2 rounded-lg w-full min-h-[40px] flex items-center flex-wrap"
        onKeyDown={(event) => handleAddNewTag(event)}
        suppressContentEditableWarning={true}
      ></div>

      {/* Tag suggestions */}
      <div className="mt-4 flex flex-wrap gap-2">
        {!isLoading &&
          tagsList?.map((tag, index) => (
            <button
              key={index}
              className="bg-gray-100 text-gray-800 px-4 py-1 rounded-lg hover:bg-gray-200"
              onClick={() => insertTag(tag)}
            >
              {tag}
            </button>
          ))}
      </div>
    </div>
  );
};

export default DynamicInput;
