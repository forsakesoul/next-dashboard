'use client'

import { useEffect } from 'react'
import Head from 'next/head'

export default function BeautiPage() {
  useEffect(() => {
    // 将所有 JavaScript 逻辑移到 useEffect 中
    const videoPlayer = document.getElementById('videoPlayer') as HTMLVideoElement
    const preloadPlayer = document.getElementById('preloadPlayer') as HTMLVideoElement
    const videoContainer = document.getElementById('videoContainer')
    const videoWrapper = document.getElementById('videoWrapper')
    const reloadBtn = document.getElementById('reloadBtn')
    const toggleMuteBtn = document.getElementById('toggleMuteBtn')
    const autoPlayBtn = document.getElementById('autoPlayBtn')
    const loading = document.getElementById('loading')
    const progressContainer = document.getElementById('progressContainer')
    const progressBar = document.getElementById('progressBar')
    const controlsOverlay = document.getElementById('controlsOverlay')
    const swipeHint = document.getElementById('swipeHint')

    // 自动连播状态
    let autoPlayEnabled = false
    let isPreloading = false
    let preloadedVideoUrl: string | null = null
    let controlsTimeout: NodeJS.Timeout | null = null
    let currentApiIndex = -1
    let touchStartY = 0
    let touchEndY = 0
    let isSwiping = false

    // API端点数组
    const API_URLS = [
      'http://api.xingchenfu.xyz/API/hssp.php',
      'http://api.xingchenfu.xyz/API/wmsc.php',
      'http://api.xingchenfu.xyz/API/ommn.php',
      'http://api.xingchenfu.xyz/API/tianmei.php',
      'http://api.xingchenfu.xyz/API/cdxl.php',
      'http://api.xingchenfu.xyz/API/yzxl.php',
      'http://api.xingchenfu.xyz/API/rwsp.php',
      'http://api.xingchenfu.xyz/API/nvgao.php',
      'http://api.xingchenfu.xyz/API/nvda.php',
      'http://api.xingchenfu.xyz/API/ndym.php',
      'http://api.xingchenfu.xyz/API/bsxl.php',
      'http://api.xingchenfu.xyz/API/zzxjj.php',
      'http://api.xingchenfu.xyz/API/jk.php'
    ]

    let retryAttempts = 0
    const MAX_RETRIES = 5
    let retryTimer: NodeJS.Timeout | null = null

    // 随机选择一个API
    function getRandomAPI() {
      let newIndex
      do {
        newIndex = Math.floor(Math.random() * API_URLS.length)
      } while (newIndex === currentApiIndex && API_URLS.length > 1)

      currentApiIndex = newIndex
      return API_URLS[currentApiIndex] + '?t=' + new Date().getTime()
    }

    // 清除重试计时器
    function clearRetryTimer() {
      if (retryTimer) {
        clearTimeout(retryTimer)
        retryTimer = null
      }
    }

    // 显示加载状态
    function showLoading() {
      if (loading) loading.style.display = 'flex'
      if (videoPlayer) videoPlayer.style.display = 'none'
    }

    // 隐藏加载状态
    function hideLoading() {
      if (loading) loading.style.display = 'none'
      if (videoPlayer) videoPlayer.style.display = 'block'
    }

    // 更新预加载进度
    function updatePreloadProgress() {
      if (preloadPlayer && preloadPlayer.buffered.length > 0 && progressBar) {
        const buffered = preloadPlayer.buffered.end(0)
        const duration = preloadPlayer.duration
        if (duration > 0) {
          const percent = (buffered / duration) * 100
          progressBar.style.width = percent + '%'
        }
      }
    }

    // 移除预加载事件监听器
    function removePreloadEventListeners() {
      if (preloadPlayer) {
        preloadPlayer.removeEventListener('progress', updatePreloadProgress)
        preloadPlayer.removeEventListener('canplaythrough', preloadCompleteHandler)
        preloadPlayer.removeEventListener('error', preloadErrorHandler)
      }
    }

    // 预加载完成处理函数
    function preloadCompleteHandler() {
      if (progressContainer) progressContainer.style.display = 'none'
      isPreloading = false
      console.log('下一个视频预加载完成')
      removePreloadEventListeners()
    }

    // 预加载错误处理函数
    function preloadErrorHandler() {
      if (progressContainer) progressContainer.style.display = 'none'
      isPreloading = false
      console.error('预加载视频失败')
      removePreloadEventListeners()
    }

    // 显示控制按钮
    function showControls() {
      if (controlsTimeout) clearTimeout(controlsTimeout)
      if (controlsOverlay) controlsOverlay.classList.add('visible')

      controlsTimeout = setTimeout(() => {
        if (controlsOverlay) controlsOverlay.classList.remove('visible')
      }, 3000)
    }

    // 预加载下一个视频
    function preloadNextVideo() {
      if (isPreloading) return

      isPreloading = true
      const preloadUrl = getRandomAPI()
      preloadedVideoUrl = preloadUrl

      if (progressContainer && progressBar) {
        progressContainer.style.display = 'block'
        progressBar.style.width = '0%'
      }

      if (preloadPlayer) {
        preloadPlayer.src = ''
        preloadPlayer.load()
        preloadPlayer.src = preloadUrl
        preloadPlayer.load()

        preloadPlayer.addEventListener('progress', updatePreloadProgress)
        preloadPlayer.addEventListener('canplaythrough', preloadCompleteHandler)
        preloadPlayer.addEventListener('error', preloadErrorHandler)
      }
    }

    // 清理视频资源
    function cleanupVideoResources() {
      if (videoPlayer) {
        videoPlayer.pause()
        videoPlayer.src = ''
        videoPlayer.load()
        videoPlayer.onloadedmetadata = null
        videoPlayer.onerror = null
      }
    }

    // 切换到预加载的视频
    function switchToPreloadedVideo() {
      if (!preloadedVideoUrl) {
        loadVideo()
        return
      }

      cleanupVideoResources()
      showLoading()

      if (videoPlayer) {
        videoPlayer.src = preloadedVideoUrl
        preloadedVideoUrl = null

        videoPlayer.onloadedmetadata = function() {
          videoPlayer.play().catch(e => console.error('播放错误:', e))
          hideLoading()

          if (autoPlayEnabled) {
            setTimeout(preloadNextVideo, 1000)
          }
        }

        videoPlayer.onerror = function() {
          loadVideo()
        }
      }
    }

    // 加载视频函数
    function loadVideo() {
      clearRetryTimer()
      cleanupVideoResources()
      showLoading()

      const selectedAPI = getRandomAPI()

      if (videoPlayer) {
        videoPlayer.src = selectedAPI
        videoPlayer.loop = !autoPlayEnabled
      }

      if (autoPlayEnabled) {
        setTimeout(preloadNextVideo, 1000)
      }
    }

    // 错误处理函数
    function handleVideoError() {
      retryAttempts++

      if (retryAttempts <= MAX_RETRIES) {
        retryTimer = setTimeout(() => {
          loadVideo()
        }, 1000)
      } else {
        retryAttempts = 0
        loadVideo()
      }
    }

    // 按钮点击反馈效果
    function addButtonFeedback(button: HTMLElement) {
      button.classList.add('active-state')
      setTimeout(() => {
        button.classList.remove('active-state')
      }, 200)
    }

    // 添加触摸事件处理函数
    function addTouchListeners() {
      const buttons = document.querySelectorAll('button')

      buttons.forEach(button => {
        button.addEventListener('touchstart', function(e) {
          e.stopPropagation()
          this.classList.add('active-state')
        }, {passive: true})

        button.addEventListener('touchend', function(e) {
          e.stopPropagation()
          e.preventDefault()
          this.classList.remove('active-state')
          this.click()
        }, {passive: false})

        button.addEventListener('touchcancel', function() {
          this.classList.remove('active-state')
        })
      })

      // 添加滑动检测
      if (videoWrapper) {
        videoWrapper.addEventListener('touchstart', function(e) {
          touchStartY = e.changedTouches[0].screenY
          isSwiping = false
        }, {passive: true})

        videoWrapper.addEventListener('touchmove', function(e) {
          isSwiping = true
        }, {passive: true})

        videoWrapper.addEventListener('touchend', function(e) {
          if (!isSwiping) return

          touchEndY = e.changedTouches[0].screenY
          handleSwipe()
        }, {passive: true})
      }
    }

    // 处理滑动动作
    function handleSwipe() {
      const swipeDistance = touchEndY - touchStartY
      const swipeThreshold = 100

      if (swipeDistance < -swipeThreshold) {
        if (preloadedVideoUrl) {
          switchToPreloadedVideo()
        } else {
          loadVideo()
        }
      }
    }

    // 初始设置
    function init() {
      if (videoPlayer) {
        videoPlayer.controls = false
      }

      loadVideo()
      addTouchListeners()

      if (swipeHint) {
        swipeHint.style.display = 'block'
        setTimeout(() => {
          swipeHint.style.display = 'none'
        }, 3000)
      }
    }

    // 初始化
    init()

    // 事件监听器设置
    if (videoPlayer) {
      videoPlayer.addEventListener('loadedmetadata', function() {
        hideLoading()
        retryAttempts = 0
        videoPlayer.play().catch(e => {
          console.error('自动播放失败:', e)
        })
      })

      videoPlayer.addEventListener('play', function() {
        if (controlsOverlay) controlsOverlay.classList.remove('visible')
      })

      videoPlayer.addEventListener('pause', function() {
        showControls()
      })

      videoPlayer.addEventListener('ended', function() {
        if (autoPlayEnabled) {
          switchToPreloadedVideo()
        } else {
          showControls()
        }
      })

      videoPlayer.addEventListener('error', function() {
        handleVideoError()
      })
    }

    // 点击视频事件
    if (videoWrapper) {
      videoWrapper.addEventListener('click', function(e) {
        if (e.target === videoPlayer && videoPlayer) {
          if (videoPlayer.paused) {
            videoPlayer.play()
          } else {
            videoPlayer.pause()
          }
        }
        showControls()
      })
    }

    // 按钮事件
    if (reloadBtn) {
      reloadBtn.addEventListener('click', function() {
        addButtonFeedback(this)
        if (preloadedVideoUrl) {
          switchToPreloadedVideo()
        } else {
          loadVideo()
        }
      })
    }

    if (autoPlayBtn) {
      autoPlayBtn.addEventListener('click', function() {
        addButtonFeedback(this)
        autoPlayEnabled = !autoPlayEnabled
        autoPlayBtn.textContent = autoPlayEnabled ? '关闭连播' : '自动连播'

        if (autoPlayEnabled) {
          autoPlayBtn.classList.add('auto-play-enabled')
        } else {
          autoPlayBtn.classList.remove('auto-play-enabled')
        }

        if (videoPlayer) {
          videoPlayer.loop = !autoPlayEnabled
        }

        if (autoPlayEnabled && !isPreloading && !preloadedVideoUrl) {
          preloadNextVideo()
        } else if (!autoPlayEnabled && preloadPlayer) {
          preloadedVideoUrl = null
          preloadPlayer.src = ''
          preloadPlayer.load()
          removePreloadEventListeners()
        }
      })
    }

    if (toggleMuteBtn && videoPlayer) {
      toggleMuteBtn.addEventListener('click', function() {
        addButtonFeedback(this)
        videoPlayer.muted = !videoPlayer.muted
        toggleMuteBtn.textContent = videoPlayer.muted ? '取消静音' : '开启静音'
      })
    }

    // 移动端特定事件处理
    if ('ontouchstart' in window) {
      const buttons = document.querySelectorAll('button')
      buttons.forEach(btn => {
        btn.addEventListener('touchstart', function() {
          ;(this as HTMLElement).style.opacity = '0.8'
        })

        btn.addEventListener('touchend', function() {
          ;(this as HTMLElement).style.opacity = '1'
        })
      })
    }
  }, [])

  return (
    <>
      <Head>
        <title>随机小姐姐视频</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
        }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #000;
          color: white;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0;
          overflow: hidden;
          touch-action: manipulation;
        }

        .player-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100vh;
          position: relative;
        }

        .video-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: #000;
        }

        .video-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        video {
          background: #000;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hide-controls::-webkit-media-controls {
          display: none !important;
        }

        .hide-controls::-webkit-media-controls-panel {
          display: none !important;
        }

        .hide-controls::-webkit-media-controls-play-button {
          display: none !important;
        }

        .hide-controls::-webkit-media-controls-start-playback-button {
          display: none !important;
        }

        .controls-overlay {
          position: absolute;
          bottom: 20px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          z-index: 20;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .controls-overlay.visible {
          opacity: 1;
        }

        .controls {
          display: flex;
          gap: 15px;
          background: rgba(0, 0, 0, 0.5);
          padding: 12px 20px;
          border-radius: 30px;
          backdrop-filter: blur(10px);
        }

        button {
          background-color: #d11a2d;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 50px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: bold;
          transition: all 0.3s ease;
          min-width: 100px;
          user-select: none;
        }

        button:hover {
          background-color: #e62e42;
        }

        button:active, button.active-state {
          transform: scale(0.95);
          background-color: #b01525;
          transition: background-color 0.1s ease;
        }

        .auto-play-enabled {
          background: linear-gradient(to right, #4CAF50, #8BC34A);
        }

        .loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.85);
          z-index: 15;
          transition: opacity 0.3s ease;
        }

        .spinner {
          width: 60px;
          height: 60px;
          border: 5px solid rgba(209, 26, 45, 0.3);
          border-radius: 50%;
          border-top-color: #d11a2d;
          animation: spin 1s ease-in-out infinite;
          margin-bottom: 15px;
        }

        .loading-text {
          font-size: 1.2rem;
          color: #fff;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .progress-container {
          position: absolute;
          bottom: 10px;
          left: 10px;
          right: 10px;
          height: 5px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 5px;
          overflow: hidden;
          z-index: 15;
          display: none;
        }

        .progress-bar {
          height: 100%;
          width: 0%;
          background: #d11a2d;
          transition: width 0.3s ease;
        }

        .swipe-hint {
          position: absolute;
          bottom: 100px;
          left: 0;
          right: 0;
          text-align: center;
          color: rgba(255, 255, 255, 0.7);
          font-size: 16px;
          animation: fadeHint 3s infinite;
          z-index: 10;
          display: none;
        }

        @keyframes fadeHint {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        @media (min-width: 768px) {
          .player-container {
            max-width: 400px;
            height: 90vh;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
          }

          .video-container {
            border-radius: 12px;
          }
        }
      `}</style>

      <div className="player-container">
        <div className="video-container" id="videoContainer">
          <div className="loading" id="loading">
            <div className="spinner"></div>
            <div className="loading-text">加载中...</div>
          </div>
          <div className="progress-container" id="progressContainer">
            <div className="progress-bar" id="progressBar"></div>
          </div>
          <div className="swipe-hint" id="swipeHint">上滑切换下一个视频</div>
          <div className="video-wrapper" id="videoWrapper">
            <video id="videoPlayer" playsInline className="hide-controls" />
            <video id="preloadPlayer" style={{display: 'none'}} preload="auto" />
          </div>
        </div>

        <div className="controls-overlay" id="controlsOverlay">
          <div className="controls">
            <button id="autoPlayBtn">自动连播</button>
            <button id="reloadBtn">下个视频</button>
            <button id="toggleMuteBtn">开启静音</button>
          </div>
        </div>
      </div>
    </>
  )
}