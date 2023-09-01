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
        container: document.querySelector('#scroll-section-0'),
        messageA: document.querySelector('#scroll-section-0 .main-message.a'),
        messageB: document.querySelector('#scroll-section-0 .main-message.b'),
        messageC: document.querySelector('#scroll-section-0 .main-message.c'),
        messageD: document.querySelector('#scroll-section-0 .main-message.d'),
      },
      values: {
        messageA_opacity: [0, 1] // 200, 900이어도 잘 작동함
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

    yOffSet = scrollY
    let totalScrollHeight = 0;
    for (let i = 0; i < sceneInfo.length; i++) {
      totalScrollHeight += sceneInfo[i].scrollHeight;
      if (totalScrollHeight >= yOffSet) {
        currentScene = i;
        break;
      }
    }
    document.body.setAttribute('id', `show-scene-${currentScene}`);
  }

  // function getFullScrollHeight() {
  //   prevScrollHeight = 0;
  //   for (let i = 0; i < sceneInfo.length; i++) {
  //     prevScrollHeight += sceneInfo[i].scrollHeight;
  //   }
  // }

  /* 스크롤의 비율을 구해서 CSS 스타일링 */
  function calcValues(values, currentYOffSet) {
    let rv;
    // 현재 씬(스크롤섹션)에서 스크롤된 범위를 비율로 구하기
    let scrollRatio = currentYOffSet / sceneInfo[currentScene].scrollHeight;
    rv = scrollRatio * (values[1] - values[0]) + values[0];
    return rv;
  }

  function playAnimation() {
    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values;
    const currentYOffset = yOffSet - prevScrollHeight;

    switch (currentScene) {
      case 0:
        // console.log('0 play');
        let messageA_opacity_in = calcValues(values.messageA_opacity, currentYOffset);
        objs.messageA.style.opacity = messageA_opacity_in;
        break;
      case 1:
        // console.log('1 play');
        break;
      case 2:
        // console.log('2 play');
        break;
      case 3:
        // console.log('3 play');
        break;
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
      document.body.setAttribute('id', `show-scene-${currentScene}`);
    }

    // 스크롤을 올리는 상황: 스크롤높이 < 이전 스크롤높이의 합
    if (yOffSet < prevScrollHeight) {
      // Safari에서 스크롤 Top에서 Bounce 효과일때 yOffSet을 -로 취급한다
      // 이런 경우를 방지하기 위해서 안전장치로 early return처리
      if (currentScene === 0) return;
      currentScene--;
      document.body.setAttribute('id', `show-scene-${currentScene}`);
    }

    playAnimation()
  }

  window.addEventListener('scroll', () => {
    yOffSet = window.scrollY;
    scrollLoop();
  });
  // window.addEventListener('DOMContentLoaded', setLayout);
  window.addEventListener('load', setLayout);
  window.addEventListener('resize', setLayout);

  setLayout();

})();
