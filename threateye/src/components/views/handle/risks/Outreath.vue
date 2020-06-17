<template>
  <div class="handle-outreach"
       v-cloak>
    <vm-handle-risks :threats="threats">
      <slot slot="name">
        <span>Top5 Outreach Threat Assets</span>
      </slot>
      <slot slot="types">
        <span>Top5 Outreach Threat Categories</span>
      </slot>
      <slot>
        <div class="outside-middle">
          <div class="osm-top">
            <img class="osm-img"
                 src="../../../../assets/images/handle/risks/edit.png">
            <span class="osm-title">Threat and Security Recommendations</span>
          </div>
          <div class="osm-middle">
            <dl>
              <dt class="osm-dt">Threat Description</dt>
              <dd class="osm-dd">An outreach threat is that attackers maintain contact with internal compromised assets to control the network or exfiltrate information. Attacks at this stage are usually disguised as regular network communications and traffic to avoid detection.</dd>
            </dl>
            <dl>
              <dt class="osm-dt">Security Recommendations</dt>
              <dd class="osm-dd">
                <ul>
                  <li>1. Update patches in time, especially the first few days of critical vulnerability released is a high incidence period of advanced attacks;</li>
                  <li>2. Use security gateway and endpoint security for defense-in-depth;</li>
                  <li>3. Use threat intelligence to identify C&C servers and other high-risk outreach actions;</li>
                  <li>4. Enhance threat detection and response capabilities of networks and endpoints on top of solid security defenses.</li>
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
import { eventBus } from '@/components/common/eventBus.js';
export default {
  name: 'handle-outreach',
  data () {
    return {
      threats: 'outreachthreat'
    };
  },
  components: { VmHandleRisks },
  created () {
    this.check_passwd();
  },
  methods: {
    // 测试密码过期
    check_passwd () {
      this.$axios.get('/yiiapi/site/check-passwd-reset')
        .then((resp) => {
          let {
            status,
            msg,
            data
          } = resp.data;
          if (status == '602') {
            this.$message(
              {
                message: msg,
                type: 'warning',
              }
            );
            eventBus.$emit('reset')
          }
        })
    }
  }
};
</script>

<style scoped lang="less">
</style>

