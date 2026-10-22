import * as THREE from "three";

export interface AsciiStageOptions {
	/** Height of one character cell in CSS pixels. */
	cellSize?: number;
	/** Width of a character cell relative to its height (0.35 to 1.25). */
	cellAspect?: number;
	/** Characters the renderer may choose from. Shapes are matched, not just brightness. */
	charset?: string;
	/** Tint each character with the scene color underneath it. */
	colored?: boolean;
	/** Character color used when colored is off. */
	color?: string;
	/** Tone contrast of the character selection. 1 keeps the original tones. */
	contrast?: number;
	/** How strongly characters snap to edges and contours. 1 turns the effect off. */
	edgeContrast?: number;
	/** Brightness multiplier applied before characters are chosen. */
	exposure?: number;
	/** Invert the tones so dark areas get the dense characters. */
	invert?: boolean;
	/** Accent color of the ring light in the studio environment. */
	highlight?: string;
	/** Brightness of the studio environment lighting. */
	environmentIntensity?: number;
	/** Roughness of the artwork card (0 to 1). */
	roughness?: number;
	/** Strength of the floating bob animation (0 disables). */
	floatIntensity?: number;
	/** Strength of the idle rocking rotation (0 disables). */
	rotationIntensity?: number;
	/** Speed of the float and rocking animation. */
	floatSpeed?: number;
	/** Camera field of view in degrees. */
	fov?: number;
}

export interface AsciiStage {
	/** Update options live. */
	update: (options: AsciiStageOptions) => void;
	/** Re-read canvas size. Call when the element is resized. */
	resize: () => void;
	/** Stop rendering but keep the stage (and its last frame) alive. */
	pause: () => void;
	/** Resume rendering after pause. */
	resume: () => void;
	/** Stop the loop and release all GPU resources. */
	destroy: () => void;
}

const PRINTABLE_ASCII = Array.from({ length: 95 }, (_, i) =>
	String.fromCharCode(32 + i),
).join("");

const DEFAULTS: Required<AsciiStageOptions> = {
	cellSize: 9,
	cellAspect: 0.6,
	charset: PRINTABLE_ASCII,
	colored: true,
	color: "#ffffff",
	contrast: 1.3,
	edgeContrast: 3,
	exposure: 0.95,
	invert: false,
	highlight: "#066aff",
	environmentIntensity: 1,
	roughness: 0.7,
	floatIntensity: 0.35,
	rotationIntensity: 0.5,
	floatSpeed: 1.4,
	fov: 42,
};

/** The artwork card is one scene unit tall. */
const CARD_HEIGHT = 1;

/** Number of glyph shape samples recorded per cell. */
const INNER_CIRCLES: Array<[number, number]> = [
	[0.28, 0.26],
	[0.72, 0.14],
	[0.28, 0.56],
	[0.72, 0.44],
	[0.28, 0.86],
	[0.72, 0.74],
];

const ATLAS_CELL = 64;
const ATLAS_PAD = 8;
const MAX_GLYPHS = 255;

const POST_VERT = `
out vec2 vUv;
void main() {
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`;

const SRGB_ENCODE = `
vec3 toSrgb(vec3 c) {
  c = clamp(c, 0.0, 1.0);
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(vec3(0.0031308), c));
}
`;

const CELL_FRAG = `
precision highp float;
out vec4 outColor;
uniform sampler2D tScene;
uniform sampler2D tShapes;
uniform vec2 uResolution;
uniform vec2 uCellPx;
uniform int uGlyphCount;
uniform float uContrast;
uniform float uEdgeContrast;
uniform float uExposure;
uniform float uInvert;
${SRGB_ENCODE}
const vec2 INNER[6] = vec2[6](
  vec2(0.28, 0.26), vec2(0.72, 0.14),
  vec2(0.28, 0.56), vec2(0.72, 0.44),
  vec2(0.28, 0.86), vec2(0.72, 0.74)
);
const vec2 OUTER[10] = vec2[10](
  vec2(0.28, -0.2), vec2(0.72, -0.2),
  vec2(-0.22, 0.25), vec2(1.22, 0.25),
  vec2(-0.22, 0.5), vec2(1.22, 0.5),
  vec2(-0.22, 0.75), vec2(1.22, 0.75),
  vec2(0.28, 1.2), vec2(0.72, 1.2)
);
const vec2 RING[6] = vec2[6](
  vec2(1.0, 0.0), vec2(0.5, 0.8660254), vec2(-0.5, 0.8660254),
  vec2(-1.0, 0.0), vec2(-0.5, -0.8660254), vec2(0.5, -0.8660254)
);
vec2 cellBase;
vec4 fetchTap(vec2 p) {
  vec2 uv = p / uResolution;
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) return vec4(0.0);
  return texture(tScene, uv);
}
vec4 sampleCircle(vec2 c) {
  vec2 middle = cellBase + vec2(c.x, 1.0 - c.y) * uCellPx;
  float r = uCellPx.y * 0.161;
  vec4 acc = fetchTap(middle);
  for (int k = 0; k < 6; k++) acc += fetchTap(middle + RING[k] * r);
  return acc / 7.0;
}
float circleLum(vec4 acc) {
  vec3 straight = toSrgb(acc.rgb / max(acc.a, 1e-4));
  float level = clamp(dot(straight, vec3(0.2126, 0.7152, 0.0722)) * uExposure, 0.0, 1.0);
  level = mix(level, 1.0 - level, uInvert);
  return level * acc.a;
}
float dirContrast(float value, float ext) {
  float peak = max(value, ext);
  if (peak < 1e-4) return value;
  return pow(value / peak, uEdgeContrast) * peak;
}
void main() {
  cellBase = floor(gl_FragCoord.xy) * uCellPx;
  float v[6];
  vec3 colAcc = vec3(0.0);
  float alphaAcc = 0.0;
  for (int i = 0; i < 6; i++) {
    vec4 acc = sampleCircle(INNER[i]);
    v[i] = circleLum(acc);
    colAcc += acc.rgb;
    alphaAcc += acc.a;
  }
  float e[10];
  for (int i = 0; i < 10; i++) e[i] = circleLum(sampleCircle(OUTER[i]));
  v[0] = dirContrast(v[0], max(max(e[0], e[1]), max(e[2], e[4])));
  v[1] = dirContrast(v[1], max(max(e[0], e[1]), max(e[3], e[5])));
  v[2] = dirContrast(v[2], max(e[2], max(e[4], e[6])));
  v[3] = dirContrast(v[3], max(e[3], max(e[5], e[7])));
  v[4] = dirContrast(v[4], max(max(e[4], e[6]), max(e[8], e[9])));
  v[5] = dirContrast(v[5], max(max(e[5], e[7]), max(e[8], e[9])));
  float peak = max(max(max(v[0], v[1]), max(v[2], v[3])), max(v[4], v[5]));
  if (peak > 1e-4) {
    for (int i = 0; i < 6; i++) v[i] = pow(v[i] / peak, uContrast) * peak;
  }
  int best = 0;
  float bestD = 1e9;
  for (int g = 0; g < uGlyphCount; g++) {
    float d = 0.0;
    for (int i = 0; i < 6; i++) {
      float diff = v[i] - texelFetch(tShapes, ivec2(i, g), 0).r;
      d += diff * diff;
    }
    if (d < bestD) {
      bestD = d;
      best = g;
    }
  }
  vec3 cellColor = toSrgb(colAcc / max(alphaAcc, 1e-4));
  outColor = vec4(cellColor, float(best) / 255.0);
}`;

const POST_FRAG = `
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform sampler2D tCells;
uniform sampler2D tAtlas;
uniform vec2 uResolution;
uniform vec2 uCellPx;
uniform vec2 uGrid;
uniform vec2 uAtlasGrid;
uniform vec2 uAtlasPad;
uniform vec2 uAtlasInner;
uniform float uColored;
uniform vec3 uColor;
${SRGB_ENCODE}
void main() {
  vec2 fragCoord = vUv * uResolution;
  vec2 cellPos = fragCoord / uCellPx;
  vec2 cell = clamp(floor(cellPos), vec2(0.0), uGrid - 1.0);
  vec4 info = texelFetch(tCells, ivec2(cell), 0);
  float glyph = floor(info.a * 255.0 + 0.5);
  vec2 local = clamp(cellPos - cell, 0.0, 1.0);
  float gx = mod(glyph, uAtlasGrid.x);
  float gy = floor(glyph / uAtlasGrid.x);
  vec2 atlasUv = vec2(
    (gx + uAtlasPad.x + local.x * uAtlasInner.x) / uAtlasGrid.x,
    (uAtlasGrid.y - gy - 1.0 + uAtlasPad.y + local.y * uAtlasInner.y) /
      uAtlasGrid.y
  );
  vec2 atlasStep = uAtlasInner / uAtlasGrid;
  float mask = textureGrad(
    tAtlas,
    atlasUv,
    dFdx(cellPos) * atlasStep,
    dFdy(cellPos) * atlasStep
  ).a;
  vec3 glyphColor = mix(uColor, info.rgb, uColored);
  outColor = vec4(glyphColor * mask, mask);
}`;

const ROOM_BLOCKS: Array<{
	position: [number, number, number];
	rotation: [number, number, number];
	scale: [number, number, number];
}> = [
	{
		position: [-10.906, -1, 1.846],
		rotation: [0, -0.195, 0],
		scale: [2.328, 7.905, 4.651],
	},
	{
		position: [-5.607, -0.754, -0.758],
		rotation: [0, 0.994, 0],
		scale: [1.97, 1.534, 3.955],
	},
	{
		position: [6.167, -0.16, 7.803],
		rotation: [0, 0.561, 0],
		scale: [3.927, 6.285, 3.687],
	},
	{
		position: [-2.017, 0.018, 6.124],
		rotation: [0, 0.333, 0],
		scale: [2.002, 4.566, 2.064],
	},
	{
		position: [2.291, -0.756, -2.621],
		rotation: [0, -0.286, 0],
		scale: [1.546, 1.552, 1.496],
	},
	{
		position: [-2.193, -0.369, -5.547],
		rotation: [0, 0.516, 0],
		scale: [3.875, 3.487, 2.986],
	},
];

interface Former {
	kind: "ring" | "box";
	intensity: number;
	position: [number, number, number];
	scale: [number, number, number];
	lookAtCenter?: boolean;
	withLight?: boolean;
}

const ROOM_FORMERS: Former[] = [
	{
		kind: "ring",
		intensity: 15,
		position: [2, 3, -2],
		scale: [10, 10, 10],
		lookAtCenter: true,
	},
	{
		kind: "box",
		intensity: 80,
		position: [-14, 10, 8],
		scale: [0.1, 2.5, 2.5],
	},
	{
		kind: "box",
		intensity: 80,
		position: [-14, 14, -4],
		scale: [0.1, 2.5, 2.5],
		withLight: true,
	},
	{
		kind: "box",
		intensity: 23,
		position: [14, 12, 0],
		scale: [0.1, 5, 5],
		withLight: true,
	},
	{
		kind: "box",
		intensity: 16,
		position: [0, 9, 14],
		scale: [5, 5, 0.1],
		withLight: true,
	},
	{
		kind: "box",
		intensity: 80,
		position: [7, 8, -14],
		scale: [2.5, 2.5, 0.1],
		withLight: true,
	},
	{
		kind: "box",
		intensity: 80,
		position: [-7, 16, -14],
		scale: [2.5, 2.5, 0.1],
		withLight: true,
	},
	{
		kind: "box",
		intensity: 20,
		position: [0, 15, 0],
		scale: [10, 1, 10],
		withLight: true,
	},
];

function clampAspect(aspect: number) {
	return Math.min(Math.max(aspect || 0.6, 0.35), 1.25);
}

function buildGlyphList(charset: string) {
	const seen = new Set<string>([" "]);
	const glyphs = [" "];
	for (const ch of charset) {
		if (glyphs.length >= MAX_GLYPHS) break;
		if (ch === "\n" || ch === "\r" || ch === "\t" || seen.has(ch)) continue;
		seen.add(ch);
		glyphs.push(ch);
	}
	return glyphs;
}

/** Measure how much ink each glyph puts in the six cell samples. */
function glyphShapes(
	image: ImageData,
	cols: number,
	cellW: number,
	cellH: number,
	count: number,
) {
	const vectors = new Float32Array(count * 6);
	const radius = cellH * 0.26;
	const padW = cellW + ATLAS_PAD * 2;
	const padH = cellH + ATLAS_PAD * 2;
	for (let g = 0; g < count; g++) {
		const originX = (g % cols) * padW + ATLAS_PAD;
		const originY = Math.floor(g / cols) * padH + ATLAS_PAD;
		for (let c = 0; c < 6; c++) {
			const cx = INNER_CIRCLES[c][0] * cellW;
			const cy = INNER_CIRCLES[c][1] * cellH;
			let sum = 0;
			let total = 0;
			for (let y = Math.floor(cy - radius); y <= Math.ceil(cy + radius); y++) {
				for (
					let x = Math.floor(cx - radius);
					x <= Math.ceil(cx + radius);
					x++
				) {
					const dx = x + 0.5 - cx;
					const dy = y + 0.5 - cy;
					if (dx * dx + dy * dy > radius * radius) continue;
					total += 1;
					if (
						x < -ATLAS_PAD ||
						y < -ATLAS_PAD ||
						x >= cellW + ATLAS_PAD ||
						y >= cellH + ATLAS_PAD
					)
						continue;
					sum +=
						image.data[((originY + y) * image.width + originX + x) * 4 + 3];
				}
			}
			vectors[g * 6 + c] = total ? sum / (total * 255) : 0;
		}
	}
	for (let c = 0; c < 6; c++) {
		let peak = 0;
		for (let g = 0; g < count; g++) {
			peak = Math.max(peak, vectors[g * 6 + c]);
		}
		if (peak > 0) {
			for (let g = 0; g < count; g++) vectors[g * 6 + c] /= peak;
		}
	}
	return vectors;
}

function makeCanvas(width: number, height: number) {
	const canvas = document.createElement("canvas");
	canvas.width = Math.max(1, Math.round(width));
	canvas.height = Math.max(1, Math.round(height));
	return canvas;
}

export function createAsciiStage(
	canvas: HTMLCanvasElement,
	source: HTMLCanvasElement,
	options: AsciiStageOptions = {},
): AsciiStage | null {
	const config: Required<AsciiStageOptions> = { ...DEFAULTS, ...options };

	let renderer: THREE.WebGLRenderer;
	try {
		renderer = new THREE.WebGLRenderer({
			canvas,
			antialias: false,
			alpha: true,
			powerPreference: "high-performance",
		});
	} catch {
		return null;
	}
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.setClearColor(0x000000, 0);

	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(config.fov, 1, 0.1, 100);

	const cardGroup = new THREE.Group();
	scene.add(cardGroup);

	const cardAspect = source.width / source.height;
	const cardWidth = CARD_HEIGHT * cardAspect;
	const geometry = new THREE.PlaneGeometry(cardWidth, CARD_HEIGHT, 24, 24);
	const positions = geometry.getAttribute("position") as THREE.BufferAttribute;
	for (let i = 0; i < positions.count; i++) {
		const x = positions.getX(i) / cardWidth;
		const y = positions.getY(i) / CARD_HEIGHT;
		// A gentle bulge keeps the studio light readable across a flat drawing.
		positions.setZ(i, (x * x + y * y) * 0.04);
	}
	geometry.computeVertexNormals();

	const texture = new THREE.CanvasTexture(source);
	texture.colorSpace = THREE.SRGBColorSpace;
	texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
	texture.minFilter = THREE.LinearMipmapLinearFilter;
	texture.magFilter = THREE.LinearFilter;

	const material = new THREE.MeshStandardMaterial({
		map: texture,
		emissive: new THREE.Color(1, 1, 1),
		emissiveMap: texture,
		emissiveIntensity: 0.7,
		metalness: 0,
		roughness: config.roughness,
		transparent: true,
		depthWrite: false,
		side: THREE.DoubleSide,
	});
	const card = new THREE.Mesh(geometry, material);
	cardGroup.add(card);

	const target = new THREE.WebGLRenderTarget(1, 1, { samples: 4 });
	target.texture.colorSpace = THREE.SRGBColorSpace;

	const sharedResolution = new THREE.Vector2(1, 1);
	const sharedCellPx = new THREE.Vector2(6, 10);
	const sharedGrid = new THREE.Vector2(1, 1);

	const cellTarget = new THREE.WebGLRenderTarget(1, 1, {
		depthBuffer: false,
		stencilBuffer: false,
		minFilter: THREE.NearestFilter,
		magFilter: THREE.NearestFilter,
	});

	const postGeometry = new THREE.BufferGeometry();
	postGeometry.setAttribute(
		"position",
		new THREE.BufferAttribute(
			new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]),
			3,
		),
	);
	const postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

	const cellMaterial = new THREE.ShaderMaterial({
		glslVersion: THREE.GLSL3,
		vertexShader: POST_VERT,
		fragmentShader: CELL_FRAG,
		uniforms: {
			tScene: { value: target.texture },
			tShapes: { value: null },
			uResolution: { value: sharedResolution },
			uCellPx: { value: sharedCellPx },
			uGlyphCount: { value: 1 },
			uContrast: { value: config.contrast },
			uEdgeContrast: { value: config.edgeContrast },
			uExposure: { value: config.exposure },
			uInvert: { value: config.invert ? 1 : 0 },
		},
		depthTest: false,
		depthWrite: false,
		blending: THREE.NoBlending,
	});
	const cellMesh = new THREE.Mesh(postGeometry, cellMaterial);
	cellMesh.frustumCulled = false;
	const cellScene = new THREE.Scene();
	cellScene.add(cellMesh);

	const postMaterial = new THREE.ShaderMaterial({
		glslVersion: THREE.GLSL3,
		vertexShader: POST_VERT,
		fragmentShader: POST_FRAG,
		uniforms: {
			tCells: { value: cellTarget.texture },
			tAtlas: { value: null },
			uResolution: { value: sharedResolution },
			uCellPx: { value: sharedCellPx },
			uGrid: { value: sharedGrid },
			uAtlasGrid: { value: new THREE.Vector2(1, 1) },
			uAtlasPad: { value: new THREE.Vector2(0, 0) },
			uAtlasInner: { value: new THREE.Vector2(1, 1) },
			uColored: { value: config.colored ? 1 : 0 },
			uColor: { value: new THREE.Color(1, 1, 1) },
		},
		depthTest: false,
		depthWrite: false,
		blending: THREE.NoBlending,
	});
	const postMesh = new THREE.Mesh(postGeometry, postMaterial);
	postMesh.frustumCulled = false;
	const postScene = new THREE.Scene();
	postScene.add(postMesh);

	let atlasTexture: THREE.CanvasTexture | null = null;
	let shapeTexture: THREE.DataTexture | null = null;
	let builtCharset: string | null = null;
	let builtAspect = 0;

	const pmrem = new THREE.PMREMGenerator(renderer);
	const roomScene = new THREE.Scene();
	let ringMaterial: THREE.MeshBasicMaterial | null = null;
	let envTarget: THREE.WebGLRenderTarget | null = null;
	let envDirty = true;

	function buildRoom() {
		const room = new THREE.Group();
		room.position.set(0, -0.5, 0);
		roomScene.add(room);

		for (const [x, z] of [
			[-15, 15],
			[15, 15],
			[15, -15],
			[-15, -15],
		]) {
			const spot = new THREE.SpotLight(0xffffff, 2, 0, 0.2, 1, 0);
			spot.position.set(x, 20, z);
			room.add(spot, spot.target);
		}
		const center = new THREE.PointLight(0xffffff, 100, 28, 2);
		center.position.set(0.5, 14, 0.5);
		room.add(center);

		const box = new THREE.BoxGeometry();
		const shell = new THREE.Mesh(
			box,
			new THREE.MeshStandardMaterial({ color: "gray", side: THREE.BackSide }),
		);
		shell.position.set(0, 13.2, 0);
		shell.scale.set(31.5, 28.5, 31.5);
		room.add(shell);

		const white = new THREE.MeshStandardMaterial({ color: 0xffffff });
		for (const def of ROOM_BLOCKS) {
			const mesh = new THREE.Mesh(box, white);
			mesh.position.set(...def.position);
			mesh.rotation.set(...def.rotation);
			mesh.scale.set(...def.scale);
			room.add(mesh);
		}

		for (const def of ROOM_FORMERS) {
			const formerGeometry =
				def.kind === "ring"
					? new THREE.RingGeometry(0.5, 1, 64)
					: new THREE.BoxGeometry();
			const formerMaterial = new THREE.MeshBasicMaterial({
				side: THREE.DoubleSide,
				toneMapped: false,
			});
			formerMaterial.color
				.set(def.kind === "ring" ? config.highlight : "#ffffff")
				.multiplyScalar(def.intensity);
			if (def.kind === "ring") ringMaterial = formerMaterial;
			const mesh = new THREE.Mesh(formerGeometry, formerMaterial);
			mesh.position.set(...def.position);
			mesh.scale.set(...def.scale);
			if (def.lookAtCenter) mesh.lookAt(0, 0, 0);
			room.add(mesh);
			if (def.withLight) {
				const light = new THREE.PointLight(0xffffff, 100, 28, 2);
				light.position.set(...def.position);
				room.add(light);
			}
		}
	}

	function refreshEnvironment() {
		if (ringMaterial) {
			ringMaterial.color.set(config.highlight).multiplyScalar(15);
		}
		envTarget?.dispose();
		envTarget = pmrem.fromScene(roomScene, 0, 0.1, 1000);
		scene.environment = envTarget.texture;
	}

	function rebuildAtlas() {
		const aspect = clampAspect(config.cellAspect);
		if (builtCharset === config.charset && builtAspect === aspect) return;
		const glyphs = buildGlyphList(config.charset);
		const cellH = ATLAS_CELL;
		const cellW = Math.max(Math.round(cellH * aspect), 8);
		const padW = cellW + ATLAS_PAD * 2;
		const padH = cellH + ATLAS_PAD * 2;
		const cols = Math.ceil(Math.sqrt(glyphs.length));
		const rows = Math.ceil(glyphs.length / cols);
		const surface = makeCanvas(cols * padW, rows * padH);
		const ctx = surface.getContext("2d");
		if (!ctx) return;
		builtCharset = config.charset;
		builtAspect = aspect;
		ctx.clearRect(0, 0, surface.width, surface.height);
		ctx.fillStyle = "#ffffff";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		const fontPx = Math.floor(Math.min(cellH * 0.92, cellW / 0.58));
		ctx.font = `600 ${fontPx}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
		for (let g = 0; g < glyphs.length; g++) {
			ctx.fillText(
				glyphs[g],
				(g % cols) * padW + padW / 2,
				Math.floor(g / cols) * padH + padH / 2,
			);
		}
		const image = ctx.getImageData(0, 0, surface.width, surface.height);
		const vectors = glyphShapes(image, cols, cellW, cellH, glyphs.length);
		atlasTexture?.dispose();
		shapeTexture?.dispose();
		atlasTexture = new THREE.CanvasTexture(surface);
		atlasTexture.minFilter = THREE.LinearMipmapLinearFilter;
		atlasTexture.magFilter = THREE.LinearFilter;
		atlasTexture.wrapS = THREE.ClampToEdgeWrapping;
		atlasTexture.wrapT = THREE.ClampToEdgeWrapping;
		shapeTexture = new THREE.DataTexture(
			vectors,
			6,
			glyphs.length,
			THREE.RedFormat,
			THREE.FloatType,
		);
		shapeTexture.needsUpdate = true;
		postMaterial.uniforms.tAtlas.value = atlasTexture;
		(postMaterial.uniforms.uAtlasGrid.value as THREE.Vector2).set(cols, rows);
		(postMaterial.uniforms.uAtlasPad.value as THREE.Vector2).set(
			ATLAS_PAD / padW,
			ATLAS_PAD / padH,
		);
		(postMaterial.uniforms.uAtlasInner.value as THREE.Vector2).set(
			cellW / padW,
			cellH / padH,
		);
		cellMaterial.uniforms.tShapes.value = shapeTexture;
		cellMaterial.uniforms.uGlyphCount.value = glyphs.length;
	}

	function syncCellGrid() {
		const pr = renderer.getPixelRatio();
		const cellH = Math.max(config.cellSize, 3) * pr;
		const cellW = cellH * clampAspect(config.cellAspect);
		sharedCellPx.set(cellW, cellH);
		const cols = Math.max(Math.ceil(sharedResolution.x / cellW), 1);
		const rows = Math.max(Math.ceil(sharedResolution.y / cellH), 1);
		sharedGrid.set(cols, rows);
		if (cellTarget.width !== cols || cellTarget.height !== rows) {
			cellTarget.setSize(cols, rows);
		}
	}

	/**
	 * Outline of the bulged card, sampled along its edges. The framing is
	 * measured from it so the artwork meets the viewport edges instead of
	 * sitting inside a guessed margin.
	 */
	const cardOutline: THREE.Vector3[] = [];
	{
		const edgeSteps = 12;
		for (let i = 0; i <= edgeSteps; i++) {
			const t = i / edgeSteps - 0.5;
			for (const [u, v] of [
				[t, -0.5],
				[t, 0.5],
				[-0.5, t],
				[0.5, t],
			]) {
				cardOutline.push(
					new THREE.Vector3(
						u * cardWidth,
						v * CARD_HEIGHT,
						(u * u + v * v) * 0.04,
					),
				);
			}
		}
	}

	const framePoint = new THREE.Vector3();
	let frameTan = Math.tan(THREE.MathUtils.degToRad(config.fov) / 2);
	let frameAspect = 1;

	/**
	 * Camera distance that puts the card's outline on the viewport edges for
	 * its current pose. Recomputed as the card rocks, so the artwork is as
	 * large as the canvas allows at every moment instead of being shrunk for
	 * the whole idle animation at once.
	 */
	function framedDistance() {
		cardGroup.updateMatrixWorld();
		let distance = 0;
		for (const local of cardOutline) {
			framePoint.copy(local).applyMatrix4(cardGroup.matrixWorld);
			distance = Math.max(
				distance,
				framePoint.z + Math.abs(framePoint.y) / frameTan,
				framePoint.z + Math.abs(framePoint.x) / (frameTan * frameAspect),
			);
		}
		return distance * 1.005;
	}

	function fitCamera() {
		camera.fov = config.fov;
		camera.aspect =
			Math.max(canvas.clientWidth, 1) / Math.max(canvas.clientHeight, 1);
		frameTan = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
		frameAspect = camera.aspect;
		camera.position.set(0, 0, framedDistance());
		camera.updateProjectionMatrix();
	}

	function applyOptions() {
		scene.environmentIntensity = config.environmentIntensity;
		material.roughness = config.roughness;
		cellMaterial.uniforms.uContrast.value = Math.max(config.contrast, 0.05);
		cellMaterial.uniforms.uEdgeContrast.value = Math.max(
			config.edgeContrast,
			0.05,
		);
		cellMaterial.uniforms.uExposure.value = Math.max(config.exposure, 0);
		cellMaterial.uniforms.uInvert.value = config.invert ? 1 : 0;
		postMaterial.uniforms.uColored.value = config.colored ? 1 : 0;
		(postMaterial.uniforms.uColor.value as THREE.Color).setStyle(
			config.color || "#ffffff",
			THREE.NoColorSpace,
		);
		rebuildAtlas();
		syncCellGrid();
		fitCamera();
	}

	function resize() {
		const width = Math.max(canvas.clientWidth, 1);
		const height = Math.max(canvas.clientHeight, 1);
		const limit = renderer.capabilities.maxTextureSize;
		const pr = Math.min(
			window.devicePixelRatio || 1,
			2,
			limit / Math.max(width, height),
			Math.sqrt(16_777_216 / (width * height)),
		);
		renderer.setPixelRatio(pr);
		renderer.setSize(width, height, false);
		const deviceW = Math.round(width * pr);
		const deviceH = Math.round(height * pr);
		target.setSize(deviceW, deviceH);
		sharedResolution.set(deviceW, deviceH);
		fitCamera();
		syncCellGrid();
	}

	const observer = new ResizeObserver(() => resize());
	observer.observe(canvas);
	resize();
	applyOptions();
	buildRoom();

	let inView = true;
	let loopRunning = false;
	let paused = false;
	let lastTime = 0;
	let elapsed = Math.random() * 100;
	let disposed = false;

	const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
	let reducedMotion = motionQuery.matches;

	function tick(time: number) {
		if (!inView) {
			lastTime = 0;
			stopLoop();
			return;
		}
		const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.1) : 0;
		lastTime = time;
		if (envDirty) {
			envDirty = false;
			refreshEnvironment();
		}

		if (!reducedMotion) {
			elapsed += delta * config.floatSpeed;
			cardGroup.rotation.x =
				(Math.cos(elapsed / 4) / 16) * config.rotationIntensity;
			cardGroup.rotation.y =
				(Math.sin(elapsed / 4) / 12) * config.rotationIntensity;
			cardGroup.rotation.z =
				(Math.sin(elapsed / 4) / 24) * config.rotationIntensity;
			cardGroup.position.y =
				(Math.sin(elapsed / 1.5) / 10) * config.floatIntensity;
		}

		// Keep the card edge-to-edge as it rocks instead of framing the whole
		// animation up front, which would leave the resting artwork smaller
		// than the illustration it replaces.
		camera.position.z = framedDistance();

		renderer.setRenderTarget(target);
		renderer.render(scene, camera);
		renderer.setRenderTarget(cellTarget);
		renderer.render(cellScene, postCamera);
		renderer.setRenderTarget(null);
		renderer.render(postScene, postCamera);
	}

	function startLoop() {
		if (loopRunning || paused || !inView || disposed) return;
		loopRunning = true;
		renderer.setAnimationLoop(tick);
	}

	function stopLoop() {
		if (!loopRunning) return;
		loopRunning = false;
		renderer.setAnimationLoop(null);
	}

	const viewObserver =
		typeof IntersectionObserver !== "undefined"
			? new IntersectionObserver((entries) => {
					inView = entries[entries.length - 1]?.isIntersecting ?? true;
					if (inView) startLoop();
					else stopLoop();
				})
			: null;
	viewObserver?.observe(canvas);

	const onMotionChange = () => {
		reducedMotion = motionQuery.matches;
		if (reducedMotion) {
			cardGroup.rotation.set(0, 0, 0);
			cardGroup.position.y = 0;
			camera.position.z = framedDistance();
		}
	};
	motionQuery.addEventListener("change", onMotionChange);

	startLoop();

	return {
		update(next: AsciiStageOptions) {
			const previousHighlight = config.highlight;
			const previousCharset = config.charset;
			const previousCellAspect = config.cellAspect;
			Object.assign(config, next);
			if (config.highlight !== previousHighlight) envDirty = true;
			if (
				config.charset !== previousCharset ||
				config.cellAspect !== previousCellAspect
			) {
				builtCharset = null;
			}
			applyOptions();
			startLoop();
		},
		resize,
		pause() {
			paused = true;
			stopLoop();
		},
		resume() {
			paused = false;
			startLoop();
		},
		destroy() {
			disposed = true;
			stopLoop();
			observer.disconnect();
			viewObserver?.disconnect();
			motionQuery.removeEventListener("change", onMotionChange);
			geometry.dispose();
			material.dispose();
			texture.dispose();
			envTarget?.dispose();
			if (ringMaterial) ringMaterial.dispose();
			roomScene.traverse((node) => {
				const mesh = node as THREE.Mesh;
				if (mesh.geometry) mesh.geometry.dispose();
				const materials = Array.isArray(mesh.material)
					? mesh.material
					: [mesh.material];
				for (const roomMaterial of materials) roomMaterial?.dispose();
			});
			pmrem.dispose();
			target.dispose();
			cellTarget.dispose();
			cellMaterial.dispose();
			postMaterial.dispose();
			postGeometry.dispose();
			atlasTexture?.dispose();
			shapeTexture?.dispose();
			renderer.dispose();
		},
	};
}
