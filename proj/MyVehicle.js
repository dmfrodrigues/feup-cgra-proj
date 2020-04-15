/**
* MyVehicle
* @constructor
*/
class MyVehicle extends CGFobject {
    constructor(scene) {
        super(scene);
        this.scene = scene;
        this.reset();
        this.pyramid = new MyPyramid(this.scene, 4, 2);
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

            this.scene.scale(1, 1, 2);
            this.scene.rotate(90*Math.PI/180, 1, 0, 0);
            this.scene.translate(0, -0.5, 0);
            this.pyramid.display();
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
