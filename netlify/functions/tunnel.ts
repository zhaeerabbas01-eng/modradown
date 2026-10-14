import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: ''
    };
  }

  const params = event.queryStringParameters || {};
  const rawUrl = params.url;
  const rawFilename = params.filename || 'video.mp4';

  if (!rawUrl) {
    return {
      statusCode: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: 'Missing media URL parameter'
    };
  }

  try {
    const targetUrl = decodeURIComponent(rawUrl);
    const cleanFilename = (decodeURIComponent(rawFilename) || 'video.mp4')
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .slice(0, 80);
    const filenameWithExt = cleanFilename.endsWith('.mp4') || cleanFilename.endsWith('.mp3')
      ? cleanFilename
      : `${cleanFilename}.mp4`;

    let referer = 'https://www.google.com/';
    if (targetUrl.includes('tiktok.com') || targetUrl.includes('tikwm.com')) {
      referer = 'https://www.tikwm.com/';
    } else if (targetUrl.includes('instagram.com') || targetUrl.includes('cdninstagram.com')) {
      referer = 'https://www.instagram.com/';
    } else if (targetUrl.includes('fbcdn.net') || targetUrl.includes('facebook.com')) {
      referer = 'https://www.facebook.com/';
    } else if (targetUrl.includes('twimg.com') || targetUrl.includes('x.com')) {
      referer = 'https://twitter.com/';
    } else if (targetUrl.includes('pinterest.com') || targetUrl.includes('pinimg.com')) {
      referer = 'https://www.pinterest.com/';
    }

    const fetchRes = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'Referer': referer,
        'Accept': '*/*'
      }
    });

    if (!fetchRes.ok) {
      return {
        statusCode: 302,
        headers: {
          'Location': targetUrl,
          'Access-Control-Allow-Origin': '*'
        },
        body: ''
      };
    }

    const contentType = fetchRes.headers.get('content-type') || 'video/mp4';
    const arrayBuffer = await fetchRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // If file size exceeds Netlify Lambda response size limits (~6MB), redirect to CDN directly
    if (buffer.length > 5.8 * 1024 * 1024) {
      return {
        statusCode: 302,
        headers: {
          'Location': targetUrl,
          'Access-Control-Allow-Origin': '*'
        },
        body: ''
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filenameWithExt}"`,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache'
      },
      body: buffer.toString('base64'),
      isBase64Encoded: true
    };
  } catch (error: any) {
    return {
      statusCode: 302,
      headers: {
        'Location': rawUrl,
        'Access-Control-Allow-Origin': '*'
      },
      body: ''
    };
  }
};
