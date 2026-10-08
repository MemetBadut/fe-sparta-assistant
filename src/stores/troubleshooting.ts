import { defineStore } from 'pinia'
import type { TroubleshootingResult } from '@/services/troubleshootingService'

export const useTroubleshootingStore = defineStore('troubleshooting', {
  state: () => ({ lastResult: null as TroubleshootingResult | null }),
  actions: {
    setResult(result: TroubleshootingResult) {
      this.lastResult = result
    },
    clear() {
      this.lastResult = null
    },
  },
})
