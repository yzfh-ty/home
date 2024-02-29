/**
 * Starry Sky
 * 
 * ����: DoWake
 * ������ʹ��Canvas�����ǿ�
 * ��ַ��https://github.com/DoWake/StarrySky
 * ���ڣ�2023/03/02
 */

const StarrySky = function () {
    //CanvasԪ��
    let canvasElement;
    //Canvas 2D����
    let canvasContext;
    //Canvas ���
    let canvasWidth;
    //Canvas �߶�
    let canvasHeight;
    //�����б�
    let starList;
    //������ɫ�б�rgb��ʽ��"255, 255, 255"
    let starColorList;
    //���ǰ뾶��С
    let starRadius;
    //����ȼ�����canvasWidth��ˣ��������0
    let focalDistanceLevel;
    //���������ȼ�����canvasWidth��ˣ��������0
    let starCountLevel;
    //�����ٶȵȼ����뽹����ˣ��������0
    let starSpeedLevel;
    //����
    let focalDistance;
    //��������
    let starCount;
    //ִ�ж���
    let rAF;
    return {
        //��ʼ��
        init: function (canvas_element) {
            if (canvas_element && canvas_element.nodeName === "CANVAS") {
                canvasElement = canvas_element;
                canvasElement.width = canvasElement.clientWidth;
                canvasElement.height = canvasElement.clientHeight;
                canvasElement.style.backgroundColor = "black";
                canvasContext = canvasElement.getContext("2d");
                canvasWidth = canvasElement.clientWidth;
                canvasHeight = canvasElement.clientHeight;
                starColorList = ["255, 255, 255"];
                starRadius = 1;
                focalDistanceLevel = 0.4;
                starCountLevel = 0.2;
                starSpeedLevel = 0.0005;
                focalDistance = canvasWidth * focalDistanceLevel;
                starCount = Math.ceil(canvasWidth * starCountLevel);
                starList = [];
                for (let i = 0; i < starCount; i++) {
                    starList[i] = {
                        x: canvasWidth * (0.1 + 0.8 * Math.random()),
                        y: canvasHeight * (0.1 + 0.8 * Math.random()),
                        z: focalDistance * Math.random(),
                        color: starColorList[Math.ceil(Math.random() * 1000) % starColorList.length]
                    }
                }
                const self = this;
                window.addEventListener("resize", self.throttle(function () {
                    canvasElement.width = canvasElement.clientWidth;
                    canvasElement.height = canvasElement.clientHeight;
                    canvasWidth = canvasElement.clientWidth;
                    canvasHeight = canvasElement.clientHeight;
                    focalDistance = canvasWidth * focalDistanceLevel;

                    const starCount2 = Math.ceil(canvasWidth * starCountLevel);
                    if (starCount > starCount2) {
                        starList.splice(starCount2);
                    } else {
                        let num = starCount2 - starCount;
                        while (num--) {
                            starList.push({
                                x: canvasWidth * (0.1 + 0.8 * Math.random()),
                                y: canvasHeight * (0.1 + 0.8 * Math.random()),
                                z: focalDistance * Math.random(),
                                color: starColorList[Math.ceil(Math.random() * 1000) % starColorList.length]
                            });
                        }
                    }
                    starCount = Math.ceil(canvasWidth * starCountLevel);
                }, 200));
            } else {
                console.error('��ʼ��ʧ�ܣ����봫��CanvasԪ��');
            }
        },
        //�����ǿձ�����ɫ
        setSkyColor: function (sky_color = "black") {
            canvasElement.style.backgroundColor = sky_color;
        },
        //�������ǰ뾶��С
        setStarRadius: function (star_radius = 1) {
            starRadius = star_radius;
        },
        //���ý���ȼ�
        setFocalDistanceLevel: function (focal_distance_level = 0.4) {
            focalDistanceLevel = focal_distance_level;
            focalDistance = canvasWidth * focalDistanceLevel
        },
        //�������������ȼ�
        setStarCountLevel: function (star_count_level = 0.2) {
            starCountLevel = star_count_level;
            const starCount2 = Math.ceil(canvasWidth * starCountLevel);
            if (starCount > starCount2) {
                starList.splice(starCount2);
            } else {
                let num = starCount2 - starCount;
                while (num--) {
                    starList.push({
                        x: canvasWidth * (0.1 + 0.8 * Math.random()),
                        y: canvasHeight * (0.1 + 0.8 * Math.random()),
                        z: focalDistance * Math.random(),
                        color: starColorList[Math.ceil(Math.random() * 1000) % starColorList.length]
                    });
                }
            }
            starCount = Math.ceil(canvasWidth * starCountLevel);
        },
        //���������ٶȵȼ�
        setStarSpeedLevel: function (star_speed_level = 0.0005) {
            starSpeedLevel = star_speed_level
        },
        /**
         * ����������ɫ
         * @param {Array|String} color ������ɫ
         * @param {Boolean} mode �Ƿ�����ͬ����ɫ
         */
        setStarColorList: function (color, mode = false) {
            if (typeof color === 'object') {
                starColorList = color;
            } else if (typeof color === 'string') {
                starColorList.push(color);
            }
            if (mode) {
                for (let i = 0; i < starList.length; i++) {
                    starList[i]["color"] = starColorList[Math.ceil(Math.random() * 1000) % starColorList.length];
                }
            }
        },
        //��Ⱦ
        render: function () {
            const starSpeed = canvasWidth * focalDistanceLevel * starSpeedLevel;
            //��ջ���
            canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
            //����λ��
            for (let i = 0; i < starList.length; i++) {
                const star = starList[i];
                const star_x = (star["x"] - canvasWidth / 2) * (focalDistance / star["z"]) + canvasWidth / 2;
                const star_y = (star["y"] - canvasHeight / 2) * (focalDistance / star["z"]) + canvasHeight / 2;
                star["z"] -= starSpeed;
                if (star["z"] > 0 && star["z"] <= focalDistance && star_x >= -20 && star_x <= canvasWidth + 20 && star_y >= -20 && star_y <= canvasHeight + 20) {
                    const star_radius = starRadius * (focalDistance / star["z"] * 0.8);
                    const star_opacity = 1 - 0.8 * (star["z"] / focalDistance);
                    canvasContext.fillStyle = "rgba(" + star["color"] + ", " + star_opacity + ")";
                    canvasContext.shadowOffsetX = 0;
                    canvasContext.shadowOffsetY = 0;
                    canvasContext.shadowColor = "rgb(" + star["color"] + ")";
                    canvasContext.shadowBlur = 10;
                    canvasContext.beginPath();
                    canvasContext.arc(star_x, star_y, star_radius, 0, 2 * Math.PI);
                    canvasContext.fill();
                } else {
                    const z = focalDistance * Math.random();
                    star["x"] = canvasWidth * (0.1 + 0.8 * Math.random());
                    star["y"] = canvasHeight * (0.1 + 0.8 * Math.random());
                    star["z"] = z;
                    star["color"] = starColorList[Math.ceil(Math.random() * 1000) % starColorList.length];
                }
            }
            const self = this;
            rAF = window.requestAnimationFrame(function () {
                self.render();
            });
        },
        //����
        destroy: function () {
            window.cancelAnimationFrame(rAF);
            starList = [];
            canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
            canvasElement.width = 0;
            canvasElement.height = 0;
        },
        //����
        debounce: function (func, time = 200) {
            let timeId;
            return function () {
                if (timeId) {
                    clearTimeout(timeId);
                }
                timeId = setTimeout(function () {
                    func();
                }, time);
            }
        },
        //����
        throttle: function (func, time = 200) {
            let timeId = null;
            let pre = 0;
            return function () {
                if (Date.now() - pre > time) {
                    clearTimeout(timeId);
                    pre = Date.now();
                    func();
                } else {
                    timeId = setTimeout(func, time);
                }
            };
        }
    }
}();