(function (w) {
    function $(selector) {
        return selector.indexOf('#') >= 0 ? document.querySelector(selector) : document.querySelectorAll(selector);
    }
    var slider = {
        _property() {
            this.sliderBox = $('#slider');
            this.topBox = $('.slider-top-box')[0];
            this.images = $('.slider-top-box img');

        },
        //创建缩略图
        createThumbs() {
            this.sliderBox.innerHTML += `<div class="slider-thumbs-box"></div>`;
            this.thumbsBox = $('.slider-thumbs-box')[0];
            var thumbs = '',
                src;
            this.images.forEach(function (img) {
                src = img.getAttribute('src');
                thumbs += `<img src="${src}"/>`;
            });
            this.thumbsBox.innerHTML = thumbs;
            [].forEach.call(this.thumbsBox.children, (img) => {
                img.style.height = this.thumbsHeight;
            })
            this.smImgwidth = parseInt(w.getComputedStyle($('.slider-thumbs-box img')[0]).width);
            if (this.thumbs) this.currentThumb();
        },
        //当前缩略图
        currentThumb() {
            this.thumbsBox.style.width = this.smImgwidth * this.images.length + 'px';
            this.thumbsBox.style.transform = `translate(${(parseInt(this.imgWidth)-this.smImgwidth)/2-this.smImgwidth*(this.current-1)}px)`;
            [].forEach.call(this.thumbsBox.children, (img) => {
                img.className = '';
            })
            this.thumbsBox.children[this.current - 1].className = 'active';
        },
        //当前图片
        currentImg() {
            this._property();
            this.topBox.style.transform = `translate(${-parseInt(this.imgWidth)*(this.current-1)}px)`;
        },
        prevEvent() {
            clearInterval(this.timer);
            this._property();
            this.current--;
            if (this.current < 1) this.current = this.images.length;
            this.currentImg();
            if (this.thumbs) this.currentThumb();
            if (this.auto) this.autoPlay();
        },
        nextEvent() {
            clearInterval(this.timer);
            this._property();
            this.current++;
            if (this.current > this.images.length) this.current = 1;
            this.currentImg();
            if (this.thumbs) this.currentThumb();
            if (this.auto) this.autoPlay();
        },
        overEvent() {
            clearInterval(this.timer);
        },
        outEvent() {
            this.autoPlay();
        },
        moveEvent(e) {
            var e = e || w.event;
            if (e.target.parentNode.tagName === 'FIGURE') {
                var width = parseInt(this.imgWidth);
                var that = this;
                var box = this.sliderBox;

                var iX = e.clientX;
                var cha;
                document.onmousemove = function () {
                    var event = arguments[0] || w.event;
                    var jX = event.clientX;

                    document.onmouseup = () => {
                        cha = iX - jX;
                        cha > 0 ? that.current += Math.ceil(cha / width) : that.current += Math.floor(cha / width);
                        if (that.current < 1) that.current = 1;
                        if (that.current > that.images.length) that.current = that.images.length;
                        that.currentImg();
                        if (that.thumbs) that.currentThumb();
                        document.onmousemove = null;
                        document.onmouseup = null;
                    }
                    return false;
                }

            }

        },
        Thumbclick(e) {
            var e = e || event;
            var that = this;
            if (e.target.parentNode.tagName === 'DIV') {
                [].forEach.call(that.images, function (el, index) {
                    if (el.getAttribute('src') == e.target.getAttribute('src')) {
                        that.current = index + 1;
                        if (that.thumbs) that.currentThumb();
                        that.currentImg();
                    }
                })
            }
        },
        //自动轮播
        autoPlay() {
            this.timer = setInterval(() => {
                this._property();
                this.current++;
                if (this.current > this.images.length) this.current = 1;
                this.currentImg();
                if (this.thumbs) this.currentThumb();
            }, 3000)

        },
        init(opt) {
            var that = this;
            this._property();
            if (opt.current > this.images.length) throw Error('current Crossing the line');
            this.current = opt.current || 1;
            this.imgWidth = opt.imgWidth || '500px';
            this.thumbsHeight = opt.thumbsHeight || '80px';
            if (typeof opt.thumbs === 'undefined') {
                this.thumbs = true;
            } else {
                this.thumbs = false;
            }
            if (typeof opt.autoPlay === 'undefined') {
                this.auto = true;
            } else {
                this.auto = false;
            }
            this.sliderBox.style.width = this.imgWidth;
            this.topBox.style.width = (this.images.length) * parseInt(this.imgWidth) + 'px';
            [].forEach.call(this.images, function (item) {
                item.style.width = that.imgWidth;
            })
            this.currentImg();
            if (this.thumbs) this.createThumbs();
            if (this.auto) {
                this.autoPlay();
                this.sliderBox.onmouseover = () => {
                    this.overEvent()
                };
                this.sliderBox.onmouseout = () => {
                    this.outEvent()
                };
            }
            this.sliderBox.onmousedown = (e) => {
                this.moveEvent(e);
            };
            this.sliderBox.onclick = (e) => {
                this.Thumbclick(e);
            }
        }
    }
    w.slider = {
        init(opt) {
            slider.init(opt);
        },
        prev() {
            slider.prevEvent();
        },
        next() {
            slider.nextEvent();
        }
    }
})(window)