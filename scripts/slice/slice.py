# python 将大图片切割为 适用于 leaflet 的瓦片集

from PIL import Image
import os
import math

# 设置新的像素限制
Image.MAX_IMAGE_PIXELS = None


def cut_image_auto_zoom(image_path, output_folder, max_zoom=4, base_resolution=1024, tile_size=256):
    # 打开图片
    img = Image.open(image_path)
    original_width, original_height = img.size

    # # 确保图片尺寸足够大，至少要达到最大级别要求
    # if original_width < base_resolution * (2 ** (max_zoom - 1)) or original_height < base_resolution * (2 ** (max_zoom - 1)):
    #     raise ValueError("原始图片尺寸不足以支持该缩放级别")

    max_zoom = int(math.log(original_width / tile_size, 2)) + 1

    print(f"原始图片尺寸为 {original_width}x{original_height}，最大缩放级别为 {max_zoom}.")

    # 确保输出文件夹存在
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # 遍历每个缩放级别，从 1K 开始逐渐增大
    for z in range(max_zoom):
        # 计算当前级别图片的目标分辨率
        target_resolution = base_resolution * (2 ** z)
        print(f"Zoom level {z}: 目标分辨率为 {target_resolution}x{target_resolution}.")

        # 调整图片大小到当前级别的分辨率
        zoomed_img = img.resize( (target_resolution, target_resolution), Image.LANCZOS)
        zoom_width, zoom_height = zoomed_img.size

        # 计算瓦片数量
        num_tiles_x = (zoom_width + tile_size - 1) // tile_size  # 向上取整
        num_tiles_y = (zoom_height + tile_size - 1) // tile_size

        # 创建用于存放当前缩放级别的文件夹
        zoom_folder = os.path.join(output_folder, f'{z}')
        if not os.path.exists(zoom_folder):
            os.makedirs(zoom_folder)

        # 切割当前缩放级别的图片
        tile_count = 0
        for i in range(num_tiles_x):
            for j in range(num_tiles_y):
                # 确定瓦片的左上角和右下角位置
                left = i * tile_size
                top = j * tile_size
                right = min(left + tile_size, zoom_width)
                bottom = min(top + tile_size, zoom_height)

                # 裁剪瓦片
                tile = zoomed_img.crop((left, top, right, bottom))

                # 保存瓦片
                tile.save(
                    os.path.join(zoom_folder, f'tile_{i}_{j}.webp'),
                    bitmap_format='webp'
                )
                tile_count += 1

        print(
            f"Zoom level {z}: 切割为 {tile_count} 张瓦片，图片分辨率为 {
                target_resolution}x{target_resolution}."
        )


# 使用示例，生成最多5级缩放的瓦片
cut_image_auto_zoom('scripts/imgs/fextralife_map.jpg', 'scripts/out', max_zoom=7,
                    base_resolution=256, tile_size=256)
