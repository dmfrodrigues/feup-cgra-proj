class AirshipBody extends CGFobject {
    constructor(scene, length, radius) {
        super(scene);
        this.scene = scene;
        this.length = length;
        this.radius = radius;
        this.initObjects();
        this.initMaterials();
    }
    initObjects(){
        this.body = new MySphere(this.scene, 12, 50);
    }
    initMaterials(){
        const BODY_PATH = 'images/airship-body.png';

        this.materials = {};
        this.materials.body = new CGFappearance(this.scene);
        this.materials.body.setAmbient(0.8, 0.8, 0.8, 1);
        this.materials.body.setDiffuse(0.7, 0.7, 0.7, 1);
        this.materials.body.setSpecular(0.1, 0.1, 0.1, 1);
        this.materials.body.setShininess(2.0);
        this.materials.body.loadTexture(BODY_PATH);
        this.materials.body.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');
    }
    display() {
        this.scene.pushMatrix();{
            this.scene.scale(this.radius, this.radius, this.length/2);
            this.scene.rotate(180*Math.PI/180, 0, 0, 1);
            this.scene.rotate(90*Math.PI/180, 1, 0, 0);
            this.materials.body.apply();
            this.body.display();
        }this.scene.popMatrix();
    }
    getRadius(){
        return this.radius;
    }
}

class AirshipMotor extends CGFobject {
    constructor(scene, length, radius) {
        super(scene);
        this.scene = scene;
        this.length = length;
        this.radius = radius;

        this.initObjects();
        this.initMaterials();
        
        this.reset();
    }
    initObjects(){
        const SLICES = 30;
        const STACKS = 10;

        const BLADE_SLICES = 10;

        this.motor   = new MySphere(this.scene, SLICES, STACKS);
        this.axis    = new MySphere(this.scene, SLICES, STACKS);
        this.blade1  = new MySphere(this.scene, BLADE_SLICES, STACKS);
        this.blade2  = new MySphere(this.scene, BLADE_SLICES, STACKS);
    }
    initMaterials(){
        const metalPath = 'images/blades_texture.png';
        
        this.materials = {};
        
        this.materials.metal1 = new CGFappearance(this.scene);
        this.materials.metal1.setAmbient(1, 1, 1, 1);
        this.materials.metal1.setDiffuse(0.1, 0.1, 0.1, 1);
        this.materials.metal1.setSpecular(0.6, 0.6, 0.6, 1);
        this.materials.metal1.setShininess(10.0);
        this.materials.metal1.loadTexture(metalPath);
        this.materials.metal1.setTextureWrap('CLAMP_TO_EDGE','CLAMP_TO_EDGE');

        this.materials.metal2 = new CGFappearance(this.scene);
        this.materials.metal2.setAmbient(0.3, 0.3, 0.3, 1);
        this.materials.metal2.setDiffuse(0.1, 0.1, 0.1, 1);
        this.materials.metal2.setSpecular(0.3, 0.3, 0.3, 1);
        this.materials.metal2.setShininess(4.0);
        this.materials.metal2.loadTexture(metalPath);
        this.materials.metal2.setTextureWrap('CLAMP_TO_EDGE','CLAMP_TO_EDGE');

        this.materials.engine = new CGFappearance(this.scene);
        this.materials.engine.setAmbient(0.8, 0.8, 0.8, 1);
        this.materials.engine.setDiffuse(0.7, 0.7, 0.7, 1);
        this.materials.engine.setSpecular(0.1, 0.1, 0.1, 1);
    }
    reset(){
        this.angle = 0;
        this.angle_speed = 0;
        this.update_prevtime = 0;
    }
    setSpeed(angspeed){
        this.angle_speed = angspeed;
    }
    update(){
        let t = Date.now()/1000;
        let Dt = t - this.update_prevtime;

        this.angle += Dt * this.angle_speed;

        this.update_prevtime = t;
    }
    display() {
        this.update();

        this.scene.pushMatrix();{
            this.scene.scale(this.radius/3, this.radius/3, this.length/2);
            this.scene.rotate(90*Math.PI/180, 1, 0, 0);
            this.materials.engine.apply();
            this.motor.display();
        }this.scene.popMatrix();
        this.scene.pushMatrix();{
            this.scene.rotate(this.angle, 0, 0, 1);
            this.scene.pushMatrix();{
                this.scene.translate(0, 0, -this.length/2);
                this.scene.scale(0.2*this.radius, 0.2*this.radius, 0.13*this.radius);
                this.scene.rotate(90*Math.PI/180, 1, 0, 0);
                this.materials.metal2.apply();
                this.axis.display();
            }this.scene.popMatrix();
            this.scene.pushMatrix();{
                this.scene.translate(0, 0.4*this.radius, -this.length/2);
                this.scene.scale(0.09*this.radius, 0.6*this.radius, 0.03*this.radius);
                this.materials.metal1.apply();
                this.blade1.display();
            }this.scene.popMatrix();
            this.scene.pushMatrix();{
                this.scene.translate(0, -0.4*this.radius, -this.length/2);
                this.scene.scale(0.09*this.radius, 0.6*this.radius, 0.03*this.radius);
                this.materials.metal1.apply();
                this.blade2.display();
            }this.scene.popMatrix();
        }this.scene.popMatrix();
    }
    getRadius(){ return this.radius; }
}

class Gondola extends CGFobject {
    constructor(scene, length, radius, height) {
        super(scene);
        this.scene = scene;
        this.length = length;
        this.radius = radius;
        this.height = height;

        this.initBuffers();
        this.initMaterials();
    }
    initBuffers(){
        this.vertices  = [];
        this.indices   = [];
        this.normals   = [];
        this.texCoords = [];

        /* Front, botfront */{
            const SLICES = 20;
            //pivot
            this.vertices.push(0, 0, this.length/2); this.normals.push(0, -1, 0); this.texCoords.push(5/12, 1.5/2);

            let i = 0;
            let phi = Math.PI*i/SLICES;
            let x   = this.radius*Math.cos(phi);
            let z   = this.radius*Math.sin(phi);
            this.vertices.push(x, 0          , z+this.length/2); this.normals.push(x, 0, z); this.texCoords.push((6-i/SLICES)/12, 1/2);
            this.vertices.push(x, this.height, z+this.length/2); this.normals.push(x, 0, z); this.texCoords.push((6-i/SLICES)/12, 0);
            this.vertices.push(x, 0          , z+this.length/2); this.normals.push(0, -1, 0); this.texCoords.push((5+0.5*z/this.radius)/12, (1.5+0.5*x/this.radius)/2);
            for(i = 1; i <= SLICES; ++i){
                phi = Math.PI*i/SLICES;
                x   = this.radius*Math.cos(phi);
                z   = this.radius*Math.sin(phi);
                this.vertices.push(x, 0          , z+this.length/2); this.normals.push(x, 0, z); this.texCoords.push((6-i/SLICES)/12, 1/2);
                this.vertices.push(x, this.height, z+this.length/2); this.normals.push(x, 0, z); this.texCoords.push((6-i/SLICES)/12, 0);
                this.vertices.push(x, 0          , z+this.length/2); this.normals.push(0, -1, 0); this.texCoords.push((5+0.5*z/this.radius)/12, (1.5+0.5*x/this.radius)/2);
                this.indices.push(1+3*i-3, 1+3*i-2, 1+3*i);
                this.indices.push(1+3*i-2, 1+3*i+1, 1+3*i);
                this.indices.push(1+3*i-1, 1+3*i+2, 0);
            }
        }
        /* Left */{
            this.vertices.push(this.radius, 0          , +this.length/2); this.normals.push(1, 0, 0); this.texCoords.push(6/12, 1/2);
            this.vertices.push(this.radius, this.height, +this.length/2); this.normals.push(1, 0, 0); this.texCoords.push(6/12, 0);
            this.vertices.push(this.radius, 0          , -this.length/2); this.normals.push(1, 0, 0); this.texCoords.push(11/12, 1/2);
            this.vertices.push(this.radius, this.height, -this.length/2); this.normals.push(1, 0, 0); this.texCoords.push(11/12, 0);
            let N = this.vertices.length/3;
            this.indices.push(N-1, N-3, N-4);
            this.indices.push(N-4, N-2, N-1);
        }
        /* Right */{
            this.vertices.push(-this.radius, 0          , +this.length/2); this.normals.push(-1, 0, 0); this.texCoords.push(5/12, 1/2);
            this.vertices.push(-this.radius, this.height, +this.length/2); this.normals.push(-1, 0, 0); this.texCoords.push(5/12, 0);
            this.vertices.push(-this.radius, 0          , -this.length/2); this.normals.push(-1, 0, 0); this.texCoords.push(0, 1/2);
            this.vertices.push(-this.radius, this.height, -this.length/2); this.normals.push(-1, 0, 0); this.texCoords.push(0, 0);
            const N = this.vertices.length/3;
            this.indices.push(N-3, N-1, N-2);
            this.indices.push(N-2, N-4, N-3);
        }
        /* Back */{
            this.vertices.push(+this.radius, 0          , -this.length/2); this.normals.push(0, 0, -1); this.texCoords.push(11/12, 1/2);
            this.vertices.push(+this.radius, this.height, -this.length/2); this.normals.push(0, 0, -1); this.texCoords.push(11/12, 0);
            this.vertices.push(-this.radius, 0          , -this.length/2); this.normals.push(0, 0, -1); this.texCoords.push(1, 1/2);
            this.vertices.push(-this.radius, this.height, -this.length/2); this.normals.push(0, 0, -1); this.texCoords.push(1, 0);
            const N = this.vertices.length/3;
            this.indices.push(N-1, N-3, N-4);
            this.indices.push(N-4, N-2, N-1);
        }
        /* Bottom */{
            this.vertices.push(+this.radius, 0, -this.length/2); this.normals.push(0, -1, 0); this.texCoords.push(0, 2/2);
            this.vertices.push(-this.radius, 0, -this.length/2); this.normals.push(0, -1, 0); this.texCoords.push(0, 1/2);
            this.vertices.push(+this.radius, 0, +this.length/2); this.normals.push(0, -1, 0); this.texCoords.push(5/12, 2/2);
            this.vertices.push(-this.radius, 0, +this.length/2); this.normals.push(0, -1, 0); this.texCoords.push(5/12, 1/2);
            const N = this.vertices.length/3;
            this.indices.push(N-1, N-3, N-4);
            this.indices.push(N-4, N-2, N-1);
        }
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
    initMaterials(){
        this.PATHS = {
            GONDOLA: 'images/gondola.png'
        };
        this.materials = {};
        this.materials.gondola = new CGFappearance(this.scene);
        this.materials.gondola.loadTexture(this.PATHS.GONDOLA);
        this.materials.gondola.setAmbient(0.8, 0.8, 0.8, 1);
        this.materials.gondola.setDiffuse(0.7, 0.7, 0.7, 1);
        this.materials.gondola.setSpecular(0.1, 0.1, 0.1, 1);
    }
    display() {
        this.scene.pushMatrix();{
            this.scene.translate(0, -this.height/2, 0);
            this.materials.gondola.apply();
            super.display();
        }this.scene.popMatrix();
    }
    getRadius(){
        return this.radius;
    }
}

class AirshipGondola extends CGFobject {
    constructor(scene, length, radius, height) {
        super(scene);
        this.scene = scene;
        this.length = length;
        this.radius = radius;
        this.height = height;

        this.initObjects();
    }
    initObjects(){
        const SLICES = 20;
        const stacks = 20;

        this.gondola = new Gondola(this.scene, this.length, this.radius, this.height);
        this.sphere  = new MySphere(this.scene, SLICES, stacks);
        this.motor   = new AirshipMotor(this.scene, 0.2*this.length, 0.7*this.radius);
    }
    display() {
        this.gondola.display();
        this.scene.pushMatrix();{
            this.scene.translate(+this.radius, -0.2*this.height, -0.5*this.length);
            this.motor.display();
        }this.scene.popMatrix();
        this.scene.pushMatrix();{
            this.scene.translate(-this.radius, -0.2*this.height, -0.5*this.length);
            this.motor.display();
        }this.scene.popMatrix();
    }
    setSpeed(speed){
        this.motor.setSpeed(50*speed);
    }
    getRadius(){ return this.radius; }
    getHeight(){ return this.height; }
}

class AirshipControlSurface extends CGFobject {
    constructor(scene, yscale, zscale){
        super(scene);
        this.scene = scene;
        this.yscale = yscale;
        this.zscale = zscale;
        this.reset();
        this.initBuffers();
        this.initMaterials();
    }
    reset(){
        this.angle = 0;
    }
    initBuffers(){
        this.vertices = [
            0, 0*this.yscale,  0*this.zscale,
            0, 0*this.yscale, -1*this.zscale,
            0, 1*this.yscale, -1*this.zscale,
            0, 1*this.yscale,  0*this.zscale,
            0, 0*this.yscale,  2*this.zscale,
            0, 0*this.yscale,  0*this.zscale, 
            0, 0*this.yscale, -1*this.zscale, 
            0, 1*this.yscale, -1*this.zscale, 
            0, 1*this.yscale,  0*this.zscale, 
            0, 0*this.yscale,  2*this.zscale 
        ];
        this.normals = [
            +1, 0, 0,
            +1, 0, 0,
            +1, 0, 0,
            +1, 0, 0,
            +1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0
        ];
        this.indices = [
            0, 1, 2,
            2, 3, 0,
            0, 3, 4,
            7, 6, 5,
            5, 8, 7,
            9, 8, 5
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
    initMaterials(){
        this.materials = {};

        this.materials.surface = new CGFappearance(this.scene);
        this.materials.surface.setAmbient(0.8, 0.8, 0.8, 1);
        this.materials.surface.setDiffuse(0.7, 0.7, 0.7, 1);
        this.materials.surface.setSpecular(0.1, 0.1, 0.1, 1);
        this.materials.surface.setShininess(2.0);
    }
    setAngle(angle){
        this.angle = angle;
    }
    display(){
        this.scene.pushMatrix(); {
            this.scene.rotate(this.angle, 0, 1, 0);
            this.materials.surface.apply();
            super.display();
        } this.scene.popMatrix();
    }
}

class Airship extends CGFobject {
    constructor(scene){
        super(scene);
        this.initObjects();
    }
    initObjects(){
        this.airshipBody    = new AirshipBody(this.scene, 2, 0.4);
        this.airshipGondola = new AirshipGondola(this.scene, 0.25, 0.05, 0.08);
        this.upperRudder    = new AirshipControlSurface(this.scene, 0.3, 0.3);
        this.lowerRudder    = new AirshipControlSurface(this.scene, 0.3, 0.3);
        this.rightElevator  = new AirshipControlSurface(this.scene, 0.3, 0.3);
        this.leftElevator   = new AirshipControlSurface(this.scene, 0.3, 0.3);
    }
    setRudderAngle(angle){
        this.upperRudder.setAngle(-angle);
        this.lowerRudder.setAngle(+angle);
    }
    setElevatorAngle(angle){
        this.leftElevator .setAngle(-angle);
        this.rightElevator.setAngle(+angle);
    }
    setSpeed(vel){
        this.airshipGondola.setSpeed(vel);
    }
    display(){
        this.airshipBody.display();
        this.scene.pushMatrix();{
            this.scene.translate(0, -this.airshipBody.getRadius()-0.2*this.airshipGondola.getHeight(), 0);
            this.airshipGondola.display();
        } this.scene.popMatrix();
        this.scene.pushMatrix();{
            this.scene.translate(0,  0.08, -1);
            this.upperRudder.display();
        } this.scene.popMatrix();
        this.scene.pushMatrix();{
            this.scene.rotate(Math.PI, 0, 0, 1);
            this.scene.translate(0, 0.08, -1);
            this.lowerRudder.display();
        } this.scene.popMatrix();
        this.scene.pushMatrix();{
            this.scene.rotate(Math.PI/2, 0, 0, 1);
            this.scene.translate(0, 0.08, -1);
            this.rightElevator.display();
        } this.scene.popMatrix();
        this.scene.pushMatrix();{
            this.scene.rotate(-Math.PI/2, 0, 0, 1);
            this.scene.translate(0, 0.08, -1);
            this.leftElevator.display();
        } this.scene.popMatrix();
    }
}
