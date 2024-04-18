<template>
    <Qalendar :events="events" :config="config" />
</template>


<script>
import { Qalendar } from "qalendar";
export default {
    name: "Calendar",
    components:{Qalendar},
    props:['events'],
    data() {
        return {
            config: {
                // see configuration section
                month: {
                    // Hide leading and trailing dates in the month view (defaults to true when not set)
                    showTrailingAndLeadingDates: false,
                },
                locale: this.$i18n.locale === 'en' ? 'en-EN' : 'fr-FR', // 'fr-FR'
                style: {
                    // When adding a custom font, please also set the fallback(s) yourself
                    fontFamily: 'Space Grotesk',
                },
                defaultMode: 'month',
            }
        }
    }
}
</script>
<style>
@import "qalendar/dist/style.css";
</style>