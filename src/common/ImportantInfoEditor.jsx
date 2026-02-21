"use client";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const ImportantInfoEditor = ({ value = [], onChange }) => {
  // Ensure at least one item exists

  const safeValue = Array.isArray(value) ? value : [];
  const items = safeValue.length ? safeValue : [{ title: "", content: "" }];
  const updateItem = (index, key, val) => {
    const updated = [...items];
    updated[index][key] = val;
    onChange(updated);
  };

  const addEmptyRow = () => {
    onChange([...items, { title: "", content: "" }]);
  };

  return (
    <div className="space-y-5">
      {items.map((item, index) => (
        <div
          key={index}
          className="border border-gray-300 rounded-lg p-4 space-y-3"
        >
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Enter title (e.g. Check-in)"
              value={item.title}
              onChange={(e) => updateItem(index, "title", e.target.value)}
              className="border w-full rounded-md px-3 py-2 border-gray-300 outline-none"
            />
            {index === items.length - 1 && (
              <button
                type="button"
                onClick={addEmptyRow}
                className="text-green-600    font-semibold cursor-pointer"
              >
                +
              </button>
            )}
          </div>
          <CKEditor
            editor={ClassicEditor}
            data={item.content}
            config={{
              licenseKey: "GPL",
              toolbar: [
                "bold",
                "italic",
                "underline",
                "|",
                "bulletedList",
                "numberedList",
                "|",
                "link",
                "|",
                "undo",
                "redo",
              ],
            }}
            onChange={(event, editor) =>
              updateItem(index, "content", editor.getData())
            }
          />
        </div>
      ))}
    </div>
  );
};

export default ImportantInfoEditor;
