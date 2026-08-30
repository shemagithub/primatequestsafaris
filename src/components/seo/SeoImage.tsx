import type { ImgHTMLAttributes } from "react";
import { mediaUrl } from "@/lib/media";

type SeoImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  alt: string;
  priority?: boolean;
};

export default function SeoImage({
  alt,
  src,
  priority = false,
  loading,
  decoding,
  fetchPriority,
  ...rest
}: SeoImageProps) {
  return (
    <img
      alt={alt}
      src={mediaUrl(src)}
      loading={loading ?? (priority ? "eager" : "lazy")}
      decoding={decoding ?? "async"}
      fetchPriority={fetchPriority ?? (priority ? "high" : "auto")}
      {...rest}
    />
  );
}
