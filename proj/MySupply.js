class MySupply extends CGFobject {
    SupplyStates = {
        INACTIVE: 0,
        FALLING: 1,
        LANDED: 2
    };
    /**
     * @method constructor
     * @param  {CGFscene} scene - MyScene object
     */
    constructor(scene, scale) {
        super(scene);
        this.PHYSICS = {
            GRAVITIC_ACCELERATION: 5,
            DRAG_COEFFICIENT: 1.5
        };
        this.scale = scale;
        this.reset();
        this.initObjects();
    }
    reset(){
        this.state = this.SupplyStates.INACTIVE;
        this.pos = {
            x: 0,
            y: 0,
            z: 0
        };
        this.vel = {
            x: 0,
            y: 0,
            z: 0
        };
        this.update_prevtime = undefined;
    }
    initObjects(){
        this.obj = {};
        this.obj[this.SupplyStates.INACTIVE] = undefined;
        this.obj[this.SupplyStates.FALLING ] = new ClosedCrate(this.scene, this.scale);
        this.obj[this.SupplyStates.LANDED  ] = new OpenCrate(this.scene, this.scale);
    }
    drop(pos, vel){
        this.update_prevtime = undefined;
        this.state = this.SupplyStates.FALLING;
        this.pos = pos;
        this.vel = vel;
    }
    land(){
        return (this.pos.y < 0);
    }
    update(t){
        t = t/1000;

        if(this.update_prevtime == undefined) this.update_prevtime = t;
        let Dt = t - this.update_prevtime;
        if(this.state == this.SupplyStates.FALLING){
            //Gravity
            this.vel.y -= this.PHYSICS.GRAVITIC_ACCELERATION * Dt;
            // Drag
            this.vel.x *= (1 - this.PHYSICS.DRAG_COEFFICIENT * Dt);
            this.vel.y *= (1 - this.PHYSICS.DRAG_COEFFICIENT * Dt);
            this.vel.z *= (1 - this.PHYSICS.DRAG_COEFFICIENT * Dt);
            // Update positions
            this.pos.x += this.vel.x * Dt;
            this.pos.y += this.vel.y * Dt;
            this.pos.z += this.vel.z * Dt;
            this.update_prevtime = t;

            if(this.land()){
                this.pos.y = 0;
                this.vel = {
                    x: 0,
                    y: 0,
                    z: 0
                };
                this.state = this.SupplyStates.LANDED;
            }
        }
    }
    display(){
        if(this.obj[this.state] != undefined){
            this.scene.pushMatrix(); {
                this.scene.translate(this.pos.x, this.pos.y, this.pos.z);
                this.obj[this.state].display();
            } this.scene.popMatrix();
        }
    }
}
