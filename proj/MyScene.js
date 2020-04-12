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

        //Objects connected to MyInterface
        this.displayAxis    = true;
        this.displaySphere  = false;
        this.displayVehicle = false;
        this.displayCubeMap = true;

        //Textures
        this.mapMaterial = new CGFappearance(this);
        this.mapMaterial.loadTexture('images/earth.jpg');
        this.mapMaterial.setTextureWrap('REPEAT','REPEAT');

        //Speed, angle
        this.vel_inc = 0.01;
        this.angle_inc = Math.PI/36;
    }
    initLights() {
        this.lights[0].setPosition(15, 2, 5, 1);
        this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
        this.lights[0].enable();
        this.lights[0].update();
    }
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
    }
    setDefaultAppearance() {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);
    }
    // called periodically (as per setUpdatePeriod() in init())
    update(t){
        //To be done...
        this.checkKeys();
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

        if (this.displayVehicle) this.vehicle.display();
        this.vehicle.update();
        if (this.displayCubeMap) this.cubeMap.display();
        if (this.displaySphere) 
        {
            this.mapMaterial.apply();
            this.sphere.display();
        } 

        // ---- END Primitive drawing section
    }
    checkKeys(){
        var text="Keys pressed: ";
        var keysPressed=false;

        //Check for key codes e.g. in https://keycode.info/
        if (this.gui.isKeyPressed("KeyW")){
            text+=" W ";
            keysPressed=true;
            this.vehicle.accelerate(this.vel_inc);
        }
        if (this.gui.isKeyPressed("KeyS")){
            text+=" S ";
            keysPressed=true;
            this.vehicle.accelerate(-this.vel_inc);
        }
        if(this.gui.isKeyPressed("KeyA")){
            this.vehicle.turn(this.angle_inc);
        }
        if(this.gui.isKeyPressed("KeyD")){
            this.vehicle.turn(-this.angle_inc);
        }
        if(this.gui.isKeyPressed("KeyR")){
            this.vehicle.reset();
        }
       if (keysPressed) console.log(text);
    }
}