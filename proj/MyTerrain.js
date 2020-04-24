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
        this.heightMap = new CGFtexture(this.scene,"images/heightmap.jpg");
        
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
        this.heightMap.bind(1);
        this.shader.setUniformsValues({ uSampler: 0 });
        this.shader.setUniformsValues({ uSampler2: 1 });
    }
    display()
    {
        this.appearance.apply();
        this.scene.setActiveShader(this.shader);

        this.scene.pushMatrix();
        this.scene.scale(50,1,50);
        this.scene.rotate(-Math.PI/2,1,0,0);
        this.plane.display();
        this.scene.popMatrix();

        
    }
}
