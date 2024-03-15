<script setup>
import { RouterView } from 'vue-router'
import BaseToast from '@/components/BaseToast.vue'
import Header from './components/Header.vue'
import PersonIcon from '@/assets/icons/personFill.svg?raw'
import GearIcon from '@/assets/icons/gearFill.svg?raw'
import BoxArrowLeftIcon from '@/assets/icons/boxArrowLeft.svg?raw'
</script>

<template>
  <BaseToast />
  <RouterView />
</template>
