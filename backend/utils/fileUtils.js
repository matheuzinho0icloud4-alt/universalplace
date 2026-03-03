// Uploads were removed: local file utilities are now no-ops. Keep the API
// to avoid wide refactors; functions will resolve immediately.

async function removeUpload(/* url */) {
  // no-op: system now uses external image URLs only
  return Promise.resolve();
}

module.exports = {
  removeUpload,
};
