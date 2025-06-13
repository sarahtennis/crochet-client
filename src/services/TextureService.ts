import { SingletonService } from "./SingletonService";

export class TextureService extends SingletonService {
  private texture: WebGLTexture;
  constructor() {
    super();
  }

  public static getTexture() {
    return TextureService.getInstance().texture || null;
  }

  public static loadTexture(context: WebGLRenderingContext, url: string) {
    const texture = context.createTexture();
    context.bindTexture(context.TEXTURE_2D, texture);
    // Because images have to be downloaded over the internet
    // they might take a moment until they are ready.
    // Until then put a single pixel in the texture so we can
    // use it immediately. When the image has finished downloading
    // we'll update the texture with the contents of the image.
    const level = 0;
    const internalFormat = context.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = context.RGBA;
    const srcType = context.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
    context.texImage2D(
      context.TEXTURE_2D,
      level,
      internalFormat,
      width,
      height,
      border,
      srcFormat,
      srcType,
      pixel
    );

    const image = new Image();
    image.onload = () => {
      context.bindTexture(context.TEXTURE_2D, texture);
      context.texImage2D(
        context.TEXTURE_2D,
        level,
        internalFormat,
        srcFormat,
        srcType,
        image
      );

      // WebGL1 has different requirements for power of 2 images
      // vs. non power of 2 images so check if the image is a
      // power of 2 in both dimensions.
      if (TextureService.isPowerOf2(image.width) && TextureService.isPowerOf2(image.height)) {
        // Yes, it's a power of 2. Generate mips.
        context.generateMipmap(context.TEXTURE_2D);
      } else {
        // No, it's not a power of 2. Turn off mips and set
        // wrapping to clamp to edge
        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE);
        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);
        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR);
      }
    };
    image.src = url;

    TextureService.getInstance().texture = texture;

    return texture;
  }

  public static isPowerOf2(value: number) {
    return (value & (value - 1)) === 0;
  }

  public static destroy() {}
}
