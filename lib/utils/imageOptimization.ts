/**
 * Utility functions for image optimization
 * Converts images to WebP format and compresses them for reduced file size
 */

export interface ImageOptimizationOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number; // 0 to 1
}

/**
 * Converts an image file to WebP format with optional compression
 * @param file - Original image file
 * @param options - Optimization options (quality, max dimensions)
 * @returns Promise with optimized WebP file
 */
export async function convertToWebP(
    file: File,
    options: ImageOptimizationOptions = {}
): Promise<File> {
    const { maxWidth = 1920, maxHeight = 1920, quality = 0.85 } = options;

    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();

            img.onload = () => {
                // Calculate new dimensions while maintaining aspect ratio
                let width = img.width;
                let height = img.height;

                if (width > maxWidth || height > maxHeight) {
                    const aspectRatio = width / height;

                    if (width > height) {
                        width = maxWidth;
                        height = width / aspectRatio;
                    } else {
                        height = maxHeight;
                        width = height * aspectRatio;
                    }
                }

                // Create canvas and draw resized image
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Could not get canvas context'));
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);

                // Convert to WebP blob
                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('Could not convert image to WebP'));
                            return;
                        }

                        // Create new file from blob
                        const fileName = file.name.replace(/\.[^/.]+$/, '.webp');
                        const webpFile = new File([blob], fileName, {
                            type: 'image/webp',
                            lastModified: Date.now(),
                        });

                        resolve(webpFile);
                    },
                    'image/webp',
                    quality
                );
            };

            img.onerror = () => {
                reject(new Error('Could not load image'));
            };

            img.src = e.target?.result as string;
        };

        reader.onerror = () => {
            reject(new Error('Could not read file'));
        };

        reader.readAsDataURL(file);
    });
}

/**
 * Gets the size of a file in MB
 */
export function getFileSizeMB(file: File): number {
    return file.size / (1024 * 1024);
}

/**
 * Validates if a file is an image
 */
export function isImageFile(file: File): boolean {
    return file.type.startsWith('image/');
}

/**
 * Gets compression statistics
 */
export function getCompressionStats(originalFile: File, optimizedFile: File) {
    const originalSize = getFileSizeMB(originalFile);
    const optimizedSize = getFileSizeMB(optimizedFile);
    const savedSize = originalSize - optimizedSize;
    const compressionRatio = ((savedSize / originalSize) * 100).toFixed(1);

    return {
        originalSize: originalSize.toFixed(2),
        optimizedSize: optimizedSize.toFixed(2),
        savedSize: savedSize.toFixed(2),
        compressionRatio: `${compressionRatio}%`,
    };
}
