import { Cube, CubeFace, CubeMove, CubeSolutionCondition, CubeSolutionConditionType, CubeSpecification } from "@cube-codes/cube-codes-model";
import { CubeDrawer } from "./CubeDrawer";

export async function handler(event: any, context: any): Promise<object> {

	const spec = new CubeSpecification(10);
	const solutionCondition = new CubeSolutionCondition(CubeSolutionConditionType.COLOR);
	const cube = new Cube(spec, solutionCondition);
	await cube.move(new CubeMove(spec, CubeFace.LEFT, 1, 2, -1));
	
	const drawer = new CubeDrawer(spec, cube.getState(), 800, 800);
	const png = await drawer.getPng();
    const pngBase64 = png.toString('base64');

    const response = {
        statusCode: 200,
        headers: {
            'Content-Length': Buffer.byteLength(pngBase64),
            'Content-Type': 'image/png'
        },
        isBase64Encoded: true,
        body: pngBase64
    };

    return response;

};