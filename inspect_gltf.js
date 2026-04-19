const fs = require('fs');

async function check() {
  // Read glb header
  const buffer = fs.readFileSync('public/free_female_mannequin_base_mesh.glb');
  console.log("File read, size:", buffer.length);
  // We can't easily parse glb nodes directly without a library. Let's install three.js for node or gltf-transform
  // Wait, I can just install a dedicated gltf reader in the parent dir temporarily or use three
}
check();
