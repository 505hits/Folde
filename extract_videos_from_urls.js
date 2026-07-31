const fs = require('fs');
for (let i = 0; i < 5; i++) {
  const js = fs.readFileSync('test_js_' + i + '.js', 'utf8');
  const mp4s = js.match(/"[^"]+\.mp4"/g);
  const m3u8 = js.match(/"[^"]+\.m3u8"/g);
  
  console.log('--- ' + i + ' ---');
  if (mp4s) {
    console.log('MP4:', [...new Set(mp4s)]);
  }
  if (m3u8) {
    console.log('M3U8:', [...new Set(m3u8)]);
  }
}
