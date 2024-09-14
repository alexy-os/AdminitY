const ngrok = require('ngrok');
const fs = require('fs');
const port = 3008;

async function startNgrok() {
    try {
        const url = await ngrok.connect({
            addr: port
        });
        console.log(`Ngrok URL: ${url}`);
        
        fs.writeFileSync('ngrok-url.txt', url);
    } catch (err) {
        console.error('Error starting ngrok:', err);
    }
}

startNgrok();

process.on('SIGTERM', async () => {
    console.log('Shutting down ngrok');
    await ngrok.kill();
    process.exit(0);
});