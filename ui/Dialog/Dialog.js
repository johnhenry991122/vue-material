import popup from '../internal/mixins/popup';
import { convertClass, getWidth } from '../utils';

export default {
  name: 'mu-dialog',
  mixins: [popup],
  props: {
    dialogClass: [String, Array, Object],
    title: String,
    scrollable: Boolean,
    fullscreen: Boolean,
    width: [String, Number],
    maxWidth: [String, Number],
    transition: {
      type: String,
      default: 'scale',
      validator (val) {
        return ['slide-top', 'slide-bottom', 'slide-left', 'slide-right', 'fade', 'scale'];
      }
    }
  },
  mounted () {
    this.setMaxDialogContentHeight();
  },
  updated () {
    this.$nextTick(() => {
      this.setMaxDialogContentHeight();
    });
  },
  methods: {
    handleWrapperClick (e) {
      if (this.$el !== e.target) return;
      this.overlayClick(e);
    },
    setMaxDialogContentHeight () {
      const dialogEl = this.$refs.dialog;
      if (!dialogEl) return;
      if (!this.scrollable) {
        dialogEl.style.maxHeight = '';
        return;
      }

      let maxDialogContentHeight = window.innerHeight - 2 * 64;
      const { footer, title, elBody } = this.$refs;
      if (footer) maxDialogContentHeight -= footer.offsetHeight;
      if (title) maxDialogContentHeight -= title.offsetHeight;
      if (elBody) {
        let maxBodyHeight = maxDialogContentHeight;
        if (footer) maxBodyHeight -= footer.offsetHeight;
        if (title) maxBodyHeight -= title.offsetHeight;
        elBody.style.maxHeight = maxBodyHeight + 'px';
      }
      dialogEl.style.maxHeight = maxDialogContentHeight + 'px';
    }
  },
  watch: {
    open (newValue) {
      if (!newValue) return;
      this.$nextTick(() => {
        this.setMaxDialogContentHeight();
      });
    }
  },
  render (h) {
    const isShowTitle = this.title || (this.$slots.title && this.$slots.title.length > 0);
    const dialogTitle = isShowTitle ? h('div', {
      staticClass: 'mu-dialog-title',
      ref: 'title'
    }, this.$slots.title && this.slots.title.length > 0 ? this.slots.title : this.title) : undefined;

    const dialogBody = h('div', {
      staticClass: 'mu-dialog-body',
      ref: 'elBody'
    }, this.$slots.default);

    const dialogActions = this.$slots.actions && this.$slots.actions.length > 0 ? h('div', {
      staticClass: 'mu-dialog-actions',
      ref: 'footer'
    }, this.$slots.actions) : undefined;

    const data = {
      staticClass: 'mu-dialog ' + convertClass(this.dialogClass).join(' '),
      class: {
        'mu-dialog-fullscreen': this.fullscreen,
        'mu-dialog-scrollable': this.scrollable,
        [`mu-${this.transition}`]: true
      },
      ref: 'dialog'
    };

    if (!this.fullscreen) {
      data.style = {
        'max-width': this.maxWidth === 'auto' ? undefined : getWidth(this.maxWidth),
        'width': this.width === 'auto' ? undefined : getWidth(this.width)
      };
    }
    const dialog = h('div', data, [dialogTitle, dialogBody, dialogActions]);

    return this.open ? h('transition', {
      props: {
        name: `mu-dialog-transition`
      }
    }, [
      h('div', {
        staticClass: 'mu-dialog-wrapper',
        style: {
          'z-index': this.zIndex
        },
        on: {
          click: this.handleWrapperClick
        }
      }, [dialog])
    ]) : null;
  }
};
