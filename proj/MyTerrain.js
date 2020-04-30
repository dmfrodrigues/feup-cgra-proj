/**
 * MyTerrain
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyTerrain extends CGFobject {
    constructor(scene){
        super(scene);
        this.scene = scene;
        this.plane = new MyPlane(this.scene,20,0,1,0,1);
        this.shader = new CGFshader(this.scene.gl, "shaders/terrain.vert", "shaders/terrain.frag");
        
        this.terrainTexture = new CGFtexture(this.scene,"images/terrain.jpg");
        this.heightMap = new CGFtexture(this.scene,"images/heightmap2.jpg");
        
        this.appearance = new CGFappearance(this.scene);
        this.appearance.setAmbient(0.3, 0.3, 0.3, 1);
		this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
		this.appearance.setSpecular(0.0, 0.0, 0.0, 1);
        this.appearance.setShininess(120);
        this.appearance.setTexture(this.terrainTexture);
        this.appearance.setTextureWrap('REPEAT','REPEAT');
        
        this.init();
    }
    init()
    {
        this.terrainTexture.bind(0);
        
        this.shader.setUniformsValues({ uSampler: 0 });
        this.shader.setUniformsValues({ uSampler2: 1 });
    }
    display()
    {   
        
        this.scene.setActiveShader(this.shader);
        this.appearance.apply();
        this.heightMap.bind(1);

        this.scene.pushMatrix();
        this.scene.scale(50,8,50);
        this.scene.rotate(-Math.PI/2,1,0,0);
        this.plane.display();
        this.scene.popMatrix();

        
    }
}
