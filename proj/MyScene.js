/**
* MyScene
* @constructor
*/
class MyScene extends CGFscene {
    constructor() {
        super();
    }
    init(application) {
        super.init(application);
        this.initCameras();
        this.initLights();

        //Background color
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.setUpdatePeriod(50);
        
        this.enableTextures(true);

        //Initialize scene objects
        this.axis = new CGFaxis(this);
        this.incompleteSphere = new MySphere(this, 16, 8);
        this.cylinder = new MyCylinder(this, 50);
        this.vehicle = new MyVehicle(this);
        this.sphere = new MySphere(this,50,25);
        this.cubeMap = new MyCubeMap(this);
        this.terrain = new MyTerrain(this);

        //Objects connected to MyInterface
        this.displayAxis    = true;
        this.displayCylinder = false;
        this.displaySphere  = false;
        this.displayVehicle = true;
        this.displayCubeMap = true;
        this.displayTerrain = true;
        this.speedFactor    = 1.0;
        this.scaleFactor    = 1.0;

        //Textures
        this.mapMaterial = new CGFappearance(this);
        this.mapMaterial.loadTexture('images/earth.jpg');
        this.mapMaterial.setTextureWrap('REPEAT','REPEAT');

        //Cube Map Textures and related variables
        this.selectedTexture = 0;
        this.textureIds = {'Forest': 0, 'Desert': 1};

        //Speed, angle
        this.ACCELERATION = 0.5;
        this.CURVATURE = 0.5;
    }
    initLights() {
        this.setGlobalAmbientLight(0.5, 0.5, 0.5, 1.0);

        this.lights[0].setPosition(15, 2, 5, 1);
        this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
        this.lights[0].enable();
        this.lights[0].update();
    }
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(40, 60, 40), vec3.fromValues(0, 0, 0));
    }
    setDefaultAppearance() {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);
    }
    onSpeedFactorChange(v){
        this.vehicle.setSpeedFactor(this.speedFactor);
    }
    onScaleFactorChange(v){
        this.vehicle.setScaleFactor(this.scaleFactor);
    }
    // called periodically (as per setUpdatePeriod() in init())
    update(t){
        this.vehicle.update();
        this.checkKeys();
    }
    //called when user interacts with the cube map texture dropdown
    updateCubeMapTexture()
    {
        this.cubeMap.updateTexture(this);
    }
    display() {
        // ---- BEGIN Background, camera and axis setup
        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();
        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();
        
        // Draw axis
        if (this.displayAxis)
            this.axis.display();

        this.setDefaultAppearance();

        // ---- BEGIN Primitive drawing section

        //This sphere does not have defined texture coordinates
        //this.incompleteSphere.display();

        if(this.displayCylinder){
            this.mapMaterial.apply();
            this.cylinder.display();
        }
            
        if (this.displayVehicle) this.vehicle.display();

        if (this.displayCubeMap) this.cubeMap.display();
        
        if (this.displaySphere) 
        {
            this.mapMaterial.apply();
            this.sphere.display();
        }
        if (this.displayTerrain) this.terrain.display();
        
        this.setActiveShader(this.defaultShader);

        // ---- END Primitive drawing section
    }
    checkKeys(){
        //Check for key codes e.g. in https://keycode.info/
        /* Accelerate */{
            let accel = 0;
            if (this.gui.isKeyPressed("KeyW")) accel += this.ACCELERATION;
            if (this.gui.isKeyPressed("KeyS")) accel -= this.ACCELERATION;
            this.vehicle.accelerate(accel)
        }
        /* Angle */{
            let angle = 0;
            if(this.gui.isKeyPressed("KeyA")) angle += this.CURVATURE;
            if(this.gui.isKeyPressed("KeyD")) angle -= this.CURVATURE;
            this.vehicle.turn(angle);
        }
        // Reset
        if(this.gui.isKeyPressed("KeyR")){
            this.vehicle.reset();
            this.speedFactor = 1.0;
            this.scaleFactor = 1.0;
        }
    }
}