<template>
  <div v-if="isLoading">
    Loading . . . 
  </div>
  <button v-else-if="likeCount === 0" @click="likePost">Like Counter</button>

  <button v-else @click="likePost">
    Likes <span>{{ likeCount }}</span>
  </button>

  
</template>

<script lang="ts" setup>
  import confetti from 'canvas-confetti';
  import { ref, watch } from 'vue';
  import debounce from 'lodash.debounce';
  
  interface Props {
    postSlug: string;
  }

  const props = defineProps<Props>();

  const likeCount = ref(0);
  const likeClicks = ref(0);
  const isLoading = ref(true);

  watch(likeCount, debounce(() => {
    fetch(`/api/posts/likes/${props.postSlug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ likes: likeClicks.value }),
    });

    likeClicks.value = 0;
  }, 500));

  const likePost = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: {
        x: Math.random(),
        y: Math.random() - 0.2,
      },
    });
    likeCount.value++;
    likeClicks.value++;
  };

  const getCurrentLikes = async () => {
    const response = await fetch(`/api/posts/likes/${props.postSlug}`);
    if(!response.ok) return;

    const data = await response.json();
    likeCount.value = data.likes;
    isLoading.value = false;
  };

  getCurrentLikes();
</script>

<style scoped>
  button {
    background-color: #5e51bc;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;
    animation: fade-in 0.5s;
  }

  button:hover {
    background-color: #4a3f9a;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>