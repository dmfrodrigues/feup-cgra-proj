/**
 * MyUnitCubeQuad
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyCubeMap extends CGFobject {
	constructor(scene) {
        super(scene);
        this.scene = scene;
        this.Top = new MyQuad(this.scene);
        this.Bot = new MyQuad(this.scene);
        this.Lef = new MyQuad(this.scene);
        this.Rig = new MyQuad(this.scene);
        this.Fro = new MyQuad(this.scene);
        this.Bac = new MyQuad(this.scene);

        this.initMaterials();
    }
    initMaterials()
    {
        var topPath;
        var bottomPath;
        var leftPath;
        var rightPath;
        var frontPath;
        var backPath;
        var altMap = true;

        if (!altMap)
        {
            topPath    = 'images/split_cubemap/top.png';
            bottomPath = 'images/split_cubemap/bottom.png';
            leftPath   = 'images/split_cubemap/left.png';
            rightPath  = 'images/split_cubemap/right.png';
            frontPath  = 'images/split_cubemap/front.png';
            backPath   = 'images/split_cubemap/back.png';
        }
        else
        {
            topPath    = 'images/split_cubemap2/top.png';
            bottomPath = 'images/split_cubemap2/bottom.png';
            leftPath   = 'images/split_cubemap2/left.png';
            rightPath  = 'images/split_cubemap2/right.png';
            frontPath  = 'images/split_cubemap2/front.png';
            backPath   = 'images/split_cubemap2/back.png';
        }


        this.materials = {};

        this.materials.top = new CGFappearance(this.scene);
        this.materials.top.setAmbient(1, 1, 1, 1);
        this.materials.top.setDiffuse(0, 0, 0, 1);
        this.materials.top.setSpecular(0, 0, 0, 1);
        this.materials.top.setShininess(10.0);
        this.materials.top.loadTexture(topPath);
        this.materials.top.setTextureWrap('CLAMP_TO_EDGE','CLAMP_TO_EDGE');

        this.materials.right = new CGFappearance(this.scene);
        this.materials.right.setAmbient(1, 1, 1, 1);
        this.materials.right.setDiffuse(0, 0, 0, 1);
        this.materials.right.setSpecular(0, 0, 0, 1);
        this.materials.right.setShininess(10.0);
        this.materials.right.loadTexture(rightPath);
        this.materials.right.setTextureWrap('CLAMP_TO_EDGE','CLAMP_TO_EDGE');

        this.materials.left = new CGFappearance(this.scene);
        this.materials.left.setAmbient(1, 1, 1, 1);
        this.materials.left.setDiffuse(0, 0, 0, 1);
        this.materials.left.setSpecular(0, 0, 0, 1);
        this.materials.left.setShininess(10.0);
        this.materials.left.loadTexture(leftPath);
        this.materials.left.setTextureWrap('CLAMP_TO_EDGE','CLAMP_TO_EDGE');

        this.materials.back = new CGFappearance(this.scene);
        this.materials.back.setAmbient(1, 1, 1, 1);
        this.materials.back.setDiffuse(0, 0, 0, 1);
        this.materials.back.setSpecular(0, 0, 0, 1);
        this.materials.back.setShininess(10.0);
        this.materials.back.loadTexture(backPath);
        this.materials.back.setTextureWrap('CLAMP_TO_EDGE','CLAMP_TO_EDGE');

        this.materials.front = new CGFappearance(this.scene);
        this.materials.front.setAmbient(1, 1, 1, 1);
        this.materials.front.setDiffuse(0, 0, 0, 1);
        this.materials.front.setSpecular(0, 0, 0, 1);
        this.materials.front.setShininess(10.0);
        this.materials.front.loadTexture(frontPath);
        this.materials.front.setTextureWrap('CLAMP_TO_EDGE','CLAMP_TO_EDGE');

        this.materials.bottom = new CGFappearance(this.scene);
        this.materials.bottom.setAmbient(1, 1, 1, 1);
        this.materials.bottom.setDiffuse(0, 0, 0, 1);
        this.materials.bottom.setSpecular(0, 0, 0, 1);
        this.materials.bottom.setShininess(10.0);
        this.materials.bottom.loadTexture(bottomPath);
        this.materials.bottom.setTextureWrap('CLAMP_TO_EDGE','CLAMP_TO_EDGE');
    }
    display(){
        this.scene.scale(50,50,50);
        //Top
        this.scene.pushMatrix(); {
            this.scene.rotate(90*Math.PI/180,0,1,0);
            this.scene.translate(0,+0.5,0);
            this.scene.rotate(-90.0*Math.PI/180, 1, 0, 0);
            this.materials.top.apply();
            this.Top.display();
        } this.scene.popMatrix();
        //Bot
        this.scene.pushMatrix(); {
            this.scene.rotate(90*Math.PI/180,0,1,0);
            this.scene.translate(0,-0.5,0);
            this.scene.rotate(+90.0*Math.PI/180, 1, 0, 0);
            this.materials.bottom.apply();
            this.Bot.display();
        } this.scene.popMatrix();
        //Lef
        this.scene.pushMatrix(); {
            this.scene.translate(0,0,+0.5);
            this.materials.left.apply();
            this.Lef.display();
        } this.scene.popMatrix();
        //Rig
        this.scene.pushMatrix(); {
            this.scene.translate(0,0,-0.5);
            this.scene.rotate(+180.0*Math.PI/180, 0, 1, 0);
            this.materials.right.apply();
            this.Rig.display();
        } this.scene.popMatrix();
        //Fro
        this.scene.pushMatrix(); {
            this.scene.translate(+0.5, 0, 0);
            this.scene.rotate(+90.0*Math.PI/180, 0, 1, 0);
            this.materials.front.apply();
            this.Fro.display();
        } this.scene.popMatrix();
        //Bac
        this.scene.pushMatrix(); {
            this.scene.translate(-0.5, 0, 0);
            this.scene.rotate(-90.0*Math.PI/180, 0, 1, 0);
            this.materials.back.apply();
            this.Bac.display();
        } this.scene.popMatrix();  
    }
}
