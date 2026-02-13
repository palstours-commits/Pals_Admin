const InputField = ({
    type = "text",
    name,
    placeholder,
    value,
    onChange,
    required = false,
    showLabel = true,
}) => {
    return (
        <div>
            {showLabel && name && (
                <label className="block mb-1 text-gray-700 capitalize">
                    Enter your {name.replace(/([A-Z])/g, " $1")}
                </label>
            )}
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full border border-gray-300 p-2 rounded focus:outline-none"
            />
        </div>
    );
};

export default InputField;
