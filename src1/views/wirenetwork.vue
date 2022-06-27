<template>
    <div class="wirenetwork next">
        <svg id="subway" xmlns="http://www.w3.org/2000/svg" version="1.1"></svg>
    </div>
</template>

<script>
var tctSubway = null

export default {
    name: 'wirenetwork',
    data () {
        return {
            
        }
    },
    created () {
        
    },
    mounted () {
        tctSubway = new tct_subway({
            tmpId: 'subway',
            fullload:true
        })
        tctSubway.listener('loaded', function() {
            // tctSubway.showLine(self.value);
            tctSubway.loadRateMultiply(tctSubway.getPosition('西直门'),tctSubway.getPosition('积水潭'),Number((Math.random(1)*100).toFixed(2)))
            tctSubway.loadRateMultiply(tctSubway.getPosition('积水潭'),tctSubway.getPosition('鼓楼大街'),Number((Math.random(1)*100).toFixed(2)))
            tctSubway.loadRateMultiply(tctSubway.getPosition('鼓楼大街'),tctSubway.getPosition('安定门'),Number((Math.random(1)*100).toFixed(2)))
            tctSubway.loadRateMultiply(tctSubway.getPosition('安定门'),tctSubway.getPosition('雍和宫'),Number((Math.random(1)*100).toFixed(2)))
            tctSubway.loadRateMultiply(tctSubway.getPosition('雍和宫'),tctSubway.getPosition('东直门'),Number((Math.random(1)*100).toFixed(2)))
            tctSubway.loadRateMultiply(tctSubway.getPosition('东直门'),tctSubway.getPosition('东四十条'),Number((Math.random(1)*100).toFixed(2)))
            tctSubway.loadRateMultiply(tctSubway.getPosition('东四十条'),tctSubway.getPosition('朝阳门'),Number((Math.random(1)*100).toFixed(2)))
            tctSubway.loadRateMultiply(tctSubway.getPosition('朝阳门'),tctSubway.getPosition('建国门'),Number((Math.random(1)*100).toFixed(2)))
            tctSubway.loadRateMultiply(tctSubway.getPosition('建国门'),tctSubway.getPosition('北京站'),Number((Math.random(1)*100).toFixed(2)))
            tctSubway.loadRateMultiply(tctSubway.getPosition('北京站'),tctSubway.getPosition('崇文门'),Number((Math.random(1)*100).toFixed(2)))
        })
    },
    methods:{
        
    }
}
</script>
<style scoped>
.wirenetwork{padding: 10px;}
#subway{width: 100%;height:calc(100vh - 76px);}
</style>
