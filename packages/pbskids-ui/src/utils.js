export default function getSlug(title) {
  return title
    .toLowerCase()
    .replace(/&/g, 'and')
    // Remove invalid characters
    .replace(/[^a-z0-9 -]/g, '')
    // Replace whitespace by -
    .replace(/\s+/g, '-')
    // Collapse dashes
    .replace(/-+/g, '-');
}
