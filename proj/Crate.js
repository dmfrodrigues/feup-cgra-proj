class ClosedCrate extends CGFobject {
    /**
     * @method constructor
     * @param  {CGFscene} scene - MyScene object
     */
    constructor(scene) {
        super(scene);
        this.initBuffers();
        this.initMaterials();
    }
    initBuffers() {
        this.vertices = [
            +0.5, 0, +0.5,
            +0.5, 1, +0.5,
            -0.5, 1, +0.5,
            -0.5, 0, +0.5,
            +0.5, 0, -0.5,
            +0.5, 1, -0.5,
            +0.5, 1, +0.5,
            +0.5, 0, +0.5,
            -0.5, 0, -0.5,
            -0.5, 1, -0.5,
            +0.5, 1, -0.5,
            +0.5, 0, -0.5,
            -0.5, 0, +0.5,
            -0.5, 1, +0.5,
            -0.5, 1, -0.5,
            -0.5, 0, -0.5,
            -0.5, 0, -0.5,
            +0.5, 0, -0.5,
            +0.5, 0, +0.5,
            -0.5, 0, +0.5,
            +0.5, 1, -0.5,
            -0.5, 1, -0.5,
            -0.5, 1, +0.5,
            +0.5, 1, +0.5
        ];

        this.normals = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0
        ];
        
        this.texCoords = [
            1/4, 2/3,
            1/4, 1/3,
            0/4, 1/3,
            0/4, 2/3,
            2/4, 2/3,
            2/4, 1/3,
            1/4, 1/3,
            1/4, 2/3,
            3/4, 2/3,
            3/4, 1/3,
            2/4, 1/3,
            2/4, 2/3,
            4/4, 2/3,
            4/4, 1/3,
            3/4, 1/3,
            3/4, 2/3,
            2/4, 3/3,
            2/4, 2/3,
            1/4, 2/3,
            1/4, 3/3,
            2/4, 1/3,
            2/4, 0/3,
            1/4, 0/3,
            1/4, 1/3
        ];
        
        this.indices = [
            0, 1, 2,
            2, 3, 0,
            4, 5, 6,
            6, 7, 4,
            8, 9, 10,
            10, 11, 8,
            12, 13, 14,
            14, 15, 12,
            16, 17, 18,
            18, 19, 16,
            20, 21, 22,
            22, 23, 20
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
    initMaterials(){
        this.PATHS = {
            CRATE: "images/crate/crate.png"
        };

        this.materials = {};
        this.materials.crate = new CGFappearance(this.scene);
        this.materials.crate.setAmbient(0.6, 0.6, 0.6, 1);
        this.materials.crate.setDiffuse(0.6, 0.6, 0.6, 1);
        this.materials.crate.setSpecular(0.05, 0.05, 0.05, 1);
        this.materials.crate.setShininess(1.0);
        this.materials.crate.loadTexture(this.PATHS.CRATE);
        this.materials.crate.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');
    }
    display(){
        this.materials.crate.apply();
        super.display();
    }
}

class OpenCrate extends CGFobject {
    /**
     * @method constructor
     * @param  {CGFscene} scene - MyScene object
     */
    constructor(scene) {
        super(scene);
        this.THETA = 60*Math.PI/180;
        this.ABOVE_GROUND = 0.01;
        this.initBuffers();
        this.initMaterials();
    }
    initBuffers() {
        let s = Math.sin(this.THETA);
        let c = Math.cos(this.THETA);
        this.vertices = [
            +0.5    , this.ABOVE_GROUND+0  , +0.5,
            +0.5    , this.ABOVE_GROUND+1*c, +0.5+1*s,
            -0.5    , this.ABOVE_GROUND+1*c, +0.5+1*s,
            -0.5    , this.ABOVE_GROUND+0  , +0.5,
            +0.5    , this.ABOVE_GROUND+0  , -0.5,
            +0.5+1*s, this.ABOVE_GROUND+1*c, -0.5,
            +0.5+1*s, this.ABOVE_GROUND+1*c, +0.5,
            +0.5    , this.ABOVE_GROUND+0  , +0.5,
            -0.5    , this.ABOVE_GROUND+0  , -0.5,
            -0.5    , this.ABOVE_GROUND+1*c, -0.5-1*s,
            +0.5    , this.ABOVE_GROUND+1*c, -0.5-1*s,
            +0.5    , this.ABOVE_GROUND+0  , -0.5,
            -0.5    , this.ABOVE_GROUND+0  , +0.5,
            -0.5-1*s, this.ABOVE_GROUND+1*c, +0.5,
            -0.5-1*s, this.ABOVE_GROUND+1*c, -0.5,
            -0.5    , this.ABOVE_GROUND+0  , -0.5,
            -0.5    , this.ABOVE_GROUND+0  , -0.5,
            +0.5    , this.ABOVE_GROUND+0  , -0.5,
            +0.5    , this.ABOVE_GROUND+0  , +0.5,
            -0.5    , this.ABOVE_GROUND+0  , +0.5
        ];
        let N1 = this.vertices.length/3;
        this.vertices = this.vertices.concat(this.vertices);

        this.normals = [
            +0, -s, +c,
            +0, -s, +c,
            +0, -s, +c,
            +0, -s, +c,
            +c, -s, +0,
            +c, -s, +0,
            +c, -s, +0,
            +c, -s, +0,
            +0, -s, -c,
            +0, -s, -c,
            +0, -s, -c,
            +0, -s, -c,
            -c, -s, +0,
            -c, -s, +0,
            -c, -s, +0,
            -c, -s, +0,
            +0, -1, +0,
            +0, -1, +0,
            +0, -1, +0,
            +0, -1, +0
        ];
        this.normals = this.normals.concat(this.normals.map(x => -x));
        
        this.texCoords = [
            1/4, 2/3,
            1/4, 1/3,
            0/4, 1/3,
            0/4, 2/3,
            2/4, 2/3,
            2/4, 1/3,
            1/4, 1/3,
            1/4, 2/3,
            3/4, 2/3,
            3/4, 1/3,
            2/4, 1/3,
            2/4, 2/3,
            4/4, 2/3,
            4/4, 1/3,
            3/4, 1/3,
            3/4, 2/3,
            2/4, 3/3,
            2/4, 2/3,
            1/4, 2/3,
            1/4, 3/3
        ];
        this.texCoords = this.texCoords.concat(this.texCoords);
        
        this.indices = [
            0, 1, 2,
            2, 3, 0,
            4, 5, 6,
            6, 7, 4,
            8, 9, 10,
            10, 11, 8,
            12, 13, 14,
            14, 15, 12,
            16, 17, 18,
            18, 19, 16
        ];
        let N2 = this.indices.length;
        for(let i = 0; i < N2; i += 3){
            this.indices.push(this.indices[i+2]+N1, this.indices[i+1]+N1, this.indices[i+0]+N1);
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
    initMaterials(){
        this.PATHS = {
            CRATE: "images/crate/crate.png"
        };

        this.materials = {};
        this.materials.crate = new CGFappearance(this.scene);
        this.materials.crate.setAmbient(0.6, 0.6, 0.6, 1);
        this.materials.crate.setDiffuse(0.6, 0.6, 0.6, 1);
        this.materials.crate.setSpecular(0.05, 0.05, 0.05, 1);
        this.materials.crate.setShininess(1.0);
        this.materials.crate.loadTexture(this.PATHS.CRATE);
        this.materials.crate.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');
    }
    display(){
        this.materials.crate.apply();
        super.display();
    }
}

