<script setup>
import { onMounted, ref } from "vue";
import { Pin } from "./pin";
const imgs = ref(null);

const calculate = (x) => {
  return 1 + (x - 1) * 0.25;
};

// 三次貝茲曲線函數，用於模擬 "ease-in" 效果
const cubicBezier = (t) => {
  return t * t * t;
};

onMounted(() => {
  new Pin({
    pinWrapper: ".pin-wrapper",
    pinEl: ".pin-el",
    pinHeight: window.innerHeight * 5,
    onPinProgress: (pinProgress) => {
      const totalImages = imgs.value.length;
      const progressPerImage = 100 / calculate(totalImages); // 每張圖片的動畫範圍
      const quarterProgressPerImage = progressPerImage / 4; // 每張圖片動畫的四分之一

      imgs.value.forEach((element, index) => {
        // 計算固定方向的位移值
        const distance = window.innerWidth; // 使用螢幕的寬度作為位移值，使圖片能移出螢幕
        // 根據 index 和進度條的進度計算輪流開始的偏移量
        const offset = (pinProgress / 100) * distance;

        // 根據 offset 和索引值決定移動方向
        let translateX = 0;
        let translateY = 0;
        let scale = 1;
        let opacity = 1;

        // 計算每張圖片的開始和結束點
        const start = index * quarterProgressPerImage; // 每張圖片在前一張圖片跑到四分之一的時候開始
        const end = start + progressPerImage; // 每張圖片在自己的範圍結束

        // 如果進度條還沒達到這張圖片的開始點，或已經超過結束點，則不進行變換
        if (pinProgress < start || pinProgress > end) {
          element.style.opacity = 0;
          return;
        }

        // 計算進度條在這張圖片的動畫範圍內的進度（0 到 1）
        const progressInRange = (pinProgress - start) / (end - start);
        // 使用三次貝茲曲線函數來調整進度，實現 "ease-in" 效果
        const easedProgress = cubicBezier(progressInRange);

        if (index % 4 === 0) {
          translateX = offset * easedProgress;
          translateY = -offset * easedProgress;
        }

        if (index % 4 === 1) {
          translateX = -offset * easedProgress;
          translateY = offset * easedProgress;
        }

        if (index % 4 === 2) {
          translateX = -offset * easedProgress;
          translateY = -offset * easedProgress;
        }

        if (index % 4 === 3) {
          translateX = offset * easedProgress;
          translateY = offset * easedProgress;
        }

        scale = easedProgress;
        opacity = Math.abs(1 - easedProgress); // 使用 Math.abs 函數來確保透明度始終為正數

        // 應用變換
        element.style.transform = `matrix(${scale}, 0, 0, ${scale}, ${translateX}, ${translateY})`;
        element.style.opacity = opacity;
      });
    },
  });
});
</script>

<template>
  <main>
    <section class="one">1</section>
    <section class="second">
      <div class="pin-wrapper">
        <div class="pin-el">
          <div class="img-container" v-for="n in 12" :key="n" ref="imgs">
            <img src="https://fakeimg.pl/300/" />
          </div>
        </div>
      </div>
    </section>
    <section class="third">3</section>
  </main>
</template>

<style lang="scss">
* {
  padding: 0;
  margin: 0;
}
.one,
.third {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.one {
  background-color: #ccc;
}
.second {
  background-color: #ff7b00;
}
.third {
  background-color: #fff700;
}

.pin-el {
  overflow: hidden;
  min-height: 100vh;
  .img-container {
    width: 300px;
    height: 300px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -150px;
    margin-top: -150px;
    opacity: 0;
  }
}
</style>
