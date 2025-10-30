/**
 * 响应式设备检测 Hook
 * 用于移动端适配
 */

'use client'

import { useState, useEffect } from 'react'

export interface DeviceInfo {
  /** 是否为移动设备 */
  isMobile: boolean
  /** 是否为平板设备 */
  isTablet: boolean
  /** 是否为触摸设备 */
  isTouchDevice: boolean
  /** 是否为低端设备 */
  isLowEndDevice: boolean
  /** 屏幕宽度 */
  screenWidth: number
  /** 视口宽度 */
  viewportWidth: number
  /** 像素密度比 */
  pixelRatio: number
}

export interface ResponsiveSizes {
  /** 转盘尺寸 */
  wheelSize: number
  /** Canvas 实际渲染尺寸 */
  canvasSize: number
  /** 字体缩放比例 */
  fontScale: number
  /** 间距缩放比例 */
  spacingScale: number
}

/**
 * 获取设备信息
 */
export function useDeviceInfo(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isTouchDevice: false,
    isLowEndDevice: false,
    screenWidth: 0,
    viewportWidth: 0,
    pixelRatio: 1,
  })

  useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth
      const screenWidth = window.screen.width
      const pixelRatio = window.devicePixelRatio || 1

      // 检测移动设备
      const isMobile = width < 768
      const isTablet = width >= 768 && width < 1024

      // 检测触摸支持
      const isTouchDevice =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0

      // 检测低端设备 (基于 CPU 核心数和内存)
      const isLowEndDevice =
        (navigator.hardwareConcurrency || 4) <= 4 ||
        ((navigator as any).deviceMemory && (navigator as any).deviceMemory < 4)

      setDeviceInfo({
        isMobile,
        isTablet,
        isTouchDevice,
        isLowEndDevice,
        screenWidth,
        viewportWidth: width,
        pixelRatio,
      })
    }

    // 初始化
    updateDeviceInfo()

    // 监听窗口变化
    window.addEventListener('resize', updateDeviceInfo)
    window.addEventListener('orientationchange', updateDeviceInfo)

    return () => {
      window.removeEventListener('resize', updateDeviceInfo)
      window.removeEventListener('orientationchange', updateDeviceInfo)
    }
  }, [])

  return deviceInfo
}

/**
 * 计算响应式尺寸
 */
export function useResponsiveSizes(deviceInfo: DeviceInfo): ResponsiveSizes {
  const { viewportWidth, isMobile, isTablet } = deviceInfo

  // 转盘显示尺寸计算
  let wheelSize = 350 // 默认桌面端尺寸

  if (isMobile) {
    // 移动端: 屏幕宽度的 85%，最小 260px，最大 340px
    wheelSize = Math.max(260, Math.min(viewportWidth * 0.85, 340))
  } else if (isTablet) {
    // 平板: 固定 320px
    wheelSize = 320
  }

  // Canvas 实际渲染尺寸 (高分辨率优化)
  const canvasSize = Math.min(wheelSize * 1.5, 500)

  // 字体缩放比例
  const fontScale = isMobile ? 0.85 : 1

  // 间距缩放比例
  const spacingScale = isMobile ? 0.75 : 1

  return {
    wheelSize: Math.round(wheelSize),
    canvasSize: Math.round(canvasSize),
    fontScale,
    spacingScale,
  }
}

/**
 * 触觉反馈 (振动)
 */
export function triggerHapticFeedback(type: 'light' | 'medium' | 'heavy' = 'medium') {
  if (!('vibrate' in navigator)) return

  const patterns = {
    light: 10,
    medium: 20,
    heavy: 50,
  }

  try {
    navigator.vibrate(patterns[type])
  } catch (error) {
    // 静默失败
    console.debug('Haptic feedback not supported:', error)
  }
}
