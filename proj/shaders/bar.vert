attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;

uniform sampler2D uSampler;

uniform float normScale;


#define PI 3.14159265359

void main() {

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition,1.0);
	
	vTextureCoord = aTextureCoord;
}