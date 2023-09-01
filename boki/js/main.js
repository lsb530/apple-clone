(() => {

  // window.scrollY(pageYOffset) 대신 쓸 변수
  let yOffSet = 0;

  // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
  let prevScrollHeight = 0;

  // 현재 활성화된(눈 앞에 보고있는) 씬(scroll-section)
  let currentScene = 0;

  const sceneInfo = [
    {
      // 0
      type: 'sticky',
      heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-0')
      }
    },
    {
      // 1
      type: 'normal',
      heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-1')
      }
    },
    {
      // 2
      type: 'sticky',
      heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-2')
      }
    },
    {
      // 3
      type: 'sticky',
      heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-3')
      }
    },
  ];

  function setLayout() {
    // 각 스크롤 섹션의 높이 세팅
    for (let i = 0; i < sceneInfo.length; i++) {
      sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
      sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
    }
  }
  function getFullScrollHeight() {
    prevScrollHeight = 0;
    for (let i = 0; i < sceneInfo.length; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }
  }
  function scrollLoop() {
    prevScrollHeight = 0;
    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }

    // 스크롤을 내리는 상황: 스크롤높이 > 이전 스크롤높이의 합 + 현재씬의 스크롤높이
    if (yOffSet > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      currentScene++;
    }

    // 스크롤을 올리는 상황: 스크롤높이 < 이전 스크롤높이의 합
    if (yOffSet < prevScrollHeight) {
      // Safari에서 스크롤 Top에서 Bounce 효과일때 yOffSet을 -로 취급한다
      // 이런 경우를 방지하기 위해서 안전장치로 early return처리
      if (currentScene === 0) return;
      currentScene--;
    }

    document.body.setAttribute('id', `show-scene-${currentScene}`);

    console.info('currentScene', currentScene);
  }

  window.addEventListener('resize', setLayout);
  window.addEventListener('scroll', () => {
    yOffSet = window.scrollY;
    scrollLoop();
  })

  setLayout();

})();
