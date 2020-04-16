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
        this.normals = [];
        this.texCoords = [];
        this.indices = [];

        const Ymin = 0;
        const Ymax = 1;

        // Vertices and normals
        const amp = 2*Math.PI;
        for (let i = 0; i <= this.slices; i++) {
            let phi = i*amp/this.slices
            let x   =  Math.cos(phi);
            let z   = -Math.sin(phi);
            this.vertices.push(x, Ymin, z); this.normals.push(x, 0, z); this.texCoords.push(i/this.slices, 1);
            this.vertices.push(x, Ymax, z); this.normals.push(x, 0, z); this.texCoords.push(i/this.slices, 0);
        }
        //Triangles
        for(let i = 0; i < this.slices; i++){
            this.indices.push(2*i+1, 2*i, 2*i+2);
            this.indices.push(2*i+1, 2*i+2, 2*i+3);            
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
