/**
 * MyTerrain
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyTerrain extends CGFobject {
    constructor(scene){
        super(scene);
        this.scene = scene;
        this.plane = new MyPlane(this.scene,20);
    }
}