<script setup>
import { ref, watch } from "vue"

const props = defineProps({
    optionTitle: {
        type: String,
        default: 'Select an option'
    },
    optionList: {
        type: Array,
        required: true
    },
    required: {
        type: Boolean,
        default: false
    },
    disabledOptionIndex: {
        type: Array,
        default: []
    }
})

const emits = defineEmits(["optionSelect"])
const selectedIndex = ref(-1)

// function setDisable(optionIndex) {
//     if (typeof props.disabledOptionIndex === 'number') {
//         return optionIndex === props.disabledOptionIndex && optionIndex !== selectedIndex.value
//     } else if (Array.isArray(props.disabledOptionIndex)) {
//         return props.disabledOptionIndex.includes(optionIndex) && optionIndex !== selectedIndex.value
//     }
// }

const handleOptionSelect = ({ target: { value } }) => {
    selectedIndex.value = parseInt(value)
    emits('optionSelect', parseInt(value))
}

</script>

<template>
    <select @input="handleOptionSelect" :required="required" :class="{ 'opacity-80': selectedIndex === -1 }">
        <option disabled selected>{{ optionTitle }}</option>
        <option v-for="(option, index) in optionList" :value="index" :key="index" :disabled="disabledOptionIndex.includes(index) && index !== selectedIndex">{{ option }}</option>
    </select>
</template>


<style scoped>

</style>