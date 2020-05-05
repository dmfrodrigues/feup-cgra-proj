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
    constructor(scene) {
        super(scene);
        this.state = this.SupplyStates.INACTIVE;
        this.PHYSICS = {
            SPEED: 2
        };
        this.reset();
        this.initObjects();
    }
    reset(){
        this.update_prevtime = undefined;
    }
    initObjects(){
        this.obj = {};
        this.obj[this.SupplyStates.INACTIVE] = undefined;
        this.obj[this.SupplyStates.FALLING ] = new ClosedCrate(this.scene);
        this.obj[this.SupplyStates.LANDED  ] = new OpenCrate(this.scene);
    }
    setPos(pos){
        this.pos = pos;
    }
    drop(pos){
        this.state = this.SupplyStates.FALLING;
        this.setPos(pos);
    }
    land(){
        return (this.pos.y < 0);
    }
    update(t){
        t = t/1000;

        if(this.update_prevtime == undefined) this.update_prevtime = t;
        let Dt = t - this.update_prevtime;
        if(this.state == this.SupplyStates.FALLING){
            let dr = this.PHYSICS.SPEED * Dt;
            let dx = 0;
            let dy = -dr;
            let dz = 0;
            this.pos.x += dx;
            this.pos.y += dy;
            this.pos.z += dz;
            this.update_prevtime = t;

            if(this.land()){
                this.pos.y = 0;
                this.state = this.SupplyStates.LANDED;
            }
        }
    }
    display(){
        this.scene.pushMatrix(); {
            this.scene.translate(this.pos.x, this.pos.y, this.pos.z);
            if(this.obj[this.state] != undefined) this.obj[this.state].display();
        } this.scene.popMatrix();
    }
}