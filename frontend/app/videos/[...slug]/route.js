import fs from 'fs';
import path from 'path';

// Video alias mapping to ensure smooth asset binding
const VIDEO_MAP = {
  'amethyst.mp4': 'Amethyst_geode_crystal_glowing_20260915155739.mp4',
  'amethyst': 'Amethyst_geode_crystal_glowing_20260915155739.mp4',
  'tigers-eye.mp4': "Polished_Tiger's_Eye_rotating_20260915155726.mp4",
  'tiger-eye.mp4': "Polished_Tiger's_Eye_rotating_20260915155726.mp4",
  'tigers-eye': "Polished_Tiger's_Eye_rotating_20260915155726.mp4",
  'rose-quartz.mp4': 'Rose_Quartz_crystal_illuminated_20260915155733.mp4',
  'rose-quartz': 'Rose_Quartz_crystal_illuminated_20260915155733.mp4',
  'intro.mp4': 'Amethyst_geode_crystal_glowing_20260915155739.mp4',
  'intro': 'Amethyst_geode_crystal_glowing_20260915155739.mp4',
};

export async function GET(request, { params }) {
  try {
    const slugArray = params?.slug || [];
    const requestedFile = decodeURIComponent(slugArray.join('/'));
    
    // Resolve filename through map or directly
    const actualFileName = VIDEO_MAP[requestedFile.toLowerCase()] || requestedFile;
    
    // Check multiple possible video directories
    const searchDirs = [
      path.join(process.cwd(), 'Videos'),
      path.join(process.cwd(), 'public', 'videos'),
      path.join(process.cwd(), '..', 'Videos'),
    ];

    let filePath = null;

    for (const dir of searchDirs) {
      if (!fs.existsSync(dir)) continue;

      // 1. Exact match
      const candidate = path.join(dir, actualFileName);
      if (fs.existsSync(candidate)) {
        filePath = candidate;
        break;
      }

      // 2. Case-insensitive / normalized search
      try {
        const files = fs.readdirSync(dir);
        const match = files.find(
          (f) =>
            f.toLowerCase() === actualFileName.toLowerCase() ||
            f.toLowerCase() === requestedFile.toLowerCase() ||
            f.toLowerCase().replace(/[\s_-]/g, '') === actualFileName.toLowerCase().replace(/[\s_-]/g, '')
        );
        if (match) {
          filePath = path.join(dir, match);
          break;
        }
      } catch (e) {}
    }

    if (!filePath || !fs.existsSync(filePath)) {
      return new Response(JSON.stringify({ error: 'Video asset not found', requestedFile }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }


    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = request.headers.get('range');

    if (range) {
      // Handle HTTP 206 Partial Content for smooth scrubbing & instant seeking
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize || end >= fileSize) {
        return new Response('', {
          status: 416,
          headers: {
            'Content-Range': `bytes */${fileSize}`,
          },
        });
      }

      const chunkSize = end - start + 1;
      const fileStream = fs.createReadStream(filePath, { start, end });

      // Convert Node readable stream to Web standard ReadableStream
      const stream = new ReadableStream({
        start(controller) {
          fileStream.on('data', (chunk) => controller.enqueue(chunk));
          fileStream.on('end', () => controller.close());
          fileStream.on('error', (err) => controller.error(err));
        },
        cancel() {
          fileStream.destroy();
        },
      });

      return new Response(stream, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize.toString(),
          'Content-Type': 'video/mp4',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    // Full video stream
    const fileStream = fs.createReadStream(filePath);
    const stream = new ReadableStream({
      start(controller) {
        fileStream.on('data', (chunk) => controller.enqueue(chunk));
        fileStream.on('end', () => controller.close());
        fileStream.on('error', (err) => controller.error(err));
      },
      cancel() {
        fileStream.destroy();
      },
    });

    return new Response(stream, {
      status: 200,
      headers: {
        'Content-Length': fileSize.toString(),
        'Content-Type': 'video/mp4',
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err) {
    console.error('Video streaming route error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
