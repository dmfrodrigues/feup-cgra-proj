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
        this.pos = vec3.fromValues(0, 0, 0);
        this.vel = vec3.fromValues(0, 0, 0);
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
        return (this.pos[1] < 0);
    }
    update(t){
        t = t/1000;

        if(this.update_prevtime == undefined) this.update_prevtime = t;
        let Dt = t - this.update_prevtime;
        this.update_prevtime = t;
        if(this.state == this.SupplyStates.FALLING){
            //Gravity
            this.vel[1] -= this.PHYSICS.GRAVITIC_ACCELERATION * Dt;
            // Drag
            vec3.scale(this.vel, this.vel, 1 - this.PHYSICS.DRAG_COEFFICIENT * Dt);
            // Update positions
            let dr = vec3.create();
            vec3.scale(dr, this.vel, Dt);
            vec3.add(this.pos, this.pos, dr);

            if(this.land()){
                this.pos[1] = 0;
                this.vel = vec3.fromValues(0, 0, 0);
                this.state = this.SupplyStates.LANDED;
            }
        }
    }
    display(){
        if(this.obj[this.state] != undefined){
            this.scene.pushMatrix(); {
                this.scene.translate(this.pos[0], this.pos[1], this.pos[2]);
                this.obj[this.state].display();
            } this.scene.popMatrix();
        }
    }
}
