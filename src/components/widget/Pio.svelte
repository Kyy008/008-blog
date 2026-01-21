<script>
  import { onMount, onDestroy } from "svelte";
  import { pioConfig } from "@/config";

  let oml2dContainer;
  let idleTimer;
  let resetIdleTimer;
  let handleInteraction;

  onMount(async () => {
    if (!pioConfig.enable) return;
    if (pioConfig.hiddenOnMobile && window.matchMedia("(max-width: 1280px)").matches) return;
    
    // Check if the container is available
    if (!oml2dContainer) return;

    try {
      const { loadOml2d } = await import("oh-my-live2d");
      const oml2d = await loadOml2d({
        parentElement: oml2dContainer,
        models: [
          {
            path: pioConfig.models[0],
            scale: 0.15,
            position: [-170, -110],
            stageStyle: {
              height: 250,
              width: 250
            }
          }
        ],
        dockedPosition: pioConfig.position || 'left',
        mobileDisplay: !pioConfig.hiddenOnMobile,
        tips: {
          welcomeTips: {
            duration: 4000,
            priority: 3,
            message: {
              daybreak: '早上好！今天也要加油哦！',
              morning: '上午好！工作学习顺利吗？',
              noon: '中午了，午饭时间到了，要注意休息。',
              afternoon: '下午好！打起精神来，继续努力吧！',
              dusk: '傍晚了，窗外的夕阳很美呢。',
              night: '晚上好，今天过得怎么样？',
              lateNight: '已经很晚了，早点休息哦'
            }
          },
          // 禁用原生 idleTips，改为手动实现
          // idleTips: { ... }, 
          copyTips: {
            duration: 3000,
            priority: 3,
            message: ['复制了什么内容呢？']
          }
        }
      });

      // --- 自定义闲置检测逻辑 ---
      const idleMessages = [
        '好久没动了，是在发呆吗？',
        '你去哪里了呢...'
      ];
      
      resetIdleTimer = () => {
        if (idleTimer) clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
          const randomMsg = idleMessages[Math.floor(Math.random() * idleMessages.length)];
          if (oml2d && oml2d.tipsMessage) {
            oml2d.tipsMessage(randomMsg, 3000, 2);
          }
        }, 15000); // 10秒无操作触发
      };

      handleInteraction = () => {
        resetIdleTimer();
      };

      // 监听用户交互事件
      window.addEventListener('mousemove', handleInteraction);
      window.addEventListener('keydown', handleInteraction);
      window.addEventListener('click', handleInteraction);
      window.addEventListener('scroll', handleInteraction);

      // 初始化计时器
      resetIdleTimer();

      // --- Hover Actions ---
      const hoverActions = [
        { selector: 'a[href="/"]', text: '这里是首页哦~' },
        { selector: '.avatar', text: '这是博主的头像哦~' },
      ];

      setTimeout(() => {
        // 绑定 Hover 事件
        hoverActions.forEach(({ selector, text }) => {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => {
            el.addEventListener('mouseenter', () => {
              if (oml2d && oml2d.tipsMessage) {
                oml2d.tipsMessage(text, 3000, 3);
              }
            });
          });
        });

        // 绑定点击事件 (触摸提示)
        if (pioConfig.dialog?.touch && pioConfig.dialog.touch.length > 0) {
          // 获取 canvas 元素
          const canvas = oml2dContainer.querySelector('canvas');
          if (canvas) {
            canvas.addEventListener('click', (e) => {
               // 阻止点击事件冒泡，避免立即重置闲置计时器（虽然重置也没关系，但逻辑上区分开更好）
               e.stopPropagation(); 
               resetIdleTimer(); // 点击也是一种交互，应该重置计时器

               // 随机选择一条触摸提示
               const randomMsg = pioConfig.dialog.touch[Math.floor(Math.random() * pioConfig.dialog.touch.length)];
               if (oml2d && oml2d.tipsMessage) {
                 oml2d.tipsMessage(randomMsg, 3000, 4); 
               }
            });
            canvas.style.cursor = 'pointer';
          }
        }
      }, 1000);

    } catch (e) {
      console.error("oh-my-live2d initialization error:", e);
    }
  });

  onDestroy(() => {
    // 清理事件监听和定时器
    if (typeof window !== 'undefined' && handleInteraction) {
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
    }
    if (idleTimer) clearTimeout(idleTimer);
  });
</script>

<div bind:this={oml2dContainer} id="oml2d-container"></div>
