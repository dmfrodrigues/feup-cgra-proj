attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;

uniform float timeFactor;

uniform sampler2D uSampler;
uniform sampler2D uSampler2;
uniform float normScale;

void main() {

	float offset = sin(aTextureCoord.x);

	vec3 increase = vec3(0,0,offset);

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + increase,1.0);

	vTextureCoord = aTextureCoord;
}