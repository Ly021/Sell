const EVENT_SHOW = 'show'
const EVENT_HIDE = 'hide'

export default {
    data() {
        return {
          visible: false
        }
      },
      methods: {
        show() {
          this.visible = true
        //   visible要先设置，然后再派发设置，避免派发错误
          this.$emit(EVENT_SHOW)
        },
        hide() {
          this.visible = false
          this.$emit(EVENT_HIDE)
        }
      }
}
