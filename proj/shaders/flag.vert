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

#define PI 3.14159265359

void main() {

	//float offset = sin(aTextureCoord.x * 2.0 * PI);
	float offset = aTextureCoord.x;

	vec3 increase = vec3(0,0,offset);

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + increase,1.0);

	vTextureCoord = aTextureCoord;
}