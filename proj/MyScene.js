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

        this.setUpdatePeriod(20);
        
        this.enableTextures(true);

        //Initialize scene objects
        this.axis = new CGFaxis(this);
        this.incompleteSphere = new MySphere(this, 16, 8);
        this.cylinder = new MyCylinder(this, 50);
        this.vehicle = new MyVehicle(this);
        this.sphere = new MySphere(this,50,25);
        this.cubeMap = new MyCubeMap(this);
        this.terrain = new MyTerrain(this);
        this.supplies = [];
        this.NUMBER_SUPPLIES = 5;
        this.nSuppliesDelivered = 0;
        for(let i = 0; i < this.NUMBER_SUPPLIES; ++i){
            this.supplies.push(new MySupply(this, 0.5));
        }

    
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
        this.CURVATURE = 0.2;
        this.autopilot = {
            active: false,
            RADIUS: 5,
            TIME: 5
        }
        this.autopilot.CURVATURE = 1/this.autopilot.RADIUS;
        this.autopilot.SPEED = 2*Math.PI*this.autopilot.RADIUS/this.autopilot.TIME;

        // Reset
        this.reset();
    }
    initLights() {
        this.setGlobalAmbientLight(0.5, 0.5, 0.5, 1.0);

        this.lights[0].setPosition(15, 2, 5, 1);
        this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
        this.lights[0].enable();
        this.lights[0].update();
    }
    initCameras() {
        this.current_camera_state = 0;
        this.cameras = [
            new CGFcamera(0.4, 0.1, 500, vec3.fromValues(25, 35, 25), vec3.fromValues(0, 0, 0)),
            new CGFcamera(0.4, 0.1, 500, vec3.fromValues(25, 35, 25), vec3.fromValues(0, 0, 0)),
            new CGFcamera(0.4, 0.1, 500, vec3.fromValues(25, 35, 25), vec3.fromValues(0, 0, 0))
        ]
        this.camera = this.cameras[this.current_camera_state];
    }
    setDefaultAppearance() {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);
    }
    reset(){
        this.autopilot.active = false;
        this.vehicle.reset();
        this.speedFactor = 1.0;
        this.scaleFactor = 1.0;

        this.L_pressed = false;
        this.isCHeld = false;

        for(let s of this.supplies) s.reset();
        this.nSuppliesDelivered = 0;
    }
    onSpeedFactorChange(v){
        this.vehicle.setSpeedFactor(this.speedFactor);
    }
    onScaleFactorChange(v){
        this.vehicle.setScaleFactor(this.scaleFactor);
    }
    // called periodically (as per setUpdatePeriod() in init())
    update(t){
        if(this.autopilot.active) this.vehicle.setSpeed(this.autopilot.SPEED);
        this.vehicle.update(t);
        
        for(let s of this.supplies) s.update(t);
        this.checkKeys();
        
        this.cameras[1].setPosition(this.vehicle.getAboveCameraPos());
        this.cameras[1].setTarget(this.vehicle.getCameraTarget());

        this.cameras[2].setPosition(this.vehicle.getBehindCameraPos());
        this.cameras[2].setTarget(this.vehicle.getCameraTarget());

        //Setting time factor for flag movement
        this.vehicle.flagShader.setUniformsValues({timeFactor: t/100 % 1000});
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

        for(let s of this.supplies) s.display();
            
        if (this.displayVehicle) this.vehicle.display();
        this.setActiveShader(this.defaultShader);
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
        // Activate autopilot
        if(this.gui.isKeyPressed("KeyP")){
            this.autopilot.active = true;
            this.vehicle.setAzimuthCurvature(this.autopilot.CURVATURE);
            this.vehicle.setElevationCurvature(0);
            this.vehicle.level();
        }
        // Not autopilot
        if(!this.autopilot.active){
            /* Accelerate */{   
                let accel = 0;
                if (this.gui.isKeyPressed("KeyW")) accel += this.ACCELERATION;
                if (this.gui.isKeyPressed("KeyS")) accel -= this.ACCELERATION;
                this.vehicle.accelerate(accel)
            }
            /* Azimuth angle */{
                let angle = 0;
                if(this.gui.isKeyPressed("KeyA")) angle += this.CURVATURE;
                if(this.gui.isKeyPressed("KeyD")) angle -= this.CURVATURE;
                this.vehicle.turn(angle);
            }
            /* Elevation angle */{
                let angle = 0;
                if(this.gui.isKeyPressed("ArrowUp")) angle += this.CURVATURE;
                if(this.gui.isKeyPressed("ArrowDown")) angle -= this.CURVATURE;
                this.vehicle.elevate(angle);
            }
        }
        // Launch supplies
        if(!this.L_pressed && this.gui.isKeyPressed("KeyL")){
            this.L_pressed = true;
        }
        if(this.L_pressed && !this.gui.isKeyPressed("KeyL")){
            this.L_pressed = false;
            if(this.nSuppliesDelivered < this.NUMBER_SUPPLIES){
                this.supplies[this.nSuppliesDelivered].drop(this.vehicle.getDropPos(), this.vehicle.getSpeedVector());
                this.nSuppliesDelivered++;
            }
        }
        // Change camera
        if(!this.isCHeld && this.gui.isKeyPressed("KeyC")){
            this.isCHeld = true;
        }
        if(this.isCHeld && !this.gui.isKeyPressed("KeyC")){
            this.isCHeld = false;
            this.current_camera_state = (this.current_camera_state+1)%this.cameras.length;
            this.camera = this.cameras[this.current_camera_state];
        }
        // Reset
        if(this.gui.isKeyPressed("KeyR")){
            this.reset();
        }
    }
}