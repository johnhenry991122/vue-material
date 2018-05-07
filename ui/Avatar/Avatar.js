import { getColor, getWidth } from '../utils';
import color from '../internal/mixins/color';

export default {
  name: 'mu-avatar',
  mixins: [color],
  props: {
    textColor: String,
    size: {
      type: [Number, String],
      default: 48
    }
  },
  render (h) {
    const size = getWidth(this.size);
    return h('div', {
      staticClass: `mu-avatar ${this.getColorClass()} ${this.getTextColorClass()}`,
      style: {
        width: size,
        height: size,
        'font-size': this.size / 2 + 'px',
        'background-color': getColor(this.color),
        'color': getColor(this.textColor)
      },
      on: this.$listeners
    }, [h('div', { class: 'mu-avatar-inner' }, this.$slots.default)]);
  }
};
