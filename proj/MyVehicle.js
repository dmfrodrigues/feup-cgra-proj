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
        this.reset();
        this.update_prevtime = [];
        this.shader_LinearMeasure = 0;
        this.vehicle = new Airship(this.scene);
    }
    reset(){
        this.dir = {
            az: {
                theta: 0,
                curvature: 0
            },
            el: {
                theta: 0,
                curvature: 0,
                MAX_THETA: 20*Math.PI/180
            }
        };
        this.pos   = {
            x: 0,
            y: 10,
            z: 0,
            v: 0,
            a: 0
        };
        this.speedFactor = 1.0;
        this.scaleFactor = 1.0;
    }
    // Setters
    setSpeedFactor(speedFactor){ this.speedFactor = speedFactor; }
    setScaleFactor(scaleFactor){ this.scaleFactor = scaleFactor; }
    setAzimuthCurvature  (k){ this.dir.az.curvature = k; this.vehicle.setRudderAngle(this.dir.az.curvature/2); }
    setElevationCurvature(k){
        this.dir.el.curvature = k;
        this.vehicle.setElevatorAngle(-this.dir.el.curvature/2);
    }
    turn(val){ this.setAzimuthCurvature(val); }
    elevate(val){ this.setElevationCurvature(val); }
    setSpeed(speed){ this.pos.v = speed; this.vehicle.setSpeed(this.getRealSpeed()); }
    level(){ this.dir.el.theta = 0; }
    setAcceleration(a){ this.pos.a = a; }
    accelerate(val){ this.setAcceleration(val); }
    // Getters
    getRealSpeed(){ return this.pos.v * this.speedFactor; }
    getDropPos(){
        return {
            x: this.pos.x,
            y: this.pos.y-1, 
            z: this.pos.z
        };
    }
    getAboveCameraPos(){
        let ret = {
            x: this.pos.x-20*Math.sin(this.dir.az.theta), 
            y: this.pos.y+6, 
            z: this.pos.z-20*Math.cos(this.dir.az.theta)
        };
        return vec3.fromValues(ret.x, ret.y, ret.z);
    }
    getBehindCameraPos(){
        let ret = {
            x: this.pos.x-6 * Math.cos(this.dir.el.theta) * Math.sin(this.dir.az.theta), 
            y: this.pos.y-6 * Math.sin(this.dir.el.theta), 
            z: this.pos.z-6 * Math.cos(this.dir.el.theta) * Math.cos(this.dir.az.theta)
        };
        return vec3.fromValues(ret.x, ret.y, ret.z);
    }
    getCameraTarget(){
        let ret = {
            x: this.pos.x, 
            y: this.pos.y, 
            z: this.pos.z
        }; 
        return vec3.fromValues(ret.x, ret.y, ret.z);
    }
    getSpeedVector(){
        let v = this.getRealSpeed();
        return {
            x: v * Math.cos(this.dir.el.theta) * Math.sin(this.dir.az.theta),
            y: v * Math.sin(this.dir.el.theta),
            z: v * Math.cos(this.dir.el.theta) * Math.cos(this.dir.az.theta)
        };
    }
    // Other functions
    update(t){
        /* Pass t from milliseconds to seconds */
        t /= 1000;
        /* Time */
        let dt; {
            if(this.update_prevtime == []) this.update_prevtime = t;
            dt = t - this.update_prevtime;
        }
        /* Speed update */ {
            this.setSpeed(this.pos.v + this.pos.a * dt);
            // Drag
            this.setSpeed(this.pos.v*(1-this.PHYSICS.DRAG_COEFFICIENT*dt));
        }
        /* Azimuth, elevation update */ {
            this.dir.az.theta += this.pos.v * this.dir.az.curvature * dt;
            this.dir.el.theta += this.pos.v * this.dir.el.curvature * dt;
            this.dir.el.theta = Math.min(Math.max(this.dir.el.theta, -this.dir.el.MAX_THETA), this.dir.el.MAX_THETA);
        }
        /* Position update */ {
            let v = this.getSpeedVector();
            let dr = this.getRealSpeed() * dt;
            let dx = v.x * dt;
            let dy = v.y * dt;
            let dz = v.z * dt;
            this.pos.x += dx; 
            this.pos.y += dy;
            this.pos.z += dz;
        }
        /* Update previous time */
        this.update_prevtime = t;

        /* Flag time and speed update */
        this.shader_LinearMeasure += dt * this.getRealSpeed();
        console.log(this.shader_LinearMeasure);
        this.vehicle.flag.flagShader.setUniformsValues({linearMeasure: this.shader_LinearMeasure});
    }
    display() {
        this.scene.pushMatrix();{
            this.scene.translate(this.pos.x, this.pos.y, this.pos.z);
            this.scene.rotate(this.dir.az.theta, 0, 1, 0);
            this.scene.rotate(this.dir.el.theta, -1, 0, 0);
            
            this.scene.scale(this.scaleFactor, this.scaleFactor, this.scaleFactor);

            this.vehicle.display();
        }this.scene.popMatrix();
    }
}
