// public/app.js
function openModule(slug) {
  const tagMap = {
    authentication: 'Authentication',
    'admin-security': 'Admin - Security & Audit',
    hr: 'Human Resources',
    profile: 'Profile',
  };

  const tag = tagMap[slug];
  if (!tag) return;

  window.open(`/api/#/default/${encodeURIComponent(tag)}`, '_blank');
}
