#!/usr/bin/env python3
"""
Simplified command-line interface for dual fisheye to equirectangular conversion
This script provides a simpler way to convert dual fisheye images without a parameter file.
"""

import argparse
from dualfish2sphere import (
    FisheyeParams,
    convert_dualfish_to_equirectangular
)
from PIL import Image
import numpy as np


def main():
    parser = argparse.ArgumentParser(
        description='Convert dual fisheye images to equirectangular projection (simplified interface)'
    )
    
    parser.add_argument('left_image', help='Left fisheye image path')
    parser.add_argument('right_image', help='Right fisheye image path')
    parser.add_argument('-o', '--output', required=True, help='Output equirectangular image path')
    
    # Fisheye parameters for left image
    parser.add_argument('--left-center-x', type=float, help='Left fisheye center X coordinate')
    parser.add_argument('--left-center-y', type=float, help='Left fisheye center Y coordinate')
    parser.add_argument('--left-radius', type=float, help='Left fisheye radius in pixels')
    parser.add_argument('--left-aperture', type=float, default=190, help='Left fisheye aperture in degrees (default: 190)')
    
    # Fisheye parameters for right image
    parser.add_argument('--right-center-x', type=float, help='Right fisheye center X coordinate')
    parser.add_argument('--right-center-y', type=float, help='Right fisheye center Y coordinate')
    parser.add_argument('--right-radius', type=float, help='Right fisheye radius in pixels')
    parser.add_argument('--right-aperture', type=float, default=190, help='Right fisheye aperture in degrees (default: 190)')
    
    # Rotation parameters
    parser.add_argument('--left-rotate-x', type=float, default=0, help='Left fisheye rotation X (degrees)')
    parser.add_argument('--left-rotate-y', type=float, default=0, help='Left fisheye rotation Y (degrees)')
    parser.add_argument('--left-rotate-z', type=float, default=0, help='Left fisheye rotation Z (degrees)')
    parser.add_argument('--right-rotate-x', type=float, default=0, help='Right fisheye rotation X (degrees)')
    parser.add_argument('--right-rotate-y', type=float, default=0, help='Right fisheye rotation Y (degrees)')
    parser.add_argument('--right-rotate-z', type=float, default=0, help='Right fisheye rotation Z (degrees)')
    
    # Output parameters
    parser.add_argument('-w', '--width', type=int, default=4096, help='Output image width (default: 4096)')
    parser.add_argument('-a', '--antialias', type=int, default=2, help='Antialiasing level (default: 2)')
    parser.add_argument('-b', '--blend', type=float, default=10.0, help='Blend width in degrees (default: 10)')
    parser.add_argument('--auto-detect', action='store_true', help='Auto-detect fisheye center and radius (experimental)')
    
    args = parser.parse_args()
    
    # Load images to get dimensions
    left_img = Image.open(args.left_image)
    right_img = Image.open(args.right_image)
    left_w, left_h = left_img.size
    right_w, right_h = right_img.size
    
    # Auto-detect or use provided parameters
    if args.auto_detect:
        # Simple auto-detection: assume fisheye is centered and fills most of the image
        if args.left_center_x is None:
            args.left_center_x = left_w / 2
        if args.left_center_y is None:
            args.left_center_y = left_h / 2
        if args.left_radius is None:
            args.left_radius = min(left_w, left_h) / 2 * 0.9
        
        if args.right_center_x is None:
            args.right_center_x = right_w / 2
        if args.right_center_y is None:
            args.right_center_y = right_h / 2
        if args.right_radius is None:
            args.right_radius = min(right_w, right_h) / 2 * 0.9
        
        print("Auto-detected parameters:")
        print(f"  Left: center=({args.left_center_x:.1f}, {args.left_center_y:.1f}), radius={args.left_radius:.1f}")
        print(f"  Right: center=({args.right_center_x:.1f}, {args.right_center_y:.1f}), radius={args.right_radius:.1f}")
    else:
        # Require manual parameters
        if args.left_center_x is None or args.left_center_y is None or args.left_radius is None:
            print("Error: Left fisheye parameters required (--left-center-x, --left-center-y, --left-radius)")
            print("       Or use --auto-detect for automatic detection")
            return
        
        if args.right_center_x is None or args.right_center_y is None or args.right_radius is None:
            print("Error: Right fisheye parameters required (--right-center-x, --right-center-y, --right-radius)")
            print("       Or use --auto-detect for automatic detection")
            return
    
    # Create parameter objects
    left_params = FisheyeParams(
        image_path=args.left_image,
        center=(args.left_center_x, args.left_center_y),
        radius=args.left_radius,
        aperture=args.left_aperture,
        rotate_x=args.left_rotate_x,
        rotate_y=args.left_rotate_y,
        rotate_z=args.left_rotate_z
    )
    
    right_params = FisheyeParams(
        image_path=args.right_image,
        center=(args.right_center_x, args.right_center_y),
        radius=args.right_radius,
        aperture=args.right_aperture,
        rotate_x=args.right_rotate_x,
        rotate_y=args.right_rotate_y,
        rotate_z=args.right_rotate_z
    )
    
    params_list = [left_params, right_params]
    
    # Calculate output height (2:1 aspect ratio for equirectangular)
    output_height = args.width // 2
    
    print(f"Converting dual fisheye to equirectangular ({args.width}x{output_height})...")
    print(f"  Left: {args.left_image}")
    print(f"  Right: {args.right_image}")
    print(f"  Blend width: {args.blend}°")
    
    # Convert
    output = convert_dualfish_to_equirectangular(
        params_list,
        output_width=args.width,
        output_height=output_height,
        antialias=args.antialias,
        blend_width=args.blend,
        blend_power=1.0,
        blend_mid_angle=180.0
    )
    
    # Save output
    output_img = Image.fromarray(output)
    output_img.save(args.output, quality=95)
    print(f"Saved: {args.output}")


if __name__ == '__main__':
    main()
