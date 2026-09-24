<script setup lang="ts">
import {
  customRef,
  effectScope,
  isProxy,
  isReactive,
  isReadonly,
  isRef,
  isShallow,
  markRaw,
  onScopeDispose,
  reactive,
  readonly,
  ref,
  shallowReactive,
  shallowReadonly,
  shallowRef,
  toRaw,
  toValue,
  unref,
  type EffectScope,
} from 'vue'
import DemoBlock from '@/components/ui/DemoBlock.vue'
import LabPage from '@/components/ui/LabPage.vue'

/**
 * customRef 的 get 里调用 track，set 里调用 trigger。
 * 读取次数放在普通变量中。如果在 get 里修改另一个 ref，渲染会反复触发 get。
 */
let reads = 0
let writes = 0
const report = ref('尚未采样')
const counted = customRef<string>((track, trigger) => {
  let current = '原始值'
  return {
    get() {
      track()
      reads += 1
      return current
    },
    set(next) {
      writes += 1
      current = next
      trigger()
    },
  }
})

function sampleCounted() {
  report.value = `读 ${reads} 次，写 ${writes} 次`
}

class ChartPainter {
  label: string
  constructor(label: string) {
    this.label = label
  }
  draw() {
    return `绘制${this.label}`
  }
}

/**
 * markRaw 给对象打上跳过响应式的标记。
 * 放进 reactive 之后，它仍然是原来的实例，适合图表、地图这类有私有状态的对象。
 * toRaw 从代理拿回被代理的原对象。
 */
const rawChart = markRaw(new ChartPainter('销量'))
const wrappedChart = reactive(new ChartPainter('库存'))
const holder = reactive({ rawChart, wrappedChart })

const plain = { n: 1 }
const deep = reactive({ n: 1 })
const shallow = shallowReactive({ n: 1 })
const locked = readonly(deep)
const lockedPlain = readonly({ n: 1 })
const shallowLocked = shallowReadonly({ n: 1 })
const count = ref(1)
const box = shallowRef({ n: 1 })
const getter = () => 3

const checks = [
  ['ref(1)', count],
  ['shallowRef', box],
  ['reactive', deep],
  ['shallowReactive', shallow],
  ['readonly(reactive)', locked],
  ['readonly(普通对象)', lockedPlain],
  ['shallowReadonly', shallowLocked],
  ['普通对象', plain],
] as const

function flags(value: object) {
  return [isRef(value), isReactive(value), isReadonly(value), isProxy(value), isShallow(value)]
}

/**
 * effectScope 把一组 computed / watch 收起来，一次 stop 全部清理。
 * 在点击回调里创建的 scope 不归当前组件管，所以离开页面前要自己 stop。
 * onScopeDispose 注册的回调会在 stop 时运行。
 */
const scopeText = ref('作用域还没启动')
let scope: EffectScope | undefined

function startScope() {
  scope?.stop()
  scope = effectScope()
  scope.run(() => {
    const local = ref(0)
    const timer = window.setInterval(() => {
      local.value += 1
      scopeText.value = `作用域内计数 ${local.value}`
    }, 400)
    onScopeDispose(() => {
      window.clearInterval(timer)
      scopeText.value = '作用域已停止，定时器已清理'
    })
  })
}

function stopScope() {
  scope?.stop()
}

onScopeDispose(() => scope?.stop())
</script>

<template>
  <LabPage>
    <DemoBlock
      title="customRef"
      scene="搜索框要防抖后再请求，或者 v-model 一边改一边写进本地草稿。什么时候通知页面更新，由你自己决定。"
      hint="输入会立刻写值；采样看到的读取次数来自模板对它的每次渲染。"
    >
      <label class="field">
        <span>自定义 ref</span>
        <input v-model="counted" type="text" />
      </label>
      <div class="row">
        <button type="button" @click="sampleCounted">采样</button>
        <span>{{ report }}</span>
      </div>
    </DemoBlock>

    <DemoBlock
      title="markRaw 与 toRaw"
      scene="ECharts、地图、Three.js 实例不能被 Vue 代理，否则方法和性能都会坏。提交接口前用 toRaw 拿回普通对象，去掉代理包装。"
      hint="被 markRaw 的实例放进 reactive 后仍然不是代理。toRaw 能拿回 holder 的原对象。"
    >
      <p>rawChart 是代理吗：{{ isReactive(holder.rawChart) ? '是' : '否' }}，{{ holder.rawChart.draw() }}</p>
      <p>直接 reactive 的类实例是代理吗：{{ isReactive(holder.wrappedChart) ? '是' : '否' }}，{{ holder.wrappedChart.draw() }}</p>
      <p>toRaw(holder) === 原对象：{{ toRaw(holder).rawChart === rawChart ? '是' : '否' }}</p>
    </DemoBlock>

    <DemoBlock
      title="判断函数"
      scene="通用组合式函数的参数可能是 ref、getter 或普通值，用 isRef 和 toValue 收成同一种读法。排查时也能确认一份数据是不是只读代理。"
      hint="readonly(reactive) 同时满足 isReadonly 和 isReactive。ref 本身不是 proxy。"
    >
      <table class="kv">
        <thead>
          <tr>
            <th>值</th>
            <th>isRef</th>
            <th>isReactive</th>
            <th>isReadonly</th>
            <th>isProxy</th>
            <th>isShallow</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="[label, value] in checks" :key="label">
            <td>{{ label }}</td>
            <td v-for="(flag, index) in flags(value)" :key="index">{{ flag ? '是' : '否' }}</td>
          </tr>
        </tbody>
      </table>
      <p>unref(getter) 的类型是 {{ typeof unref(getter) }}；toValue(getter) = {{ toValue(getter) }}</p>
    </DemoBlock>

    <DemoBlock
      title="effectScope"
      scene="命令面板、临时向导这种不挂在单个组件上的订阅。关掉面板时一次停掉里面的 watch 和定时器，不用逐个手动清。"
      hint="启动后数字会增加。停止或离开页面时，定时器通过 onScopeDispose 清掉。"
    >
      <p>{{ scopeText }}</p>
      <div class="row">
        <button type="button" @click="startScope">启动作用域</button>
        <button type="button" class="ghost" @click="stopScope">停止</button>
      </div>
    </DemoBlock>
  </LabPage>
</template>
