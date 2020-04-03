class MyCylinder extends CGFobject {
    /**
     * @method constructor
     * @param  {CGFscene} scene - MyScene object
     * @param  {integer} slices - number of slices around Y axis
     */
    constructor(scene, slices) {
        super(scene);
        this.slices = slices;

        this.initBuffers();
    }

    /**
     * @method initBuffers
     * Initializes the sphere buffers
     * TODO: DEFINE TEXTURE COORDINATES
     */
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];

        const Ymin = 0;
        const Ymax = 1;

        // Vertices and normals
        const amp = 2*Math.PI;
        for (let i = 0; i < this.slices; i++) {
            let phi = i*amp/this.slices
            let x   =  Math.cos(phi);
            let z   = -Math.sin(phi);
            this.vertices.push(x, Ymin, z);
            this.vertices.push(x, Ymax, z);
            this.normals.push(x, 0, z);
            this.normals.push(x, 0, z);
        }
        //Triangles
        for(let i = 0; i < this.slices-1; i++){
            this.indices.push(2*i+1, 2*i, 2*i+2);
            this.indices.push(2*i+1, 2*i+2, 2*i+3);            
        }
        let i = this.slices-1;
        this.indices.push(2*i+1, 2*i, 0);
        this.indices.push(2*i+1, 0, 1);

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
