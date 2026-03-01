const fs = require('fs').promises;
const path = require('path');

/**
 * Given a public URL pointing to /uploads/filename, extract and decode the
 * filename portion. Returns null if the URL is not in the expected format.
 */
function extractFilenameFromUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const parts = url.split('/uploads/');
  if (parts.length < 2) return null;
  // decode in case the name was encoded when served
  return decodeURIComponent(parts[1].split('?')[0]);
}

/**
 * Delete an upload file by its relative filename under backend/uploads.
 * Silently ignores ENOENT (file already gone) and logs other errors.
 */
async function deleteFileIfExists(filename) {
  if (!filename) return;
  const fullPath = path.join(__dirname, '..', 'uploads', filename);
  try {
    await fs.unlink(fullPath);
    console.log(`🗑️ [FILE UTIL] Removed file ${filename}`);
  } catch (err) {
    if (err.code === 'ENOENT') {
      // already deleted, nothing to do
      console.warn(`⚠️ [FILE UTIL] Tried to delete ${filename} but it did not exist`);
    } else {
      console.error(`❌ [FILE UTIL] Error deleting ${filename}:`, err.message);
    }
  }
}

/**
 * Convenience function that accepts a public URL and deletes the corresponding
 * file if it resides in the uploads folder.
 */
async function removeUpload(url) {
  const filename = extractFilenameFromUrl(url);
  if (filename) {
    await deleteFileIfExists(filename);
  }
}

module.exports = {
  extractFilenameFromUrl,
  deleteFileIfExists,
  removeUpload,
};
