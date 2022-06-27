const rect = (p1, p2, p3, p4) => [p1, p2, p3, p1, p3, p4].flat();

const cube = (b1, bdx, bdz, t1, tdx, tdz) => {
	bdx = [bdx, 0, 0];
	bdz = [0, 0, bdz];
	tdx = [tdx, 0, 0];
	tdz = [0, 0, tdz];

	let bx = b1.map((p, i) => p + bdx[i]);
	let bz = b1.map((p, i) => p + bdz[i]);
	let bxz = b1.map((p, i) => p + bdx[i] + bdz[i]);

	let tx = t1.map((p, i) => p + tdx[i]);
	let tz = t1.map((p, i) => p + tdz[i]);
	let txz = t1.map((p, i) => p + tdx[i] + tdz[i]);

	return [
		...rect(b1, bx, bxz, bz), // bottom
		...rect(t1, tx, txz, tz), // top
		...rect(b1, bx, tx, t1), // back
		...rect(b1, t1, tz, bz), // left
		...rect(bx, bxz, txz, tx), // right
		...rect(bxz, bz, tz, txz), // front
	];
};

export {cube};
