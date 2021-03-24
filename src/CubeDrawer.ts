import { WebGLRenderer, WebGLRenderTarget } from 'three'
import { CubeSpecification, CubeState } from '@cube-codes/cube-codes-model'
import { CubeSituation } from '@cube-codes/cube-codes-visualizer'
import createHeadlessGLContext from 'gl'
import Jimp from 'jimp'

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
		
		const context = createHeadlessGLContext(this.hrWidth, this.hrHeight, {
			alpha: true,
			preserveDrawingBuffer: true
		});
		console.log("CONTEXT: ", context); // GIVES NULL: We have to think about the environment graphics card: headless-gl on aws ...
		this.renderer = new WebGLRenderer({
			alpha: true,
			canvas: {
				addEventListener: function () {}
			} as unknown as HTMLCanvasElement,
			context: context
		});
		this.renderer.setRenderTarget(new WebGLRenderTarget(this.hrWidth, this.hrHeight));

		this.renderer.render(this.situation.scene, this.situation.camera);

	}

	getPng(): Promise<Buffer> {

		const png = new Jimp(this.hrWidth, this.hrHeight);

		this.renderer.getContext().readPixels(0, 0, this.hrWidth, this.hrHeight, this.renderer.getContext().RGBA, this.renderer.getContext().UNSIGNED_BYTE, png.bitmap.data);
		
		png.mirror(false, true); // GL brings data mirrored (I do not know why)
		png.resize(this.width, this.height);

		return png.getBufferAsync(Jimp.MIME_PNG);

	}

}