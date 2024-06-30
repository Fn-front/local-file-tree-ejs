const fs = require('fs');
const dirTree = require('directory-tree');
const tree = dirTree('./dist', {
  extensions: /\.(html)$/,
  exclude: /(_component|_mt_templates|_dir|img|cmn|css|js|nps|libs|res|assets|pdf|src)$/,
});

fs.writeFile('dist/_dir/directoryData.json', JSON.stringify(tree, null, '   '), (err) => {
  if(err) console.log('error', err);
});