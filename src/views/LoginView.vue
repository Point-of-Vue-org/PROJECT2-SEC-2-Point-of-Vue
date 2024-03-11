<script setup>
import Logo from '@/components/Logo.vue'
</script>

<template>
  <main class="w-full h-screen grid place-items-center">
    <div class="flex flex-col">
      <div>
        <div class="text-primary mb-4">
          <Logo size="4rem" color="currentColor" />
        </div>
        <p class="text-2xl mb-2">Login to Plannet</p>
        <p>Welcome to a workspace that's secure, powerful, and <br>totally private.</p>
      </div>
      <div class="flex flex-col gap-5 mt-6 mb-4">
        <div>
        <label for="email"></label>
        <input type="text" id="email" placeholder="Email or username" 
        class="border border-neutral rounded-xl bg-neutral w-96 px-4 py-1">
      </div>
      <div>
        <label for="password"></label>
        <input type="text" id="password" placeholder="Password" 
        class="border border-neutral rounded-xl bg-neutral w-96 px-4 py-1">
      </div>
      <div>
        <button type="button" class="border border-accent rounded-2xl bg-accent w-96 px-4 py-1 text-base-100">Login</button>
      </div>
      </div>
      <div class="">
        <p class="text-primary"><a href="" class="text-primary">Forgot password?</a></p>
        <p>Don't have an account? <a href="" class="text-primary">Sign up</a></p>
      </div>
    </div>
  </main>
</template>
