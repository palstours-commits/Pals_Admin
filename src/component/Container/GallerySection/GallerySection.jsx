"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Plus,
    Image as ImageIcon,
    Video,
    ChevronLeft,
    ChevronRight,
    Grid3x3,
    LayoutList,
    Search,
    X,
    Play,
    Calendar,
    FileText,
    Trash2,
    Pencil,
    FolderOpen,
    Sparkles,
} from "lucide-react";

import {
    getGallery,
    deleteGallery,
} from "../../../store/slice/gallerySlice";

import CreateGallery from "./CreateGallery";
import Image from "../../../common/Image";
import DotMenu from "../../../common/DotMenu";
import ConfirmDeleteModal from "../../../common/CommonDeleteModel";

const IMG_URL = import.meta.env.VITE_BASE_IMAGE_URL || "";

const Gallery = () => {
    const dispatch = useDispatch();

    const {
        galleries,
        galleryImages,
        galleryVideos,
        loading,
        actionLoading,
        imagePage,
        imageLimit,
        imageTotal,
        imageTotalPages,
        videoPage,
        videoLimit,
        videoTotal,
        videoTotalPages,
    } = useSelector((state) => state.gallery);

    const [showCreate, setShowCreate] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [viewMode, setViewMode] = useState("grid");
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [hoveredItem, setHoveredItem] = useState(null);

    useEffect(() => {
        dispatch(
            getGallery({
                imagePage,
                imageLimit,
                videoPage,
                videoLimit,
            })
        );
    }, [dispatch, imagePage, imageLimit, videoPage, videoLimit]);

    const getFileUrl = (item) =>
        item?.file ||
        item?.url ||
        item?.fileUrl ||
        item?.image ||
        item?.video ||
        item?.path ||
        "";

    const isVideo = (item) => {
        const url = getFileUrl(item);
        return (
            item?.type?.includes("video") ||
            item?.mimeType?.includes("video") ||
            /\.(mp4|webm|mov|avi|mkv)$/i.test(url)
        );
    };

    const getFullUrl = (url) => {
        if (!url) return "";
        if (url.startsWith("http://") || url.startsWith("https://")) {
            return url;
        }
        return `${IMG_URL}${url}`;
    };

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;
        const id = itemToDelete?._id || itemToDelete?.id;
        if (!id) return;

        const result = await dispatch(deleteGallery(id));
        if (deleteGallery.fulfilled.match(result)) {
            setDeleteModalOpen(false);
            setItemToDelete(null);
            dispatch(
                getGallery({
                    imagePage,
                    imageLimit,
                    videoPage,
                    videoLimit,
                })
            );
        }
    };

    const handleCancelDelete = () => {
        setDeleteModalOpen(false);
        setItemToDelete(null);
    };

    const handleEdit = (item) => {
        setSelectedItem(item);
        setShowCreate(true);
    };

    const handleCloseCreate = () => {
        setShowCreate(false);
        setSelectedItem(null);
        dispatch(
            getGallery({
                imagePage,
                imageLimit,
                videoPage,
                videoLimit,
            })
        );
    };

    const handlePreviousImage = () => {
        if (imagePage <= 1) return;
        dispatch(
            getGallery({
                imagePage: imagePage - 1,
                imageLimit,
                videoPage,
                videoLimit,
            })
        );
    };

    const handleNextImage = () => {
        if (imagePage >= imageTotalPages) return;
        dispatch(
            getGallery({
                imagePage: imagePage + 1,
                imageLimit,
                videoPage,
                videoLimit,
            })
        );
    };

    const handlePreviousVideo = () => {
        if (videoPage <= 1) return;
        dispatch(
            getGallery({
                imagePage,
                imageLimit,
                videoPage: videoPage - 1,
                videoLimit,
            })
        );
    };

    const handleNextVideo = () => {
        if (videoPage >= videoTotalPages) return;
        dispatch(
            getGallery({
                imagePage,
                imageLimit,
                videoPage: videoPage + 1,
                videoLimit,
            })
        );
    };

    const getFilteredItems = (items, type) => {
        let filtered = items || [];

        if (activeTab === "images" && type !== "image") return [];
        if (activeTab === "videos" && type !== "video") return [];

        if (searchTerm.trim()) {
            filtered = filtered.filter((item) =>
                (item?.name || item?.fileName || "")
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            );
        }

        return filtered;
    };

    const images = galleryImages?.length > 0 ? galleryImages : galleries?.filter((item) => !isVideo(item)) || [];
    const videos = galleryVideos?.length > 0 ? galleryVideos : galleries?.filter((item) => isVideo(item)) || [];

    const filteredImages = getFilteredItems(images, "image");
    const filteredVideos = getFilteredItems(videos, "video");
    const hasActiveFilter = searchTerm.trim() !== "" || activeTab !== "all";

    if (showCreate) {
        return <CreateGallery onClose={handleCloseCreate} editData={selectedItem} />;
    }

    const renderItemCard = (item, type, index) => {
        const url = getFileUrl(item);
        const isVideoItem = type === "video" || isVideo(item);
        const fullUrl = getFullUrl(url);
        const itemName = item?.name || item?.fileName || (isVideoItem ? "Video" : "Image");
        const isHovered = hoveredItem === (item?._id || item?.id || index);

        if (viewMode === "list") {
            return (
                <div
                    key={item?._id || item?.id || index}
                    className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-3 hover:shadow-md hover:border-gray-300 transition-all duration-200"
                    onMouseEnter={() => setHoveredItem(item?._id || item?.id || index)}
                    onMouseLeave={() => setHoveredItem(null)}
                >
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {isVideoItem ? (
                            <div className="relative w-full h-full">
                                <video src={fullUrl} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                    <Play size={20} className="text-white" fill="white" />
                                </div>
                            </div>
                        ) : (
                            <Image src={fullUrl} alt={itemName} className="w-full h-full object-cover" />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">{itemName}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-2 mt-1">
                            <Calendar size={12} />
                            <span>Added recently</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleEdit(item)}
                            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            <Pencil size={16} />
                        </button>
                        <button
                            onClick={() => handleDeleteClick(item)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div
                key={item?._id || item?.id || index}
                className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                onMouseEnter={() => setHoveredItem(item?._id || item?.id || index)}
                onMouseLeave={() => setHoveredItem(null)}
            >
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    {isVideoItem ? (
                        <div className="relative w-full h-full">
                            <video src={fullUrl} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                                    <Play size={24} className="text-red-500 ml-1" fill="currentColor" />
                                </div>
                            </div>
                            <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                                <Video size={12} />
                                Video
                            </div>
                        </div>
                    ) : (
                        <>
                            <Image
                                src={fullUrl}
                                alt={itemName}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                                <ImageIcon size={12} />
                                Image
                            </div>
                        </>
                    )}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <DotMenu onEdit={() => handleEdit(item)} onDelete={() => handleDeleteClick(item)} />
                    </div>
                </div>
                <div className="p-4">
                    <p className="text-sm font-medium text-gray-800 truncate">{itemName}</p>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <FileText size={12} />
                        {isVideoItem ? "Video file" : "Image file"}
                    </p>
                </div>
            </div>
        );
    };

    const renderSection = (
        title,
        items,
        type,
        currentPage,
        totalPages,
        onPrev,
        onNext,
        icon
    ) => {
        const filteredItems = items;
        const total = type === "image" ? imageTotal : videoTotal;

        if (activeTab !== "all" && activeTab !== (type === "image" ? "images" : "videos")) return null;

        if (filteredItems.length === 0 && !searchTerm.trim() && activeTab === "all") {
            return (
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-gradient-to-br from-red-50 to-red-100 rounded-xl">
                            {icon}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                            <p className="text-sm text-gray-400">0 {title.toLowerCase()}</p>
                        </div>
                    </div>
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl py-16 text-center bg-gray-50/50">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            {icon}
                        </div>
                        <p className="font-semibold text-gray-600">No {title.toLowerCase()} found</p>
                        <p className="text-sm text-gray-400 mt-1">Upload your first {title.toLowerCase()} to get started</p>
                    </div>
                </div>
            );
        }

        if (filteredItems.length === 0 && searchTerm.trim()) {
            return (
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-gradient-to-br from-red-50 to-red-100 rounded-xl">
                            {icon}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                        </div>
                    </div>
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl py-16 text-center bg-gray-50/50">
                        <Search size={40} className="text-gray-300 mx-auto mb-3" />
                        <p className="font-semibold text-gray-600">No matches found</p>
                        <p className="text-sm text-gray-400 mt-1">Try adjusting your search</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="mb-10">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-red-50 to-red-100 rounded-xl">
                            {icon}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                            <p className="text-sm text-gray-400">
                                {searchTerm.trim() ? `${filteredItems.length} matches` : `${total || filteredItems.length} ${title.toLowerCase()}`}
                            </p>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="bg-white border border-gray-200 rounded-2xl overflow-hidden animate-pulse">
                                <div className="aspect-square bg-gray-200"></div>
                                <div className="p-4">
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <div className={viewMode === "grid"
                            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5"
                            : "space-y-3"
                        }>
                            {filteredItems.map((item, index) => renderItemCard(item, type, index))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                                <p className="text-sm text-gray-500">
                                    Page <span className="font-semibold text-gray-700">{currentPage}</span> of{" "}
                                    <span className="font-semibold text-gray-700">{totalPages}</span>
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={onPrev}
                                        disabled={currentPage <= 1 || loading}
                                        className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronLeft size={16} />
                                        Previous
                                    </button>
                                    <button
                                        onClick={onNext}
                                        disabled={currentPage >= totalPages || loading}
                                        className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl text-sm font-medium hover:from-red-600 hover:to-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                                    >
                                        Next
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header with animation */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-red-400 to-red-600 rounded-xl blur opacity-30"></div>
                                <div className="relative bg-gradient-to-br from-red-500 to-red-600 text-white p-3 rounded-xl shadow-lg">
                                    <FolderOpen size={22} />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                    Media Gallery
                                    <Sparkles size={18} className="text-yellow-400" />
                                </h1>
                                <p className="text-sm text-gray-400 mt-0.5">
                                    Manage and organize your images and videos
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                setSelectedItem(null);
                                setShowCreate(true);
                            }}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl text-sm font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <Plus size={18} />
                            Add New Media
                        </button>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-4 mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="relative flex-1">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-10 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all backdrop-blur-sm"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex bg-gray-100/80 backdrop-blur-sm rounded-xl p-1">
                                {[
                                    { id: "all", label: "All" },
                                    { id: "images", label: "Images" },
                                    { id: "videos", label: "Videos" },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                                                ? "bg-white text-gray-800 shadow-sm"
                                                : "text-gray-500 hover:text-gray-700"
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            <div className="flex bg-gray-100/80 backdrop-blur-sm rounded-xl p-1">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-1.5 rounded-lg transition-all ${viewMode === "grid"
                                            ? "bg-white text-gray-800 shadow-sm"
                                            : "text-gray-400 hover:text-gray-600"
                                        }`}
                                >
                                    <Grid3x3 size={18} />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-1.5 rounded-lg transition-all ${viewMode === "list"
                                            ? "bg-white text-gray-800 shadow-sm"
                                            : "text-gray-400 hover:text-gray-600"
                                        }`}
                                >
                                    <LayoutList size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                    {hasActiveFilter && (
                        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                            <span className="text-xs text-gray-400">Active filters:</span>
                            {activeTab !== "all" && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                                    {activeTab}
                                    <button onClick={() => setActiveTab("all")} className="hover:text-gray-800 transition-colors">
                                        <X size={12} />
                                    </button>
                                </span>
                            )}
                            {searchTerm && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                                    "{searchTerm}"
                                    <button onClick={() => setSearchTerm("")} className="hover:text-gray-800 transition-colors">
                                        <X size={12} />
                                    </button>
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="space-y-6">
                    {renderSection(
                        "Images",
                        filteredImages,
                        "image",
                        imagePage,
                        imageTotalPages,
                        handlePreviousImage,
                        handleNextImage,
                        <ImageIcon size={20} className="text-red-500" />
                    )}

                    {renderSection(
                        "Videos",
                        filteredVideos,
                        "video",
                        videoPage,
                        videoTotalPages,
                        handlePreviousVideo,
                        handleNextVideo,
                        <Video size={20} className="text-red-500" />
                    )}

                    {activeTab !== "all" &&
                        ((activeTab === "images" && filteredImages.length === 0) ||
                            (activeTab === "videos" && filteredVideos.length === 0)) && (
                            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-12 text-center">
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    {activeTab === "images" ? <ImageIcon size={32} className="text-gray-400" /> : <Video size={32} className="text-gray-400" />}
                                </div>
                                <h3 className="text-lg font-semibold text-gray-600">No {activeTab} found</h3>
                                <p className="text-sm text-gray-400 mt-1">Upload your first {activeTab.slice(0, -1)} to get started</p>
                            </div>
                        )}
                </div>
            </div>

            <ConfirmDeleteModal
                isOpen={deleteModalOpen}
                title="Are you sure you want to delete this item?"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                loading={actionLoading}
            />
        </div>
    );
};

export default Gallery;