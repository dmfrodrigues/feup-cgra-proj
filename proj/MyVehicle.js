/**
* MyVehicle
* @constructor
*/
class MyVehicle extends CGFobject {
    constructor(scene) {
        super(scene);
        this.PHYSICS = {
            DRAG_COEFFICIENT: 0.1
        }
        this.scene = scene;
        this.dir = {
            az: {
                theta: 0,
                sin: 0,
                cos: 1,
                curvature: 0
            },
            el: {
                theta: 0,
                sin: 0,
                cos: 1,
                curvature: 0,
                MAX_THETA: 20*Math.PI/180
            }
        };
        this.vehicle = new Airship(this.scene);
        this.shader_LinearMeasure = 0;
        this.reset();
    }
    reset(){
        this.setAzimuth(0);
        this.setAzimuthCurvature(0);
        this.setElevation(0);
        this.setElevationCurvature(0);
        this.pos = vec3.fromValues(0, 10, 0);
        this.v = 0;
        this.a = 0;
        this.speedFactor = 1.0;
        this.scaleFactor = 1.0;
    }
    // Setters
    setSpeedFactor(speedFactor){ this.speedFactor = speedFactor; }
    setScaleFactor(scaleFactor){ this.scaleFactor = scaleFactor; }
    setAzimuth           (k){
        if(this.dir.az.theta != k){
            this.dir.az.theta   = k;
            this.dir.az.sin     = Math.sin(k);
            this.dir.az.cos     = Math.cos(k);
        }
    }
    setAzimuthCurvature  (k){ this.dir.az.curvature = k; this.vehicle.setRudderAngle(this.dir.az.curvature/2); }
    setElevation         (k){
        if(this.dir.el.theta != k){
            this.dir.el.theta   = k;
            this.dir.el.sin     = Math.sin(k);
            this.dir.el.cos     = Math.cos(k);
        }
    }
    setElevationCurvature(k){
        this.dir.el.curvature = k;
        this.vehicle.setElevatorAngle(-this.dir.el.curvature/2);
    }
    turn(val){ this.setAzimuthCurvature(val); }
    elevate(val){ this.setElevationCurvature(val); }
    setSpeed(speed){ this.v = speed; this.vehicle.setSpeed(this.getRealSpeed()); }
    level(){ this.setElevation(0); }
    setAcceleration(a){ this.a = a; }
    accelerate(val){ this.setAcceleration(val); }
    // Getters
    getRealSpeed(){ return this.v * this.speedFactor; }
    getDropPos(){
        let ret = vec3.fromValues(0, -1, 0);
        return vec3.add(ret, this.pos, ret);
    }
    getAboveCameraPos(){
        let ret = vec3.fromValues(
            -20*this.dir.az.sin,
            +6,
            -20*this.dir.az.cos
        );
        return vec3.add(ret, this.pos, ret);
    }
    getBehindCameraPos(){
        let ret = vec3.fromValues(
            -6 * this.dir.el.cos * this.dir.az.sin,
            -6 * this.dir.el.sin,
            -6 * this.dir.el.cos * this.dir.az.cos
        );
        return vec3.add(ret, this.pos, ret);
    }
    getCameraTarget(){
        return vec3.clone(this.pos);
    }
    getSpeedVector(){
        let v = this.getRealSpeed();
        let ret = vec3.fromValues(
            this.dir.el.cos * this.dir.az.sin,
            this.dir.el.sin,
            this.dir.el.cos * this.dir.az.cos
        );
        return vec3.scale(ret, ret, v);
    }
    // Other functions
    update(t){
        /* Pass t from milliseconds to seconds */
        t /= 1000;
        /* Time */
        let dt; {
            if(typeof this.update.prevtime == 'undefined') this.update.prevtime = t;
            dt = t - this.update.prevtime;
            this.update.prevtime = t;
        }
        /* Speed update */ {
            this.setSpeed(this.v + this.a * dt);
            // Drag
            this.setSpeed(this.v*(1-this.PHYSICS.DRAG_COEFFICIENT*dt));
        }
        /* Azimuth, elevation update */ {
            this.setAzimuth  (this.dir.az.theta + this.v * this.dir.az.curvature * dt);
            this.setElevation(this.dir.el.theta + this.v * this.dir.el.curvature * dt);
            this.setElevation(Math.min(Math.max(this.dir.el.theta, -this.dir.el.MAX_THETA), this.dir.el.MAX_THETA));
        }
        /* Position update */ {
            let v = this.getSpeedVector();
            let dr = vec3.create();
            vec3.scale(dr, v, dt);
            vec3.add(this.pos, this.pos, dr);
        }

        /* Flag time and speed update */
        this.shader_LinearMeasure -= dt * this.getRealSpeed();
        this.vehicle.flag.flagShader.setUniformsValues({linearMeasure: this.shader_LinearMeasure});
        this.vehicle.flag.flagShader.setUniformsValues({speed: this.getRealSpeed()});
    }
    display() {
        this.scene.pushMatrix();{
            this.scene.translate(this.pos[0], this.pos[1], this.pos[2]);
            this.scene.rotate(this.dir.az.theta, 0, 1, 0);
            this.scene.rotate(this.dir.el.theta, -1, 0, 0);
            
            this.scene.scale(this.scaleFactor, this.scaleFactor, this.scaleFactor);

            this.vehicle.display();
        }this.scene.popMatrix();
    }
}
