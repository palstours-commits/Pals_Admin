"use client";
import { LayoutGrid, List, Calendar } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Image from "../../../common/Image";
import DotMenu from "../../../common/DotMenu";
import ConfirmDeleteModal from "../../../common/CommonDeleteModel";
import CreateBlog from "./CreateBlog";

import { notifyAlert } from "../../../utils/notificationService";
import { formatIndianDateTime } from "../../../utils/formatDateTime";

import {
  getBlogs,
  deleteBlog,
  clearBlogError,
  clearBlogMessage,
} from "../../../store/slice/blogSlice";

const BlogSection = () => {
  const dispatch = useDispatch();

  const { blogs, loading, deletedMessage, deletedError } = useSelector(
    (state) => state.blog,
  );

  const [openModal, setOpenModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewType, setViewType] = useState("grid");

  useEffect(() => {
    dispatch(getBlogs());
  }, [dispatch]);

  useEffect(() => {
    if (deletedMessage) {
      notifyAlert({
        title: "Success",
        message: deletedMessage,
        type: "success",
      });
      dispatch(clearBlogMessage());
    }

    if (deletedError) {
      notifyAlert({ title: "Error", message: deletedError, type: "error" });
      dispatch(clearBlogError());
    }
  }, [deletedMessage, deletedError, dispatch]);

  const filteredBlogs = blogs?.filter((blog) => {
    if (!searchTerm.trim()) return true;
    const search = searchTerm.toLowerCase();

    return (
      blog?.title?.toLowerCase().includes(search) ||
      blog?.category?.toLowerCase().includes(search) ||
      (search === "active" && blog?.status === 1) ||
      (search === "inactive" && blog?.status === 0)
    );
  });

  const handleDelete = async () => {
    await dispatch(deleteBlog(deleteId));
    setConfirmOpen(false);
    setDeleteId(null);
  };

  return (
    <>
      {openModal ? (
        <CreateBlog
          blogData={selectedBlog}
          onClose={() => {
            setOpenModal(false);
            setSelectedBlog(null);
          }}
        />
      ) : (
        <div className="min-h-screen">
          <div className="flex justify-between items-center mb-6 px-10">
            <h2 className="text-xl font-bold">
              Blog List ({blogs?.length || 0})
            </h2>

            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Search by title, category, status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 px-4 py-2 rounded-md text-sm w-64 outline-0"
              />

              <button
                onClick={() => setOpenModal(true)}
                className="bg-green-800 text-white px-6 py-2 rounded-md"
              >
                + Create Blog
              </button>

              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewType("grid")}
                  className={`px-4 py-2 rounded-md ${
                    viewType === "grid"
                      ? "bg-green-800 text-white"
                      : "text-gray-600"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setViewType("list")}
                  className={`px-4 py-2 rounded-md ${
                    viewType === "list"
                      ? "bg-green-800 text-white"
                      : "text-gray-600"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {viewType === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 p-8">
              {filteredBlogs?.map((blog) => (
                <div
                  key={blog._id}
                  className="bg-white rounded-xl shadow overflow-hidden"
                >
                  <Link to={`/blog/${blog._id}`}>
                    <div className="relative h-52">
                      <Image
                        src={blog.featuredImage}
                        alt={blog.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </Link>

                  <div className="p-5">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-semibold text-blue-600">
                        {blog.category}
                      </span>

                      <DotMenu
                        onEdit={() => {
                          setSelectedBlog(blog);
                          setOpenModal(true);
                        }}
                        onDelete={() => {
                          setDeleteId(blog._id);
                          setConfirmOpen(true);
                        }}
                      />
                    </div>

                    <h3 className="text-lg font-semibold line-clamp-1">
                      {blog.title}
                    </h3>

                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                      {blog.shortDescription}
                    </p>

                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-3">
                      <Calendar className="w-4 h-4" />
                      {formatIndianDateTime(blog.createdAt)}
                    </div>

                    <div className="mt-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          blog.status === 1
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {blog.status === 1 ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {filteredBlogs?.map((blog) => (
                <div
                  key={blog._id}
                  className="bg-white rounded-lg shadow flex gap-4 p-4 items-center"
                >
                  <Link to={`/blog/${blog._id}`} className="w-40 h-28 shrink-0">
                    <Image
                      src={blog.featuredImage}
                      alt={blog.title}
                      className="h-full w-full object-cover rounded-md"
                    />
                  </Link>

                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="text-lg font-semibold">{blog.title}</h3>

                      <DotMenu
                        onEdit={() => {
                          setSelectedBlog(blog);
                          setOpenModal(true);
                        }}
                        onDelete={() => {
                          setDeleteId(blog._id);
                          setConfirmOpen(true);
                        }}
                      />
                    </div>

                    <p className="text-sm text-blue-600">{blog.category}</p>

                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                      {blog.shortDescription}
                    </p>

                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>{formatIndianDateTime(blog.createdAt)}</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          blog.status === 1
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {blog.status === 1 ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <ConfirmDeleteModal
        isOpen={confirmOpen}
        title="Are you sure you want to delete this blog?"
        loading={loading}
        onConfirm={handleDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setDeleteId(null);
        }}
      />
    </>
  );
};

export default BlogSection;
