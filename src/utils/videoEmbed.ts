export interface VideoEmbedInfo {
  type: 'youtube' | 'instagram' | 'tiktok' | 'unknown';
  embedUrl: string;
  thumbnailUrl: string;
  isValid: boolean;
}

export function parseVideoUrl(url: string): VideoEmbedInfo {
  const trimmedUrl = url.trim();

  if (isYouTubeUrl(trimmedUrl)) {
    const videoId = extractYouTubeId(trimmedUrl);
    if (videoId) {
      return {
        type: 'youtube',
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        isValid: true,
      };
    }
  }

  if (isInstagramUrl(trimmedUrl)) {
    const embedUrl = extractInstagramEmbedUrl(trimmedUrl);
    if (embedUrl) {
      return {
        type: 'instagram',
        embedUrl,
        thumbnailUrl: '',
        isValid: true,
      };
    }
  }

  if (isTikTokUrl(trimmedUrl)) {
    const embedUrl = extractTikTokEmbedUrl(trimmedUrl);
    if (embedUrl) {
      return {
        type: 'tiktok',
        embedUrl,
        thumbnailUrl: '',
        isValid: true,
      };
    }
  }

  return {
    type: 'unknown',
    embedUrl: '',
    thumbnailUrl: '',
    isValid: false,
  };
}

function isYouTubeUrl(url: string): boolean {
  return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//.test(url);
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

function isInstagramUrl(url: string): boolean {
  return /^(https?:\/\/)?(www\.)?instagram\.com\/(p|reel|tv)\//.test(url);
}

function extractInstagramEmbedUrl(url: string): string | null {
  const match = url.match(/instagram\.com\/(p|reel|tv)\/([a-zA-Z0-9_-]+)/);
  if (match) {
    return `https://www.instagram.com/${match[1]}/${match[2]}/embed`;
  }
  return null;
}

function isTikTokUrl(url: string): boolean {
  return /^(https?:\/\/)?(www\.)?(tiktok\.com|vm\.tiktok\.com)\//.test(url);
}

function extractTikTokEmbedUrl(url: string): string | null {
  const match = url.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/);
  if (match) {
    return `https://www.tiktok.com/embed/v2/${match[1]}`;
  }

  if (/vm\.tiktok\.com/.test(url)) {
    return url;
  }

  return null;
}

export function validateVideoUrl(url: string): { isValid: boolean; error?: string } {
  if (!url || url.trim() === '') {
    return { isValid: false, error: 'URL is required' };
  }

  const info = parseVideoUrl(url);

  if (!info.isValid) {
    return {
      isValid: false,
      error: 'Invalid video URL. Please provide a YouTube, Instagram, or TikTok link.'
    };
  }

  return { isValid: true };
}
