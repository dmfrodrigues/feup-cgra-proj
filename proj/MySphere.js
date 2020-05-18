class MySphere extends CGFobject {
    /**
     * @method constructor
     * @param  {CGFscene} scene - MyScene object
     * @param  {integer} slices - number of slices around Y axis
     * @param  {integer} stacks - number of stacks along Y axis, from the center to the poles (half of sphere)
     */
    constructor(scene, slices, stacks, scale) {
        super(scene);
        this.latDivs = stacks * 2;
        this.longDivs = slices;

        this.scale = scale;

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
        this.texCoords = [];

        var phiInc = Math.PI / this.latDivs;
        var thetaInc = (2 * Math.PI) / this.longDivs;
        var latVertices = this.longDivs + 1;

        const minS = 0;
        const maxS = 1;
        const minT = 0;
        const maxT = 1;
        const incS = (maxS - minS) / this.longDivs;
        const incT = (maxT - minT) / this.latDivs;

        for (let lat = 0; lat <= this.latDivs; lat++) {
            const el = Math.PI * lat/this.latDivs;
            for (let lon = 0; lon <= this.longDivs; lon++) {
                const az = 2 * Math.PI * lon/this.longDivs;
                //--- Vertices coordinates
                var x = this.scale[0] * Math.sin(el) * Math.cos(+az);
                var y = this.scale[1] * Math.cos(el);
                var z = this.scale[2] * Math.sin(el) * Math.sin(-az);
                this.vertices.push(x, y, z);
                //--- Normals
                const a = this.scale[0];
                const b = this.scale[1];
                const c = this.scale[2];
                let n = {
                    x: x/(a*a),
                    y: y/(b*b),
                    z: z/(c*c)
                };
                let r = Math.sqrt(n.x*n.x + n.y*n.y + n.z*n.z)
                this.normals.push(n.x/r, n.y/r, n.z/r);
                //--- Texture coordinates
                this.texCoords.push(minS + lon * incS, minT + lat * incT);
                //--- Indices
                if (lat < this.latDivs && lon < this.longDivs) {
                    var current = lat * latVertices + lon;
                    var next = current + latVertices;
                    // pushing two triangles using indices from this round (current, current+1)
                    // and the ones directly south (next, next+1)
                    // (i.e. one full round of slices ahead)

                    this.indices.push(current + 1, current, next);
                    this.indices.push(current + 1, next, next + 1);
                }
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
