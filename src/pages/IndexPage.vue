<template>
  <q-page class="column flex-center">

    <!-- Last session -->
    <q-card>
      <q-card-section class="row items-center justify-center text-uppercase">
        Last session weight
      </q-card-section>
      <q-card-section class="row items-center justify-center">
        {{ lastSessionWeight }} KG <q-icon :name="lastSessionSuccess ? 'arrow_upward' : 'arrow_downward'"
          :color="lastSessionSuccess ? 'positive' : 'negative'" />
      </q-card-section>
    </q-card>

    <!-- Height weight -->
    <p class="text-h6">
      Heaviest weight
    </p>
    <q-circular-progress show-value rounded :value="heaviestWeight * 10" size="200px" color="orange" class="q-ma-md">
      {{ heaviestWeight }}KG
    </q-circular-progress>

    <!-- Session list -->
    <p class="text-h6">
      Session list
    </p>
    <q-list bordered separator>
      <q-item v-for="session in sessionList" :key="session.id">
        <q-item-section>
          <q-item-label>{{ session.weight }}KG</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon :name="session.success === 'success' ? 'arrow_upward' : 'arrow_downward'"
            :color="session.success === 'success' ? 'positive' : 'negative'" />
        </q-item-section>
      </q-item>
    </q-list>

    <!-- Open dialog button -->
    <q-btn round @click="openDialog" icon="play_arrow" class="q-ma-md absolute-bottom-left" />

    <!-- Dialog -->
    <!-- <q-dialog v-model="displayDialog" full-height >
      <q-card>
        <q-card-section class="row items-center justify-center text-uppercase">
        </q-card-section>
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog> -->
    <q-dialog v-model="dialogDisplayed" full-width full-height>
      <q-card class="column full-height" style="width: 300px">
        <q-card-section full-width align="right">
          <q-btn flat round icon="close" v-close-popup />
        </q-card-section>
        <q-card-section v-if="!songEnded" class="column items-center" align="center">
          <q-circular-progress show-value rounded :value="timer" size="200px" color="orange" class="q-ma-md">
            <q-btn round @click="playSong" icon="play_arrow" class="" />
          </q-circular-progress>
          <q-btn @click="reset" outline round icon="refresh" class="q-ma-md" />
        </q-card-section>

        <q-card-section v-if="!songEnded" align="center">
          <p class="text-h6">
            {{ countDown }}
          </p>
        </q-card-section>
        <q-card-section v-if="!songEnded" align="center">
          <audio ref="audioPlayer" controls class="audio-control">
            <source :src="audioSrc" type="audio/mpeg">
          </audio>
        </q-card-section>

        <q-card-section v-if="songEnded" align="center">
          <p class="text-uppercase">Session weight</p>
          <q-input filled v-model="sessionWeight" type="number" />
        </q-card-section>
        <q-card-section v-if="songEnded" align="center">
          <q-btn @click="sessionResult('success')" icon="check" label="Success" class="q-ma-md " color="positive" />
          <q-btn @click="sessionResult('fail')" icon="close" label="Fail" class="q-ma-md" color="negative" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, onMounted, onUnmounted, ref } from 'vue'

export default defineComponent({
  name: 'IndexPage',

  setup() {
    const heaviestWeight = ref(0)
    const lastSessionWeight = ref(0)
    const lastSessionSuccess = ref(false)
    const sessionList = ref([])
    const dialogDisplayed = ref(false)
    const timer = ref(100)
    const audioPlayer = ref(null)
    const songLength = ref(null)
    const countDown = ref('03:25')
    const interval = ref()
    const songEnded = ref(false)
    const sessionWeight = ref(0)

    console.log(audioPlayer)

    const audioSrc = ref('/mp3/bring-sally-up.mp3')

    function openDialog() {
      console.log('openDialog')
      dialogDisplayed.value = true
      console.log(dialogDisplayed.value)
    }

    function playSong() {
      console.log('playSong')
      // songLength.value = Math.floor(audioPlayer.value.duration)
      songLength.value = Math.floor(2)
      console.log(songLength.value)
      audioPlayer.value.play();

      interval.value = setInterval(() => {

        const minutes = Math.floor(songLength.value / 60)
        const seconds = songLength.value - minutes * 60

        countDown.value = `${minutes}:${seconds}`
        if (seconds < 10) {
          countDown.value = `${minutes}:0${seconds}`
        }
        if (minutes < 10) {
          countDown.value = `0${minutes}:${seconds}`
        }
        if (seconds < 10 && minutes < 10) {
          countDown.value = `0${minutes}:0${seconds}`
        }
        if (songLength.value === 0) {
          reset()
          songEnded.value = true
          return
        }
        songLength.value -= 1
        timer.value = Math.floor((songLength.value / 205) * 100)

        console.log(timer.value, countDown.value)
      }, 1000)
    }

    function reset() {
      console.log('reset')
      audioPlayer.value.pause();
      audioPlayer.value.currentTime = 0;
      timer.value = 100
      countDown.value = '03:25'
      clearInterval(interval.value)
    }

    function sessionResult(result) {
      console.log('sessionResult')
      lastSessionWeight.value = sessionWeight.value
      lastSessionSuccess.value = result === 'success'

      sessionList.value.push({
        weight: sessionWeight.value,
        success: result,
      })
      if (lastSessionSuccess.value && sessionWeight.value > heaviestWeight.value) {
        heaviestWeight.value = sessionWeight.value
        localStorage.setItem('heaviestWeight', heaviestWeight.value)
      }
      localStorage.setItem('sessionList', JSON.stringify(sessionList.value))
      localStorage.setItem('lastSessionWeight', lastSessionWeight.value)
      localStorage.setItem('lastSessionSuccess', lastSessionSuccess.value)

      songEnded.value = false
      sessionWeight.value = 0
      dialogDisplayed.value = false
    }

    onMounted(() => {
      localStorage.getItem('heaviestWeight') ? heaviestWeight.value = localStorage.getItem('heaviestWeight') : heaviestWeight.value = 0
      localStorage.getItem('lastSessionWeight') ? lastSessionWeight.value = localStorage.getItem('lastSessionWeight') : lastSessionWeight.value = 0
      localStorage.getItem('lastSessionSuccess') ? lastSessionSuccess.value = localStorage.getItem('lastSessionSuccess') === 'true' : lastSessionSuccess.value = false
      localStorage.getItem('sessionList') ? sessionList.value = JSON.parse(localStorage.getItem('sessionList')) : sessionList.value = []

    })

    onUnmounted(() => {
      // audioPlayer.value.pause();
      timer.value = 100
      countDown.value = '00:00'
    })

    return {
      heaviestWeight,
      lastSessionWeight,
      lastSessionSuccess,
      sessionList,
      // dialogDisplayed: true,
      dialogDisplayed,
      timer,
      audioSrc,
      audioPlayer,
      // songLength,
      countDown,
      // interval,
      songEnded,
      sessionWeight,

      openDialog,
      playSong,
      reset,
      sessionResult,
    }
  }
})
</script>
<style lang="scss" scoped>
.audio-control {
  display: none;
}
</style>
