const fs = require('fs');
for (let i = 0; i < 5; i++) {
  const js = fs.readFileSync('test_js_' + i + '.js', 'utf8');
  const imgs = js.match(/"[^"]+\.(png|jpg|jpeg|webp)"/gi);
  console.log('--- ' + i + ' ---');
  if (imgs) {
    console.log('IMGS:', [...new Set(imgs)]);
  }
}
