class AirshipBody extends CGFobject {
    constructor(scene, length, radius) {
        super(scene);
        this.scene = scene;
        this.length = length;
        this.radius = radius;
        this.body = new MySphere(this.scene, 12, 50);
    }
    display() {
        this.scene.pushMatrix();{
            this.scene.scale(this.radius, this.radius, this.length/2);
            this.scene.rotate(90*Math.PI/180, 1, 0, 0);
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

        this.motor   = new MySphere(this.scene, slices, stacks);
        this.axis    = new MySphere(this.scene, slices, stacks);
        this.blade1  = new MySphere(this.scene, slices, stacks);
        this.blade2  = new MySphere(this.scene, slices, stacks);

        this.reset();
    }
    reset(){
        this.angle = 30*Math.PI/180;
    }
    display() {
        this.scene.pushMatrix();{
            this.scene.scale(this.radius/2, this.radius/2, this.length/2);
            this.scene.rotate(90*Math.PI/180, 1, 0, 0);
            this.motor.display();
        }this.scene.popMatrix();
        this.scene.pushMatrix();{
            this.scene.rotate(this.angle, 0, 0, 1);
            this.scene.pushMatrix();{
                this.scene.translate(0, 0, -this.length/2);
                this.scene.scale(0.3*this.radius, 0.3*this.radius, 0.15*this.radius);
                this.scene.rotate(90*Math.PI/180, 1, 0, 0);
                this.axis.display();
            }this.scene.popMatrix();
            this.scene.pushMatrix();{
                this.scene.translate(0, 0.4*this.radius, -this.length/2);
                this.scene.scale(0.13*this.radius, 0.6*this.radius, 0.07*this.radius);
                this.blade1.display();
            }this.scene.popMatrix();
            this.scene.pushMatrix();{
                this.scene.translate(0, -0.4*this.radius, -this.length/2);
                this.scene.scale(0.11*this.radius, 0.6*this.radius, 0.05*this.radius);
                this.blade2.display();
            }this.scene.popMatrix();
        }this.scene.popMatrix();
    }
    getRadius(){ return this.radius; }
}

class AirshipGondola extends CGFobject {
    constructor(scene, length, radius) {
        super(scene);
        this.scene = scene;
        this.length = length;
        this.radius = radius;

        const slices = 20;
        const stacks = 20;

        this.gondola = new MyCylinder(this.scene, slices);
        this.sphere  = new MySphere(this.scene, slices, stacks);
        this.motor   = new AirshipMotor(this.scene, 2*this.radius, 0.7*this.radius);
    }
    display() {
        this.scene.pushMatrix();{
            this.scene.scale(this.radius, this.radius, this.length);
            this.scene.rotate(90*Math.PI/180, 1, 0, 0);
            this.scene.translate(0, -0.5, 0);
            this.gondola.display();
        }this.scene.popMatrix();
        this.scene.pushMatrix();{
            this.scene.translate(0, 0, this.length/2);
            this.scene.scale(this.radius, this.radius, this.radius);
            this.scene.rotate(90*Math.PI/180, 1, 0, 0);
            this.sphere.display();
        }this.scene.popMatrix();
        this.scene.pushMatrix();{
            this.scene.translate(0, 0, -this.length/2);
            this.scene.scale(this.radius, this.radius, this.radius);
            this.scene.rotate(90*Math.PI/180, 1, 0, 0);
            this.sphere.display();
        }this.scene.popMatrix();
        this.scene.pushMatrix();{
            this.scene.translate(this.radius, 0, -0.5*this.length-0.1*this.motor.getRadius());
            this.motor.display();
        }this.scene.popMatrix();
        this.scene.pushMatrix();{
            this.scene.translate(-this.radius, 0, -0.5*this.length-0.1*this.motor.getRadius());
            this.motor.display();
        }this.scene.popMatrix();
    }
    getRadius(){
        return this.radius;
    }
}

class Airship extends CGFobject {
    constructor(scene){
        super(scene);
        this.airshipBody = new AirshipBody(this.scene, 2, 0.5);
        this.airshipGondola = new AirshipGondola(this.scene, 0.4, 0.07);
    }
    display(){
        this.airshipBody.display();
        this.scene.pushMatrix();{
            this.scene.translate(0, -this.airshipBody.getRadius()-0.35*this.airshipGondola.getRadius(), 0);
            this.airshipGondola.display();
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
        this.airship = new Airship(this.scene);
    }
    setSpeedFactor(speedFactor){
        this.speedFactor = speedFactor;
    }
    setScaleFactor(scaleFactor){
        this.scaleFactor = scaleFactor;
    }
    display() {
        this.scene.pushMatrix();{
            this.scene.translate(this.pos.x, this.pos.y, this.pos.z);
            this.scene.rotate(this.angle, 0, 1, 0);
            
            this.scene.scale(this.scaleFactor, this.scaleFactor, this.scaleFactor);

            this.airship.display();
        }this.scene.popMatrix();
    }
    update(){
        let dr = {
            x: this.vel * this.speedFactor * Math.sin(this.angle),
            y: 0,
            z: this.vel * this.speedFactor * Math.cos(this.angle)
        };
        this.pos.x += dr.x;
        this.pos.y += dr.y;
        this.pos.z += dr.z;
    }
    turn(val){
        this.angle += val;
    }
    accelerate(val){
        this.vel += val;
    }
    reset(){
        this.angle = 0;
        this.pos   = {x: 0, y: 0, z: 0};
        this.vel   = 0;
        this.speedFactor = 1.0;
        this.scaleFactor = 1.0;
    }
}
