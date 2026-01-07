// Dual Fisheye to Equirectangular Converter
// Based on algorithm by Paul Bourke: https://paulbourke.net/dome/dualfish2sphere/

class DualFish2Sphere {
    constructor(options = {}) {
        this.width = options.width || 4096;
        this.antialiasing = options.antialiasing || 2;
        this.blendWidth = options.blendWidth || 0; // degrees
        this.blendPower = options.blendPower || 1;
        this.blendMidAngle = options.blendMidAngle || 180; // degrees
    }

    /**
     * Convert dual fisheye images to equirectangular projection
     * @param {Object} params - Configuration parameters
     * @param {Array} params.images - Array of fisheye image data (ImageData or Image elements)
     * @param {Array} params.configs - Array of fisheye configurations
     * @returns {ImageData} Equirectangular image data
     */
    async convert(params) {
        const { images, configs } = params;
        
        if (!images || images.length < 2 || !configs || configs.length < 2) {
            throw new Error('Two fisheye images and configurations are required');
        }

        // Create output canvas
        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.width / 2; // Equirectangular aspect ratio is 2:1
        const ctx = canvas.getContext('2d');
        const outputData = ctx.createImageData(canvas.width, canvas.height);

        // Process each pixel in output image
        const totalPixels = canvas.width * canvas.height;
        const progressCallback = params.progressCallback || (() => {});

        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                const pixelIndex = (y * canvas.width + x) * 4;
                
                // Convert equirectangular coordinates to spherical
                const longitude = (x / canvas.width) * 2 * Math.PI - Math.PI; // -π to π
                const latitude = Math.PI / 2 - (y / canvas.height) * Math.PI; // π/2 to -π/2

                // Sample from both fisheye images with antialiasing
                let r = 0, g = 0, b = 0, a = 0;
                let sampleCount = 0;

                for (let sy = 0; sy < this.antialiasing; sy++) {
                    for (let sx = 0; sx < this.antialiasing; sx++) {
                        const offsetX = (sx + 0.5) / this.antialiasing - 0.5;
                        const offsetY = (sy + 0.5) / this.antialiasing - 0.5;
                        
                        const sampleLon = longitude + (offsetX * 2 * Math.PI / canvas.width);
                        const sampleLat = latitude - (offsetY * Math.PI / canvas.height);

                        // Get color from both fisheye images
                        const colors = [];
                        const weights = [];

                        for (let i = 0; i < 2; i++) {
                            const color = this.sampleFisheye(
                                images[i],
                                configs[i],
                                sampleLon,
                                sampleLat
                            );
                            
                            if (color) {
                                colors.push(color);
                                // Calculate blend weight based on longitude
                                const weight = this.calculateBlendWeight(sampleLon, i);
                                weights.push(weight);
                            }
                        }

                        // Blend colors
                        if (colors.length > 0) {
                            let totalWeight = 0;
                            let blendedR = 0, blendedG = 0, blendedB = 0, blendedA = 0;

                            for (let i = 0; i < colors.length; i++) {
                                const weight = weights[i];
                                totalWeight += weight;
                                blendedR += colors[i].r * weight;
                                blendedG += colors[i].g * weight;
                                blendedB += colors[i].b * weight;
                                blendedA += colors[i].a * weight;
                            }

                            if (totalWeight > 0) {
                                r += blendedR / totalWeight;
                                g += blendedG / totalWeight;
                                b += blendedB / totalWeight;
                                a += blendedA / totalWeight;
                                sampleCount++;
                            }
                        }
                    }
                }

                // Average samples
                if (sampleCount > 0) {
                    outputData.data[pixelIndex] = Math.round(r / sampleCount);
                    outputData.data[pixelIndex + 1] = Math.round(g / sampleCount);
                    outputData.data[pixelIndex + 2] = Math.round(b / sampleCount);
                    outputData.data[pixelIndex + 3] = Math.round(a / sampleCount);
                }

                // Progress callback
                const currentPixel = y * canvas.width + x;
                if (currentPixel % 1000 === 0) {
                    progressCallback(currentPixel / totalPixels);
                }
            }
        }

        // Put image data to canvas
        ctx.putImageData(outputData, 0, 0);
        progressCallback(1.0);

        return canvas;
    }

    /**
     * Sample a fisheye image at given spherical coordinates
     * @param {ImageData|HTMLImageElement|HTMLCanvasElement} image - Fisheye image
     * @param {Object} config - Fisheye configuration
     * @param {number} longitude - Spherical longitude in radians
     * @param {number} latitude - Spherical latitude in radians
     * @returns {Object|null} RGBA color object or null if out of bounds
     */
    sampleFisheye(image, config, longitude, latitude) {
        // Apply rotations (in reverse order as per algorithm)
        let x = Math.cos(latitude) * Math.sin(longitude);
        let y = Math.sin(latitude);
        let z = Math.cos(latitude) * Math.cos(longitude);

        // Apply rotations (reverse order: Z, X, Y)
        if (config.rotateZ) {
            const rz = (config.rotateZ * Math.PI) / 180;
            const cosZ = Math.cos(rz);
            const sinZ = Math.sin(rz);
            const newX = x * cosZ - y * sinZ;
            const newY = x * sinZ + y * cosZ;
            x = newX;
            y = newY;
        }

        if (config.rotateX) {
            const rx = (config.rotateX * Math.PI) / 180;
            const cosX = Math.cos(rx);
            const sinX = Math.sin(rx);
            const newY = y * cosX - z * sinX;
            const newZ = y * sinX + z * cosX;
            y = newY;
            z = newZ;
        }

        if (config.rotateY) {
            const ry = (config.rotateY * Math.PI) / 180;
            const cosY = Math.cos(ry);
            const sinY = Math.sin(ry);
            const newX = x * cosY + z * sinY;
            const newZ = -x * sinY + z * cosY;
            x = newX;
            z = newZ;
        }

        // Convert to fisheye coordinates
        // Fisheye looks down the Y axis
        const angle = Math.atan2(Math.sqrt(x * x + z * z), y);
        const maxAngle = (config.aperture * Math.PI) / 180 / 2;

        if (angle > maxAngle) {
            return null; // Outside fisheye aperture
        }

        // Calculate radius in fisheye image
        const radius = (angle / maxAngle) * config.radius;

        // Calculate angle in fisheye plane
        const azimuth = Math.atan2(x, z);

        // Convert to pixel coordinates
        const fisheyeX = config.centerX + radius * Math.sin(azimuth);
        const fisheyeY = config.centerY - radius * Math.cos(azimuth);

        // Get image data
        const imageData = this.getImageData(image);
        if (!imageData) return null;

        // Check bounds
        if (fisheyeX < 0 || fisheyeX >= imageData.width ||
            fisheyeY < 0 || fisheyeY >= imageData.height) {
            return null;
        }

        // Bilinear interpolation for better quality
        const x1 = Math.floor(fisheyeX);
        const y1 = Math.floor(fisheyeY);
        const x2 = Math.min(x1 + 1, imageData.width - 1);
        const y2 = Math.min(y1 + 1, imageData.height - 1);
        
        const fx = fisheyeX - x1;
        const fy = fisheyeY - y1;

        // Sample four corners
        const getPixel = (x, y) => {
            const idx = (y * imageData.width + x) * 4;
            return {
                r: imageData.data[idx],
                g: imageData.data[idx + 1],
                b: imageData.data[idx + 2],
                a: imageData.data[idx + 3]
            };
        };

        const p11 = getPixel(x1, y1);
        const p21 = getPixel(x2, y1);
        const p12 = getPixel(x1, y2);
        const p22 = getPixel(x2, y2);

        // Bilinear interpolation
        const r = (1 - fx) * (1 - fy) * p11.r + fx * (1 - fy) * p21.r +
                  (1 - fx) * fy * p12.r + fx * fy * p22.r;
        const g = (1 - fx) * (1 - fy) * p11.g + fx * (1 - fy) * p21.g +
                  (1 - fx) * fy * p12.g + fx * fy * p22.g;
        const b = (1 - fx) * (1 - fy) * p11.b + fx * (1 - fy) * p21.b +
                  (1 - fx) * fy * p12.b + fx * fy * p22.b;
        const a = (1 - fx) * (1 - fy) * p11.a + fx * (1 - fy) * p21.a +
                  (1 - fx) * fy * p12.a + fx * fy * p22.a;

        return { r, g, b, a };
    }

    /**
     * Calculate blend weight for a given longitude
     * @param {number} longitude - Longitude in radians
     * @param {number} imageIndex - Index of fisheye image (0 or 1)
     * @returns {number} Blend weight (0 to 1)
     */
    calculateBlendWeight(longitude, imageIndex) {
        if (this.blendWidth <= 0) {
            // No blending, use simple split at 0 degrees
            return longitude < 0 ? (imageIndex === 0 ? 1 : 0) : (imageIndex === 1 ? 1 : 0);
        }

        // Convert longitude to degrees (-180 to 180)
        let lonDeg = (longitude * 180) / Math.PI;
        
        // Normalize to 0-360 range for easier calculation
        if (lonDeg < 0) lonDeg += 360;

        // Blend region is centered around blendMidAngle
        // For image 0 (left/front): covers 0 to blendMidAngle + blendWidth/2
        // For image 1 (right/back): covers blendMidAngle - blendWidth/2 to 360
        const blendStart = this.blendMidAngle - this.blendWidth / 2;
        const blendEnd = this.blendMidAngle + this.blendWidth / 2;

        if (imageIndex === 0) {
            // Left fisheye: weight decreases as we approach blend region from left
            if (lonDeg <= blendStart) {
                return 1;
            } else if (lonDeg >= blendEnd) {
                return 0;
            } else {
                // In blend region: weight decreases from 1 to 0
                const t = (lonDeg - blendStart) / this.blendWidth;
                return Math.pow(1 - t, this.blendPower);
            }
        } else {
            // Right fisheye: weight increases as we approach blend region from right
            if (lonDeg >= blendEnd) {
                return 1;
            } else if (lonDeg <= blendStart) {
                // Handle wrap-around case
                if (lonDeg < 180) {
                    return 0;
                } else {
                    // Wrap around: from 360 back to blendStart
                    const t = (360 - lonDeg + blendStart) / this.blendWidth;
                    return Math.pow(1 - t, this.blendPower);
                }
            } else {
                // In blend region: weight increases from 0 to 1
                const t = (lonDeg - blendStart) / this.blendWidth;
                return Math.pow(t, this.blendPower);
            }
        }
    }

    /**
     * Get ImageData from various image sources
     * @param {ImageData|HTMLImageElement|HTMLCanvasElement} image - Image source
     * @returns {ImageData|null} ImageData object
     */
    getImageData(image) {
        if (image instanceof ImageData) {
            return image;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (image instanceof HTMLCanvasElement) {
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);
            return ctx.getImageData(0, 0, canvas.width, canvas.height);
        }

        if (image instanceof HTMLImageElement) {
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);
            return ctx.getImageData(0, 0, canvas.width, canvas.height);
        }

        return null;
    }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DualFish2Sphere;
}

// Make available globally
window.DualFish2Sphere = DualFish2Sphere;