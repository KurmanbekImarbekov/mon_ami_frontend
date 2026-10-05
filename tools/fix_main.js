const fs = require('fs');
let src = fs.readFileSync('js/main (1).js', 'utf8');

// 1. Fix initMenu
src = src.replace(
  "  // Build tabs: \"Все\" + each category\n  var html = '<button class=\"cat-tab active\" data-cat=\"all\" onclick=\"filterByCategory(\\'all\\')\">Все</button>';\n  cats.forEach(function (cat) {\n    html += '<button class=\"cat-tab\" data-cat=\"' + cat.id + '\" onclick=\"filterByCategory(\\'' + cat.id + '\\')\">' + cat.name + '</button>';\n  });\n  tabsEl.innerHTML = html;\n\n  // Load first category by default (Завтраки)\n  renderCategory('all');",
  "  // Build tabs: only categories - NO \"Все\" tab!\n  var firstCatId = cats.length > 0 ? cats[0].id : null;\n  var html = '';\n  cats.forEach(function (cat) {\n    var active = cat.id === firstCatId ? ' active' : '';\n    html += '<button class=\"cat-tab' + active + '\" data-cat=\"' + cat.id + '\" onclick=\"filterByCategory(\\'' + cat.id + '\\')\">' + cat.name + '</button>';\n  });\n  tabsEl.innerHTML = html;\n\n  // Load first category by default (Завтраки)\n  if (firstCatId) {\n    activeCategory = firstCatId;\n    renderCategory(firstCatId);\n  }"
);

// 2. Fix renderCategory
src = src.replace(
  "  var filtered = catId === 'all'\n    ? products\n    : products.filter(function (p) { return p.category === catId; });\n\n  // Apply search if active\n  if (searchQuery) {\n    var q = searchQuery.toLowerCase();\n    filtered = filtered.filter(function (p) {\n      return p.name.toLowerCase().includes(q) ||\n        (p.description && p.description.toLowerCase().includes(q)) ||\n        (p.tags && p.tags.some(function (t) { return t.toLowerCase().includes(q); }));\n    });\n  }",
  "  var filtered;\n  // If search is active, search ALL categories\n  if (searchMode && searchQuery) {\n    var q = searchQuery.toLowerCase();\n    filtered = products.filter(function (p) {\n      return p.name.toLowerCase().includes(q) ||\n        (p.description && p.description.toLowerCase().includes(q)) ||\n        (p.tags && p.tags.some(function (t) { return t.toLowerCase().includes(q); }));\n    });\n  } else {\n    filtered = products.filter(function (p) { return p.category === catId; });\n  }"
);

// 3. Fix filterMenu
src = src.replace(
  "  if (searchQuery) {\n    // Search across ALL products regardless of active tab\n    activeCategory = 'all';\n    document.querySelectorAll('.cat-tab').forEach(function (btn) {\n      btn.classList.toggle('active', btn.dataset.cat === 'all');\n    });\n  }\n\n  renderCategory(searchQuery ? 'all' : activeCategory);",
  "  searchMode = searchQuery.length > 0;\n\n  if (searchMode) {\n    // When searching, deselect all category tabs\n    document.querySelectorAll('.cat-tab').forEach(function (btn) {\n      btn.classList.remove('active');\n    });\n    // Search across ALL products\n    renderCategory(activeCategory);\n  } else {\n    // If search cleared, back to active category\n    searchMode = false;\n    document.querySelectorAll('.cat-tab').forEach(function (btn) {\n      btn.classList.toggle('active', btn.dataset.cat === activeCategory);\n    });\n    renderCategory(activeCategory);\n  }"
);

// 4. Add searchMode state
src = src.replace(
  "var activeCategory = null;\nvar searchQuery = '';\nvar cart = JSON.parse(localStorage.getItem('monamiCart') || '[]');",
  "var activeCategory = null;\nvar searchQuery = '';\nvar cart = JSON.parse(localStorage.getItem('monamiCart') || '[]');\nvar searchMode = false;"
);

fs.writeFileSync('js/main.js', src, 'utf8');
console.log('Step 1 done - code fixes applied');
