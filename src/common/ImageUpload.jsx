import { Pencil } from "lucide-react";
import { useRef } from "react";
import Image from "./Image"; // 👈 import your custom Image component

const ImageUpload = ({ image, onImageChange, size = "120x120" }) => {
  const fileRef = useRef();

  return (
    <div className="relative w-[161px] h-[120px]">
      <div
        className="w-full h-full bg-gray-200 rounded-3xl 
                   flex items-center justify-center 
                   shadow-md overflow-hidden"
      >
        {image ? (
          typeof image === "string" ? (
            <Image
              src={image}
              alt="preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={URL.createObjectURL(image)}
              alt="preview"
              className="w-full h-full object-cover"
            />
          )
        ) : (
          <span className="text-gray-400 text-lg font-medium">{size}</span>
        )}
      </div>

      <button
        type="button"
        onClick={() => fileRef.current.click()}
        className="absolute -bottom-3 -right-3 
                   bg-white shadow-lg 
                   w-10 h-10 rounded-full 
                   flex items-center justify-center
                   hover:scale-105 transition"
      >
        <Pencil className="w-4 h-4 text-gray-600 cursor-pointer" />
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={(e) => onImageChange(e.target.files[0])}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;
