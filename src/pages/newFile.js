import { defineComponent, onUnmounted, ref } from 'vue';

export default defineComponent({
name: 'IndexPage',

setup() {
const heaviestWeight = ref(30);
const lastSessionWeight = ref(0);
const lastSessionSuccess = ref(false);
const sessionList = ref([]);
const dialogDisplayed = ref(false);
const timer = ref(100);
const audioPlayer = ref(null);
const songLength = ref(205);
const countDown = ref('00:00');
const interval = ref();

console.log(audioPlayer);

const audioSrc = ref('/mp3/bring-sally-up.mp3');

function openDialog() {
console.log('openDialog');
dialogDisplayed.value = true;
console.log(dialogDisplayed.value);
}

function playSong() {
console.log('playSong');
audioPlayer.value.play();
interval.value = setInterval(() => {

songLength.value -= 1;
timer.value = Math.floor((songLength.value / 205) * 100);
countDown.value = new Date().getTime() + 205000;
console.log(timer.value, countDown.value);
}, 1000);
}

function reset() {
console.log('reset');
audioPlayer.value.pause();
timer.value = 100;
countDown.value = '00:00';
clearInterval(interval.value);
}

onUnmounted(() => {
audioPlayer.value.pause();
timer.value = 100;
countDown.value = '00:00';
});

return {
heaviestWeight,
lastSessionWeight,
lastSessionSuccess,
sessionList,
dialogDisplayed: true,
timer,
audioSrc,
audioPlayer,
// songLength,
countDown,

openDialog,
playSong,
reset,
};
}
});
