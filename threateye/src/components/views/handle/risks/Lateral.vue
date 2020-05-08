<template>
  <div class="handle-lateral" v-cloak>
   <vm-handle-risks :threats = "threats">
     <slot slot="name"><span>Top5 Lateral Movement Assets</span></slot>
     <slot slot="types"><span>Top5 Lateral Movement Categories</span></slot>
     <slot>
       <div class="outside-middle">
         <div class="osm-top">
           <img class="osm-img" src="../../../../assets/images/handle/risks/edit.png">
           <span class="osm-title">Threat and Security Recommendations</span>
         </div>
         <div class="osm-middle">
           <dl>
             <dt class="osm-dt">Threat Description</dt>
             <dd class="osm-dd">Lateral Movement refers to the internal network scanning, brute force, vulnerability exploitation, remote account login, remote program and command execution and other actions performed by the attacker in order to understand the network environment or find the target in the network.</dd>
           </dl>
           <dl>
             <dt class="osm-dt">Security Recommendations</dt>
             <dd class="osm-dd">
               <ul>
                 <li>1. Update patches in time, especially the first few days of critical vulnerability releases is a high incidence period of advanced attacks;</li>
                 <li>2. Deploy endpoint security solutions with multiple defense functions such as static analysis, dynamic analysis, anti-exploitation, host firewall, host IPS, etc;</li>
                 <li>3. Adopt Endpoint Detection and Response Solution (EDR) to greatly enhance the capability of threat detection and response on endpoints, including abnormal login of legitimate accounts, illegal use of tools provided by the system or used by administrators, etc;</li>
                 <li>4. Deploy network threat detection and response solutions for east-west traffic.</li>
               </ul>
             </dd>
           </dl>
         </div>
       </div>
     </slot>
   </vm-handle-risks>
  </div>
</template>

<script type="text/ecmascript-6">
  import VmHandleRisks from '../vm-handle/vm-handle-risks'
  export default {
    name: 'handle-lateral',
    data() {
      return {
        threats:'horizontalthreat'
      };
    },
    components:{VmHandleRisks}
  };
</script>

<style scoped lang="less">

</style>

