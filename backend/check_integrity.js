const fs = require('fs');
const path = require('path');

// Helper to try requiring a file
const tryRequire = (filePath) => {
    try {
        const module = require(filePath);
        console.log(`✅ Loaded: ${filePath}`);
        return module;
    } catch (error) {
        console.error(`❌ Failed to load: ${filePath}`);
        console.error(error);
        return null;
    }
};

console.log('--- STARTING INTEGRITY CHECK ---');

// Check Controllers
const controllersDir = path.join(__dirname, 'src/controllers');
if (fs.existsSync(controllersDir)) {
    console.log('\nChecking Controllers:');
    const files = fs.readdirSync(controllersDir);
    let hasError = false;
    files.forEach(file => {
        if (!file.endsWith('.js')) return;
        const mod = tryRequire(path.join(controllersDir, file));
        if (mod) {
            // Check if it exports something useful
            const keys = Object.keys(mod);
            if (keys.length === 0 && typeof mod !== 'function') {
                console.warn(`   ⚠️  Warning: ${file} exports an empty object?`);
            } else {
                console.log(`   Exports: ${keys.slice(0, 3).join(', ')}...`);
            }
        } else {
            hasError = true;
        }
    });
}

// Check Routes
const routesDir = path.join(__dirname, 'src/routes');
if (fs.existsSync(routesDir)) {
    console.log('\nChecking Routes:');
    const files = fs.readdirSync(routesDir);
    files.forEach(file => {
        if (!file.endsWith('.js')) return;
        tryRequire(path.join(routesDir, file));
    });
}

console.log('\n--- CHECK COMPLETE ---');
process.exit(0);
