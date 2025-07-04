// Image upload utilities
// For production, you'd want to use a service like Cloudinary, AWS S3, or Vercel Blob

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function uploadCompanyLogo(file: File): Promise<UploadResult> {
  // Validate file
  if (!file.type.startsWith('image/')) {
    return {
      success: false,
      error: 'File must be an image',
    };
  }

  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return {
      success: false,
      error: 'File size must be less than 5MB',
    };
  }

  try {
    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'company-logo');

    // Upload to your API endpoint
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    
    return {
      success: true,
      url: data.url,
    };
  } catch (error: any) {
    console.error('Upload failed:', error);
    return {
      success: false,
      error: error.message || 'Upload failed',
    };
  }
}

export function validateImage(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return {
      valid: false,
      error: 'File must be an image',
    };
  }

  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return {
      valid: false,
      error: 'File size must be less than 5MB',
    };
  }

  // Check image dimensions (you might want to add this)
  return { valid: true };
}

export function getImagePreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

export function revokeImagePreviewUrl(url: string): void {
  URL.revokeObjectURL(url);
}
