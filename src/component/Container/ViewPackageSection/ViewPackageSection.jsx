import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getPackageById } from "../../../store/slice/packageSlice";
import Image from "../../../common/Image";
import { ArrowLeft } from "lucide-react";

const ViewPackageSection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const { singlePackage, loading } = useSelector((state) => state.package);

  useEffect(() => {
    if (id) {
      dispatch(getPackageById(id));
    }
  }, [dispatch, id]);

  if (loading || !singlePackage) {
    return (
      <div className="px-6 py-10 text-center text-gray-500">
        Loading package details...
      </div>
    );
  }

  return (
    <div className="px-6 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-lg font-semibold text-gray-600 hover:text-red-500 transition cursor-pointer"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="relative max-h-[360px] overflow-hidden rounded-xl">
        <Image
          src={singlePackage.images[0]}
          alt={singlePackage.packageName}
          className="w-full h-[360px] object-cover"
        />
      </div>
      <h3 className="text-gray-600 text-4xl font-semibold">
        {singlePackage?.zoneId?.name}
      </h3>
      <h2 className="text-2xl font-bold">{singlePackage.packageName}</h2>
      <p className="text-gray-500">
        {singlePackage.days} Days / {singlePackage.nights} Nights
      </p>
      <div>
        <h4 className="text-xl font-semibold mb-2">Overview</h4>
        <p className="text-gray-600 whitespace-pre-line">
          {singlePackage.overview?.Description}
        </p>
      </div>
      <ul className="list-disc pl-6 space-y-2 text-gray-600">
        {singlePackage.tripHighlights
          .replace(/<\/?p>/g, "")
          .split("<br>")
          .map((item, index) =>
            item.trim() ? <li key={index}>{item.trim()}</li> : null,
          )}
      </ul>

      {singlePackage?.importantInfo && (
        <div>
          {singlePackage?.importantInfo && (
            <div>
              <h4 className="text-xl font-semibold mb-3">
                Important Information
              </h4>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                {singlePackage.importantInfo
                  .match(/<li>(.*?)<\/li>/g)
                  ?.map((li, index) => (
                    <li
                      key={index}
                      dangerouslySetInnerHTML={{
                        __html: li.replace(/<\/?li>/g, ""),
                      }}
                    />
                  ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewPackageSection;
