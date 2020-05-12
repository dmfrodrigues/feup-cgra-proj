class MyBillboard extends CGFobject
{
    constructor(scene)
    {
        super(scene);
        
        this.base = new MyPlane(scene,20,0,1,0,1,true);
        this.leg  = new MyPlane(scene,20,0,1,0,1,true);

        this.initTextures();        
    }
    initTextures()
    {
        this.legTexture = new CGFtexture(this.scene,"images/billboard/leg.png");

        this.legAppear = new CGFappearance(this.scene);
        this.legAppear.setAmbient(0.3, 0.3, 0.3, 1);
		this.legAppear.setDiffuse(0.7, 0.7, 0.7, 1);
		this.legAppear.setSpecular(0.0, 0.0, 0.0, 1);
        this.legAppear.setShininess(120);
        this.legAppear.setTexture(this.legTexture);
        this.legAppear.setTextureWrap('REPEAT','REPEAT');

        this.baseTexture = new CGFtexture(this.scene,"images/billboard/base.png");
    
        this.baseAppear = new CGFappearance(this.scene);
        this.baseAppear.setAmbient(0.3, 0.3, 0.3, 1);
		this.baseAppear.setDiffuse(0.7, 0.7, 0.7, 1);
		this.baseAppear.setSpecular(0.0, 0.0, 0.0, 1);
        this.baseAppear.setShininess(120);
        this.baseAppear.setTexture(this.baseTexture);
        this.baseAppear.setTextureWrap('REPEAT','REPEAT');
    }
    display()
    {
        this.scene.pushMatrix();
        {
            this.scene.translate(0,0,-10);
            this.scene.pushMatrix();
            {
                
                this.scene.translate(0,1.5,0);
                this.scene.scale(2,1,1);
                this.baseAppear.apply();
                this.base.display();
            }
            this.scene.popMatrix();
            this.scene.pushMatrix();
            {
                this.scene.translate(0.9,0.5,0);
                this.scene.scale(0.2,1,1);
                this.legAppear.apply();
                this.leg.display();
                this.scene.translate(-9,0,0);
                this.legAppear.apply();
                this.leg.display();
            }
            this.scene.popMatrix();
        }
       this.scene.popMatrix();
    }
}