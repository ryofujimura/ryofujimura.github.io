# Dual Fisheye to Equirectangular Converter

A Python implementation of the dual fisheye to equirectangular conversion algorithm by Paul Bourke (https://paulbourke.net/dome/dualfish2sphere/).

This tool converts two fisheye images (typically from a dual fisheye 360° camera) into a single equirectangular (spherical) projection that can be viewed in standard 360° panorama viewers.

## Installation

Install the required dependencies:

```bash
pip install -r requirements.txt
```

## Usage

### Method 1: Using Parameter File (Recommended)

Create a parameter file describing your fisheye images:

```bash
python dualfish2sphere.py params.txt -w 4096 -b 10 -o output.jpg
```

Example parameter file (`params.txt`):

```
# Left fisheye image
IMAGE: images/left.jpg
RADIUS: 1024
CENTER: 1024 1024
APERTURE: 190
ROTATEX: 0
ROTATEY: 0
ROTATEZ: 0

# Right fisheye image
IMAGE: images/right.jpg
RADIUS: 1024
CENTER: 1024 1024
APERTURE: 190
ROTATEX: 0
ROTATEY: 0
ROTATEZ: 0
```

### Method 2: Simplified Command-Line Interface

For quick conversions without a parameter file:

```bash
python convert_dualfish.py images/left.jpg images/right.jpg -o output.jpg \
  --left-center-x 1024 --left-center-y 1024 --left-radius 1024 \
  --right-center-x 1024 --right-center-y 1024 --right-radius 1024 \
  --auto-detect
```

Or with auto-detection (experimental):

```bash
python convert_dualfish.py images/left.jpg images/right.jpg -o output.jpg --auto-detect
```

## Parameters

### Fisheye Image Parameters

- **CENTER**: (x, y) coordinates of the fisheye circle center in pixels (top-left is origin)
- **RADIUS**: Radius of the fisheye circle in pixels
- **APERTURE**: Field of view of the fisheye lens in degrees (typically 180-210°)
- **ROTATEX, ROTATEY, ROTATEZ**: Rotation corrections in degrees around each axis

### Output Parameters

- **-w, --width**: Output image width in pixels (default: 4096)
- **-a, --antialias**: Antialiasing level via supersampling (default: 2)
- **-b, --blend**: Blend zone width in degrees (default: 0, recommended: 10)
- **-q, --blend-power**: Blend function power (default: 1.0 = linear)
- **-m, --blend-mid**: Longitude where blend zone is centered (default: 180°)
- **-o, --output**: Output file path

## Finding Fisheye Parameters

To find the center and radius of your fisheye images:

1. Open the image in an image editor (e.g., Photoshop, GIMP)
2. Use a circular selection tool to estimate the fisheye circle
3. Read the center coordinates and radius from the selection info
4. The aperture can usually be found in your camera's specifications

## Algorithm Details

The algorithm works by:

1. For each pixel in the output equirectangular image:
   - Convert to longitude/latitude coordinates
   - Convert to 3D sphere coordinates
   - Apply rotation corrections
   - Project back to fisheye image coordinates
   - Sample the fisheye image(s) with antialiasing

2. For overlapping regions (when aperture > 180°):
   - Blend the two fisheye images using a weighted average
   - Blend zone is typically centered at 180° longitude

## Notes

- Fisheye apertures of 190° or more are recommended for satisfactory blending
- The algorithm handles parallax errors at a single distance (not all distances)
- For best results, calibrate parameters for different scene types (close-up vs. landscape)
- Processing time increases with output resolution and antialiasing level

## Example

Convert your dual fisheye images:

```bash
# Using parameter file
python dualfish2sphere.py example_params.txt -w 4096 -b 10 -a 2 -o panorama.jpg

# Using simplified interface
python convert_dualfish.py images/left.jpg images/right.jpg -o panorama.jpg \
  --left-center-x 1024 --left-center-y 1024 --left-radius 1024 --left-aperture 190 \
  --right-center-x 1024 --right-center-y 1024 --right-radius 1024 --right-aperture 190 \
  -b 10 -w 4096
```
