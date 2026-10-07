import zlib
import struct
import math

def create_png(width, height, get_pixel):
    raw_data = bytearray()
    for y in range(height):
        raw_data.append(0) # filter type none
        for x in range(width):
            r, g, b, a = get_pixel(x, y, width, height)
            raw_data.extend([int(r), int(g), int(b), int(a)])
    
    def chunk(chunk_type, data):
        return (struct.pack('>I', len(data)) + 
                chunk_type + 
                data + 
                struct.pack('>I', zlib.crc32(chunk_type + data) & 0xffffffff))

    header = b'\x89PNG\r\n\x1a\n'
    ihdr = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    idat = zlib.compress(bytes(raw_data), 9)
    return header + chunk(b'IHDR', ihdr) + chunk(b'IDAT', idat) + chunk(b'IEND', b'')

def render_favicon(x, y, w, h):
    nx = x / float(w)
    ny = y / float(h)
    
    # Distance from rounded box (squircle with radius)
    corner_r = 0.22
    dx = max(0, abs(nx - 0.5) - (0.5 - corner_r))
    dy = max(0, abs(ny - 0.5) - (0.5 - corner_r))
    dist = math.sqrt(dx*dx + dy*dy)
    
    if dist > corner_r:
        # Transparent outside
        return (0, 0, 0, 0)
    
    # Anti-aliasing edge
    edge_alpha = 1.0
    if dist > corner_r - 0.02:
        edge_alpha = max(0.0, min(1.0, (corner_r - dist) / 0.02))

    # Background: deep dark navy gradient
    bg_r = int(14 * (1.0 - ny) + 5 * ny)
    bg_g = int(23 * (1.0 - ny) + 8 * ny)
    bg_b = int(48 * (1.0 - ny) + 24 * ny)
    
    # Brand border: 0.03 thick
    is_border = (dist > corner_r - 0.035) or (nx < 0.04 or nx > 0.96 or ny < 0.04 or ny > 0.96)
    
    # Gradient interpolation: Purple (102, 80, 255) -> Pink (236, 72, 153)
    t = (nx + ny) * 0.5
    fg_r = int(102 * (1 - t) + 236 * t)
    fg_g = int(80 * (1 - t) + 72 * t)
    fg_b = int(255 * (1 - t) + 153 * t)

    # Check distance to 'M' segments
    # Points: P1(0.24, 0.75), P2(0.24, 0.25), P3(0.5, 0.50), P4(0.76, 0.25), P5(0.76, 0.75)
    def dist_to_segment(px, py, x1, y1, x2, y2):
        l2 = (x2 - x1)**2 + (y2 - y1)**2
        if l2 == 0: return math.hypot(px - x1, py - y1)
        k = max(0.0, min(1.0, ((px - x1)*(x2 - x1) + (py - y1)*(y2 - y1)) / l2))
        proj_x = x1 + k * (x2 - x1)
        proj_y = y1 + k * (y2 - y1)
        return math.hypot(px - proj_x, py - proj_y)

    d_m1 = dist_to_segment(nx, ny, 0.24, 0.75, 0.24, 0.25)
    d_m2 = dist_to_segment(nx, ny, 0.24, 0.25, 0.50, 0.50)
    d_m3 = dist_to_segment(nx, ny, 0.50, 0.50, 0.76, 0.25)
    d_m4 = dist_to_segment(nx, ny, 0.76, 0.25, 0.76, 0.75)
    min_dm = min(d_m1, d_m2, d_m3, d_m4)

    # Check distance to central arrow V: (0.40, 0.60) -> (0.50, 0.70) -> (0.60, 0.60)
    d_a1 = dist_to_segment(nx, ny, 0.40, 0.60, 0.50, 0.70)
    d_a2 = dist_to_segment(nx, ny, 0.50, 0.70, 0.60, 0.60)
    min_da = min(d_a1, d_a2)

    m_width = 0.075
    arrow_width = 0.045

    if min_da < arrow_width:
        # Arrow is bright white / cyan
        aa = max(0.0, min(1.0, (arrow_width - min_da) / 0.015))
        r = int(255 * aa + bg_r * (1 - aa))
        g = int(255 * aa + bg_g * (1 - aa))
        b = int(255 * aa + bg_b * (1 - aa))
        return (r, g, b, int(255 * edge_alpha))

    if min_dm < m_width:
        # M body in gradient
        aa = max(0.0, min(1.0, (m_width - min_dm) / 0.015))
        r = int(fg_r * aa + bg_r * (1 - aa))
        g = int(fg_g * aa + bg_g * (1 - aa))
        b = int(fg_b * aa + bg_b * (1 - aa))
        return (r, g, b, int(255 * edge_alpha))

    if is_border:
        return (fg_r, fg_g, fg_b, int(220 * edge_alpha))

    return (bg_r, bg_g, bg_b, int(255 * edge_alpha))

# Generate 64x64 PNG
png_data = create_png(64, 64, render_favicon)
with open('public/favicon.png', 'wb') as f:
    f.write(png_data)

# Generate ICO file (wraps PNG format in standard ICO container)
ico_header = struct.pack('<HHH', 0, 1, 1) # Reserved, Type 1 (ICO), 1 image
ico_entry = struct.pack('<BBBBHHII', 64, 64, 0, 0, 1, 32, len(png_data), 22)
with open('public/favicon.ico', 'wb') as f:
    f.write(ico_header + ico_entry + png_data)

print("Generated public/favicon.png and public/favicon.ico successfully!")
