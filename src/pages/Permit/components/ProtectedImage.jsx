import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

const API_ORIGIN = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

function useAuthenticatedImage(src) {
  const [objectUrl, setObjectUrl] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!src) return;
    let active = true;
    let blobUrl = null;
    setObjectUrl(null);
    setFailed(false);

    if (/^(data:|blob:)/i.test(src)) {
      setObjectUrl(src);
      return;
    }

    let requestUrl;
    try {
      requestUrl = new URL(src, API_ORIGIN || window.location.origin);
    } catch {
      setFailed(true);
      return;
    }

    const apiOrigin = API_ORIGIN
      ? new URL(API_ORIGIN).origin
      : window.location.origin;
    const sameOrigin = requestUrl.origin === apiOrigin;

    if (!sameOrigin) {
      setObjectUrl(requestUrl.href); // Never send the app bearer token to unrelated hosts.
      return;
    }

    const token = localStorage.getItem("token");
    fetch(requestUrl.href, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.blob();
      })
      .then((blob) => {
        if (!active) return;
        blobUrl = URL.createObjectURL(blob);
        setObjectUrl(blobUrl);
      })
      .catch(() => {
        if (active) setFailed(true);
      });

    return () => {
      active = false;
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [src]);

  return { src: failed ? null : objectUrl, failed };
}

export default function ProtectedImage({ src, alt, className }) {
  const { src: safeSrc, failed } = useAuthenticatedImage(src);
  if (failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 bg-slate-100 py-10 text-slate-400 ${className ?? ""}`}
      >
        <Icon icon="lucide:image-off" width="28" />
        <span className="text-xs">Gambar tidak dapat dimuat</span>
      </div>
    );
  }
  if (!safeSrc) {
    return (
      <div
        className={`flex items-center justify-center bg-slate-100 py-10 text-slate-400 ${className ?? ""}`}
      >
        <Icon icon="lucide:loader-2" width="24" className="animate-spin" />
      </div>
    );
  }
  return <img src={safeSrc} alt={alt} loading="lazy" className={className} />;
}
