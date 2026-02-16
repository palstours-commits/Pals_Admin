export const ItineraryEditor = ({ value = [], onChange }) => {
  const addDay = () => {
    onChange([
      ...value,
      {
        day: value.length + 1,
        title: "",
        location: "",
        content: "",
      },
    ]);
  };

  const updateDay = (index, field, fieldValue) => {
    const updated = [...value];
    updated[index][field] = fieldValue;
    onChange(updated);
  };

  const removeDay = (index) => {
    const updated = value.filter((_, i) => i !== index);
    onChange(updated.map((d, i) => ({ ...d, day: i + 1 })));
  };

  return (
    <div className="space-y-4">
      {value.map((item, index) => (
        <div
          key={index}
          className="border border-gray-300 rounded-lg p-4 space-y-3"
        >
          <div className="flex justify-between items-center">
            <h4 className="font-semibold">Day {item.day}</h4>
            <button
              type="button"
              onClick={() => removeDay(index)}
              className="text-red-600 text-sm"
            >
              Remove
            </button>
          </div>

          <input
            placeholder="Title (Arrival, Sightseeing...)"
            value={item.title}
            onChange={(e) => updateDay(index, "title", e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 outline-0"
          />

          <input
            placeholder="Location"
            value={item.location}
            onChange={(e) => updateDay(index, "location", e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 outline-0"
          />

          <textarea
            placeholder="Day description"
            value={item.content}
            onChange={(e) => updateDay(index, "content", e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-md p-2 outline-0"
          />
        </div>
      ))}

      <button
        type="button"
        onClick={addDay}
        className="px-4 py-2 border border-dashed border-gray-400 rounded-lg cursor-pointer"
      >
        + Add Day
      </button>
    </div>
  );
};

export default ItineraryEditor;
