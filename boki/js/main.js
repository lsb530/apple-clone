(() => {

  // window.scrollY(pageYOffset) 대신 쓸 변수
  let yOffSet = 0;

  // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
  let prevScrollHeight = 0;

  // 현재 활성화된(눈 앞에 보고있는) 씬(scroll-section)
  let currentScene = 0;

  // 새로운 scene이 시작된 순간: true
  let enterNewScene = false;

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
        // [200, 900]이어도 잘 작동함, start/end: 스크롤에 따른 애니메이션의 타이밍
        messageA_opacity: [0, 1, { start: 0.1, end: 0.2 }],
        messageB_opacity: [0, 1, { start: 0.3, end: 0.4 }]
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
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffSet / scrollHeight;

    if (values.length === 3) {
      // start ~ end 사이에 애니메이션 실행
      const partScrollStart = values[2].start * scrollHeight;
      const partScrollEnd = values[2].end * scrollHeight;
      const partScrollHeight = partScrollEnd - partScrollStart;

      // start/end 시점에 따른 애니메이션 처리

      /* START ~ END 스크롤 일때 */
      if (currentYOffSet >= partScrollStart && currentYOffSet <= partScrollEnd) {
        rv = (currentYOffSet - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
      }
      /* START 이전 스크롤 일때 */
      else if (currentYOffSet < partScrollStart) {
        rv = values[0];
      }
      /* END 이후 스크롤 일때 */
      else if (currentYOffSet > partScrollEnd) {
        rv = values[1];
      }
    } else {
      rv = scrollRatio * (values[1] - values[0]) + values[0];
    }
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
    enterNewScene = false;
    prevScrollHeight = 0;
    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }

    // 스크롤을 내리는 상황: 스크롤높이 > 이전 스크롤높이의 합 + 현재씬의 스크롤높이
    if (yOffSet > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      enterNewScene = true;
      currentScene++;
      document.body.setAttribute('id', `show-scene-${currentScene}`);
    }

    // 스크롤을 올리는 상황: 스크롤높이 < 이전 스크롤높이의 합
    if (yOffSet < prevScrollHeight) {
      // Safari에서 스크롤 Top에서 Bounce 효과일때 yOffSet을 -로 취급한다
      // 이런 경우를 방지하기 위해서 안전장치로 early return처리
      enterNewScene = true;
      if (currentScene === 0) return; // 브라우저 바운스 효과로 인해 마이너스가 되는 것을 방지
      currentScene--;
      document.body.setAttribute('id', `show-scene-${currentScene}`);
    }

    // 씬이 바뀔 때는 playAnimation이 동작 안하도록(음수값 회피)
    if (enterNewScene) return;

    playAnimation();
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
