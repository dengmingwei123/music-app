<template>
  <transition name='confirm-fade'>
    <div
      class='confirm'
      v-show='showFlag'
    >
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <p class='text'>{{ text }}</p>
          <div class="button">
            <div
              class="btn cancel"
              @click='cancel'
            >{{ cancelBtnText }}</div>
            <div
              class="btn empty"
              @click='confirm'
            >{{ confirmBtnText }}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    },
    confirmBtnText: {
      type: String,
      default: '确定'
    },
    cancelBtnText: {
      type: String,
      default: '取消'
    }
  },
  data() {
    return {
      showFlag: false
    }
  },
  methods: {
    show() {
      this.showFlag = true
    },
    hide() {
      this.showFlag = false
    },
    cancel() {
      this.hide()
      this.$emit('cancel')
    },
    confirm() {
      this.hide()
      this.$emit('confirm')
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable.styl';

.confirm {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 998;
  background: $color-background-d;

  &.confirm-fade-enter-active {
    animation: confirm-fadein 0.3s;

    .confirm-content {
      animation: confirm-zoom 0.3s;
    }
  }

  .confirm-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 999;

    .confirm-content {
      width: 270px;
      border-radius: 13px;
      background: $color-highlight-background;

      .text {
        padding: 19px 15px;
        line-height: 22px;
        text-align: center;
        color: $color-text-l;
        font-size: $font-size-large;
      }

      .button {
        display: flex;
        align-items: center;
        text-align: center;
        font-size: $font-size-large;
        border-top: 1px solid $color-background-d;

        .btn {
          flex: 1;
          line-height: 22px;
          padding: 10px 0;
          color: $color-text-d;

          &.cancel {
            border-right: 1px solid $color-background-d;
          }
        }
      }
    }
  }
}

@keyframes confirm-fadein {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes confirm-zoom {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}
</style>
