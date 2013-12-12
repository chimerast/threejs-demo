/**
 * @author chimerast
 */

THREE.RaphaelRenderer = function () {

    console.log('THREE.RaphaelRenderer', THREE.REVISION);

    var _projector = new THREE.Projector();
    var _paper;

    var _raphaelWidth, _raphaelHeight, _raphaelWidthHalf, _raphaelHeightHalf;

    var _clipBox = new THREE.Box2();
    var _elemBox = new THREE.Box2();

    this.autoClear = true;

    this.setSize = function (width, height) {
        _raphaelWidth = width;
        _raphaelHeight = height;
        _raphaelWidthHalf = _raphaelWidth / 2;
        _raphaelHeightHalf = _raphaelHeight / 2;

        _paper = Raphael(0, 0, width, height);
        _paper.setViewBox(-_raphaelWidthHalf, -_raphaelHeightHalf, _raphaelWidth, _raphaelWidth);

        _clipBox.min.set(-_raphaelWidthHalf, -_raphaelHeightHalf);
        _clipBox.max.set(_raphaelWidthHalf, _raphaelHeightHalf);
    };

    this.clear = function () {
        _paper.clear();
    };

    this.render = function (scene, camera) {

        if (this.autoClear === true) this.clear();

        var renderData = _projector.projectScene(scene, camera, true, true);
        var elements = renderData.elements;

        for (var e = 0, el = elements.length; e < el; e++) {

            var element = elements[ e ];
            var material = element.material;

            if (element instanceof THREE.RenderableFace3) {
                var v1 = element.v1.positionScreen;
                var v2 = element.v2.positionScreen;
                var v3 = element.v3.positionScreen;

                v1.x *= _raphaelWidthHalf;
                v1.y *= -_raphaelHeightHalf;
                v2.x *= _raphaelWidthHalf;
                v2.y *= -_raphaelHeightHalf;
                v3.x *= _raphaelWidthHalf;
                v3.y *= -_raphaelHeightHalf;


                _elemBox.setFromPoints([v1, v2, v3]);

                if (_clipBox.isIntersectionBox(_elemBox)) {
                    renderFace3(v1, v2, v3, element, material);
                }
            } else if (element instanceof THREE.RenderableFace4) {
                var v1 = element.v1.positionScreen;
                var v2 = element.v2.positionScreen;
                var v3 = element.v3.positionScreen;
                var v4 = element.v4.positionScreen;

                v1.x *= _raphaelWidthHalf;
                v1.y *= -_raphaelHeightHalf;
                v2.x *= _raphaelWidthHalf;
                v2.y *= -_raphaelHeightHalf;
                v3.x *= _raphaelWidthHalf;
                v3.y *= -_raphaelHeightHalf;
                v4.x *= _raphaelWidthHalf;
                v4.y *= -_raphaelHeightHalf;

                _elemBox.setFromPoints([v1, v2, v3, v4]);

                if (_clipBox.isIntersectionBox(_elemBox)) {
                    renderFace3(v1, v2, v4, element, material);
                    renderFace3(v2, v3, v4, element, material);
                }
            }
        }
    };

    function renderFace3(v1, v2, v3, element, material) {

        if (v1.z < -1 || v1.z > 1 || v2.z < -1 || v2.z > 1 || v3.z < -1 || v3.z > 1) return;

        var color = new THREE.Color();

        if (material instanceof THREE.MeshBasicMaterial ||
            material instanceof THREE.MeshLambertMaterial ||
            material instanceof THREE.MeshPhongMaterial) {
            color.copy(material.color);
            if (material.vertexColors === THREE.FaceColors) {
                color.multiply(element.color);
            }
        } else if (material instanceof THREE.MeshDepthMaterial) {
            var w = 1 - ( material.__2near / (material.__farPlusNear - element.z * material.__farMinusNear) );
            color.setRGB(w, w, w);
        } else if (material instanceof THREE.MeshNormalMaterial) {
            var normal = element.normalModelView;
            color.setRGB(normal.x, normal.y, normal.z).multiplyScalar(0.5).addScalar(0.5);
        }

        var path = _paper.path("M" + v1.x + " " + v1.y + "L" + v2.x + " " + v2.y + "L" + v3.x + " " + v3.y + "Z");

        path.attr({
            "stroke-width": 1,
            "fill": color.getStyle(),
            "fill-opacity": material.opacity
        });
    };
};
