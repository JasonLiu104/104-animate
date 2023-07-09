/**
 * @class Pin
 * @param {Object} options
 * @param {String} options.pinWrapper - 要釘住的元素的父元素
 * @param {String} options.pinEl - 要釘住的元素
 * @param {Number} options.pinHeight - 要釘住的元素的高度(會影響滑動的時間)
 * @param {Function} options.onPinProgress - 釘住元素時的回調函式(回傳滾輪目前進度)
 * @example
 * new Pin({
 *  pinWrapper: '.pin-wrapper',
 *  pinEl: '.pin-el',
 *  pinHeight: 100,
 *  onPinProgress: (pinProgress) => {
 *  console.log(pinProgress)
 *  }
 * })
 */
class Pin {
    constructor ({
      pinWrapper,
      pinEl,
      pinHeight,
      onPinProgress,
    }) {
      this.pinWrapper = pinWrapper && document.querySelector(pinWrapper)
      this.pinHeight = pinHeight ? pinHeight : window.innerHeight
      this.pinEl = pinEl && document.querySelector(pinEl)
      this.pinElOriginHeight = pinEl && document.querySelector(pinEl).offsetHeight 
      this.pinWrapperHeight = this.pinHeight + this.pinElOriginHeight
      this.onPinProgress = onPinProgress 
      this.reset = this.reset.bind(this)
      this.init = this.init.bind(this)
      this.reset()
      window.addEventListener('scroll', this.init)
    }
    
    destroy () {
      this.pinEl.style = ''
      this.pinWrapper.style = ''
      window.removeEventListener('scroll', this.init)
    }
  
    reset () {
      this.pinWrapper.style = ` height: ${ this.pinWrapperHeight }px;`
      this.pinEl.style = ''
    }
  
    start () {
      const paddingBottom = `${ this.pinHeight }px`
  
      this.pinWrapper.style = `
        order: 0;
        place-self: auto;
        grid-area: auto / auto / auto / auto;
        z-index: auto;
        float: none;
        flex-shrink: 1;
        display: block;
        margin: 0px;
        inset: 0px;
        position: relative;
        flex-basis: auto;
        overflow: visible;
        box-sizing: border-box;
        height: ${ this.pinWrapperHeight }px;
        max-height: ${ this.pinWrapperHeight }px;
        padding: 0px 0px ${ paddingBottom };
      `
  
      this.pinEl.style = `
        transform: translate(0px, 0px);
        left: 0px;
        top: 0px;
        right: 0px;
        bottom: 0px;
        margin: 0px;
        height: ${ this.pinElOriginHeight }px;
        max-height: ${ this.pinElOriginHeight }px;
        box-sizing: border-box;
        position: fixed;
      `
    }
  
    end () {
      this.pinEl.style = `
        transform: translate(0px, ${ this.pinHeight }px);
        left: 0px;
        top: 0px;
        right: 0px;
        bottom: 0px;
        margin: 0px;
        box-sizing: border-box;
      `
    }
   
    calculatePinProgress () {
      // 取得 pinWrapper 的位置與高度
      const pinWrapperRect = this.pinWrapper.getBoundingClientRect()
      // 取得目前的滾動位置
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
      // 計算 pinWrapper 的頂部位置
      const pinStart = pinWrapperRect.top + scrollPosition
      // 計算 pinWrapper 的底部位置
      const pinEnd = pinStart + this.pinHeight
      // 計算目前位置在 pinWrapper 內的進度
      const pinProgress = Math.max(0, Math.min(100, ((scrollPosition - pinStart) / (pinEnd - pinStart)) * 100))
      // 回傳進度
      return pinProgress
    }
  
    init () {
      const pinProgress = this.calculatePinProgress()
      if (pinProgress === 0) {
        this.reset()
      } else if (pinProgress === 100) {
        this.end()
      } else {
        this.start()
      }
      if (typeof this.onPinProgress === 'function') {
        this.onPinProgress(pinProgress)
      }
    }
  }
  
  export { Pin }