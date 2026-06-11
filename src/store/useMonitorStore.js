import { create } from 'zustand'

const KEY = 'smarteye_monitor'

const load = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || {} } catch { return {} }
}
const persist = (data) => {
  try { localStorage.setItem(KEY, JSON.stringify(data)) } catch {}
}

const useMonitorStore = create((set, get) => {
  const { monitorOrder = [], monitorSizes = {} } = load()
  return {
    monitorOrder,   // [camId, ...] — 표시 순서
    monitorSizes,   // { [camId]: 1 | 2 | 4 } — 1=1×1, 2=2×1(와이드), 4=2×2(대형)

    setMonitorOrder: (order) => {
      persist({ monitorOrder: order, monitorSizes: get().monitorSizes })
      set({ monitorOrder: order })
    },

    toggleCamera: (id) => {
      const order = get().monitorOrder
      const next = order.includes(id) ? order.filter(x => x !== id) : [...order, id]
      persist({ monitorOrder: next, monitorSizes: get().monitorSizes })
      set({ monitorOrder: next })
    },

    setCameraSize: (id, size) => {
      const sizes = { ...get().monitorSizes, [id]: size }
      persist({ monitorOrder: get().monitorOrder, monitorSizes: sizes })
      set({ monitorSizes: sizes })
    },

    resetConfig: () => {
      persist({})
      set({ monitorOrder: [], monitorSizes: {} })
    },
  }
})

export default useMonitorStore
