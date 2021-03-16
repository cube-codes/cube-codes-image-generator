import { WebGLRenderer, WebGLRenderTarget } from 'three'
import { CubeSpecification, CubeState } from '@cube-codes/cube-codes-model'
import { CubeSituation } from '@cube-codes/cube-codes-visualizer'
import { PNG } from 'pngjs';
import createHeadlessGLContext from 'gl'
import sharp from 'sharp'

export class CubeDrawer {

	private static readonly HR_FACTOR = 4;

	readonly hrWidth: number

	readonly hrHeight: number

	readonly situation: CubeSituation

	readonly renderer: WebGLRenderer

	constructor(readonly cubeSpec: CubeSpecification, readonly cubeState: CubeState, readonly width: number, readonly height: number) {

		this.hrWidth = this.width * CubeDrawer.HR_FACTOR;
		this.hrHeight = this.height * CubeDrawer.HR_FACTOR;

		this.situation = new CubeSituation(this.cubeSpec, this.cubeState, this.hrWidth, this.hrHeight);
		
		this.renderer = new WebGLRenderer({
			alpha: true,
			canvas: { addEventListener: function () {} } as unknown as HTMLCanvasElement,
			context: createHeadlessGLContext(this.hrWidth, this.hrHeight, { alpha: true, preserveDrawingBuffer: true })
		});
		this.renderer.setRenderTarget(new WebGLRenderTarget(this.hrWidth, this.hrHeight));

		this.renderer.render(this.situation.scene, this.situation.camera);

	}

	getPng(): Promise<Buffer> {

		const pixels = new Uint8Array(4 * this.hrWidth * this.hrHeight)
		this.renderer.getContext().readPixels(0, 0, this.hrWidth, this.hrHeight, this.renderer.getContext().RGBA, this.renderer.getContext().UNSIGNED_BYTE, pixels)
	
		const png = new PNG({ width: this.hrWidth, height: this.hrHeight })
		for (let j = 0; j <= this.hrHeight; j++) {
			for (let i = 0; i <= this.hrWidth; i++) {
				
				const k = j * this.hrWidth + i
				const r = pixels[4 * k]
				const g = pixels[4 * k + 1]
				const b = pixels[4 * k + 2]
				const a = pixels[4 * k + 3]
	
				const m = (this.hrHeight - j + 1) * this.hrWidth + i
				png.data[4 * m] = r
				png.data[4 * m + 1] = g
				png.data[4 * m + 2] = b
				png.data[4 * m + 3] = a
	
			}
		}
	
		const resizer = sharp().resize(this.width, this.height);
		png.pack().pipe(resizer);
		
		return resizer.toBuffer();

	}

}