/**
 * Compresses an image file in the browser before upload: resizes to a max
 * width and re-encodes as JPEG at the given quality. This runs entirely
 * client-side via the Canvas API - no upload happens until after this.
 *
 * Handles EXIF orientation manually: the Canvas API strips EXIF data when
 * drawing, so without this step photos taken on phones held sideways/upside
 * down would come out rotated incorrectly.
 */

const MAX_WIDTH = 1280;
const JPEG_QUALITY = 0.7;

// Reads the EXIF orientation tag (1-8) directly from JPEG bytes.
// Returns 1 (normal) for non-JPEGs or if no orientation tag is found.
const readExifOrientation = (arrayBuffer) => {
  const view = new DataView(arrayBuffer);
  if (view.getUint16(0, false) !== 0xffd8) return 1; // not a JPEG

  let offset = 2;
  const length = view.byteLength;

  while (offset < length) {
    const marker = view.getUint16(offset, false);
    offset += 2;
    if (marker === 0xffe1) {
      // EXIF marker
      const exifLength = view.getUint16(offset, false);
      const exifOffset = offset + 2;
      if (view.getUint32(exifOffset, false) !== 0x45786966) return 1; // "Exif"
      const tiffOffset = exifOffset + 6;
      const little = view.getUint16(tiffOffset, false) === 0x4949;
      const firstIfdOffset = view.getUint32(tiffOffset + 4, little);
      const dirStart = tiffOffset + firstIfdOffset;
      const entries = view.getUint16(dirStart, little);

      for (let i = 0; i < entries; i++) {
        const entryOffset = dirStart + 2 + i * 12;
        const tag = view.getUint16(entryOffset, little);
        if (tag === 0x0112) {
          return view.getUint16(entryOffset + 8, little);
        }
      }
      return 1;
    } else if ((marker & 0xff00) !== 0xff00) {
      break;
    } else {
      offset += view.getUint16(offset, false);
    }
  }
  return 1;
};

// Applies the canvas transform needed to visually correct a given EXIF
// orientation value, returning the final {width, height} for the canvas.
const applyOrientation = (ctx, orientation, width, height) => {
  switch (orientation) {
    case 2:
      ctx.transform(-1, 0, 0, 1, width, 0);
      break;
    case 3:
      ctx.transform(-1, 0, 0, -1, width, height);
      break;
    case 4:
      ctx.transform(1, 0, 0, -1, 0, height);
      break;
    case 5:
      ctx.transform(0, 1, 1, 0, 0, 0);
      break;
    case 6:
      ctx.transform(0, 1, -1, 0, height, 0);
      break;
    case 7:
      ctx.transform(0, -1, -1, 0, height, width);
      break;
    case 8:
      ctx.transform(0, -1, 1, 0, 0, width);
      break;
    default:
      break;
  }
};

/**
 * @param {File} file - original image file
 * @returns {Promise<File>} a new, compressed File (always .jpg), or the
 *   original file unchanged if compression fails for any reason - an
 *   upload should never be blocked by a compression error.
 */
export const compressImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onerror = () => resolve(file);

    reader.onload = (e) => {
      const arrayBuffer = e.target.result;
      let orientation = 1;
      try {
        orientation = readExifOrientation(arrayBuffer);
      } catch {
        orientation = 1;
      }

      const blobUrl = URL.createObjectURL(new Blob([arrayBuffer]));
      const img = new Image();

      img.onload = () => {
        try {
          const swapDimensions = orientation >= 5 && orientation <= 8;
          const sourceWidth = img.width;
          const sourceHeight = img.height;

          const scale = Math.min(1, MAX_WIDTH / sourceWidth);
          const targetWidth = Math.round(sourceWidth * scale);
          const targetHeight = Math.round(sourceHeight * scale);

          const canvas = document.createElement("canvas");
          canvas.width = swapDimensions ? targetHeight : targetWidth;
          canvas.height = swapDimensions ? targetWidth : targetHeight;

          const ctx = canvas.getContext("2d");
          applyOrientation(ctx, orientation, targetWidth, targetHeight);
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

          canvas.toBlob(
            (blob) => {
              URL.revokeObjectURL(blobUrl);
              if (!blob) {
                resolve(file);
                return;
              }
              const newName = file.name.replace(/\.[^.]+$/, "") + ".jpg";
              resolve(new File([blob], newName, { type: "image/jpeg" }));
            },
            "image/jpeg",
            JPEG_QUALITY
          );
        } catch (err) {
          console.error("Compression failed, using original file:", err);
          URL.revokeObjectURL(blobUrl);
          resolve(file);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(blobUrl);
        resolve(file);
      };

      img.src = blobUrl;
    };

    reader.readAsArrayBuffer(file);
  });
};

// ── LQIP generator ────────────────────────────────────────────────────────────
const LQIP_WIDTH = 20; // pixels wide — tiny enough to be <1KB as base64
const LQIP_QUALITY = 0.4;

/**
 * Generates a Low Quality Image Placeholder (LQIP) from an image File.
 * Returns a base64-encoded JPEG data URL (e.g. "data:image/jpeg;base64,...")
 * that can be stored in Firestore and used as an instant blurry placeholder
 * while the full image loads.
 *
 * Reuses the same EXIF orientation correction as compressImage so the
 * placeholder is never rotated incorrectly either.
 *
 * Returns null on failure — callers should treat null as "no placeholder
 * available" and fall back to a solid background.
 *
 * @param {File} file
 * @returns {Promise<string|null>}
 */
export const generateLQIP = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onerror = () => resolve(null);

    reader.onload = (e) => {
      const arrayBuffer = e.target.result;
      let orientation = 1;
      try {
        orientation = readExifOrientation(arrayBuffer);
      } catch {
        orientation = 1;
      }

      const blobUrl = URL.createObjectURL(new Blob([arrayBuffer]));
      const img = new Image();

      img.onload = () => {
        try {
          const swapDimensions = orientation >= 5 && orientation <= 8;
          const sourceWidth = img.width;
          const sourceHeight = img.height;

          const scale = LQIP_WIDTH / sourceWidth;
          const targetWidth = LQIP_WIDTH;
          const targetHeight = Math.round(sourceHeight * scale);

          const canvas = document.createElement("canvas");
          canvas.width = swapDimensions ? targetHeight : targetWidth;
          canvas.height = swapDimensions ? targetWidth : targetHeight;

          const ctx = canvas.getContext("2d");
          applyOrientation(ctx, orientation, targetWidth, targetHeight);
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

          const dataUrl = canvas.toDataURL("image/jpeg", LQIP_QUALITY);
          URL.revokeObjectURL(blobUrl);
          resolve(dataUrl);
        } catch (err) {
          console.error("LQIP generation failed:", err);
          URL.revokeObjectURL(blobUrl);
          resolve(null);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(blobUrl);
        resolve(null);
      };

      img.src = blobUrl;
    };

    reader.readAsArrayBuffer(file);
  });
};