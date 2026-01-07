#!/usr/bin/env python3
"""
Dual Fisheye to Equirectangular Converter
Based on the algorithm by Paul Bourke: https://paulbourke.net/dome/dualfish2sphere/

This script converts two fisheye images into a single equirectangular (spherical) projection.
"""

import numpy as np
from PIL import Image
import argparse
import math
import os
from typing import Tuple, List, Optional
from dataclasses import dataclass

# Try to import rawpy for DNG support
try:
    import rawpy
    HAS_RAWPY = True
except ImportError:
    HAS_RAWPY = False


@dataclass
class FisheyeParams:
    """Parameters for a single fisheye image"""
    image_path: str
    center: Tuple[float, float]  # (x, y) in pixels
    radius: float  # radius in pixels
    aperture: float  # field of view in degrees
    rotate_x: float = 0.0  # rotation around X axis in degrees
    rotate_y: float = 0.0  # rotation around Y axis in degrees
    rotate_z: float = 0.0  # rotation around Z axis in degrees


def rotation_matrix_x(angle_deg: float) -> np.ndarray:
    """Rotation matrix around X axis"""
    angle = math.radians(angle_deg)
    c, s = math.cos(angle), math.sin(angle)
    return np.array([
        [1, 0, 0],
        [0, c, -s],
        [0, s, c]
    ])


def rotation_matrix_y(angle_deg: float) -> np.ndarray:
    """Rotation matrix around Y axis"""
    angle = math.radians(angle_deg)
    c, s = math.cos(angle), math.sin(angle)
    return np.array([
        [c, 0, s],
        [0, 1, 0],
        [-s, 0, c]
    ])


def rotation_matrix_z(angle_deg: float) -> np.ndarray:
    """Rotation matrix around Z axis"""
    angle = math.radians(angle_deg)
    c, s = math.cos(angle), math.sin(angle)
    return np.array([
        [c, -s, 0],
        [s, c, 0],
        [0, 0, 1]
    ])


def apply_rotations(x: float, y: float, z: float, params: FisheyeParams) -> Tuple[float, float, float]:
    """
    Apply rotations in reverse order (as algorithm works backwards from output to input)
    Rotations are applied in order: Z, Y, X
    """
    vec = np.array([x, y, z])
    
    # Apply rotations in reverse order (Z, Y, X)
    if params.rotate_z != 0:
        vec = rotation_matrix_z(params.rotate_z) @ vec
    if params.rotate_y != 0:
        vec = rotation_matrix_y(params.rotate_y) @ vec
    if params.rotate_x != 0:
        vec = rotation_matrix_x(params.rotate_x) @ vec
    
    return vec[0], vec[1], vec[2]


def equirectangular_to_sphere(lon: float, lat: float) -> Tuple[float, float, float]:
    """
    Convert equirectangular coordinates (longitude, latitude) to 3D sphere coordinates
    lon: longitude in degrees (0-360)
    lat: latitude in degrees (-90 to 90)
    Returns: (x, y, z) unit vector
    """
    lon_rad = math.radians(lon)
    lat_rad = math.radians(lat)
    
    x = math.cos(lat_rad) * math.cos(lon_rad)
    y = math.sin(lat_rad)
    z = -math.cos(lat_rad) * math.sin(lon_rad)
    
    return x, y, z


def sphere_to_fisheye(x: float, y: float, z: float, params: FisheyeParams) -> Optional[Tuple[float, float]]:
    """
    Convert 3D sphere coordinates to fisheye image coordinates
    Returns: (u, v) in fisheye image space, or None if outside fisheye field of view
    """
    # Apply rotations
    x, y, z = apply_rotations(x, y, z, params)
    
    # Normalize to unit sphere
    r_3d = math.sqrt(x*x + y*y + z*z)
    if r_3d == 0:
        return None
    
    x_norm = x / r_3d
    y_norm = y / r_3d
    z_norm = z / r_3d
    
    # Fisheye lens looks down the Y axis (positive Y is forward)
    # Calculate angle from Y axis (optical axis)
    # Dot product with (0, 1, 0) gives y_norm
    angle = math.acos(max(-1.0, min(1.0, y_norm)))  # Clamp to avoid numerical errors
    angle_deg = math.degrees(angle)
    
    # Check if within aperture
    max_angle = params.aperture / 2.0
    if angle_deg > max_angle:
        return None
    
    # Calculate radius in fisheye image (proportional to angle)
    # For equidistant fisheye projection: r = f * theta
    r_fisheye = (angle_deg / max_angle) * params.radius
    
    # Calculate direction in X-Z plane (azimuth angle)
    # Project the direction vector onto the X-Z plane
    if abs(y_norm) >= 1.0:
        # Looking straight along Y axis (rare edge case)
        u, v = params.center[0], params.center[1]
    else:
        # Calculate azimuth angle in X-Z plane
        # atan2(z, x) gives angle from positive X axis
        angle_azimuth = math.atan2(-z_norm, x_norm)  # Negative z for correct orientation
        
        # Convert to fisheye image coordinates
        # u is horizontal (X), v is vertical (Z in image space)
        u = params.center[0] + r_fisheye * math.cos(angle_azimuth)
        v = params.center[1] + r_fisheye * math.sin(angle_azimuth)
    
    return u, v


def sample_fisheye_image(img: np.ndarray, u: float, v: float, antialias: int = 1) -> np.ndarray:
    """
    Sample fisheye image at coordinates (u, v) with antialiasing
    Returns: RGB pixel value
    """
    h, w = img.shape[:2]
    
    if antialias <= 1:
        # Simple bilinear interpolation
        u_int = int(u)
        v_int = int(v)
        
        if u_int < 0 or u_int >= w or v_int < 0 or v_int >= h:
            return np.array([0, 0, 0], dtype=np.uint8)
        
        # Bilinear interpolation
        u0, u1 = int(u), min(int(u) + 1, w - 1)
        v0, v1 = int(v), min(int(v) + 1, h - 1)
        
        du = u - u0
        dv = v - v0
        
        p00 = img[v0, u0]
        p01 = img[v0, u1]
        p10 = img[v1, u0]
        p11 = img[v1, u1]
        
        p0 = p00 * (1 - du) + p01 * du
        p1 = p10 * (1 - du) + p11 * du
        pixel = p0 * (1 - dv) + p1 * dv
        
        return pixel.astype(np.uint8)
    else:
        # Supersampling antialiasing
        samples = []
        step = 1.0 / antialias
        
        for i in range(antialias):
            for j in range(antialias):
                u_sample = u + (i + 0.5) * step - 0.5
                v_sample = v + (j + 0.5) * step - 0.5
                
                u_int = int(u_sample)
                v_int = int(v_sample)
                
                if 0 <= u_int < w and 0 <= v_int < h:
                    # Bilinear interpolation
                    u0, u1 = int(u_sample), min(int(u_sample) + 1, w - 1)
                    v0, v1 = int(v_sample), min(int(v_sample) + 1, h - 1)
                    
                    du = u_sample - u0
                    dv = v_sample - v0
                    
                    p00 = img[v0, u0]
                    p01 = img[v0, u1]
                    p10 = img[v1, u0]
                    p11 = img[v1, u1]
                    
                    p0 = p00 * (1 - du) + p01 * du
                    p1 = p10 * (1 - du) + p11 * du
                    pixel = p0 * (1 - dv) + p1 * dv
                    
                    samples.append(pixel)
        
        if len(samples) == 0:
            return np.array([0, 0, 0], dtype=np.uint8)
        
        return np.mean(samples, axis=0).astype(np.uint8)


def load_image(image_path: str) -> np.ndarray:
    """
    Load an image file, supporting both standard formats (JPEG, PNG, etc.) and DNG raw files.
    
    Args:
        image_path: Path to the image file
    
    Returns:
        RGB image as numpy array (uint8)
    """
    file_ext = os.path.splitext(image_path.lower())[1]
    
    # Handle DNG files
    if file_ext == '.dng':
        if not HAS_RAWPY:
            raise ImportError(
                "DNG support requires 'rawpy' library. Install it with: pip install rawpy"
            )
        
        with rawpy.imread(image_path) as raw:
            # Process raw image to RGB
            rgb = raw.postprocess(
                use_camera_wb=True,  # Use camera white balance
                half_size=False,      # Full resolution
                no_auto_bright=False, # Auto brightness
                output_bps=8          # 8-bit output
            )
            return rgb
    
    # Handle standard image formats with PIL
    img = Image.open(image_path)
    if img.mode != 'RGB':
        img = img.convert('RGB')
    return np.array(img)


def blend_weight(lon: float, blend_start: float, blend_end: float, blend_power: float = 1.0) -> float:
    """
    Calculate blend weight for a longitude in blend zone
    Returns weight between 0 and 1
    """
    if blend_end <= blend_start:
        return 0.5  # Fallback
    
    if lon < blend_start:
        return 0.0
    elif lon > blend_end:
        return 1.0
    else:
        # Linear blend with power
        t = (lon - blend_start) / (blend_end - blend_start)
        return t ** blend_power


def convert_dualfish_to_equirectangular(
    params_list: List[FisheyeParams],
    output_width: int = 4096,
    output_height: int = 2048,
    antialias: int = 2,
    blend_width: float = 0.0,
    blend_power: float = 1.0,
    blend_mid_angle: float = 180.0
) -> np.ndarray:
    """
    Convert dual fisheye images to equirectangular projection
    
    Args:
        params_list: List of FisheyeParams for each fisheye image
        output_width: Width of output equirectangular image
        output_height: Height of output equirectangular image
        antialias: Antialiasing level (supersampling factor)
        blend_width: Width of blend zone in degrees (0 = no blending)
        blend_power: Power for blend function (1.0 = linear)
        blend_mid_angle: Longitude where blend zone is centered
    
    Returns:
        Output equirectangular image as numpy array
    """
    # Load fisheye images
    fisheye_images = []
    for params in params_list:
        img_array = load_image(params.image_path)
        fisheye_images.append(img_array)
    
    # Create output image
    output = np.zeros((output_height, output_width, 3), dtype=np.uint8)
    
    # Calculate blend zone
    if blend_width > 0:
        blend_start = blend_mid_angle - blend_width / 2.0
        blend_end = blend_mid_angle + blend_width / 2.0
    else:
        blend_start = blend_end = blend_mid_angle
    
    # Process each pixel in output image
    for y in range(output_height):
        for x in range(output_width):
            # Convert pixel coordinates to longitude/latitude
            lon = (x / output_width) * 360.0  # 0 to 360 degrees
            lat = 90.0 - (y / output_height) * 180.0  # -90 to 90 degrees
            
            # Convert to 3D sphere coordinates
            sphere_x, sphere_y, sphere_z = equirectangular_to_sphere(lon, lat)
            
            # Sample from each fisheye image
            pixels = []
            weights = []
            
            for i, (params, img) in enumerate(zip(params_list, fisheye_images)):
                # Convert sphere coordinates to fisheye image coordinates
                fisheye_coords = sphere_to_fisheye(sphere_x, sphere_y, sphere_z, params)
                
                if fisheye_coords is not None:
                    u, v = fisheye_coords
                    # Check if coordinates are within image bounds
                    h, w = img.shape[:2]
                    if 0 <= u < w and 0 <= v < h:
                        pixel = sample_fisheye_image(img, u, v, antialias)
                        pixels.append(pixel)
                        
                        # Calculate blend weight
                        if blend_width > 0 and len(params_list) == 2:
                            # For dual fisheye: blend in the overlap zone
                            # First fisheye typically covers 0-180°, second covers 180-360°
                            # Blend zone is centered at blend_mid_angle (typically 180°)
                            if i == 0:  # First fisheye (front/left)
                                # Weight is 1.0 at 0°, decreases to 0.0 at blend_end
                                if lon <= blend_start:
                                    weight = 1.0
                                elif lon >= blend_end:
                                    weight = 0.0
                                else:
                                    # In blend zone: weight decreases from 1.0 to 0.0
                                    weight = 1.0 - blend_weight(lon, blend_start, blend_end, blend_power)
                            else:  # Second fisheye (back/right)
                                # Weight is 0.0 at blend_start, increases to 1.0 at 360°
                                if lon <= blend_start:
                                    weight = 0.0
                                elif lon >= blend_end:
                                    weight = 1.0
                                else:
                                    # In blend zone: weight increases from 0.0 to 1.0
                                    weight = blend_weight(lon, blend_start, blend_end, blend_power)
                        else:
                            # No blending or more than 2 images, equal weight
                            weight = 1.0
                        
                        weights.append(weight)
            
            # Blend pixels
            if len(pixels) > 0:
                if len(pixels) == 1:
                    output[y, x] = pixels[0]
                else:
                    # Weighted average
                    total_weight = sum(weights)
                    if total_weight > 0:
                        blended = np.zeros(3, dtype=np.float32)
                        for pixel, weight in zip(pixels, weights):
                            blended += pixel.astype(np.float32) * weight
                        output[y, x] = (blended / total_weight).astype(np.uint8)
                    else:
                        # Fallback: use first pixel if weights sum to zero
                        output[y, x] = pixels[0]
    
    return output


def parse_parameter_file(param_file: str) -> List[FisheyeParams]:
    """
    Parse parameter file in the format described by Paul Bourke
    Example:
        IMAGE: sample.tga
        RADIUS: 904
        CENTER: 959 970
        APERTURE: 190
        ROTATEZ: -1.2
        ROTATEX: 0
        ROTATEY: -90
    """
    params_list = []
    current_params = None
    
    with open(param_file, 'r') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            
            parts = line.split(':', 1)
            if len(parts) != 2:
                continue
            
            keyword = parts[0].strip().upper()
            value = parts[1].strip()
            
            if keyword == 'IMAGE':
                if current_params is not None:
                    params_list.append(current_params)
                current_params = FisheyeParams(
                    image_path=value,
                    center=(0, 0),
                    radius=0,
                    aperture=0
                )
            elif keyword == 'CENTER' and current_params is not None:
                coords = value.split()
                if len(coords) >= 2:
                    current_params.center = (float(coords[0]), float(coords[1]))
            elif keyword == 'RADIUS' and current_params is not None:
                current_params.radius = float(value)
            elif keyword == 'APERTURE' and current_params is not None:
                current_params.aperture = float(value)
            elif keyword == 'ROTATEX' and current_params is not None:
                current_params.rotate_x = float(value)
            elif keyword == 'ROTATEY' and current_params is not None:
                current_params.rotate_y = float(value)
            elif keyword == 'ROTATEZ' and current_params is not None:
                current_params.rotate_z = float(value)
        
        if current_params is not None:
            params_list.append(current_params)
    
    return params_list


def main():
    parser = argparse.ArgumentParser(
        description='Convert dual fisheye images to equirectangular projection',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Example parameter file format:
  IMAGE: left.jpg
  RADIUS: 904
  CENTER: 959 970
  APERTURE: 190
  ROTATEZ: -1.2
  ROTATEX: 0
  ROTATEY: -90
  
  IMAGE: right.jpg
  RADIUS: 904
  CENTER: 2879 948
  APERTURE: 189
  ROTATEX: -2
  ROTATEY: 90
        """
    )
    
    parser.add_argument('param_file', help='Parameter file describing fisheye images')
    parser.add_argument('-w', '--width', type=int, default=4096, help='Output image width (default: 4096)')
    parser.add_argument('-a', '--antialias', type=int, default=2, help='Antialiasing level (default: 2)')
    parser.add_argument('-b', '--blend', type=float, default=0.0, help='Blend width in degrees (default: 0)')
    parser.add_argument('-q', '--blend-power', type=float, default=1.0, help='Blend power (default: 1.0)')
    parser.add_argument('-m', '--blend-mid', type=float, default=180.0, help='Blend mid angle (default: 180)')
    parser.add_argument('-o', '--output', help='Output file name (default: derived from input)')
    
    args = parser.parse_args()
    
    # Parse parameter file
    params_list = parse_parameter_file(args.param_file)
    
    if len(params_list) < 2:
        print("Error: At least 2 fisheye images required")
        return
    
    print(f"Processing {len(params_list)} fisheye images...")
    for i, params in enumerate(params_list):
        print(f"  Image {i+1}: {params.image_path}")
        print(f"    Center: {params.center}, Radius: {params.radius}, Aperture: {params.aperture}°")
    
    # Calculate output height (2:1 aspect ratio for equirectangular)
    output_height = args.width // 2
    
    # Convert
    print(f"\nConverting to equirectangular ({args.width}x{output_height})...")
    output = convert_dualfish_to_equirectangular(
        params_list,
        output_width=args.width,
        output_height=output_height,
        antialias=args.antialias,
        blend_width=args.blend,
        blend_power=args.blend_power,
        blend_mid_angle=args.blend_mid
    )
    
    # Save output
    if args.output:
        output_file = args.output
    else:
        # Derive from first input image
        base_name = params_list[0].image_path.rsplit('.', 1)[0]
        output_file = f"{base_name}_equirectangular.jpg"
    
    output_img = Image.fromarray(output)
    output_img.save(output_file, quality=95)
    print(f"Saved: {output_file}")


if __name__ == '__main__':
    main()
