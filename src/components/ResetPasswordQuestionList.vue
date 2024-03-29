<script setup>
import BaseSelectOption from './BaseSelectOption.vue';
const emits = defineEmits(['questionSelect'])

const props = defineProps({
    questionTitle: {
        type: String,
        required: true
    },
    disabledQuestionIndex: {
        type: [Number, Array],
        default: []
    }
})

const securityQuestions = [
    "What is the name of your first pet?",
    "In which city were you born?",
    "What is the maiden name of your mother?",
    "What was the name of your elementary school?",
    "What is your favorite book?",
    "What is the name of your favorite childhood friend?",
    "What is the make and model of your first car?",
    "What is your favorite movie?",
    "What is the name of the street you grew up on?",
    "What is your favorite food?",
    "What is the name of your favorite teacher?",
    "What is the name of the first company you worked for?"
];

const handleQuestionSelect = (value) => {
    console.log(value)
    emits('questionSelect', value)
}

</script>

<template>
    <BaseSelectOption
        :optionTitle="questionTitle"
        :optionList="securityQuestions"
        @optionSelect="handleQuestionSelect"
        :required="true"
        :disabledOptionIndex="disabledQuestionIndex"
    />
</template>

<style scoped>

</style>