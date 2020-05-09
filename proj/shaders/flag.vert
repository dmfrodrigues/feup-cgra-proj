attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;

uniform float linearMeasure;
uniform float speed;

uniform sampler2D uSampler;
uniform sampler2D uSampler2;
uniform float normScale;


#define PI 3.14159265359

void main() {

	vec2 aTextureCoord2 = aTextureCoord+vec2(linearMeasure,0.0);

	float offset = sin(aTextureCoord2.x * 2.0 * PI);
	
	vec3 increase = vec3(0,0,offset);

	vec3 movingPos = aVertexPosition + 0.1 * increase;

	if (aTextureCoord.x <= 0.01) movingPos = aVertexPosition;
	
	gl_Position = uPMatrix * uMVMatrix * vec4(movingPos,1.0);
	

	vTextureCoord = aTextureCoord;
}