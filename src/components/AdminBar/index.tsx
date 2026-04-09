/* eslint-disable */
"use client";

import {
  useSelectedLayoutSegments,
  useRouter,
  usePathname
} from "next/navigation";
import { type PayloadAdminBarProps, PayloadAdminBar } from "payload-admin-bar";
import { useCallback, useState } from "react";
import { Eye } from "lucide-react";

import { cn } from "@/utilities/cn";

import "./index.scss";

import { getClientSideURL } from "@/utilities/getURL";

const baseClass = "admin-bar";

const collectionLabels = {
  pages: {
    plural: "Pages",
    singular: "Page"
  },
  posts: {
    plural: "Posts",
    singular: "Post"
  },
  projects: {
    plural: "Projects",
    singular: "Project"
  }
};

const Title = () => <span>Dashboard</span>;

export const AdminBar = (props: { adminBarProps?: PayloadAdminBarProps }) => {
  const { adminBarProps } = props || {};
  const segments = useSelectedLayoutSegments();
  const [show, setShow] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const collection = collectionLabels?.[segments?.[1]]
    ? segments?.[1]
    : "pages";
  const router = useRouter();
  const pathname = usePathname();

  const onAuthChange = useCallback((user) => {
    setShow(user?.id);
  }, []);

  const handlePreviewEdit = useCallback(async () => {
    if (isPreviewLoading) return;

    setIsPreviewLoading(true);
    // console.log("AdminBar - Current pathname:", pathname, "Collection:", collection);

    try {
      const response = await fetch(
        `/api/enable-preview?path=${encodeURIComponent(pathname)}&collection=${collection}&locale=en`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success && data.previewUrl) {
        // Show success message before redirect
        const successMsg = document.createElement("div");
        successMsg.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: #10b981;
          color: white;
          padding: 12px 16px;
          border-radius: 8px;
          z-index: 9999;
          font-size: 14px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        successMsg.innerHTML = `
          <div style="display: flex; align-items: center; gap: 8px;">
            <span>✨</span>
            <span>Visual editing mode enabled! Redirecting...</span>
          </div>
        `;
        document.body.appendChild(successMsg);

        // Redirect after a brief delay
        setTimeout(() => {
          window.location.href = data.previewUrl;
        }, 800);
      } else {
        throw new Error(data.error || "Failed to enable preview mode");
      }
    } catch (error) {
      console.error("Error enabling preview:", error);

      // Show user-friendly error message
      const errorMsg = document.createElement("div");
      errorMsg.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ef4444;
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        z-index: 9999;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      `;
      errorMsg.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
          <span>❌</span>
          <div>
            <div style="font-weight: 600;">Preview mode failed</div>
            <div style="font-size: 12px; opacity: 0.9;">${error instanceof Error ? error.message : "Unknown error occurred"}</div>
          </div>
        </div>
      `;
      document.body.appendChild(errorMsg);

      // Auto-remove error after 5 seconds
      setTimeout(() => {
        if (errorMsg.parentNode) {
          errorMsg.parentNode.removeChild(errorMsg);
        }
      }, 5000);
    }
    setIsPreviewLoading(false);
  }, [pathname, collection, isPreviewLoading]);

  return (
    <div className={cn(baseClass, "block bg-black py-2 text-white")}>
      <div className="container flex items-center justify-between">
        <div className="flex-1">
          <PayloadAdminBar
            apiPath="/api/administrators"
            {...adminBarProps}
            className="py-2 text-white"
            classNames={{
              controls: "font-medium text-white",
              logo: "text-white",
              user: "text-white"
            }}
            cmsURL={getClientSideURL()}
            collection={collection}
            collectionLabels={{
              plural: collectionLabels[collection]?.plural || "Pages",
              singular: collectionLabels[collection]?.singular || "Page"
            }}
            logo={<Title />}
            onAuthChange={onAuthChange}
            onPreviewExit={() => {
              fetch("/api/disable-preview").then(() => {
                router.push("/");
                router.refresh();
              });
            }}
            style={{
              backgroundColor: "transparent",
              padding: 0,
              position: "relative",
              zIndex: "unset"
            }}
          />
        </div>

        <div className="ml-4 flex items-center gap-2">
          {/* <button
            onClick={handlePreviewEdit}
            disabled={isPreviewLoading}
            className="flex items-center gap-2 rounded bg-blue-600 px-3 py-1 text-sm text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400"
            title="Preview Edit Mode"
          >
            <Eye size={14} />
            {isPreviewLoading ? "Loading..." : "Preview Edit"}
          </button> */}
        </div>
      </div>
    </div>
  );
};
