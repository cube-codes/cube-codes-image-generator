import CCM from "@cube-codes/cube-codes-model";
import CCIG from "../dist/package/index.js";
import fs from 'fs'

(async () => {
	
	const spec = new CCM.CubeSpecification(10);
	const solutionCondition = new CCM.CubeSolutionCondition(CCM.CubeSolutionConditionType.COLOR);
	const cube = new CCM.Cube(spec, solutionCondition);
	await cube.move(new CCM.CubeMove(spec, CCM.CubeFace.LEFT, 1, 2, -1));
	
	const drawer = new CCIG.CubeDrawer(spec, cube.getState(), 800, 800);
	const png = await drawer.getPng();

	const stream = fs.createWriteStream('example.png');
	stream.write(png);

})();