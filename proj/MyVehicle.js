class AirshipBody extends CGFobject {
    constructor(scene, length, radius) {
        super(scene);
        this.scene = scene;
        this.length = length;
        this.radius = radius;
        this.body = new MySphere(this.scene, 12, 50);

        this.bodyPath = 'images/airship-body.png';

        this.materials = {};
        this.materials.body = new CGFappearance(this.scene);
        this.materials.body.setAmbient(0.8, 0.8, 0.8, 1);
        this.materials.body.setDiffuse(0.7, 0.7, 0.7, 1);
        this.materials.body.setSpecular(0.1, 0.1, 0.1, 1);
        this.materials.body.setShininess(2.0);
        this.materials.body.loadTexture(this.bodyPath);
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

        const slices = 10;
        const stacks = 10;

        const bladeStacks = 20;

        this.motor   = new MySphere(this.scene, 30, 10);
        this.axis    = new MySphere(this.scene, 30, 10);
        this.blade1  = new MySphere(this.scene, 10, 10);
        this.blade2  = new MySphere(this.scene, 10, 10);

        this.metalPath = 'images/blades_texture.png';
        
        this.materials = {};
        
        this.materials.metal1 = new CGFappearance(this.scene);
        this.materials.metal1.setAmbient(1, 1, 1, 1);
        this.materials.metal1.setDiffuse(0.1, 0.1, 0.1, 1);
        this.materials.metal1.setSpecular(0.6, 0.6, 0.6, 1);
        this.materials.metal1.setShininess(10.0);
        this.materials.metal1.loadTexture(this.metalPath);
        this.materials.metal1.setTextureWrap('CLAMP_TO_EDGE','CLAMP_TO_EDGE');

        this.materials.metal2 = new CGFappearance(this.scene);
        this.materials.metal2.setAmbient(0.3, 0.3, 0.3, 1);
        this.materials.metal2.setDiffuse(0.1, 0.1, 0.1, 1);
        this.materials.metal2.setSpecular(0.3, 0.3, 0.3, 1);
        this.materials.metal2.setShininess(4.0);
        this.materials.metal2.loadTexture(this.metalPath);
        this.materials.metal2.setTextureWrap('CLAMP_TO_EDGE','CLAMP_TO_EDGE');

        this.materials.engine = new CGFappearance(this.scene);
        this.materials.engine.setAmbient(0.8, 0.8, 0.8, 1);
        this.materials.engine.setDiffuse(0.7, 0.7, 0.7, 1);
        this.materials.engine.setSpecular(0.1, 0.1, 0.1, 1);
        
        this.reset();

        this.update_prevtime = 0;
    }
    reset(){
        this.angle = 0;
        this.angle_speed = 0;
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

        const slices = 20;

        //Front, botfront
        //pivot
        this.vertices.push(0, 0, this.length/2); this.normals.push(0, -1, 0); this.texCoords.push(5/12, 1.5/2);

        let i = 0;
        let phi = Math.PI*i/slices;
        let x   = this.radius*Math.cos(phi);
        let z   = this.radius*Math.sin(phi);
        this.vertices.push(x, 0          , z+this.length/2); this.normals.push(x, 0, z); this.texCoords.push((6-i/slices)/12, 1/2);
        this.vertices.push(x, this.height, z+this.length/2); this.normals.push(x, 0, z); this.texCoords.push((6-i/slices)/12, 0);
        this.vertices.push(x, 0          , z+this.length/2); this.normals.push(0, -1, 0); this.texCoords.push((5+0.5*z/this.radius)/12, (1.5+0.5*x/this.radius)/2);
        for(i = 1; i <= slices; ++i){
            phi = Math.PI*i/slices;
            x   = this.radius*Math.cos(phi);
            z   = this.radius*Math.sin(phi);
            this.vertices.push(x, 0          , z+this.length/2); this.normals.push(x, 0, z); this.texCoords.push((6-i/slices)/12, 1/2);
            this.vertices.push(x, this.height, z+this.length/2); this.normals.push(x, 0, z); this.texCoords.push((6-i/slices)/12, 0);
            this.vertices.push(x, 0          , z+this.length/2); this.normals.push(0, -1, 0); this.texCoords.push((5+0.5*z/this.radius)/12, (1.5+0.5*x/this.radius)/2);
            this.indices.push(1+3*i-3, 1+3*i-2, 1+3*i);
            this.indices.push(1+3*i-2, 1+3*i+1, 1+3*i);
            this.indices.push(1+3*i-1, 1+3*i+2, 0);
        }
        console.log(this.vertices);
        console.log(this.indices);
        //Left
        this.vertices.push(this.radius, 0          , +this.length/2); this.normals.push(1, 0, 0); this.texCoords.push(6/12, 1/2);
        this.vertices.push(this.radius, this.height, +this.length/2); this.normals.push(1, 0, 0); this.texCoords.push(6/12, 0);
        this.vertices.push(this.radius, 0          , -this.length/2); this.normals.push(1, 0, 0); this.texCoords.push(11/12, 1/2);
        this.vertices.push(this.radius, this.height, -this.length/2); this.normals.push(1, 0, 0); this.texCoords.push(11/12, 0);
        let N = this.vertices.length/3;
        this.indices.push(N-1, N-3, N-4);
        this.indices.push(N-4, N-2, N-1);
        //Right
        this.vertices.push(-this.radius, 0          , +this.length/2); this.normals.push(-1, 0, 0); this.texCoords.push(5/12, 1/2);
        this.vertices.push(-this.radius, this.height, +this.length/2); this.normals.push(-1, 0, 0); this.texCoords.push(5/12, 0);
        this.vertices.push(-this.radius, 0          , -this.length/2); this.normals.push(-1, 0, 0); this.texCoords.push(0, 1/2);
        this.vertices.push(-this.radius, this.height, -this.length/2); this.normals.push(-1, 0, 0); this.texCoords.push(0, 0);
        N = this.vertices.length/3;
        this.indices.push(N-3, N-1, N-2);
        this.indices.push(N-2, N-4, N-3);
        //Back
        this.vertices.push(+this.radius, 0          , -this.length/2); this.normals.push(0, 0, -1); this.texCoords.push(11/12, 1/2);
        this.vertices.push(+this.radius, this.height, -this.length/2); this.normals.push(0, 0, -1); this.texCoords.push(11/12, 0);
        this.vertices.push(-this.radius, 0          , -this.length/2); this.normals.push(0, 0, -1); this.texCoords.push(1, 1/2);
        this.vertices.push(-this.radius, this.height, -this.length/2); this.normals.push(0, 0, -1); this.texCoords.push(1, 0);
        N = this.vertices.length/3;
        this.indices.push(N-1, N-3, N-4);
        this.indices.push(N-4, N-2, N-1);
        //Bottom
        this.vertices.push(+this.radius, 0, -this.length/2); this.normals.push(0, -1, 0); this.texCoords.push(0, 2/2);
        this.vertices.push(-this.radius, 0, -this.length/2); this.normals.push(0, -1, 0); this.texCoords.push(0, 1/2);
        this.vertices.push(+this.radius, 0, +this.length/2); this.normals.push(0, -1, 0); this.texCoords.push(5/12, 2/2);
        this.vertices.push(-this.radius, 0, +this.length/2); this.normals.push(0, -1, 0); this.texCoords.push(5/12, 1/2);
        N = this.vertices.length/3;
        this.indices.push(N-1, N-3, N-4);
        this.indices.push(N-4, N-2, N-1);

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
    initMaterials(){
        this.paths = {
            gondola: 'images/gondola.png'
        };
        this.materials = {};
        this.materials.gondola = new CGFappearance(this.scene);
        this.materials.gondola.loadTexture(this.paths.gondola);
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

        const slices = 20;
        const stacks = 20;

        this.gondola = new Gondola(this.scene, this.length, this.radius, this.height);
        this.sphere  = new MySphere(this.scene, slices, stacks);
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

class AirshipRudder extends CGFobject {
    constructor(scene, yscale, zscale){
        super(scene);
        this.scene = scene;
        this.yscale = yscale;
        this.zscale = zscale;
        this.reset();
        this.initBuffers();
    }
    initBuffers(){
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.vertices.push(0, 0*this.yscale,  0*this.zscale); this.normals.push(1, 0, 0);
        this.vertices.push(0, 0*this.yscale, -1*this.zscale); this.normals.push(1, 0, 0);
        this.vertices.push(0, 1*this.yscale, -1*this.zscale); this.normals.push(1, 0, 0);
        this.vertices.push(0, 1*this.yscale,  0*this.zscale); this.normals.push(1, 0, 0);
        this.vertices.push(0, 0*this.yscale,  2*this.zscale); this.normals.push(1, 0, 0);
        this.indices.push(0, 1, 2);
        this.indices.push(2, 3, 0);
        this.indices.push(0, 3, 4);
        this.vertices.push(0, 0*this.yscale,  0*this.zscale); this.normals.push(-1, 0, 0);
        this.vertices.push(0, 0*this.yscale, -1*this.zscale); this.normals.push(-1, 0, 0);
        this.vertices.push(0, 1*this.yscale, -1*this.zscale); this.normals.push(-1, 0, 0);
        this.vertices.push(0, 1*this.yscale,  0*this.zscale); this.normals.push(-1, 0, 0);
        this.vertices.push(0, 0*this.yscale,  2*this.zscale); this.normals.push(-1, 0, 0);
        this.indices.push(7, 6, 5);
        this.indices.push(5, 8, 7);
        this.indices.push(9, 8, 5);
        

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
    reset(){
        this.angle = 0;
    }
    setAngle(angle){
        this.angle = angle;
    }
    display(){
        this.scene.pushMatrix(); {
            this.scene.rotate(this.angle, 0, 1, 0);
            super.display();
        } this.scene.popMatrix();
    }
}

class Airship extends CGFobject {
    constructor(scene){
        super(scene);
        this.airshipBody = new AirshipBody(this.scene, 2, 0.4);
        this.airshipGondola = new AirshipGondola(this.scene, 0.25, 0.05, 0.08);
        this.upperRudder = new AirshipRudder(this.scene, 0.3, 0.3);
        this.lowerRudder = new AirshipRudder(this.scene, 0.3, 0.3);
        this.rightRudder = new AirshipRudder(this.scene, 0.3, 0.3);
        this.leftRudder  = new AirshipRudder(this.scene, 0.3, 0.3);
    }
    setTurnAngle(angle){
        this.upperRudder.setAngle(-angle*10);
        this.lowerRudder.setAngle(+angle*10);
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
            this.rightRudder.display();
        } this.scene.popMatrix();
        this.scene.pushMatrix();{
            this.scene.rotate(-Math.PI/2, 0, 0, 1);
            this.scene.translate(0, 0.08, -1);
            this.leftRudder.display();
        } this.scene.popMatrix();
    }
}

/**
* MyVehicle
* @constructor
*/
class MyVehicle extends CGFobject {
    constructor(scene) {
        super(scene);
        this.scene = scene;
        this.reset();
        this.update_prevtime = [];
        this.airship = new Airship(this.scene);
    }
    reset(){
        this.dir = {
            az: {
                theta: 0,
                curvature: 0
            }
        };
        this.pos   = {
            x: 0,
            y: 10,
            z: 0,
            v: 0,
            a: 0
        };
        this.speedFactor = 1.0;
        this.scaleFactor = 1.0;
    }
    // Setters
    setSpeedFactor(speedFactor){ this.speedFactor = speedFactor; }
    setScaleFactor(scaleFactor){ this.scaleFactor = scaleFactor; }
    setAzimuthCurvature(k){ this.dir.az.curvature = k; this.airship.setTurnAngle(this.dir.az.curvature/30); }
    turn(val){ this.setAzimuthCurvature(val); }
    setSpeed(speed){ this.pos.v = speed; this.airship.setSpeed(this.getRealSpeed()); }
    setAcceleration(a){ this.pos.a = a; }
    accelerate(val){ this.setAcceleration(val); }
    // Getters
    getRealSpeed(){ return this.pos.v * this.speedFactor; }
    // Other functions
    update(){
        /* Time */
        let t, dt; {
            t = Date.now()/1000;
            if(this.update_prevtime == []) this.update_prevtime = t;
            dt = t - this.update_prevtime;
        }
        /* Speed update */ {
            this.setSpeed(this.pos.v + this.pos.a * dt);
        }
        /* Azimuth update */ {
            this.dir.az.theta += this.pos.v * this.dir.az.curvature * dt;
        }
        /* Position update */ {
                let dr = {
                x: this.getRealSpeed() * Math.sin(this.dir.az.theta) * dt,
                y: 0,
                z: this.getRealSpeed() * Math.cos(this.dir.az.theta) * dt
            };
            this.pos.x += dr.x;
            this.pos.y += dr.y;
            this.pos.z += dr.z;
        }
        /* Update previous time */
        this.update_prevtime = t;
    }
    display() {
        this.scene.pushMatrix();{
            this.scene.translate(this.pos.x, this.pos.y, this.pos.z);
            this.scene.rotate(this.dir.az.theta, 0, 1, 0);
            
            this.scene.scale(this.scaleFactor, this.scaleFactor, this.scaleFactor);

            this.airship.display();
        }this.scene.popMatrix();
    }
}
