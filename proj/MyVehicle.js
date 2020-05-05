/**
* MyVehicle
* @constructor
*/
class MyVehicle extends CGFobject {
    constructor(scene) {
        super(scene);
        this.scene = scene;
        this.reset();
        this.update_prevtime = [];
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
    setAcceleration(a){ this.pos.a = a; }
    accelerate(val){ this.setAcceleration(val); }
    // Getters
    getRealSpeed(){ return this.pos.v * this.speedFactor; }
    getDropPos(){ return {x: this.pos.x, y: this.pos.y-1, z: this.pos.z}; }
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
        }
        /* Azimuth, elevation update */ {
            this.dir.az.theta += this.pos.v * this.dir.az.curvature * dt;
            this.dir.el.theta += this.pos.v * this.dir.el.curvature * dt;
            this.dir.el.theta = Math.min(Math.max(this.dir.el.theta, -this.dir.el.MAX_THETA), this.dir.el.MAX_THETA);
        }
        /* Position update */ {
            let dr = this.getRealSpeed() * dt;
            let dx = + dr * Math.cos(this.dir.el.theta) * Math.sin(this.dir.az.theta);
            let dy = + dr * Math.sin(this.dir.el.theta);
            let dz = + dr * Math.cos(this.dir.el.theta) * Math.cos(this.dir.az.theta);
            this.pos.x += dx; 
            this.pos.y += dy;
            this.pos.z += dz;
        }
        /* Update previous time */
        this.update_prevtime = t;
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
