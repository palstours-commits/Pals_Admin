const IMG_URL = import.meta.env.VITE_BASE_IMAGE_URL || "";
const Image = ({ src = "", alt = "image", className = "", style = {} }) => {
    const imageSrc = src.startsWith("http") ? src : `${IMG_URL}${src}`;
    return (
        <img
            src={imageSrc}
            alt={alt}
            className={className}
            style={style}
            onError={(e) => {
                e.target.src = "/fallback.png";
            }}
        />
    );
};
export default Image;
