/**
* MyVehicle
* @constructor
*/
class MyVehicle extends CGFobject {
    constructor(scene) {
        super(scene);
        this.scene = scene;
        this.pyramid = new MyPyramid(this.scene, 4, 2);
    }
    display() {
        this.scene.pushMatrix();{
            this.scene.scale(1, 1, 2);
            this.scene.rotate(90*Math.PI/180, 1, 0, 0);
            this.scene.translate(0, -0.5, 0);
            this.pyramid.display();
        }this.scene.popMatrix();
    }
}
