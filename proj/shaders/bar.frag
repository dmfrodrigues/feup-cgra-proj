#ifdef GL_ES
precision highp float;
#endif

uniform int numSupplies;
uniform int maxSupplies;

varying vec2 vTextureCoord;

void main() {

	float fNumSupplies = float(numSupplies);
	float fMaxSupplies = float(maxSupplies);

	float supplyRatio = fNumSupplies/fMaxSupplies;

	vec4 color;

	
	if (vTextureCoord.x > supplyRatio) color = vec4(0.5,0.5,0.5,1.0);
	else color = vec4(1.0 - vTextureCoord.x,0.0 + vTextureCoord.x,0.0,1.0);
	

	gl_FragColor = color;
} 